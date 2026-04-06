import React, { useState, useEffect } from "react";
import "./DisclosureAnalysis.css";
import { CompanyTransparencyData, getAllTransparencyData, getCompanyTransparencyData, industryBenchmarks } from "../data/transparencyData";
import ReadabilityMetrics from "./ReadabilityMetrics";
import SpecificityAnalysis from "./SpecificityAnalysis";
import ConsistencyReport from "./ConsistencyReport";
import RichnessDashboard from "./RichnessDashboard";

type AnalysisTab = "overview" | "readability" | "specificity" | "consistency" | "richness" | "comparison" | "investor-guide";

const analysisTabs: { key: AnalysisTab; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "readability", label: "Readability", icon: "📖" },
  { key: "specificity", label: "Specificity", icon: "🎯" },
  { key: "consistency", label: "Consistency", icon: "🔄" },
  { key: "richness", label: "Information Richness", icon: "💎" },
  { key: "comparison", label: "Industry Comparison", icon: "📈" },
  { key: "investor-guide", label: "Investor Guide", icon: "💡" },
];

const companies = [
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "MSFT", name: "Microsoft Corporation" },
  { ticker: "GOOGL", name: "Alphabet Inc." },
  { ticker: "AMZN", name: "Amazon.com Inc." },
  { ticker: "NVDA", name: "NVIDIA Corporation" },
];

const sections = ["Risk Factors", "MD&A", "Accounting Policies"];

const DisclosureAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalysisTab>("overview");
  const [selectedCompany, setSelectedCompany] = useState<string>("AAPL");
  const [selectedSection, setSelectedSection] = useState<string>("Risk Factors");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [transparencyData, setTransparencyData] = useState<CompanyTransparencyData[]>([]);

  useEffect(() => {
    // Load transparency data
    const data = getAllTransparencyData();
    setTransparencyData(data);
  }, []);

  const currentCompanyData = getCompanyTransparencyData(selectedCompany);
  const currentSectionData = currentCompanyData?.sections.find(
    s => s.section === selectedSection && s.fiscal_year === selectedYear
  );

  const getGradeColor = (grade: string) => {
    switch (grade.charAt(0)) {
      case 'A': return '#22c55e';
      case 'B': return '#3b82f6';
      case 'C': return '#f59e0b';
      case 'D': return '#ef4444';
      case 'F': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getTrendColor = (direction: string) => {
    return direction === 'improving' ? '#22c55e' : direction === 'declining' ? '#ef4444' : '#6b7280';
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return '#22c55e';
    if (score >= 0.7) return '#3b82f6';
    if (score >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  const renderOverview = () => {
    if (!currentCompanyData) return null;

    const latestSection = currentCompanyData.sections.find(s => s.fiscal_year === selectedYear && s.section === selectedSection);
    
    return (
      <div className="overview-container">
        <div className="overview-header">
          <h2>Disclosure Transparency Overview</h2>
          <p className="overview-subtitle">
            Analyzing the clarity, specificity, and informativeness of {currentCompanyData.company_name}'s {selectedSection} disclosure
          </p>
        </div>

        <div className="overview-grid">
          {/* Main Score Card */}
          <div className="score-card">
            <div className="score-header">
              <h3>Overall Transparency Score</h3>
              <span className="score-grade" style={{ color: getGradeColor(latestSection?.transparency_grade || 'C') }}>
                {latestSection?.transparency_grade || 'N/A'}
              </span>
            </div>
            <div className="score-value">
              {(latestSection?.overall_transparency_score || 0).toFixed(3)}
            </div>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ 
                  width: `${(latestSection?.overall_transparency_score || 0) * 100}%`,
                  backgroundColor: getScoreColor(latestSection?.overall_transparency_score || 0)
                }}
              ></div>
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="trend-card">
            <div className="trend-header">
              <h3>Trend Analysis</h3>
              <span 
                className="trend-direction"
                style={{ color: getTrendColor(currentCompanyData.trend_analysis.trend_direction) }}
              >
                {currentCompanyData.trend_analysis.trend_direction.toUpperCase()}
              </span>
            </div>
            <div className="trend-value">
              {currentCompanyData.trend_analysis.overall_trend > 0 ? '+' : ''}
              {currentCompanyData.trend_analysis.overall_trend.toFixed(3)}
            </div>
            <div className="trend-years">
              Analyzed: {currentCompanyData.trend_analysis.years_analyzed.join(' → ')}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Readability Score</div>
              <div className="metric-value">{(latestSection?.readability.flesch_reading_ease || 0).toFixed(1)}</div>
              <div className="metric-sub">Flesch Reading Ease</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Specificity Score</div>
              <div className="metric-value">{(latestSection?.specificity.specificity_score || 0).toFixed(3)}</div>
              <div className="metric-sub">Content Precision</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Richness Score</div>
              <div className="metric-value">{(latestSection?.richness.information_richness_score || 0).toFixed(3)}</div>
              <div className="metric-sub">Information Density</div>
            </div>
          </div>
        </div>

        {/* Yearly Performance */}
        <div className="yearly-performance">
          <h3>Yearly Performance</h3>
          <div className="yearly-grid">
            {Object.entries(currentCompanyData.yearly_averages).map(([year, score]) => (
              <div key={year} className="year-card">
                <div className="year-label">FY {year}</div>
                <div className="year-score" style={{ color: getScoreColor(score) }}>
                  {score.toFixed(3)}
                </div>
                <div className="year-bar">
                  <div 
                    className="year-fill" 
                    style={{ 
                      width: `${score * 100}%`,
                      backgroundColor: getScoreColor(score)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Notes */}
        <div className="calculation-notes">
          <h3>How Overall Transparency is Calculated</h3>
          <div className="notes-grid">
            <div className="note-card">
              <h4>Transparency Score</h4>
              <p><strong>Formula:</strong> Weighted average of specificity, clarity, and completeness scores</p>
              <p><strong>Components:</strong> Specificity (40%), Clarity (35%), Completeness (25%)</p>
              <p><strong>Range:</strong> 0 (Low transparency) to 1 (High transparency)</p>
            </div>
            
            <div className="note-card">
              <h4>Readability Score</h4>
              <p><strong>Formula:</strong> Flesch Reading Ease score (0-100)</p>
              <p><strong>Interpretation:</strong> Higher scores indicate easier-to-read text</p>
              <p><strong>Scale:</strong> 90-100 (Very Easy) to 0-30 (Very Difficult)</p>
            </div>
            
            <div className="note-card">
              <h4>Consistency Score</h4>
              <p><strong>Formula:</strong> Weighted average of similarity metrics and stability indicators</p>
              <p><strong>Components:</strong> Jaccard similarity, Cosine similarity, Stability indicators</p>
              <p><strong>Range:</strong> 0 (No consistency) to 1 (Perfect consistency)</p>
            </div>
            
            <div className="note-card">
              <h4>Information Richness Score</h4>
              <p><strong>Formula:</strong> Weighted average of content density and lexical diversity</p>
              <p><strong>Components:</strong> Content word ratio, Technical term ratio, Lexical diversity</p>
              <p><strong>Range:</strong> 0 (Low richness) to 1 (High richness)</p>
            </div>
            
            <div className="note-card">
              <h4>Overall Transparency Index</h4>
              <p><strong>Formula:</strong> (Transparency × 0.4) + (Readability/100 × 0.25) + (Consistency × 0.2) + (Richness × 0.15)</p>
              <p><strong>Weighting:</strong> Transparency (40%), Readability (25%), Consistency (20%), Richness (15%)</p>
              <p><strong>Range:</strong> 0 (Low transparency) to 1 (High transparency)</p>
            </div>
            
            <div className="note-card">
              <h4>Grade Assignment</h4>
              <p><strong>A+: 0.90-1.00</strong> - Exceptional transparency and disclosure quality</p>
              <p><strong>A: 0.80-0.89</strong> - Excellent transparency with minor areas for improvement</p>
              <p><strong>B: 0.70-0.79</strong> - Good transparency with some improvement opportunities</p>
              <p><strong>C: 0.60-0.69</strong> - Moderate transparency with several areas needing attention</p>
              <p><strong>D: 0.50-0.59</strong> - Limited transparency with significant improvement needed</p>
              <p><strong>F: 0.00-0.49</strong> - Poor transparency requiring major improvements</p>
            </div>
          </div>
          
          <div className="notes-footer">
            <p><strong>Note:</strong> The overall transparency analysis combines multiple linguistic and content analysis metrics to provide a comprehensive assessment of disclosure quality. Each component is weighted based on its importance in effective corporate communication, with transparency being the most critical factor.</p>
          </div>
        </div>
      </div>
    );
  };

  const renderReadability = () => {
    if (!currentSectionData) return null;

    return (
      <ReadabilityMetrics 
        readability={currentSectionData.readability}
        companyName={currentCompanyData?.company_name || ""}
        section={selectedSection}
        year={selectedYear}
      />
    );
  };

  const renderSpecificity = () => {
    if (!currentSectionData) return null;

    return (
      <SpecificityAnalysis 
        specificity={currentSectionData.specificity}
        companyName={currentCompanyData?.company_name || ""}
        section={selectedSection}
        year={selectedYear}
      />
    );
  };

  const renderConsistency = () => {
    if (!currentCompanyData) return null;

    return (
      <ConsistencyReport 
        companyData={currentCompanyData}
        selectedYear={selectedYear}
        selectedSection={selectedSection}
      />
    );
  };

  const renderRichness = () => {
    if (!currentSectionData) return null;

    return (
      <RichnessDashboard 
        richness={currentSectionData.richness}
        companyName={currentCompanyData?.company_name || ""}
        section={selectedSection}
        year={selectedYear}
      />
    );
  };

  const renderComparison = () => {
    const industry = "Technology"; // Default for our sample companies
    const benchmark = industryBenchmarks.find(b => b.industry === industry);

    return (
      <div className="comparison-container">
        <div className="comparison-header">
          <h2>Industry Comparison</h2>
          <p className="comparison-subtitle">
            How {currentCompanyData?.company_name || selectedCompany} compares to the {industry} industry
          </p>
        </div>

        {benchmark && (
          <div className="comparison-grid">
            <div className="benchmark-card">
              <h3>Industry Benchmark</h3>
              <div className="benchmark-score">{benchmark.average_transparency_score.toFixed(3)}</div>
              <div className="benchmark-range">
                Range: {benchmark.bottom_quartile.toFixed(3)} - {benchmark.top_quartile.toFixed(3)}
              </div>
              <div className="benchmark-companies">
                Peers: {benchmark.peer_companies.join(', ')}
              </div>
            </div>

            <div className="company-comparison">
              <h3>Company Performance</h3>
              {transparencyData.map(company => {
                const latestScore = company.sections.find(s => s.fiscal_year === selectedYear && s.section === selectedSection)?.overall_transparency_score || 0;
                return (
                  <div key={company.ticker} className="company-row">
                    <span className="company-name">{company.company_name}</span>
                    <div className="company-score-container">
                      <span className="company-score">{latestScore.toFixed(3)}</span>
                      <div className="company-bar">
                        <div 
                          className="company-fill" 
                          style={{ 
                            width: `${latestScore * 100}%`,
                            backgroundColor: getScoreColor(latestScore)
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInvestorGuide = () => {
    return (
      <div className="investor-guide">
        <div className="guide-header">
          <h2>Investor's Guide to 10-K Disclosure Transparency</h2>
          <p className="guide-subtitle">
            How to use this analysis to make informed investment decisions
          </p>
        </div>

        <div className="guide-content">
          {/* Why Disclosure Transparency Matters */}
          <div className="guide-section">
            <h3>🔍 Why Disclosure Transparency Matters</h3>
            <div className="guide-card">
              <div className="card-content">
                <p><strong>Transparency = Trust:</strong> High-quality disclosures indicate a company that values clear communication with investors and stakeholders.</p>
                <p><strong>Risk Assessment:</strong> Transparent companies provide clearer insights into their risks, helping you better assess potential downside.</p>
                <p><strong>Decision Quality:</strong> Better information leads to more informed investment decisions and reduces information asymmetry.</p>
                <p><strong>Long-term Focus:</strong> Companies with transparent disclosures often have better governance and long-term orientation.</p>
              </div>
            </div>
          </div>

          {/* How to Interpret the Scores */}
          <div className="guide-section">
            <h3>📊 How to Interpret the Scores</h3>
            <div className="interpretation-grid">
              <div className="interpretation-card">
                <div className="card-header">
                  <span className="card-icon">📈</span>
                  <h4>Overall Transparency Score</h4>
                </div>
                <div className="card-content">
                  <p><strong>A+ to A (0.80-1.00):</strong> Exceptional disclosure quality. These companies provide comprehensive, clear, and informative disclosures.</p>
                  <p><strong>B to B+ (0.70-0.79):</strong> Good disclosure quality with room for improvement. Generally reliable information source.</p>
                  <p><strong>C to C+ (0.60-0.69):</strong> Moderate disclosure quality. May require additional research to fill information gaps.</p>
                  <p><strong>D to F (0.00-0.59):</strong> Poor disclosure quality. Exercise caution and seek additional information sources.</p>
                </div>
              </div>

              <div className="interpretation-card">
                <div className="card-header">
                  <span className="card-icon">📖</span>
                  <h4>Readability Score</h4>
                </div>
                <div className="card-content">
                  <p><strong>80-100 (Easy):</strong> Accessible to general public. Good for broad investor understanding.</p>
                  <p><strong>60-79 (Standard):</strong> Requires some business knowledge. Typical for most 10-Ks.</p>
                  <p><strong>30-59 (Difficult):</strong> Complex language. May indicate attempts to obscure information.</p>
                  <p><strong>0-29 (Very Difficult):</strong> Highly technical. Consider seeking professional analysis.</p>
                </div>
              </div>

              <div className="interpretation-card">
                <div className="card-header">
                  <span className="card-icon">🎯</span>
                  <h4>Specificity Score</h4>
                </div>
                <div className="card-content">
                  <p><strong>High Specificity:</strong> Uses precise, concrete language. Indicates detailed and actionable information.</p>
                  <p><strong>Low Specificity:</strong> Uses vague, non-specific language. May indicate lack of concrete plans or transparency issues.</p>
                  <p><strong>Industry Terms:</strong> Appropriate use of industry-specific terminology shows expertise and context.</p>
                  <p><strong>Risk Specificity:</strong> Specific risk factors are more useful than generic statements.</p>
                </div>
              </div>

              <div className="interpretation-card">
                <div className="card-header">
                  <span className="card-icon">🔄</span>
                  <h4>Consistency Score</h4>
                </div>
                <div className="card-content">
                  <p><strong>High Consistency:</strong> Stable disclosure practices year-over-year. Good for trend analysis.</p>
                  <p><strong>Low Consistency:</strong> Significant changes in disclosure approach. Investigate reasons for changes.</p>
                  <p><strong>Change Indicators:</strong> High change frequency may indicate strategic shifts or accounting changes.</p>
                  <p><strong>Stability Indicators:</strong> High stability suggests consistent business practices and reporting.</p>
                </div>
              </div>

              <div className="interpretation-card">
                <div className="card-header">
                  <span className="card-icon">💎</span>
                  <h4>Information Richness</h4>
                </div>
                <div className="card-content">
                  <p><strong>High Richness:</strong> Dense with valuable information. Minimal filler content.</p>
                  <p><strong>Low Richness:</strong> Contains significant filler or redundant information.</p>
                  <p><strong>Content Words:</strong> Higher ratio indicates more substantive content.</p>
                  <p><strong>Lexical Diversity:</strong> Varied vocabulary suggests comprehensive coverage of topics.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Decision Framework */}
          <div className="guide-section">
            <h3>💼 Investment Decision Framework</h3>
            <div className="framework-grid">
              <div className="framework-card">
                <div className="card-header">
                  <span className="card-icon">✅</span>
                  <h4>Buy Signal Indicators</h4>
                </div>
                <div className="card-content">
                  <ul>
                    <li>Overall transparency score: A or A+</li>
                    <li>Consistency score: B+ or higher</li>
                    <li>Readability: 60+ (accessible but substantive)</li>
                    <li>Information richness: B or higher</li>
                    <li>Improving trend over multiple years</li>
                    <li>Industry-leading transparency compared to peers</li>
                  </ul>
                </div>
              </div>

              <div className="framework-card">
                <div className="card-header">
                  <span className="card-icon">⚠️</span>
                  <h4>Caution Indicators</h4>
                </div>
                <div className="card-content">
                  <ul>
                    <li>Overall transparency score: C or lower</li>
                    <li>Readability: Very low (0-30) or very high (90-100)</li>
                    <li>Low specificity with vague language</li>
                    <li>Poor consistency with frequent changes</li>
                    <li>Declining trend over multiple years</li>
                    <li>Significantly below industry average</li>
                  </ul>
                </div>
              </div>

              <div className="framework-card">
                <div className="card-header">
                  <span className="card-icon">🔍</span>
                  <h4>Research Required</h4>
                </div>
                <div className="card-content">
                  <ul>
                    <li>Overall transparency score: B to B-</li>
                    <li>Inconsistent scores across different metrics</li>
                    <li>Recent significant changes in disclosure practices</li>
                    <li>Industry-specific factors affecting transparency</li>
                    <li>Company-specific circumstances (turnaround, M&A, etc.)</li>
                    <li>Compare with other information sources</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Practical Application */}
          <div className="guide-section">
            <h3>🎯 Practical Application</h3>
            <div className="application-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Compare Across Peers</h4>
                  <p>Use the Industry Comparison tab to see how your target company compares to competitors in transparency metrics.</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Analyze Trends</h4>
                  <p>Check the Yearly Performance section to see if transparency is improving, declining, or stable over time.</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Examine Specific Sections</h4>
                  <p>Look at different sections (Risk Factors, MD&A) as they may have different transparency levels.</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Contextualize with Fundamentals</h4>
                  <p>Combine transparency analysis with traditional financial analysis for comprehensive investment decisions.</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h4>Monitor Changes</h4>
                  <p>Regularly check for changes in transparency scores as they may indicate underlying business changes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Limitations and Considerations */}
          <div className="guide-section">
            <h3>⚠️ Limitations and Considerations</h3>
            <div className="limitations-grid">
              <div className="limitation-card">
                <h4>Quantitative vs Qualitative</h4>
                <p>This analysis focuses on quantitative aspects of disclosure. Qualitative factors like management quality and industry dynamics are equally important.</p>
              </div>
              
              <div className="limitation-card">
                <h4>Industry Differences</h4>
                <p>Transparency standards vary by industry. A "good" score in one industry might be "poor" in another.</p>
              </div>
              
              <div className="limitation-card">
                <h4>Regulatory Requirements</h4>
                <p>Some disclosures are mandated by regulators and may not reflect the company's voluntary transparency efforts.</p>
              </div>
              
              <div className="limitation-card">
                <h4>Context Matters</h4>
                <p>Low transparency during difficult periods might be due to uncertainty rather than poor governance.</p>
              </div>
            </div>
          </div>

          {/* Integration with Investment Process */}
          <div className="guide-section">
            <h3>🔗 Integration with Investment Process</h3>
            <div className="integration-content">
              <div className="integration-step">
                <h4>Due Diligence Phase</h4>
                <p>Use transparency analysis as part of your initial screening process to identify companies with high-quality disclosures.</p>
              </div>
              
              <div className="integration-step">
                <h4>Valuation Phase</h4>
                <p>Consider transparency scores when applying valuation multiples. Higher transparency may warrant premium multiples.</p>
              </div>
              
              <div className="integration-step">
                <h4>Risk Assessment</h4>
                <p>Incorporate transparency analysis into your risk assessment framework. Poor transparency increases information risk.</p>
              </div>
              
              <div className="integration-step">
                <h4>Portfolio Monitoring</h4>
                <p>Regularly monitor transparency scores as part of your portfolio management process.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="disclosure-analysis">
      {/* Header */}
      <div className="analysis-header">
        <div className="header-content">
          <h1>10-K Disclosure Transparency Analysis</h1>
          <p className="header-subtitle">
            Comprehensive analysis of disclosure clarity, specificity, and informativeness
          </p>
        </div>
        
        {/* Controls */}
        <div className="analysis-controls">
          <div className="control-group">
            <label>Company</label>
            <select 
              value={selectedCompany} 
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              {companies.map(company => (
                <option key={company.ticker} value={company.ticker}>
                  {company.name} ({company.ticker})
                </option>
              ))}
            </select>
          </div>
          
          <div className="control-group">
            <label>Section</label>
            <select 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              {sections.map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>
          
          <div className="control-group">
            <label>Year</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {[2022, 2023, 2024].map(year => (
                <option key={year} value={year}>FY {year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="analysis-nav">
        {analysisTabs.map(tab => (
          <button
            key={tab.key}
            className={`nav-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="analysis-content">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "readability" && renderReadability()}
        {activeTab === "specificity" && renderSpecificity()}
        {activeTab === "consistency" && renderConsistency()}
        {activeTab === "richness" && renderRichness()}
        {activeTab === "comparison" && renderComparison()}
        {activeTab === "investor-guide" && renderInvestorGuide()}
      </div>
    </div>
  );
};

export default DisclosureAnalysis;