import re
from typing import Any, Dict
from .base_agent import BaseAgent

class IntentAgent(BaseAgent):
    """
    Enhanced Intent Agent for Roman Urdu and semantic understanding.
    """
    def __init__(self):
        super().__init__("intent_agent")
        # Comprehensive lexicon for Pakistani context
        self.service_map = {
            "AC Repair": {
                "keywords": ["ac", "air condition", "thanda", "cooling", "service", "compressor", "leak", "split", "window"],
                "urdu": ["اے سی", "کولنگ", "سروس", "خراب"]
            },
            "Plumber": {
                "keywords": ["plumber", "plumbing", "nalk", "pani", "leak", "washroom", "tanki", "tap", "pipeline", "motor"],
                "urdu": ["پلمبر", "نلکا", "پانی", "لیک", "ٹانکی"]
            },
            "Electrician": {
                "keywords": ["bijli", "light", "electric", "shart", "short", "fan", "motor", "switch", "wiring", "ups", "solar"],
                "urdu": ["بجلی", "لائٹ", "پنکھا", "تار"]
            },
            "Painter": {
                "keywords": ["painter", "rang", "paint", "deewar", "wall", "distemper"],
                "urdu": ["پینٹر", "رنگ", "دیوار"]
            }
        }
        self.loc_map = {
            "Gulshan": ["gulshan", "iqbal", "johar", "scheme 33"],
            "DHA": ["dha", "defence", "phase", "clifton", "sea view"],
            "Nazimabad": ["nazimabad", "liaquatabad", "paposh", "north"],
            "Malir": ["malir", "cantt", "model colony", "airport"]
        }

    def _normalize(self, text: str) -> str:
        """Standardizes input for better matching."""
        text = text.lower()
        # Remove common punctuation
        text = re.sub(r'[^\w\s]', '', text)
        # Normalize common Roman Urdu variations
        replacements = {
            "khraab": "kharab",
            "kharaab": "kharab",
            "thk": "theek",
            "thik": "theek",
            "zarorat": "zaroorat",
            "chahye": "chahiye",
            "chaye": "chahiye"
        }
        for old, new in replacements.items():
            text = text.replace(old, new)
        return text.strip()

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        raw_input = context.get("raw_input", "")
        normalized_input = self._normalize(raw_input)
        reasoning = [f"Normalized input to: '{normalized_input}'"]
        
        # 1. Service Detection with Scoring
        detected_services = []
        for srv, maps in self.service_map.items():
            score = 0
            matches = []
            for kw in maps["keywords"] + maps["urdu"]:
                if kw in normalized_input:
                    score += 1
                    matches.append(kw)
            if score > 0:
                detected_services.append({
                    "service": srv,
                    "score": score,
                    "matches": matches
                })

        # Sort by score descending
        detected_services.sort(key=lambda x: x["score"], reverse=True)

        service = "General"
        confidence = 0.0
        
        if not detected_services:
            reasoning.append("No specific service keywords detected. Defaulting to 'General'.")
            confidence = 0.3
        elif len(detected_services) > 1 and detected_services[0]["score"] == detected_services[1]["score"]:
            reasoning.append(f"Ambiguity detected between {detected_services[0]['service']} and {detected_services[1]['service']}.")
            service = detected_services[0]["service"] # Take first but lower confidence
            confidence = 0.5
        else:
            top_match = detected_services[0]
            service = top_match["service"]
            # Confidence based on match density and uniqueness
            confidence = min(0.95, 0.4 + (top_match["score"] * 0.2))
            reasoning.append(f"Service identified as '{service}' via keywords: {top_match['matches']}.")

        # 2. Location Detection
        location = "Karachi"
        detected_locs = []
        for loc, keywords in self.loc_map.items():
            if any(kw in normalized_input for kw in keywords):
                detected_locs.append(loc)
        
        if detected_locs:
            location = detected_locs[0]
            reasoning.append(f"Location scoped to: '{location}'.")
            if len(detected_locs) > 1:
                reasoning.append(f"Note: Multiple locations mentioned {detected_locs}, using first match.")

        # 3. Urgency & Sentiment
        urgency = "Medium"
        if any(kw in normalized_input for kw in ["emergency", "jaldi", "abhi", "urgent", "phat gaya", "fauri"]):
            urgency = "High"
            reasoning.append("High urgency detected: User indicates immediate need.")
        elif any(kw in normalized_input for kw in ["budget", "sasta", "kam paisa", "ghareeb", "discount"]):
            urgency = "Low"
            reasoning.append("Price sensitivity detected (Low Urgency priority).")

        # 4. Workflow Intent Detection
        workflow_intent = "NEW_BOOKING"
        if any(kw in normalized_input for kw in ["cancel", "kardo khatam", "nahi chahiye", "roko"]):
            workflow_intent = "CANCELLATION"
            reasoning.append("Workflow Intent: User wants to CANCEL an existing booking.")
        elif any(kw in normalized_input for kw in ["complain", "shikayat", "kharab kaam", "nahi aya", "fraud"]):
            workflow_intent = "DISPUTE"
            reasoning.append("Workflow Intent: User is reporting a DISPUTE.")
        elif any(kw in normalized_input for kw in ["time change", "reschedule", "baad me", "parson"]):
            workflow_intent = "RESCHEDULE"
            reasoning.append("Workflow Intent: User wants to RESCHEDULE.")
        elif any(kw in normalized_input for kw in ["kahan hai", "status", "kitni dair"]):
            workflow_intent = "STATUS_CHECK"
            reasoning.append("Workflow Intent: User is checking STATUS.")
        else:
            reasoning.append("Workflow Intent: Defaulting to NEW_BOOKING flow.")

        decision = {
            "intent": {
                "service_type": service,
                "location_name": location,
                "urgency": urgency,
                "workflow_intent": workflow_intent,
                "confidence": round(confidence, 2),
                "is_ambiguous": confidence < 0.4 or (len(detected_services) > 1 and detected_services[0]["score"] == detected_services[1]["score"])
            }
        }
        
        self._add_trace(reasoning, decision)
        return decision
