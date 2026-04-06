"""
Verify that the fixed extract_annual_series logic produces correct values
for the known problem cases, without running the full script.
"""
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

def extract_annual_series_fixed(companyfacts, tags):
    """Fixed version matching the updated testrequests.py logic."""
    us_gaap = companyfacts.get("facts", {}).get("us-gaap", {})
    rows = []

    for rank, tag in enumerate(tags, start=1):
        concept = us_gaap.get(tag)
        if not concept:
            continue
        units = concept.get("units", {})
        candidate_units = []
        if "USD" in units:
            candidate_units.append(("USD", units["USD"]))
        for unit_name, facts_list in units.items():
            if unit_name != "USD":
                candidate_units.append((unit_name, facts_list))

        for _unit, facts in candidate_units:
            if not isinstance(facts, list):
                continue
            for fact in facts:
                form = str(fact.get("form", "") or "")
                fy = fact.get("fy")
                fp = fact.get("fp")
                val = fact.get("val")
                filed = fact.get("filed")
                end = fact.get("end")
                accn = fact.get("accn")

                if form not in {"10-K", "10-KT", "20-F", "40-F"}:
                    continue
                if val is None:
                    continue

                if fy is None:
                    try:
                        fy = pd.to_datetime(end, errors="coerce").year
                    except Exception:
                        fy = None
                if fy is None or pd.isna(fy):
                    continue

                fy = int(fy)

                try:
                    end_year = pd.to_datetime(end, errors="coerce").year
                except Exception:
                    end_year = None

                fp_upper = str(fp or "").upper()

                if fp_upper in {"Q1", "Q2", "Q3"}:
                    continue
                if fp_upper == "Q4" and end_year != fy:
                    continue
                if end_year is not None and end_year != fy:
                    continue

                try:
                    start_dt = pd.to_datetime(fact.get("start"), errors="coerce")
                    end_dt = pd.to_datetime(end, errors="coerce")
                    period_days = (end_dt - start_dt).days if pd.notna(start_dt) and pd.notna(end_dt) else 0
                except Exception:
                    period_days = 0

                rows.append({
                    "fy": fy,
                    "value": val,
                    "filed": filed,
                    "period_end": end,
                    "period_days": period_days,
                    "accn": accn,
                    "tag": tag,
                    "tag_rank": rank,
                })

    if not rows:
        return pd.DataFrame(columns=["fy", "value", "filed", "period_end", "accn", "tag"])

    df = pd.DataFrame(rows)
    df["filed"] = pd.to_datetime(df["filed"], errors="coerce")
    df = (
        df.sort_values(["fy", "tag", "period_days", "filed"], ascending=[True, True, False, False])
        .drop_duplicates(subset=["fy", "tag"], keep="first")
        .sort_values(["fy", "tag_rank", "period_days", "filed"], ascending=[True, True, False, False])
        .drop_duplicates(subset=["fy"], keep="first")
        .sort_values("fy")
        .reset_index(drop=True)
    )
    return df[["fy", "value", "tag"]]

PASS = "✅ PASS"
FAIL = "❌ FAIL"

print("=" * 70)
print("VERIFICATION: AMZN FY2024 net_income")
print("  Expected: 59,248,000,000 (FY2024 actual net income)")
print("=" * 70)
amzn = get_companyfacts("0001018724")
amzn_ni = extract_annual_series_fixed(amzn, ["NetIncomeLoss"])
fy2024_ni = amzn_ni[amzn_ni["fy"] == 2024]["value"].values
if len(fy2024_ni) > 0:
    val = fy2024_ni[0]
    status = PASS if val == 59248000000 else FAIL
    print(f"  Got: {val:,}  {status}")
else:
    print(f"  Got: (no data)  {FAIL}")

print()
print("=" * 70)
print("VERIFICATION: COST FY2019 revenue")
print("  Expected: 152,703,000,000")
print("=" * 70)
cost = get_companyfacts("0000909832")
cost_rev = extract_annual_series_fixed(cost, [
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "Revenues",
    "SalesRevenueNet"
])
fy2019_rev = cost_rev[cost_rev["fy"] == 2019]["value"].values
if len(fy2019_rev) > 0:
    val = fy2019_rev[0]
    status = PASS if val == 152703000000 else FAIL
    print(f"  Got: {val:,}  {status}")
else:
    print(f"  Got: (no data)  {FAIL}")

print()
print("COST all fiscal years present:")
print(f"  {sorted(cost_rev['fy'].tolist())}")
expected_years = list(range(2010, 2026))
missing = [y for y in range(2015, 2026) if y not in cost_rev["fy"].tolist()]
if not missing:
    print(f"  No missing years in 2015-2025  {PASS}")
else:
    print(f"  Missing years: {missing}  {FAIL}")

print()
print("=" * 70)
print("VERIFICATION: GOOGL inventory (should be NaN for FY2023/2024/2025)")
print("  Expected: no ffill — FY2023/2024/2025 should have no inventory data")
print("=" * 70)
googl = get_companyfacts("0001652044")
googl_inv = extract_annual_series_fixed(googl, ["InventoryNet"])
print(f"  GOOGL inventory years with data: {sorted(googl_inv['fy'].tolist())}")
has_2023_plus = any(googl_inv["fy"] >= 2023)
if not has_2023_plus:
    print(f"  No FY2023+ inventory data (correct — GOOGL stopped reporting)  {PASS}")
else:
    bad = googl_inv[googl_inv["fy"] >= 2023]
    print(f"  Still has FY2023+ data: {bad[['fy','value']].to_string()}  {FAIL}")

print()
print("=" * 70)
print("VERIFICATION: TSLA net_income FY2020 and FY2021")
print("  Expected FY2020: 721,000,000")
print("  Expected FY2021: 5,519,000,000")
print("=" * 70)
tsla = get_companyfacts("0001318605")
tsla_ni = extract_annual_series_fixed(tsla, ["NetIncomeLoss"])
for fy_check, expected in [(2020, 721000000), (2021, 5519000000)]:
    row = tsla_ni[tsla_ni["fy"] == fy_check]["value"].values
    if len(row) > 0:
        val = row[0]
        status = PASS if val == expected else FAIL
        print(f"  FY{fy_check}: Got {val:,}  (expected {expected:,})  {status}")
    else:
        print(f"  FY{fy_check}: (no data)  {FAIL}")

print()
print("=" * 70)
print("VERIFICATION: TSLA revenue FY2016/2017 (should use end-date-matched values)")
print("  Expected FY2016: 7,000,132,000")
print("  Expected FY2017: 11,758,751,000")
print("=" * 70)
tsla_rev = extract_annual_series_fixed(tsla, [
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "Revenues",
    "SalesRevenueNet"
])
for fy_check, expected in [(2016, 7000132000), (2017, 11758751000)]:
    row = tsla_rev[tsla_rev["fy"] == fy_check]["value"].values
    if len(row) > 0:
        val = row[0]
        status = PASS if val == expected else FAIL
        print(f"  FY{fy_check}: Got {val:,}  (expected {expected:,})  {status}")
    else:
        print(f"  FY{fy_check}: (no data)  {FAIL}")

print()
print("=" * 70)
print("FULL TSLA net_income series (fixed):")
print("=" * 70)
print(tsla_ni[["fy", "value"]].to_string(index=False))

print()
print("=" * 70)
print("FULL COST revenue series (fixed):")
print("=" * 70)
print(cost_rev[["fy", "value"]].to_string(index=False))
