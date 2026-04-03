from flask import Blueprint, request, jsonify  # pyre-ignore[21]
from optimizer import run_optimizer  # pyre-ignore[21]
from config import INDIAN_STATES  # pyre-ignore[21]
import numpy as np, pickle, os, joblib, pandas as pd  # pyre-ignore[21]

power_bp = Blueprint("power", __name__)

# Global cache for the loaded model inside the process
_model_cache = None

def load_model():
    global _model_cache
    if _model_cache: return _model_cache
    try:
        path = "models/power_model_v2.pkl"
        if os.path.exists(path):
            _model_cache = joblib.load(path)
            return _model_cache
    except Exception as e:
        print("Failed to load ML model:", e)
    return None

@power_bp.route("/api/power", methods=["POST"])
def power_crisis():
    data      = request.get_json()
    severity  = int(data.get("severity", 40))
    available = 100 - severity

    model_dict = load_model()
    if model_dict:
        model = model_dict['model']
        features = model_dict['features']
        
        # Build 1-row feature array for prediction
        # Scale some dummy values loosely based on severity
        X = pd.DataFrame(0, index=[0], columns=features)
        demand = model.predict(X)[0]
    else:
        demand = available


    result = run_optimizer("power", available, demand)
    count  = max(1, int((severity / 100) * len(INDIAN_STATES)))

    return jsonify({
        "scenario":        "power_shortage",
        "severity":        severity,
        "available_units": available,
        "allocation":      result["allocation"],
        "total_allocated": result["total_allocated"],
        "recommendation":  result["recommendation"],
        "affected_states": INDIAN_STATES[:count]
    })