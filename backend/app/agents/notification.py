from typing import Any, Dict
from .base_agent import BaseAgent

class NotificationAgent(BaseAgent):
    """
    Simulates SMS/WhatsApp communications for users and providers.
    """
    def __init__(self):
        super().__init__("notification_agent")

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        booking = context.get("booking")
        provider = context.get("top_match")
        reasoning = []
        
        if not booking:
            reasoning.append("No active booking found for notifications.")
            return {"notifications": []}

        reasoning.append("Preparing notification payloads...")
        
        # User Message
        user_msg = f"Assalam-o-Alaikum! Your booking ({booking['id']}) for {context['intent']['service_type']} is confirmed. {provider['full_name']} will arrive at {booking['arrival_time']}."
        
        # Provider Message
        prov_msg = f"New Job Alert! Booking {booking['id']} in {context['intent']['location_name']}. Customer needs {context['intent']['service_type']}. Estimated Pay: {booking['total_price']} PKR."

        reasoning.append(f"Mocking SMS to User: '{user_msg}'")
        reasoning.append(f"Mocking WhatsApp to Provider: '{prov_msg}'")
        
        decision = {
            "notifications": [
                {"to": "user", "channel": "sms", "content": user_msg, "status": "sent"},
                {"to": "provider", "channel": "whatsapp", "content": prov_msg, "status": "sent"}
            ]
        }
        
        self._add_trace(reasoning, decision)
        return decision
