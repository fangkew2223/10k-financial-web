"""Debug PEP AR with the fixed extract_annual_series logic"""
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
                    "fy": fy, "value": val, "filed": filed, "period_end": end,
                    "period_days": period_days, "tag": tag, "tag_rank": rank,
                    "fp": fp, "end_year": end_year,
                })
    if not rows:
        return pd.DataFrame()
    df = pd.DataFrame(rows)
    df["filed"] = pd.to_datetime(df["filed"], errors="coerce")
    df = (
        df.sort_values(["fy", "tag", "period_days", "filed"], ascending=[True, True, False, False])
        .drop_duplicates(subset=["fy", "tag"], keep="first")
        .sort_values(["fy", "tag_rank", "period_days", "filed"], ascending=[True, True, False, False])
        .drop_duplicates(subset=["fy"], keep="first")
        .sort_values("fy").reset_index(drop=True)
    )
    return df

pep = get_companyfacts("0000077476")
us_gaap = pep["facts"]["us-gaap"]

# Show ALL raw entries for AccountsNotesAndLoansReceivableNetCurrent
print("=== PEP: Raw AccountsNotesAndLoansReceivableNetCurrent entries (10-K only) ===")
tag = "AccountsNotesAndLoansReceivableNetCurrent"
facts = us_gaap.get(tag, {}).get("units", {}).get("USD", [])
annual = [f for f in facts if f.get("form") in ("10-K","10-KT","20-F","40-F")]
for f in sorted(annual, key=lambda x: (x.get("fy",0), x.get("filed","")), reverse=True)[:20]:
    end = f.get("end","")
    fy = f.get("fy")
    try:
        end_year = pd.to_datetime(end, errors="coerce").year
    except:
        end_year = None
    match = "✓ MATCH" if end_year == fy else f"✗ MISMATCH (end_year={end_year})"
    print(f"  fy={fy} fp={f.get('fp')} val={f.get('val'):>15,} filed={f.get('filed')} end={end} start={f.get('start')} {match}")

print()
print("=== PEP: Running fixed extract_annual_series for AR tags ===")
ar_tags = [
    "AccountsReceivableNetCurrent",
    "AccountsReceivableNet",
    "ReceivablesNetCurrent",
    "AccountsNotesAndLoansReceivableNetCurrent",
]
result = extract_annual_series_fixed(pep, ar_tags)
if result.empty:
    print("  RESULT IS EMPTY - no AR data extracted!")
else:
    print(result[["fy", "value", "tag", "fp", "period_days", "end_year"]].to_string())
