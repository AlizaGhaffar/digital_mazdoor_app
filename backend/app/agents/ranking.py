from typing import Any, Dict, List
from .base_agent import BaseAgent

class RankingAgent(BaseAgent):
    """
    Ranks matched providers based on Rating, Reliability, and Distance.
    """
    def __init__(self):
        super().__init__("ranking_agent")

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        matches = context.get("matches", [])
        intent = context.get("intent", {})
        location_nb = intent.get("location_name", "Karachi")
        urgency = intent.get("urgency", "Medium")
        
        reasoning = []
        
        if not matches:
            reasoning.append("No candidates available for ranking.")
            return {"ranked_providers": []}

        # 1. Define Weights based on Intent
        if urgency == "High":
            # Prioritize Reliability and Proximity
            weights = {"reliability": 0.5, "proximity": 0.3, "rating": 0.2, "price": 0.0}
            reasoning.append("High Urgency detected: Weighting RELIABILITY and PROXIMITY highest.")
        elif urgency == "Low":
            # Prioritize Price
            weights = {"price": 0.5, "rating": 0.3, "reliability": 0.2, "proximity": 0.0}
            reasoning.append("Low Urgency / Budget priority detected: Weighting PRICE highest.")
        else:
            # Balanced
            weights = {"reliability": 0.3, "rating": 0.3, "proximity": 0.2, "price": 0.2}
            reasoning.append("Standard request: Using BALANCED ranking weights.")

        ranked = []
        for p in matches:
            # a. Proximity Score (100 if same neighborhood, 50 if adjacent, 0 otherwise)
            # In this mock, we check neighborhood match
            prox_score = 100 if p["location"]["neighborhood"].lower() == location_nb.lower() else 50
            
            # b. Price Score (Normalized against 3000 max for this mock)
            # Higher score for lower price: (3000 - base_rate) / 30
            price_score = max(0, (3000 - p["base_rate"]) / 30)
            
            # c. Base Score calculation
            score = (
                (p["reliability_score"] * weights["reliability"]) +
                (p["rating"] * 20 * weights["rating"]) + # Scale 5.0 to 100
                (prox_score * weights["proximity"]) +
                (price_score * weights["price"])
            )
            
            # d. Penalties & Bonuses
            penalty = p["cancellation_rate"] * 100 # e.g., 0.1 rate = -10 points
            bonus = 10 if p.get("verified") else 0
            
            final_score = round(score - penalty + bonus, 2)
            
            p_with_score = p.copy()
            p_with_score["orchestrator_score"] = final_score
            p_with_score["score_breakdown"] = {
                "base": round(score, 2),
                "penalty": round(penalty, 2),
                "bonus": bonus
            }
            ranked.append(p_with_score)
            
        # Sort by score descending
        ranked.sort(key=lambda x: x["orchestrator_score"], reverse=True)
        
        top_provider = ranked[0]
        reasoning.append(f"Ranked {len(ranked)} providers. Top Match: {top_provider['full_name']} (Score: {top_provider['orchestrator_score']}).")
        reasoning.append(f"Top Match Stats: {top_provider['rating']} Rating, {top_provider['reliability_score']}% Reliability, {top_provider['base_rate']} PKR.")

        decision = {
            "ranked_providers": ranked,
            "top_match": top_provider
        }
        
        self._add_trace(reasoning, decision)
        return decision
