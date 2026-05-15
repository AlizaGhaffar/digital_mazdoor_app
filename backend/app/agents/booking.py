from typing import Any, Dict
import uuid
from .base_agent import BaseAgent

class BookingAgent(BaseAgent):
    """
    Executes the booking transaction and secures the provider slot.
    """
    def __init__(self):
        super().__init__("booking_agent")

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        intent = context.get("intent", {})
        workflow_intent = intent.get("workflow_intent", "NEW_BOOKING")
        reasoning = []
        
        if workflow_intent == "CANCELLATION":
            reasoning.append("Cancellation request detected.")
            # In a real app, we'd lookup by Booking ID. Here we simulate.
            reasoning.append("Searching for active bookings for this user...")
            reasoning.append("Found active booking BK-88291. Initiating teardown.")
            reasoning.append("Notifying provider of cancellation. Releasing slot.")
            
            decision = {
                "booking": {
                    "id": "BK-88291",
                    "status": "CANCELLED",
                    "action": "cancel_confirmation"
                },
                "workflow_status": "CANCELLED"
            }
        else:
            provider = context.get("top_match")
            schedule = context.get("schedule")
            pricing = context.get("pricing")
            
            if not provider or not schedule:
                reasoning.append("Missing provider or schedule data. Cannot execute booking.")
                return {"booking": None}

            reasoning.append(f"Initiating booking for {provider['full_name']}...")
            reasoning.append(f"Finalizing price at {pricing['final_price']} {pricing['currency']}.")
            
            # Simulated DB Transaction
            booking_id = f"BK-{uuid.uuid4().hex[:8].upper()}"
            
            reasoning.append(f"Database transaction successful. Booking ID: {booking_id}")
            reasoning.append("Slot locked in provider's calendar.")
            
            decision = {
                "booking": {
                    "id": booking_id,
                    "status": "CONFIRMED",
                    "provider_id": provider["id"],
                    "total_price": pricing["final_price"],
                    "arrival_time": schedule["estimated_arrival"]
                },
                "workflow_status": "BOOKED"
            }
        
        self._add_trace(reasoning, decision)
        return decision
