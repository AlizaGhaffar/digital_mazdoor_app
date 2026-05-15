from abc import ABC, abstractmethod
from typing import Any, Dict, List
from datetime import datetime
from ..core.logging_config import log_agent_step

class BaseAgent(ABC):
    """
    Abstract base class for all agents.
    Enforces the 'Reasoning Trace' pattern.
    """
    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.trace: List[Dict[str, Any]] = []

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

    @abstractmethod
    async def run(self, context: Dict[str, Any]) -> Any:
        """Execute the agent's core logic."""
        pass

    def get_trace(self) -> List[Dict[str, Any]]:
        """Return the reasoning traces collected by this agent."""
        return self.trace
