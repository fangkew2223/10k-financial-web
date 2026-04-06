import React, { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { NasdaqCompany } from "../data/nasdaqCompanies";
import { getCompanyFinancials, AnnualMetrics } from "../data/financialData";
import "./CompanyDetail.css";

interface Props {
  company: NasdaqCompany;
  onBack: () => void;
}

type ChartTab = "revenue" | "profitability" | "cashflow" | "efficiency" | "riskflags";

const fmt = (n: number | null | undefined, decimals = 1): string => {
  if (n == null) return "N/A";
  const abs = Math.abs(n);
  if (abs >= 1e12) return `$${(n / 1e12).toFixed(decimals)}T`;
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(decimals)}B`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(decimals)}M`;
  return `$${n.toFixed(0)}`;
};

const pct = (n: number | null | undefined): string =>
  n == null ? "N/A" : `${(n * 100).toFixed(1)}%`;

const num = (n: number | null | undefined, d = 2): string =>
  n == null ? "N/A" : n.toFixed(d);

const riskLabel = (score: number) => {
  if (score === 0) return { label: "Low", color: "#22c55e" };
  if (score === 1) return { label: "Medium", color: "#f59e0b" };
  return { label: "High", color: "#ef4444" };
};

const CHART_COLORS = {
  revenue: "#4f8ef7",
  net_income: "#22c55e",
  cfo: "#a78bfa",
  assets: "#f59e0b",
  margin: "#06b6d4",
  dso: "#f97316",
  dio: "#ec4899",
  accrual: "#8b5cf6",
  asset_turnover: "#14b8a6",
};

