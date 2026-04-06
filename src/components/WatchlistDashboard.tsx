import React, { useState, useMemo } from "react";
import {
  LineChart, Line, ResponsiveContainer,
} from "recharts";
import "./WatchlistDashboard.css";

// ─── Types ───
interface WatchlistItem {
  ticker: string;
  company: string;
  sector: string;
  marketCap: string;
  addedDate: string;
  alertsEnabled: boolean;
  notes: string;
  priceTarget: number | null;
  currentPrice: number;
  priceChange: number;
  priceHistory: number[];
  riskScore: number;
  riskSeverity: "critical" | "warning" | "watch" | "stable";
  keyMetrics: {
    peRatio: number;
    netMargin: number;
    revenueGrowth: number;
    debtToEquity: number;
  };
  recentAlerts: { date: string; type: string; message: string }[];
  tags: string[];
}

// ─── Mock Watchlist Data ───
const defaultWatchlist: WatchlistItem[] = [
  {
    ticker: "TSLA",
    company: "Tesla, Inc.",
    sector: "Consumer Discretionary",
    marketCap: "$800B",
    addedDate: "2026-01-15",
    alertsEnabled: true,
    notes: "Monitor margin compression risk — SG&A rising, EV competition intensifying.",
    priceTarget: 280,
    currentPrice: 248.50,
    priceChange: -2.3,
    priceHistory: [265, 258, 270, 262, 255, 248, 252, 245, 250, 248.5],
    riskScore: 78,
    riskSeverity: "critical",
    keyMetrics: { peRatio: 62.5, netMargin: 8.2, revenueGrowth: 3.5, debtToEquity: 0.45 },
    recentAlerts: [
      { date: "2026-03-15", type: "critical", message: "Margin decline probability reached 78%" },
      { date: "2026-03-10", type: "warning", message: "Revenue slowdown signal detected in Q4 filing" },
      { date: "2026-02-28", type: "info", message: "New 10-K filing processed — risk score updated" },
    ],
    tags: ["High Risk", "EV", "Margin Watch"],
  },
  {
    ticker: "NFLX",
    company: "Netflix, Inc.",
    sector: "Communication Services",
    marketCap: "$380B",
    addedDate: "2026-02-01",
    alertsEnabled: true,
    notes: "Content spend increasing — watch cash flow conversion ratio.",
    priceTarget: 750,
    currentPrice: 685.20,
    priceChange: 1.8,
    priceHistory: [640, 655, 660, 670, 665, 680, 675, 690, 682, 685.2],
    riskScore: 55,
    riskSeverity: "warning",
    keyMetrics: { peRatio: 38.2, netMargin: 18.5, revenueGrowth: 14.2, debtToEquity: 0.72 },
    recentAlerts: [
      { date: "2026-03-12", type: "warning", message: "Cash flow deterioration probability at 55%" },
      { date: "2026-03-01", type: "info", message: "Subscriber growth exceeded estimates" },
    ],
    tags: ["Streaming", "Content Spend"],
  },
  {
    ticker: "AAPL",
    company: "Apple Inc.",
    sector: "Technology",
    marketCap: "$3.0T",
    addedDate: "2025-11-20",
    alertsEnabled: true,
    notes: "Stable fundamentals. Watching for iPhone cycle impact on revenue growth.",
    priceTarget: 220,
    currentPrice: 208.30,
    priceChange: 0.5,
    priceHistory: [195, 198, 202, 200, 205, 203, 207, 206, 209, 208.3],
    riskScore: 22,
    riskSeverity: "stable",
    keyMetrics: { peRatio: 28.5, netMargin: 25.3, revenueGrowth: 5.8, debtToEquity: 1.52 },
    recentAlerts: [
      { date: "2026-03-05", type: "info", message: "10-K filing processed — no significant changes" },
    ],
    tags: ["Blue Chip", "Dividend"],
  },
  {
    ticker: "NVDA",
    company: "NVIDIA Corporation",
    sector: "Technology",
    marketCap: "$2.2T",
    addedDate: "2025-12-10",
    alertsEnabled: true,
    notes: "AI demand strong but valuation stretched. Monitor for revenue deceleration signals.",
    priceTarget: 950,
    currentPrice: 875.40,
    priceChange: -0.8,
    priceHistory: [820, 845, 860, 880, 870, 890, 885, 878, 882, 875.4],
    riskScore: 42,
    riskSeverity: "watch",
    keyMetrics: { peRatio: 55.8, netMargin: 55.0, revenueGrowth: 122.0, debtToEquity: 0.41 },
    recentAlerts: [
      { date: "2026-03-14", type: "watch", message: "Revenue growth deceleration watch — still strong but slowing" },
      { date: "2026-03-08", type: "info", message: "New data center revenue record in Q4" },
    ],
    tags: ["AI", "Semiconductor", "Growth"],
  },
  {
    ticker: "AMZN",
    company: "Amazon.com, Inc.",
    sector: "Consumer Discretionary",
    marketCap: "$1.9T",
    addedDate: "2026-01-05",
    alertsEnabled: false,
    notes: "AWS growth re-accelerating. Retail margins improving. Low risk profile.",
    priceTarget: 210,
    currentPrice: 192.80,
    priceChange: 1.2,
    priceHistory: [178, 182, 185, 188, 186, 190, 189, 193, 191, 192.8],
    riskScore: 28,
    riskSeverity: "stable",
    keyMetrics: { peRatio: 42.3, netMargin: 7.8, revenueGrowth: 12.5, debtToEquity: 0.58 },
    recentAlerts: [
      { date: "2026-03-02", type: "info", message: "AWS margin expansion noted in latest filing" },
    ],
    tags: ["Cloud", "E-Commerce"],
  },
  {
    ticker: "META",
    company: "Meta Platforms, Inc.",
    sector: "Communication Services",
    marketCap: "$1.4T",
    addedDate: "2026-02-15",
    alertsEnabled: true,
    notes: "Reality Labs losses widening. Core ad business strong. Watch capex trajectory.",
    priceTarget: 580,
    currentPrice: 525.60,
    priceChange: -1.1,
    priceHistory: [510, 520, 515, 530, 525, 535, 528, 522, 530, 525.6],
    riskScore: 45,
    riskSeverity: "watch",
    keyMetrics: { peRatio: 24.8, netMargin: 33.2, revenueGrowth: 22.0, debtToEquity: 0.28 },
    recentAlerts: [
      { date: "2026-03-11", type: "watch", message: "Capex increase flagged — Reality Labs spend up 35% YoY" },
      { date: "2026-02-20", type: "info", message: "Ad revenue beat expectations in Q4" },
    ],
    tags: ["Social Media", "AI", "Metaverse"],
  },
];

