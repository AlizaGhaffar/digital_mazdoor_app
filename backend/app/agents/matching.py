import json
from typing import Any, Dict, List
from .base_agent import BaseAgent

import os

class MatchingAgent(BaseAgent):
    """
    Discovers providers matching the intent (Service Type + Location).
    """
    def __init__(self, data_path: str = None):
        super().__init__("matching_agent")
        # Neighborhood adjacency for Karachi (Simplified)
        self.neighborhood_map = {
            "DHA": ["Clifton", "PECHS"],
            "Clifton": ["DHA", "PECHS"],
            "Gulshan": ["PECHS", "Nazimabad"],
            "PECHS": ["DHA", "Clifton", "Gulshan", "Nazimabad"],
            "Nazimabad": ["Gulshan", "PECHS", "Malir"],
            "Malir": ["Nazimabad", "Gulshan"]
        }
        if data_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
            self.data_path = os.path.join(base_dir, "data", "providers.json")
        else:
            self.data_path = data_path

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        intent = context.get("intent", {})
        service_type = intent.get("service_type")
        location_nb = intent.get("location_name")
        
        reasoning = []
        reasoning.append(f"Matching for '{service_type}' in targeted neighborhood: '{location_nb}'.")
        
        try:
            with open(self.data_path, "r") as f:
                all_providers = json.load(f)
        except Exception as e:
            reasoning.append(f"Critical error loading provider data: {str(e)}")
            return {"matches": []}

        # 1. Exact Neighborhood Match
        matches = [
            p for p in all_providers 
            if p["service_type"] == service_type and p["location"]["neighborhood"].lower() == location_nb.lower()
        ]
        
        if matches:
            reasoning.append(f"Found {len(matches)} providers in '{location_nb}'.")
        else:
            # 2. Expanded Search to Adjacents
            reasoning.append(f"No direct matches in '{location_nb}'. Expanding search to nearby neighborhoods...")
            adjacents = self.neighborhood_map.get(location_nb, [])
            
            for adj in adjacents:
                adj_matches = [
                    p for p in all_providers 
                    if p["service_type"] == service_type and p["location"]["neighborhood"].lower() == adj.lower()
                ]
                if adj_matches:
                    reasoning.append(f"Found {len(adj_matches)} providers in nearby area: '{adj}'.")
                    matches.extend(adj_matches)
            
            if not matches:
                reasoning.append("No nearby matches found. Falling back to city-wide discovery.")
                matches = [p for p in all_providers if p["service_type"] == service_type][:10]
                reasoning.append(f"City-wide search returned {len(matches)} candidates.")

        decision = {"matches": matches}
        self._add_trace(reasoning, decision)
        return decision
