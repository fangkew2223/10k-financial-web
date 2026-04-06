"""Quick verification: run only PEP and META through the updated script logic."""
import requests
import pandas as pd
from typing import List

HEADERS = {
    "User-Agent": "cagejia@gmail.com",
    "Accept-Encoding": "gzip, deflate",
    "Host": "data.sec.gov",
}

METRIC_TAG_CANDIDATES = {
    "revenue": [
        "RevenueFromContractWithCustomerExcludingAssessedTax",
        "Revenues",
        "SalesRevenueNet",
    ],
    "ar": [
        "AccountsReceivableNetCurrent",
        "AccountsReceivableNet",
        "ReceivablesNetCurrent",
        "AccountsNotesAndLoansReceivableNetCurrent",  # used by PEP and some other companies
    ],
    "inventory": [
        "InventoryNet",
        "InventoriesNet",
        "InventoryFinishedGoods",
        "Inventory",
        "Inventories",
    ],
    "assets": ["Assets"],
    "net_income": ["NetIncomeLoss", "ProfitLoss", "IncomeLossFromContinuingOperations"],
    "cfo": [
        "NetCashProvidedByUsedInOperatingActivities",
        "NetCashProvidedByUsedInOperatingActivitiesContinuingOperations",
    ],
}

YEARS_BACK = 5  # just 5 years for quick check

def get_json(url):
    r = requests.get(url, headers=HEADERS, timeout=45)
    r.raise_for_status()
    return r.json()

def extract_annual_series(companyfacts, tags):
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
                rows.append({"fy": int(fy), "value": val, "filed": filed,
                              "period_end": end, "accn": accn, "tag": tag, "tag_rank": rank})
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

def check_ticker(ticker, cik):
    print(f"\n{'='*60}")
    print(f"  {ticker} (CIK {cik})")
    print(f"{'='*60}")
    companyfacts = get_json(f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json")
    for metric in ["ar", "inventory"]:
        tags = METRIC_TAG_CANDIDATES[metric]
        series = extract_annual_series(companyfacts, tags)
        if series.empty:
            print(f"  {metric:12s}: NO DATA (NaN) — tag not found in SEC filings")
        else:
            recent = series.sort_values("fy", ascending=False).head(YEARS_BACK)
            tag_used = series["tag"].iloc[0]
            print(f"  {metric:12s}: {len(recent)} years of data  [tag: {tag_used}]")
            for _, row in recent.iterrows():
                print(f"    FY={int(row['fy'])}  val={row['value']:,.0f}")

check_ticker("PEP",  "0000077476")
check_ticker("META", "0001326801")
