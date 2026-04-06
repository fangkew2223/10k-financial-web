/**
 * Forecast & Early Warning System — Data Model
 * 
 * Simulates ML-based predictions (XGBoost / LightGBM style) for:
 *   1. Margin Decline Probability (next 2 quarters)
 *   2. Revenue Slowdown Probability (next 2 quarters)
 *   3. Cash Flow Deterioration Probability
 *   4. Risk Factor Escalation Probability
 * 
 * Each prediction includes:
 *   - Probability score (0–100%)
 *   - Confidence interval
 *   - Top contributing drivers (feature importance)
 *   - Historical trend data for sparkline visualization
 *   - Alert severity level
 */

export type AlertSeverity = 'critical' | 'warning' | 'watch' | 'stable';

export interface PredictionDriver {
  factor: string;
  impact: number;       // -100 to +100 (negative = risk-increasing)
  direction: 'up' | 'down' | 'flat';
  description: string;
  category: 'financial' | 'operational' | 'market' | 'disclosure';
}

export interface ForecastPrediction {
  metric: string;
  metricLabel: string;
  probability: number;          // 0–100
  confidenceLow: number;        // lower bound
  confidenceHigh: number;       // upper bound
  severity: AlertSeverity;
  trend: number[];              // last 6 periods trend (for sparkline)
  drivers: PredictionDriver[];
  modelAccuracy: number;        // backtested accuracy %
  lastUpdated: string;
}

export interface CompanyForecast {
  ticker: string;
  companyName: string;
  overallRiskScore: number;     // 0–100 composite
  overallSeverity: AlertSeverity;
  predictions: ForecastPrediction[];
  historicalAccuracy: number;   // model backtest accuracy
  nextEarningsDate: string;
  watchlistPriority: number;    // 1 = highest priority
  // Time-series forecast for margin
  marginForecast: { period: string; actual: number | null; predicted: number; lower: number; upper: number }[];
  // Time-series forecast for revenue growth
  revenueGrowthForecast: { period: string; actual: number | null; predicted: number; lower: number; upper: number }[];
}

function getSeverity(prob: number): AlertSeverity {
  if (prob >= 75) return 'critical';
  if (prob >= 50) return 'warning';
  if (prob >= 30) return 'watch';
  return 'stable';
}

