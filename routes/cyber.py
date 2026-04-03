from flask import Blueprint, request, jsonify  # pyre-ignore[21]
from config import INDIAN_STATES, RECOMMENDATIONS  # pyre-ignore[21]
import numpy as np, pandas as pd, pickle, os  # pyre-ignore[21]

cyber_bp = Blueprint("cyber", __name__)

def load_model():
    path = "models/cyber_model.pkl"
    if os.path.exists(path):
        with open(path, "rb") as f:
            return pickle.load(f)
    return None

@cyber_bp.route("/api/cyber", methods=["POST"])
def cyber_crisis():
    data        = request.get_json()
    severity    = int(data.get("severity", 40))
    total_nodes = int(data.get("total_nodes", 200))
    attacked    = int((severity / 100) * total_nodes)

    # Build node data
    np.random.seed(42)
    nodes = pd.DataFrame({
        "node_id":           range(total_nodes),
        "load_MW":           np.random.normal(500, 100, total_nodes),
        "voltage_deviation": np.random.normal(0, 0.05, total_nodes),
        "frequency_drop_Hz": np.random.normal(0, 0.02, total_nodes),
        "packet_loss_pct":   np.random.normal(1, 0.5, total_nodes),
        "response_time_ms":  np.random.normal(10, 2, total_nodes),
    })

    # Inject attack anomalies into first N nodes
    nodes.loc[:attacked, "packet_loss_pct"]   += np.random.uniform(20, 50, attacked + 1)
    nodes.loc[:attacked, "response_time_ms"]  += np.random.uniform(100, 500, attacked + 1)
    nodes.loc[:attacked, "voltage_deviation"] += np.random.uniform(0.2, 0.5, attacked + 1)

    features = ["load_MW", "voltage_deviation",
                "frequency_drop_Hz", "packet_loss_pct", "response_time_ms"]

    model = load_model()
    if model:
        predictions  = model.predict(nodes[features])
        compromised  = nodes[predictions == -1]["node_id"].tolist()
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