const CompanyDetail: React.FC<Props> = ({ company, onBack }) => {
  const [activeTab, setActiveTab] = useState<ChartTab>("revenue");
  const financials = getCompanyFinancials(company.ticker);

  if (!financials) {
    return (
      <div className="detail-page">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <p style={{ padding: "2rem", color: "#666" }}>No financial data available for {company.ticker}.</p>
      </div>
    );
  }

  const data = financials.metrics;

  // Prepare chart data (values in billions for readability)
  const revenueData = data.map((d) => ({
    fy: d.fy,
    Revenue: +(d.revenue / 1e9).toFixed(2),
    "Net Income": +(d.net_income / 1e9).toFixed(2),
    CFO: +(d.cfo / 1e9).toFixed(2),
  }));

  const profitData = data.map((d) => ({
    fy: d.fy,
    "Net Margin %": d.net_profit_margin != null ? +(d.net_profit_margin * 100).toFixed(2) : null,
    "Asset Turnover": d.asset_turnover != null ? +d.asset_turnover.toFixed(3) : null,
  }));

  const cashData = data.map((d) => ({
    fy: d.fy,
    CFO: +(d.cfo / 1e9).toFixed(2),
    "Net Income": +(d.net_income / 1e9).toFixed(2),
    "Accrual Ratio": d.accrual_ratio != null ? +(d.accrual_ratio * 100).toFixed(2) : null,
  }));

  const efficiencyData = data
    .filter((d) => d.dso_days != null || d.dio_days != null)
    .map((d) => ({
      fy: d.fy,
      "DSO (days)": d.dso_days != null ? +d.dso_days.toFixed(1) : null,
      "DIO (days)": d.dio_days != null ? +d.dio_days.toFixed(1) : null,
    }));

  const riskData = data.map((d) => ({
    fy: d.fy,
    "Risk Score": d.risk_score,
    "Accrual Flag": d.flag_accrual,
    "Cash Conv. Flag": d.flag_cash_conversion,
    "AR Gap Flag": d.flag_ar_gap,
    "Inv. Gap Flag": d.flag_inventory_gap,
    "AT Drop Flag": d.flag_asset_turnover_drop,
    "Margin Drop Flag": d.flag_margin_drop,
  }));

  const latest = data[data.length - 1];
  const risk = riskLabel(latest.risk_score);

  const tabs: { key: ChartTab; label: string }[] = [
    { key: "revenue", label: "📊 Revenue & Income" },
    { key: "profitability", label: "📈 Profitability" },
    { key: "cashflow", label: "💵 Cash Flow" },
    { key: "efficiency", label: "⏱ Efficiency" },
    { key: "riskflags", label: "🚩 Risk Flags" },
  ];

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>← Back to List</button>
        <div className="detail-title-row">
          <div>
            <span className="detail-ticker">{company.ticker}</span>
            <h2 className="detail-name">{company.name}</h2>
            <p className="detail-sector">{company.sector} · Market Cap: {company.marketCap}</p>
          </div>
          <div className="detail-risk-badge" style={{ borderColor: risk.color, color: risk.color }}>
            <span className="risk-label">Risk</span>
            <span className="risk-value" style={{ color: risk.color }}>{risk.label}</span>
            <span className="risk-score">Score: {latest.risk_score}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Latest Revenue</div>
          <div className="kpi-value">{fmt(latest.revenue)}</div>
          <div className="kpi-sub">FY{latest.fy}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Net Income</div>
          <div className="kpi-value" style={{ color: latest.net_income < 0 ? "#ef4444" : undefined }}>{fmt(latest.net_income)}</div>
          <div className="kpi-sub">FY{latest.fy}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Operating Cash Flow</div>
          <div className="kpi-value">{fmt(latest.cfo)}</div>
          <div className="kpi-sub">FY{latest.fy}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Net Profit Margin</div>
          <div className="kpi-value">{pct(latest.net_profit_margin)}</div>
          <div className="kpi-sub">FY{latest.fy}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Assets</div>
          <div className="kpi-value">{fmt(latest.assets)}</div>
          <div className="kpi-sub">FY{latest.fy}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Asset Turnover</div>
          <div className="kpi-value">{num(latest.asset_turnover)}x</div>
          <div className="kpi-sub">FY{latest.fy}</div>
        </div>
      </div>

      {/* Chart Tabs */}
      <div className="chart-section">
        <div className="chart-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`chart-tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="chart-container">
          {activeTab === "revenue" && (
            <>
              <h3 className="chart-title">Revenue, Net Income & Operating Cash Flow (USD Billions)</h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="fy" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}B`} />
                  <Tooltip formatter={(v: any) => [`$${v}B`, ""]} />
                  <Legend />
                  <Line type="monotone" dataKey="Revenue" stroke={CHART_COLORS.revenue} strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Net Income" stroke={CHART_COLORS.net_income} strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="CFO" stroke={CHART_COLORS.cfo} strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}

          {activeTab === "profitability" && (
            <>
              <h3 className="chart-title">Net Profit Margin (%) & Asset Turnover</h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={profitData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="fy" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}x`} />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine yAxisId="left" y={0} stroke="#ef4444" strokeDasharray="4 4" />
                  <Line yAxisId="left" type="monotone" dataKey="Net Margin %" stroke={CHART_COLORS.margin} strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
                  <Line yAxisId="right" type="monotone" dataKey="Asset Turnover" stroke={CHART_COLORS.asset_turnover} strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}

          {activeTab === "cashflow" && (
            <>
              <h3 className="chart-title">CFO vs Net Income (USD Billions) & Accrual Ratio (%)</h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={cashData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="fy" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}B`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine yAxisId="left" y={0} stroke="#ef4444" strokeDasharray="4 4" />
                  <Line yAxisId="left" type="monotone" dataKey="CFO" stroke={CHART_COLORS.cfo} strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line yAxisId="left" type="monotone" dataKey="Net Income" stroke={CHART_COLORS.net_income} strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="Accrual Ratio" stroke={CHART_COLORS.accrual} strokeWidth={2} dot={{ r: 3 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}

          {activeTab === "efficiency" && (
            <>
              <h3 className="chart-title">Days Sales Outstanding (DSO) & Days Inventory Outstanding (DIO)</h3>
              {efficiencyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={efficiencyData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="fy" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}d`} />
                    <Tooltip formatter={(v: any) => [`${v} days`, ""]} />
                    <Legend />
                    <Bar dataKey="DSO (days)" fill={CHART_COLORS.dso} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="DIO (days)" fill={CHART_COLORS.dio} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="no-data">No DSO/DIO data available for this company.</p>
              )}
            </>
          )}

          {activeTab === "riskflags" && (
            <>
              <h3 className="chart-title">Annual Risk Score & Flag Breakdown</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={riskData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="fy" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Risk Score" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Accrual Flag" stackId="flags" fill="#f97316" />
                  <Bar dataKey="Cash Conv. Flag" stackId="flags" fill="#eab308" />
                  <Bar dataKey="AR Gap Flag" stackId="flags" fill="#22c55e" />
                  <Bar dataKey="Inv. Gap Flag" stackId="flags" fill="#06b6d4" />
                  <Bar dataKey="AT Drop Flag" stackId="flags" fill="#8b5cf6" />
                  <Bar dataKey="Margin Drop Flag" stackId="flags" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>

      {/* How Risk is Calculated */}
      <div className="risk-explainer">
        <div className="risk-explainer-header">
          <span className="risk-explainer-icon">🧮</span>
          <div>
            <h3 className="risk-explainer-title">How Risk Score is Calculated</h3>
            <p className="risk-explainer-subtitle">The risk score is a composite of 6 independent financial flags derived from SEC 10-K filings. Each flag adds 1 point to the score.</p>
          </div>
        </div>
        <div className="risk-flags-grid">
          <div className="risk-flag-item">
            <div className="risk-flag-header">
              <span className="risk-flag-icon" style={{ background: "#f9731622" }}>📋</span>
              <span className="risk-flag-name">Accrual Ratio Flag</span>
            </div>
            <p className="risk-flag-desc">Triggered when the accrual ratio exceeds <strong>10%</strong>. A high accrual ratio means reported earnings are significantly higher than operating cash flow — a classic earnings quality warning sign.</p>
            <code className="risk-flag-formula">Accrual Ratio = (Net Income − CFO) / Avg. Total Assets</code>
          </div>
          <div className="risk-flag-item">
            <div className="risk-flag-header">
              <span className="risk-flag-icon" style={{ background: "#eab30822" }}>💵</span>
              <span className="risk-flag-name">Cash Conversion Flag</span>
            </div>
            <p className="risk-flag-desc">Triggered when Operating Cash Flow is <strong>less than 80%</strong> of Net Income. Indicates the company is not converting profits into real cash effectively.</p>
            <code className="risk-flag-formula">Flag if: CFO / Net Income &lt; 0.80</code>
          </div>
          <div className="risk-flag-item">
            <div className="risk-flag-header">
              <span className="risk-flag-icon" style={{ background: "#22c55e22" }}>📬</span>
              <span className="risk-flag-name">AR Growth Gap Flag</span>
            </div>
            <p className="risk-flag-desc">Triggered when Accounts Receivable grows <strong>more than 10% faster</strong> than Revenue YoY. Suggests potential channel stuffing or aggressive revenue recognition.</p>
            <code className="risk-flag-formula">Flag if: ΔAR% − ΔRevenue% &gt; 10%</code>
          </div>
          <div className="risk-flag-item">
            <div className="risk-flag-header">
              <span className="risk-flag-icon" style={{ background: "#06b6d422" }}>📦</span>
              <span className="risk-flag-name">Inventory Growth Gap Flag</span>
            </div>
            <p className="risk-flag-desc">Triggered when Inventory grows <strong>more than 10% faster</strong> than Revenue YoY. May indicate slowing demand, overproduction, or obsolescence risk.</p>
            <code className="risk-flag-formula">Flag if: ΔInventory% − ΔRevenue% &gt; 10%</code>
          </div>
          <div className="risk-flag-item">
            <div className="risk-flag-header">
              <span className="risk-flag-icon" style={{ background: "#8b5cf622" }}>🔄</span>
              <span className="risk-flag-name">Asset Turnover Drop Flag</span>
            </div>
            <p className="risk-flag-desc">Triggered when Asset Turnover drops by <strong>more than 10%</strong> year-over-year. Signals declining operational efficiency — the company is generating less revenue per dollar of assets.</p>
            <code className="risk-flag-formula">Flag if: ΔAsset Turnover% &lt; −10%</code>
          </div>
          <div className="risk-flag-item">
            <div className="risk-flag-header">
              <span className="risk-flag-icon" style={{ background: "#ec489922" }}>📉</span>
              <span className="risk-flag-name">Margin Drop Flag</span>
            </div>
            <p className="risk-flag-desc">Triggered when Net Profit Margin drops by <strong>more than 5 percentage points</strong> year-over-year. Indicates deteriorating profitability that may not be reflected in headline revenue growth.</p>
            <code className="risk-flag-formula">Flag if: ΔNet Margin &lt; −5pp</code>
          </div>
        </div>
        <div className="risk-score-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#22c55e" }}></span>
            <span><strong>Score 0</strong> — Low Risk: No flags triggered</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#f59e0b" }}></span>
            <span><strong>Score 1</strong> — Medium Risk: 1 flag triggered</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#ef4444" }}></span>
            <span><strong>Score 2+</strong> — High Risk: 2 or more flags triggered</span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-section">
        <h3 className="table-title">Historical Financial Data</h3>
        <div className="table-wrapper">
          <table className="financial-table">
            <thead>
              <tr>
                <th>FY</th>
                <th>Revenue</th>
                <th>Net Income</th>
                <th>CFO</th>
                <th>Total Assets</th>
                <th>Net Margin</th>
                <th>Asset Turnover</th>
                <th>DSO (days)</th>
                <th>DIO (days)</th>
                <th>Accrual Ratio</th>
                <th>Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((row: AnnualMetrics) => {
                const r = riskLabel(row.risk_score);
                return (
                  <tr key={row.fy} className={row.risk_score > 0 ? "risk-row" : ""}>
                    <td className="fy-cell">{row.fy}</td>
                    <td>{fmt(row.revenue)}</td>
                    <td style={{ color: row.net_income < 0 ? "#ef4444" : "inherit" }}>{fmt(row.net_income)}</td>
                    <td style={{ color: row.cfo < 0 ? "#ef4444" : "inherit" }}>{fmt(row.cfo)}</td>
                    <td>{fmt(row.assets)}</td>
                    <td>{pct(row.net_profit_margin)}</td>
                    <td>{num(row.asset_turnover)}x</td>
                    <td>{row.dso_days != null ? row.dso_days.toFixed(1) : "N/A"}</td>
                    <td>{row.dio_days != null ? row.dio_days.toFixed(1) : "N/A"}</td>
                    <td>{row.accrual_ratio != null ? (row.accrual_ratio * 100).toFixed(2) + "%" : "N/A"}</td>
                    <td>
                      <span className="risk-pill" style={{ background: r.color + "22", color: r.color, border: `1px solid ${r.color}` }}>
                        {row.risk_score} · {r.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
