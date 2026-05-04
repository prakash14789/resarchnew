import os
import json
from fastapi import APIRouter, Query

router = APIRouter()

@router.get("/api/map-data")
def get_map_data(
    category: str = Query("all"),
    level: str = Query("all")
):
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "noida_zones.json")
    if not os.path.exists(data_path):
        return {"type": "FeatureCollection", "features": []}
        
    with open(data_path, "r") as f:
        records = json.load(f)
        
    features = []
    for r in records:
        if category != "all" and r.get("category") != category:
            continue
        if level != "all" and r.get("consumption_level") != level:
            continue
            
        feature = {
            "type": "Feature",
            "properties": r,
            "geometry": {
                "type": "Point",
                "coordinates": [r["longitude"], r["latitude"]]
            }
        }
        features.append(feature)
        
    return {"type": "FeatureCollection", "features": features}
