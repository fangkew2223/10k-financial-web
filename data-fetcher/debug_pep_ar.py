"""Debug PEP accounts receivable - check what AR tags are available in SEC data"""
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

pep = get_companyfacts("0000077476")
us_gaap = pep["facts"]["us-gaap"]

# Check all AR-related tags
ar_tags = [
    "AccountsReceivableNetCurrent",
    "AccountsReceivableNet",
    "ReceivablesNetCurrent",
    "AccountsNotesAndLoansReceivableNetCurrent",
    "TradeAndOtherReceivablesNetCurrent",
    "ReceivablesNet",
    "AccountsReceivableGross",
    "AccountsReceivableGrossCurrent",
    "OtherReceivablesNetCurrent",
    "NontradeReceivablesCurrent",
]

print("=== PEP: Checking all AR-related tags ===")
for tag in ar_tags:
    if tag in us_gaap:
        facts = us_gaap[tag].get("units", {}).get("USD", [])
        annual = [f for f in facts if f.get("form") in ("10-K","10-KT","20-F","40-F")]
        print(f"  {tag}: {len(annual)} annual entries")
        for f in sorted(annual, key=lambda x: (x.get("fy",0), x.get("filed","")), reverse=True)[:5]:
            print(f"    fy={f.get('fy')} fp={f.get('fp')} val={f.get('val'):>15,} filed={f.get('filed')} end={f.get('end')} start={f.get('start')}")
    else:
        print(f"  {tag}: NOT FOUND in SEC data")

# Search for any tag containing "receivable" (case-insensitive)
print()
print("=== PEP: All tags containing 'receivable' ===")
receivable_tags = [t for t in us_gaap.keys() if "receivable" in t.lower()]
for tag in sorted(receivable_tags):
    facts = us_gaap[tag].get("units", {}).get("USD", [])
    annual = [f for f in facts if f.get("form") in ("10-K","10-KT","20-F","40-F")]
    if annual:
        print(f"  {tag}: {len(annual)} annual entries, latest val={sorted(annual, key=lambda x: x.get('fy',0), reverse=True)[0].get('val'):,}")
