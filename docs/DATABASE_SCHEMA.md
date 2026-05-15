# Database Schema: Digital Mazdoor

The database (Supabase/PostgreSQL) is designed to support multi-agent orchestration, reasoning traces, and history tracking.

## 1. Tables

### `users`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Primary Key. |
| `phone` | TEXT | Unique identifier (common in informal economy). |
| `full_name` | TEXT | User's name. |
| `preferences` | JSONB | Budget sensitivity, preferred languages, etc. |
| `reputation_score`| INT | Score for reliability. |
| `created_at` | TIMESTAMP | |

### `providers`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Primary Key. |
| `full_name` | TEXT | Provider's name. |
| `service_type` | TEXT | e.g., "AC Repair", "Plumber". |
| `location` | GEOGRAPHY | PostGIS point for distance calculations. |
| `base_rate` | DECIMAL | Base price for service. |
| `rating` | FLOAT | Average user rating. |
| `reliability_score`| INT | Derived from cancellation history. |
| `availability` | JSONB | Operating hours and current status. |
| `is_verified` | BOOLEAN | Verification status. |

### `bookings`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Primary Key. |
| `user_id` | UUID (FK) | Reference to `users`. |
| `provider_id` | UUID (FK) | Reference to `providers`. |
| `status` | TEXT | e.g., "pending", "confirmed", "completed", "disputed". |
| `scheduled_at` | TIMESTAMP | Date and time of service. |
| `actual_price` | DECIMAL | Final price calculated by Pricing Agent. |
| `reasoning_trace_id`| UUID (FK)| Link to the trace for this booking. |

### `reasoning_traces`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Primary Key. |
| `request_id` | TEXT | Link to the original user request. |
| `steps` | JSONB | Array of `TraceObject` from all agents. |
| `final_decision` | TEXT | Brief summary of the outcome. |
| `created_at` | TIMESTAMP | |

### `disputes`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Primary Key. |
| `booking_id` | UUID (FK) | Reference to `bookings`. |
| `type` | TEXT | "no-show", "quality", "pricing". |
| `status` | TEXT | "open", "resolved", "escalated". |
| `resolution_trace` | JSONB | Agent reasoning for the resolution. |

## 2. Enums & Types

- **BookingStatus**: `PENDING`, `CONFIRMED`, `EN_ROUTE`, `COMPLETED`, `CANCELLED`, `DISPUTED`.
- **UserType**: `SEEKER`, `PROVIDER`.

## 3. Relationships

- One **User** can have many **Bookings**.
- One **Provider** can have many **Bookings**.
- Each **Booking** has exactly one **ReasoningTrace**.
- Each **Booking** can have at most one **Dispute**.

## 4. Performance Considerations

- **Spatial Index**: GIST index on `providers.location` for fast "near me" queries.
- **JSONB Indexing**: GIN index on `reasoning_traces.steps` for auditing and search.
