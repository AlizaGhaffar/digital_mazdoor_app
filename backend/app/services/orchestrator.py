import os
import json
from datetime import datetime
from typing import List, Dict, Any
from ..agents.base_agent import BaseAgent
from ..core.logging_config import dm_logger

class Orchestrator:
    """
    Manages the execution flow of multiple agents.
    Maintains a shared context (State) and aggregates reasoning traces.
    """
    def __init__(self):
        self.context: Dict[str, Any] = {}
        self.traces: List[Dict[str, Any]] = []
        self.agents: List[BaseAgent] = []

    def add_agent(self, agent: BaseAgent):
        """Register an agent in the pipeline."""
        self.agents.append(agent)

    async def run_workflow(self, initial_input: str, location_context: Dict = None):
        """Execute the full agentic workflow with dynamic routing."""
        workflow_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.context["workflow_id"] = workflow_id
        self.context["raw_input"] = initial_input
        self.context["device_location"] = location_context
        self.context["workflow_status"] = "STARTING"
        
        dm_logger.info(f"--- [WORKFLOW START: {workflow_id}] ---")
        dm_logger.info(f"Input: {initial_input}")

        # Always run Intent Agent first to determine the path
        intent_agent = next((a for a in self.agents if a.agent_id == "intent_agent"), None)
        if intent_agent:
            result = await intent_agent.run(self.context)
            self.context.update(result)
            self.traces.extend(intent_agent.get_trace())
        
        workflow_intent = self.context.get("intent", {}).get("workflow_intent", "NEW_BOOKING")
        dm_logger.info(f"Routed to pipeline: {workflow_intent}")

        # Check for unsupported service fallback
        intent_data = self.context.get("intent", {})
        if intent_data.get("service_type") == "UNSUPPORTED" or intent_data.get("is_ambiguous"):
            self.context["workflow_status"] = "UNSUPPORTED"
            self.context["fallback_response"] = intent_data.get("fallback_response", "Sorry, we cannot process this request at the moment.")
            dm_logger.info("Workflow halted due to unsupported or ambiguous service.")
            self._archive_workflow(workflow_id)
            return {
                "final_context": self.context,
                "all_traces": self.traces
            }

        # Define pipelines
        pipeline = []
        if workflow_intent == "NEW_BOOKING":
            pipeline = ["context_agent", "matching_agent", "ranking_agent", "scheduling_agent", "pricing_agent", "booking_agent", "notification_agent"]
        elif workflow_intent == "CANCELLATION":
            pipeline = ["booking_agent", "notification_agent"]
        elif workflow_intent == "DISPUTE":
            pipeline = ["dispute_agent", "notification_agent"]
        else:
            # Default fallback
            pipeline = ["context_agent", "notification_agent"]

        for agent_id in pipeline:
            # Skip intent_agent as it already ran
            if agent_id == "intent_agent": continue
            
            agent = next((a for a in self.agents if a.agent_id == agent_id), None)
            if not agent: continue

            try:
                dm_logger.info(f"Transitioning to: {agent_id}")
                result = await agent.run(self.context)
                self.context.update(result)
                
                # Collect traces
                self.traces.extend(agent.get_trace())
                
                # Check for critical failures in agent logic (e.g., Scheduling conflict)
                if self.context.get("workflow_status") == "RETRY_REQUIRED":
                    dm_logger.warning(f"Agent {agent_id} requested a retry/fallback due to: {self.context.get('last_error')}")
                    
                    if agent_id == "scheduling_agent" and self.context.get("last_error") == "PROVIDER_BUSY":
                        # Simple Fallback: Try the second best provider from the ranking list
                        ranked = self.context.get("ranked_providers", [])
                        if len(ranked) > 1:
                            dm_logger.info(f"Pivoting to second best provider: {ranked[1]['full_name']}")
                            self.context["top_match"] = ranked[1]
                            self.context["workflow_status"] = "Active" # Reset status
                            # Re-run scheduling for the new top_match
                            result = await agent.run(self.context)
                            self.context.update(result)
                            self.traces.extend(agent.get_trace())
                        else:
                            dm_logger.error("No alternative providers available.")
                            self.context["workflow_status"] = "Failed"
                            break
                
            except Exception as e:
                dm_logger.error(f"Error in agent {agent.agent_id}: {str(e)}", exc_info=True)
                self.context["workflow_status"] = "Failed"
                break

        # Archive workflow
        self._archive_workflow(workflow_id)
        
        dm_logger.info(f"--- [WORKFLOW END: {workflow_id} | Status: {self.context.get('workflow_status')}] ---")

        return {
            "final_context": self.context,
            "all_traces": self.traces
        }

    def _archive_workflow(self, workflow_id: str):
        """Saves the entire workflow state to a JSON file."""
        try:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
            archive_path = os.path.join(base_dir, "logs", "workflows", f"workflow_{workflow_id}.json")
            
            payload = {
                "workflow_id": workflow_id,
                "timestamp": datetime.now().isoformat(),
                "final_context": self.context,
                "all_traces": self.traces
            }
            
            with open(archive_path, "w") as f:
                json.dump(payload, f, indent=2)
                
            dm_logger.info(f"Workflow archived to: {archive_path}")
        except Exception as e:
            dm_logger.error(f"Failed to archive workflow: {str(e)}")
