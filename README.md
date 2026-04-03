<div align="center">

# 🇮🇳 Bharat Resilience Engine

### AI-Powered National Crisis Management & Resource Optimization Platform

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-Gradient_Boost-017CEE?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br>

> *"Predicting crises before they strike — protecting a billion lives through intelligent resource allocation."*

<br>

<img src="images/india_satellite.png" alt="India Satellite View" width="400"/>

</div>

---

## 🚀 What is Bharat Resilience Engine?

**Bharat Resilience Engine (BRE)** is an end-to-end AI-powered platform that predicts and manages **national infrastructure crises** across India. It combines **machine learning models** with a **linear programming optimizer** to intelligently allocate scarce resources during emergencies.

The system monitors **4 critical infrastructure domains** in real-time:

<div align="center">

| 🔌 **Power Shortage** | ⛽ **Fuel Shortage** | 💧 **Water Management** | 🛡️ **Cybersecurity** |
|:---:|:---:|:---:|:---:|
| Grid spike detection | Supply disruption alerts | Drought & water stress | Network anomaly detection |
| Load forecasting | Demand-supply gap analysis | Reservoir monitoring | Attack identification |
| State-wise risk scoring | Critical period prediction | District-level warnings | Node compromise detection |

</div>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (HTML/CSS/JS)                    │
│   Landing Page  →  Login  →  Interactive Dashboard          │
│   india.svg map  │  Real-time charts  │  Crisis alerts      │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP POST (JSON)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  FLASK REST API (Backend)                    │
│                                                             │
│  /api/power   /api/water   /api/fuel   /api/cyber           │
│       │            │           │           │                │
│       ▼            ▼           ▼           ▼                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐         │
│  │ Random  │ │ Random  │ │XGBoost  │ │Isolation │         │
│  │ Forest  │ │ Forest  │ │Regressor│ │ Forest   │         │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬─────┘         │
│       └───────────┴───────────┴────────────┘                │
│                       │                                     │
│                       ▼                                     │
│            ┌─────────────────────┐                          │
│            │   LP Optimizer      │                          │
│            │  (PuLP CBC Solver)  │                          │
│            │  Weighted sector    │                          │
│            │  allocation engine  │                          │
│            └─────────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Model Performance

<div align="center">

| Module | Algorithm | Accuracy | Key Metric | Training Data |
|:---|:---:|:---:|:---:|:---:|
| 🔌 Power Shortage | RandomForest Classifier | ~90% | Spike Detection | 34 states × monthly |
| ⛽ Fuel Shortage | XGBoost Regressor | MAE ≈ 0.00 | Supply Forecasting | 359 daily records |
| 💧 Water Management | RandomForest Classifier | **99.18%** | ROC-AUC: **0.9996** | 1,830 district records |
| 🛡️ Cybersecurity | Isolation Forest | 5% anomaly rate | Attack Detection | 40,000 packets |

</div>

---

## 📁 Project Structure

```
Bharat-Resilience-Engine/
│
├── 🌐 Frontend
│   ├── index.html                 # Landing page
│   ├── login.html                 # Authentication page
│   ├── dashboard.html             # Main crisis dashboard
│   ├── india.svg                  # Interactive India map
│   ├── css/
│   │   ├── styles.css             # Global styles
│   │   ├── landing.css            # Landing page styles
│   │   ├── login.css              # Login page styles
│   │   └── dashboard.css          # Dashboard styles
│   ├── js/
│   │   ├── landing.js             # Landing page logic
│   │   ├── login.js               # Auth logic
│   │   └── dashboard.js           # Dashboard + API integration
│   └── images/
│       ├── india_3d_map.png       # 3D map visualization
│       └── india_satellite.png    # Satellite imagery
│
├── ⚙️ Backend
│   ├── app.py                     # Flask application entry point
│   ├── config.py                  # Scenarios, weights & recommendations
│   ├── optimizer.py               # PuLP linear programming optimizer
│   ├── requirements.txt           # Python dependencies
│   ├── test_api.py                # API endpoint test runner
│   └── routes/
│       ├── power.py               # /api/power endpoint
│       ├── water.py               # /api/water endpoint
│       ├── fuel.py                # /api/fuel endpoint
│       └── cyber.py               # /api/cyber endpoint
│
├── 🧠 ML Models (Pre-trained)
│   └── models/
│       ├── power_model_v2.pkl     # RandomForest + feature list
│       ├── fuel_xgboost.pkl       # XGBoost regressor
│       ├── fuel_feature_names.pkl # Fuel feature schema
│       ├── water_rf.pkl           # RandomForest classifier
│       ├── water_feature_names.pkl# Water feature schema
│       ├── cyber_iso_forest.pkl   # Isolation Forest anomaly detector
│       └── cyber_preprocessor.pkl # ColumnTransformer pipeline
│
└── 📈 Training Data
    └── data/
        ├── india_monthly_electricity.csv               # Power generation data
        ├── district_wise_rainfall_normal.csv            # Rainfall by district
        ├── 1747633531_Statewise_Sales-POL_Consumption_Final.xlsx  # Fuel data
        └── cyber_cleaned_data.csv                      # Network traffic data
```

