import asyncio
import json
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services.orchestrator import Orchestrator
from app.agents.intent import IntentAgent
from app.agents.context import ContextAgent
from app.agents.matching import MatchingAgent
from app.agents.ranking import RankingAgent
from app.agents.scheduling import SchedulingAgent
from app.agents.pricing import PricingAgent
from app.agents.booking import BookingAgent
from app.agents.notification import NotificationAgent
from app.agents.followup import FollowupAgent
from app.agents.reliability import ReliabilityAgent
from app.agents.dispute import DisputeAgent
from app.agents.provider_opt import ProviderOptAgent

async def run_demo():
    print("=== DIGITAL MAZDOOR: Autonomous AI Orchestration Demo ===\n")
    
    # 1. Initialize Orchestrator and Agents
    orchestrator = Orchestrator()
    
    # Register the full 12-agent chain
    orchestrator.add_agent(IntentAgent())
    orchestrator.add_agent(ContextAgent())
    orchestrator.add_agent(MatchingAgent())
    orchestrator.add_agent(RankingAgent())
    orchestrator.add_agent(SchedulingAgent())
    orchestrator.add_agent(PricingAgent())
    orchestrator.add_agent(BookingAgent())
    orchestrator.add_agent(NotificationAgent())
    orchestrator.add_agent(FollowupAgent())
    orchestrator.add_agent(ReliabilityAgent())
    orchestrator.add_agent(ProviderOptAgent())
    
    # Optional: Add Dispute handling for specific scenarios
    # orchestrator.add_agent(DisputeAgent())

    # 2. Input Scenario
    user_prompt = "Mujhe kal subah Gulshan mein AC technician chahiye budget kam hai"
    print(f"USER PROMPT: '{user_prompt}'\n")

    # 3. Run Workflow
    print("Orchestrating autonomous agents...\n")
    result = await orchestrator.run_workflow(user_prompt)
    
    # 4. Display Results
    context = result["final_context"]
    traces = result["all_traces"]

    print("--- WORKFLOW COMPLETED ---")
    print(f"SERVICE: {context['intent']['service_type']}")
    print(f"LOCATION: {context['intent']['location_name']}")
    print(f"TOP MATCH: {context['top_match']['full_name']} (Rating: {context['top_match']['rating']})")
    print(f"FINAL PRICE: {context['pricing']['final_price']} PKR")
    print(f"ESTIMATED ARRIVAL: {context['booking']['arrival_time']}")
    print(f"RELIABILITY UPDATE: {context['reliability_update']['old_score']} -> {context['reliability_update']['new_score']}")
    
    print("\n--- REASONING TRACES (Sample) ---")
    for step in traces[:5]: # Show first 5 agent steps
        print(f"[{step['agent_id'].upper()}] Decision: {step['decision']}")
        for logic in step['reasoning_logic']:
            print(f"  > {logic}")
        print()

    # 5. Save Trace to file for inspection
    with open("data/demo_trace.json", "w") as f:
        json.dump(result, f, indent=2)
    print("\nFull trace saved to data/demo_trace.json")

if __name__ == "__main__":
    asyncio.run(run_demo())
