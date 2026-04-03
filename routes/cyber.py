from flask import Blueprint, request, jsonify  # pyre-ignore[21]
from config import INDIAN_STATES, RECOMMENDATIONS  # pyre-ignore[21]
import numpy as np, pandas as pd, pickle, os, joblib  # pyre-ignore[21]

cyber_bp = Blueprint("cyber", __name__)

_model_cache = None
_preprocessor_cache = None

def load_model_and_preproc():
    global _model_cache, _preprocessor_cache
    if _model_cache and _preprocessor_cache: return _model_cache, _preprocessor_cache
    try:
        model_path = "models/cyber_iso_forest.pkl"
        prep_path = "models/cyber_preprocessor.pkl"
        if os.path.exists(model_path) and os.path.exists(prep_path):
            _model_cache = joblib.load(model_path)
            _preprocessor_cache = joblib.load(prep_path)
            return _model_cache, _preprocessor_cache
    except Exception as e:
        print("Failed to load Cyber ML model:", e)
    return None, None

@cyber_bp.route("/api/cyber", methods=["POST"])
def cyber_crisis():
    data        = request.get_json()
    severity    = int(data.get("severity", 40))
    total_nodes = int(data.get("total_nodes", 200))
    attacked    = int((severity / 100) * total_nodes)

    model, preprocessor = load_model_and_preproc()
    if model and preprocessor:
        data_path = "data/cyber_cleaned_data.csv"
        df = pd.read_csv(data_path)
        sample_df = df.sample(n=total_nodes, replace=True).reset_index(drop=True)
        
        # Use real ML preprocessor
        X = preprocessor.transform(sample_df)
        predictions = model.predict(X)
        compromised = sample_df[predictions == -1].index.tolist()
    else:
        compromised  = list(range(attacked))

    count      = max(1, int((severity / 100) * len(INDIAN_STATES)))
    rec_key    = "high" if severity >= 60 else "medium" if severity >= 30 else "low"
    rec        = RECOMMENDATIONS["cyber"][rec_key]

    return jsonify({
        "scenario":           "cyber_attack",
        "severity":           severity,
        "total_nodes":        total_nodes,
        "compromised_nodes":  compromised,
        "compromised_count":  len(compromised),
        "safe_nodes":         total_nodes - len(compromised),
        "recommendation":     rec,
        "affected_states":    INDIAN_STATES[:count]
    })