SCENARIOS = {
    "power": {
        "sectors": ["hospitals", "military", "railways", 
                    "industry", "residential"],
        "max_need": [20, 15, 25, 20, 20],
        "weights":  [10,  8,   6,  3,   1]
    },
    "water": {
        "sectors": ["hospitals", "drinking_water", "agriculture", 
                    "industry", "residential"],
        "max_need": [15, 25, 20, 20, 20],
        "weights":  [10,  9,   5,  3,   1]
    },
    "fuel": {
        "sectors": ["military", "emergency_services", "transport", 
                    "agriculture", "industry"],
        "max_need": [15, 20, 25, 20, 20],
        "weights":  [10,  9,   6,  5,   2]
    },
    "lpg": {
        "sectors": ["hospitals", "schools", "community_kitchens", 
                    "industry", "residential"],
        "max_need": [20, 15, 15, 20, 30],
        "weights":  [10,  7,   6,  3,   1]
    },
    "cyber": {
        "sectors": ["control_room", "substation", 
                    "transmission", "distribution"],
        "max_need": [10, 30, 30, 30],
        "weights":  [10,  8,   6,  4]
    }
}

INDIAN_STATES = [
    "Maharashtra", "Uttar Pradesh", "Bihar", "West Bengal",
    "Madhya Pradesh", "Tamil Nadu", "Rajasthan", "Karnataka",
    "Gujarat", "Andhra Pradesh", "Odisha", "Telangana",
    "Kerala", "Jharkhand", "Assam", "Punjab", "Chhattisgarh",
    "Haryana", "Delhi", "Uttarakhand", "Himachal Pradesh",
    "Tripura", "Meghalaya", "Manipur", "Nagaland",
    "Goa", "Arunachal Pradesh", "Sikkim"
]

RECOMMENDATIONS = {
    "power": {
        "high":   "CRITICAL: Isolate non-essential zones. Prioritize hospitals and military immediately.",
        "medium": "WARNING: Rotate power supply. Industrial zones on 6-hour cuts.",
        "low":    "STABLE: Monitor demand. Backup generators on standby."
    },
    "water": {
        "high":   "CRITICAL: Halt industrial water use. Drinking water and hospitals only.",
        "medium": "WARNING: Restrict agriculture supply. Urban rationing begins.",
        "low":    "STABLE: Reservoir levels manageable. Continue monitoring."
    },
    "fuel": {
        "high":   "CRITICAL: Military and emergency vehicles only. Civilian supply suspended.",
        "medium": "WARNING: Transport and agriculture rationed. Industry cuts by 50 percent.",
        "low":    "STABLE: Slight reduction in civilian supply. No emergency action needed."
    },
    "lpg": {
        "high":   "CRITICAL: Hospitals and schools only. Residential supply suspended.",
        "medium": "WARNING: BPL households prioritized. Industrial use halted.",
        "low":    "STABLE: Minor shortage. Redistribution from surplus states recommended."
    },
    "cyber": {
        "high":   "CRITICAL: Isolate northern grid. Activate backup substations. Deploy cyber team.",
        "medium": "WARNING: Isolate compromised nodes. Reroute through Gujarat and Maharashtra.",
        "low":    "STABLE: Monitor flagged nodes. Increase packet inspection on substations."
    }
}

PORT  = 5000
DEBUG = True