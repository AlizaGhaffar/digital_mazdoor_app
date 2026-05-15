# Digital Mazdoor — Agentic AI Service Orchestrator

Digital Mazdoor is a production-style Agentic AI system designed to formalize and automate the informal economy's service lifecycle. Powered by **Google Antigravity**, it orchestrates specialized autonomous agents to handle everything from intent parsing to provider matching and dispute resolution.

## 🚀 Key Features

- **Multilingual Intent Parsing**: Handles Urdu, Roman Urdu, and English requests seamlessly.
- **Agentic Orchestration**: 12+ specialized agents working in a dynamic pipeline.
- **Visible Reasoning Traces**: Complete transparency in AI decision-making (Signature Feature).
- **Intelligent Ranking**: Multi-factor provider scoring (Reliability, Proximity, Rating, Price).
- **Mobile-First Experience**: Premium React Native (Expo) app for service seekers.

## 🏗️ System Architecture

The system follows a modular agentic architecture:

1. **Frontend**: React Native Expo (Mobile App)
2. **Backend**: FastAPI (Python)
3. **Orchestrator**: Google Antigravity (Agent Coordination)
4. **Database**: Supabase (PostgreSQL)

### Agent Workflow
`Intent Agent` → `Context Agent` → `Matching Agent` → `Ranking Agent` → `Scheduling Agent` → `Pricing Agent` → `Booking Agent` → `Notification Agent`

## 📂 Project Structure

- `backend/`: FastAPI server and AI agent implementations.
- `frontend/`: React Native mobile application.
- `docs/`: Detailed specifications and architecture diagrams.
- `scripts/`: Development and testing utilities.
- `data/`: Mock data for providers and services.

## 🛠️ Setup & Installation

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. Create `.env` file with `SUPABASE_URL` and `SUPABASE_KEY`.
4. `uvicorn app.main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npx expo start`

## 🎥 Demo Journey

1. **Discovery**: Browse services on the premium marketplace UI.
2. **Request**: Type a request in Roman Urdu (e.g., "AC repair chahiye Gulshan me").
3. **Analysis**: Watch the AI analyze intent and context in real-time.
4. **Reasoning**: Inspect the **AI Trace Viewer** to see step-by-step logic.
5. **Matching**: Review ranked providers with AI confidence scores.
6. **Booking**: Confirm the booking and view scheduled details.
7. **History**: Track past workflows and reasoning archives.

---

*Built for the Future of the Informal Economy.*

