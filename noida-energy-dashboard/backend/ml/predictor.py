import joblib
import os
import numpy as np

def predict_energy(features, model_name="xgboost"):
    ml_dir = os.path.dirname(__file__)
    if model_name == "xgboost":
        model_path = os.path.join(ml_dir, 'xgb_model.pkl')
    else:
        model_path = os.path.join(ml_dir, 'rf_model.pkl')
        
    if not os.path.exists(model_path):
        from .trainer import train_models
        train_models()
        
    model = joblib.load(model_path)
    # Features expected as 2D array: [[population, area, temperature]]
    pred = model.predict(np.array([features]))
    return float(pred[0])