const severityConfig = {
  critical: { color: "#ef4444", bg: "#fef2f2", icon: "🔴", label: "Critical" },
  warning:  { color: "#f59e0b", bg: "#fffbeb", icon: "🟡", label: "Warning" },
  watch:    { color: "#3b82f6", bg: "#eff6ff", icon: "🔵", label: "Watch" },
  stable:   { color: "#22c55e", bg: "#f0fdf4", icon: "🟢", label: "Stable" },
};

const alertTypeConfig: Record<string, { color: string; icon: string }> = {
  critical: { color: "#ef4444", icon: "🔴" },
  warning:  { color: "#f59e0b", icon: "🟡" },
  watch:    { color: "#3b82f6", icon: "🔵" },
  info:     { color: "#6b7280", icon: "ℹ️" },
};

type SortOption = "risk" | "name" | "dateAdded" | "priceChange";
type FilterOption = "all" | "critical" | "warning" | "watch" | "stable";

const WatchlistDashboard: React.FC = () => {
  const [watchlist] = useState<WatchlistItem[]>(defaultWatchlist);
  const [sortBy, setSortBy] = useState<SortOption>("risk");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSorted = useMemo(() => {
    let items = [...watchlist];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        i => i.ticker.toLowerCase().includes(q) || i.company.toLowerCase().includes(q) || i.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Filter
    if (filterBy !== "all") {
      items = items.filter(i => i.riskSeverity === filterBy);
    }

    // Sort
    switch (sortBy) {
      case "risk": items.sort((a, b) => b.riskScore - a.riskScore); break;
      case "name": items.sort((a, b) => a.ticker.localeCompare(b.ticker)); break;
      case "dateAdded": items.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()); break;
      case "priceChange": items.sort((a, b) => b.priceChange - a.priceChange); break;
    }

    return items;
  }, [watchlist, sortBy, filterBy, searchQuery]);

  // Summary stats
  const stats = useMemo(() => ({
    total: watchlist.length,
    critical: watchlist.filter(i => i.riskSeverity === "critical").length,
    warning: watchlist.filter(i => i.riskSeverity === "warning").length,
    alertsActive: watchlist.filter(i => i.alertsEnabled).length,
    totalAlerts: watchlist.reduce((sum, i) => sum + i.recentAlerts.length, 0),
  }), [watchlist]);

  return (
    <div className="watchlist-dashboard">
      {/* Header */}
      <div className="watchlist-header">
        <div className="watchlist-header-content">
          <div className="watchlist-header-icon">⭐</div>
          <div>
            <h1 className="watchlist-title">Watchlist</h1>
            <p className="watchlist-subtitle">
              Track your portfolio companies with real-time risk monitoring and alert notifications
            </p>
          </div>
          <div className="watchlist-header-stats">
            <div className="wl-header-stat">
              <span className="wl-stat-value">{stats.total}</span>
              <span className="wl-stat-label">Tracked</span>
            </div>
            <div className="wl-header-stat">
              <span className="wl-stat-value" style={{ color: "#ef4444" }}>{stats.critical}</span>
              <span className="wl-stat-label">Critical</span>
            </div>
            <div className="wl-header-stat">
              <span className="wl-stat-value" style={{ color: "#f59e0b" }}>{stats.warning}</span>
              <span className="wl-stat-label">Warning</span>
            </div>
            <div className="wl-header-stat">
              <span className="wl-stat-value">{stats.totalAlerts}</span>
              <span className="wl-stat-label">Alerts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="watchlist-content">
        {/* Controls Bar */}
        <div className="watchlist-controls">
          <div className="wl-search">
            <span className="wl-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by ticker, company, or tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="wl-search-input"
            />
          </div>
          <div className="wl-filters">
            <span className="wl-filter-label">Filter:</span>
            {(["all", "critical", "warning", "watch", "stable"] as FilterOption[]).map(f => (
              <button
                key={f}
                className={`wl-filter-btn ${filterBy === f ? "active" : ""}`}
                onClick={() => setFilterBy(f)}
                style={filterBy === f && f !== "all" ? { background: severityConfig[f as keyof typeof severityConfig]?.color, color: "white" } : {}}
              >
                {f === "all" ? "All" : severityConfig[f as keyof typeof severityConfig]?.icon + " " + f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="wl-sort">
            <span className="wl-sort-label">Sort:</span>
            {(["risk", "name", "dateAdded", "priceChange"] as SortOption[]).map(s => (
              <button
                key={s}
                className={`wl-sort-btn ${sortBy === s ? "active" : ""}`}
                onClick={() => setSortBy(s)}
              >
                {s === "risk" ? "Risk" : s === "name" ? "Name" : s === "dateAdded" ? "Date Added" : "Price Δ"}
              </button>
            ))}
          </div>
        </div>

        {/* Watchlist Grid */}
        <div className="watchlist-grid">
          {filteredAndSorted.map(item => {
            const sev = severityConfig[item.riskSeverity];
            return (
              <div
                key={item.ticker}
                className={`watchlist-card ${selectedItem?.ticker === item.ticker ? "selected" : ""}`}
                style={{ borderLeftColor: sev.color }}
                onClick={() => setSelectedItem(selectedItem?.ticker === item.ticker ? null : item)}
              >
                <div className="wl-card-top">
                  <div className="wl-card-header">
                    <div className="wl-card-title-row">
                      <span className="wl-card-ticker">{item.ticker}</span>
                      <span className="wl-card-severity" style={{ color: sev.color, background: sev.bg }}>
                        {sev.icon} {sev.label}
                      </span>
                    </div>
                    <div className="wl-card-company">{item.company}</div>
                    <div className="wl-card-sector">{item.sector} · {item.marketCap}</div>
                  </div>
                  <div className="wl-card-price-section">
                    <div className="wl-card-price">${item.currentPrice.toFixed(2)}</div>
                    <div className={`wl-card-change ${item.priceChange >= 0 ? "positive" : "negative"}`}>
                      {item.priceChange >= 0 ? "▲" : "▼"} {Math.abs(item.priceChange).toFixed(1)}%
                    </div>
                    <div className="wl-card-sparkline">
                      <ResponsiveContainer width="100%" height={32}>
                        <LineChart data={item.priceHistory.map((v, i) => ({ i, v }))}>
                          <Line
                            type="monotone"
                            dataKey="v"
                            stroke={item.priceChange >= 0 ? "#22c55e" : "#ef4444"}
                            strokeWidth={1.5}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="wl-card-metrics">
                  <div className="wl-metric">
                    <span className="wl-metric-label">Risk</span>
                    <div className="wl-risk-bar">
                      <div className="wl-risk-fill" style={{ width: `${item.riskScore}%`, background: sev.color }} />
                    </div>
                    <span className="wl-metric-value" style={{ color: sev.color }}>{item.riskScore}</span>
                  </div>
                  <div className="wl-metric">
                    <span className="wl-metric-label">P/E</span>
                    <span className="wl-metric-value">{item.keyMetrics.peRatio}x</span>
                  </div>
                  <div className="wl-metric">
                    <span className="wl-metric-label">Margin</span>
                    <span className="wl-metric-value">{item.keyMetrics.netMargin}%</span>
                  </div>
                  <div className="wl-metric">
                    <span className="wl-metric-label">Rev Growth</span>
                    <span className={`wl-metric-value ${item.keyMetrics.revenueGrowth >= 10 ? "positive" : ""}`}>
                      {item.keyMetrics.revenueGrowth}%
                    </span>
                  </div>
                </div>

                <div className="wl-card-tags">
                  {item.tags.map(tag => (
                    <span key={tag} className="wl-tag">{tag}</span>
                  ))}
                  {item.alertsEnabled && <span className="wl-tag wl-tag-alert">🔔 Alerts On</span>}
                </div>

                {item.notes && (
                  <div className="wl-card-notes">
                    <span className="wl-notes-icon">📝</span> {item.notes}
                  </div>
                )}

                {/* Expanded Detail */}
                {selectedItem?.ticker === item.ticker && (
                  <div className="wl-card-expanded">
                    <div className="wl-expanded-section">
                      <h4>📊 Key Financial Metrics</h4>
                      <div className="wl-expanded-metrics">
                        <div className="wl-exp-metric">
                          <span className="wl-exp-label">P/E Ratio</span>
                          <span className="wl-exp-value">{item.keyMetrics.peRatio}x</span>
                        </div>
                        <div className="wl-exp-metric">
                          <span className="wl-exp-label">Net Margin</span>
                          <span className="wl-exp-value">{item.keyMetrics.netMargin}%</span>
                        </div>
                        <div className="wl-exp-metric">
                          <span className="wl-exp-label">Revenue Growth</span>
                          <span className="wl-exp-value">{item.keyMetrics.revenueGrowth}%</span>
                        </div>
                        <div className="wl-exp-metric">
                          <span className="wl-exp-label">Debt/Equity</span>
                          <span className="wl-exp-value">{item.keyMetrics.debtToEquity}x</span>
                        </div>
                        <div className="wl-exp-metric">
                          <span className="wl-exp-label">Price Target</span>
                          <span className="wl-exp-value">{item.priceTarget ? `$${item.priceTarget}` : "—"}</span>
                        </div>
                        <div className="wl-exp-metric">
                          <span className="wl-exp-label">Upside</span>
                          <span className={`wl-exp-value ${item.priceTarget && item.priceTarget > item.currentPrice ? "positive" : "negative"}`}>
                            {item.priceTarget ? `${((item.priceTarget / item.currentPrice - 1) * 100).toFixed(1)}%` : "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="wl-expanded-section">
                      <h4>🚨 Recent Alerts ({item.recentAlerts.length})</h4>
                      <div className="wl-alerts-list">
                        {item.recentAlerts.map((alert, i) => {
                          const ac = alertTypeConfig[alert.type] || alertTypeConfig.info;
                          return (
                            <div key={i} className="wl-alert-item">
                              <span className="wl-alert-icon">{ac.icon}</span>
                              <div className="wl-alert-content">
                                <span className="wl-alert-message">{alert.message}</span>
                                <span className="wl-alert-date">{alert.date}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="wl-expanded-section">
                      <h4>ℹ️ Details</h4>
                      <div className="wl-detail-row">
                        <span>Added:</span> <span>{item.addedDate}</span>
                      </div>
                      <div className="wl-detail-row">
                        <span>Sector:</span> <span>{item.sector}</span>
                      </div>
                      <div className="wl-detail-row">
                        <span>Market Cap:</span> <span>{item.marketCap}</span>
                      </div>
                      <div className="wl-detail-row">
                        <span>Alerts:</span> <span>{item.alertsEnabled ? "✅ Enabled" : "❌ Disabled"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredAndSorted.length === 0 && (
          <div className="wl-empty">
            <span className="wl-empty-icon">🔍</span>
            <p>No companies match your search or filter criteria.</p>
          </div>
        )}

        {/* Summary Table */}
        <section className="wl-summary-section">
          <h2>📋 Watchlist Summary</h2>
          <div className="wl-table-wrapper">
            <table className="wl-summary-table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Company</th>
                  <th>Sector</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>Risk Score</th>
                  <th>Severity</th>
                  <th>P/E</th>
                  <th>Net Margin</th>
                  <th>Rev Growth</th>
                  <th>D/E</th>
                  <th>Alerts</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map(item => {
                  const sev = severityConfig[item.riskSeverity];
                  return (
                    <tr key={item.ticker} onClick={() => setSelectedItem(item)}>
                      <td className="wl-table-ticker">{item.ticker}</td>
                      <td>{item.company}</td>
                      <td>{item.sector}</td>
                      <td>${item.currentPrice.toFixed(2)}</td>
                      <td className={item.priceChange >= 0 ? "positive" : "negative"}>
                        {item.priceChange >= 0 ? "+" : ""}{item.priceChange.toFixed(1)}%
                      </td>
                      <td>
                        <div className="wl-table-risk">
                          <div className="wl-table-risk-bar">
                            <div style={{ width: `${item.riskScore}%`, background: sev.color, height: "100%", borderRadius: 3 }} />
                          </div>
                          <span style={{ color: sev.color, fontWeight: 700 }}>{item.riskScore}</span>
                        </div>
                      </td>
                      <td>
                        <span className="wl-table-severity" style={{ color: sev.color, background: sev.bg }}>
                          {sev.icon} {sev.label}
                        </span>
                      </td>
                      <td>{item.keyMetrics.peRatio}x</td>
                      <td>{item.keyMetrics.netMargin}%</td>
                      <td className={item.keyMetrics.revenueGrowth >= 10 ? "positive" : ""}>{item.keyMetrics.revenueGrowth}%</td>
                      <td>{item.keyMetrics.debtToEquity}x</td>
                      <td>{item.recentAlerts.length}</td>
                      <td>{item.addedDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WatchlistDashboard;
