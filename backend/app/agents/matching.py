import json
import os
from typing import Any, Dict, List
from .base_agent import BaseAgent


class MatchingAgent(BaseAgent):
    """
    Discovers providers matching the intent (Service Type + Location).
    """
    def __init__(self, data_path: str = None):
        super().__init__("matching_agent")

        # Expanded neighborhood adjacency map for Karachi
        self.neighborhood_map = {
            # --- DHA / South ---
            "dha": ["clifton", "pechs", "korangi"],
            "clifton": ["dha", "pechs", "saddar"],
            "saddar": ["clifton", "pechs", "lyari"],
            "lyari": ["saddar", "orangi"],
            # --- Central ---
            "pechs": ["dha", "clifton", "gulshan", "nazimabad", "north nazimabad"],
            "gulshan": ["pechs", "nazimabad", "north nazimabad", "johar", "gulshan-e-iqbal"],
            "gulshan-e-iqbal": ["gulshan", "johar", "north nazimabad", "malir"],
            "johar": ["gulshan", "gulshan-e-iqbal", "north nazimabad", "malir", "surjani"],
            "johar town": ["gulshan", "gulshan-e-iqbal", "north nazimabad", "malir"],
            "nazimabad": ["gulshan", "pechs", "north nazimabad", "malir"],
            "north nazimabad": ["nazimabad", "gulshan", "pechs", "johar"],
            # --- East ---
            "malir": ["nazimabad", "gulshan", "gulshan-e-iqbal", "johar", "korangi"],
            "korangi": ["malir", "dha", "landhi"],
            "landhi": ["korangi", "malir"],
            # --- West / North ---
            "orangi": ["lyari", "surjani", "north karachi"],
            "north karachi": ["orangi", "surjani"],
            "surjani": ["orangi", "north karachi", "johar"],
            # --- New areas ---
            "bahria town": ["dha", "malir"],
            "gulistan-e-johar": ["gulshan", "johar", "malir"],
            "gulistan e johar": ["gulshan", "johar", "malir"],
        }

        # Canonical name normalization — maps LLM output → providers.json neighborhood
        self.name_aliases = {
            "johar": "Gulshan",
            "johar town": "Gulshan",
            "gulistan-e-johar": "Gulshan",
            "gulistan e johar": "Gulshan",
            "gulshan-e-iqbal": "Gulshan",
            "north nazimabad": "North Nazimabad",
            "north karachi": "Gulshan",
            "surjani": "Gulshan",
            "bahria town": "DHA",
            "landhi": "Malir",
            "korangi": "Malir",
            "saddar": "Clifton",
            "lyari": "Clifton",
            "orangi": "Nazimabad",
        }

        if data_path is None:
            # __file__ = /workspace/app/agents/matching.py
            # go up 2 levels: app/agents → app → workspace
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            self.data_path = os.path.join(base_dir, "data", "providers.json")
        else:
            self.data_path = data_path

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        intent = context.get("intent", {})
        service_type = intent.get("service_type", "")
        location_raw = intent.get("location_name", "Karachi")

        reasoning = []
        reasoning.append(f"Matching for '{service_type}' near '{location_raw}'.")

        # Load providers
        try:
            with open(self.data_path, "r") as f:
                all_providers = json.load(f)
            reasoning.append(f"Loaded {len(all_providers)} providers from database.")
        except Exception as e:
            reasoning.append(f"Critical error loading provider data: {str(e)} | path: {self.data_path}")
            decision = {"matches": []}
            self._add_trace(reasoning, decision)
            return decision

        location_key = location_raw.lower().strip()

        # Resolve alias to canonical neighborhood name in providers.json
        canonical = self.name_aliases.get(location_key)
        if canonical:
            reasoning.append(f"Resolved '{location_raw}' → canonical neighborhood '{canonical}'.")

        def match_by_neighborhood(nb_name: str) -> List[Dict]:
            return [
                p for p in all_providers
                if p["service_type"] == service_type
                and p["location"]["neighborhood"].lower() == nb_name.lower()
            ]

        # 1. Try canonical alias first
        matches = []
        if canonical:
            matches = match_by_neighborhood(canonical)
            if matches:
                reasoning.append(f"Found {len(matches)} providers in canonical area '{canonical}'.")

        # 2. Try exact match on the raw location
        if not matches:
            matches = match_by_neighborhood(location_raw)
            if matches:
                reasoning.append(f"Found {len(matches)} providers via exact match in '{location_raw}'.")

        # 3. Expand to adjacent neighborhoods
        if not matches:
            reasoning.append(f"No direct match for '{location_raw}'. Expanding to adjacent areas...")
            adjacents = self.neighborhood_map.get(location_key, [])
            for adj in adjacents:
                # Resolve adj alias too
                adj_canonical = self.name_aliases.get(adj, adj.title())
                adj_matches = match_by_neighborhood(adj_canonical)
                if not adj_matches:
                    adj_matches = match_by_neighborhood(adj)
                if adj_matches:
                    reasoning.append(f"Found {len(adj_matches)} providers in nearby '{adj_canonical}'.")
                    matches.extend(adj_matches)

        # 4. City-wide fallback by service type
        if not matches:
            reasoning.append("No nearby matches found. Running city-wide search by service type.")
            matches = [p for p in all_providers if p["service_type"] == service_type][:10]
            reasoning.append(f"City-wide search returned {len(matches)} providers.")

        # 5. Absolute fallback — return top 5 providers of any type
        if not matches:
            reasoning.append("WARNING: No providers found for this service type. Returning top available providers.")
            matches = all_providers[:5]

        decision = {"matches": matches}
        self._add_trace(reasoning, decision)
        return decision
