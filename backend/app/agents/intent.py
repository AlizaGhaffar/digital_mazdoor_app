import os
import json
import httpx
from typing import Any, Dict
from .base_agent import BaseAgent

class IntentAgent(BaseAgent):
    """
    Enhanced Intent Agent using LLM for multilingual understanding,
    Roman Urdu support, and true autonomous fallback reasoning.
    """
    def __init__(self):
        super().__init__("intent_agent")
        # Supported categories for Digital Mazdoor
        self.supported_categories = [
            "AC Repair",
            "Plumber",
            "Electrician",
            "Painter",
            "Tutor"
        ]

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        raw_input = context.get("raw_input", "")
        device_location = context.get("device_location")
        location_hint = device_location["name"] if device_location else "Karachi"
        
        reasoning = [f"Analyzing input: '{raw_input}'"]
        reasoning.append(f"Device Location Context: {location_hint}")

        system_prompt = f"""
You are the Intent Classification and Reasoning Engine for 'Digital Mazdoor', a service provider orchestration platform in Pakistan.
The user's raw input may be in English, Urdu, Roman Urdu, or mixed slang.

Current Supported Provider Categories: {json.dumps(self.supported_categories)}
Device Location (Fallback if location not explicitly mentioned in input): {location_hint}

Your task:
1. Understand the user's service request.
2. Determine if it perfectly matches a supported category, partially matches, or is completely unsupported (e.g., asking for a "massi"/domestic helper, doctor, etc.).
3. Determine the 'workflow_intent' (NEW_BOOKING, CANCELLATION, DISPUTE, RESCHEDULE, STATUS_CHECK).
4. Extract location name from input (or fallback to Device Location).
5. Extract urgency (High, Medium, Low).
6. Classify job complexity (basic, intermediate, complex) based on the problem description.
7. Provide a confidence score (0.0 to 1.0).

CRITICAL RULE FOR UNSUPPORTED SERVICES:
If the user asks for a service we DO NOT support (like a maid/massi), you MUST set "service_type" to "UNSUPPORTED".
Do NOT hallucinate a mapping to a random category.
Instead, generate a natural conversational Urdu/Roman Urdu "fallback_response" explaining that the service is unavailable, but list the supported categories they can use.

Respond ONLY in valid JSON matching this schema:
{{
  "service_type": "string (One of supported categories, or 'UNSUPPORTED')",
  "location_name": "string",
  "urgency": "string (High, Medium, Low)",
  "complexity": "string (basic, intermediate, complex)",
  "workflow_intent": "string",
  "confidence": float,
  "is_ambiguous": boolean,
  "reasoning_trace": "string (A brief 1-sentence explanation of your decision)",
  "fallback_response": "string (Optional, only provide if UNSUPPORTED or ambiguous)"
}}

User Input: "{raw_input}"
"""
        
        reasoning.append("Querying LLM for intent resolution...")
        
        llm_response = await self._call_llm(system_prompt)

        if "error" in llm_response:
            # Fallback to general if LLM fails
            reasoning.append(f"LLM Error: {llm_response['error']}. Falling back to default heuristics.")
            decision = {
                "intent": {
                    "service_type": "General",
                    "location_name": "Karachi",
                    "urgency": "Medium",
                    "complexity": "intermediate",
                    "workflow_intent": "NEW_BOOKING",
                    "confidence": 0.1,
                    "is_ambiguous": True
                }
            }
            self._add_trace(reasoning, decision)
            return decision

        reasoning.append(f"LLM Reasoning: {llm_response.get('reasoning_trace', 'N/A')}")
        
        service_type = llm_response.get("service_type", "UNSUPPORTED")
        if service_type == "UNSUPPORTED":
            reasoning.append("Unsupported service detected. Initiating intelligent fallback workflow.")
        elif llm_response.get("confidence", 0) < 0.4:
            reasoning.append(f"Low confidence ({llm_response.get('confidence')}) detected. Flagging as ambiguous.")
        else:
            reasoning.append(f"Successfully mapped intent to supported category: {service_type}")

        intent_data = {
            "service_type": service_type,
            "location_name": llm_response.get("location_name", "Karachi"),
            "urgency": llm_response.get("urgency", "Medium"),
            "complexity": llm_response.get("complexity", "intermediate"),
            "workflow_intent": llm_response.get("workflow_intent", "NEW_BOOKING"),
            "confidence": llm_response.get("confidence", 0.0),
            "is_ambiguous": llm_response.get("is_ambiguous", False),
            "fallback_response": llm_response.get("fallback_response")
        }

        decision = {"intent": intent_data}
        self._add_trace(reasoning, decision)
        
        return decision
