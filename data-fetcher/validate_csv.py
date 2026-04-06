import requests
import json

HEADERS = {
    "User-Agent": "cagejia@gmail.com",
    "Accept-Encoding": "gzip, deflate",
    "Host": "data.sec.gov",
}

def get_annual_facts(cik, tag):
    url = f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json"
    r = requests.get(url, headers=HEADERS, timeout=60)
    r.raise_for_status()
    data = r.json()
    facts = data.get("facts", {}).get("us-gaap", {}).get(tag, {})
    usd_facts = facts.get("units", {}).get("USD", [])
    annual = [
        f for f in usd_facts
        if f.get("form") in ("10-K", "10-KT", "20-F", "40-F")
        and not str(f.get("fp", "")).upper().startswith("Q")
    ]
    # Sort by fy desc, filed desc
    annual_sorted = sorted(annual, key=lambda x: (x.get("fy", 0), x.get("filed", "")), reverse=True)
    return annual_sorted

def get_all_tags_for_metric(cik, tags):
    url = f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json"
    r = requests.get(url, headers=HEADERS, timeout=60)
    r.raise_for_status()
    data = r.json()
    us_gaap = data.get("facts", {}).get("us-gaap", {})
    results = {}
    for tag in tags:
        facts = us_gaap.get(tag, {})
        usd_facts = facts.get("units", {}).get("USD", [])
        annual = [
            f for f in usd_facts
            if f.get("form") in ("10-K", "10-KT", "20-F", "40-F")
            and not str(f.get("fp", "")).upper().startswith("Q")
        ]
        annual_sorted = sorted(annual, key=lambda x: (x.get("fy", 0), x.get("filed", "")), reverse=True)
        results[tag] = annual_sorted
    return results

# ============================================================
# Issue 1: AMZN FY2024 net_income = -2,722,000,000
# CSV shows -2722M but Amazon 2024 annual report shows +20B
# ============================================================
print("=" * 60)
print("ISSUE 1: AMZN FY2024 NetIncomeLoss")
print("=" * 60)
amzn_ni = get_annual_facts("0001018724", "NetIncomeLoss")
for f in amzn_ni[:10]:
    print(f"  fy={f.get('fy')} fp={f.get('fp')} val={f.get('val'):>20,} filed={f.get('filed')} accn={f.get('accn')}")

# ============================================================
# Issue 2: COST missing FY2019
# ============================================================
print()
print("=" * 60)
print("ISSUE 2: COST Revenue - check FY2019")
print("=" * 60)
cost_rev = get_annual_facts("0000909832", "RevenueFromContractWithCustomerExcludingAssessedTax")
for f in cost_rev[:15]:
    print(f"  fy={f.get('fy')} fp={f.get('fp')} val={f.get('val'):>20,} filed={f.get('filed')}")

# ============================================================
# Issue 3: GOOGL inventory repeated 1170M for FY2022-2025
# ============================================================
print()
print("=" * 60)
print("ISSUE 3: GOOGL InventoryNet")
print("=" * 60)
googl_inv = get_annual_facts("0001652044", "InventoryNet")
for f in googl_inv[:15]:
    print(f"  fy={f.get('fy')} fp={f.get('fp')} val={f.get('val'):>20,} filed={f.get('filed')}")

# ============================================================
# Issue 4 & 5 & 6: TSLA data - check net_income and raw values
# ============================================================
print()
print("=" * 60)
print("ISSUE 4/5/6: TSLA NetIncomeLoss and Revenue")
print("=" * 60)
tsla_ni = get_annual_facts("0001318605", "NetIncomeLoss")
print("  NetIncomeLoss:")
for f in tsla_ni[:15]:
    print(f"  fy={f.get('fy')} fp={f.get('fp')} val={f.get('val'):>20,} filed={f.get('filed')}")

print()
tsla_rev_tags = get_all_tags_for_metric("0001318605", [
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "Revenues",
    "SalesRevenueNet"
])
for tag, facts in tsla_rev_tags.items():
    print(f"  Revenue tag: {tag}")
    for f in facts[:8]:
        print(f"    fy={f.get('fy')} fp={f.get('fp')} val={f.get('val'):>20,} filed={f.get('filed')}")

if __name__ == "__main__":
    pass
