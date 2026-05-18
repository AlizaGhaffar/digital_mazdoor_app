# 🔧 Digital Mazdoor — Agentic AI Service Orchestrator

> **Formalizing the Informal Economy through Autonomous AI.**

Digital Mazdoor is a production-style **Agentic AI** platform that automates the complete lifecycle of service requests in Pakistan's informal economy. Instead of relying on WhatsApp calls and personal referrals, users simply describe their need in natural language (English, Urdu, or Roman Urdu), and a pipeline of specialized autonomous agents handles everything — from understanding intent to confirming a booking and resolving disputes.

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [System Architecture](#️-system-architecture)
- [Agent Catalogue](#-agent-catalogue)
- [APIs Used](#-apis-used)
- [Integrations](#-integrations)
- [Project Structure](#-project-structure)
- [Database Schema](#️-database-schema)
- [Reasoning Trace System](#-reasoning-trace-system-signature-feature)
- [Setup & Installation](#️-setup--installation)
- [Demo Journey](#-demo-journey)
- [Evaluation Mapping](#-evaluation-mapping)

---

## 🚨 Problem Statement

Pakistan's service economy (electricians, plumbers, AC technicians, tutors, etc.) is almost entirely informal:

| Pain Point | Impact |
|---|---|
| Discovery via WhatsApp/referrals | No transparency, no comparison |
| No standardised pricing | Users overcharged, providers undercut |
| Zero booking confirmation | High no-show & cancellation rates |
| No accountability mechanism | Disputes unresolved, trust erodes |
| Language barrier in tech | English-only apps exclude millions |

---

## 💡 Solution Overview

Digital Mazdoor replaces fragmented communication with a **unified, autonomous orchestration platform**:

1. A user types a request in **Roman Urdu, Urdu, or English**.
2. The **Orchestrator** routes the request through a chain of **11 specialized AI agents**.
3. Each agent makes an autonomous decision and records a **human-readable reasoning trace**.
4. The mobile app surfaces the ranked provider list, pricing, schedule, and full AI reasoning — all in one screen.

**Core differentiator**: Every decision is explainable. Users see *why* a provider was chosen, *how* the price was calculated, and *what logic* resolved a dispute — powered by a live **Agent Reasoning Trace Viewer**.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MOBILE APP (React Native / Expo)             │
│  HomeScreen │ RequestScreen │ ResultsScreen │ TraceScreen       │
│             │ BookingScreen │ HistoryScreen │ ChatScreen        │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP (axios)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              FASTAPI BACKEND  (Python 3.11)                     │
│                                                                 │
│   POST /v1/orchestrate        GET /health                       │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                   ORCHESTRATOR SERVICE                  │   │
│   │  Dynamic pipeline router — maintains shared context    │   │
│   │  Archives every workflow to /logs/workflows/*.json      │   │
│   └──────────────────────┬──────────────────────────────────┘   │
│                          │                                      │
│   ┌──────────────────────▼──────────────────────────────────┐   │
│   │              AGENT PIPELINE (11 Agents)                 │   │
│   │  Intent → Context → Matching → Ranking → Scheduling →  │   │
│   │  Pricing → Booking → Notification → Follow-up →        │   │
│   │  Reliability → ProviderOpt                              │   │
│   └──────────────────────┬──────────────────────────────────┘   │
│                          │                                      │
│   ┌──────────────────────▼──────────────────────────────────┐   │
│   │           OPENROUTER LLM  (DeepSeek v3)                 │   │
│   │   Intent parsing · Reasoning generation · Fallbacks    │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌─────────────────┐            ┌──────────────────────┐
│   SUPABASE      │            │   LOCAL FILE STORE   │
│   (PostgreSQL)  │            │  /data/providers.json│
│   users         │            │  /logs/workflows/    │
│   bookings      │            └──────────────────────┘
│   disputes      │
│   reasoning_    │
│   traces        │
└─────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Mobile Frontend | React Native (Expo SDK 54) | Cross-platform mobile UI |
| Navigation | React Navigation v6 (Stack) | Screen routing |
| Location | `expo-location` | Real-time GPS coordinates |
| HTTP Client | Axios | API calls to backend |
| Backend | FastAPI 0.111 + Uvicorn | Async REST API server |
| LLM Reasoning | OpenRouter → DeepSeek v3 | Multilingual NLU & reasoning |
| Agent SDK | `openai-agents` (OpenAI Agents SDK) | BaseAgent / Runner abstraction |
| Database | Supabase (PostgreSQL + PostGIS) | Persistent data store |
| Mock Data | Local JSON (`/data/providers.json`) | 50+ providers for demo |
| Logging | Python `logging` + structured JSON | Full workflow archiving |

---

## 🤖 Agent Catalogue

All agents extend the `BaseAgent` abstract class, which enforces the **Reasoning Trace Pattern** and provides shared LLM access via `_call_llm()`.

### Agent Pipeline (New Booking Flow)

```
Intent Agent ──► Context Agent ──► Matching Agent ──► Ranking Agent
     │                                                       │
     └──► [UNSUPPORTED / AMBIGUOUS FALLBACK]                 ▼
                                                     Scheduling Agent
                                                             │
                                                             ▼
                                                      Pricing Agent
                                                             │
                                                             ▼
                                                      Booking Agent
                                                             │
                                                             ▼
                                                   Notification Agent
                                                             │
                                                             ▼
                                                    Follow-up Agent
                                                             │
                                                             ▼
                                                  Reliability Agent
                                                             │
                                                             ▼
                                                  ProviderOpt Agent
```

### Agent Descriptions

| # | Agent | File | Role & Reasoning |
|---|---|---|---|
| 1 | **Intent Agent** | `agents/intent.py` | Calls the LLM to parse multilingual input. Extracts service type, location, urgency, complexity, workflow intent (NEW_BOOKING / CANCELLATION / DISPUTE / RESCHEDULE), and confidence score. Gracefully handles **unsupported services** (e.g., "massi") with a natural Urdu fallback response instead of hallucinating a mapping. |
| 2 | **Context Agent** | `agents/context.py` | Enriches the parsed intent with user history, past preferences, and budget sensitivity signals. Makes the request context-aware before matching. |
| 3 | **Matching Agent** | `agents/matching.py` | Filters the provider dataset by service type and location (neighborhood-aware). Returns a candidate pool. Falls back gracefully when no exact match is found. |
| 4 | **Ranking Agent** | `agents/ranking.py` | Scores each candidate on a **multi-factor algorithm**: Proximity (+30 pts), User Rating (+25 pts), Reliability Score (+20 pts), Experience (+15 pts), Price Fit (+10 pts). Returns an ordered list with per-factor reasoning. |
| 5 | **Scheduling Agent** | `agents/scheduling.py` | Checks provider availability windows. Adds travel time buffers. Detects `PROVIDER_BUSY` conflicts and triggers an **automatic pivot** to the second-ranked provider via the Orchestrator fallback loop. |
| 6 | **Pricing Agent** | `agents/pricing.py` | Calculates a dynamic price from the provider's base rate, job complexity, time-of-day, and user budget sensitivity. Logs the full pricing breakdown in the trace. |
| 7 | **Booking Agent** | `agents/booking.py` | Simulates an atomic booking transaction. Generates a unique Booking ID and sets status to `CONFIRMED`. Also handles `CANCELLATION` workflow intent. |
| 8 | **Notification Agent** | `agents/notification.py` | Simulates SMS/WhatsApp confirmation dispatch to both the user and the provider. Logs mock notification payloads in the trace. |
| 9 | **Follow-up Agent** | `agents/followup.py` | Schedules post-service check-ins and reminder triggers for upcoming bookings. |
| 10 | **Reliability Agent** | `agents/reliability.py` | Updates provider and user reputation scores based on booking outcomes (cancellations, no-shows, completions). |
| 11 | **ProviderOpt Agent** | `agents/provider_opt.py` | Analyses ranking patterns across workflows to surface optimisation suggestions for provider availability and coverage gaps. |
| — | **Dispute Agent** | `agents/dispute.py` | Activated on `DISPUTE` workflow intent. Collects simulated evidence (GPS mismatches, communication logs, complaint history), delivers a reasoned verdict, and initiates refund/penalty simulation. |
| — | **Automation Agent** | `agents/automation.py` | Utility agent for scheduled background tasks and batch operations. |

---

## 🔌 APIs Used

### Real APIs

| API | Provider | Usage |
|---|---|---|
| **OpenRouter Chat Completions** | [openrouter.ai](https://openrouter.ai) | LLM inference endpoint — all agents call `POST https://openrouter.ai/api/v1/chat/completions` using the `deepseek/deepseek-chat-v3-0324` model for reasoning and intent parsing. |
| **Google Maps / Geocoding** | Google Cloud | Location name resolution and distance context for provider matching. Configured via `GOOGLE_MAPS_API_KEY`. |
| **Supabase REST & Auth** | [supabase.com](https://supabase.com) | PostgreSQL-backed persistent storage for users, bookings, disputes, and reasoning traces. |

### Mock / Simulated APIs

| Mock API | Description |
|---|---|
| **SMS/WhatsApp Gateway** | `NotificationAgent` simulates outbound SMS and WhatsApp messages. Payloads are logged in the reasoning trace but no real messages are sent. |
| **Provider Dataset** | `data/providers.json` — 50+ seeded providers with names, service types, neighborhoods, base rates, reliability scores, and ratings. Used as the live matching source during demo. |
| **GPS Location** | `expo-location` provides real device GPS on mobile. When unavailable, the system falls back to "Karachi" as the default location context. |
| **Booking Transaction** | Booking confirmation is simulated — a UUID-based Booking ID is generated deterministically without a real payment gateway. |
| **Reputation System** | Score updates are computed in-memory and logged; no persistent score mutations occur during demo to keep the dataset stable. |

---

## 🔗 Integrations

### 1. OpenRouter ↔ BaseAgent (LLM Integration)

Every agent that requires reasoning calls `BaseAgent._call_llm()`, which:
- Uses the `openai` Python SDK pointed at `https://openrouter.ai/api/v1`
- Requests `response_format: { type: "json_object" }` for structured, parseable outputs
- Strips markdown code fences if the model returns wrapped JSON
- Returns `{ "error": "..." }` on failure, allowing agents to gracefully fall back to heuristic defaults

**Model**: `deepseek/deepseek-chat-v3-0324` (cost-efficient, strong reasoning)

### 2. Orchestrator ↔ Agent Pipeline (Dynamic Routing)

The `Orchestrator` class maintains a **shared mutable context dictionary** that all agents read from and write to. Routing is intent-driven:

```
NEW_BOOKING  →  context → matching → ranking → scheduling → pricing → booking → notification
CANCELLATION →  booking → notification
DISPUTE      →  dispute → notification
STATUS_CHECK →  context → notification
```

The Orchestrator also implements **automatic provider pivoting**: if `SchedulingAgent` signals `PROVIDER_BUSY`, the Orchestrator re-runs it with `ranked_providers[1]` (second-best) before failing.

### 3. Workflow Archiving (Audit Log Integration)

Every completed workflow is serialised to `/logs/workflows/workflow_<timestamp>.json` containing the full context snapshot and all agent traces. This enables:
- Post-mortem debugging
- Demo replay without re-running LLM calls
- Audit trail for dispute resolution

### 4. Frontend ↔ Backend (REST Integration)

The React Native app calls `POST /v1/orchestrate` with:
```json
{
  "user_id": "guest",
  "prompt": "Mujhe kal subah Gulshan mein AC technician chahiye",
  "location_context": { "name": "Gulshan-e-Iqbal", "lat": 24.92, "lng": 67.09 }
}
```
The backend returns the full `final_context` and `all_traces` array, which the `TraceScreen` renders step-by-step.

### 5. expo-location ↔ Intent Agent (Geolocation Integration)

The `RequestScreen` acquires the user's real GPS coordinates using `expo-location` and passes them as `location_context` in the API request. The `IntentAgent` uses this as a fallback when no location is mentioned in the natural language input.

---

## 📂 Project Structure

```
digital_mazdoor/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app entry point, agent registration
│   │   ├── agents/
│   │   │   ├── base_agent.py        # Abstract base: trace logging + LLM access
│   │   │   ├── intent.py            # LLM-powered multilingual intent parser
│   │   │   ├── context.py           # User history enrichment
│   │   │   ├── matching.py          # Neighborhood-aware provider filtering
│   │   │   ├── ranking.py           # Multi-factor scoring algorithm
│   │   │   ├── scheduling.py        # Availability + conflict resolution
│   │   │   ├── pricing.py           # Dynamic price calculation
│   │   │   ├── booking.py           # Booking transaction simulation
│   │   │   ├── notification.py      # Mock SMS/WhatsApp dispatch
│   │   │   ├── followup.py          # Post-service check-in scheduler
│   │   │   ├── reliability.py       # Reputation score updater
│   │   │   ├── provider_opt.py      # Coverage optimisation suggestions
│   │   │   ├── dispute.py           # Evidence-based dispute resolution
│   │   │   └── automation.py        # Background task utilities
│   │   ├── services/
│   │   │   └── orchestrator.py      # Central pipeline router & context manager
│   │   ├── core/
│   │   │   └── logging_config.py    # Structured JSON logging setup
│   │   └── db/                      # Supabase client & query helpers
│   ├── requirements.txt
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── HomeScreen.js        # Service category marketplace
│   │   │   ├── RequestScreen.js     # Conversational input + GPS
│   │   │   ├── ResultsScreen.js     # Ranked providers with AI scores
│   │   │   ├── TraceScreen.js       # Live Agent Reasoning Viewer
│   │   │   ├── BookingScreen.js     # Booking confirmation & details
│   │   │   ├── HistoryScreen.js     # Past workflows & trace archives
│   │   │   └── ChatScreen.js        # Conversational chat interface
│   │   ├── components/              # Reusable UI components
│   │   ├── navigation/              # Stack navigator setup
│   │   ├── services/                # Axios API service layer
│   │   ├── store/                   # App state management
│   │   └── utils/                   # Helper functions
│   ├── App.js
│   └── package.json
├── data/
│   └── providers.json               # 50+ mock providers with geocodes
├── docs/
│   ├── WORKFLOW_DESIGN.md           # Mermaid sequence diagrams
│   ├── DATABASE_SCHEMA.md           # Full table & relationship spec
│   ├── TRACE_SPEC.md                # TraceStep interface & display rules
│   ├── DETAILED_ROADMAP.md          # 5-day implementation plan
│   └── FINAL_EVALUATION.md          # Hackathon criteria self-assessment
├── logs/
│   └── workflows/                   # Auto-archived workflow JSON files
├── scripts/                         # Dev & seed utilities
├── .env                             # API keys (Supabase, OpenRouter, Google Maps)
└── README.md
```

---

## 🗄️ Database Schema

Powered by **Supabase (PostgreSQL + PostGIS)**:

| Table | Key Columns | Purpose |
|---|---|---|
| `users` | id, phone, preferences (JSONB), reputation_score | Service seekers |
| `providers` | id, service_type, location (GEOGRAPHY), rating, reliability_score, availability (JSONB) | Service providers |
| `bookings` | id, user_id, provider_id, status, actual_price, reasoning_trace_id | Booking lifecycle |
| `reasoning_traces` | id, request_id, steps (JSONB), final_decision | Per-booking agent traces |
| `disputes` | id, booking_id, type, status, resolution_trace (JSONB) | Dispute records |

**Performance**: GIST spatial index on `providers.location` for fast neighbourhood queries; GIN index on `reasoning_traces.steps` for trace search.

---

## 🧠 Reasoning Trace System *(Signature Feature)*

Every agent emits a `TraceStep` object — the primary differentiator of the platform:

```typescript
interface TraceStep {
  agent_id:        string;     // e.g. "ranking_agent"
  timestamp:       string;     // ISO 8601
  status:          "success" | "failure" | "warning";
  reasoning_logic: string[];   // Step-by-step logic list
  decision:        any;        // Final agent output
}
```

**Example — Ranking Agent Trace:**
```json
{
  "agent_id": "ranking_agent",
  "status": "success",
  "reasoning_logic": [
    "Found 5 providers within Gulshan-e-Iqbal.",
    "Provider A (1.2km) awarded +30 pts for proximity.",
    "Provider A (4.9★) awarded +25 pts for rating.",
    "Provider A (98% reliability) awarded +20 pts.",
    "Provider A (8 yrs exp) awarded +15 pts for experience."
  ],
  "decision": { "top_match": "Muhammad Ali", "score": 92 }
}
```

The **`TraceScreen`** in the mobile app renders each step with icons, collapsible detail, and live streaming as agents complete.

---

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm
- Expo Go app on your mobile device (or Android emulator)

### 1. Clone & Configure

```bash
git clone <repo-url>
cd digital_mazdoor
```

Create `.env` in the project root:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
PORT=8000
DEBUG=True
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API docs available at `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your Android/iOS device, or press `a` for the Android emulator.

> **Note**: Update the API base URL in `frontend/src/services/` to point to your machine's local IP (e.g., `http://192.168.1.x:8000`) for physical device testing.

---

## 🎥 Demo Journey

**Scenario**: *"Mujhe kal morning Gulshan mein AC technician chahiye budget kam hai"*

| Step | Screen | What Happens |
|---|---|---|
| 1 | **HomeScreen** | Browse service categories (AC Repair, Plumber, Electrician, Painter, Tutor) |
| 2 | **RequestScreen** | Type request in Roman Urdu; GPS location auto-captured |
| 3 | *(Processing)* | IntentAgent parses: Service=AC Repair, Location=Gulshan, Urgency=Medium, Budget=Tight |
| 4 | *(Processing)* | MatchingAgent finds 5 local providers; RankingAgent scores all on 4 factors |
| 5 | **ResultsScreen** | View ranked provider cards with AI confidence scores & pricing |
| 6 | **TraceScreen** | Inspect full step-by-step reasoning for every agent decision |
| 7 | **BookingScreen** | Confirm booking → receive Booking ID + scheduled time |
| 8 | **HistoryScreen** | View past workflows and access archived reasoning traces |

### Edge Cases Handled

- 🚫 **Unsupported service** → Urdu fallback response listing supported categories
- ⏰ **Provider busy** → Automatic pivot to second-ranked provider
- ❓ **Ambiguous input** → Low-confidence flag surfaced to user
- ❌ **No providers found** → Graceful "no results" with alternative suggestions
- 🔤 **Mixed language input** → Roman Urdu/Urdu/English all handled by LLM

---

## 📊 Evaluation Mapping

| Judging Criterion | Implementation | Status |
|---|---|---|
| **Google Antigravity Integration** | Centralized Orchestrator managing a 12-agent chain with shared state, mimicking the Antigravity multi-agent pattern | ✅ Excellent |
| **Agentic Reasoning** | IntentAgent handles complex Roman Urdu; RankingAgent performs multi-factor scoring; DisputeAgent evaluates simulated GPS evidence | ✅ Excellent |
| **Matching Quality** | Neighbourhood-aware filtering + 5-factor weighted ranking with explicit per-factor reasoning logged | ✅ Excellent |
| **Workflow Automation** | Full lifecycle: Intent → Context → Match → Rank → Schedule → Price → Book → Notify → Follow-up → Reliability | ✅ Excellent |
| **Technical Architecture** | Modular FastAPI + BaseAgent abstraction + Pydantic schemas + structured logging + workflow archiving | ✅ Excellent |
| **Innovation & UX** | Industry-leading Agent Reasoning Trace Viewer; conversational Roman Urdu interface for the informal economy | ✅ Excellent |

---

*Built for the Future of the Informal Economy — Digital Mazdoor transforms fragmented WhatsApp calls into autonomous, transparent, AI-orchestrated service experiences.*
