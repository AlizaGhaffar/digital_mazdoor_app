from typing import Any, Dict
from .base_agent import BaseAgent

class PricingAgent(BaseAgent):
    """
    Calculates dynamic pricing based on urgency, distance, and service type.
    """
    def __init__(self):
        super().__init__("pricing_agent")

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        provider = context.get("top_match")
        intent = context.get("intent", {})
        schedule = context.get("schedule", {})
        reasoning = []
        
        if not provider:
            reasoning.append("No provider available for pricing.")
            return {"pricing": None}

        base_rate = provider["base_rate"]
        reasoning.append(f"Base rate for {provider['full_name']}: {base_rate} PKR")
        
        # 1. Urgency Surcharge
        urgency_fee = 0
        if intent.get("urgency") == "High":
            urgency_fee = int(base_rate * 0.20)
            reasoning.append(f"Applied 20% Urgency surcharge: +{urgency_fee} PKR.")
        elif intent.get("urgency") == "Low":
            urgency_fee = -int(base_rate * 0.10)
            reasoning.append(f"Applied 10% Budget discount: {urgency_fee} PKR.")

        # 2. Distance Surcharge
        travel_fee = 0
        travel_mins = schedule.get("travel_time_minutes", 0)
        if travel_mins > 30:
            travel_fee = 250
            reasoning.append(f"Applied Long Distance fee (Travel > 30m): +{travel_fee} PKR.")

        # 3. Time-of-day Surcharge
        slot_fee = 0
        requested_slot = schedule.get("requested_slot", "")
        if any(kw in requested_slot for kw in ["Night", "Evening"]):
            slot_fee = int(base_rate * 0.10)
            reasoning.append(f"Applied After-hours surcharge (Evening/Night): +{slot_fee} PKR.")

        final_price = base_rate + urgency_fee + travel_fee + slot_fee
        
        decision = {
            "pricing": {
                "final_price": final_price,
                "currency": "PKR",
                "breakdown": {
                    "base_rate": base_rate,
                    "urgency_adjustment": urgency_fee,
                    "travel_fee": travel_fee,
                    "after_hours_fee": slot_fee
                }
            }
        }
        
        self._add_trace(reasoning, decision)
        return decision
