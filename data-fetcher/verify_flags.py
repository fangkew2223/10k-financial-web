import pandas as pd
df = pd.read_csv('nasdaq_top10_derived_metrics.csv')

print('=== Output file: nasdaq_top10_derived_metrics.csv ===')
print(f'Rows: {len(df)}  |  Columns: {len(df.columns)}')
print()
print('Columns:', df.columns.tolist())
print()

print('=== All flagged rows (risk_score >= 1) ===')
cols = ['ticker','fy','accrual_ratio','cash_conversion','ar_gap','inventory_gap',
        'asset_turnover_drop_pct','margin_drop_pts',
        'flag_accrual','flag_cash_conversion','flag_ar_gap','flag_inventory_gap',
        'flag_asset_turnover_drop','flag_margin_drop','risk_score']
flagged = df[df['risk_score'] >= 1][cols]
print(flagged.to_string(index=False))

print()
print('=== Risk score distribution ===')
print(df['risk_score'].value_counts().sort_index())
