import pandas as pd
import numpy as np

# Load the data
df = pd.read_csv('nasdaq_top10_10k_key_metrics.csv')

# Convert numeric columns
numeric_cols = ['revenue', 'ar', 'inventory', 'assets', 'net_income', 'cfo']
for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# Sort by ticker and fiscal year so prior-year lookups work correctly
df = df.sort_values(['ticker', 'fy']).reset_index(drop=True)

# ── Prior-year values (shift within each ticker group) ──────────────────────
df['prev_assets']    = df.groupby('ticker')['assets'].shift(1)
df['prev_ar']        = df.groupby('ticker')['ar'].shift(1)
df['prev_inventory'] = df.groupby('ticker')['inventory'].shift(1)
df['prev_revenue']   = df.groupby('ticker')['revenue'].shift(1)

# Average total assets (current + prior) / 2
df['avg_assets'] = (df['assets'] + df['prev_assets']) / 2

# ── 1. Accrual Ratio ─────────────────────────────────────────────────────────
# (Net Income - CFO) / Average Total Assets
# Measures earnings quality; lower (more negative) = higher cash-based earnings
df['accrual_ratio'] = (df['net_income'] - df['cfo']) / df['avg_assets']

# ── 2. Cash Conversion ───────────────────────────────────────────────────────
# CFO / Net Income
# How much of net income is backed by operating cash flow; >1 is healthy
df['cash_conversion'] = df['cfo'] / df['net_income']

# ── 3. AR Gap (Days Sales Outstanding delta YoY) ────────────────────────────
# DSO = AR / Revenue * 365
# AR Gap = DSO_current - DSO_prior  (positive = AR growing faster than revenue)
df['dso_current'] = df['ar'] / df['revenue'] * 365
df['dso_prior']   = df['prev_ar'] / df['prev_revenue'] * 365
df['ar_gap']      = df['dso_current'] - df['dso_prior']

# ── 4. Inventory Gap (Days Inventory Outstanding delta YoY) ─────────────────
# DIO = Inventory / Revenue * 365
# Inventory Gap = DIO_current - DIO_prior  (positive = inventory building up)
df['dio_current'] = df['inventory'] / df['revenue'] * 365
df['dio_prior']   = df['prev_inventory'] / df['prev_revenue'] * 365
df['inventory_gap'] = df['dio_current'] - df['dio_prior']

# ── 5. Asset Turnover ────────────────────────────────────────────────────────
# Revenue / Average Total Assets
# Higher = more efficient use of assets to generate revenue
df['asset_turnover'] = df['revenue'] / df['avg_assets']

# ── 6. Gross Margin ──────────────────────────────────────────────────────────
# NOTE: COGS is not available in this dataset.
# Using Net Profit Margin (Net Income / Revenue) as the closest available proxy.
# Labeled as 'net_profit_margin' to be accurate.
df['gross_margin_proxy'] = df['net_income'] / df['revenue']

# ── Build output DataFrame ───────────────────────────────────────────────────
output_cols = [
    'ticker', 'company', 'cik', 'fy',
    'revenue', 'ar', 'inventory', 'assets', 'net_income', 'cfo',
    # Intermediate / supporting metrics
    'avg_assets',
    'dso_current', 'dso_prior',
    'dio_current', 'dio_prior',
    # The 6 requested metrics
    'accrual_ratio',
    'cash_conversion',
    'ar_gap',
    'inventory_gap',
    'asset_turnover',
    'gross_margin_proxy',
]

result = df[output_cols].copy()

# Round derived metrics to 4 decimal places for readability
metric_cols = [
    'avg_assets', 'dso_current', 'dso_prior', 'dio_current', 'dio_prior',
    'accrual_ratio', 'cash_conversion', 'ar_gap', 'inventory_gap',
    'asset_turnover', 'gross_margin_proxy'
]
for col in metric_cols:
    result[col] = result[col].round(4)

# Rename columns for clarity in the output
result = result.rename(columns={
    'dso_current':        'dso_days',
    'dso_prior':          'dso_prior_year_days',
    'dio_current':        'dio_days',
    'dio_prior':          'dio_prior_year_days',
    'gross_margin_proxy': 'net_profit_margin',
})

# Save to CSV
output_path = 'nasdaq_top10_derived_metrics.csv'
result.to_csv(output_path, index=False)

print(f"Saved to {output_path}")
print(f"Rows: {len(result)}, Columns: {len(result.columns)}")
print("\nColumn descriptions:")
print("  accrual_ratio      = (Net Income - CFO) / Avg Assets  [lower = better earnings quality]")
print("  cash_conversion    = CFO / Net Income                  [>1 = cash-backed earnings]")
print("  ar_gap             = DSO change YoY (days)             [positive = AR growing faster than revenue]")
print("  inventory_gap      = DIO change YoY (days)             [positive = inventory building up]")
print("  asset_turnover     = Revenue / Avg Assets              [higher = more efficient]")
print("  net_profit_margin  = Net Income / Revenue              [COGS unavailable; proxy for gross margin]")
print("\nSample output (first 5 rows with metrics):")
print(result[['ticker','fy','accrual_ratio','cash_conversion','ar_gap','inventory_gap','asset_turnover','net_profit_margin']].head(10).to_string(index=False))
