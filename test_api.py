import requests  # pyre-ignore[21]

BASE = "http://localhost:5001"

tests = [
    ("power", {"severity": 40}),
    ("water", {"severity": 55}),
    ("fuel",  {"severity": 30}),
    ("cyber", {"severity": 45, "total_nodes": 200}),
]

print("=" * 55)
print("   Bharat Resilience Engine — API Test Runner")
print("=" * 55)

all_passed = True

for scenario, payload in tests:
    try:
        res  = requests.post(f"{BASE}/api/{scenario}", json=payload)
        data = res.json()
        print(f"\n  {scenario.upper()} — severity {payload['severity']}%")
        print(f"  Allocation : {data.get('allocation')}")
        print(f"  Recommend  : {data.get('recommendation')[:55]}...")
        print(f"  States hit : {len(data.get('affected_states', []))}")
        print(f"  Status     : PASS")
    except Exception as e:
        print(f"\n  {scenario.upper()} — FAIL — {e}")
        all_passed = False

print("\n" + "=" * 55)
print("  ALL PASSED" if all_passed else "  SOME TESTS FAILED — check errors above")
print("=" * 55)