from typing import Any, Dict
from .base_agent import BaseAgent

class ProviderOptAgent(BaseAgent):
    """
    Suggests optimizations for providers based on their performance and market data.
    """
    def __init__(self):
        super().__init__("provider_opt_agent")

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        provider = context.get("top_match")
        reliability = context.get("reliability_update", {})
        reasoning = []
        
        if not provider:
            return {"optimizations": []}

        reasoning.append(f"Analyzing growth opportunities for {provider['full_name']}...")
        
        optimizations = []
        if provider["rating"] < 4.0:
            optimizations.append("Consider joining the 'Quality Skills Workshop'.")
            reasoning.append("Rating is below average. Suggesting training.")
            
        if reliability.get("new_score", 100) < 80:
            optimizations.append("Enable 'Early Arrival' alerts to improve reliability.")
            reasoning.append("Reliability is dipping. Suggesting tool-based improvement.")

        if not optimizations:
            optimizations.append("You are in the top 10%! Keep it up.")
            reasoning.append("High performance detected. Positive reinforcement.")

        decision = {"optimizations": optimizations}
        self._add_trace(reasoning, decision)
        return decision
