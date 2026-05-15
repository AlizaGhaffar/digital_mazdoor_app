# Mock Data Specification: Providers

This document defines the structure and sample data for the `data/providers.json` dataset, which will be used to simulate a real-world provider ecosystem.

## 1. Schema Definition

```json
{
  "id": "uuid",
  "full_name": "string",
  "service_type": "AC Repair" | "Plumber" | "Electrician" | "Painter",
  "rating": 1.0 - 5.0,
  "reliability_score": 0 - 100,
  "cancellation_rate": 0.0 - 1.0,
  "base_rate": "decimal",
  "location": {
    "lat": "float",
    "lng": "float",
    "address": "string",
    "neighborhood": "string"
  },
  "verified": "boolean",
  "experience_years": "int",
  "availability": [
    { "day": "Monday", "slots": ["09:00-12:00", "13:00-18:00"] }
  ]
}
```

## 2. Neighborhood Focus (Karachi)

To make the demo realistic, providers will be distributed across key areas:
- Gulshan-e-Iqbal
- DHA (Phase 1-8)
- North Nazimabad
- Clifton
- PECHS

## 3. Sample Entry

```json
{
  "id": "p-101",
  "full_name": "Muhammad Ali",
  "service_type": "AC Repair",
  "rating": 4.8,
  "reliability_score": 95,
  "cancellation_rate": 0.02,
  "base_rate": 1500,
  "location": {
    "lat": 24.9180,
    "lng": 67.0971,
    "address": "Main University Rd, Gulshan-e-Iqbal",
    "neighborhood": "Gulshan"
  },
  "verified": true,
  "experience_years": 10,
  "availability": [
    { "day": "Friday", "slots": ["08:00-13:00", "15:00-20:00"] }
  ]
}
```

## 4. Edge Case Data
The dataset will include:
- **Low-Rated Providers**: To test if the Ranking Agent correctly demotes them.
- **Distant Providers**: To test distance-based filtering.
- **Fully Booked Providers**: To test Scheduling Agent fallback logic.
- **Unverified Providers**: To test risk scoring.
