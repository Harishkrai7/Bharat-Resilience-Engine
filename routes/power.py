from flask import Blueprint, request, jsonify  # pyre-ignore[21]
from optimizer import run_optimizer  # pyre-ignore[21]
from config import INDIAN_STATES  # pyre-ignore[21]
import numpy as np, pickle, os  # pyre-ignore[21]

power_bp = Blueprint("power", __name__)

def load_model():
    path = "models/power_model.pkl"
    if os.path.exists(path):
        with open(path, "rb") as f:
            return pickle.load(f)
    return None

@power_bp.route("/api/power", methods=["POST"])
def power_crisis():
    data      = request.get_json()
    severity  = int(data.get("severity", 40))
    available = 100 - severity

    model = load_model()
    demand = model.predict([[severity, available, 500, 1]])[0] if model else available

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