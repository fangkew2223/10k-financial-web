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

def extract_annual_series(companyfacts, tags):
    """Replicate the script's extract_annual_series logic exactly."""
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
                if fp and str(fp).upper().startswith("Q"):
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
                rows.append({
                    "fy": int(fy),
                    "value": val,
                    "filed": filed,
                    "period_end": end,
                    "accn": accn,
                    "tag": tag,
                    "tag_rank": rank,
                })
    if not rows:
        return pd.DataFrame(columns=["fy", "value", "filed", "period_end", "accn", "tag"])
    df = pd.DataFrame(rows)
    df["filed"] = pd.to_datetime(df["filed"], errors="coerce")
    df = (
        df.sort_values(["fy", "tag", "filed"], ascending=[True, True, False])
        .drop_duplicates(subset=["fy", "tag"], keep="first")
        .sort_values(["fy", "tag_rank", "filed"], ascending=[True, True, False])
        .drop_duplicates(subset=["fy"], keep="first")
        .sort_values("fy")
        .reset_index(drop=True)
    )
    return df[["fy", "value", "tag"]]

# ============================================================
# Deep dive: AMZN FY2024 net_income dedup issue
# ============================================================
print("=" * 70)
print("AMZN: Simulating extract_annual_series for NetIncomeLoss")
print("=" * 70)
amzn_facts = get_companyfacts("0001018724")
amzn_ni_series = extract_annual_series(amzn_facts, ["NetIncomeLoss"])
print(amzn_ni_series.to_string())

# Show raw data for FY2024 to understand what's happening
print("\nRaw FY2024 NetIncomeLoss entries for AMZN:")
us_gaap = amzn_facts["facts"]["us-gaap"]
ni_facts = us_gaap.get("NetIncomeLoss", {}).get("units", {}).get("USD", [])
fy2024 = [f for f in ni_facts if f.get("fy") == 2024 and f.get("form") in ("10-K","10-KT")]
for f in sorted(fy2024, key=lambda x: x.get("filed",""), reverse=True):
    print(f"  val={f.get('val'):>20,} filed={f.get('filed')} fp={f.get('fp')} end={f.get('end')} accn={f.get('accn')}")

# ============================================================
# COST: Check all revenue tags for FY2019
# ============================================================
print()
print("=" * 70)
print("COST: Check revenue tags for FY2019")
print("=" * 70)
cost_facts = get_companyfacts("0000909832")
cost_us_gaap = cost_facts["facts"]["us-gaap"]
for tag in ["RevenueFromContractWithCustomerExcludingAssessedTax", "Revenues", "SalesRevenueNet"]:
    tag_facts = cost_us_gaap.get(tag, {}).get("units", {}).get("USD", [])
    fy2019 = [f for f in tag_facts if f.get("fy") == 2019 and f.get("form") in ("10-K","10-KT","20-F","40-F")]
    print(f"  Tag: {tag}")
    for f in sorted(fy2019, key=lambda x: x.get("filed",""), reverse=True):
        print(f"    val={f.get('val'):>20,} filed={f.get('filed')} fp={f.get('fp')} end={f.get('end')}")
    if not fy2019:
        print(f"    (no FY2019 annual data found)")

# Also run the full simulation for COST
print("\nCOST: Simulating extract_annual_series for revenue:")
cost_rev_series = extract_annual_series(cost_facts, [
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "Revenues",
    "SalesRevenueNet"
])
print(cost_rev_series.to_string())

# ============================================================
# GOOGL: Confirm inventory ffill issue
# ============================================================
print()
print("=" * 70)
print("GOOGL: InventoryNet raw annual data")
print("=" * 70)
googl_facts = get_companyfacts("0001652044")
googl_us_gaap = googl_facts["facts"]["us-gaap"]
inv_facts = googl_us_gaap.get("InventoryNet", {}).get("units", {}).get("USD", [])
annual_inv = [f for f in inv_facts if f.get("form") in ("10-K","10-KT","20-F","40-F") and not str(f.get("fp","")).upper().startswith("Q")]
for f in sorted(annual_inv, key=lambda x: (x.get("fy",0), x.get("filed","")), reverse=True):
    print(f"  fy={f.get('fy')} val={f.get('val'):>15,} filed={f.get('filed')} fp={f.get('fp')} end={f.get('end')}")

# ============================================================
# TSLA: Understand the year-shift in net_income
# ============================================================
print()
print("=" * 70)
print("TSLA: Simulating extract_annual_series for NetIncomeLoss")
print("=" * 70)
tsla_facts = get_companyfacts("0001318605")
tsla_ni_series = extract_annual_series(tsla_facts, ["NetIncomeLoss"])
print(tsla_ni_series.to_string())

print()
print("TSLA: Raw FY2021 NetIncomeLoss entries:")
tsla_us_gaap = tsla_facts["facts"]["us-gaap"]
tsla_ni_facts = tsla_us_gaap.get("NetIncomeLoss", {}).get("units", {}).get("USD", [])
fy2021 = [f for f in tsla_ni_facts if f.get("fy") == 2021 and f.get("form") in ("10-K","10-KT")]
for f in sorted(fy2021, key=lambda x: x.get("filed",""), reverse=True):
    print(f"  val={f.get('val'):>20,} filed={f.get('filed')} fp={f.get('fp')} end={f.get('end')} accn={f.get('accn')}")

print()
print("TSLA: Raw FY2020 NetIncomeLoss entries:")
fy2020 = [f for f in tsla_ni_facts if f.get("fy") == 2020 and f.get("form") in ("10-K","10-KT")]
for f in sorted(fy2020, key=lambda x: x.get("filed",""), reverse=True):
    print(f"  val={f.get('val'):>20,} filed={f.get('filed')} fp={f.get('fp')} end={f.get('end')} accn={f.get('accn')}")

# ============================================================
# TSLA: Check raw values for FY2016-2018 (unit issue)
# ============================================================
print()
print("TSLA: Revenue raw values FY2016-2019:")
tsla_rev_facts = tsla_us_gaap.get("RevenueFromContractWithCustomerExcludingAssessedTax", {}).get("units", {}).get("USD", [])
for fy_check in [2016, 2017, 2018, 2019]:
    fy_data = [f for f in tsla_rev_facts if f.get("fy") == fy_check and f.get("form") in ("10-K","10-KT")]
    print(f"  FY{fy_check}:")
    for f in sorted(fy_data, key=lambda x: x.get("filed",""), reverse=True):
        print(f"    val={f.get('val'):>20,} filed={f.get('filed')} fp={f.get('fp')} end={f.get('end')}")
    # Also check Revenues tag
    tsla_rev2_facts = tsla_us_gaap.get("Revenues", {}).get("units", {}).get("USD", [])
    fy_data2 = [f for f in tsla_rev2_facts if f.get("fy") == fy_check and f.get("form") in ("10-K","10-KT")]
    for f in sorted(fy_data2, key=lambda x: x.get("filed",""), reverse=True):
        print(f"    [Revenues] val={f.get('val'):>20,} filed={f.get('filed')} fp={f.get('fp')} end={f.get('end')}")
