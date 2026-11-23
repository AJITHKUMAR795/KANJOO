import subprocess
import time
import requests
import sys
import json

print("Starting Spring Boot application...")
proc = subprocess.Popen(
    ["java", "-jar", "C:/Users/ajith/KANJOO/kanjoo-backend/target/kanjoo-backend-1.0.0-SNAPSHOT.jar"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)

BASE_URL = "http://localhost:8080"
started = False

try:
    for attempt in range(40):
        try:
            r = requests.get(f"{BASE_URL}/api/onboarding/countries", timeout=2)
            if r.status_code == 200:
                print(f"[SUCCESS] Server is UP! Found {len(r.json())} countries.")
                started = True
                break
        except Exception:
            pass
        time.sleep(1)

    if not started:
        print("[FAIL] Server did not start within 40 seconds.")
        sys.exit(1)

    # 1. Test Login
    print("\n1. Testing POST /api/auth/login for demo@kanjoo.ai...")
    login_res = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "demo@kanjoo.ai",
        "password": "Password@123"
    })
    print(f"Status: {login_res.status_code}")
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    auth_data = login_res.json()
    token = auth_data["token"]
    print(f"Token obtained! User: {auth_data['fullName']}, Role: {auth_data['role']}")

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # 2. Test Dashboard Overview
    print("\n2. Testing GET /api/dashboard/overview...")
    dash_res = requests.get(f"{BASE_URL}/api/dashboard/overview", headers=headers)
    print(f"Status: {dash_res.status_code}")
    assert dash_res.status_code == 200, f"Dashboard failed: {dash_res.text}"
    dash_data = dash_res.json()
    print("Dashboard Data:")
    print(f"  User: {dash_data['user']['fullName']} ({dash_data['user']['country']})")
    print(f"  Primary Currency: {dash_data['user']['primaryCurrency']} ({dash_data['user']['currencySymbol']})")
    print(f"  Monthly Income: {dash_data['financialOverview']['monthlyIncome']}")
    print(f"  Total Expenses: {dash_data['financialOverview']['totalExpenses']}")
    print(f"  Available Balance: {dash_data['financialOverview']['availableBalance']}")
    print(f"  Health Score: {dash_data['healthScore']['overallScore']}/100 ({dash_data['healthScore']['ratingTier']})")
    print(f"  Money Leaks Found: {dash_data['leakSummary']['totalLeaksFound']}")
    print(f"  Recent Expenses Count: {len(dash_data['recentExpenses'])}")

    # 3. Test Recharge Optimizer
    print("\n3. Testing GET /api/telecom/optimize...")
    rec_res = requests.get(f"{BASE_URL}/api/telecom/optimize", headers=headers)
    print(f"Status: {rec_res.status_code}")
    assert rec_res.status_code == 200, f"Recharge optimize failed: {rec_res.text}"
    rec_data = rec_res.json()
    print("Recharge Optimizer Result:")
    print(f"  Total SIMs evaluated: {len(rec_data)}")
    for item in rec_data:
        print(f"  - SIM {item['simCard']['phoneNumber']} ({item['simCard']['operator']['name']}): monthly cost {item['currentMetrics']['monthlyEquivalent']}, savings {item['potentialMonthlySavings']}")

    # 4. Test Money Leaks
    print("\n4. Testing GET /api/intelligence/money-leaks...")
    leak_res = requests.get(f"{BASE_URL}/api/intelligence/money-leaks", headers=headers)
    print(f"Status: {leak_res.status_code}")
    assert leak_res.status_code == 200, f"Leaks failed: {leak_res.text}"
    leak_data = leak_res.json()
    print(f"Total Leaks Found: {len(leak_data['leaks'])}")
    for l in leak_data['leaks']:
        print(f"  - [{l['severity']}] {l['title']} (Save {l['potentialMonthlySavings']}/mo)")

    # 5. Test Before You Spend Engine
    print("\n5. Testing POST /api/intelligence/before-you-spend...")
    spend_res = requests.post(f"{BASE_URL}/api/intelligence/before-you-spend", headers=headers, json={
        "itemName": "Noise-cancelling gaming headset",
        "amount": 2999.00,
        "category": "Electronics",
        "urgency": "NORMAL"
    })
    print(f"Status: {spend_res.status_code}")
    assert spend_res.status_code == 200, f"Before You Spend failed: {spend_res.text}"
    spend_data = spend_res.json()
    print("Before You Spend Analysis:")
    print(f"  Affordable: {spend_data['affordableWithoutDebt']}")
    print(f"  Classification: {spend_data['classification']}")
    print(f"  Recommended Waiting Days: {spend_data['recommendedWaitingDays']}")
    print(f"  Verdict Reasoning: {spend_data['verdictReasoning']}")

    # 6. Test AI Assistant Chat
    print("\n6. Testing POST /api/ai/chat...")
    ai_res = requests.post(f"{BASE_URL}/api/ai/chat", headers=headers, json={
        "message": "How can I reduce my telecom and entertainment spending this month?"
    })
    print(f"Status: {ai_res.status_code}")
    assert ai_res.status_code == 200, f"AI chat failed: {ai_res.text}"
    ai_data = ai_res.json()
    print("KANJOO AI Response:")
    print(f"  Suggested Action: {ai_data.get('suggestedAction')}")
    print(f"  Reply snippet: {ai_data.get('reply', '')[:250]}...")

    print("\n[ALL 6 INTEGRATION TESTS PASSED PERFECTLY!]")

finally:
    print("\nTerminating Spring Boot test process...")
    proc.terminate()
    try:
        proc.wait(timeout=5)
    except Exception:
        proc.kill()
    print("Process stopped cleanly.")
