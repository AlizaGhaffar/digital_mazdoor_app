# Detailed Implementation Roadmap: Digital Mazdoor

This document breaks down the 5-day plan into specific, granular tasks to ensure strict adherence to Spec-Driven Development.

## DAY 1: Planning & Architecture (COMPLETED)
- [x] Folder structure creation.
- [x] Product Specification (`PRODUCT_SPEC.md`).
- [x] System Architecture (`SYSTEM_ARCHITECTURE.md`).
- [x] Agent Architecture (`AGENT_ARCHITECTURE.md`).
- [x] Workflow Design (`WORKFLOW_DESIGN.md`).
- [x] Database Schema (`DATABASE_SCHEMA.md`).
- [x] API Specification (`API_SPEC.md`).
- [x] Evaluation Mapping (`EVALUATION_MAPPING.md`).

## DAY 2: Backend Foundation
### Phase 1: Environment Setup
- [ ] Initialize FastAPI project.
- [ ] Configure environment variables (Supabase URL, API Keys).
- [ ] Set up global logging with "Trace Support".
### Phase 2: Database & Data
- [ ] Execute SQL schema in Supabase.
- [ ] Generate `data/providers.json` (50+ mock providers with geocodes).
- [ ] Create seed script to populate database.
### Phase 3: Orchestration Layer
- [ ] Initialize Google Antigravity configuration.
- [ ] Implement `BaseAgent` class with trace logging capability.
- [ ] Create the primary `Orchestrator` service.

## DAY 3: Core AI Agents (Reasoning Phase)
### Phase 1: Input Agents
- [ ] **Intent Agent**: LLM prompt for Roman Urdu/English parsing.
- [ ] **Context Extraction Agent**: History-aware enrichment logic.
### Phase 2: Matching Agents
- [ ] **Matching Agent**: PostGIS spatial query implementation.
- [ ] **Ranking Agent**: The multi-factor scoring algorithm.
### Phase 3: Execution Agents
- [ ] **Scheduling Agent**: Availability logic + travel time buffers.
- [ ] **Pricing Agent**: Dynamic calculation engine.

## DAY 4: Booking & Automation (Lifecycle Phase)
### Phase 1: Simulation
- [ ] **Booking Agent**: Atomic transaction logic.
- [ ] **Notification Agent**: Mock SMS/WhatsApp bridge.
### Phase 2: Post-Service
- [ ] **Follow-up Agent**: Scheduled status checks.
- [ ] **Reliability Agent**: Performance score update logic.
### Phase 3: Exceptions
- [ ] **Dispute Agent**: Workflow for no-shows and quality complaints.
- [ ] **Edge Case Handling**: Logic for "No providers found" and "Provider cancellation".

## DAY 5: Frontend & Demo (Visibility Phase)
### Phase 1: Mobile UI
- [ ] Initialize Expo project.
- [ ] Create Request Screen (Chat-style input).
- [ ] Create Provider Selection Screen (with reasoning visibility).
### Phase 2: Trace Visibility
- [ ] Build "Reasoning Trace" component to display agent steps.
- [ ] Implement real-time status updates via Supabase hooks.
### Phase 3: Final Polish
- [ ] End-to-end integration testing.
- [ ] Demo scenario walkthrough (Gulshan AC repair).
- [ ] Final documentation update.
