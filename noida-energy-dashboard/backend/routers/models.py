from fastapi import APIRouter
from ml.metrics import get_model_metrics

router = APIRouter()

@router.get("/api/models/metrics")
def get_metrics():
    return get_model_metrics()
