import React, { useState, useEffect } from 'react';
import { CompanyTransparencyData } from '../data/transparencyData';
import { NasdaqCompany } from '../data/nasdaqCompanies';
import { CompanyFinancials } from '../data/financialData';
import './StockScreener.css';

interface StockScreenerProps {
  transparencyData: CompanyTransparencyData[];
  companies: NasdaqCompany[];
  financialData: CompanyFinancials[];
}

interface ScreeningResult {
  symbol: string;
  name: string;
  marketCap: number;
  peRatio: number;
  roe: number;
  revenueGrowth: number;
  transparencyScore: number;
  riskLevel: string;
  transparencyRank: number;
  financialRank: number;
  overallRank: number;
}

const StockScreener: React.FC<StockScreenerProps> = ({ 
  transparencyData, 
  companies, 
  financialData 
}) => {
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'overallRank' | 'transparencyRank' | 'financialRank' | 'marketCap' | 'peRatio' | 'roe'>('overallRank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter states
  const [minMarketCap, setMinMarketCap] = useState<number>(0);
  const [maxMarketCap, setMaxMarketCap] = useState<number>(5000000000000);
  const [minPeRatio, setMinPeRatio] = useState<number>(0);
  const [maxPeRatio, setMaxPeRatio] = useState<number>(100);
  const [minRoe, setMinRoe] = useState<number>(0);
  const [maxRoe, setMaxRoe] = useState<number>(100);
  const [minRevenueGrowth, setMinRevenueGrowth] = useState<number>(-50);
  const [maxRevenueGrowth, setMaxRevenueGrowth] = useState<number>(100);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>(['Low', 'Medium', 'High']);

  useEffect(() => {
    performScreening();
  }, [transparencyData, companies, financialData]);

  const performScreening = () => {
    setLoading(true);
    
    // Create lookup maps for efficient data joining
    const companyMap = new Map(companies.map(c => [c.ticker, c]));
    const financialMap = new Map(financialData.map(f => [f.ticker, f]));
    const transparencyMap = new Map(transparencyData.map(t => [t.ticker, t]));

    // Calculate transparency scores
    const transparencyScores = transparencyData.map(t => ({
      symbol: t.ticker,
      score: calculateTransparencyScore(t)
    }));

    // Sort transparency scores for ranking
    transparencyScores.sort((a, b) => b.score - a.score);
    const transparencyRankMap = new Map(
      transparencyScores.map((item, index) => [item.symbol, index + 1])
    );

    // Calculate financial scores
    const financialScores = financialData.map(f => ({
      symbol: f.ticker,
      score: calculateFinancialScore(f)
    }));

    // Sort financial scores for ranking
    financialScores.sort((a, b) => b.score - a.score);
    const financialRankMap = new Map(
      financialScores.map((item, index) => [item.symbol, index + 1])
    );

    // Combine all data and calculate overall rankings
    const combinedResults: ScreeningResult[] = [];

    companyMap.forEach((company, symbol) => {
      const financial = financialMap.get(symbol);
      const transparency = transparencyMap.get(symbol);

      if (financial && transparency) {
        const latestMetrics = financial.metrics[financial.metrics.length - 1];
        const transparencyScore = calculateTransparencyScore(transparency);
        const financialScore = calculateFinancialScore(financial);
        const overallScore = (transparencyScore * 0.4) + (financialScore * 0.6);

        combinedResults.push({
          symbol,
          name: company.name,
          marketCap: latestMetrics.marketCap || 0,
          peRatio: latestMetrics.peRatio || 0,
          roe: latestMetrics.roe || 0,
          revenueGrowth: latestMetrics.revenueGrowth || 0,
          transparencyScore,
          riskLevel: getRiskLevel(financial),
          transparencyRank: transparencyRankMap.get(symbol) || 0,
          financialRank: financialRankMap.get(symbol) || 0,
          overallRank: Math.round(overallScore)
        });
      }
    });

    setResults(combinedResults.sort((a, b) => a.overallRank - b.overallRank));
    setLoading(false);
  };

  const calculateTransparencyScore = (data: CompanyTransparencyData): number => {
    const latestSection = data.sections[data.sections.length - 1];
    const readability = latestSection.readability.flesch_reading_ease;
    const specificity = latestSection.specificity.specificity_score;
    const consistency = latestSection.consistency ? latestSection.consistency.overall_consistency_score : 0.5;
    const richness = latestSection.richness.information_richness_score;

    // Normalize scores to 1-100 scale
    const readabilityScore = Math.min(100, Math.max(1, readability));
    const specificityScore = specificity * 100;
    const consistencyScore = consistency * 100;
    const richnessScore = richness * 100;

    return Math.round((readabilityScore + specificityScore + consistencyScore + richnessScore) / 4);
  };

  const calculateFinancialScore = (data: CompanyFinancials): number => {
    // Get the latest year's data
    const latestMetrics = data.metrics[data.metrics.length - 1];
    
    // Simple financial scoring based on key metrics
    let score = 50; // Base score

    // P/E Ratio scoring (lower is generally better, but not too low)
    const peRatio = latestMetrics.peRatio || 0;
    if (peRatio > 0 && peRatio < 10) score += 20;
    else if (peRatio >= 10 && peRatio <= 20) score += 15;
    else if (peRatio > 20 && peRatio <= 30) score += 5;
    else if (peRatio > 30 && peRatio <= 50) score -= 5;
    else if (peRatio > 50) score -= 15;
    else if (peRatio <= 0) score -= 10; // Negative or zero P/E is risky

    // ROE scoring (higher is better)
    const roe = latestMetrics.roe || 0;
    if (roe > 20) score += 20;
    else if (roe > 15) score += 15;
    else if (roe > 10) score += 10;
    else if (roe > 5) score += 5;
    else score -= 10;

    // Revenue growth scoring
    const revenueGrowth = latestMetrics.revenueGrowth || 0;
    if (revenueGrowth > 20) score += 20;
    else if (revenueGrowth > 10) score += 15;
    else if (revenueGrowth > 5) score += 10;
    else if (revenueGrowth > 0) score += 5;
    else if (revenueGrowth >= -5) score -= 5;
    else score -= 15;

    return Math.max(1, Math.min(100, score));
  };

  const getRiskLevel = (financial: CompanyFinancials): string => {
    const latestMetrics = financial.metrics[financial.metrics.length - 1];
    
    const peRatio = latestMetrics.peRatio || 0;
    const roe = latestMetrics.roe || 0;
    const revenueGrowth = latestMetrics.revenueGrowth || 0;
    
    if (peRatio > 30 || roe < 5 || revenueGrowth < -10) {
      return 'High';
    } else if (peRatio > 20 || roe < 10 || revenueGrowth < 0) {
      return 'Medium';
    } else {
      return 'Low';
    }
  };

  const filteredResults = results.filter(result => {
    return (
      result.marketCap >= minMarketCap &&
      result.marketCap <= maxMarketCap &&
      result.peRatio >= minPeRatio &&
      result.peRatio <= maxPeRatio &&
      result.roe >= minRoe &&
      result.roe <= maxRoe &&
      result.revenueGrowth >= minRevenueGrowth &&
      result.revenueGrowth <= maxRevenueGrowth &&
      selectedRiskLevels.includes(result.riskLevel)
    );
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'overallRank':
        comparison = a.overallRank - b.overallRank;
        break;
      case 'transparencyRank':
        comparison = a.transparencyRank - b.transparencyRank;
        break;
      case 'financialRank':
        comparison = a.financialRank - b.financialRank;
        break;
      case 'marketCap':
        comparison = a.marketCap - b.marketCap;
        break;
      case 'peRatio':
        comparison = a.peRatio - b.peRatio;
        break;
      case 'roe':
        comparison = a.roe - b.roe;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const formatCurrency = (value: number): string => {
    if (value >= 1000000000000) {
      return `$${(value / 1000000000000).toFixed(2)}T`;
    } else if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'Low': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="screener-container">
        <div className="screener-header">
          <h1>Stock Screener</h1>
          <p>Filter and analyze NASDAQ stocks by financial metrics and transparency scores</p>
        </div>
        <div className="loading">Loading screening data...</div>
      </div>
    );
  }

  return (
    <div className="screener-container">
      <div className="screener-header">
        <h1>Stock Screener</h1>
        <p>Filter and analyze NASDAQ stocks by financial metrics and transparency scores</p>
        <div className="results-summary">
          Showing {sortedResults.length} of {results.length} companies
        </div>
        <div className="rank-explanation">
          <strong>Rank Explanation:</strong> Overall rank (1-100) combines transparency score (40%) and financial score (60%). 
          Lower numbers = better investment quality. Rank 1 is the top-ranked company.
        </div>
      </div>

      <div className="filters-section">
        <h3>Screening Filters</h3>
        <div className="filter-grid">
          <div className="filter-group">
            <label>Market Cap Range</label>
            <div className="range-inputs">
              <input
                type="number"
                value={minMarketCap}
                onChange={(e) => setMinMarketCap(Number(e.target.value))}
                placeholder="Min Market Cap"
              />
              <span>to</span>
              <input
                type="number"
                value={maxMarketCap}
                onChange={(e) => setMaxMarketCap(Number(e.target.value))}
                placeholder="Max Market Cap"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>P/E Ratio Range</label>
            <div className="range-inputs">
              <input
                type="number"
                value={minPeRatio}
                onChange={(e) => setMinPeRatio(Number(e.target.value))}
                placeholder="Min P/E"
              />
              <span>to</span>
              <input
                type="number"
                value={maxPeRatio}
                onChange={(e) => setMaxPeRatio(Number(e.target.value))}
                placeholder="Max P/E"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>ROE Range (%)</label>
            <div className="range-inputs">
              <input
                type="number"
                value={minRoe}
                onChange={(e) => setMinRoe(Number(e.target.value))}
                placeholder="Min ROE"
              />
              <span>to</span>
              <input
                type="number"
                value={maxRoe}
                onChange={(e) => setMaxRoe(Number(e.target.value))}
                placeholder="Max ROE"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Revenue Growth Range (%)</label>
            <div className="range-inputs">
              <input
                type="number"
                value={minRevenueGrowth}
                onChange={(e) => setMinRevenueGrowth(Number(e.target.value))}
                placeholder="Min Growth"
              />
              <span>to</span>
              <input
                type="number"
                value={maxRevenueGrowth}
                onChange={(e) => setMaxRevenueGrowth(Number(e.target.value))}
                placeholder="Max Growth"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Risk Level</label>
            <div className="risk-filters">
              {['Low', 'Medium', 'High'].map(risk => (
                <label key={risk} className="risk-filter">
                  <input
                    type="checkbox"
                    checked={selectedRiskLevels.includes(risk)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRiskLevels([...selectedRiskLevels, risk]);
                      } else {
                        setSelectedRiskLevels(selectedRiskLevels.filter(r => r !== risk));
                      }
                    }}
                  />
                  <span style={{ color: getRiskColor(risk) }}>{risk}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sort-section">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="overallRank">Overall Rank</option>
          <option value="transparencyRank">Transparency Rank</option>
          <option value="financialRank">Financial Rank</option>
          <option value="marketCap">Market Cap</option>
          <option value="peRatio">P/E Ratio</option>
          <option value="roe">ROE</option>
        </select>
        
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </button>
      </div>

      <div className="results-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Company</th>
              <th>Symbol</th>
              <th>Market Cap</th>
              <th>P/E Ratio</th>
              <th>ROE (%)</th>
              <th>Revenue Growth (%)</th>
              <th>Transparency Score</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result, index) => (
              <tr key={result.symbol}>
                <td className="rank-cell">
                  <span className="rank-number">{result.overallRank}</span>
                </td>
                <td className="company-cell">
                  <div className="company-info">
                    <div className="company-name">{result.name}</div>
                    <div className="company-ranks">
                      T:{result.transparencyRank} F:{result.financialRank}
                    </div>
                  </div>
                </td>
                <td className="symbol-cell">{result.symbol}</td>
                <td className="metric-cell">{formatCurrency(result.marketCap)}</td>
                <td className="metric-cell">{result.peRatio.toFixed(2)}</td>
                <td className="metric-cell">{result.roe.toFixed(2)}</td>
                <td className={`metric-cell ${result.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
                  {result.revenueGrowth.toFixed(2)}%
                </td>
                <td className="score-cell">
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ 
                        width: `${result.transparencyScore}%`,
                        backgroundColor: result.transparencyScore >= 80 ? '#22c55e' : 
                                       result.transparencyScore >= 60 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <span className="score-text">{result.transparencyScore}</span>
                </td>
                <td className="risk-cell">
                  <span 
                    className="risk-badge" 
                    style={{ backgroundColor: getRiskColor(result.riskLevel) }}
                  >
                    {result.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="screener-footer">
        <div className="legend">
          <h4>Legend:</h4>
          <div className="legend-items">
            <span>T: Transparency Rank</span>
            <span>F: Financial Rank</span>
            <span>Green: Positive Growth</span>
            <span>Red: Negative Growth</span>
          </div>
        </div>
        
        <div className="ranking-explanation">
          <h4>How Rankings Are Calculated:</h4>
          <div className="ranking-details">
            <div className="ranking-section">
              <h5>Transparency Score (40% weight):</h5>
              <ul>
                <li><strong>Readability:</strong> Flesch Reading Ease score (1-100)</li>
                <li><strong>Specificity:</strong> How detailed and concrete the disclosures are</li>
                <li><strong>Consistency:</strong> Year-over-year consistency in reporting</li>
                <li><strong>Richness:</strong> Information density and comprehensiveness</li>
              </ul>
            </div>
            
            <div className="ranking-section">
              <h5>Financial Score (60% weight):</h5>
              <ul>
<li><strong>P/E Ratio:</strong> Lower is generally better (0-10: +20, 10-20: +15, 20-30: +5, 30-50: -5, {'>'}50: -15)</li>
<li><strong>ROE:</strong> Return on Equity (higher is better: {'>'}20%: +20, 15-20%: +15, 10-15%: +10, 5-10%: +5, {'<'}5%: -10)</li>
<li><strong>Revenue Growth:</strong> Year-over-year growth (higher is better: {'>'}20%: +20, 10-20%: +15, 5-10%: +10, 0-5%: +5, -5-0%: -5, {'<'}-5%: -15)</li>
              </ul>
            </div>
            
            <div className="ranking-section">
              <h5>Overall Ranking:</h5>
              <p>Final score = (Transparency Score × 0.4) + (Financial Score × 0.6)</p>
              <p>Companies are ranked 1-100 based on their final score, with 1 being the highest quality investment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockScreener;