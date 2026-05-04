from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ml.trainer import TRAINED_MODELS
import numpy as np

router = APIRouter()

class PredictionRequest(BaseModel):
    area_sqft: int
    occupants: int
    appliance_count: int
    month: int
    category: str
    model_name: str

@router.post("/api/predict")
def predict(req: PredictionRequest):
    if not TRAINED_MODELS:
        raise HTTPException(status_code=500, detail="Models not trained yet")
        
    model = TRAINED_MODELS.get(req.model_name)
    if not model:
        # Fallback to the first available model if the requested one is not found
        model_name = list(TRAINED_MODELS.keys())[0]
        model = TRAINED_MODELS[model_name]
    else:
        model_name = req.model_name
        
    category_encoded = 0 if req.category == "residential" else 1
    features = np.array([[req.area_sqft, req.occupants, req.appliance_count, req.month, category_encoded]])
    
    pred_kwh = float(model.predict(features)[0])
    
    # Auto-classify
    if req.category == "residential":
        if pred_kwh < 150:
            level = "low"
        elif pred_kwh < 300:
            level = "medium"
        else:
            level = "high"
    else:
        if pred_kwh < 600:
            level = "low"
        elif pred_kwh < 1200:
            level = "medium"
        else:
            level = "high"
            
    power_watts = pred_kwh * 41.67
    
    return {
        "predicted_kwh": round(pred_kwh, 2),
        "power_watts": round(power_watts, 2),
        "consumption_level": level,
        "model_used": model_name
    }
