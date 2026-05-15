import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_KEY")

def seed():
    if not URL or not KEY:
        print("Error: SUPABASE_URL or SUPABASE_KEY not found in environment.")
        return

    supabase: Client = create_client(URL, KEY)

    # Load mock providers
    with open("c:/Users/CDC/Desktop/digital_mazdoor/data/providers.json", "r") as f:
        providers = json.load(f)

    print(f"Seeding {len(providers)} providers...")

    for p in providers:
        # Transform data if necessary to match DB schema
        data = {
            "id": p["id"],
            "full_name": p["full_name"],
            "service_type": p["service_type"],
            "rating": p["rating"],
            "reliability_score": p["reliability_score"],
            "base_rate": p["base_rate"],
            "location": f"POINT({p['location']['lng']} {p['location']['lat']})", # PostGIS format
            "verified": p["verified"]
        }
        
        try:
            supabase.table("providers").upsert(data).execute()
        except Exception as e:
            print(f"Failed to seed {p['full_name']}: {str(e)}")

    print("Seeding complete.")

if __name__ == "__main__":
    seed()
