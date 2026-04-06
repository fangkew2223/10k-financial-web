import requests

HEADERS = {
    "User-Agent": "cagejia@gmail.com",
    "Accept-Encoding": "gzip, deflate",
    "Host": "data.sec.gov",
}

def get_json(url):
    r = requests.get(url, headers=HEADERS, timeout=45)
    r.raise_for_status()
    return r.json()

# ---- PEP AR investigation ----
print("=== PEP (0000077476) - AR-related tags ===")
pep_facts = get_json("https://data.sec.gov/api/xbrl/companyfacts/CIK0000077476.json")
us_gaap_pep = pep_facts.get("facts", {}).get("us-gaap", {})

ar_candidates = [
    "AccountsNotesAndLoansReceivableNetCurrent",
    "AccountsReceivableGrossCurrent",
    "OtherReceivables",
    "ReceivablesNetCurrent",
    "AccountsReceivableNetCurrent",
    "AccountsReceivableNet",
]
for tag in ar_candidates:
    if tag in us_gaap_pep:
        facts = us_gaap_pep[tag].get("units", {}).get("USD", [])
        annual = [f for f in facts if f.get("form") in ("10-K", "10-KT") and not str(f.get("fp", "")).startswith("Q")]
        print(f"  Tag {tag}: {len(annual)} annual facts")
        for f in sorted(annual, key=lambda x: x.get("fy", 0), reverse=True)[:3]:
            print(f"    FY={f.get('fy')} val={f.get('val')} filed={f.get('filed')}")
    else:
        print(f"  Tag {tag}: NOT FOUND")

# ---- META inventory investigation ----
print()
print("=== META (0001326801) - Inventory-related tags ===")
meta_facts = get_json("https://data.sec.gov/api/xbrl/companyfacts/CIK0001326801.json")
us_gaap_meta = meta_facts.get("facts", {}).get("us-gaap", {})

# Print all namespaces available
all_ns = list(meta_facts.get("facts", {}).keys())
print("Fact namespaces:", all_ns)

# Search for any inventory-like tags
inv_tags = [k for k in us_gaap_meta.keys() if any(x in k.lower() for x in
    ["inventor", "hardware", "server", "supply", "goods", "material", "component", "device", "equipment"])]
print("Inventory-like tags:", inv_tags)

# Check standard inventory tags explicitly
for tag in ["InventoryNet", "InventoriesNet", "InventoryFinishedGoods", "Inventory", "Inventories"]:
    if tag in us_gaap_meta:
        facts = us_gaap_meta[tag].get("units", {}).get("USD", [])
        annual = [f for f in facts if f.get("form") in ("10-K", "10-KT") and not str(f.get("fp", "")).startswith("Q")]
        print(f"  Tag {tag}: {len(annual)} annual facts")
    else:
        print(f"  Tag {tag}: NOT FOUND")

# Check if META has any custom (non-us-gaap) facts namespace
for ns, ns_data in meta_facts.get("facts", {}).items():
    if ns != "us-gaap":
        inv_custom = [k for k in ns_data.keys() if any(x in k.lower() for x in ["inventor", "hardware", "supply", "goods"])]
        if inv_custom:
            print(f"  Custom namespace '{ns}' inventory tags: {inv_custom}")
        else:
            print(f"  Custom namespace '{ns}': no inventory tags found (total tags: {len(ns_data)})")
