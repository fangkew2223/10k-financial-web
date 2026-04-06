import React, { useState } from "react";
import "./App.css";
import CompanyCard from "./components/CompanyCard";
import CompanyDetail from "./components/CompanyDetail";
import DisclosureAnalysis from "./components/DisclosureAnalysis";
import StockScreener from "./components/StockScreener";
import ForecastDashboard from "./components/ForecastDashboard";
import WatchlistDashboard from "./components/WatchlistDashboard";
import IndustryRiskDashboard from "./components/IndustryRiskDashboard";
import { top10NasdaqCompanies, NasdaqCompany } from "./data/nasdaqCompanies";
import { getAllTransparencyData } from "./data/transparencyData";
import { getCompanyFinancials, CompanyFinancials } from "./data/financialData";

const sectors = ["All", ...Array.from(new Set(top10NasdaqCompanies.map((c) => c.sector)))];

type AppTab = "top10" | "tenk" | "screener" | "forecast" | "industry" | "watchlist";

const appTabs: { key: AppTab; label: string; icon: string; comingSoon?: boolean }[] = [
  { key: "top10", label: "US Public Companies", icon: "🏆" },
  { key: "tenk", label: "10-K Analysis", icon: "📄", comingSoon: true },
  { key: "screener", label: "Stock Screener", icon: "🔍", comingSoon: true },
  { key: "forecast", label: "Forecast & Alerts", icon: "🔮" },
  { key: "industry", label: "Industry Risk", icon: "🏭" },
  { key: "watchlist", label: "Watchlist", icon: "⭐" },
];

function ComingSoon({ title, icon, description }: { title: string; icon: string; description: string }) {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-card">
        <div className="coming-soon-icon">{icon}</div>
        <h2 className="coming-soon-title">{title}</h2>
        <p className="coming-soon-desc">{description}</p>
        <div className="coming-soon-badge">🚧 Coming Soon</div>
        <p className="coming-soon-note">
          This feature will be powered by an <strong>MCP (Model Context Protocol) Server</strong> that
          connects to SEC EDGAR filings, parses 10-K documents, and provides AI-driven financial analysis.
        </p>
        <div className="coming-soon-features">
          <div className="feature-item">📊 Automated 10-K parsing</div>
          <div className="feature-item">🤖 AI-powered risk analysis</div>
          <div className="feature-item">📉 Multi-year trend detection</div>
          <div className="feature-item">🔗 Real-time SEC EDGAR integration</div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("top10");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [selectedCompany, setSelectedCompany] = useState<NasdaqCompany | null>(null);

  const filtered: NasdaqCompany[] =
    selectedSector === "All"
      ? top10NasdaqCompanies
      : top10NasdaqCompanies.filter((c) => c.sector === selectedSector);

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    setSelectedCompany(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-logo">📈</div>
          <div>
            <h1 className="app-title">US Public Companies Dashboard</h1>
            <p className="app-subtitle">Financial intelligence powered by SEC 10-K filings</p>
          </div>
        </div>
        {/* Top Navigation Tabs */}
        <div className="app-nav">
          {appTabs.map((tab) => (
            <button
              key={tab.key}
              className={`app-nav-tab ${activeTab === tab.key ? "active" : ""} ${tab.comingSoon ? "coming-soon-tab" : ""}`}
              onClick={() => handleTabChange(tab.key)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
              {tab.comingSoon && <span className="nav-badge">Soon</span>}
            </button>
          ))}
        </div>
      </header>

      {/* Tab Content */}
      {activeTab === "tenk" && (
        <main style={{ flex: 1 }}>
          <DisclosureAnalysis />
        </main>
      )}

      {activeTab === "screener" && (
        <main style={{ flex: 1 }}>
          <StockScreener
            transparencyData={getAllTransparencyData()}
            companies={top10NasdaqCompanies}
            financialData={top10NasdaqCompanies.map(c => getCompanyFinancials(c.ticker)).filter((f): f is CompanyFinancials => f !== undefined)}
          />
        </main>
      )}

      {activeTab === "forecast" && (
        <main style={{ flex: 1 }}>
          <ForecastDashboard />
        </main>
      )}

      {activeTab === "industry" && (
        <main style={{ flex: 1 }}>
          <IndustryRiskDashboard />
        </main>
      )}

      {activeTab === "watchlist" && (
        <main style={{ flex: 1 }}>
          <WatchlistDashboard />
        </main>
      )}

      {activeTab === "top10" && selectedCompany && (
        <main style={{ flex: 1 }}>
          <CompanyDetail
            company={selectedCompany}
            onBack={() => setSelectedCompany(null)}
          />
        </main>
      )}

      {activeTab === "top10" && !selectedCompany && (
        <main className="app-main">
          <div className="filter-bar">
            <span className="filter-label">Filter by Sector:</span>
            <div className="filter-buttons">
              {sectors.map((sector) => (
                <button
                  key={sector}
                  className={`filter-btn ${selectedSector === sector ? "active" : ""}`}
                  onClick={() => setSelectedSector(sector)}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          <div className="company-count">
            Showing <strong>{filtered.length}</strong> of {top10NasdaqCompanies.length} US public companies
            <span className="click-hint"> · Click any card to view detailed financials</span>
          </div>

          <div className="company-list">
            {filtered.map((company) => (
              <CompanyCard
                key={company.ticker}
                company={company}
                onClick={() => setSelectedCompany(company)}
              />
            ))}
            {/* Coming Soon card at the bottom */}
            <div className="more-coming-soon-card">
              <div className="more-coming-soon-inner">
                <span className="more-coming-soon-icon">🚀</span>
                <div className="more-coming-soon-text">
                  <h3>More Companies Coming Soon</h3>
                  <p>We're expanding coverage to include S&amp;P 500, NYSE, and all major US public companies — with real-time data, AI-powered analysis, and full 10-K integration.</p>
                </div>
                <span className="more-coming-soon-badge">Coming Soon</span>
              </div>
            </div>
          </div>
        </main>
      )}

      <footer className="app-footer">
        <p>Data sourced from SEC 10-K filings · Market caps are approximate · Built with React + TypeScript</p>
      </footer>
    </div>
  );
}

export default App;
