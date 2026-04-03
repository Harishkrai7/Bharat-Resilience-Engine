from flask import Blueprint, request, jsonify  # pyre-ignore[21]
from optimizer import run_optimizer  # pyre-ignore[21]
from config import INDIAN_STATES  # pyre-ignore[21]
import numpy as np, pickle, os  # pyre-ignore[21]

water_bp = Blueprint("water", __name__)

def load_model():
    path = "models/water_model.pkl"
    if os.path.exists(path):
        with open(path, "rb") as f:
            return pickle.load(f)
    return None

@water_bp.route("/api/water", methods=["POST"])
def water_crisis():
    data      = request.get_json()
    severity  = int(data.get("severity", 40))
    available = 100 - severity

    model  = load_model()
    demand = model.predict([[severity, available, 30, 0.4]])[0] if model else available

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