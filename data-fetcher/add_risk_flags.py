import pandas as pd
import numpy as np

# ── Load derived metrics ─────────────────────────────────────────────────────
df = pd.read_csv('nasdaq_top10_derived_metrics.csv')

# ── Prior-year values needed for YoY drop flags ─────────────────────────────
# Sort so shift() works correctly within each ticker
df = df.sort_values(['ticker', 'fy']).reset_index(drop=True)

df['prev_asset_turnover']   = df.groupby('ticker')['asset_turnover'].shift(1)
df['prev_net_profit_margin'] = df.groupby('ticker')['net_profit_margin'].shift(1)

# ── Flag Rules ───────────────────────────────────────────────────────────────
# 1. Accrual ratio > 0.10  →  earnings quality concern
df['flag_accrual'] = (df['accrual_ratio'] > 0.10).astype('Int64')

# 2. Cash conversion < 0.50  →  weak cash backing of earnings
df['flag_cash_conversion'] = (df['cash_conversion'] < 0.50).astype('Int64')

# 3. AR gap > 20 days YoY  →  receivables growing faster than revenue
df['flag_ar_gap'] = (df['ar_gap'] > 20).astype('Int64')

# 4. Inventory gap > 25 days YoY  →  inventory building up
df['flag_inventory_gap'] = (df['inventory_gap'] > 25).astype('Int64')

# 5. Asset turnover drop > 20% vs prior year
#    drop = (prev - current) / prev > 0.20
df['asset_turnover_drop_pct'] = (
    (df['prev_asset_turnover'] - df['asset_turnover']) / df['prev_asset_turnover']
)
df['flag_asset_turnover_drop'] = (df['asset_turnover_drop_pct'] > 0.20).astype('Int64')

# 6. Net profit margin drop > 5 percentage points vs prior year
#    e.g. 0.25 → 0.19 = drop of 0.06 → flag
df['margin_drop_pts'] = df['prev_net_profit_margin'] - df['net_profit_margin']
df['flag_margin_drop'] = (df['margin_drop_pts'] > 0.05).astype('Int64')

# ── Risk Score = total number of flags ──────────────────────────────────────
flag_cols = [
    'flag_accrual',
    'flag_cash_conversion',
    'flag_ar_gap',
    'flag_inventory_gap',
    'flag_asset_turnover_drop',
    'flag_margin_drop',
]
# Sum flags (NaN treated as 0 for the score)
df['risk_score'] = df[flag_cols].fillna(0).sum(axis=1).astype(int)

# ── Build final output ───────────────────────────────────────────────────────
output_cols = [
    # Identity
    'ticker', 'company', 'cik', 'fy',
    # Raw inputs
    'revenue', 'ar', 'inventory', 'assets', 'net_income', 'cfo',
    # Supporting intermediates
    'avg_assets', 'dso_days', 'dso_prior_year_days', 'dio_days', 'dio_prior_year_days',
    # Core metrics
    'accrual_ratio',
    'cash_conversion',
    'ar_gap',
    'inventory_gap',
    'asset_turnover',
    'net_profit_margin',
    # YoY change helpers
    'asset_turnover_drop_pct',
    'margin_drop_pts',
    # Flags
    'flag_accrual',
    'flag_cash_conversion',
    'flag_ar_gap',
    'flag_inventory_gap',
    'flag_asset_turnover_drop',
    'flag_margin_drop',
    # Risk score
    'risk_score',
]

result = df[output_cols].copy()

# Round float columns
round4 = [
    'avg_assets', 'dso_days', 'dso_prior_year_days', 'dio_days', 'dio_prior_year_days',
    'accrual_ratio', 'cash_conversion', 'ar_gap', 'inventory_gap',
    'asset_turnover', 'net_profit_margin',
    'asset_turnover_drop_pct', 'margin_drop_pts',
]
for col in round4:
    result[col] = result[col].round(4)

# ── Save ─────────────────────────────────────────────────────────────────────
output_path = 'nasdaq_top10_derived_metrics.csv'
result.to_csv(output_path, index=False)

print(f"Saved to {output_path}")
print(f"Rows: {len(result)}  |  Columns: {len(result.columns)}")

# ── Summary ──────────────────────────────────────────────────────────────────
print("\n── Flag thresholds ──────────────────────────────────────────────────")
print("  flag_accrual            : accrual_ratio > 0.10")
print("  flag_cash_conversion    : cash_conversion < 0.50")
print("  flag_ar_gap             : ar_gap > 20 days YoY")
print("  flag_inventory_gap      : inventory_gap > 25 days YoY")
print("  flag_asset_turnover_drop: asset turnover drop > 20% YoY")
print("  flag_margin_drop        : net profit margin drop > 5 pp YoY")

print("\n── Risk score distribution ──────────────────────────────────────────")
print(result['risk_score'].value_counts().sort_index().to_string())

print("\n── High-risk rows (risk_score >= 3) ─────────────────────────────────")
high = result[result['risk_score'] >= 3][
    ['ticker', 'fy', 'accrual_ratio', 'cash_conversion', 'ar_gap',
     'inventory_gap', 'asset_turnover_drop_pct', 'margin_drop_pts', 'risk_score']
]
print(high.to_string(index=False))

print("\n── Flag counts per metric ───────────────────────────────────────────")
for fc in flag_cols:
    n = result[fc].fillna(0).sum()
    print(f"  {fc:<30}: {int(n)} rows flagged")
