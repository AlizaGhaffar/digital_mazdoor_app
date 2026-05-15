from typing import Any, Dict
from datetime import datetime, timedelta
from .base_agent import BaseAgent

class SchedulingAgent(BaseAgent):
    """
    Manages availability and travel time buffers.
    """
    def __init__(self):
        super().__init__("scheduling_agent")

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        provider = context.get("top_match")
        intent = context.get("intent", {})
        context_en = context.get("context_enrichment", {})
        temporal = context_en.get("temporal", {})
        
        reasoning = []
        
        if not provider:
            reasoning.append("No provider available for scheduling.")
            return {"schedule": None}

        # 1. Conflict Simulation (Busy Check)
        # Mock: Let's say providers with specific IDs are busy
        busy_ids = ["daaa01de-3511-49e7-b401-bc6e89b1da9d"] # Mock busy ID
        
        if provider["id"] in busy_ids:
            reasoning.append(f"CRITICAL: {provider['full_name']} is already booked for this slot.")
            reasoning.append("Triggering fallback: Requesting Orchestrator to pivot to next best match.")
            return {
                "schedule": None,
                "workflow_status": "RETRY_REQUIRED",
                "last_error": "PROVIDER_BUSY"
            }

        target_day = temporal.get("day", "Today")
        target_slot = temporal.get("time_slot", "As soon as possible")
        
        reasoning.append(f"Scheduling {provider['full_name']} for {target_day}, {target_slot}.")
        
        # 2. Travel Time Simulation
        # Same neighborhood = 20m, Adjacent = 45m, Far = 90m
        origin = provider["location"]["neighborhood"]
        destination = intent.get("location_name", "Karachi")
        
        if origin.lower() == destination.lower():
            travel_minutes = 20
            reasoning.append(f"Provider is in the same neighborhood ({origin}). Estimated travel: 20 mins.")
        else:
            travel_minutes = 45
            reasoning.append(f"Provider is in '{origin}', coming to '{destination}'. Estimated travel: 45 mins.")

        # 3. Arrival Calculation
        now = datetime.now()
        arrival_time = now + timedelta(minutes=travel_minutes + 15)
        
        reasoning.append(f"Calculated arrival for {target_day}: {arrival_time.strftime('%I:%M %p')}.")
        
        decision = {
            "schedule": {
                "day": target_day,
                "requested_slot": target_slot,
                "estimated_arrival": arrival_time.isoformat(),
                "travel_time_minutes": travel_minutes,
                "buffer_minutes": 15,
                "status": "confirmed"
            }
        }
        
        self._add_trace(reasoning, decision)
        return decision
