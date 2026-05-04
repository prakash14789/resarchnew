import json
import random
import os
import uuid

def generate_seed_data():
    localities = [
        "Sector 18", "Sector 62", "Sector 137", "Sector 150", 
        "Sector 44", "Kasna", "Knowledge Park III", "Alpha I",
        "Beta II", "Gamma I", "Delta", "Sector 16", "Sector 93A"
    ]
    
    records = []
    
    # 200 household + 130 commercial
    total_residential = 200
    total_commercial = 130
    
    for i in range(total_residential + total_commercial):
        category = "residential" if i < total_residential else "commercial"
        
        # Predicted kWh
        if category == "residential":
            predicted_kwh = random.uniform(50, 500)
            if predicted_kwh < 150:
                consumption_level = "low"
            elif predicted_kwh < 300:
                consumption_level = "medium"
            else:
                consumption_level = "high"
            
            area_sqft = random.randint(500, 3000)
            occupants = random.randint(1, 8)
            appliance_count = random.randint(2, 15)
        else:
            predicted_kwh = random.uniform(200, 2000)
            if predicted_kwh < 600:
                consumption_level = "low"
            elif predicted_kwh < 1200:
                consumption_level = "medium"
            else:
                consumption_level = "high"
                
            area_sqft = random.randint(1000, 20000)
            occupants = random.randint(10, 500)
            appliance_count = random.randint(10, 100)
            
        record = {
            "id": str(uuid.uuid4()),
            "name": random.choice(localities),
            "latitude": random.uniform(28.45, 28.65),
            "longitude": random.uniform(77.28, 77.55),
            "predicted_kwh": round(predicted_kwh, 2),
            "power_watts": round(predicted_kwh * 41.67, 2),
            "category": category,
            "consumption_level": consumption_level,
            "area_sqft": area_sqft,
            "occupants": occupants,
            "month": random.randint(1, 12),
            "appliance_count": appliance_count
        }
        records.append(record)
        
    out_path = os.path.join(os.path.dirname(__file__), "noida_zones.json")
    with open(out_path, "w") as f:
        json.dump(records, f, indent=2)
    print(f"Generated {len(records)} records at {out_path}")

if __name__ == "__main__":
    generate_seed_data()
