import React from "react";
import { NasdaqCompany } from "../data/nasdaqCompanies";
import "./CompanyCard.css";

interface CompanyCardProps {
  company: NasdaqCompany;
  onClick?: () => void;
}

const sectorColors: Record<string, string> = {
  Technology: "#4f8ef7",
  "Consumer Discretionary": "#f7a24f",
  "Communication Services": "#4fc9f7",
  "Consumer Staples": "#4ff7a2",
};

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onClick }) => {
  const sectorColor = sectorColors[company.sector] || "#aaa";

  return (
    <div className="company-card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="card-rank">#{company.rank}</div>
      <div className="card-body">
        <div className="card-header">
          <span className="card-ticker">{company.ticker}</span>
          <span className="card-name">{company.name}</span>
        </div>
        <p className="card-description">{company.description}</p>
        <div className="card-footer">
          <span
            className="card-sector"
            style={{ backgroundColor: sectorColor + "33", color: sectorColor, borderColor: sectorColor }}
          >
            {company.sector}
          </span>
          <span className="card-marketcap">Market Cap: <strong>{company.marketCap}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
