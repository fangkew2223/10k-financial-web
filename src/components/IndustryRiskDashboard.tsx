import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ReferenceLine,
} from "recharts";
import {
  getAllIndustryRisks, getByIndustry, getSystemicSignals, industryRules,
  CompanyIndustryRisk, IndustryType, SystemicSignal,
} from "../data/industryRiskData";
import "./IndustryRiskDashboard.css";

const riskLevelConfig: Record<string, { color: string; bg: string; icon: string }> = {
  low:      { color: "#22c55e", bg: "#f0fdf4", icon: "🟢" },
  moderate: { color: "#3b82f6", bg: "#eff6ff", icon: "🔵" },
  elevated: { color: "#f59e0b", bg: "#fffbeb", icon: "🟡" },
  high:     { color: "#f97316", bg: "#fff7ed", icon: "🟠" },
  critical: { color: "#ef4444", bg: "#fef2f2", icon: "🔴" },
};

const stressStatusConfig: Record<string, { color: string; label: string }> = {
  pass:     { color: "#22c55e", label: "PASS" },
  marginal: { color: "#f59e0b", label: "MARGINAL" },
  fail:     { color: "#ef4444", label: "FAIL" },
};

const categoryColors: Record<string, string> = {
  growth: "#3b82f6", quality: "#8b5cf6", operational: "#f59e0b",
  financial: "#ef4444", market: "#06b6d4",
};

type ViewMode = "overview" | "sector" | "company" | "systemic";

const IndustryRiskDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>("overview");
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>("technology");
  const [selectedTicker, setSelectedTicker] = useState<string>("TSLA");

  const allRisks = useMemo(() => getAllIndustryRisks(), []);
  const systemicSignals = useMemo(() => getSystemicSignals(), []);
  const sectorCompanies = useMemo(() => getByIndustry(selectedIndustry), [selectedIndustry]);
  const selectedCompany = useMemo(() => allRisks.find(c => c.ticker === selectedTicker), [allRisks, selectedTicker]);

  const views: { key: ViewMode; label: string; icon: string }[] = [
    { key: "overview", label: "Risk Overview", icon: "🗺️" },
    { key: "sector", label: "Sector Deep Dive", icon: "🏭" },
    { key: "company", label: "Company Analysis", icon: "🔬" },
    { key: "systemic", label: "Systemic Signals", icon: "🌐" },
  ];

  return (
    <div className="ir-dashboard">
      {/* Header */}
      <div className="ir-header">
        <div className="ir-header-content">
          <div className="ir-header-icon">🏭</div>
          <div>
            <h1 className="ir-title">Industry-Specific Risk Intelligence</h1>
            <p className="ir-subtitle">
              Sector-tailored risk overlays: Banking capital adequacy · Tech growth quality · Retail inventory dynamics · Industrial capacity cycles
            </p>
          </div>
          <div className="ir-header-stats">
            <div className="ir-stat">
              <span className="ir-stat-value">{allRisks.length}</span>
              <span className="ir-stat-label">Companies</span>
            </div>
            <div className="ir-stat">
              <span className="ir-stat-value">4</span>
              <span className="ir-stat-label">Sectors</span>
            </div>
            <div className="ir-stat">
              <span className="ir-stat-value" style={{ color: "#ef4444" }}>
                {allRisks.filter(c => c.riskLevel === "critical" || c.riskLevel === "high").length}
              </span>
              <span className="ir-stat-label">High Risk</span>
            </div>
          </div>
        </div>
        <div className="ir-nav">
          {views.map(v => (
            <button key={v.key} className={`ir-nav-btn ${activeView === v.key ? "active" : ""}`}
              onClick={() => setActiveView(v.key)}>
              <span>{v.icon}</span> {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {activeView === "overview" && (
        <div className="ir-content">
          {/* Framework Explanation */}
          <section className="ir-section">
            <h2>🧠 How Industry Risk Overlay Works</h2>
            <div className="ir-framework">
              <div className="ir-fw-step">
                <div className="ir-fw-icon">📊</div>
                <div className="ir-fw-label">General Risk<br/>Model</div>
                <div className="ir-fw-desc">Base score from financial metrics</div>
              </div>
              <div className="ir-fw-plus">+</div>
              <div className="ir-fw-step highlight">
                <div className="ir-fw-icon">🏭</div>
                <div className="ir-fw-label">Industry<br/>Overlay</div>
                <div className="ir-fw-desc">Sector-specific risk filters</div>
              </div>
              <div className="ir-fw-plus">=</div>
              <div className="ir-fw-step result">
                <div className="ir-fw-icon">🎯</div>
                <div className="ir-fw-label">Final Risk<br/>Score</div>
                <div className="ir-fw-desc">More accurate assessment</div>
              </div>
            </div>
          </section>

          {/* Industry Cards */}
          <section className="ir-section">
            <h2>🏗️ Sector Risk Profiles</h2>
            <div className="ir-industry-grid">
              {(Object.keys(industryRules) as IndustryType[]).map(ind => {
                const rule = industryRules[ind];
                const companies = getByIndustry(ind);
                const avgRisk = companies.length > 0
                  ? Math.round(companies.reduce((s, c) => s + c.riskScore, 0) / companies.length)
                  : 0;
                return (
                  <div key={ind} className="ir-industry-card" style={{ borderTopColor: rule.color }}
                    onClick={() => { setSelectedIndustry(ind); setActiveView("sector"); }}>
                    <div className="ir-ind-header">
                      <span className="ir-ind-icon">{rule.icon}</span>
                      <div>
                        <h3 className="ir-ind-name">{rule.label}</h3>
                        <span className="ir-ind-count">{companies.length} companies tracked</span>
                      </div>
                    </div>
                    <div className="ir-ind-risk">
                      <span className="ir-ind-risk-label">Avg Risk Score</span>
                      <div className="ir-ind-risk-bar">
                        <div className="ir-ind-risk-fill" style={{ width: `${avgRisk}%`, background: rule.color }} />
                      </div>
                      <span className="ir-ind-risk-value" style={{ color: rule.color }}>{avgRisk}</span>
                    </div>
                    <div className="ir-ind-logic">
                      <span className="ir-ind-logic-label">Core Risk Logic:</span>
                      <span className="ir-ind-logic-text">{rule.riskLogic}</span>
                    </div>
                    <div className="ir-ind-metrics">
                      {rule.keyMetrics.slice(0, 4).map(m => (
                        <span key={m} className="ir-ind-metric-tag" style={{ borderColor: rule.color, color: rule.color }}>{m}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* All Companies Risk Comparison */}
          <section className="ir-section">
            <h2>📊 Risk Score Comparison — Base vs Industry-Adjusted</h2>
            <div className="ir-chart-wrapper">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={allRisks.map(c => ({
                  ticker: c.ticker,
                  base: c.baseRiskScore,
                  adjustment: c.industryAdjustment,
                  total: c.riskScore,
                  level: c.riskLevel,
                }))} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="ticker" tick={{ fontSize: 12, fontWeight: 700 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                    formatter={(value: any, name: any) => [`${value}`, name === "base" ? "Base Risk" : name === "adjustment" ? "Industry Overlay" : "Total"]} />
                  <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" />
                  <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="4 4" />
                  <Bar dataKey="base" stackId="a" fill="#94a3b8" name="Base Risk" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="adjustment" stackId="a" fill="#3b82f6" name="Industry Overlay" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      )}

      {/* ═══ SECTOR DEEP DIVE ═══ */}
      {activeView === "sector" && (
        <div className="ir-content">
          {/* Sector Selector */}
          <div className="ir-sector-selector">
            {(Object.keys(industryRules) as IndustryType[]).map(ind => {
              const rule = industryRules[ind];
              return (
                <button key={ind}
                  className={`ir-sector-btn ${selectedIndustry === ind ? "active" : ""}`}
                  style={selectedIndustry === ind ? { background: rule.color, color: "white", borderColor: rule.color } : {}}
                  onClick={() => setSelectedIndustry(ind)}>
                  {rule.icon} {rule.label}
                </button>
              );
            })}
          </div>

          {/* Sector Info */}
          <section className="ir-section">
            <div className="ir-sector-info" style={{ borderLeftColor: industryRules[selectedIndustry].color }}>
              <h2>{industryRules[selectedIndustry].icon} {industryRules[selectedIndustry].label}</h2>
              <p className="ir-sector-logic"><strong>Core Risk Logic:</strong> {industryRules[selectedIndustry].riskLogic}</p>
              <div className="ir-sector-metrics-list">
                <strong>Key Metrics:</strong>
                {industryRules[selectedIndustry].keyMetrics.map(m => (
                  <span key={m} className="ir-sector-metric-badge" style={{ background: industryRules[selectedIndustry].color }}>{m}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Educational Section — Why These Metrics Matter */}
          <section className="ir-section">
            <h2>📖 Why These Metrics Matter</h2>
            <div className="ir-edu-container" style={{ borderLeftColor: industryRules[selectedIndustry].color }}>
              {selectedIndustry === "banking" && (
                <>
                  <div className="ir-edu-intro">
                    <p>Banking is fundamentally different from other industries. Banks use <strong>leverage</strong> — they borrow money (deposits) to lend money (loans). This means small losses can be amplified into systemic crises. The 2008 financial crisis proved that traditional profitability metrics alone cannot detect banking risk. Instead, regulators and analysts focus on <strong>capital adequacy</strong> — whether a bank has enough of its own money to absorb losses.</p>
                  </div>
                  <div className="ir-edu-metrics-grid">
                    <div className="ir-edu-metric-card">
                      <h4>🏛️ CET1 Ratio (Common Equity Tier 1)</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> The bank's highest-quality capital (common stock + retained earnings) as a percentage of risk-weighted assets.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> This is the single most important banking metric. It tells you how much "shock absorber" the bank has. If loans go bad, CET1 capital absorbs the losses first. Regulators require a minimum of ~10.5% for large banks.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Above 12%</span> = strong buffer. <span className="ir-edu-warn">10.5–12%</span> = adequate but thin. <span className="ir-edu-bad">Below 10.5%</span> = regulatory concern, may restrict dividends/buybacks.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>🏗️ Tier 1 Capital Ratio</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> CET1 plus additional Tier 1 instruments (like preferred stock) divided by risk-weighted assets.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> A broader measure of high-quality capital. It includes instruments that can absorb losses while the bank is still operating (a "going concern" basis).</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> Should be at least 2–3 percentage points above CET1. If the gap is small, the bank relies heavily on common equity (actually a good sign).</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>⚖️ Leverage Ratio</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Tier 1 capital divided by total exposure (all assets, not risk-weighted). A simpler, harder-to-game version of capital adequacy.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> Risk-weighted ratios can be manipulated by classifying assets as "low risk." The leverage ratio ignores risk weights — it's a backstop that catches banks that game the system.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Above 5%</span> = healthy. <span className="ir-edu-warn">3–5%</span> = regulatory minimum zone. <span className="ir-edu-bad">Below 3%</span> = dangerously leveraged.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>⚠️ NPL Ratio (Non-Performing Loans)</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Percentage of loans where borrowers have stopped making payments (typically 90+ days past due).</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> Rising NPLs are an early warning of credit quality deterioration. If too many loans go bad, the bank must write them off, directly reducing capital.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Below 1%</span> = excellent credit quality. <span className="ir-edu-warn">1–3%</span> = normal range, watch the trend. <span className="ir-edu-bad">Above 3%</span> = significant credit stress.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>💰 Net Interest Margin (NIM)</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> The difference between interest earned on loans/investments and interest paid on deposits/borrowings, as a percentage of earning assets.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> NIM is the core profitability engine for traditional banking. When rates rise, NIM typically expands (good). When rates fall, NIM compresses (bad). For investment banks like GS, NIM is less important than trading/advisory revenue.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Above 1.5%</span> = healthy for investment banks. <span className="ir-edu-warn">1.0–1.5%</span> = adequate. <span className="ir-edu-bad">Below 1.0%</span> = margin pressure. (Note: commercial banks typically have higher NIMs of 2.5–3.5%.)</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>📊 Efficiency Ratio</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Non-interest expenses divided by total revenue. How many cents the bank spends to earn each dollar.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> Lower is better — it means the bank is more efficient. Investment banks tend to have higher efficiency ratios (~60–75%) than commercial banks (~50–60%) because of high compensation costs.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Below 60%</span> = very efficient. <span className="ir-edu-warn">60–70%</span> = typical for investment banks. <span className="ir-edu-bad">Above 75%</span> = cost control issues.</p>
                    </div>
                  </div>
                </>
              )}
              {selectedIndustry === "technology" && (
                <>
                  <div className="ir-edu-intro">
                    <p>Technology companies are valued primarily on <strong>growth and innovation potential</strong>, not just current earnings. This creates unique risks: companies can appear profitable while diluting shareholders through stock-based compensation, or spending unsustainably on R&D. The key question is always: <strong>Is this growth real, sustainable, and creating shareholder value?</strong></p>
                  </div>
                  <div className="ir-edu-metrics-grid">
                    <div className="ir-edu-metric-card">
                      <h4>🔬 R&D / Revenue</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Research & development spending as a percentage of total revenue.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> Too low means the company isn't investing in future products. Too high means it's burning cash on innovation that may never pay off. The sweet spot depends on the sub-sector — SaaS companies typically spend 15–25%, while hardware companies spend 5–10%.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Below 15%</span> = efficient innovation. <span className="ir-edu-warn">15–25%</span> = heavy investment phase. <span className="ir-edu-bad">Above 25%</span> = potential cash burn concern (e.g., Meta's Reality Labs).</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>💸 SBC / Revenue (Stock-Based Compensation)</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> The value of stock/options granted to employees as a percentage of revenue.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> SBC is a real cost that dilutes existing shareholders, but it doesn't appear in cash flow statements. Many tech companies report strong "adjusted earnings" that exclude SBC — hiding the true cost of talent. High SBC means your ownership stake is being quietly eroded.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Below 5%</span> = well-controlled (Apple, Netflix). <span className="ir-edu-warn">5–8%</span> = moderate dilution. <span className="ir-edu-bad">Above 8%</span> = significant shareholder dilution concern (NVDA, META, GOOGL).</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>📈 Revenue Growth</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Year-over-year percentage change in total revenue.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> Growth is the lifeblood of tech valuations. But the quality of growth matters more than the rate — is it organic or acquisition-driven? Sustainable or one-time? Decelerating growth in a high-multiple stock can trigger severe valuation compression.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> Watch the <strong>trend</strong>, not just the number. Decelerating growth (e.g., NVDA going from 126% → 65%) is a warning even if the absolute number looks impressive.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>💵 FCF Margin (Free Cash Flow)</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Free cash flow (operating cash flow minus capex) as a percentage of revenue.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> FCF is the ultimate measure of financial health — it's the cash left after running the business and investing in growth. Unlike earnings, FCF is hard to manipulate. A company with high earnings but low FCF may be using aggressive accounting.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Above 25%</span> = exceptional cash machine (MSFT, AAPL). <span className="ir-edu-warn">15–25%</span> = healthy. <span className="ir-edu-bad">Below 15%</span> = may struggle to fund growth without dilution.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>📋 Deferred Revenue Growth</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Year-over-year change in deferred revenue (payments received for services not yet delivered).</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> Rising deferred revenue is a leading indicator — it means customers are signing contracts and paying upfront for future services. It's especially important for SaaS and cloud companies as a measure of forward demand visibility.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Growing faster than revenue</span> = strong forward demand. <span className="ir-edu-warn">Growing slower than revenue</span> = demand may be peaking. <span className="ir-edu-bad">Declining</span> = customers not renewing/expanding.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>📊 Gross Margin</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Revenue minus cost of goods sold, divided by revenue. The profit on each dollar before operating expenses.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> High gross margins indicate pricing power and scalability. Software companies typically have 70–85% gross margins (near-zero marginal cost), while hardware companies have 30–50%. Declining gross margins signal competitive pressure or rising input costs.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> Compare within sub-sector. <span className="ir-edu-good">Above 60%</span> = strong pricing power. <span className="ir-edu-warn">40–60%</span> = mixed model. <span className="ir-edu-bad">Below 40%</span> = hardware-heavy or commoditized.</p>
                    </div>
                  </div>
                </>
              )}
              {selectedIndustry === "retail" && (
                <>
                  <div className="ir-edu-intro">
                    <p>Retail is a <strong>working capital intensive</strong> business where the core risk is the mismatch between inventory purchased and consumer demand. Retailers must predict what consumers will buy months in advance, and getting it wrong leads to markdowns, margin compression, and cash flow problems. The metrics below help detect these mismatches before they show up in earnings.</p>
                  </div>
                  <div className="ir-edu-metrics-grid">
                    <div className="ir-edu-metric-card">
                      <h4>📦 Inventory Turnover</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> How many times per year a retailer sells and replaces its entire inventory (Cost of Goods Sold ÷ Average Inventory).</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> This is the #1 retail health metric. High turnover means products are selling quickly — less risk of markdowns and obsolescence. Low turnover means inventory is sitting on shelves, tying up cash and likely requiring discounts to clear.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Above 10x</span> = excellent (Costco at 12.5x). <span className="ir-edu-warn">6–10x</span> = healthy for most retailers. <span className="ir-edu-bad">Below 6x</span> = potential inventory buildup problem. Always compare to the company's own history — a declining trend is a red flag.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>💰 Gross Margin</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> The markup on products after accounting for the cost of purchasing/manufacturing them.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> In retail, gross margin reflects pricing power and markdown activity. Declining margins often mean the retailer is cutting prices to move excess inventory — a classic distress signal. Different retail models have very different margins (Costco ~13% vs. Amazon ~48%).</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> Don't compare across different retail models. Instead, watch the <strong>trend</strong> for each company. A 1–2 percentage point decline in gross margin can wipe out a significant portion of net income for low-margin retailers.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>🏪 Same-Store Sales (Comp Sales)</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Revenue growth from stores open for at least one year, excluding new store openings.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> This strips out the effect of new store openings to show organic demand. A retailer can grow total revenue by opening stores while existing stores are declining — comp sales reveals this. It's the purest measure of whether customers are spending more or less.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Above 3%</span> = healthy organic growth. <span className="ir-edu-warn">0–3%</span> = flat, may be losing to inflation. <span className="ir-edu-bad">Negative</span> = customers are spending less — serious concern.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>💧 Working Capital Ratio</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Current assets divided by current liabilities. Can the retailer pay its short-term bills?</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> Retailers with thin margins need healthy working capital to survive seasonal fluctuations. A ratio below 1.0 means the company owes more short-term than it owns — though some models (like Costco's membership model) can operate safely below 1.0 due to predictable cash flows.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Above 1.2</span> = comfortable buffer. <span className="ir-edu-warn">0.9–1.2</span> = adequate for strong operators. <span className="ir-edu-bad">Below 0.9</span> = liquidity risk unless the business model justifies it.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>📅 DSO (Days Sales Outstanding)</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Average number of days to collect payment after a sale.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> Most retail is cash-at-register, so DSO should be very low. Rising DSO in retail could indicate growing B2B/wholesale exposure or collection problems. For e-commerce, it reflects payment processing timing.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Below 5 days</span> = pure cash business (Costco). <span className="ir-edu-warn">5–20 days</span> = some credit/wholesale mix. <span className="ir-edu-bad">Above 30 days</span> = unusual for retail, investigate.</p>
                    </div>
                  </div>
                </>
              )}
              {selectedIndustry === "industrial" && (
                <>
                  <div className="ir-edu-intro">
                    <p>Industrial and manufacturing companies operate in <strong>capital-intensive cycles</strong>. They invest heavily in factories, equipment, and capacity years before products are sold. The core risk is the <strong>capacity cycle</strong> — building too much capacity during boom times, then facing overcapacity when demand slows. These metrics help detect where a company sits in the cycle.</p>
                  </div>
                  <div className="ir-edu-metrics-grid">
                    <div className="ir-edu-metric-card">
                      <h4>🏗️ Capex / Revenue</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Capital expenditures (spending on factories, equipment, infrastructure) as a percentage of revenue.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> High capex signals the company is expanding capacity. This is good during demand upswings but dangerous if demand doesn't materialize — the company is locked into fixed costs. Rising capex/revenue ratio means the company is investing faster than revenue is growing.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Below 5%</span> = asset-light model (Broadcom). <span className="ir-edu-warn">5–10%</span> = moderate investment cycle. <span className="ir-edu-bad">Above 10%</span> = heavy expansion — watch for overcapacity risk.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>⚙️ Capacity Utilization</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> What percentage of total manufacturing capacity is actually being used to produce goods.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> This is the most direct measure of supply-demand balance. High utilization means demand is strong relative to capacity. Declining utilization means demand is weakening or the company built too much capacity — a classic precursor to margin compression and writedowns.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">75–90%</span> = healthy sweet spot. <span className="ir-edu-warn">60–75%</span> = underutilization, fixed cost pressure. <span className="ir-edu-bad">Below 60%</span> = severe overcapacity, likely losses. Above 90% = may need expansion.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>📋 Backlog Growth</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Year-over-year change in unfilled orders (products ordered but not yet delivered).</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> Backlog is a <strong>leading indicator</strong> — it tells you about future revenue before it happens. Growing backlog means demand exceeds current production capacity (bullish). Shrinking backlog means orders are drying up (bearish). This is one of the earliest warning signals in manufacturing.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Positive and growing</span> = strong forward demand. <span className="ir-edu-warn">Positive but decelerating</span> = demand peaking. <span className="ir-edu-bad">Negative</span> = orders declining, revenue will follow.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>🔄 Asset Turnover</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Revenue divided by total assets. How efficiently the company uses its asset base to generate sales.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> Declining asset turnover means the company's assets are growing faster than revenue — often a sign of over-investment or acquisition-driven growth that isn't generating proportional returns. For capital-heavy manufacturers, this is a key efficiency metric.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> Compare to the company's own history. A steady decline over 3+ years is a warning sign. Sudden drops often follow large acquisitions (e.g., Broadcom's VMware deal).</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>📊 ROIC (Return on Invested Capital)</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Net operating profit after tax divided by total invested capital. The return generated on every dollar invested in the business.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> ROIC is the ultimate measure of capital allocation quality. If ROIC exceeds the company's cost of capital (WACC, typically 8–12%), the company is creating value. If ROIC falls below WACC, every dollar invested is destroying shareholder value.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Above 15%</span> = excellent capital allocation. <span className="ir-edu-warn">10–15%</span> = adequate, above most WACCs. <span className="ir-edu-bad">Below 10%</span> = approaching value destruction territory.</p>
                    </div>
                    <div className="ir-edu-metric-card">
                      <h4>🔗 Customer Concentration</h4>
                      <p className="ir-edu-what"><strong>What it measures:</strong> Revenue from the largest customer as a percentage of total revenue.</p>
                      <p className="ir-edu-why"><strong>Why it matters:</strong> High customer concentration creates dependency risk. If the top customer reduces orders, the impact is outsized. This is especially relevant for semiconductor and component manufacturers who may rely on a few large OEMs.</p>
                      <p className="ir-edu-read"><strong>How to read it:</strong> <span className="ir-edu-good">Below 15%</span> = well-diversified. <span className="ir-edu-warn">15–25%</span> = moderate concentration. <span className="ir-edu-bad">Above 25%</span> = significant dependency risk (Broadcom at 35% from Apple).</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Companies in Sector */}
          <section className="ir-section">
            <h2>📋 Companies in {industryRules[selectedIndustry].label}</h2>
            {sectorCompanies.length === 0 ? (
              <div className="ir-empty">No companies tracked in this sector yet. Banking sector data coming soon.</div>
            ) : (
              <div className="ir-company-grid">
                {sectorCompanies.map(c => {
                  const rl = riskLevelConfig[c.riskLevel];
                  return (
                    <div key={c.ticker} className="ir-company-card" style={{ borderLeftColor: rl.color }}
                      onClick={() => { setSelectedTicker(c.ticker); setActiveView("company"); }}>
                      <div className="ir-cc-header">
                        <span className="ir-cc-ticker">{c.ticker}</span>
                        <span className="ir-cc-level" style={{ color: rl.color, background: rl.bg }}>
                          {rl.icon} {c.riskLevel.charAt(0).toUpperCase() + c.riskLevel.slice(1)}
                        </span>
                      </div>
                      <div className="ir-cc-company">{c.company}</div>
                      <div className="ir-cc-scores">
                        <div className="ir-cc-score-item">
                          <span className="ir-cc-score-label">Base</span>
                          <span className="ir-cc-score-value">{c.baseRiskScore}</span>
                        </div>
                        <div className="ir-cc-score-plus">+</div>
                        <div className="ir-cc-score-item highlight">
                          <span className="ir-cc-score-label">Overlay</span>
                          <span className="ir-cc-score-value" style={{ color: "#3b82f6" }}>+{c.industryAdjustment}</span>
                        </div>
                        <div className="ir-cc-score-eq">=</div>
                        <div className="ir-cc-score-item total">
                          <span className="ir-cc-score-label">Final</span>
                          <span className="ir-cc-score-value" style={{ color: rl.color, fontSize: "1.2rem" }}>{c.riskScore}</span>
                        </div>
                      </div>
                      <div className="ir-cc-metrics-preview">
                        {c.keyMetrics.slice(0, 3).map(m => (
                          <div key={m.name} className="ir-cc-metric-mini">
                            <span className={`ir-cc-metric-dot ${m.status}`}></span>
                            <span className="ir-cc-metric-name">{m.name}</span>
                            <span className="ir-cc-metric-val">{m.value}{m.unit}</span>
                          </div>
                        ))}
                      </div>
                      <p className="ir-cc-summary">{c.summary.substring(0, 120)}...</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ═══ COMPANY ANALYSIS ═══ */}
      {activeView === "company" && selectedCompany && (
        <CompanyIndustryAnalysis
          company={selectedCompany}
          allRisks={allRisks}
          onSelectCompany={(t) => setSelectedTicker(t)}
        />
      )}

      {/* ═══ SYSTEMIC SIGNALS ═══ */}
      {activeView === "systemic" && (
        <div className="ir-content">
          <section className="ir-section">
            <h2>🌐 Systemic Risk Aggregation</h2>
            <p className="ir-section-desc">
              Cross-company signals aggregated at the sector level — detecting industry-wide risk patterns
              that individual company analysis may miss.
            </p>
            <div className="ir-systemic-grid">
              {systemicSignals.map((sig, i) => {
                const sevColor = sig.severity === "high" ? "#ef4444" : sig.severity === "elevated" ? "#f59e0b" : sig.severity === "moderate" ? "#3b82f6" : "#22c55e";
                return (
                  <div key={i} className="ir-systemic-card" style={{ borderLeftColor: sevColor }}>
                    <div className="ir-sys-header">
                      <span className="ir-sys-industry">{industryRules[sig.industry]?.icon} {sig.industryLabel}</span>
                      <span className="ir-sys-severity" style={{ color: sevColor, background: sevColor + "15" }}>
                        {sig.severity.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="ir-sys-signal">{sig.signal}</h3>
                    <p className="ir-sys-desc">{sig.description}</p>
                    <div className="ir-sys-affected">
                      <span>Affected: {sig.affectedCompanies}/{sig.totalCompanies} companies</span>
                      <div className="ir-sys-affected-bar">
                        <div style={{ width: `${(sig.affectedCompanies / sig.totalCompanies) * 100}%`, background: sevColor, height: "100%", borderRadius: 3 }} />
                      </div>
                    </div>
                    <div className="ir-sys-drivers">
                      {sig.drivers.map((d, j) => (
                        <span key={j} className="ir-sys-driver-tag">• {d}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Methodology */}
          <section className="ir-section">
            <h2>📐 Industry Risk Framework</h2>
            <div className="ir-framework-table-wrapper">
              <table className="ir-framework-table">
                <thead>
                  <tr>
                    <th>Industry</th>
                    <th>Core Risk</th>
                    <th>Key Metrics</th>
                    <th>Risk Logic</th>
                    <th>Policy Relevance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span style={{ fontSize: "1.2rem" }}>🏦</span> Banking</td>
                    <td>Capital inadequacy</td>
                    <td>CET1, RWA, Leverage, NPL</td>
                    <td>Systemic risk / Credit quality</td>
                    <td>Basel III / CCAR stress testing</td>
                  </tr>
                  <tr>
                    <td><span style={{ fontSize: "1.2rem" }}>💻</span> Technology</td>
                    <td>Growth quality</td>
                    <td>SBC, R&D ratio, FCF, Deferred Rev</td>
                    <td>Valuation bubble / SBC dilution</td>
                    <td>Innovation sustainability</td>
                  </tr>
                  <tr>
                    <td><span style={{ fontSize: "1.2rem" }}>🛍️</span> Retail</td>
                    <td>Demand mismatch</td>
                    <td>Inventory turnover, Margin, SSS</td>
                    <td>Inventory buildup / Margin compression</td>
                    <td>Consumer spending health</td>
                  </tr>
                  <tr>
                    <td><span style={{ fontSize: "1.2rem" }}>🏭</span> Industrial</td>
                    <td>Capacity cycle</td>
                    <td>Capex, Utilization, Backlog, ROIC</td>
                    <td>Over-expansion / Demand downturn</td>
                    <td>Manufacturing cycle indicators</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

// ─── Company Industry Analysis Sub-Component ───
interface CompanyAnalysisProps {
  company: CompanyIndustryRisk;
  allRisks: CompanyIndustryRisk[];
  onSelectCompany: (ticker: string) => void;
}

const CompanyIndustryAnalysis: React.FC<CompanyAnalysisProps> = ({ company, allRisks, onSelectCompany }) => {
  const rl = riskLevelConfig[company.riskLevel];
  const indRule = industryRules[company.industry];

  const radarData = company.keyMetrics.map(m => {
    const normalized = m.direction === "higher_better"
      ? Math.min((m.value / (m.threshold * 2)) * 100, 100)
      : Math.max(100 - (m.value / (m.threshold * 2)) * 100, 0);
    return { metric: m.name.length > 12 ? m.name.substring(0, 12) + "…" : m.name, value: normalized, fullMark: 100 };
  });

  return (
    <div className="ir-content">
      {/* Company Selector */}
      <div className="ir-company-selector">
        {allRisks.map(c => {
          const cl = riskLevelConfig[c.riskLevel];
          return (
            <button key={c.ticker}
              className={`ir-comp-pill ${c.ticker === company.ticker ? "active" : ""}`}
              style={c.ticker === company.ticker ? { borderColor: cl.color, background: cl.bg } : {}}
              onClick={() => onSelectCompany(c.ticker)}>
              <span className="ir-pill-dot" style={{ background: cl.color }}></span>
              {c.ticker}
            </button>
          );
        })}
      </div>

      {/* Company Header */}
      <div className="ir-comp-header" style={{ borderLeftColor: rl.color }}>
        <div className="ir-comp-header-left">
          <h2>{company.company}</h2>
          <span className="ir-comp-ticker">{company.ticker} · {indRule.icon} {company.industryLabel}</span>
        </div>
        <div className="ir-comp-header-scores">
          <div className="ir-score-box">
            <span className="ir-score-label">Base Risk</span>
            <span className="ir-score-val">{company.baseRiskScore}</span>
          </div>
          <span className="ir-score-op">+</span>
          <div className="ir-score-box overlay">
            <span className="ir-score-label">Industry Overlay</span>
            <span className="ir-score-val" style={{ color: "#3b82f6" }}>+{company.industryAdjustment}</span>
          </div>
          <span className="ir-score-op">=</span>
          <div className="ir-score-box final">
            <span className="ir-score-label">Final Score</span>
            <span className="ir-score-val" style={{ color: rl.color, fontSize: "1.5rem" }}>{company.riskScore}</span>
          </div>
          <span className="ir-comp-level-badge" style={{ color: rl.color, background: rl.bg }}>
            {rl.icon} {company.riskLevel.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Summary */}
      <section className="ir-section">
        <div className="ir-summary-box">
          <p>{company.summary}</p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="ir-section">
        <h2>{indRule.icon} Industry-Specific Metrics</h2>
        <div className="ir-metrics-grid">
          {company.keyMetrics.map(m => {
            const statusColor = m.status === "good" ? "#22c55e" : m.status === "warning" ? "#f59e0b" : "#ef4444";
            return (
              <div key={m.name} className="ir-metric-card" style={{ borderTopColor: statusColor }}>
                <div className="ir-mc-header">
                  <span className="ir-mc-name">{m.name}</span>
                  <span className="ir-mc-status" style={{ color: statusColor, background: statusColor + "15" }}>
                    {m.status.toUpperCase()}
                  </span>
                </div>
                <div className="ir-mc-value" style={{ color: statusColor }}>
                  {m.value}{m.unit}
                </div>
                <div className="ir-mc-threshold">
                  Threshold: {m.threshold}{m.unit} ({m.direction === "higher_better" ? "↑ better" : "↓ better"})
                </div>
                <div className="ir-mc-sparkline">
                  <ResponsiveContainer width="100%" height={35}>
                    <LineChart data={m.trend.map((v, i) => ({ i, v }))}>
                      <Line type="monotone" dataKey="v" stroke={statusColor} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                  <span className="ir-mc-trend-label">5-Year Trend</span>
                </div>
                <p className="ir-mc-desc">{m.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Risk Drivers */}
      <section className="ir-section">
        <h2>🔍 Industry-Specific Risk Drivers</h2>
        <div className="ir-drivers-list">
          {[...company.drivers].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)).map((d, i) => (
            <div key={i} className="ir-driver-row">
              <span className={`ir-driver-arrow ${d.impact < 0 ? "negative" : "positive"}`}>
                {d.impact < 0 ? "▼" : "▲"}
              </span>
              <div className="ir-driver-info">
                <span className="ir-driver-factor">{d.factor}</span>
                <span className="ir-driver-desc">{d.description}</span>
              </div>
              <span className="ir-driver-cat" style={{ color: categoryColors[d.category], borderColor: categoryColors[d.category] }}>
                {d.category}
              </span>
              <span className={`ir-driver-impact ${d.impact < 0 ? "negative" : "positive"}`}>
                {d.impact > 0 ? "+" : ""}{d.impact}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Stress Tests */}
      <section className="ir-section">
        <h2>🧪 Stress Test Scenarios</h2>
        <p className="ir-section-desc">
          Sensitivity analysis showing how key metrics respond to adverse scenarios.
        </p>
        <div className="ir-stress-grid">
          {company.stressTests.map((st, i) => {
            const sc = stressStatusConfig[st.status];
            return (
              <div key={i} className="ir-stress-card" style={{ borderLeftColor: sc.color }}>
                <div className="ir-stress-header">
                  <h4>{st.name}</h4>
                  <span className="ir-stress-status" style={{ color: sc.color, background: sc.color + "15" }}>
                    {sc.label}
                  </span>
                </div>
                <p className="ir-stress-desc">{st.description}</p>
                <div className="ir-stress-result">
                  <div className="ir-stress-metric">
                    <span className="ir-stress-label">Impact</span>
                    <span className="ir-stress-val" style={{ color: "#ef4444" }}>{st.impact}%</span>
                  </div>
                  <div className="ir-stress-metric">
                    <span className="ir-stress-label">Result</span>
                    <span className="ir-stress-val">{st.resultingValue}</span>
                  </div>
                  <div className="ir-stress-metric">
                    <span className="ir-stress-label">Threshold</span>
                    <span className="ir-stress-val">{st.threshold}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Radar Chart */}
      <section className="ir-section">
        <h2>🕸️ Metric Health Radar</h2>
        <div className="ir-chart-wrapper" style={{ maxWidth: 500, margin: "0 auto" }}>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              {/* @ts-ignore */}
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 } as any} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 } as any} />
              <Radar name="Health" dataKey="value" stroke={indRule.color} fill={indRule.color} fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default IndustryRiskDashboard;
