import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.services.orchestrator import Orchestrator
from app.agents.intent import IntentAgent
from app.agents.context import ContextAgent
from app.agents.matching import MatchingAgent
from app.agents.ranking import RankingAgent
from app.agents.scheduling import SchedulingAgent
from app.agents.pricing import PricingAgent
from app.agents.booking import BookingAgent
from app.agents.notification import NotificationAgent
from app.agents.dispute import DisputeAgent
from app.agents.automation import AutomationAgent

def setup_full_orchestrator():
    orchestrator = Orchestrator()
    orchestrator.add_agent(IntentAgent())
    orchestrator.add_agent(ContextAgent())
    orchestrator.add_agent(MatchingAgent())
    orchestrator.add_agent(RankingAgent())
    orchestrator.add_agent(SchedulingAgent())
    orchestrator.add_agent(PricingAgent())
    orchestrator.add_agent(BookingAgent())
    orchestrator.add_agent(NotificationAgent())
    orchestrator.add_agent(DisputeAgent())
    orchestrator.add_agent(AutomationAgent())
    return orchestrator

async def run_scenario(name, prompt):
    print(f"\n--- Scenario: {name} ('{prompt}') ---")
    orchestrator = setup_full_orchestrator()
    result = await orchestrator.run_workflow(prompt)
    
    ctx = result["final_context"]
    intent = ctx.get("intent", {})
    
    print(f"Workflow Intent: {intent.get('workflow_intent')}")
    print(f"Final Status: {ctx.get('workflow_status')}")
    
    if "booking" in ctx:
        print(f"Booking Status: {ctx['booking'].get('status')} (ID: {ctx['booking'].get('id')})")
    
    if "dispute_resolution" in ctx:
        print(f"Dispute Resolution: {ctx['dispute_resolution'].get('resolution')}")

    # Check traces for specific logic
    for trace in result["all_traces"]:
        if trace["agent_id"] in ["scheduling_agent", "booking_agent", "dispute_agent"]:
            print(f"[{trace['agent_id']}] Reasoning: {trace['reasoning_logic']}")

async def test_scenarios():
    scenarios = [
        {
            "name": "New Booking (Standard)",
            "prompt": "AC thik karwana hai DHA me"
        },
        {
            "name": "Cancellation Flow",
            "prompt": "Yaar mera booking cancel kardo"
        },
        {
            "name": "Dispute Resolution (No Show)",
            "prompt": "Panchar wala abhi tak nahi aya, complain karni hai"
        },
        {
            "name": "Conflict Handling (Busy Provider)",
            "prompt": "AC repair Gulshan me urgent" # Ali Khan is busy in our mock
        }
    ]

    for sc in scenarios:
        await run_scenario(sc['name'], sc['prompt'])

if __name__ == "__main__":
    asyncio.run(test_scenarios())
