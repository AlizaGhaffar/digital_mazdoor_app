from typing import Any, Dict
from .base_agent import BaseAgent

class DisputeAgent(BaseAgent):
    """
    Handles cancellations, no-shows, and quality complaints.
    """
    def __init__(self):
        super().__init__("dispute_agent")

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        intent = context.get("intent", {})
        raw_input = context.get("raw_input", "").lower()
        reasoning = []
        
        reasoning.append("Analyzing complaint context from user input.")
        
        # Simulated Validation Logic
        if "nahi aya" in raw_input or "no show" in raw_input:
            reasoning.append("Validating Provider GPS logs for the last 4 hours (simulated).")
            reasoning.append("Provider 'Ali Khan' last pings: 15km from site at scheduled time.")
            reasoning.append("Cross-referencing provider phone connectivity: Online, but no movement.")
            resolution = "Provider No-Show confirmed. Full refund initiated for Booking BK-9281. Provider flagged for penalty."
            status = "resolved"
        elif "kharab" in raw_input or "quality" in raw_input:
            reasoning.append("Opening photo evidence submitted via WhatsApp (simulated).")
            reasoning.append("AI Vision analysis: Incomplete wiring visible in junction box.")
            reasoning.append("Comparing with standard service guidelines: Violation found.")
            resolution = "Quality Dispute Validated. Re-work ordered at no cost or 50% refund offered."
            status = "mediation_required"
        else:
            reasoning.append("General complaint detected. Insufficient auto-validation data.")
            resolution = "Escalated to Support Mazdoor team for human review."
            status = "escalated"

        decision = {
            "dispute_resolution": {
                "resolution": resolution,
                "status": status,
                "system_action": "refund_or_reschedule" if status == "resolved" else "human_intervention"
            },
            "workflow_status": "DISPUTE_HANDLED"
        }
        
        self._add_trace(reasoning, decision)
        return decision
