# Agent Architecture: Digital Mazdoor

Digital Mazdoor utilizes 12 specialized agents orchestrated by **Google Antigravity**. Each agent has a specific scope, decision-making logic, and contribution to the reasoning trace.

## 1. Agent Registry

| # | Agent Name | Primary Responsibility |
| :--- | :--- | :--- |
| 1 | **Intent Agent** | Parses raw user input into a service request (type, time, location). |
| 2 | **Context Extraction Agent** | Enriches requests with user preferences, history, and budget profile. |
| 3 | **Matching Agent** | Filters the provider database for candidates meeting basic criteria. |
| 4 | **Ranking Agent** | Applies multi-factor scoring to rank matched providers. |
| 5 | **Scheduling Agent** | Checks availability, prevents double-booking, and handles travel buffers. |
| 6 | **Pricing Agent** | Calculates dynamic pricing based on urgency, service type, and distance. |
| 7 | **Booking Agent** | Executes the transaction, updates DB, and secures the slot. |
| 8 | **Notification Agent** | Manages outgoing communications (SMS/WhatsApp simulation). |
| 9 | **Follow-up Agent** | Proactively checks status and gathers completion feedback. |
| 10 | **Reliability Agent** | Monitors provider performance and updates reputation scores. |
| 11 | **Provider Opt. Agent** | Suggests improvements to provider profiles or pricing strategies. |
| 12 | **Dispute Agent** | Handles cancellations, no-shows, and quality complaints. |

## 2. Detailed Agent Logic (Samples)

### 2.1 Ranking Agent Logic
- **Input**: List of candidate providers.
- **Scoring Weights**:
    - Distance: 30% (Exponential decay).
    - Rating: 25% (Linear scaling).
    - Reliability: 20% (Based on cancellation rate).
    - Price Fit: 25% (Closeness to user budget).
- **Output**: Ranked list + reasoning for top 3.

### 2.2 Scheduling Agent Logic
- **Constraints**: 
    - Job Duration + 30m travel buffer.
    - Provider operating hours.
    - User preferred time slot.
- **Fallback**: If preferred slot is taken, propose the next 2 closest available slots.

## 3. Communication Patterns

Agents communicate through a **Shared Context Object** (State) managed by Antigravity.

1. **Sequential Chain**: Intent → Context → Matching → Ranking.
2. **Parallel Evaluation**: Pricing and Scheduling can run simultaneously once candidates are ranked.
3. **Reactive Trigger**: Notification and Follow-up agents trigger based on state changes (e.g., `booking_status` changed to `confirmed`).

## 4. Reasoning Trace Generation

Each agent is required to append a `ReasoningStep` to the global trace.

**Example: Pricing Agent Reasoning**
> "Base price for AC Repair: 1500 PKR. Added 200 PKR for 'Urgent' status. Total: 1700 PKR. Reasoning: High demand in Gulshan area and user requested 'Morning' slot."

## 5. Fallback Mechanisms

- **Matching Failure**: If no providers are found, the `Matching Agent` triggers a "Relax Criteria" mode, increasing search radius or considering lower-rated providers with a warning.
- **Dispute Escalation**: If the `Dispute Agent` cannot resolve a conflict automatically, it flags the transaction for "Human/Admin Review" (simulated).
