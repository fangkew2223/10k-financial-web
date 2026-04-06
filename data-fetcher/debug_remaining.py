"""Debug remaining failures: COST revenue, TSLA FY2020 net_income, TSLA FY2016/2017 revenue"""
import requests
import pandas as pd

HEADERS = {
    "User-Agent": "cagejia@gmail.com",
    "Accept-Encoding": "gzip, deflate",
    "Host": "data.sec.gov",
}

def get_companyfacts(cik):
    url = f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json"
    r = requests.get(url, headers=HEADERS, timeout=60)
    r.raise_for_status()
    return r.json()

# ============================================================
# COST: Why is FY2019 revenue = 35,396,000,000 (quarterly)?
# ============================================================
print("=" * 70)
print("COST: All FY2019 entries for RevenueFromContractWithCustomerExcludingAssessedTax")
print("=" * 70)
cost = get_companyfacts("0000909832")
cost_us_gaap = cost["facts"]["us-gaap"]

for tag in ["RevenueFromContractWithCustomerExcludingAssessedTax", "Revenues"]:
    tag_facts = cost_us_gaap.get(tag, {}).get("units", {}).get("USD", [])
    fy2019 = [f for f in tag_facts if f.get("fy") == 2019]
    print(f"\nTag: {tag} — ALL FY2019 entries (including Q*):")
    for f in sorted(fy2019, key=lambda x: (x.get("form",""), x.get("filed",""), x.get("end","")), reverse=False):
        print(f"  form={f.get('form')} fp={f.get('fp')} val={f.get('val'):>20,} filed={f.get('filed')} end={f.get('end')}")

# The issue: Costco's annual 10-K has fp=Q4 entries for BOTH quarterly AND annual values
# The annual value has end=2019-09-01 (fiscal year end), quarterly has end=2019-05-12 etc.
# We need to pick the LARGEST period (full year) = the one with end matching fiscal year end
# For Costco, fiscal year ends in early September
# The annual total has end=2019-09-01 and val=152,703,000,000
# The Q4 quarterly has end=2019-09-01 and val=47,498,000,000 (just Q4 quarter)
# Wait - both have same end date? Let me check more carefully

print()
print("COST FY2019 - detailed look at end=2019-09-01 entries:")
for tag in ["RevenueFromContractWithCustomerExcludingAssessedTax", "Revenues"]:
    tag_facts = cost_us_gaap.get(tag, {}).get("units", {}).get("USD", [])
    sep_entries = [f for f in tag_facts if f.get("fy") == 2019 and "2019-09" in str(f.get("end",""))]
    print(f"\nTag: {tag}")
    for f in sep_entries:
        print(f"  form={f.get('form')} fp={f.get('fp')} val={f.get('val'):>20,} filed={f.get('filed')} end={f.get('end')} start={f.get('start')}")

# ============================================================
# TSLA FY2020: Why is net_income = 16,000,000 instead of 721,000,000?
# ============================================================
print()
print("=" * 70)
print("TSLA: All FY2020 NetIncomeLoss entries with end_year=2020")
print("=" * 70)
tsla = get_companyfacts("0001318605")
tsla_us_gaap = tsla["facts"]["us-gaap"]
tsla_ni_facts = tsla_us_gaap.get("NetIncomeLoss", {}).get("units", {}).get("USD", [])
fy2020_end2020 = [f for f in tsla_ni_facts
                  if f.get("fy") == 2020
                  and str(f.get("end","")).startswith("2020")]
for f in sorted(fy2020_end2020, key=lambda x: (x.get("form",""), x.get("filed",""), x.get("end","")), reverse=False):
    print(f"  form={f.get('form')} fp={f.get('fp')} val={f.get('val'):>20,} filed={f.get('filed')} end={f.get('end')} start={f.get('start')}")

# ============================================================
# TSLA FY2016/2017: Why are wrong quarterly values being picked?
# ============================================================
print()
print("=" * 70)
print("TSLA: All FY2016 Revenues entries with end_year=2016")
print("=" * 70)
tsla_rev_facts = tsla_us_gaap.get("Revenues", {}).get("units", {}).get("USD", [])
fy2016_end2016 = [f for f in tsla_rev_facts
                  if f.get("fy") == 2016
                  and str(f.get("end","")).startswith("2016")]
for f in sorted(fy2016_end2016, key=lambda x: (x.get("form",""), x.get("filed",""), x.get("end","")), reverse=False):
    print(f"  form={f.get('form')} fp={f.get('fp')} val={f.get('val'):>20,} filed={f.get('filed')} end={f.get('end')} start={f.get('start')}")

print()
print("=" * 70)
print("TSLA: All FY2017 Revenues entries with end_year=2017")
print("=" * 70)
fy2017_end2017 = [f for f in tsla_rev_facts
                  if f.get("fy") == 2017
                  and str(f.get("end","")).startswith("2017")]
for f in sorted(fy2017_end2017, key=lambda x: (x.get("form",""), x.get("filed",""), x.get("end","")), reverse=False):
    print(f"  form={f.get('form')} fp={f.get('fp')} val={f.get('val'):>20,} filed={f.get('filed')} end={f.get('end')} start={f.get('start')}")
