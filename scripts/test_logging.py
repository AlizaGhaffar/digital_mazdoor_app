import asyncio
import sys
import os
import json

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.services.orchestrator import Orchestrator
from app.agents.intent import IntentAgent
from app.agents.context import ContextAgent

async def test_logging():
    print("Running workflow to generate logs...")
    orchestrator = Orchestrator()
    orchestrator.add_agent(IntentAgent())
    orchestrator.add_agent(ContextAgent())
    
    prompt = "AC kharab hai jaldi aao Gulshan me"
    await orchestrator.run_workflow(prompt)
    
    print("\nVerifying log files...")
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    logs_dir = os.path.join(base_dir, "logs")
    
    expected_files = [
        os.path.join(logs_dir, "orchestrator.log"),
        os.path.join(logs_dir, "traces.jsonl"),
        os.path.join(logs_dir, "error.log")
    ]
    
    for f_path in expected_files:
        if os.path.exists(f_path):
            print(f"[OK] Found: {os.path.basename(f_path)}")
        else:
            print(f"[FAIL] Missing: {os.path.basename(f_path)}")

    workflows_dir = os.path.join(logs_dir, "workflows")
    workflow_files = os.listdir(workflows_dir)
    if workflow_files:
        print(f"[OK] Found {len(workflow_files)} workflow archives.")
        # Verify JSON content of the last one
        last_workflow = os.path.join(workflows_dir, workflow_files[-1])
        with open(last_workflow, "r") as f:
            data = json.load(f)
            if "workflow_id" in data and "all_traces" in data:
                print(f"[OK] Workflow archive {os.path.basename(last_workflow)} is valid JSON.")
    else:
        print("[FAIL] No workflow archives found.")

if __name__ == "__main__":
    asyncio.run(test_logging())
