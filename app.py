from flask import Flask, jsonify, send_from_directory  # pyre-ignore[21]
from flask_cors import CORS       # pyre-ignore[21]
from dotenv import load_dotenv    # pyre-ignore[21]
import os

load_dotenv()

from routes.power import power_bp # pyre-ignore[21]
from routes.water import water_bp # pyre-ignore[21]
from routes.fuel  import fuel_bp  # pyre-ignore[21]
from routes.cyber import cyber_bp # pyre-ignore[21]

# Serve frontend files from the project root directory
app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

app.register_blueprint(power_bp)
app.register_blueprint(water_bp)
app.register_blueprint(fuel_bp)
app.register_blueprint(cyber_bp)

# ── Page Routes ──
@app.route("/", methods=["GET"])
def home():
    return send_from_directory(".", "index.html")

@app.route("/dashboard", methods=["GET"])
def dashboard():
    return send_from_directory(".", "dashboard.html")

@app.route("/login", methods=["GET"])
def login():
    return send_from_directory(".", "login.html")

@app.route("/cyber-sim", methods=["GET"])
def cyber_sim():
    return send_from_directory(".", "cyber_sim.html")

@app.route("/water-sim", methods=["GET"])
def water_sim():
    return send_from_directory(".", "water_sim.html")

@app.route("/fuel-sim", methods=["GET"])
def fuel_sim():
    return send_from_directory(".", "fuel_sim.html")

@app.route("/power-sim", methods=["GET"])
def power_sim():
    return send_from_directory(".", "power_sim.html")

@app.route("/report", methods=["GET"])
def report():
    return send_from_directory(".", "report.html")

@app.route("/system-pulse", methods=["GET"])
def system_pulse():
    return send_from_directory(".", "pulse.html")

# ── Health-check JSON endpoint ──
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status":    "running",
        "project":   "Bharat Resilience Engine",
        "version":   "1.0",
        "endpoints": [
            "POST /api/power",
            "POST /api/water",
            "POST /api/fuel",
            "POST /api/cyber"
        ]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5001)