from typing import Any, Dict
from .base_agent import BaseAgent

class ReliabilityAgent(BaseAgent):
    """
    Updates provider reliability and reputation scores based on job outcomes.
    """
    def __init__(self):
        super().__init__("reliability_agent")

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        provider = context.get("top_match")
        followup = context.get("followup", {})
        feedback = followup.get("feedback", {})
        reasoning = []
        
        if not provider or not feedback:
            return {"reliability_update": None}

        reasoning.append(f"Analyzing performance for {provider['full_name']}...")
        
        old_reliability = provider["reliability_score"]
        new_reliability = old_reliability
        
        if feedback.get("completion_status") == "success":
            new_reliability = min(100, old_reliability + 1)
            reasoning.append(f"Job successful. Incrementing reliability score: {old_reliability} -> {new_reliability}")
        elif feedback.get("completion_status") == "failed":
            new_reliability = max(0, old_reliability - 10)
            reasoning.append(f"Job failed/Cancelled. Decrementing reliability score: {old_reliability} -> {new_reliability}")

        decision = {
            "reliability_update": {
                "provider_id": provider["id"],
                "old_score": old_reliability,
                "new_score": new_reliability
            }
        }
        
        self._add_trace(reasoning, decision)
        return decision
