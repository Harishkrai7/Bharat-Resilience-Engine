from flask import Blueprint, request, jsonify  # pyre-ignore[21]
from optimizer import run_optimizer  # pyre-ignore[21]
from config import INDIAN_STATES  # pyre-ignore[21]
import numpy as np, pickle, os, joblib, pandas as pd  # pyre-ignore[21]

water_bp = Blueprint("water", __name__)

_model_cache = None
_features_cache = None

def load_model_and_features():
    global _model_cache, _features_cache
    if _model_cache and _features_cache: return _model_cache, _features_cache
    try:
        model_path = "models/water_rf.pkl"
        feat_path = "models/water_feature_names.pkl"
        if os.path.exists(model_path) and os.path.exists(feat_path):
            _model_cache = joblib.load(model_path)
            _features_cache = joblib.load(feat_path)
            return _model_cache, _features_cache
    except Exception as e:
        print("Failed to load Water ML model:", e)
    return None, None

@water_bp.route("/api/water", methods=["POST"])
def water_crisis():
    data      = request.get_json()
    severity  = int(data.get("severity", 40))
    available = 100 - severity

    model, features = load_model_and_features()
    if model and features:
        X_df = pd.DataFrame(0, index=[0], columns=features)
        demand = model.predict(X_df.values)[0]
    else:
        demand = available

    result = run_optimizer("water", available, demand)
    count  = max(1, int((severity / 100) * len(INDIAN_STATES)))

    return jsonify({
        "scenario":        "water_management",
        "severity":        severity,
        "available_units": available,
        "allocation":      result["allocation"],
        "total_allocated": result["total_allocated"],
        "recommendation":  result["recommendation"],
        "affected_states": INDIAN_STATES[:count]
    })