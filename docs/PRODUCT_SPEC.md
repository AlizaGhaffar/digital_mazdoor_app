# Product Specification: Digital Mazdoor

## 1. Executive Summary
Digital Mazdoor is an AI-driven platform that automates the service discovery and booking process for the informal economy. It uses a suite of autonomous agents to interpret user needs, find the best providers, manage schedules, and handle post-service workflows.

## 2. Target Audience
- **Service Seekers**: Individuals looking for reliable informal services (AC repair, plumbing, electrical, etc.) who communicate via mixed languages (English/Urdu).
- **Service Providers (Mazdoors)**: Skilled laborers in the informal sector who need better visibility and organized scheduling.

## 3. User Stories

### 3.1 Service Seeker Stories
- *As a user, I want to state my requirement in my natural language (e.g., Roman Urdu) so that I don't have to navigate complex forms.*
- *As a user, I want to see WHY a specific provider was recommended to me so that I can trust the selection.*
- *As a user, I want the system to handle the booking and reminders automatically so that I don't forget.*

### 3.2 Service Provider Stories
- *As a provider, I want to receive optimized bookings that consider my current location and travel time.*
- *As a provider, I want to be protected from unfair cancellations or disputes through an automated AI review.*

## 4. Functional Requirements

### 4.1 Intent & Context Extraction
- Support for multilingual input (English, Urdu, Roman Urdu).
- Extraction of: Service Type, Location, Time, Budget, Urgency.

### 4.2 Provider Discovery & Ranking
- Searchable provider database with attributes (rating, location, specialization).
- Ranking algorithm considering:
    - Distance & Travel Time.
    - Provider Reputation (Rating, Reliability).
    - Historical Performance (Cancellation Rate).
    - Pricing Alignment.

### 4.3 Autonomous Scheduling
- Real-time availability checks.
- Double-booking prevention.
- Automatic buffer time insertion between jobs.

### 4.4 Booking & Follow-up
- Automated booking confirmation.
- SMS/WhatsApp simulation for notifications.
- Proactive reminders (T-24h, T-1h, En-route).

### 4.5 Dispute & Reliability Management
- Automated detection of no-shows or cancellations.
- Multi-step dispute resolution workflow.

## 5. Non-Functional Requirements

### 5.1 Visibility (Core Priority)
- Every agentic decision must be logged and presented as a "Reasoning Trace" in the UI.

### 5.2 Performance
- Orchestration latency should be minimized for a responsive feel.

### 5.3 Scalability
- The architecture must support adding new agent types or service categories without core rewrites.

## 6. Success Metrics
- **Matching Accuracy**: How well the recommended provider fits the user's specific constraints.
- **Reasoning Depth**: The complexity and transparency of the AI's decision-making logs.
- **Workflow Completion**: Rate of successful bookings without manual intervention.
