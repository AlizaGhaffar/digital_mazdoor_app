from typing import Any, Dict
from .base_agent import BaseAgent

class ContextAgent(BaseAgent):
    """
    Enriches the request with user history, preferences, and environmental data.
    """
    def __init__(self):
        super().__init__("context_agent")

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        reasoning = []
        raw_input = context.get("raw_input", "").lower()
        intent = context.get("intent", {})
        
        reasoning.append("Analyzing raw input for temporal and environmental context...")
        
        # 1. Temporal Extraction
        temporal_info = {
            "day": "Today",
            "time_slot": "As soon as possible"
        }
        
        day_map = {
            "kal": "Tomorrow",
            "parson": "Day after tomorrow",
            "aaj": "Today",
            "tomorrow": "Tomorrow",
            "today": "Today"
        }
        for kw, day in day_map.items():
            if kw in raw_input:
                temporal_info["day"] = day
                reasoning.append(f"Detected temporal day: '{day}' via keyword '{kw}'.")
                break
                
        time_map = {
            "subah": "Morning (8AM - 12PM)",
            "morning": "Morning (8AM - 12PM)",
            "sham": "Evening (4PM - 8PM)",
            "evening": "Evening (4PM - 8PM)",
            "raat": "Night (8PM - 11PM)",
            "night": "Night (8PM - 11PM)",
            "dopahar": "Afternoon (12PM - 4PM)",
            "afternoon": "Afternoon (12PM - 4PM)"
        }
        for kw, slot in time_map.items():
            if kw in raw_input:
                temporal_info["time_slot"] = slot
                reasoning.append(f"Detected time slot: '{slot}' via keyword '{kw}'.")
                break

        # 2. Issue Specification
        issue_details = "Standard service"
        problem_keywords = ["leak", "gas", "cooling", "noise", "fitting", "shart", "broken", "theek nahi"]
        found_issues = [kw for kw in problem_keywords if kw in raw_input]
        if found_issues:
            issue_details = f"Issue involves: {', '.join(found_issues)}"
            reasoning.append(f"Extracted specific issue details: {found_issues}")

        # 3. User Profile Simulation (Enhanced)
        user_profile = {
            "preferred_language": "Urdu/Roman Urdu",
            "is_premium": False,
            "avg_budget_limit": 5000 if intent.get("urgency") == "Low" else 15000
        }
        
        decision = {
            "context_enrichment": {
                "temporal": temporal_info,
                "issue_details": issue_details,
                "user_profile": user_profile,
                "environment": {
                    "request_time": "2026-05-15T10:30:00", # Mock current time
                    "weather_hint": "Hot/Dry" if "ac" in raw_input else "Normal"
                }
            }
        }
        
        self._add_trace(reasoning, decision)
        return decision
