from typing import Any, Dict
from .base_agent import BaseAgent

class FollowupAgent(BaseAgent):
    """
    Automates post-service checks and feedback collection.
    """
    def __init__(self):
        super().__init__("followup_agent")

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        booking = context.get("booking")
        reasoning = []
        
        if not booking:
            return {"followup": None}

        reasoning.append(f"Scheduling follow-up for Booking {booking['id']}...")
        reasoning.append("Simulating 'Job Completion' trigger from provider.")
        
        # Mock Feedback
        feedback = {
            "rating": 5,
            "comment": "Bohat acha kaam kiya, time pe aye.",
            "completion_status": "success"
        }
        
        reasoning.append(f"Feedback received: {feedback['rating']}/5 stars. '{feedback['comment']}'")
        
        decision = {
            "followup": {
                "status": "completed",
                "feedback": feedback
            }
        }
        
        self._add_trace(reasoning, decision)
        return decision
