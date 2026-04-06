<div align="center">

# 📈 US Public Companies Dashboard

### *Financial Intelligence Powered by SEC 10-K Filings*

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![SEC EDGAR](https://img.shields.io/badge/Data-SEC%20EDGAR-0A3161?style=for-the-badge)](https://www.sec.gov/edgar)

<br/>

<img src="screenshots/01-us-companies-main.png" alt="Dashboard Main View" width="90%" />

<br/>

**A comprehensive financial analysis platform** that parses, scores, and visualizes SEC 10-K filings for top US public companies — featuring disclosure transparency grading, stock screening, AI-powered forecasts, industry risk analysis, and personalized watchlists.

[🚀 Quick Start](#-quick-start) · [✨ Features](#-features) · [📸 Screenshots](#-screenshots) · [🏗️ Architecture](#️-architecture) · [🐍 Analysis Scripts](#-python-analysis-scripts) · [🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [✨ Features](#-features)
- [📸 Screenshots](#-screenshots)
- [🏗️ Architecture](#️-architecture)
- [📊 Data Pipeline](#-data-pipeline)
- [🐍 Python Analysis Scripts](#-python-analysis-scripts)
- [🧩 Component Reference](#-component-reference)
- [📁 Project Structure](#-project-structure)
- [⚙️ Configuration](#️-configuration)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| 🟢 **Node.js** | ≥ 16.x | JavaScript runtime |
| 📦 **npm** | ≥ 8.x | Package manager |
| 🐍 **Python** | ≥ 3.8 | Analysis scripts |

### Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/cagehao/10-k-analysis.git
cd 10-k-analysis

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start the development server
npm start
```

🌐 The app will open automatically at **http://localhost:3000**

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | 🔧 Start development server with hot reload |
| `npm run build` | 📦 Create optimized production build in `build/` |
| `npm test` | 🧪 Run test suite in interactive watch mode |
| `npm run eject` | ⏏️ Eject from Create React App (one-way operation) |

---

## ✨ Features

<div align="center">

```
┌─────────────────────────────────────────────────────────────────────┐
│                    US Public Companies Dashboard                     │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────────┤
│  🏆 US   │  📄 10-K │  🔍 Stock│  🔮 Fore-│  🏭 Ind- │  ⭐ Watch-  │
│ Companies│ Analysis │ Screener │  cast &  │  ustry   │    list     │
│          │          │          │  Alerts  │   Risk   │             │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────────┘
```

</div>

### 🏆 US Public Companies

> Browse and explore top NASDAQ-listed companies with rich financial profiles.

- 🏢 **Company Cards** — At-a-glance view of ticker, sector, market cap, and description
- 🔎 **Sector Filtering** — Filter by Technology, Consumer Discretionary, Communication Services, Consumer Staples, Financial Services
- 📊 **Detailed Financials** — Click any card to dive into revenue, earnings, margins, and historical performance
- 📈 **Interactive Charts** — Powered by [Recharts](https://recharts.org/) for smooth, responsive data visualization

### 📄 10-K Disclosure Analysis

> Deep-dive into SEC 10-K filing transparency with multi-dimensional scoring.

| Sub-Tab | Icon | What It Measures |
|---------|------|------------------|
| **Overview** | 📊 | Aggregate transparency scores and letter grades (A+ → F) |
| **Readability** | 📖 | Flesch-Kincaid scores, sentence complexity, jargon density |
| **Specificity** | 🎯 | Quantitative detail, named-entity density, forward-looking precision |
| **Consistency** | 🔄 | Year-over-year language drift, structural stability, tone shifts |
| **Information Richness** | 💎 | Data density, unique insight ratio, comparative benchmarking |
| **Industry Comparison** | 📈 | Cross-company and cross-sector transparency rankings |
| **Investor Guide** | 💡 | Actionable takeaways and red-flag summaries for investors |

**Companies analyzed:** Apple (AAPL) · Microsoft (MSFT) · Alphabet (GOOGL) · Amazon (AMZN) · NVIDIA (NVDA)

**Sections covered:** Risk Factors · MD&A · Accounting Policies

### 🔍 Stock Screener

> Filter and rank companies using transparency metrics and financial fundamentals.

- 📋 Multi-criteria filtering with real-time results
- 📊 Side-by-side comparison of transparency scores
- 🏷️ Sortable columns for quick ranking

### 🔮 Forecast & Alerts

> AI-powered financial forecasting with configurable alert thresholds.

- 📈 **Overview** — Market-wide forecast summaries
- 🔬 **Company Deep Dive** — Individual company projections with confidence intervals
- 🔔 **Active Alerts** — Triggered notifications for significant metric changes
- 📐 **Methodology** — Transparent explanation of forecasting models

### 🏭 Industry Risk Dashboard

> Sector-level and systemic risk monitoring across major industries.

- 🖥️ **Technology** · 🛒 **Retail** · 🏗️ **Industrial** · 🏦 **Banking** — Sector-specific risk profiles
- 🏢 **Company Analysis** — Individual company risk decomposition
- ⚠️ **Systemic Signals** — Cross-sector contagion and macro risk indicators

### ⭐ Watchlist

> Personalized portfolio tracking with custom alerts and notes.

- ➕ Add/remove companies to your personal watchlist
- 📌 Pin important metrics and set custom thresholds
- 📊 Consolidated view of watched companies' key indicators

---

## 📸 Screenshots

<details>
<summary><b>🏆 US Companies — Main Dashboard & Sector Views</b></summary>
<br/>

| View | Screenshot |
|------|-----------|
| **Main Dashboard** | <img src="screenshots/01-us-companies-main.png" width="600"/> |
| **Technology Sector** | <img src="screenshots/02-sector-technology.png" width="600"/> |
| **Consumer Discretionary** | <img src="screenshots/03-sector-consumer-discretionary.png" width="600"/> |
| **Communication Services** | <img src="screenshots/04-sector-communication-services.png" width="600"/> |
| **Consumer Staples** | <img src="screenshots/05-sector-consumer-staples.png" width="600"/> |
| **Financial Services** | <img src="screenshots/06-sector-financial-services.png" width="600"/> |

</details>

<details>
<summary><b>🏢 Company Detail Pages</b></summary>
<br/>

| Company | Screenshot |
|---------|-----------|
| **Apple (AAPL)** | <img src="screenshots/07-company-aapl.png" width="600"/> |
| **Microsoft (MSFT)** | <img src="screenshots/08-company-msft.png" width="600"/> |
| **NVIDIA (NVDA)** | <img src="screenshots/09-company-nvda.png" width="600"/> |
| **Amazon (AMZN)** | <img src="screenshots/10-company-amzn.png" width="600"/> |
| **Meta (META)** | <img src="screenshots/11-company-meta.png" width="600"/> |
| **Tesla (TSLA)** | <img src="screenshots/12-company-tsla.png" width="600"/> |
| **Alphabet (GOOGL)** | <img src="screenshots/13-company-googl.png" width="600"/> |
| **Broadcom (AVGO)** | <img src="screenshots/14-company-avgo.png" width="600"/> |
| **Costco (COST)** | <img src="screenshots/15-company-cost.png" width="600"/> |
| **Netflix (NFLX)** | <img src="screenshots/16-company-nflx.png" width="600"/> |
| **Goldman Sachs (GS)** | <img src="screenshots/17-company-gs.png" width="600"/> |
| **Morgan Stanley (MS)** | <img src="screenshots/18-company-ms.png" width="600"/> |

</details>

<details>
<summary><b>📄 10-K Disclosure Analysis</b></summary>
<br/>

| Tab | Screenshot |
|-----|-----------|
| **Overview** | <img src="screenshots/19-10k-overview.png" width="600"/> |
| **Readability** | <img src="screenshots/20-10k-readability.png" width="600"/> |
| **Specificity** | <img src="screenshots/21-10k-specificity.png" width="600"/> |
| **Consistency** | <img src="screenshots/22-10k-consistency.png" width="600"/> |
| **Richness** | <img src="screenshots/23-10k-richness.png" width="600"/> |
| **Industry Comparison** | <img src="screenshots/24-10k-comparison.png" width="600"/> |
| **Investor Guide** | <img src="screenshots/25-10k-investor-guide.png" width="600"/> |

</details>

<details>
<summary><b>🔍 Stock Screener</b></summary>
<br/>

<img src="screenshots/26-stock-screener.png" width="700"/>

</details>

<details>
<summary><b>🔮 Forecast & Alerts</b></summary>
<br/>

| View | Screenshot |
|------|-----------|
| **Overview** | <img src="screenshots/27-forecast-overview.png" width="600"/> |
| **Company Deep Dive** | <img src="screenshots/28-forecast-company-deep-dive.png" width="600"/> |
| **Active Alerts** | <img src="screenshots/29-forecast-active-alerts.png" width="600"/> |
| **Methodology** | <img src="screenshots/30-forecast-methodology.png" width="600"/> |

</details>

<details>
<summary><b>🏭 Industry Risk</b></summary>
<br/>

| View | Screenshot |
|------|-----------|
| **Risk Overview** | <img src="screenshots/31-industry-risk-overview.png" width="600"/> |
| **Technology Sector** | <img src="screenshots/32-industry-sector-technology.png" width="600"/> |
| **Retail Sector** | <img src="screenshots/33-industry-sector-retail.png" width="600"/> |
| **Industrial Sector** | <img src="screenshots/34-industry-sector-industrial.png" width="600"/> |
| **Banking Sector** | <img src="screenshots/35-industry-sector-banking.png" width="600"/> |
| **Company Analysis** | <img src="screenshots/36-industry-company-analysis.png" width="600"/> |
| **Systemic Signals** | <img src="screenshots/37-industry-systemic-signals.png" width="600"/> |

</details>

<details>
<summary><b>⭐ Watchlist</b></summary>
<br/>

<img src="screenshots/38-watchlist.png" width="700"/>

</details>

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    React 19 + TypeScript                   │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │ Company  │ │ 10-K     │ │ Stock    │ │  Forecast &  │  │  │
│  │  │ Cards &  │ │ Disclosure│ │ Screener │ │  Alerts      │  │  │
│  │  │ Details  │ │ Analysis │ │          │ │              │  │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘  │  │
│  │       │             │            │              │          │  │
│  │  ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐ ┌─────┴────────┐ │  │
│  │  │ Industry │ │ Watchlist │ │ Recharts │ │ React Router │ │  │
│  │  │ Risk     │ │ Dashboard│ │ Graphs   │ │ Navigation   │ │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────────────┘ │  │
│  │       └─────────────┴────────────┘                        │  │
│  │                      │                                    │  │
│  │         ┌────────────┴────────────┐                       │  │
│  │         │    TypeScript Data      │                       │  │
│  │         │    Layer (src/data/)    │                       │  │
│  │         │  ┌──────────────────┐   │                       │  │
│  │         │  │ nasdaqCompanies  │   │                       │  │
│  │         │  │ financialData    │   │                       │  │
│  │         │  │ transparencyData │   │                       │  │
│  │         │  │ forecastData     │   │                       │  │
│  │         │  │ industryRiskData │   │                       │  │
│  │         │  └──────────────────┘   │                       │  │
│  │         └─────────────────────────┘                       │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    PYTHON ANALYSIS PIPELINE                       │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────┐  │
│  │ SEC 10-K │→ │ Text Analyzer│→ │ Metric       │→ │  CSV    │  │
│  │ Filings  │  │ & Parsers    │  │ Calculators  │  │ Output  │  │
│  └──────────┘  └──────────────┘  └──────────────┘  └─────────┘  │
│                                                                  │
│  Scripts: text_analyzer.py · disclosure_specificity.py            │
│           consistency_analyzer.py · information_richness.py       │
│           tenk_transparency_analyzer.py · calculate_metrics.py    │
│           add_risk_flags.py · validate_csv.py                     │
└──────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Role |
|-------|-----------|------|
| ⚛️ **Frontend** | React 19 + TypeScript | UI components & state management |
| 📊 **Charts** | Recharts 3.8 | Interactive data visualization |
| 🧭 **Routing** | React Router DOM 7 | Tab-based navigation |
| 🧪 **Testing** | Jest + React Testing Library | Unit & integration tests |
| 📸 **Screenshots** | Puppeteer + PDFKit | Automated screenshot capture |
| 🐍 **Analysis** | Python 3.x | NLP & financial metric computation |
| 📁 **Data** | CSV + TypeScript modules | Structured financial datasets |

---

## 📊 Data Pipeline

```
  SEC EDGAR 10-K Filings
          │
          ▼
  ┌───────────────────┐
  │  text_analyzer.py  │  ← Extract & tokenize filing text
  └────────┬──────────┘
           │
     ┌─────┴──────┬──────────────┬──────────────────┐
     ▼            ▼              ▼                  ▼
┌─────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────────┐
│Readabil-│ │Specifici-│ │Consistency │ │ Information      │
│ity      │ │ty        │ │ Analyzer   │ │ Richness         │
│Metrics  │ │Analysis  │ │            │ │ Analyzer         │
└────┬────┘ └────┬─────┘ └─────┬──────┘ └────────┬─────────┘
     │           │             │                  │
     └───────────┴──────┬──────┴──────────────────┘
                        ▼
              ┌──────────────────┐
              │calculate_metrics │  ← Derive composite scores
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │ add_risk_flags   │  ← Flag anomalies & risks
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │  validate_csv    │  ← Quality assurance
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │   data/*.csv     │  ← Ready for React app
              └──────────────────┘
```

### Data Files

| File | Description |
|------|-------------|
| `nasdaq_top10_10k_key_metrics.csv` | Core 10-K metrics for top NASDAQ companies |
| `nasdaq_top10_derived_metrics.csv` | Computed scores, grades, and risk flags |

---

## 🐍 Python Analysis Scripts

All scripts are located in the [`data-fetcher/`](data-fetcher) directory. Run them with Python 3.8+.

| Script | Purpose | Usage |
|--------|---------|-------|
| 🔤 `text_analyzer.py` | Tokenize and analyze 10-K filing text | `python data-fetcher/text_analyzer.py` |
| 🎯 `disclosure_specificity.py` | Measure quantitative detail & named-entity density | `python data-fetcher/disclosure_specificity.py` |
| 🔄 `consistency_analyzer.py` | Detect year-over-year language drift & tone shifts | `python data-fetcher/consistency_analyzer.py` |
| 💎 `information_richness.py` | Score data density & unique insight ratio | `python data-fetcher/information_richness.py` |
| 📊 `tenk_transparency_analyzer.py` | Master orchestrator for all transparency metrics | `python data-fetcher/tenk_transparency_analyzer.py` |
| 🧮 `calculate_metrics.py` | Derive composite performance columns | `python data-fetcher/calculate_metrics.py` |
| 🚩 `add_risk_flags.py` | Annotate rows with risk/flag indicators | `python data-fetcher/add_risk_flags.py` |
| ✅ `validate_csv.py` | Validate CSV structure and data integrity | `python data-fetcher/validate_csv.py <path>` |
| ✅ `validate_csv2.py` | Extended CSV validation with additional checks | `python data-fetcher/validate_csv2.py <path>` |

### Running the Full Pipeline

```bash
# Step 1: Analyze 10-K text
python data-fetcher/text_analyzer.py

# Step 2: Run transparency analysis
python data-fetcher/tenk_transparency_analyzer.py

# Step 3: Calculate derived metrics
python data-fetcher/calculate_metrics.py

# Step 4: Add risk flags
python data-fetcher/add_risk_flags.py

# Step 5: Validate output
python data-fetcher/validate_csv.py data/nasdaq_top10_10k_key_metrics.csv
```

---

## 🧩 Component Reference

### Page-Level Components

| Component | File | Description |
|-----------|------|-------------|
| 🏢 `CompanyCard` | `CompanyCard.tsx` | Compact card showing ticker, name, sector, market cap |
| 📋 `CompanyDetail` | `CompanyDetail.tsx` | Full financial profile with charts and metrics |
| 📄 `DisclosureAnalysis` | `DisclosureAnalysis.tsx` | 10-K analysis hub with 7 sub-tabs |
| 🔍 `StockScreener` | `StockScreener.tsx` | Multi-criteria company filtering tool |
| 🔮 `ForecastDashboard` | `ForecastDashboard.tsx` | AI forecast views with alerts |
| 🏭 `IndustryRiskDashboard` | `IndustryRiskDashboard.tsx` | Sector & systemic risk monitoring |
| ⭐ `WatchlistDashboard` | `WatchlistDashboard.tsx` | Personal watchlist management |

### 10-K Analysis Sub-Components

| Component | File | Description |
|-----------|------|-------------|
| 📖 `ReadabilityMetrics` | `ReadabilityMetrics.tsx` | Flesch-Kincaid, sentence complexity, jargon analysis |
| 🎯 `SpecificityAnalysis` | `SpecificityAnalysis.tsx` | Quantitative detail & forward-looking precision |
| 🔄 `ConsistencyReport` | `ConsistencyReport.tsx` | YoY language drift & structural stability |
| 💎 `RichnessDashboard` | `RichnessDashboard.tsx` | Data density & unique insight scoring |

### Data Modules

| Module | File | Exports |
|--------|------|---------|
| 🏢 `nasdaqCompanies` | `nasdaqCompanies.ts` | `NasdaqCompany` interface, `top10NasdaqCompanies` array |
| 💰 `financialData` | `financialData.ts` | `CompanyFinancials`, `getCompanyFinancials()` |
| 🔍 `transparencyData` | `transparencyData.ts` | `CompanyTransparencyData`, `getAllTransparencyData()` |
| 🔮 `forecastData` | `forecastData.ts` | Forecast models and alert configurations |
| 🏭 `industryRiskData` | `industryRiskData.ts` | Sector risk profiles and systemic indicators |

---

## 📁 Project Structure

```
10-k-analysis/
├── 📄 README.md                  ← You are here
├── 📄 LICENSE                    ← MIT License
├── 📄 package.json               ← Dependencies & scripts
├── 📄 tsconfig.json              ← TypeScript configuration
├── 📄 .gitignore
│
├── 📂 public/                    ← Static assets
│   ├── index.html                ← HTML entry point
│   ├── favicon.ico
│   ├── manifest.json
│   └── logo*.png
│
├── 📂 src/                       ← React application source
│   ├── App.tsx                   ← Root component with tab navigation
│   ├── App.css                   ← Global styles
│   ├── index.tsx                 ← React DOM entry point
│   │
│   ├── 📂 components/            ← UI components (11 components)
│   │   ├── CompanyCard.tsx/.css
│   │   ├── CompanyDetail.tsx/.css
│   │   ├── DisclosureAnalysis.tsx/.css
│   │   ├── ReadabilityMetrics.tsx/.css
│   │   ├── SpecificityAnalysis.tsx/.css
│   │   ├── ConsistencyReport.tsx/.css
│   │   ├── RichnessDashboard.tsx/.css
│   │   ├── StockScreener.tsx/.css
│   │   ├── ForecastDashboard.tsx/.css
│   │   ├── IndustryRiskDashboard.tsx/.css
│   │   └── WatchlistDashboard.tsx/.css
│   │
│   └── 📂 data/                  ← TypeScript data modules
│       ├── nasdaqCompanies.ts
│       ├── financialData.ts
│       ├── transparencyData.ts
│       ├── forecastData.ts
│       └── industryRiskData.ts
│
├── 📂 data/                      ← CSV datasets
│   ├── nasdaq_top10_10k_key_metrics.csv
│   └── nasdaq_top10_derived_metrics.csv
│
├── 📂 data-fetcher/              ← Python analysis scripts (9 scripts)
│   ├── text_analyzer.py
│   ├── disclosure_specificity.py
│   ├── consistency_analyzer.py
│   ├── information_richness.py
│   ├── tenk_transparency_analyzer.py
│   ├── calculate_metrics.py
│   ├── add_risk_flags.py
│   ├── validate_csv.py
│   └── validate_csv2.py
│
├── 📂 screenshots/               ← 38 screenshots + PDF compilation
│   ├── 01-us-companies-main.png
│   ├── ...
│   ├── 38-watchlist.png
│   └── All-Pages-Screenshots.pdf
│
├── 📄 take-screenshots.js        ← Puppeteer screenshot automation
└── 📄 take-all-screenshots.js    ← Full-suite screenshot capture
```

---

## ⚙️ Configuration

### Environment

The React app was bootstrapped with **Create React App** (TypeScript template). No additional environment variables are required for local development.

### Browser Support

| Environment | Browsers |
|-------------|----------|
| 🖥️ **Production** | `>0.2%` market share, not dead, not Opera Mini |
| 🔧 **Development** | Latest Chrome, Firefox, Safari |

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.4 | UI framework |
| `react-dom` | ^19.2.4 | DOM rendering |
| `react-router-dom` | ^7.13.1 | Client-side routing |
| `recharts` | ^3.8.0 | Chart components |
| `typescript` | ^4.9.5 | Type safety |
| `puppeteer` | ^24.40.0 | Screenshot automation (dev) |
| `pdfkit` | ^0.18.0 | PDF generation (dev) |

---

## 🚢 Deployment

### Static Hosting

Build the production bundle and deploy to any static hosting provider:

```bash
npm run build
```

The `build/` directory contains the optimized static site ready for deployment.

### Hosting Options

| Provider | Command / Notes |
|----------|----------------|
| 🔵 **GitHub Pages** | Push `build/` to `gh-pages` branch |
| 🟢 **Netlify** | Connect repo → auto-deploys on push |
| 🟠 **AWS S3** | `aws s3 sync build/ s3://your-bucket` |
| 🔴 **Vercel** | `vercel --prod` |
| 🟣 **Firebase** | `firebase deploy` |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

### Workflow

```
1. 🍴 Fork the repository
2. 🌿 Create a feature branch    →  git checkout -b feature/amazing-feature
3. 💻 Make your changes
4. 🧪 Run tests                  →  npm test
5. 📦 Verify build               →  npm run build
6. 📝 Commit your changes        →  git commit -m "feat: add amazing feature"
7. 🚀 Push to your branch        →  git push origin feature/amazing-feature
8. 🔃 Open a Pull Request
```

### Guidelines

- ✅ Keep changes **minimal and focused** — one feature or fix per PR
- ✅ **Update or add tests** where relevant
- ✅ Run `npm test` and `npm run build` before submitting
- ✅ Follow existing code style and TypeScript conventions
- ✅ Add screenshots for UI changes

---

## 🗺️ Roadmap

- [ ] 🔗 **Live SEC EDGAR Integration** — Real-time 10-K fetching via MCP Server
- [ ] 🤖 **AI-Powered Risk Analysis** — LLM-driven filing interpretation
- [ ] 📉 **Multi-Year Trend Detection** — Automated pattern recognition across filings
- [ ] 🌐 **S&P 500 Expansion** — Coverage beyond NASDAQ top companies
- [ ] 📱 **Mobile Responsive** — Optimized layouts for tablets and phones
- [ ] 🔐 **User Authentication** — Persistent watchlists and preferences

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License · Copyright (c) 2026 Jiahao (Cage)
```

---

## 💬 Contact & Support

- 🐛 **Bug Reports** — [Open an issue](https://github.com/cagehao/10-k-analysis/issues)
- 💡 **Feature Requests** — [Open an issue](https://github.com/cagehao/10-k-analysis/issues)
- 📧 **Questions** — See the `data-fetcher` scripts or open an issue

---

<div align="center">

**Built with ❤️ using React + TypeScript**

📈 *Empowering investors with transparent, data-driven financial intelligence*

[![Stars](https://img.shields.io/github/stars/cagehao/10-k-analysis?style=social)](https://github.com/cagehao/10-k-analysis)
[![Forks](https://img.shields.io/github/forks/cagehao/10-k-analysis?style=social)](https://github.com/cagehao/10-k-analysis)

</div>
