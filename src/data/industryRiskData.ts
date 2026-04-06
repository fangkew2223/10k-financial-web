// ═══════════════════════════════════════════════════════════
// Industry-Specific Risk Intelligence — Data Layer
// ═══════════════════════════════════════════════════════════

export type IndustryType = "banking" | "technology" | "retail" | "industrial";

export interface IndustryMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  direction: "higher_better" | "lower_better";
  status: "good" | "warning" | "critical";
  trend: number[]; // last 5 years
  description: string;
}

export interface IndustryDriver {
  factor: string;
  impact: number; // -100 to +100
  category: string;
  description: string;
}

export interface StressScenario {
  name: string;
  description: string;
  impact: number; // percentage impact on key metric
  resultingValue: number;
  threshold: number;
  status: "pass" | "marginal" | "fail";
}

export interface CompanyIndustryRisk {
  ticker: string;
  company: string;
  industry: IndustryType;
  industryLabel: string;
  riskScore: number;
  riskLevel: "low" | "moderate" | "elevated" | "high" | "critical";
  baseRiskScore: number; // from general model
  industryAdjustment: number; // overlay adjustment
  keyMetrics: IndustryMetric[];
  drivers: IndustryDriver[];
  stressTests: StressScenario[];
  summary: string;
  policyRelevance: string;
}

export interface SystemicSignal {
  industry: IndustryType;
  industryLabel: string;
  signal: string;
  severity: "low" | "moderate" | "elevated" | "high";
  affectedCompanies: number;
  totalCompanies: number;
  description: string;
  drivers: string[];
}

// ─── Industry Rules (Feature Engineering) ───
export const industryRules: Record<IndustryType, { label: string; icon: string; color: string; keyMetrics: string[]; riskLogic: string }> = {
  banking: {
    label: "Banking & Financial Services",
    icon: "🏦",
    color: "#1e40af",
    keyMetrics: ["CET1 Ratio", "Tier 1 Capital", "RWA", "Leverage Ratio", "NPL Ratio", "Net Interest Margin"],
    riskLogic: "Capital inadequacy / Systemic risk / Credit quality deterioration",
  },
  technology: {
    label: "Technology",
    icon: "💻",
    color: "#7c3aed",
    keyMetrics: ["R&D / Revenue", "SBC / Revenue", "Gross Margin", "Revenue Growth", "Deferred Revenue Growth", "FCF Margin"],
    riskLogic: "Growth quality / Valuation bubble / SBC dilution / AI spend sustainability",
  },
  retail: {
    label: "Retail & Consumer",
    icon: "🛍️",
    color: "#059669",
    keyMetrics: ["Inventory Turnover", "Gross Margin", "Same-Store Sales", "Working Capital Ratio", "Markdown Rate", "DSO"],
    riskLogic: "Inventory-demand mismatch / Margin compression / Working capital pressure",
  },
  industrial: {
    label: "Industrial & Manufacturing",
    icon: "🏭",
    color: "#b45309",
    keyMetrics: ["Capex / Revenue", "Capacity Utilization", "Backlog Growth", "Asset Turnover", "ROIC", "Supply Chain Concentration"],
    riskLogic: "Capacity cycle risk / Over-expansion / Demand downturn / Supply chain fragility",
  },
};

