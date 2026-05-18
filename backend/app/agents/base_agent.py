from abc import ABC, abstractmethod
from typing import Any, Dict, List
from datetime import datetime
import os
import json
from dotenv import load_dotenv

from agents import (
    Agent,
    Runner,
    AsyncOpenAI,
    OpenAIChatCompletionsModel
)
from agents.run import RunConfig

from ..core.logging_config import log_agent_step

load_dotenv()

class BaseAgent(ABC):
    """
    Abstract base class for all agents.
    Enforces the 'Reasoning Trace' pattern and provides common LLM capability.
    """
    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.trace: List[Dict[str, Any]] = []
        
        # Initialize OpenAI Client for OpenRouter
        self.client = AsyncOpenAI(
            api_key=os.getenv("OPENROUTER_API_KEY", ""),
            base_url="https://openrouter.ai/api/v1"
        )

    def _add_trace(self, reasoning: List[str], decision: Any, status: str = "success"):
        """Internal helper to capture agent reasoning."""
        step = {
            "agent_id": self.agent_id,
            "timestamp": datetime.now().isoformat(),
            "status": status,
            "reasoning_logic": reasoning,
            "decision": decision
        }
        self.trace.append(step)
        
        # Also log to structured console logging
        log_agent_step(
            agent_id=self.agent_id,
            message=f"Agent {self.agent_id} completed a step.",
            reasoning=reasoning,
            decision=decision,
            status=status
        )

    async def _call_llm(self, prompt: str, require_json: bool = True) -> Dict[str, Any]:
        """Call OpenRouter LLM and return JSON response."""
        try:
            response = await self.client.chat.completions.create(
                model="deepseek/deepseek-chat-v3-0324",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"} if require_json else None
            )
            content = response.choices[0].message.content
            if require_json:
                # Basic JSON cleanup if the model adds markdown
                if content.startswith("```json"):
                    content = content[7:-3]
                elif content.startswith("```"):
                    content = content[3:-3]
                return json.loads(content.strip())
            return {"text": content}
        except Exception as e:
            return {"error": str(e)}

    @abstractmethod
    async def run(self, context: Dict[str, Any]) -> Any:
        """Execute the agent's core logic."""
        pass

    def get_trace(self) -> List[Dict[str, Any]]:
        """Return the reasoning traces collected by this agent."""
        return self.trace
