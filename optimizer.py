from pulp import LpProblem, LpMaximize, LpVariable, lpSum, value, PULP_CBC_CMD
from config import SCENARIOS, RECOMMENDATIONS
from typing import Dict


def run_optimizer(scenario, available, demand, priority_class=1):

    config = SCENARIOS.get(scenario)
    if not config:
        return {
            "allocation": {},
            "recommendation": "Unknown scenario"
        }

    sectors  = config["sectors"]
    max_need = config["max_need"]
    weights  = config["weights"]

    available = float(available)
    demand = float(demand)

    # Scale max_need based on demand
    scale = demand / 100 if demand > 0 else 0
    scaled_max = [m * scale for m in max_need]

    # Create LP problem
    prob = LpProblem(f"{scenario}_allocation", LpMaximize)

    # Decision variables — how much each sector gets
    variables = [
        LpVariable(
            name=sectors[i],
            lowBound=0,
            upBound=scaled_max[i]
        )
        for i in range(len(sectors))
    ]

    # Objective — maximize weighted total allocation
    prob += lpSum(
        weights[i] * variables[i]
        for i in range(len(sectors))
    )

    # Hard constraint — cannot exceed available supply
    prob += lpSum(variables) <= available

    # Solve silently
    prob.solve(PULP_CBC_CMD(msg=0))

    # Build allocation result
    allocation: Dict[str, float] = {}
    for i, sector in enumerate(sectors):
        allocation[sector] = round(value(variables[i]) or 0, 1)

    # Pick recommendation based on severity
    severity = ((demand - available) / demand) * 100 if demand > 0 else 0
    rec_key  = "high" if severity >= 60 else "medium" if severity >= 30 else "low"
    recommendation = RECOMMENDATIONS.get(scenario, {}).get(rec_key, "Monitor situation.")

    return {
        "allocation": allocation,
        "recommendation": recommendation,
        "total_allocated": float(f"{sum(allocation.values()):.1f}"),
        "total_available": available
    }