// ─── Company Industry Risk Data ───
const companyIndustryRisks: CompanyIndustryRisk[] = [
  // ═══ BANKING & FINANCIAL SERVICES ═══
  {
    ticker: "GS",
    company: "Goldman Sachs Group, Inc.",
    industry: "banking",
    industryLabel: "Banking & Financial Services",
    riskScore: 42,
    riskLevel: "moderate",
    baseRiskScore: 38,
    industryAdjustment: 4,
    keyMetrics: [
      { name: "CET1 Ratio", value: 14.8, unit: "%", threshold: 10.5, direction: "higher_better", status: "good", trend: [13.2, 13.5, 14.0, 14.5, 14.8], description: "Well above regulatory minimum — strong capital buffer" },
      { name: "Tier 1 Capital", value: 16.2, unit: "%", threshold: 12, direction: "higher_better", status: "good", trend: [14.8, 15.2, 15.5, 15.9, 16.2], description: "Robust Tier 1 capital position" },
      { name: "Leverage Ratio", value: 5.8, unit: "%", threshold: 5, direction: "higher_better", status: "good", trend: [5.2, 5.4, 5.5, 5.6, 5.8], description: "Above supplementary leverage ratio requirement" },
      { name: "NPL Ratio", value: 1.2, unit: "%", threshold: 2, direction: "lower_better", status: "good", trend: [0.8, 0.9, 1.0, 1.1, 1.2], description: "Non-performing loans rising but within healthy range" },
      { name: "Net Interest Margin", value: 1.15, unit: "%", threshold: 1.0, direction: "higher_better", status: "good", trend: [0.85, 0.92, 1.05, 1.12, 1.15], description: "NIM improved with higher rate environment" },
      { name: "Efficiency Ratio", value: 64.5, unit: "%", threshold: 65, direction: "lower_better", status: "good", trend: [68.0, 66.5, 65.0, 64.8, 64.5], description: "Operating efficiency improving — below 65% target" },
    ],
    drivers: [
      { factor: "Trading revenue volatility", impact: -30, category: "market", description: "FICC and equities trading revenue highly cyclical and unpredictable" },
      { factor: "Basel III endgame capital requirements", impact: -20, category: "regulatory", description: "Potential increase in risk-weighted assets may require more capital" },
      { factor: "AWM growth providing stability", impact: 25, category: "growth", description: "Asset & Wealth Management segment growing with more predictable fees" },
      { factor: "Consumer banking exit reducing drag", impact: 15, category: "operational", description: "Marcus wind-down removing unprofitable consumer lending exposure" },
    ],
    stressTests: [
      { name: "Market Stress -30%", description: "If equity markets drop 30%", impact: -2.5, resultingValue: 12.3, threshold: 10.5, status: "pass" },
      { name: "Credit Losses +200%", description: "If credit losses double", impact: -1.8, resultingValue: 13.0, threshold: 10.5, status: "pass" },
      { name: "Trading Revenue -40%", description: "If trading revenue drops 40%", impact: -3.0, resultingValue: 11.8, threshold: 10.5, status: "pass" },
    ],
    summary: "Goldman Sachs maintains strong capital ratios well above regulatory minimums. Primary risks are trading revenue cyclicality and potential Basel III endgame capital requirements. AWM growth is providing more stable revenue diversification.",
    policyRelevance: "Demonstrates how banking-specific capital adequacy metrics (CET1, leverage ratio) provide systemic risk signals invisible to generic profitability analysis.",
  },
  {
    ticker: "MS",
    company: "Morgan Stanley",
    industry: "banking",
    industryLabel: "Banking & Financial Services",
    riskScore: 35,
    riskLevel: "moderate",
    baseRiskScore: 30,
    industryAdjustment: 5,
    keyMetrics: [
      { name: "CET1 Ratio", value: 15.3, unit: "%", threshold: 10.5, direction: "higher_better", status: "good", trend: [13.8, 14.2, 14.6, 15.0, 15.3], description: "Strong capital position — well above requirements" },
      { name: "Tier 1 Capital", value: 17.1, unit: "%", threshold: 12, direction: "higher_better", status: "good", trend: [15.5, 16.0, 16.4, 16.8, 17.1], description: "Excellent Tier 1 capital ratio" },
      { name: "Leverage Ratio", value: 6.2, unit: "%", threshold: 5, direction: "higher_better", status: "good", trend: [5.5, 5.7, 5.9, 6.0, 6.2], description: "Comfortable leverage position" },
      { name: "NPL Ratio", value: 0.9, unit: "%", threshold: 2, direction: "lower_better", status: "good", trend: [0.6, 0.7, 0.8, 0.85, 0.9], description: "Low NPL ratio — wealth management focus reduces credit risk" },
      { name: "Net Interest Margin", value: 1.85, unit: "%", threshold: 1.0, direction: "higher_better", status: "good", trend: [1.20, 1.45, 1.65, 1.78, 1.85], description: "NIM benefiting from wealth management deposits" },
      { name: "Efficiency Ratio", value: 72.5, unit: "%", threshold: 65, direction: "lower_better", status: "warning", trend: [74.0, 73.5, 73.0, 72.8, 72.5], description: "Above target — wealth management comp ratio keeps efficiency elevated" },
    ],
    drivers: [
      { factor: "Wealth management stability", impact: 35, category: "quality", description: "~50% of revenue from wealth management with predictable fee-based income" },
      { factor: "E*TRADE integration synergies", impact: 15, category: "operational", description: "Self-directed channel driving lower-cost client acquisition and deposit growth" },
      { factor: "Efficiency ratio above target", impact: -15, category: "operational", description: "72.5% efficiency ratio above 65% industry target due to high compensation" },
      { factor: "Rate sensitivity in wealth management", impact: -20, category: "market", description: "NII may decline as interest rates normalize, compressing wealth management margins" },
    ],
    stressTests: [
      { name: "Market Stress -30%", description: "If equity markets drop 30%", impact: -2.0, resultingValue: 13.3, threshold: 10.5, status: "pass" },
      { name: "AUM Outflows -15%", description: "If client assets decline 15%", impact: -1.5, resultingValue: 13.8, threshold: 10.5, status: "pass" },
      { name: "Rate Cuts -200bps", description: "If rates drop 200 basis points", impact: -0.8, resultingValue: 14.5, threshold: 10.5, status: "pass" },
    ],
    summary: "Morgan Stanley's wealth management-heavy model provides lower risk than pure investment banks. Strong capital ratios and diversified revenue, though efficiency ratio remains above target due to high compensation costs.",
    policyRelevance: "Illustrates how wealth management-focused banks carry different risk profiles than trading-heavy peers — requiring decomposed analysis of revenue quality.",
  },
  // ═══ TECHNOLOGY ═══
  {
    ticker: "AAPL",
    company: "Apple Inc.",
    industry: "technology",
    industryLabel: "Technology",
    riskScore: 25,
    riskLevel: "low",
    baseRiskScore: 22,
    industryAdjustment: 3,
    keyMetrics: [
      { name: "R&D / Revenue", value: 7.8, unit: "%", threshold: 15, direction: "lower_better", status: "good", trend: [6.2, 6.5, 6.8, 7.2, 7.8], description: "R&D spending as % of revenue — efficient innovation" },
      { name: "SBC / Revenue", value: 3.2, unit: "%", threshold: 8, direction: "lower_better", status: "good", trend: [2.5, 2.8, 3.0, 3.1, 3.2], description: "Stock-based compensation dilution — well controlled" },
      { name: "Gross Margin", value: 45.5, unit: "%", threshold: 35, direction: "higher_better", status: "good", trend: [43.0, 43.5, 44.0, 44.8, 45.5], description: "Hardware + services mix driving margin expansion" },
      { name: "Revenue Growth", value: 5.8, unit: "%", threshold: 5, direction: "higher_better", status: "good", trend: [8.2, 6.5, -2.8, 3.5, 5.8], description: "Moderate growth — iPhone cycle dependent" },
      { name: "Deferred Revenue Growth", value: 12.5, unit: "%", threshold: 0, direction: "higher_better", status: "good", trend: [8.0, 10.2, 11.0, 11.8, 12.5], description: "Services backlog growing — positive forward indicator" },
      { name: "FCF Margin", value: 28.3, unit: "%", threshold: 15, direction: "higher_better", status: "good", trend: [25.0, 26.5, 27.0, 27.8, 28.3], description: "Exceptional cash generation" },
    ],
    drivers: [
      { factor: "Services revenue mix increasing", impact: 15, category: "growth", description: "Higher-margin services now 25% of revenue" },
      { factor: "iPhone cycle maturity", impact: -12, category: "growth", description: "Smartphone market saturation limits hardware upside" },
      { factor: "SBC well controlled", impact: 10, category: "quality", description: "Minimal shareholder dilution vs peers" },
    ],
    stressTests: [
      { name: "Revenue -10%", description: "If iPhone sales drop 10%", impact: -10, resultingValue: 42.0, threshold: 35, status: "pass" },
      { name: "China Risk", description: "If China revenue drops 30%", impact: -6, resultingValue: 39.5, threshold: 35, status: "pass" },
      { name: "Services Slowdown", description: "If services growth halves", impact: -3, resultingValue: 43.0, threshold: 35, status: "pass" },
    ],
    summary: "Apple maintains best-in-class financial quality among tech peers. Low SBC dilution, expanding services mix, and exceptional FCF generation. Primary risk is iPhone cycle dependency.",
    policyRelevance: "Demonstrates how sector-specific quality metrics (SBC ratio, deferred revenue) provide deeper insight than generic profitability measures.",
  },
  {
    ticker: "NVDA",
    company: "NVIDIA Corporation",
    industry: "technology",
    industryLabel: "Technology",
    riskScore: 48,
    riskLevel: "moderate",
    baseRiskScore: 42,
    industryAdjustment: 6,
    keyMetrics: [
      { name: "R&D / Revenue", value: 15.2, unit: "%", threshold: 15, direction: "lower_better", status: "warning", trend: [20.5, 18.0, 16.5, 15.8, 15.2], description: "R&D ratio declining as revenue scales — but absolute spend surging" },
      { name: "SBC / Revenue", value: 8.5, unit: "%", threshold: 8, direction: "lower_better", status: "warning", trend: [6.0, 7.2, 8.0, 8.3, 8.5], description: "SBC rising — significant shareholder dilution concern" },
      { name: "Gross Margin", value: 72.8, unit: "%", threshold: 60, direction: "higher_better", status: "good", trend: [65.0, 64.5, 66.0, 70.0, 72.8], description: "Exceptional margins driven by AI GPU pricing power" },
      { name: "Revenue Growth", value: 122.0, unit: "%", threshold: 5, direction: "higher_better", status: "good", trend: [52.0, 0.2, -17.0, 126.0, 122.0], description: "Explosive AI-driven growth — sustainability is the question" },
      { name: "Deferred Revenue Growth", value: 85.0, unit: "%", threshold: 0, direction: "higher_better", status: "good", trend: [15.0, -5.0, 20.0, 95.0, 85.0], description: "Strong forward demand visibility" },
      { name: "FCF Margin", value: 52.0, unit: "%", threshold: 15, direction: "higher_better", status: "good", trend: [28.0, 15.0, 8.0, 45.0, 52.0], description: "Massive cash generation from AI boom" },
    ],
    drivers: [
      { factor: "AI infrastructure spending sustainability", impact: -35, category: "growth", description: "Hyperscaler capex may plateau — key risk to growth trajectory" },
      { factor: "SBC dilution accelerating", impact: -25, category: "quality", description: "8.5% SBC/revenue is above healthy threshold" },
      { factor: "Gross margin at risk from competition", impact: -15, category: "market", description: "AMD, custom ASICs may pressure GPU pricing" },
      { factor: "Exceptional current demand", impact: 30, category: "growth", description: "Data center revenue at record levels" },
    ],
    stressTests: [
      { name: "AI Spend -20%", description: "If hyperscaler AI capex drops 20%", impact: -25, resultingValue: 55.0, threshold: 60, status: "marginal" },
      { name: "Margin Compression", description: "If competition drives margins down 10pp", impact: -10, resultingValue: 62.8, threshold: 60, status: "pass" },
      { name: "China Export Ban", description: "If China revenue goes to zero", impact: -15, resultingValue: 62.0, threshold: 60, status: "pass" },
    ],
    summary: "NVIDIA's financials are exceptional but carry elevated tech-specific risks: high SBC dilution, AI spend sustainability questions, and extreme growth rate that may decelerate. Industry overlay adds +6 to base risk.",
    policyRelevance: "Illustrates how tech-specific metrics (SBC ratio, growth quality) reveal risks invisible to generic financial analysis.",
  },
  {
    ticker: "META",
    company: "Meta Platforms, Inc.",
    industry: "technology",
    industryLabel: "Technology",
    riskScore: 52,
    riskLevel: "elevated",
    baseRiskScore: 45,
    industryAdjustment: 7,
    keyMetrics: [
      { name: "R&D / Revenue", value: 28.5, unit: "%", threshold: 15, direction: "lower_better", status: "critical", trend: [18.0, 22.0, 25.0, 30.0, 28.5], description: "Very high R&D — Reality Labs consuming significant resources" },
      { name: "SBC / Revenue", value: 12.0, unit: "%", threshold: 8, direction: "lower_better", status: "critical", trend: [8.5, 10.0, 13.5, 14.0, 12.0], description: "High SBC dilution — above industry threshold" },
      { name: "Gross Margin", value: 80.5, unit: "%", threshold: 60, direction: "higher_better", status: "good", trend: [80.0, 78.5, 79.0, 80.0, 80.5], description: "Ad business maintains exceptional margins" },
      { name: "Revenue Growth", value: 22.0, unit: "%", threshold: 5, direction: "higher_better", status: "good", trend: [37.0, 7.0, -1.0, 16.0, 22.0], description: "Strong ad revenue recovery" },
      { name: "Deferred Revenue Growth", value: 8.0, unit: "%", threshold: 0, direction: "higher_better", status: "good", trend: [5.0, 3.0, -2.0, 6.0, 8.0], description: "Moderate forward visibility" },
      { name: "FCF Margin", value: 25.0, unit: "%", threshold: 15, direction: "higher_better", status: "good", trend: [30.0, 18.0, 12.0, 20.0, 25.0], description: "Recovering but Reality Labs drag persists" },
    ],
    drivers: [
      { factor: "Reality Labs losses widening", impact: -40, category: "operational", description: "Reality Labs lost $16B+ annually with unclear ROI timeline" },
      { factor: "SBC above healthy threshold", impact: -20, category: "quality", description: "12% SBC/revenue significantly dilutes shareholders" },
      { factor: "Core ad business strong", impact: 25, category: "growth", description: "Family of Apps revenue growing 20%+ with improving margins" },
      { factor: "AI monetization potential", impact: 15, category: "growth", description: "AI-driven ad targeting improvements boosting ARPU" },
    ],
    stressTests: [
      { name: "Ad Revenue -15%", description: "If digital ad market contracts", impact: -15, resultingValue: 68.5, threshold: 60, status: "pass" },
      { name: "Reality Labs +50% Loss", description: "If metaverse losses accelerate", impact: -8, resultingValue: 17.0, threshold: 15, status: "marginal" },
      { name: "Regulatory Impact", description: "If EU/US regulation limits data usage", impact: -12, resultingValue: 70.5, threshold: 60, status: "pass" },
    ],
    summary: "Meta's core ad business is strong, but tech-specific analysis reveals elevated risk from Reality Labs cash burn, high SBC dilution, and R&D intensity well above peers. Industry overlay adds +7 to base risk.",
    policyRelevance: "Demonstrates how R&D efficiency and SBC analysis differentiate between 'profitable growth' and 'growth with hidden costs'.",
  },
  {
    ticker: "MSFT",
    company: "Microsoft Corporation",
    industry: "technology",
    industryLabel: "Technology",
    riskScore: 20,
    riskLevel: "low",
    baseRiskScore: 18,
    industryAdjustment: 2,
    keyMetrics: [
      { name: "R&D / Revenue", value: 12.5, unit: "%", threshold: 15, direction: "lower_better", status: "good", trend: [13.5, 13.0, 12.8, 12.6, 12.5], description: "Efficient R&D spend with strong output" },
      { name: "SBC / Revenue", value: 5.8, unit: "%", threshold: 8, direction: "lower_better", status: "good", trend: [4.5, 5.0, 5.2, 5.5, 5.8], description: "Moderate SBC — within healthy range" },
      { name: "Gross Margin", value: 69.5, unit: "%", threshold: 60, direction: "higher_better", status: "good", trend: [67.0, 68.0, 68.5, 69.0, 69.5], description: "Cloud mix shift driving steady margin expansion" },
      { name: "Revenue Growth", value: 16.0, unit: "%", threshold: 5, direction: "higher_better", status: "good", trend: [18.0, 12.0, 7.0, 16.0, 16.0], description: "Consistent double-digit growth" },
      { name: "Deferred Revenue Growth", value: 18.0, unit: "%", threshold: 0, direction: "higher_better", status: "good", trend: [12.0, 14.0, 15.0, 16.5, 18.0], description: "Strong enterprise contract backlog" },
      { name: "FCF Margin", value: 35.0, unit: "%", threshold: 15, direction: "higher_better", status: "good", trend: [32.0, 33.0, 33.5, 34.0, 35.0], description: "Best-in-class cash generation" },
    ],
    drivers: [
      { factor: "Azure growth re-accelerating", impact: 20, category: "growth", description: "Cloud revenue growing 30%+ driven by AI workloads" },
      { factor: "Diversified revenue streams", impact: 15, category: "quality", description: "Office, Azure, Gaming, LinkedIn — no single dependency" },
      { factor: "AI capex increasing", impact: -10, category: "operational", description: "Data center buildout may pressure FCF near-term" },
    ],
    stressTests: [
      { name: "Cloud Slowdown", description: "If Azure growth halves", impact: -8, resultingValue: 64.0, threshold: 60, status: "pass" },
      { name: "Enterprise Recession", description: "If enterprise IT spend drops 15%", impact: -12, resultingValue: 61.0, threshold: 60, status: "pass" },
      { name: "AI ROI Disappointment", description: "If AI monetization underperforms", impact: -5, resultingValue: 66.0, threshold: 60, status: "pass" },
    ],
    summary: "Microsoft is the gold standard for tech quality — diversified, efficient R&D, controlled SBC, and expanding margins. Minimal industry-specific risk adjustment needed.",
    policyRelevance: "Benchmark for what 'healthy tech growth' looks like across all sector-specific metrics.",
  },
  // ═══ RETAIL ═══
  {
    ticker: "COST",
    company: "Costco Wholesale Corporation",
    industry: "retail",
    industryLabel: "Retail & Consumer",
    riskScore: 18,
    riskLevel: "low",
    baseRiskScore: 15,
    industryAdjustment: 3,
    keyMetrics: [
      { name: "Inventory Turnover", value: 12.5, unit: "x", threshold: 8, direction: "higher_better", status: "good", trend: [11.8, 12.0, 12.2, 12.3, 12.5], description: "Industry-leading inventory efficiency" },
      { name: "Gross Margin", value: 12.8, unit: "%", threshold: 10, direction: "higher_better", status: "good", trend: [12.5, 12.6, 12.7, 12.7, 12.8], description: "Stable low-margin, high-volume model" },
      { name: "Same-Store Sales", value: 5.2, unit: "%", threshold: 2, direction: "higher_better", status: "good", trend: [6.0, 8.5, 5.0, 4.8, 5.2], description: "Consistent comp growth" },
      { name: "Working Capital Ratio", value: 0.95, unit: "x", threshold: 1.0, direction: "higher_better", status: "warning", trend: [1.02, 1.00, 0.98, 0.96, 0.95], description: "Slightly below 1.0 — typical for membership model" },
      { name: "Membership Renewal", value: 92.8, unit: "%", threshold: 85, direction: "higher_better", status: "good", trend: [91.0, 91.5, 92.0, 92.5, 92.8], description: "Exceptional customer loyalty" },
      { name: "DSO", value: 4.2, unit: "days", threshold: 10, direction: "lower_better", status: "good", trend: [4.5, 4.4, 4.3, 4.2, 4.2], description: "Near-zero receivables — cash business" },
    ],
    drivers: [
      { factor: "Membership model provides stability", impact: 20, category: "quality", description: "92.8% renewal rate = predictable revenue base" },
      { factor: "Inventory efficiency best-in-class", impact: 15, category: "operational", description: "12.5x turnover minimizes markdown risk" },
      { factor: "Low margin leaves little buffer", impact: -10, category: "financial", description: "12.8% gross margin means small errors have outsized impact" },
    ],
    stressTests: [
      { name: "Consumer Recession", description: "If consumer spending drops 10%", impact: -5, resultingValue: 11.5, threshold: 10, status: "pass" },
      { name: "Inventory Buildup", description: "If turnover drops to 10x", impact: -8, resultingValue: 10.0, threshold: 8, status: "pass" },
      { name: "Membership Decline", description: "If renewal drops to 88%", impact: -12, resultingValue: 88.0, threshold: 85, status: "pass" },
    ],
    summary: "Costco's membership model and inventory efficiency make it the lowest-risk retailer. Industry overlay confirms minimal inventory-demand mismatch risk.",
    policyRelevance: "Demonstrates how retail-specific metrics (inventory turnover, membership renewal) provide risk signals invisible to generic P&L analysis.",
  },
  {
    ticker: "AMZN",
    company: "Amazon.com, Inc.",
    industry: "retail",
    industryLabel: "Retail & Consumer",
    riskScore: 35,
    riskLevel: "moderate",
    baseRiskScore: 28,
    industryAdjustment: 7,
    keyMetrics: [
      { name: "Inventory Turnover", value: 8.8, unit: "x", threshold: 8, direction: "higher_better", status: "good", trend: [9.5, 9.0, 8.5, 8.6, 8.8], description: "Adequate but declining from peak efficiency" },
      { name: "Gross Margin", value: 47.5, unit: "%", threshold: 30, direction: "higher_better", status: "good", trend: [40.0, 42.0, 44.0, 46.0, 47.5], description: "AWS + ads mix driving margin expansion" },
      { name: "Same-Store Sales", value: 8.5, unit: "%", threshold: 2, direction: "higher_better", status: "good", trend: [15.0, 22.0, 2.0, 5.0, 8.5], description: "E-commerce growth normalizing post-COVID" },
      { name: "Working Capital Ratio", value: 1.05, unit: "x", threshold: 1.0, direction: "higher_better", status: "good", trend: [1.10, 1.08, 1.02, 1.03, 1.05], description: "Healthy working capital position" },
      { name: "Fulfillment Cost / Revenue", value: 15.2, unit: "%", threshold: 18, direction: "lower_better", status: "good", trend: [16.5, 17.0, 16.8, 15.8, 15.2], description: "Fulfillment efficiency improving" },
      { name: "DSO", value: 22.0, unit: "days", threshold: 30, direction: "lower_better", status: "good", trend: [25.0, 24.0, 23.0, 22.5, 22.0], description: "Healthy receivables management" },
    ],
    drivers: [
      { factor: "AWS subsidizes retail risk", impact: 20, category: "quality", description: "Cloud profits buffer retail margin volatility" },
      { factor: "Inventory efficiency declining", impact: -15, category: "operational", description: "Turnover down from 9.5x to 8.8x over 5 years" },
      { factor: "Capex intensity high", impact: -20, category: "financial", description: "Massive fulfillment + data center investment" },
      { factor: "Ad revenue high-margin growth", impact: 15, category: "growth", description: "Advertising becoming significant profit contributor" },
    ],
    stressTests: [
      { name: "E-Commerce -15%", description: "If online retail revenue drops 15%", impact: -8, resultingValue: 43.5, threshold: 30, status: "pass" },
      { name: "Inventory Glut", description: "If turnover drops to 7x", impact: -15, resultingValue: 7.0, threshold: 8, status: "marginal" },
      { name: "AWS Slowdown", description: "If AWS growth halves", impact: -10, resultingValue: 42.5, threshold: 30, status: "pass" },
    ],
    summary: "Amazon's retail operations carry moderate industry-specific risk from declining inventory efficiency and high capex, but AWS and advertising provide strong profit buffers.",
    policyRelevance: "Shows how conglomerate retailers require decomposed analysis — retail metrics alone miss the AWS profit subsidy effect.",
  },
  // ═══ INDUSTRIAL ═══
  {
    ticker: "AVGO",
    company: "Broadcom Inc.",
    industry: "industrial",
    industryLabel: "Industrial & Manufacturing",
    riskScore: 38,
    riskLevel: "moderate",
    baseRiskScore: 32,
    industryAdjustment: 6,
    keyMetrics: [
      { name: "Capex / Revenue", value: 3.2, unit: "%", threshold: 8, direction: "lower_better", status: "good", trend: [2.8, 3.0, 3.1, 3.2, 3.2], description: "Asset-light semiconductor model" },
      { name: "Capacity Utilization", value: 82.0, unit: "%", threshold: 70, direction: "higher_better", status: "good", trend: [78.0, 80.0, 85.0, 83.0, 82.0], description: "Healthy utilization without overextension" },
      { name: "Backlog Growth", value: -5.0, unit: "%", threshold: 0, direction: "higher_better", status: "warning", trend: [25.0, 40.0, 15.0, 5.0, -5.0], description: "Backlog normalizing after COVID surge" },
      { name: "Asset Turnover", value: 0.35, unit: "x", threshold: 0.3, direction: "higher_better", status: "good", trend: [0.45, 0.40, 0.38, 0.36, 0.35], description: "Declining due to VMware acquisition goodwill" },
      { name: "ROIC", value: 15.5, unit: "%", threshold: 10, direction: "higher_better", status: "good", trend: [18.0, 16.5, 15.0, 14.5, 15.5], description: "Strong returns on invested capital" },
      { name: "Customer Concentration", value: 35.0, unit: "%", threshold: 25, direction: "lower_better", status: "warning", trend: [30.0, 32.0, 33.0, 34.0, 35.0], description: "Top customer (Apple) represents 35% of revenue" },
    ],
    drivers: [
      { factor: "Customer concentration risk", impact: -25, category: "market", description: "35% revenue from single customer creates dependency" },
      { factor: "Backlog declining", impact: -15, category: "operational", description: "Order normalization signals potential demand softening" },
      { factor: "VMware integration execution", impact: -10, category: "operational", description: "Large acquisition integration carries execution risk" },
      { factor: "AI networking demand", impact: 20, category: "growth", description: "Custom AI accelerators and networking chips in high demand" },
    ],
    stressTests: [
      { name: "Apple Revenue -30%", description: "If Apple orders drop 30%", impact: -10, resultingValue: 0.31, threshold: 0.3, status: "marginal" },
      { name: "Semiconductor Downturn", description: "If industry-wide demand drops 20%", impact: -18, resultingValue: 67.0, threshold: 70, status: "marginal" },
      { name: "VMware Churn", description: "If VMware loses 15% of subscribers", impact: -5, resultingValue: 14.7, threshold: 10, status: "pass" },
    ],
    summary: "Broadcom's asset-light model limits traditional industrial risk, but customer concentration and backlog normalization warrant monitoring. VMware integration adds near-term execution risk.",
    policyRelevance: "Illustrates how industrial metrics (backlog, capacity utilization, customer concentration) reveal supply chain and demand cycle risks.",
  },
  // ═══ COMMUNICATION / TECH-ADJACENT ═══
  {
    ticker: "GOOGL",
    company: "Alphabet Inc.",
    industry: "technology",
    industryLabel: "Technology",
    riskScore: 30,
    riskLevel: "moderate",
    baseRiskScore: 25,
    industryAdjustment: 5,
    keyMetrics: [
      { name: "R&D / Revenue", value: 14.0, unit: "%", threshold: 15, direction: "lower_better", status: "good", trend: [15.5, 15.0, 14.5, 14.2, 14.0], description: "R&D efficiency improving" },
      { name: "SBC / Revenue", value: 9.5, unit: "%", threshold: 8, direction: "lower_better", status: "warning", trend: [7.5, 8.0, 8.5, 9.0, 9.5], description: "SBC trending above healthy threshold" },
      { name: "Gross Margin", value: 57.0, unit: "%", threshold: 50, direction: "higher_better", status: "good", trend: [55.0, 55.5, 56.0, 56.5, 57.0], description: "Stable margins with cloud mix improving" },
      { name: "Revenue Growth", value: 14.0, unit: "%", threshold: 5, direction: "higher_better", status: "good", trend: [23.0, 13.0, 3.0, 9.0, 14.0], description: "Healthy growth recovery" },
      { name: "Deferred Revenue Growth", value: 15.0, unit: "%", threshold: 0, direction: "higher_better", status: "good", trend: [10.0, 12.0, 13.0, 14.0, 15.0], description: "Cloud contracts building backlog" },
      { name: "FCF Margin", value: 28.0, unit: "%", threshold: 15, direction: "higher_better", status: "good", trend: [25.0, 22.0, 20.0, 25.0, 28.0], description: "Strong cash generation" },
    ],
    drivers: [
      { factor: "SBC dilution above threshold", impact: -20, category: "quality", description: "9.5% SBC/revenue is above the 8% healthy threshold" },
      { factor: "AI search disruption risk", impact: -15, category: "market", description: "Generative AI may disrupt core search ad model" },
      { factor: "Cloud growth accelerating", impact: 18, category: "growth", description: "Google Cloud reaching profitability inflection" },
      { factor: "Regulatory overhang", impact: -10, category: "market", description: "DOJ antitrust case creates uncertainty" },
    ],
    stressTests: [
      { name: "Ad Revenue -15%", description: "If search ad revenue drops 15%", impact: -12, resultingValue: 50.0, threshold: 50, status: "marginal" },
      { name: "AI Disruption", description: "If AI search reduces ad clicks 20%", impact: -15, resultingValue: 48.5, threshold: 50, status: "fail" },
      { name: "Regulatory Fine", description: "If $10B+ antitrust penalty", impact: -3, resultingValue: 55.0, threshold: 50, status: "pass" },
    ],
    summary: "Alphabet has strong fundamentals but faces tech-specific risks from rising SBC, AI disruption to search, and regulatory pressure. Industry overlay adds +5 for SBC and competitive risks.",
    policyRelevance: "Demonstrates how AI disruption risk requires sector-specific analysis beyond traditional financial metrics.",
  },
  {
    ticker: "TSLA",
    company: "Tesla, Inc.",
    industry: "industrial",
    industryLabel: "Industrial & Manufacturing",
    riskScore: 82,
    riskLevel: "critical",
    baseRiskScore: 78,
    industryAdjustment: 4,
    keyMetrics: [
      { name: "Capex / Revenue", value: 9.5, unit: "%", threshold: 8, direction: "lower_better", status: "warning", trend: [7.0, 8.0, 8.5, 9.0, 9.5], description: "Rising capex for new factories and AI infrastructure" },
      { name: "Capacity Utilization", value: 68.0, unit: "%", threshold: 70, direction: "higher_better", status: "warning", trend: [85.0, 80.0, 75.0, 72.0, 68.0], description: "Declining utilization signals demand weakness" },
      { name: "Backlog Growth", value: -25.0, unit: "%", threshold: 0, direction: "higher_better", status: "critical", trend: [50.0, 30.0, 10.0, -10.0, -25.0], description: "Order backlog shrinking significantly" },
      { name: "Asset Turnover", value: 0.85, unit: "x", threshold: 0.7, direction: "higher_better", status: "good", trend: [1.10, 1.05, 0.95, 0.90, 0.85], description: "Declining as capacity outpaces demand" },
      { name: "ROIC", value: 8.5, unit: "%", threshold: 10, direction: "higher_better", status: "warning", trend: [18.0, 15.0, 12.0, 10.0, 8.5], description: "Returns declining as margins compress" },
      { name: "Customer Concentration", value: 5.0, unit: "%", threshold: 25, direction: "lower_better", status: "good", trend: [5.0, 5.0, 5.0, 5.0, 5.0], description: "Diversified consumer base" },
    ],
    drivers: [
      { factor: "Capacity utilization declining", impact: -40, category: "operational", description: "68% utilization with new factories coming online = overcapacity risk" },
      { factor: "Backlog shrinking rapidly", impact: -35, category: "market", description: "Order backlog down 25% — demand weakness confirmed" },
      { factor: "ROIC below cost of capital", impact: -20, category: "financial", description: "8.5% ROIC approaching WACC — value destruction risk" },
      { factor: "EV market competition intensifying", impact: -25, category: "market", description: "BYD, legacy OEMs gaining share" },
    ],
    stressTests: [
      { name: "Volume -20%", description: "If deliveries drop 20%", impact: -20, resultingValue: 54.0, threshold: 70, status: "fail" },
      { name: "Price War", description: "If ASP drops 15%", impact: -15, resultingValue: 5.5, threshold: 10, status: "fail" },
      { name: "Capex Freeze", description: "If new factory plans delayed", impact: 5, resultingValue: 7.0, threshold: 8, status: "marginal" },
    ],
    summary: "Tesla shows critical industrial risk signals: declining capacity utilization, shrinking backlog, and ROIC approaching cost of capital. The manufacturing overlay confirms overcapacity and demand-supply mismatch.",
    policyRelevance: "Classic example of how industrial metrics (capacity utilization, backlog) detect manufacturing cycle risk before it appears in earnings.",
  },
  {
    ticker: "NFLX",
    company: "Netflix, Inc.",
    industry: "technology",
    industryLabel: "Technology",
    riskScore: 42,
    riskLevel: "moderate",
    baseRiskScore: 38,
    industryAdjustment: 4,
    keyMetrics: [
      { name: "R&D / Revenue", value: 8.0, unit: "%", threshold: 15, direction: "lower_better", status: "good", trend: [10.0, 9.5, 9.0, 8.5, 8.0], description: "Efficient tech spend" },
      { name: "SBC / Revenue", value: 3.5, unit: "%", threshold: 8, direction: "lower_better", status: "good", trend: [4.0, 3.8, 3.6, 3.5, 3.5], description: "Well-controlled dilution" },
      { name: "Gross Margin", value: 45.0, unit: "%", threshold: 35, direction: "higher_better", status: "good", trend: [38.0, 40.0, 42.0, 43.5, 45.0], description: "Improving as content amortization stabilizes" },
      { name: "Revenue Growth", value: 14.2, unit: "%", threshold: 5, direction: "higher_better", status: "good", trend: [24.0, 19.0, 6.5, 8.0, 14.2], description: "Growth re-accelerating with ad tier" },
      { name: "Deferred Revenue Growth", value: 5.0, unit: "%", threshold: 0, direction: "higher_better", status: "good", trend: [3.0, 2.0, 1.0, 3.0, 5.0], description: "Modest forward visibility" },
      { name: "FCF Margin", value: 22.0, unit: "%", threshold: 15, direction: "higher_better", status: "good", trend: [-5.0, 5.0, 10.0, 18.0, 22.0], description: "FCF transformation — from negative to strong positive" },
    ],
    drivers: [
      { factor: "Content cost sustainability", impact: -20, category: "operational", description: "Content spend must keep growing to retain subscribers" },
      { factor: "Subscriber saturation in developed markets", impact: -15, category: "growth", description: "US/EU penetration nearing ceiling" },
      { factor: "Ad tier monetization", impact: 18, category: "growth", description: "New revenue stream with high incremental margins" },
      { factor: "FCF improvement trajectory", impact: 15, category: "quality", description: "Cash flow positive and improving" },
    ],
    stressTests: [
      { name: "Subscriber Loss -10%", description: "If 10% of subscribers churn", impact: -12, resultingValue: 39.5, threshold: 35, status: "pass" },
      { name: "Content Cost +25%", description: "If content spend increases 25%", impact: -8, resultingValue: 41.5, threshold: 35, status: "pass" },
      { name: "Competition Intensifies", description: "If Disney+/Apple TV+ gain significant share", impact: -10, resultingValue: 40.5, threshold: 35, status: "pass" },
    ],
    summary: "Netflix shows moderate tech risk — content cost sustainability and subscriber saturation are key concerns, but improving FCF and ad tier launch provide positive offsets.",
    policyRelevance: "Illustrates how content-driven tech companies require different quality metrics than SaaS or hardware companies.",
  },
];

