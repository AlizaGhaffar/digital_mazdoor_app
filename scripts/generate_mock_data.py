import json
import random
import uuid

# Karachi Coordinates (approximate centers)
NEIGHBORHOODS = {
    "Gulshan": (24.9180, 67.0971),
    "DHA": (24.8138, 67.0671),
    "North Nazimabad": (24.9351, 67.0453),
    "Clifton": (24.8211, 67.0271),
    "PECHS": (24.8667, 67.0500)
}

NAMES = ["Muhammad", "Ahmed", "Ali", "Zubair", "Hassan", "Bilal", "Usman", "Hamza", "Kamran", "Faisal"]
SURNAMES = ["Khan", "Ahmed", "Ali", "Sheikh", "Siddiqui", "Qureshi", "Malik", "Raza"]
SERVICES = ["AC Repair", "Plumber", "Electrician", "Painter"]

def generate_providers(count=60):
    providers = []
    for i in range(count):
        nb = random.choice(list(NEIGHBORHOODS.keys()))
        center_lat, center_lng = NEIGHBORHOODS[nb]
        
        # Add slight randomness to coordinates (~2-3km)
        lat = center_lat + random.uniform(-0.02, 0.02)
        lng = center_lng + random.uniform(-0.02, 0.02)
        
        service = random.choice(SERVICES)
        rating = round(random.uniform(3.5, 5.0), 1)
        reliability = random.randint(70, 100)
        base_rate = random.choice([800, 1000, 1200, 1500, 2000])
        
        provider = {
            "id": str(uuid.uuid4()),
            "full_name": f"{random.choice(NAMES)} {random.choice(SURNAMES)}",
            "service_type": service,
            "rating": rating,
            "reliability_score": reliability,
            "cancellation_rate": round(random.uniform(0.0, 0.15), 2),
            "base_rate": base_rate,
            "location": {
                "lat": lat,
                "lng": lng,
                "neighborhood": nb
            },
            "verified": random.choice([True, True, True, False]), # 75% verified
            "experience_years": random.randint(1, 15)
        }
        providers.append(provider)
    
    return providers

if __name__ == "__main__":
    data = generate_providers()
    with open("c:/Users/CDC/Desktop/digital_mazdoor/data/providers.json", "w") as f:
        json.dump(data, f, indent=2)
    print(f"Generated {len(data)} providers.")
