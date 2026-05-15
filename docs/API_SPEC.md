# API Specification: Digital Mazdoor

The backend is built with FastAPI, providing RESTful endpoints for the mobile app and internal tools for the agents.

## 1. External Endpoints (Mobile App)

### `POST /v1/orchestrate`
Triggers the full agentic workflow from a raw user prompt.
- **Request Body**:
  ```json
  {
    "user_id": "uuid",
    "prompt": "Mujhe kal Gulshan mein AC technician chahiye"
  }
  ```
- **Response**:
  ```json
  {
    "booking_id": "uuid",
    "provider": { "name": "...", "rating": 4.8 },
    "scheduled_at": "...",
    "reasoning_trace": [ ... ]
  }
  ```

### `GET /v1/bookings/{id}`
Retrieves booking details and real-time status.

### `POST /v1/disputes`
Initiates a dispute for a completed or cancelled booking.

---

## 2. Internal Agent Tools (FastAPI)

Agents use these internal tools to interact with the system.

### `SearchTool`
- **Purpose**: Query the provider database.
- **Parameters**: `location`, `service_type`, `min_rating`.

### `AvailabilityTool`
- **Purpose**: Check if a provider is free for a given slot.
- **Parameters**: `provider_id`, `start_time`, `duration`.

### `PricingTool`
- **Purpose**: Calculate the optimal price for a service.
- **Parameters**: `base_rate`, `urgency_multiplier`, `distance_fee`.

### `CommsTool`
- **Purpose**: Simulate SMS/WhatsApp notifications.
- **Parameters**: `phone`, `message_template`, `variables`.

---

## 3. Webhooks

### `Supabase Auth Webhook`
- **Trigger**: New user sign-up.
- **Action**: Create a record in the `users` or `providers` table.

### `Booking Status Hook`
- **Trigger**: Change in `booking.status`.
- **Action**: Notify the `Notification Agent` to send updates.

---

## 4. Error Codes

| Code | Description |
| :--- | :--- |
| `NO_PROVIDER_FOUND` | Matching Agent found zero candidates. |
| `INSUFFICIENT_CONTEXT` | Prompt was too vague (handled by Intent Agent). |
| `SCHEDULING_CONFLICT` | Selected slot is no longer available. |
| `AGENT_FAILURE` | An internal agent timeout or error. |
