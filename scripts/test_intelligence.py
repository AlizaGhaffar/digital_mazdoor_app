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

async def test_scenarios():
    scenarios = [
        {
            "name": "High Urgency (Reliability focus)",
            "prompt": "AC kharab hai jaldi aao Gulshan me"
        },
        {
            "name": "Budget Focus (Price focus)",
            "prompt": "Painter chahiye sasta ho DHA me"
        },
        {
            "name": "Expanded Search (Nearby neighborhood)",
            "prompt": "Plumber in Clifton" # Clifton has some, DHA has more
        },
        {
            "name": "Temporal Aware Scheduling",
            "prompt": "Electrician for tomorrow morning in Gulshan"
        }
    ]

    for sc in scenarios:
        print(f"\n--- Scenario: {sc['name']} ('{sc['prompt']}') ---")
        orchestrator = Orchestrator()
        orchestrator.add_agent(IntentAgent())
        orchestrator.add_agent(ContextAgent())
        orchestrator.add_agent(MatchingAgent())
        orchestrator.add_agent(RankingAgent())
        orchestrator.add_agent(SchedulingAgent())
        orchestrator.add_agent(PricingAgent())
        
        result = await orchestrator.run_workflow(sc['prompt'])
        
        ctx = result["final_context"]
        intent = ctx.get("intent", {})
        top_match = ctx.get("top_match", {})
        pricing = ctx.get("pricing", {})
        schedule = ctx.get("schedule", {})
        
        print(f"Workflow Status: {ctx.get('workflow_status')}")
        print(f"Top Provider: {top_match.get('full_name')} | Score: {top_match.get('orchestrator_score')}")
        print(f"Stats: {top_match.get('reliability_score')}% Rel | {top_match.get('base_rate')} PKR")
        print(f"Pricing: {pricing.get('final_price')} PKR (Breakdown: {pricing.get('breakdown')})")
        print(f"Schedule: {schedule.get('day')}, {schedule.get('requested_slot')} -> {schedule.get('estimated_arrival')}")
        
        # Check traces for reasoning
        for trace in result["all_traces"]:
            if trace["agent_id"] in ["ranking_agent", "pricing_agent"]:
                print(f"Reasoning ({trace['agent_id']}): {trace['reasoning_logic']}")

if __name__ == "__main__":
    asyncio.run(test_scenarios())