// ─── Systemic Signals ───
const systemicSignals: SystemicSignal[] = [
  {
    industry: "technology",
    industryLabel: "Technology",
    signal: "SBC dilution above healthy threshold across 40% of tech companies",
    severity: "elevated",
    affectedCompanies: 3,
    totalCompanies: 6,
    description: "Stock-based compensation exceeds 8% of revenue for META (12%), GOOGL (9.5%), and NVDA (8.5%), indicating sector-wide shareholder dilution trend.",
    drivers: ["Talent competition driving SBC inflation", "AI talent premium", "RSU-heavy compensation structures"],
  },
  {
    industry: "industrial",
    industryLabel: "Industrial & Manufacturing",
    signal: "Capacity utilization declining in EV manufacturing",
    severity: "high",
    affectedCompanies: 1,
    totalCompanies: 2,
    description: "Tesla's capacity utilization dropped to 68% with backlog shrinking 25% — classic overcapacity signal in manufacturing sector.",
    drivers: ["EV demand growth slowing", "New factory capacity coming online", "Competition from Chinese manufacturers"],
  },
  {
    industry: "retail",
    industryLabel: "Retail & Consumer",
    signal: "Inventory efficiency stable — no sector-wide buildup detected",
    severity: "low",
    affectedCompanies: 0,
    totalCompanies: 2,
    description: "Both tracked retailers (COST, AMZN) maintain healthy inventory turnover ratios. No inventory-demand mismatch signals detected.",
    drivers: ["Post-COVID inventory normalization complete", "Improved demand forecasting", "Lean inventory management"],
  },
  {
    industry: "technology",
    industryLabel: "Technology",
    signal: "AI infrastructure spending creating concentration risk",
    severity: "moderate",
    affectedCompanies: 4,
    totalCompanies: 6,
    description: "NVDA, MSFT, META, and GOOGL all increasing AI capex significantly. If AI ROI disappoints, sector-wide capex writedowns possible.",
    drivers: ["Hyperscaler AI capex race", "Unclear enterprise AI monetization timeline", "GPU pricing may not sustain"],
  },
  {
    industry: "banking",
    industryLabel: "Banking & Financial Services",
    signal: "Capital ratios strong but Basel III endgame may tighten requirements",
    severity: "moderate",
    affectedCompanies: 2,
    totalCompanies: 2,
    description: "Both GS and MS maintain CET1 ratios well above minimums (14.8% and 15.3%), but proposed Basel III endgame rules could increase RWA calculations and require additional capital buffers.",
    drivers: ["Basel III endgame regulatory uncertainty", "Rising NPL ratios from higher rates", "Trading revenue cyclicality in rate transition"],
  },
];

// ─── Export Functions ───
export const getAllIndustryRisks = (): CompanyIndustryRisk[] => companyIndustryRisks;

export const getIndustryRisk = (ticker: string): CompanyIndustryRisk | undefined =>
  companyIndustryRisks.find(c => c.ticker === ticker);

export const getByIndustry = (industry: IndustryType): CompanyIndustryRisk[] =>
  companyIndustryRisks.filter(c => c.industry === industry);

export const getSystemicSignals = (): SystemicSignal[] => systemicSignals;

export const getIndustryTypes = (): IndustryType[] => ["banking", "technology", "retail", "industrial"];
