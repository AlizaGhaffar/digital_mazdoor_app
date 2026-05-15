from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

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
from app.agents.provider_opt import ProviderOptAgent

app = FastAPI(
    title="Digital Mazdoor API",
    description="Agentic AI Service Orchestrator",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OrchestrationRequest(BaseModel):
    user_id: str = "guest"
    prompt: str

@app.post("/v1/orchestrate")
async def orchestrate(request: OrchestrationRequest):
    orchestrator = Orchestrator()
    
    # Register agents
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

    try:
        result = await orchestrator.run_workflow(request.prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
