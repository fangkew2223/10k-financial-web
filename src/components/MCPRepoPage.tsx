import React from "react";
import "./MCPRepoPage.css";

const MCP_REPO_URL = "https://github.com/fangkew2223/10k-financial-mcp";

function MCPRepoPage() {
  return (
    <main className="mcp-page">
      <section className="mcp-hero-card">
        <div className="mcp-hero-icon">🔌</div>
        <div className="mcp-hero-content">
          <span className="mcp-kicker">Open Source MCP Server</span>
          <h2>10-K Financial Data MCP</h2>
          <p>
            A standalone Model Context Protocol server for fetching live SEC EDGAR 10-K financial
            data using Python-based data-fetching scripts.
          </p>
          <div className="mcp-actions">
            <a className="mcp-primary-link" href={MCP_REPO_URL} target="_blank" rel="noreferrer">
              View GitHub Repository ↗
            </a>
            <code className="mcp-repo-url">github.com/fangkew2223/10k-financial-mcp</code>
          </div>
        </div>
      </section>

      <section className="mcp-info-grid">
        <div className="mcp-info-card">
          <h3>🐍 Python-backed fetching</h3>
          <p>
            The MCP calls Python SEC-fetching scripts derived from this project&apos;s original
            <code> data-fetcher</code> workflow.
          </p>
        </div>
        <div className="mcp-info-card">
          <h3>🏛️ SEC EDGAR integration</h3>
          <p>
            Fetches annual 10-K company facts directly from the SEC XBRL API for supported NASDAQ
            companies.
          </p>
        </div>
        <div className="mcp-info-card">
          <h3>🧩 AI tool interface</h3>
          <p>
            Exposes MCP tools for listing companies, fetching key metrics, fetching XBRL tags, and
            discovering available tags.
          </p>
        </div>
      </section>
    </main>
  );
}

export default MCPRepoPage;