const forecastDatabase: CompanyForecast[] = [
  // ─── AAPL ───
  {
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    overallRiskScore: 32,
    overallSeverity: 'watch',
    predictions: [
      {
        metric: 'margin_decline',
        metricLabel: 'Margin Decline',
        probability: 38,
        confidenceLow: 30,
        confidenceHigh: 46,
        severity: 'watch',
        trend: [25.3, 25.9, 25.3, 25.3, 24.0, 26.9],
        drivers: [
          { factor: 'Rising SG&A Ratio', impact: -28, direction: 'up', description: 'SG&A as % of revenue increased 1.2pp YoY', category: 'financial' },
          { factor: 'Services Mix Shift', impact: 22, direction: 'up', description: 'Higher-margin services growing faster than hardware', category: 'operational' },
          { factor: 'Component Cost Pressure', impact: -18, direction: 'up', description: 'Semiconductor and display costs trending higher', category: 'market' },
          { factor: 'China Revenue Softness', impact: -15, direction: 'down', description: 'Greater China revenue declined 2.3% in latest quarter', category: 'market' },
        ],
        modelAccuracy: 82,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'revenue_slowdown',
        metricLabel: 'Revenue Slowdown',
        probability: 29,
        confidenceLow: 22,
        confidenceHigh: 36,
        severity: 'stable',
        trend: [6.3, 15.8, -2.0, 5.2, 33.3, 7.8],
        drivers: [
          { factor: 'iPhone Upgrade Cycle', impact: 30, direction: 'up', description: 'AI-driven iPhone 17 cycle expected to drive upgrades', category: 'market' },
          { factor: 'Wearables Saturation', impact: -20, direction: 'down', description: 'Watch/AirPods growth decelerating', category: 'operational' },
          { factor: 'India Market Expansion', impact: 25, direction: 'up', description: 'India revenue growing 30%+ YoY', category: 'market' },
        ],
        modelAccuracy: 79,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'cash_flow_deterioration',
        metricLabel: 'Cash Flow Deterioration',
        probability: 22,
        confidenceLow: 15,
        confidenceHigh: 29,
        severity: 'stable',
        trend: [1.30, 1.30, 1.22, 1.14, 1.26, 1.00],
        drivers: [
          { factor: 'Strong Cash Conversion', impact: 35, direction: 'up', description: 'Cash conversion ratio remains above 1.0x', category: 'financial' },
          { factor: 'AR Growth Acceleration', impact: -22, direction: 'up', description: 'DSO increased from 31 to 35 days', category: 'operational' },
        ],
        modelAccuracy: 85,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'risk_factor_escalation',
        metricLabel: 'Risk Factor Escalation',
        probability: 25,
        confidenceLow: 18,
        confidenceHigh: 32,
        severity: 'stable',
        trend: [0, 0, 0, 0, 0, 0],
        drivers: [
          { factor: 'Regulatory Pressure', impact: -20, direction: 'up', description: 'EU DMA compliance costs increasing', category: 'disclosure' },
          { factor: 'Consistent Risk Profile', impact: 40, direction: 'flat', description: 'Zero risk flags triggered in last 5 years', category: 'financial' },
        ],
        modelAccuracy: 88,
        lastUpdated: '2026-03-15',
      },
    ],
    historicalAccuracy: 83,
    nextEarningsDate: '2026-07-31',
    watchlistPriority: 7,
    marginForecast: [
      { period: 'FY2021', actual: 25.88, predicted: 25.5, lower: 24.8, upper: 26.2 },
      { period: 'FY2022', actual: 25.31, predicted: 25.9, lower: 25.0, upper: 26.8 },
      { period: 'FY2023', actual: 25.31, predicted: 25.1, lower: 24.3, upper: 25.9 },
      { period: 'FY2024', actual: 23.97, predicted: 24.8, lower: 23.9, upper: 25.7 },
      { period: 'FY2025', actual: 26.92, predicted: 24.2, lower: 23.1, upper: 25.3 },
      { period: 'Q1 2027', actual: null, predicted: 26.5, lower: 24.8, upper: 28.2 },
      { period: 'Q2 2027', actual: null, predicted: 25.8, lower: 23.9, upper: 27.7 },
    ],
    revenueGrowthForecast: [
      { period: 'FY2021', actual: 33.3, predicted: 30.1, lower: 27.5, upper: 32.7 },
      { period: 'FY2022', actual: 7.8, predicted: 10.2, lower: 7.8, upper: 12.6 },
      { period: 'FY2023', actual: -2.8, predicted: 2.1, lower: -1.5, upper: 5.7 },
      { period: 'FY2024', actual: 2.0, predicted: 3.5, lower: 0.8, upper: 6.2 },
      { period: 'FY2025', actual: 6.4, predicted: 5.1, lower: 2.8, upper: 7.4 },
      { period: 'Q1 2027', actual: null, predicted: 5.8, lower: 3.2, upper: 8.4 },
      { period: 'Q2 2027', actual: null, predicted: 5.2, lower: 2.4, upper: 8.0 },
    ],
  },

  // ─── MSFT ───
  {
    ticker: 'MSFT',
    companyName: 'Microsoft Corporation',
    overallRiskScore: 18,
    overallSeverity: 'stable',
    predictions: [
      {
        metric: 'margin_decline',
        metricLabel: 'Margin Decline',
        probability: 22,
        confidenceLow: 15,
        confidenceHigh: 29,
        severity: 'stable',
        trend: [36.5, 36.7, 34.2, 36.0, 36.2, 36.2],
        drivers: [
          { factor: 'Azure Growth Momentum', impact: 40, direction: 'up', description: 'Cloud revenue growing 29% YoY with improving margins', category: 'operational' },
          { factor: 'AI Capex Investment', impact: -25, direction: 'up', description: 'Massive datacenter buildout pressuring near-term margins', category: 'financial' },
          { factor: 'Copilot Monetization', impact: 30, direction: 'up', description: 'AI Copilot ARPU increasing across Office 365 base', category: 'market' },
        ],
        modelAccuracy: 84,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'revenue_slowdown',
        metricLabel: 'Revenue Slowdown',
        probability: 15,
        confidenceLow: 10,
        confidenceHigh: 20,
        severity: 'stable',
        trend: [17.5, 17.8, 6.9, 15.5, 14.6, 14.9],
        drivers: [
          { factor: 'Cloud Secular Trend', impact: 45, direction: 'up', description: 'Enterprise cloud migration still in early innings', category: 'market' },
          { factor: 'Gaming Segment', impact: -10, direction: 'down', description: 'Xbox hardware sales declining', category: 'operational' },
        ],
        modelAccuracy: 81,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'cash_flow_deterioration',
        metricLabel: 'Cash Flow Deterioration',
        probability: 12,
        confidenceLow: 7,
        confidenceHigh: 17,
        severity: 'stable',
        trend: [1.25, 1.22, 1.21, 1.35, 1.34, 1.34],
        drivers: [
          { factor: 'Exceptional Cash Generation', impact: 50, direction: 'up', description: 'CFO/Net Income consistently above 1.2x', category: 'financial' },
        ],
        modelAccuracy: 89,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'risk_factor_escalation',
        metricLabel: 'Risk Factor Escalation',
        probability: 14,
        confidenceLow: 8,
        confidenceHigh: 20,
        severity: 'stable',
        trend: [0, 0, 0, 0, 0, 0],
        drivers: [
          { factor: 'Antitrust Scrutiny', impact: -15, direction: 'up', description: 'EU and US regulators examining AI market dominance', category: 'disclosure' },
          { factor: 'Pristine Financial Health', impact: 50, direction: 'flat', description: 'No risk flags in 7+ consecutive years', category: 'financial' },
        ],
        modelAccuracy: 90,
        lastUpdated: '2026-03-15',
      },
    ],
    historicalAccuracy: 86,
    nextEarningsDate: '2026-07-22',
    watchlistPriority: 9,
    marginForecast: [
      { period: 'FY2021', actual: 36.45, predicted: 35.8, lower: 34.9, upper: 36.7 },
      { period: 'FY2022', actual: 36.69, predicted: 36.5, lower: 35.5, upper: 37.5 },
      { period: 'FY2023', actual: 34.15, predicted: 35.8, lower: 34.6, upper: 37.0 },
      { period: 'FY2024', actual: 35.96, predicted: 34.5, lower: 33.2, upper: 35.8 },
      { period: 'FY2025', actual: 36.15, predicted: 36.0, lower: 34.8, upper: 37.2 },
      { period: 'Q1 2027', actual: null, predicted: 36.8, lower: 35.2, upper: 38.4 },
      { period: 'Q2 2027', actual: null, predicted: 37.1, lower: 35.3, upper: 38.9 },
    ],
    revenueGrowthForecast: [
      { period: 'FY2021', actual: 17.5, predicted: 16.8, lower: 14.5, upper: 19.1 },
      { period: 'FY2022', actual: 17.8, predicted: 16.2, lower: 13.8, upper: 18.6 },
      { period: 'FY2023', actual: 6.9, predicted: 12.5, lower: 9.8, upper: 15.2 },
      { period: 'FY2024', actual: 15.5, predicted: 10.8, lower: 8.2, upper: 13.4 },
      { period: 'FY2025', actual: 14.6, predicted: 14.2, lower: 11.8, upper: 16.6 },
      { period: 'Q1 2027', actual: null, predicted: 15.2, lower: 12.5, upper: 17.9 },
      { period: 'Q2 2027', actual: null, predicted: 14.8, lower: 11.9, upper: 17.7 },
    ],
  },

  // ─── NVDA ───
  {
    ticker: 'NVDA',
    companyName: 'NVIDIA Corporation',
    overallRiskScore: 52,
    overallSeverity: 'warning',
    predictions: [
      {
        metric: 'margin_decline',
        metricLabel: 'Margin Decline',
        probability: 58,
        confidenceLow: 48,
        confidenceHigh: 68,
        severity: 'warning',
        trend: [26.0, 36.2, 16.2, 48.9, 55.9, 55.6],
        drivers: [
          { factor: 'Rising Accrual Ratio', impact: -45, direction: 'up', description: 'Accrual ratio hit 10.9% — highest in company history, flagged by model', category: 'financial' },
          { factor: 'Inventory Buildup Risk', impact: -30, direction: 'up', description: 'Inventory doubled to $21.4B; DIO rising to 36 days', category: 'operational' },
          { factor: 'Competition Intensifying', impact: -25, direction: 'up', description: 'AMD MI300X and custom ASICs gaining datacenter share', category: 'market' },
          { factor: 'Export Restrictions', impact: -35, direction: 'up', description: 'China export controls limiting $8B+ addressable market', category: 'disclosure' },
          { factor: 'AI Demand Supercycle', impact: 50, direction: 'up', description: 'Datacenter revenue still growing 65%+ YoY', category: 'market' },
        ],
        modelAccuracy: 76,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'revenue_slowdown',
        metricLabel: 'Revenue Slowdown',
        probability: 62,
        confidenceLow: 52,
        confidenceHigh: 72,
        severity: 'warning',
        trend: [52.8, 38.1, 0.2, 126.9, 114.2, 65.7],
        drivers: [
          { factor: 'Law of Large Numbers', impact: -40, direction: 'down', description: 'Revenue base now $216B — sustaining 100%+ growth mathematically impossible', category: 'financial' },
          { factor: 'Customer Capex Fatigue', impact: -30, direction: 'down', description: 'Hyperscaler capex growth showing signs of deceleration', category: 'market' },
          { factor: 'Blackwell Ramp', impact: 35, direction: 'up', description: 'Next-gen Blackwell Ultra architecture driving upgrade cycle', category: 'operational' },
          { factor: 'Sovereign AI Demand', impact: 25, direction: 'up', description: 'Government AI infrastructure spending accelerating globally', category: 'market' },
        ],
        modelAccuracy: 72,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'cash_flow_deterioration',
        metricLabel: 'Cash Flow Deterioration',
        probability: 45,
        confidenceLow: 35,
        confidenceHigh: 55,
        severity: 'watch',
        trend: [1.34, 0.93, 1.29, 0.94, 0.88, 0.86],
        drivers: [
          { factor: 'Cash Conversion Below 1.0x', impact: -35, direction: 'down', description: 'CFO/Net Income dropped to 0.86x — cash not keeping pace with earnings', category: 'financial' },
          { factor: 'Massive AR Growth', impact: -28, direction: 'up', description: 'AR surged to $38.5B; DSO at 65 days', category: 'operational' },
          { factor: 'Working Capital Strain', impact: -20, direction: 'up', description: 'Inventory + AR consuming significant cash', category: 'financial' },
        ],
        modelAccuracy: 78,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'risk_factor_escalation',
        metricLabel: 'Risk Factor Escalation',
        probability: 72,
        confidenceLow: 62,
        confidenceHigh: 82,
        severity: 'warning',
        trend: [0, 0, 2, 0, 0, 1],
        drivers: [
          { factor: 'Accrual Flag Triggered', impact: -50, direction: 'up', description: 'FY2026 accrual ratio of 10.9% exceeded 10% threshold', category: 'financial' },
          { factor: 'Geopolitical Risk Disclosure', impact: -35, direction: 'up', description: '10-K risk factors expanded significantly on China/export controls', category: 'disclosure' },
          { factor: 'Concentration Risk', impact: -25, direction: 'up', description: 'Top 4 customers represent ~40% of datacenter revenue', category: 'market' },
        ],
        modelAccuracy: 80,
        lastUpdated: '2026-03-15',
      },
    ],
    historicalAccuracy: 77,
    nextEarningsDate: '2026-05-28',
    watchlistPriority: 1,
    marginForecast: [
      { period: 'FY2022', actual: 36.23, predicted: 35.0, lower: 32.5, upper: 37.5 },
      { period: 'FY2023', actual: 16.19, predicted: 30.5, lower: 25.0, upper: 36.0 },
      { period: 'FY2024', actual: 48.85, predicted: 22.0, lower: 15.0, upper: 29.0 },
      { period: 'FY2025', actual: 55.85, predicted: 50.2, lower: 44.0, upper: 56.4 },
      { period: 'FY2026', actual: 55.60, predicted: 54.0, lower: 48.5, upper: 59.5 },
      { period: 'Q1 2027', actual: null, predicted: 52.5, lower: 46.0, upper: 59.0 },
      { period: 'Q2 2027', actual: null, predicted: 50.8, lower: 43.5, upper: 58.1 },
    ],
    revenueGrowthForecast: [
      { period: 'FY2022', actual: 38.1, predicted: 35.0, lower: 28.0, upper: 42.0 },
      { period: 'FY2023', actual: 0.2, predicted: 15.0, lower: 5.0, upper: 25.0 },
      { period: 'FY2024', actual: 126.9, predicted: 45.0, lower: 25.0, upper: 65.0 },
      { period: 'FY2025', actual: 114.2, predicted: 95.0, lower: 70.0, upper: 120.0 },
      { period: 'FY2026', actual: 65.7, predicted: 60.0, lower: 45.0, upper: 75.0 },
      { period: 'Q1 2027', actual: null, predicted: 35.0, lower: 20.0, upper: 50.0 },
      { period: 'Q2 2027', actual: null, predicted: 28.0, lower: 15.0, upper: 41.0 },
    ],
  },

  // ─── AMZN ───
  {
    ticker: 'AMZN',
    companyName: 'Amazon.com, Inc.',
    overallRiskScore: 28,
    overallSeverity: 'stable',
    predictions: [
      {
        metric: 'margin_decline',
        metricLabel: 'Margin Decline',
        probability: 24,
        confidenceLow: 17,
        confidenceHigh: 31,
        severity: 'stable',
        trend: [7.1, -0.5, 5.3, 9.3, 10.8, 10.8],
        drivers: [
          { factor: 'AWS Margin Expansion', impact: 40, direction: 'up', description: 'AWS operating margin improving to 37%+', category: 'operational' },
          { factor: 'Advertising High-Margin', impact: 35, direction: 'up', description: 'Ad revenue growing 20%+ at very high margins', category: 'operational' },
          { factor: 'Fulfillment Cost Optimization', impact: 20, direction: 'up', description: 'Regional fulfillment network reducing delivery costs', category: 'operational' },
        ],
        modelAccuracy: 80,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'revenue_slowdown',
        metricLabel: 'Revenue Slowdown',
        probability: 35,
        confidenceLow: 27,
        confidenceHigh: 43,
        severity: 'watch',
        trend: [21.4, 9.1, 11.8, 11.1, 12.4, 12.4],
        drivers: [
          { factor: 'E-commerce Maturation', impact: -25, direction: 'down', description: 'North America retail growth normalizing to single digits', category: 'market' },
          { factor: 'AWS Competition', impact: -20, direction: 'up', description: 'Azure and GCP gaining share in cloud market', category: 'market' },
          { factor: 'International Expansion', impact: 20, direction: 'up', description: 'Emerging market penetration still early', category: 'market' },
        ],
        modelAccuracy: 78,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'cash_flow_deterioration',
        metricLabel: 'Cash Flow Deterioration',
        probability: 18,
        confidenceLow: 12,
        confidenceHigh: 24,
        severity: 'stable',
        trend: [1.39, -17.2, 2.79, 1.96, 1.80, 1.80],
        drivers: [
          { factor: 'Strong Operating Leverage', impact: 40, direction: 'up', description: 'CFO growing faster than net income', category: 'financial' },
          { factor: 'Heavy Capex Cycle', impact: -20, direction: 'up', description: 'AI infrastructure investment consuming free cash flow', category: 'financial' },
        ],
        modelAccuracy: 82,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'risk_factor_escalation',
        metricLabel: 'Risk Factor Escalation',
        probability: 20,
        confidenceLow: 13,
        confidenceHigh: 27,
        severity: 'stable',
        trend: [0, 2, 0, 0, 0, 0],
        drivers: [
          { factor: 'FY2022 Recovery', impact: 35, direction: 'up', description: 'Fully recovered from FY2022 loss year; no flags since', category: 'financial' },
          { factor: 'Labor Cost Pressure', impact: -15, direction: 'up', description: 'Warehouse wage inflation and unionization efforts', category: 'disclosure' },
        ],
        modelAccuracy: 85,
        lastUpdated: '2026-03-15',
      },
    ],
    historicalAccuracy: 81,
    nextEarningsDate: '2026-07-24',
    watchlistPriority: 6,
    marginForecast: [
      { period: 'FY2021', actual: 7.10, predicted: 6.5, lower: 5.5, upper: 7.5 },
      { period: 'FY2022', actual: -0.53, predicted: 4.5, lower: 2.0, upper: 7.0 },
      { period: 'FY2023', actual: 5.29, predicted: 2.0, lower: -0.5, upper: 4.5 },
      { period: 'FY2024', actual: 9.29, predicted: 6.8, lower: 4.5, upper: 9.1 },
      { period: 'FY2025', actual: 10.83, predicted: 10.2, lower: 8.0, upper: 12.4 },
      { period: 'Q1 2027', actual: null, predicted: 11.5, lower: 9.0, upper: 14.0 },
      { period: 'Q2 2027', actual: null, predicted: 11.8, lower: 9.2, upper: 14.4 },
    ],
    revenueGrowthForecast: [
      { period: 'FY2021', actual: 21.4, predicted: 20.0, lower: 16.5, upper: 23.5 },
      { period: 'FY2022', actual: 9.1, predicted: 15.0, lower: 11.0, upper: 19.0 },
      { period: 'FY2023', actual: 11.8, predicted: 10.5, lower: 7.5, upper: 13.5 },
      { period: 'FY2024', actual: 11.1, predicted: 11.0, lower: 8.5, upper: 13.5 },
      { period: 'FY2025', actual: 12.4, predicted: 11.5, lower: 9.0, upper: 14.0 },
      { period: 'Q1 2027', actual: null, predicted: 11.0, lower: 8.0, upper: 14.0 },
      { period: 'Q2 2027', actual: null, predicted: 10.5, lower: 7.5, upper: 13.5 },
    ],
  },

  // ─── META ───
  {
    ticker: 'META',
    companyName: 'Meta Platforms, Inc.',
    overallRiskScore: 48,
    overallSeverity: 'watch',
    predictions: [
      {
        metric: 'margin_decline',
        metricLabel: 'Margin Decline',
        probability: 68,
        confidenceLow: 58,
        confidenceHigh: 78,
        severity: 'warning',
        trend: [33.4, 19.9, 29.0, 37.9, 30.1, 30.1],
        drivers: [
          { factor: 'Rising SG&A Ratio', impact: -35, direction: 'up', description: 'Reality Labs losses exceeding $16B annually', category: 'financial' },
          { factor: 'Weak Demand Signals in MD&A', impact: -28, direction: 'down', description: 'Ad impression growth slowing in North America', category: 'disclosure' },
          { factor: 'Industry Slowdown Trend', impact: -22, direction: 'down', description: 'Digital advertising market growth decelerating', category: 'market' },
          { factor: 'AI Infrastructure Spend', impact: -30, direction: 'up', description: 'Capex guidance raised to $60-65B for AI buildout', category: 'financial' },
          { factor: 'Reels Monetization', impact: 25, direction: 'up', description: 'Short-form video ad revenue per impression improving', category: 'operational' },
        ],
        modelAccuracy: 79,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'revenue_slowdown',
        metricLabel: 'Revenue Slowdown',
        probability: 42,
        confidenceLow: 33,
        confidenceHigh: 51,
        severity: 'watch',
        trend: [37.2, -1.1, 15.6, 22.8, 22.7, 22.7],
        drivers: [
          { factor: 'Ad Market Cyclicality', impact: -25, direction: 'down', description: 'Macro uncertainty could slow ad spending', category: 'market' },
          { factor: 'AI-Driven Ad Targeting', impact: 30, direction: 'up', description: 'Advantage+ AI campaigns improving ROAS for advertisers', category: 'operational' },
          { factor: 'WhatsApp Monetization', impact: 20, direction: 'up', description: 'Business messaging and payments gaining traction', category: 'operational' },
        ],
        modelAccuracy: 77,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'cash_flow_deterioration',
        metricLabel: 'Cash Flow Deterioration',
        probability: 20,
        confidenceLow: 13,
        confidenceHigh: 27,
        severity: 'stable',
        trend: [1.47, 2.18, 1.82, 1.46, 1.92, 1.92],
        drivers: [
          { factor: 'Excellent Cash Generation', impact: 45, direction: 'up', description: 'CFO consistently 1.5-2x net income', category: 'financial' },
        ],
        modelAccuracy: 84,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'risk_factor_escalation',
        metricLabel: 'Risk Factor Escalation',
        probability: 55,
        confidenceLow: 45,
        confidenceHigh: 65,
        severity: 'warning',
        trend: [0, 1, 0, 0, 1, 1],
        drivers: [
          { factor: 'Margin Drop Flag Active', impact: -40, direction: 'up', description: 'FY2025 margin dropped 7.8pp — flag_margin_drop triggered', category: 'financial' },
          { factor: 'Reality Labs Uncertainty', impact: -30, direction: 'up', description: 'Metaverse investment ROI timeline unclear in 10-K disclosures', category: 'disclosure' },
          { factor: 'Privacy Regulation', impact: -20, direction: 'up', description: 'GDPR fines and iOS privacy changes impacting targeting', category: 'disclosure' },
        ],
        modelAccuracy: 81,
        lastUpdated: '2026-03-15',
      },
    ],
    historicalAccuracy: 80,
    nextEarningsDate: '2026-07-23',
    watchlistPriority: 2,
    marginForecast: [
      { period: 'FY2021', actual: 33.38, predicted: 34.0, lower: 31.5, upper: 36.5 },
      { period: 'FY2022', actual: 19.90, predicted: 28.0, lower: 23.0, upper: 33.0 },
      { period: 'FY2023', actual: 28.98, predicted: 22.0, lower: 17.0, upper: 27.0 },
      { period: 'FY2024', actual: 37.91, predicted: 32.0, lower: 27.0, upper: 37.0 },
      { period: 'FY2025', actual: 30.08, predicted: 36.0, lower: 31.0, upper: 41.0 },
      { period: 'Q1 2027', actual: null, predicted: 28.5, lower: 23.0, upper: 34.0 },
      { period: 'Q2 2027', actual: null, predicted: 27.0, lower: 21.0, upper: 33.0 },
    ],
    revenueGrowthForecast: [
      { period: 'FY2021', actual: 37.2, predicted: 35.0, lower: 30.0, upper: 40.0 },
      { period: 'FY2022', actual: -1.1, predicted: 10.0, lower: 3.0, upper: 17.0 },
      { period: 'FY2023', actual: 15.6, predicted: 5.0, lower: -2.0, upper: 12.0 },
      { period: 'FY2024', actual: 22.8, predicted: 18.0, lower: 13.0, upper: 23.0 },
      { period: 'FY2025', actual: 22.7, predicted: 20.0, lower: 15.0, upper: 25.0 },
      { period: 'Q1 2027', actual: null, predicted: 18.0, lower: 12.0, upper: 24.0 },
      { period: 'Q2 2027', actual: null, predicted: 16.5, lower: 10.0, upper: 23.0 },
    ],
  },

  // ─── TSLA ───
  {
    ticker: 'TSLA',
    companyName: 'Tesla, Inc.',
    overallRiskScore: 78,
    overallSeverity: 'critical',
    predictions: [
      {
        metric: 'margin_decline',
        metricLabel: 'Margin Decline',
        probability: 82,
        confidenceLow: 74,
        confidenceHigh: 90,
        severity: 'critical',
        trend: [10.3, 15.4, 15.5, 7.3, 4.0, 4.0],
        drivers: [
          { factor: 'Severe Margin Compression', impact: -55, direction: 'down', description: 'Net margin collapsed from 15.5% to 4.0% over 2 years', category: 'financial' },
          { factor: 'Price War Pressure', impact: -45, direction: 'down', description: 'Multiple price cuts to maintain volume; ASP declining', category: 'market' },
          { factor: 'EV Competition Surge', impact: -35, direction: 'up', description: 'BYD, Hyundai, and legacy OEMs gaining EV market share', category: 'market' },
          { factor: 'Revenue Decline', impact: -40, direction: 'down', description: 'FY2025 revenue declined 2.9% — first sustained decline', category: 'financial' },
          { factor: 'FSD/Robotaxi Optionality', impact: 15, direction: 'up', description: 'Autonomous driving could unlock high-margin revenue', category: 'operational' },
        ],
        modelAccuracy: 85,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'revenue_slowdown',
        metricLabel: 'Revenue Slowdown',
        probability: 76,
        confidenceLow: 68,
        confidenceHigh: 84,
        severity: 'critical',
        trend: [70.4, 51.9, 18.8, 0.9, -2.9, -2.9],
        drivers: [
          { factor: 'Demand Saturation', impact: -45, direction: 'down', description: 'Core EV demand plateauing in key markets', category: 'market' },
          { factor: 'Brand Perception Issues', impact: -30, direction: 'down', description: 'Consumer sentiment declining in surveys', category: 'market' },
          { factor: 'Energy Business Growth', impact: 20, direction: 'up', description: 'Energy storage deployments growing 100%+ YoY', category: 'operational' },
          { factor: 'Aging Model Lineup', impact: -25, direction: 'down', description: 'Model 3/Y refresh cycle not driving sufficient demand', category: 'operational' },
        ],
        modelAccuracy: 81,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'cash_flow_deterioration',
        metricLabel: 'Cash Flow Deterioration',
        probability: 35,
        confidenceLow: 26,
        confidenceHigh: 44,
        severity: 'watch',
        trend: [2.08, 1.17, 0.88, 2.10, 3.89, 3.89],
        drivers: [
          { factor: 'CFO Still Strong', impact: 30, direction: 'up', description: 'Operating cash flow of $14.7B despite profit decline', category: 'financial' },
          { factor: 'Capex Commitments', impact: -25, direction: 'up', description: 'Gigafactory expansion and robotaxi fleet investment', category: 'financial' },
        ],
        modelAccuracy: 75,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'risk_factor_escalation',
        metricLabel: 'Risk Factor Escalation',
        probability: 70,
        confidenceLow: 60,
        confidenceHigh: 80,
        severity: 'warning',
        trend: [0, 0, 0, 1, 0, 0],
        drivers: [
          { factor: 'Margin Drop History', impact: -40, direction: 'down', description: 'FY2024 triggered margin_drop flag; trend continuing', category: 'financial' },
          { factor: 'Regulatory Uncertainty', impact: -25, direction: 'up', description: 'Autonomous driving regulations still evolving', category: 'disclosure' },
          { factor: 'Executive Risk', impact: -20, direction: 'flat', description: 'CEO distraction and governance concerns in 10-K', category: 'disclosure' },
        ],
        modelAccuracy: 78,
        lastUpdated: '2026-03-15',
      },
    ],
    historicalAccuracy: 79,
    nextEarningsDate: '2026-07-22',
    watchlistPriority: 1,
    marginForecast: [
      { period: 'FY2021', actual: 10.25, predicted: 8.0, lower: 5.0, upper: 11.0 },
      { period: 'FY2022', actual: 15.41, predicted: 12.5, lower: 9.0, upper: 16.0 },
      { period: 'FY2023', actual: 15.50, predicted: 14.0, lower: 11.0, upper: 17.0 },
      { period: 'FY2024', actual: 7.26, predicted: 13.0, lower: 9.5, upper: 16.5 },
      { period: 'FY2025', actual: 4.00, predicted: 5.5, lower: 2.5, upper: 8.5 },
      { period: 'Q1 2027', actual: null, predicted: 3.2, lower: 0.5, upper: 5.9 },
      { period: 'Q2 2027', actual: null, predicted: 2.8, lower: -0.5, upper: 6.1 },
    ],
    revenueGrowthForecast: [
      { period: 'FY2021', actual: 70.4, predicted: 55.0, lower: 40.0, upper: 70.0 },
      { period: 'FY2022', actual: 51.9, predicted: 45.0, lower: 30.0, upper: 60.0 },
      { period: 'FY2023', actual: 18.8, predicted: 25.0, lower: 15.0, upper: 35.0 },
      { period: 'FY2024', actual: 0.9, predicted: 12.0, lower: 5.0, upper: 19.0 },
      { period: 'FY2025', actual: -2.9, predicted: 2.0, lower: -5.0, upper: 9.0 },
      { period: 'Q1 2027', actual: null, predicted: -1.5, lower: -8.0, upper: 5.0 },
      { period: 'Q2 2027', actual: null, predicted: 1.0, lower: -6.0, upper: 8.0 },
    ],
  },

  // ─── GOOGL ───
  {
    ticker: 'GOOGL',
    companyName: 'Alphabet Inc.',
    overallRiskScore: 22,
    overallSeverity: 'stable',
    predictions: [
      {
        metric: 'margin_decline',
        metricLabel: 'Margin Decline',
        probability: 20,
        confidenceLow: 13,
        confidenceHigh: 27,
        severity: 'stable',
        trend: [29.5, 21.2, 24.0, 28.6, 32.8, 32.8],
        drivers: [
          { factor: 'Search AI Monetization', impact: 35, direction: 'up', description: 'AI Overviews driving higher ad engagement', category: 'operational' },
          { factor: 'Cloud Profitability', impact: 30, direction: 'up', description: 'Google Cloud reached sustained profitability', category: 'operational' },
          { factor: 'AI Compute Costs', impact: -20, direction: 'up', description: 'Serving AI models at scale increasing infrastructure costs', category: 'financial' },
        ],
        modelAccuracy: 83,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'revenue_slowdown',
        metricLabel: 'Revenue Slowdown',
        probability: 25,
        confidenceLow: 18,
        confidenceHigh: 32,
        severity: 'stable',
        trend: [41.1, 9.1, 8.7, 14.3, 15.5, 15.5],
        drivers: [
          { factor: 'Search Dominance', impact: 40, direction: 'flat', description: 'Search remains dominant with 90%+ market share', category: 'market' },
          { factor: 'YouTube Growth', impact: 25, direction: 'up', description: 'YouTube ad revenue and subscriptions growing steadily', category: 'operational' },
          { factor: 'AI Search Disruption', impact: -15, direction: 'up', description: 'ChatGPT and Perplexity capturing some search queries', category: 'market' },
        ],
        modelAccuracy: 80,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'cash_flow_deterioration',
        metricLabel: 'Cash Flow Deterioration',
        probability: 15,
        confidenceLow: 9,
        confidenceHigh: 21,
        severity: 'stable',
        trend: [1.21, 1.53, 1.38, 1.25, 1.25, 1.25],
        drivers: [
          { factor: 'Consistent Cash Machine', impact: 50, direction: 'flat', description: 'CFO/Net Income stable at 1.2-1.5x range', category: 'financial' },
        ],
        modelAccuracy: 87,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'risk_factor_escalation',
        metricLabel: 'Risk Factor Escalation',
        probability: 30,
        confidenceLow: 22,
        confidenceHigh: 38,
        severity: 'watch',
        trend: [0, 1, 0, 0, 0, 0],
        drivers: [
          { factor: 'DOJ Antitrust Case', impact: -35, direction: 'up', description: 'Potential forced divestiture of Chrome or Android', category: 'disclosure' },
          { factor: 'Strong Financial Position', impact: 40, direction: 'flat', description: 'No financial risk flags in recent years', category: 'financial' },
        ],
        modelAccuracy: 82,
        lastUpdated: '2026-03-15',
      },
    ],
    historicalAccuracy: 83,
    nextEarningsDate: '2026-07-22',
    watchlistPriority: 8,
    marginForecast: [
      { period: 'FY2021', actual: 29.51, predicted: 28.0, lower: 26.0, upper: 30.0 },
      { period: 'FY2022', actual: 21.20, predicted: 26.0, lower: 23.0, upper: 29.0 },
      { period: 'FY2023', actual: 24.01, predicted: 22.5, lower: 19.5, upper: 25.5 },
      { period: 'FY2024', actual: 28.60, predicted: 25.5, lower: 22.5, upper: 28.5 },
      { period: 'FY2025', actual: 32.81, predicted: 30.0, lower: 27.0, upper: 33.0 },
      { period: 'Q1 2027', actual: null, predicted: 33.5, lower: 30.0, upper: 37.0 },
      { period: 'Q2 2027', actual: null, predicted: 33.8, lower: 30.0, upper: 37.6 },
    ],
    revenueGrowthForecast: [
      { period: 'FY2021', actual: 41.1, predicted: 38.0, lower: 33.0, upper: 43.0 },
      { period: 'FY2022', actual: 9.1, predicted: 18.0, lower: 12.0, upper: 24.0 },
      { period: 'FY2023', actual: 8.7, predicted: 8.0, lower: 5.0, upper: 11.0 },
      { period: 'FY2024', actual: 14.3, predicted: 11.0, lower: 8.0, upper: 14.0 },
      { period: 'FY2025', actual: 15.5, predicted: 14.0, lower: 11.0, upper: 17.0 },
      { period: 'Q1 2027', actual: null, predicted: 14.5, lower: 11.0, upper: 18.0 },
      { period: 'Q2 2027', actual: null, predicted: 13.8, lower: 10.0, upper: 17.6 },
    ],
  },

  // ─── AVGO ───
  {
    ticker: 'AVGO',
    companyName: 'Broadcom Inc.',
    overallRiskScore: 35,
    overallSeverity: 'watch',
    predictions: [
      {
        metric: 'margin_decline',
        metricLabel: 'Margin Decline',
        probability: 32,
        confidenceLow: 24,
        confidenceHigh: 40,
        severity: 'watch',
        trend: [24.5, 34.6, 39.3, 11.4, 36.2, 36.2],
        drivers: [
          { factor: 'VMware Integration', impact: -25, direction: 'up', description: 'Acquisition integration costs still flowing through P&L', category: 'financial' },
          { factor: 'AI Networking Demand', impact: 35, direction: 'up', description: 'Custom AI accelerator and networking chip revenue surging', category: 'market' },
          { factor: 'Software Margin Uplift', impact: 30, direction: 'up', description: 'VMware subscription transition improving recurring revenue', category: 'operational' },
        ],
        modelAccuracy: 78,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'revenue_slowdown',
        metricLabel: 'Revenue Slowdown',
        probability: 28,
        confidenceLow: 20,
        confidenceHigh: 36,
        severity: 'stable',
        trend: [14.9, 20.9, 7.7, 44.1, 23.9, 23.9],
        drivers: [
          { factor: 'AI ASIC Growth', impact: 40, direction: 'up', description: 'Custom AI chip revenue from hyperscalers growing rapidly', category: 'market' },
          { factor: 'Broadband Cyclicality', impact: -15, direction: 'down', description: 'Traditional broadband chip demand softening', category: 'market' },
        ],
        modelAccuracy: 76,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'cash_flow_deterioration',
        metricLabel: 'Cash Flow Deterioration',
        probability: 25,
        confidenceLow: 18,
        confidenceHigh: 32,
        severity: 'stable',
        trend: [2.04, 1.46, 1.28, 3.39, 1.19, 1.19],
        drivers: [
          { factor: 'Debt Servicing', impact: -20, direction: 'up', description: 'VMware acquisition debt requiring significant interest payments', category: 'financial' },
          { factor: 'Strong FCF Generation', impact: 35, direction: 'up', description: 'Core business generating robust free cash flow', category: 'financial' },
        ],
        modelAccuracy: 80,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'risk_factor_escalation',
        metricLabel: 'Risk Factor Escalation',
        probability: 30,
        confidenceLow: 22,
        confidenceHigh: 38,
        severity: 'watch',
        trend: [0, 0, 0, 1, 0, 0],
        drivers: [
          { factor: 'Acquisition Integration Risk', impact: -25, direction: 'flat', description: 'VMware integration execution risk remains', category: 'disclosure' },
          { factor: 'Customer Concentration', impact: -20, direction: 'up', description: 'Top 5 customers represent significant revenue share', category: 'market' },
        ],
        modelAccuracy: 79,
        lastUpdated: '2026-03-15',
      },
    ],
    historicalAccuracy: 78,
    nextEarningsDate: '2026-06-12',
    watchlistPriority: 5,
    marginForecast: [
      { period: 'FY2021', actual: 24.54, predicted: 22.0, lower: 18.0, upper: 26.0 },
      { period: 'FY2022', actual: 34.62, predicted: 28.0, lower: 23.0, upper: 33.0 },
      { period: 'FY2023', actual: 39.31, predicted: 36.0, lower: 31.0, upper: 41.0 },
      { period: 'FY2024', actual: 11.43, predicted: 35.0, lower: 28.0, upper: 42.0 },
      { period: 'FY2025', actual: 36.20, predicted: 20.0, lower: 14.0, upper: 26.0 },
      { period: 'Q1 2027', actual: null, predicted: 37.5, lower: 32.0, upper: 43.0 },
      { period: 'Q2 2027', actual: null, predicted: 38.2, lower: 32.5, upper: 43.9 },
    ],
    revenueGrowthForecast: [
      { period: 'FY2021', actual: 14.9, predicted: 13.0, lower: 9.0, upper: 17.0 },
      { period: 'FY2022', actual: 20.9, predicted: 18.0, lower: 13.0, upper: 23.0 },
      { period: 'FY2023', actual: 7.7, predicted: 12.0, lower: 7.0, upper: 17.0 },
      { period: 'FY2024', actual: 44.1, predicted: 15.0, lower: 8.0, upper: 22.0 },
      { period: 'FY2025', actual: 23.9, predicted: 30.0, lower: 22.0, upper: 38.0 },
      { period: 'Q1 2027', actual: null, predicted: 18.0, lower: 12.0, upper: 24.0 },
      { period: 'Q2 2027', actual: null, predicted: 16.5, lower: 10.0, upper: 23.0 },
    ],
  },

  // ─── COST ───
  {
    ticker: 'COST',
    companyName: 'Costco Wholesale Corporation',
    overallRiskScore: 12,
    overallSeverity: 'stable',
    predictions: [
      {
        metric: 'margin_decline',
        metricLabel: 'Margin Decline',
        probability: 10,
        confidenceLow: 5,
        confidenceHigh: 15,
        severity: 'stable',
        trend: [2.56, 2.57, 2.60, 2.90, 2.94, 2.94],
        drivers: [
          { factor: 'Membership Model Stability', impact: 50, direction: 'flat', description: 'Membership fee increases provide margin buffer', category: 'operational' },
          { factor: 'Scale Advantages', impact: 35, direction: 'up', description: 'Purchasing power improving with store count growth', category: 'operational' },
        ],
        modelAccuracy: 91,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'revenue_slowdown',
        metricLabel: 'Revenue Slowdown',
        probability: 18,
        confidenceLow: 12,
        confidenceHigh: 24,
        severity: 'stable',
        trend: [17.5, 13.2, 6.6, 4.9, 7.7, 7.7],
        drivers: [
          { factor: 'Consumer Staples Resilience', impact: 40, direction: 'flat', description: 'Essential goods demand relatively recession-proof', category: 'market' },
          { factor: 'E-commerce Growth', impact: 20, direction: 'up', description: 'Online sales growing faster than in-store', category: 'operational' },
        ],
        modelAccuracy: 85,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'cash_flow_deterioration',
        metricLabel: 'Cash Flow Deterioration',
        probability: 8,
        confidenceLow: 4,
        confidenceHigh: 12,
        severity: 'stable',
        trend: [1.79, 1.26, 1.76, 1.54, 1.65, 1.65],
        drivers: [
          { factor: 'Predictable Cash Flows', impact: 50, direction: 'flat', description: 'Membership model ensures steady cash generation', category: 'financial' },
        ],
        modelAccuracy: 92,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'risk_factor_escalation',
        metricLabel: 'Risk Factor Escalation',
        probability: 5,
        confidenceLow: 2,
        confidenceHigh: 8,
        severity: 'stable',
        trend: [0, 0, 0, 0, 0, 0],
        drivers: [
          { factor: 'Pristine Track Record', impact: 50, direction: 'flat', description: 'Zero risk flags in entire analysis period', category: 'financial' },
        ],
        modelAccuracy: 95,
        lastUpdated: '2026-03-15',
      },
    ],
    historicalAccuracy: 90,
    nextEarningsDate: '2026-09-25',
    watchlistPriority: 10,
    marginForecast: [
      { period: 'FY2021', actual: 2.56, predicted: 2.50, lower: 2.35, upper: 2.65 },
      { period: 'FY2022', actual: 2.57, predicted: 2.55, lower: 2.40, upper: 2.70 },
      { period: 'FY2023', actual: 2.60, predicted: 2.58, lower: 2.43, upper: 2.73 },
      { period: 'FY2024', actual: 2.90, predicted: 2.62, lower: 2.47, upper: 2.77 },
      { period: 'FY2025', actual: 2.94, predicted: 2.85, lower: 2.70, upper: 3.00 },
      { period: 'Q1 2027', actual: null, predicted: 2.98, lower: 2.80, upper: 3.16 },
      { period: 'Q2 2027', actual: null, predicted: 3.02, lower: 2.82, upper: 3.22 },
    ],
    revenueGrowthForecast: [
      { period: 'FY2021', actual: 17.5, predicted: 15.0, lower: 12.0, upper: 18.0 },
      { period: 'FY2022', actual: 13.2, predicted: 12.0, lower: 9.0, upper: 15.0 },
      { period: 'FY2023', actual: 6.6, predicted: 8.0, lower: 5.0, upper: 11.0 },
      { period: 'FY2024', actual: 4.9, predicted: 6.0, lower: 3.5, upper: 8.5 },
      { period: 'FY2025', actual: 7.7, predicted: 6.5, lower: 4.0, upper: 9.0 },
      { period: 'Q1 2027', actual: null, predicted: 7.5, lower: 5.0, upper: 10.0 },
      { period: 'Q2 2027', actual: null, predicted: 7.2, lower: 4.5, upper: 9.9 },
    ],
  },

  // ─── NFLX ───
  {
    ticker: 'NFLX',
    companyName: 'Netflix, Inc.',
    overallRiskScore: 25,
    overallSeverity: 'stable',
    predictions: [
      {
        metric: 'margin_decline',
        metricLabel: 'Margin Decline',
        probability: 18,
        confidenceLow: 12,
        confidenceHigh: 24,
        severity: 'stable',
        trend: [17.2, 14.2, 16.0, 22.3, 22.3, 22.3],
        drivers: [
          { factor: 'Ad Tier Revenue', impact: 35, direction: 'up', description: 'Advertising tier growing rapidly with high margins', category: 'operational' },
          { factor: 'Content Cost Leverage', impact: 25, direction: 'up', description: 'Revenue growing faster than content spend', category: 'financial' },
          { factor: 'Password Sharing Crackdown', impact: 20, direction: 'up', description: 'Paid sharing driving subscriber additions', category: 'operational' },
        ],
        modelAccuracy: 82,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'revenue_slowdown',
        metricLabel: 'Revenue Slowdown',
        probability: 30,
        confidenceLow: 22,
        confidenceHigh: 38,
        severity: 'watch',
        trend: [18.8, 6.4, 6.6, 15.7, 15.7, 15.7],
        drivers: [
          { factor: 'Subscriber Saturation', impact: -25, direction: 'down', description: 'Penetration in developed markets approaching ceiling', category: 'market' },
          { factor: 'ARPU Growth', impact: 25, direction: 'up', description: 'Price increases and ad tier mix improving ARPU', category: 'operational' },
          { factor: 'Live Events/Sports', impact: 20, direction: 'up', description: 'Live content (NFL, WWE) attracting new demographics', category: 'operational' },
        ],
        modelAccuracy: 79,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'cash_flow_deterioration',
        metricLabel: 'Cash Flow Deterioration',
        probability: 22,
        confidenceLow: 15,
        confidenceHigh: 29,
        severity: 'stable',
        trend: [0.08, 0.45, 1.35, 0.84, 0.84, 0.84],
        drivers: [
          { factor: 'Content Amortization', impact: -20, direction: 'flat', description: 'Large content library amortization creates cash flow timing differences', category: 'financial' },
          { factor: 'Improving FCF', impact: 30, direction: 'up', description: 'Free cash flow margin expanding as content spend stabilizes', category: 'financial' },
        ],
        modelAccuracy: 77,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'risk_factor_escalation',
        metricLabel: 'Risk Factor Escalation',
        probability: 15,
        confidenceLow: 9,
        confidenceHigh: 21,
        severity: 'stable',
        trend: [0, 0, 0, 0, 0, 0],
        drivers: [
          { factor: 'Clean Risk Profile', impact: 45, direction: 'flat', description: 'No risk flags triggered historically', category: 'financial' },
          { factor: 'Content Competition', impact: -15, direction: 'up', description: 'Disney+, Apple TV+ competing for content and subscribers', category: 'market' },
        ],
        modelAccuracy: 86,
        lastUpdated: '2026-03-15',
      },
    ],
    historicalAccuracy: 81,
    nextEarningsDate: '2026-07-17',
    watchlistPriority: 8,
    marginForecast: [
      { period: 'FY2021', actual: 17.23, predicted: 16.0, lower: 13.5, upper: 18.5 },
      { period: 'FY2022', actual: 14.21, predicted: 16.5, lower: 13.5, upper: 19.5 },
      { period: 'FY2023', actual: 16.04, predicted: 15.0, lower: 12.0, upper: 18.0 },
      { period: 'FY2024', actual: 22.33, predicted: 18.0, lower: 15.0, upper: 21.0 },
      { period: 'Q1 2027', actual: null, predicted: 24.0, lower: 20.5, upper: 27.5 },
      { period: 'Q2 2027', actual: null, predicted: 24.5, lower: 20.8, upper: 28.2 },
    ],
    revenueGrowthForecast: [
      { period: 'FY2021', actual: 18.8, predicted: 17.0, lower: 13.5, upper: 20.5 },
      { period: 'FY2022', actual: 6.4, predicted: 12.0, lower: 8.0, upper: 16.0 },
      { period: 'FY2023', actual: 6.6, predicted: 7.0, lower: 4.0, upper: 10.0 },
      { period: 'FY2024', actual: 15.7, predicted: 10.0, lower: 7.0, upper: 13.0 },
      { period: 'Q1 2027', actual: null, predicted: 14.0, lower: 10.0, upper: 18.0 },
      { period: 'Q2 2027', actual: null, predicted: 13.0, lower: 9.0, upper: 17.0 },
    ],
  },

  // ─── PEP ───
  {
    ticker: 'PEP',
    companyName: 'PepsiCo, Inc.',
    overallRiskScore: 40,
    overallSeverity: 'watch',
    predictions: [
      {
        metric: 'margin_decline',
        metricLabel: 'Margin Decline',
        probability: 52,
        confidenceLow: 42,
        confidenceHigh: 62,
        severity: 'warning',
        trend: [9.6, 10.3, 9.9, 10.4, 8.8, 8.8],
        drivers: [
          { factor: 'Input Cost Inflation', impact: -35, direction: 'up', description: 'Commodity and packaging costs rising faster than pricing power', category: 'market' },
          { factor: 'Volume Decline', impact: -30, direction: 'down', description: 'Organic volume declining as consumers trade down', category: 'market' },
          { factor: 'GLP-1 Impact on Snacks', impact: -20, direction: 'down', description: 'Weight-loss drug adoption reducing snack consumption', category: 'market' },
          { factor: 'Pricing Power Limits', impact: -15, direction: 'down', description: 'Consumer pushback on further price increases', category: 'operational' },
        ],
        modelAccuracy: 80,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'revenue_slowdown',
        metricLabel: 'Revenue Slowdown',
        probability: 58,
        confidenceLow: 48,
        confidenceHigh: 68,
        severity: 'warning',
        trend: [12.9, 8.1, 5.9, 0.4, 2.2, 2.2],
        drivers: [
          { factor: 'Organic Growth Stalling', impact: -40, direction: 'down', description: 'Revenue growth decelerated from 12.9% to 2.2% over 4 years', category: 'financial' },
          { factor: 'International Headwinds', impact: -25, direction: 'down', description: 'FX headwinds and geopolitical disruptions in key markets', category: 'market' },
          { factor: 'Health-Conscious Shift', impact: -20, direction: 'down', description: 'Consumer preferences shifting away from sugary beverages', category: 'market' },
        ],
        modelAccuracy: 82,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'cash_flow_deterioration',
        metricLabel: 'Cash Flow Deterioration',
        probability: 22,
        confidenceLow: 15,
        confidenceHigh: 29,
        severity: 'stable',
        trend: [1.52, 1.21, 1.48, 1.31, 1.47, 1.47],
        drivers: [
          { factor: 'Stable Cash Generation', impact: 35, direction: 'flat', description: 'CFO/Net Income consistently above 1.2x', category: 'financial' },
          { factor: 'Working Capital Efficiency', impact: 20, direction: 'flat', description: 'Inventory and AR management remains disciplined', category: 'operational' },
        ],
        modelAccuracy: 84,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'risk_factor_escalation',
        metricLabel: 'Risk Factor Escalation',
        probability: 35,
        confidenceLow: 26,
        confidenceHigh: 44,
        severity: 'watch',
        trend: [0, 0, 0, 0, 0, 0],
        drivers: [
          { factor: 'Margin Pressure Building', impact: -25, direction: 'down', description: 'Net margin declining from 10.4% to 8.8% — approaching flag threshold', category: 'financial' },
          { factor: 'Defensive Business Model', impact: 30, direction: 'flat', description: 'Consumer staples provide recession resilience', category: 'operational' },
        ],
        modelAccuracy: 83,
        lastUpdated: '2026-03-15',
      },
    ],
    historicalAccuracy: 82,
    nextEarningsDate: '2026-07-10',
    watchlistPriority: 3,
    marginForecast: [
      { period: 'FY2021', actual: 9.59, predicted: 9.8, lower: 8.8, upper: 10.8 },
      { period: 'FY2022', actual: 10.31, predicted: 9.5, lower: 8.5, upper: 10.5 },
      { period: 'FY2023', actual: 9.92, predicted: 10.2, lower: 9.2, upper: 11.2 },
      { period: 'FY2024', actual: 10.43, predicted: 9.8, lower: 8.8, upper: 10.8 },
      { period: 'FY2025', actual: 8.77, predicted: 10.0, lower: 9.0, upper: 11.0 },
      { period: 'Q1 2027', actual: null, predicted: 8.2, lower: 7.0, upper: 9.4 },
      { period: 'Q2 2027', actual: null, predicted: 7.8, lower: 6.5, upper: 9.1 },
    ],
    revenueGrowthForecast: [
      { period: 'FY2021', actual: 12.9, predicted: 11.0, lower: 8.5, upper: 13.5 },
      { period: 'FY2022', actual: 8.1, predicted: 8.5, lower: 6.0, upper: 11.0 },
      { period: 'FY2023', actual: 5.9, predicted: 6.0, lower: 3.5, upper: 8.5 },
      { period: 'FY2024', actual: 0.4, predicted: 4.0, lower: 1.5, upper: 6.5 },
      { period: 'FY2025', actual: 2.2, predicted: 2.0, lower: -0.5, upper: 4.5 },
      { period: 'Q1 2027', actual: null, predicted: 2.5, lower: 0.0, upper: 5.0 },
      { period: 'Q2 2027', actual: null, predicted: 2.8, lower: 0.2, upper: 5.4 },
    ],
  },
  // ─── GS ───
  {
    ticker: 'GS',
    companyName: 'Goldman Sachs Group, Inc.',
    overallRiskScore: 38,
    overallSeverity: 'watch',
    predictions: [
      {
        metric: 'margin_decline',
        metricLabel: 'Margin Decline',
        probability: 35,
        confidenceLow: 27,
        confidenceHigh: 43,
        severity: 'watch',
        trend: [36.5, 23.8, 18.4, 25.3, 25.5, 25.5],
        drivers: [
          { factor: 'Trading Revenue Volatility', impact: -30, direction: 'down', description: 'FICC and equities trading revenue highly cyclical', category: 'financial' },
          { factor: 'Asset & Wealth Management Growth', impact: 25, direction: 'up', description: 'AWM segment providing more stable recurring revenue', category: 'operational' },
          { factor: 'Consumer Banking Exit', impact: 15, direction: 'up', description: 'Marcus platform wind-down removing drag on margins', category: 'operational' },
          { factor: 'Compensation Ratio Pressure', impact: -20, direction: 'up', description: 'Talent competition keeping comp ratio elevated at ~33%', category: 'financial' },
        ],
        modelAccuracy: 76,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'revenue_slowdown',
        metricLabel: 'Revenue Slowdown',
        probability: 40,
        confidenceLow: 32,
        confidenceHigh: 48,
        severity: 'watch',
        trend: [33.2, -20.2, -2.3, 15.7, 9.2, 9.2],
        drivers: [
          { factor: 'IPO Market Recovery', impact: 25, direction: 'up', description: 'Investment banking pipeline strengthening as IPO market reopens', category: 'market' },
          { factor: 'Interest Rate Sensitivity', impact: -20, direction: 'down', description: 'Net interest income may decline as rates normalize', category: 'financial' },
          { factor: 'M&A Advisory Strength', impact: 20, direction: 'up', description: 'Strategic advisory mandates increasing globally', category: 'operational' },
        ],
        modelAccuracy: 74,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'cash_flow_deterioration',
        metricLabel: 'Cash Flow Deterioration',
        probability: 45,
        confidenceLow: 36,
        confidenceHigh: 54,
        severity: 'watch',
        trend: [0.20, -2.38, -1.33, 3.74, 1.05, 1.11],
        drivers: [
          { factor: 'Balance Sheet Driven CFO', impact: -35, direction: 'flat', description: 'Banking CFO heavily influenced by trading inventory and client balances', category: 'financial' },
          { factor: 'Improving Earnings Quality', impact: 20, direction: 'up', description: 'Shift toward fee-based revenue improving cash predictability', category: 'operational' },
        ],
        modelAccuracy: 70,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'risk_factor_escalation',
        metricLabel: 'Risk Factor Escalation',
        probability: 32,
        confidenceLow: 24,
        confidenceHigh: 40,
        severity: 'watch',
        trend: [0, 1, 1, 1, 0, 0],
        drivers: [
          { factor: 'Regulatory Capital Requirements', impact: -25, direction: 'up', description: 'Basel III endgame may increase capital requirements', category: 'disclosure' },
          { factor: 'Litigation Risk', impact: -15, direction: 'flat', description: 'Ongoing regulatory investigations and settlements', category: 'disclosure' },
          { factor: 'Strong Capital Position', impact: 30, direction: 'flat', description: 'CET1 ratio well above regulatory minimums', category: 'financial' },
        ],
        modelAccuracy: 78,
        lastUpdated: '2026-03-15',
      },
    ],
    historicalAccuracy: 75,
    nextEarningsDate: '2026-07-15',
    watchlistPriority: 4,
    marginForecast: [
      { period: 'FY2021', actual: 36.46, predicted: 32.0, lower: 27.0, upper: 37.0 },
      { period: 'FY2022', actual: 23.78, predicted: 30.0, lower: 24.0, upper: 36.0 },
      { period: 'FY2023', actual: 18.41, predicted: 22.0, lower: 16.0, upper: 28.0 },
      { period: 'FY2024', actual: 25.28, predicted: 20.0, lower: 15.0, upper: 25.0 },
      { period: 'FY2025', actual: 25.47, predicted: 24.5, lower: 19.5, upper: 29.5 },
      { period: 'Q1 2027', actual: null, predicted: 24.0, lower: 18.5, upper: 29.5 },
      { period: 'Q2 2027', actual: null, predicted: 23.5, lower: 17.5, upper: 29.5 },
    ],
    revenueGrowthForecast: [
      { period: 'FY2021', actual: 33.2, predicted: 28.0, lower: 20.0, upper: 36.0 },
      { period: 'FY2022', actual: -20.2, predicted: -5.0, lower: -15.0, upper: 5.0 },
      { period: 'FY2023', actual: -2.3, predicted: -8.0, lower: -15.0, upper: -1.0 },
      { period: 'FY2024', actual: 15.7, predicted: 8.0, lower: 2.0, upper: 14.0 },
      { period: 'FY2025', actual: 9.2, predicted: 10.0, lower: 5.0, upper: 15.0 },
      { period: 'Q1 2027', actual: null, predicted: 7.5, lower: 2.0, upper: 13.0 },
      { period: 'Q2 2027', actual: null, predicted: 6.8, lower: 1.0, upper: 12.6 },
    ],
  },

  // ─── MS ───
  {
    ticker: 'MS',
    companyName: 'Morgan Stanley',
    overallRiskScore: 30,
    overallSeverity: 'watch',
    predictions: [
      {
        metric: 'margin_decline',
        metricLabel: 'Margin Decline',
        probability: 28,
        confidenceLow: 20,
        confidenceHigh: 36,
        severity: 'stable',
        trend: [25.2, 20.6, 16.8, 21.7, 21.4, 21.4],
        drivers: [
          { factor: 'Wealth Management Stability', impact: 35, direction: 'up', description: 'Wealth management provides ~50% of revenue with stable margins', category: 'operational' },
          { factor: 'E*TRADE Integration Benefits', impact: 20, direction: 'up', description: 'Self-directed channel driving lower-cost client acquisition', category: 'operational' },
          { factor: 'Investment Banking Cyclicality', impact: -25, direction: 'down', description: 'IB fees remain below 2021 peak levels', category: 'financial' },
          { factor: 'Net Interest Income Risk', impact: -15, direction: 'down', description: 'Rate cuts may compress NII in wealth management', category: 'market' },
        ],
        modelAccuracy: 79,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'revenue_slowdown',
        metricLabel: 'Revenue Slowdown',
        probability: 32,
        confidenceLow: 24,
        confidenceHigh: 40,
        severity: 'watch',
        trend: [24.0, -10.2, 0.9, 14.1, 7.7, 7.7],
        drivers: [
          { factor: 'AUM Growth Momentum', impact: 30, direction: 'up', description: 'Client assets approaching $7T with strong net new asset flows', category: 'operational' },
          { factor: 'Market Dependent Revenue', impact: -20, direction: 'flat', description: '~60% of revenue tied to market levels and activity', category: 'market' },
          { factor: 'International Expansion', impact: 15, direction: 'up', description: 'Asia and EMEA wealth management growing faster than US', category: 'market' },
        ],
        modelAccuracy: 77,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'cash_flow_deterioration',
        metricLabel: 'Cash Flow Deterioration',
        probability: 40,
        confidenceLow: 31,
        confidenceHigh: 49,
        severity: 'watch',
        trend: [0.37, -1.65, -0.83, 2.32, 1.18, 1.21],
        drivers: [
          { factor: 'Banking CFO Volatility', impact: -30, direction: 'flat', description: 'Operating cash flow swings driven by trading and lending activity', category: 'financial' },
          { factor: 'Wealth Management Cash Stability', impact: 25, direction: 'up', description: 'Fee-based advisory revenue provides predictable cash flows', category: 'operational' },
        ],
        modelAccuracy: 72,
        lastUpdated: '2026-03-15',
      },
      {
        metric: 'risk_factor_escalation',
        metricLabel: 'Risk Factor Escalation',
        probability: 25,
        confidenceLow: 18,
        confidenceHigh: 32,
        severity: 'stable',
        trend: [0, 1, 1, 0, 0, 0],
        drivers: [
          { factor: 'Diversified Business Model', impact: 30, direction: 'flat', description: 'Wealth management reduces reliance on volatile trading revenue', category: 'operational' },
          { factor: 'Regulatory Compliance Costs', impact: -15, direction: 'up', description: 'Increasing compliance burden from global regulatory changes', category: 'disclosure' },
          { factor: 'Strong Capital Ratios', impact: 25, direction: 'flat', description: 'CET1 ratio comfortably above requirements with buffer', category: 'financial' },
        ],
        modelAccuracy: 80,
        lastUpdated: '2026-03-15',
      },
    ],
    historicalAccuracy: 78,
    nextEarningsDate: '2026-07-16',
    watchlistPriority: 5,
    marginForecast: [
      { period: 'FY2021', actual: 25.17, predicted: 22.0, lower: 18.0, upper: 26.0 },
      { period: 'FY2022', actual: 20.55, predicted: 22.0, lower: 17.0, upper: 27.0 },
      { period: 'FY2023', actual: 16.78, predicted: 19.0, lower: 14.0, upper: 24.0 },
      { period: 'FY2024', actual: 21.69, predicted: 18.5, lower: 14.0, upper: 23.0 },
      { period: 'FY2025', actual: 21.35, predicted: 21.0, lower: 16.5, upper: 25.5 },
      { period: 'Q1 2027', actual: null, predicted: 21.5, lower: 16.5, upper: 26.5 },
      { period: 'Q2 2027', actual: null, predicted: 21.0, lower: 16.0, upper: 26.0 },
    ],
    revenueGrowthForecast: [
      { period: 'FY2021', actual: 24.0, predicted: 20.0, lower: 14.0, upper: 26.0 },
      { period: 'FY2022', actual: -10.2, predicted: -2.0, lower: -10.0, upper: 6.0 },
      { period: 'FY2023', actual: 0.9, predicted: -4.0, lower: -10.0, upper: 2.0 },
      { period: 'FY2024', actual: 14.1, predicted: 6.0, lower: 1.0, upper: 11.0 },
      { period: 'FY2025', actual: 7.7, predicted: 8.5, lower: 4.0, upper: 13.0 },
      { period: 'Q1 2027', actual: null, predicted: 6.5, lower: 2.0, upper: 11.0 },
      { period: 'Q2 2027', actual: null, predicted: 6.0, lower: 1.5, upper: 10.5 },
    ],
  },
];

export function getCompanyForecast(ticker: string): CompanyForecast | undefined {
  return forecastDatabase.find(c => c.ticker === ticker);
}

export function getAllForecasts(): CompanyForecast[] {
  return forecastDatabase;
}

export function getHighRiskCompanies(): CompanyForecast[] {
  return forecastDatabase
    .filter(c => c.overallSeverity === 'critical' || c.overallSeverity === 'warning')
    .sort((a, b) => b.overallRiskScore - a.overallRiskScore);
}

export function getTopAlerts(): { ticker: string; companyName: string; prediction: ForecastPrediction }[] {
  const alerts: { ticker: string; companyName: string; prediction: ForecastPrediction }[] = [];
  for (const company of forecastDatabase) {
    for (const pred of company.predictions) {
      if (pred.severity === 'critical' || pred.severity === 'warning') {
        alerts.push({ ticker: company.ticker, companyName: company.companyName, prediction: pred });
      }
    }
  }
  return alerts.sort((a, b) => b.prediction.probability - a.prediction.probability);
}
