from flask import Flask, jsonify  # pyre-ignore[21]
from flask_cors import CORS       # pyre-ignore[21]
from dotenv import load_dotenv    # pyre-ignore[21]
import os

load_dotenv()

from routes.power import power_bp # pyre-ignore[21]
from routes.water import water_bp # pyre-ignore[21]
from routes.fuel  import fuel_bp  # pyre-ignore[21]
from routes.cyber import cyber_bp # pyre-ignore[21]

app = Flask(__name__)
CORS(app)

app.register_blueprint(power_bp)
app.register_blueprint(water_bp)
app.register_blueprint(fuel_bp)
app.register_blueprint(cyber_bp)

@app.route("/", methods=["GET"])
def home():
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