---

## ⚡ Quick Start

### Prerequisites

- Python 3.8+
- pip

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sohamshaw23/Bharat-Resilience-Engine.git
cd Bharat-Resilience-Engine
```

### 2️⃣ Set Up Virtual Environment

```bash
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Run the Backend

```bash
python app.py
```

The server starts at `http://127.0.0.1:5001`

### 5️⃣ Open the Frontend

Simply open `index.html` in your browser, or serve it via Live Server.

---

## 🔗 API Endpoints

All endpoints accept `POST` requests with JSON body.

<div align="center">

| Endpoint | Method | Payload | Description |
|:---|:---:|:---|:---|
| `/api/power` | `POST` | `{ "severity": 40 }` | Predict power grid stress & allocate resources |
| `/api/water` | `POST` | `{ "severity": 55 }` | Detect drought conditions & optimize water supply |
| `/api/fuel` | `POST` | `{ "severity": 30 }` | Forecast fuel shortages & prioritize distribution |
| `/api/cyber` | `POST` | `{ "severity": 45, "total_nodes": 200 }` | Detect cyberattacks on grid infrastructure |

</div>

### Example Request

```bash
curl -X POST http://127.0.0.1:5001/api/power \
  -H "Content-Type: application/json" \
  -d '{"severity": 70}'
```

### Example Response

```json
{
  "scenario": "power_shortage",
  "severity": 70,
  "available_units": 30,
  "allocation": {
    "hospitals": 6.0,
    "military": 4.5,
    "railways": 7.5,
    "industry": 6.0,
    "residential": 6.0
  },
  "total_allocated": 30.0,
  "recommendation": "CRITICAL: Isolate non-essential zones. Prioritize hospitals and military immediately.",
  "affected_states": ["Maharashtra", "Uttar Pradesh", "Bihar", ...]
}
```

---

## 🧠 How the Optimizer Works

The **PuLP-based Linear Programming Optimizer** maximizes weighted resource allocation across sectors under supply constraints:

```
Maximize:   Σ (weight_i × allocation_i)

Subject to: Σ allocation_i  ≤  available_supply
            0 ≤ allocation_i ≤ scaled_max_need_i
```

**Sector Priority Weights:**

| Sector | Power | Water | Fuel |
|:---|:---:|:---:|:---:|
| 🏥 Hospitals | 10 | 10 | — |
| 🪖 Military | 8 | — | 10 |
| 🚨 Emergency Services | — | — | 9 |
| 🚂 Railways / Transport | 6 | — | 6 |
| 🚰 Drinking Water | — | 9 | — |
| 🌾 Agriculture | — | 5 | 5 |
| 🏭 Industry | 3 | 3 | 2 |
| 🏠 Residential | 1 | 1 | — |

> Hospitals and military **always** get the highest priority during critical shortages.

---

## 🛡️ Severity Levels & Recommendations

<div align="center">

| Level | Severity Range | Action |
|:---:|:---:|:---|
| 🟢 **LOW** | 0% – 29% | Monitor situation. Backup systems on standby. |
| 🟡 **MEDIUM** | 30% – 59% | Begin rationing. Rotate supply. Industrial cuts. |
| 🔴 **HIGH** | 60% – 100% | Emergency protocol. Essential services only. |

</div>

---

## 🧪 Running Tests

```bash
# Start the backend first
python app.py

# In another terminal, run the test suite
python test_api.py
```

**Expected Output:**
```
=======================================================
   Bharat Resilience Engine — API Test Runner
=======================================================

  POWER — severity 40%
  Allocation : {...}
  Recommend  : STABLE: Monitor demand...
  Status     : PASS

  WATER — severity 55%
  Status     : PASS

  FUEL — severity 30%
  Status     : PASS

  CYBER — severity 45%
  Status     : PASS

=======================================================
  ALL PASSED
=======================================================
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|:---|:---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Python, Flask, Flask-CORS |
| **ML Models** | scikit-learn, XGBoost, Isolation Forest |
| **Optimizer** | PuLP (CBC Solver) |
| **Data Processing** | pandas, NumPy |
| **Model Serialization** | joblib / pickle |

</div>

---

## 👥 Team

| Name | Role |
|:---|:---|
| **Soham Shaw** | Backend Development, ML Integration, API Design |
| **Contributor** | Frontend Development, UI/UX Design |

---

## 📄 License

This project is developed for educational and research purposes as part of national infrastructure resilience research.

---

<div align="center">

**Built with ❤️ for Bharat 🇮🇳**

*Protecting critical infrastructure through the power of AI*

</div>
