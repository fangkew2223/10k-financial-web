import pandas as pd
df = pd.read_csv('nasdaq_top10_10k_key_metrics.csv')
print('=== PEP AR data ===')
print(df[df['ticker']=='PEP'][['ticker','fy','revenue','ar','inventory','net_income']].to_string())
print()
pep = df[df['ticker']=='PEP']
print(f'Total PEP rows: {len(pep)}')
print(f'PEP rows with AR data: {pep["ar"].notna().sum()}')
print(f'PEP rows with NULL AR: {pep["ar"].isna().sum()}')
