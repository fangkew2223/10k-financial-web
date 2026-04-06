import React from "react";
import "./ConsistencyReport.css";

interface ConsistencyReportProps {
  companyData: {
    ticker: string;
    company_name: string;
    sections: Array<{
      section: string;
      fiscal_year: number;
      consistency?: {
        jaccard_similarity: number;
        cosine_similarity: number;
        risk_term_consistency: number;
        financial_term_consistency: number;
        change_indicators_score: number;
        stability_indicators_score: number;
        overall_consistency_score: number;
        consistency_grade: string;
        vocabulary_overlap: number;
        total_unique_words: number;
        current_word_count: number;
        previous_word_count: number;
      };
    }>;
    yearly_averages: { [year: number]: number };
    trend_analysis: {
      overall_trend: number;
      trend_direction: 'improving' | 'declining' | 'stable';
      years_analyzed: number[];
    };
  };
  selectedYear: number;
  selectedSection: string;
}

const ConsistencyReport: React.FC<ConsistencyReportProps> = ({
  companyData,
  selectedYear,
  selectedSection
}) => {
  const currentSection = companyData.sections.find(
    s => s.section === selectedSection && s.fiscal_year === selectedYear
  );

  const previousYear = selectedYear - 1;
  // Note: previousSection is available for future use when we have more data
  // const previousSection = companyData.sections.find(
  //   s => s.section === selectedSection && s.fiscal_year === previousYear
  // );

  const consistency = currentSection?.consistency;

  const getConsistencyColor = (score: number) => {
    if (score >= 0.8) return '#22c55e';
    if (score >= 0.6) return '#3b82f6';
    if (score >= 0.4) return '#f59e0b';
    return '#ef4444';
  };

  const getConsistencyGrade = (score: number) => {
    if (score >= 0.9) return 'A+';
    if (score >= 0.8) return 'A';
    if (score >= 0.7) return 'B';
    if (score >= 0.6) return 'C';
    if (score >= 0.5) return 'D';
    return 'F';
  };

  const formatPercentage = (score: number) => {
    return (score * 100).toFixed(1) + '%';
  };

  const getTrendDirection = (score: number) => {
    if (score > 0.1) return { direction: 'Improving', color: '#22c55e', icon: '📈' };
    if (score < -0.1) return { direction: 'Declining', color: '#ef4444', icon: '📉' };
    return { direction: 'Stable', color: '#6b7280', icon: '➡️' };
  };

  const trend = getTrendDirection(companyData.trend_analysis.overall_trend);

  return (
    <div className="consistency-report">
      <div className="report-header">
        <h2>Disclosure Consistency Analysis</h2>
        <p className="report-subtitle">
          Comparing {companyData.company_name}'s {selectedSection} disclosure between FY {previousYear} and FY {selectedYear}
        </p>
      </div>

      <div className="report-grid">
        {/* Overall Consistency Score */}
        <div className="overall-consistency-card">
          <div className="consistency-header">
            <h3>Overall Consistency Score</h3>
            <span 
              className="consistency-grade" 
              style={{ color: getConsistencyColor(consistency?.overall_consistency_score || 0) }}
            >
              {getConsistencyGrade(consistency?.overall_consistency_score || 0)}
            </span>
          </div>
          <div className="consistency-value">{(consistency?.overall_consistency_score || 0).toFixed(3)}</div>
          <div className="consistency-bar">
            <div 
              className="consistency-fill" 
              style={{ 
                width: `${(consistency?.overall_consistency_score || 0) * 100}%`,
                backgroundColor: getConsistencyColor(consistency?.overall_consistency_score || 0)
              }}
            ></div>
          </div>
          <div className="consistency-desc">Higher scores indicate greater year-over-year consistency</div>
        </div>

        {/* Consistency Metrics */}
        <div className="consistency-metrics">
          <h3>Consistency Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Jaccard Similarity</span>
                <span className="metric-value">{formatPercentage(consistency?.jaccard_similarity || 0)}</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ 
                    width: `${(consistency?.jaccard_similarity || 0) * 100}%`,
                    backgroundColor: getConsistencyColor(consistency?.jaccard_similarity || 0)
                  }}
                ></div>
              </div>
              <div className="metric-desc">Vocabulary overlap between years</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Cosine Similarity</span>
                <span className="metric-value">{formatPercentage(consistency?.cosine_similarity || 0)}</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ 
                    width: `${(consistency?.cosine_similarity || 0) * 100}%`,
                    backgroundColor: getConsistencyColor(consistency?.cosine_similarity || 0)
                  }}
                ></div>
              </div>
              <div className="metric-desc">Semantic similarity of content</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Risk Term Consistency</span>
                <span className="metric-value">{formatPercentage(consistency?.risk_term_consistency || 0)}</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ 
                    width: `${(consistency?.risk_term_consistency || 0) * 100}%`,
                    backgroundColor: getConsistencyColor(consistency?.risk_term_consistency || 0)
                  }}
                ></div>
              </div>
              <div className="metric-desc">Consistency in risk terminology</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Financial Term Consistency</span>
                <span className="metric-value">{formatPercentage(consistency?.financial_term_consistency || 0)}</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ 
                    width: `${(consistency?.financial_term_consistency || 0) * 100}%`,
                    backgroundColor: getConsistencyColor(consistency?.financial_term_consistency || 0)
                  }}
                ></div>
              </div>
              <div className="metric-desc">Consistency in financial terminology</div>
            </div>
          </div>
        </div>

        {/* Change Analysis */}
        <div className="change-analysis">
          <h3>Change Analysis</h3>
          <div className="change-grid">
            <div className="change-card">
              <div className="change-header">
                <span className="change-label">Change Indicators</span>
                <span className="change-value">{formatPercentage(consistency?.change_indicators_score || 0)}</span>
              </div>
              <div className="change-bar">
                <div 
                  className="change-fill"
                  style={{ 
                    width: `${(consistency?.change_indicators_score || 0) * 100}%`,
                    backgroundColor: getConsistencyColor(consistency?.change_indicators_score || 0)
                  }}
                ></div>
              </div>
              <div className="change-desc">Frequency of change-related language</div>
            </div>

            <div className="change-card">
              <div className="change-header">
                <span className="change-label">Stability Indicators</span>
                <span className="change-value">{formatPercentage(consistency?.stability_indicators_score || 0)}</span>
              </div>
              <div className="change-bar">
                <div 
                  className="change-fill"
                  style={{ 
                    width: `${(consistency?.stability_indicators_score || 0) * 100}%`,
                    backgroundColor: getConsistencyColor(consistency?.stability_indicators_score || 0)
                  }}
                ></div>
              </div>
              <div className="change-desc">Frequency of stability-related language</div>
            </div>
          </div>
        </div>
      </div>

      {/* Word Analysis */}
      <div className="word-analysis">
        <h3>Word Count Analysis</h3>
        <div className="word-count-grid">
          <div className="word-count-card">
            <div className="word-count-header">
              <span className="word-count-label">Current Year ({selectedYear})</span>
              <span className="word-count-value">{(consistency?.current_word_count || 0).toLocaleString()}</span>
            </div>
            <div className="word-count-desc">Total words in disclosure</div>
          </div>

          <div className="word-count-card">
            <div className="word-count-header">
              <span className="word-count-label">Previous Year ({previousYear})</span>
              <span className="word-count-value">{(consistency?.previous_word_count || 0).toLocaleString()}</span>
            </div>
            <div className="word-count-desc">Total words in disclosure</div>
          </div>

          <div className="word-count-card">
            <div className="word-count-header">
              <span className="word-count-label">Vocabulary Overlap</span>
              <span className="word-count-value">{formatPercentage(consistency?.vocabulary_overlap || 0)}</span>
            </div>
            <div className="word-count-desc">Percentage of shared vocabulary</div>
          </div>

          <div className="word-count-card">
            <div className="word-count-header">
              <span className="word-count-label">Unique Words</span>
              <span className="word-count-value">{(consistency?.total_unique_words || 0).toLocaleString()}</span>
            </div>
            <div className="word-count-desc">Total unique words across both years</div>
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="trend-analysis">
        <h3>Trend Analysis</h3>
        <div className="trend-content">
          <div className="trend-card">
            <div className="trend-header">
              <span className="trend-icon">{trend.icon}</span>
              <span 
                className="trend-direction"
                style={{ color: trend.color }}
              >
                {trend.direction}
              </span>
            </div>
            <div className="trend-value">
              {companyData.trend_analysis.overall_trend > 0 ? '+' : ''}
              {companyData.trend_analysis.overall_trend.toFixed(3)}
            </div>
            <div className="trend-desc">Overall trend across {companyData.trend_analysis.years_analyzed.join(', ')}</div>
          </div>

          <div className="trend-years">
            <h4>Yearly Performance</h4>
            <div className="trend-years-grid">
              {Object.entries(companyData.yearly_averages).map(([year, score]) => (
                <div key={year} className="trend-year-card">
                  <span className="trend-year-label">FY {year}</span>
                  <span className="trend-year-score" style={{ color: getConsistencyColor(score) }}>
                    {score.toFixed(3)}
                  </span>
                  <div className="trend-year-bar">
                    <div 
                      className="trend-year-fill" 
                      style={{ 
                        width: `${score * 100}%`,
                        backgroundColor: getConsistencyColor(score)
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="consistency-interpretation">
        <h3>Interpretation</h3>
        <div className="interpretation-content">
          <div className="interpretation-item">
            <span className="interpretation-label">Overall Consistency:</span>
            <span 
              className="interpretation-value"
              style={{ color: getConsistencyColor(consistency?.overall_consistency_score || 0) }}
            >
              {getConsistencyGrade(consistency?.overall_consistency_score || 0)} ({(consistency?.overall_consistency_score || 0).toFixed(3)})
            </span>
          </div>
          <div className="interpretation-item">
            <span className="interpretation-label">Content Stability:</span>
            <span className="interpretation-value">
              {consistency?.stability_indicators_score && consistency.stability_indicators_score > 0.7 ? "Highly stable content" : 
               consistency?.change_indicators_score && consistency.change_indicators_score > 0.3 ? "Significant changes detected" : 
               "Moderate stability"}
            </span>
          </div>
          <div className="interpretation-item">
            <span className="interpretation-label">Vocabulary Consistency:</span>
            <span className="interpretation-value">
              {consistency?.vocabulary_overlap && consistency.vocabulary_overlap > 0.6 ? "Strong vocabulary consistency" : 
               consistency?.vocabulary_overlap && consistency.vocabulary_overlap > 0.4 ? "Moderate vocabulary consistency" : 
               "Low vocabulary consistency"}
            </span>
          </div>
          <div className="interpretation-item">
            <span className="interpretation-label">Trend Direction:</span>
            <span 
              className="interpretation-value"
              style={{ color: trend.color }}
            >
              {trend.direction} ({trend.icon})
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="consistency-recommendations">
        <h3>Recommendations</h3>
        <div className="recommendations-list">
          {consistency?.overall_consistency_score && consistency.overall_consistency_score < 0.5 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">⚠️</span>
              <span className="recommendation-text">
                Consider maintaining more consistent terminology and structure year-over-year
              </span>
            </div>
          )}
          {consistency?.change_indicators_score && consistency.change_indicators_score > 0.5 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">📝</span>
              <span className="recommendation-text">
                Document significant changes clearly to help investors understand what has changed
              </span>
            </div>
          )}
          {consistency?.vocabulary_overlap && consistency.vocabulary_overlap < 0.4 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">📚</span>
              <span className="recommendation-text">
                Standardize key terminology to improve consistency across reporting periods
              </span>
            </div>
          )}
          {consistency?.overall_consistency_score && consistency.overall_consistency_score >= 0.7 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">✅</span>
              <span className="recommendation-text">
                Disclosure demonstrates good year-over-year consistency
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Calculation Notes */}
      <div className="calculation-notes">
        <h3>How Consistency is Calculated</h3>
        <div className="notes-grid">
          <div className="note-card">
            <h4>Jaccard Similarity</h4>
            <p><strong>Formula:</strong> |A ∩ B| / |A ∪ B|</p>
            <p><strong>Where:</strong> A = vocabulary set from current year, B = vocabulary set from previous year</p>
            <p><strong>Interpretation:</strong> Measures vocabulary overlap between reporting periods</p>
          </div>
          
          <div className="note-card">
            <h4>Cosine Similarity</h4>
            <p><strong>Formula:</strong> (A · B) / (||A|| × ||B||)</p>
            <p><strong>Where:</strong> A, B = word frequency vectors from each year</p>
            <p><strong>Interpretation:</strong> Measures semantic similarity of content</p>
          </div>
          
          <div className="note-card">
            <h4>Risk Term Consistency</h4>
            <p><strong>Formula:</strong> Overlap of risk-related terms / Total risk terms</p>
            <p><strong>Risk Terms:</strong> Words like "risk", "uncertainty", "exposure", "volatility"</p>
            <p><strong>Interpretation:</strong> Consistency in risk factor disclosure</p>
          </div>
          
          <div className="note-card">
            <h4>Financial Term Consistency</h4>
            <p><strong>Formula:</strong> Overlap of financial terms / Total financial terms</p>
            <p><strong>Financial Terms:</strong> Words like "revenue", "profit", "margin", "liability"</p>
            <p><strong>Interpretation:</strong> Consistency in financial terminology</p>
          </div>
          
          <div className="note-card">
            <h4>Change Indicators</h4>
            <p><strong>Formula:</strong> Count of change-related words / Total word count</p>
            <p><strong>Change Words:</strong> "changed", "modified", "updated", "revised", "new"</p>
            <p><strong>Interpretation:</strong> Frequency of language indicating changes</p>
          </div>
          
          <div className="note-card">
            <h4>Stability Indicators</h4>
            <p><strong>Formula:</strong> Count of stability-related words / Total word count</p>
            <p><strong>Stability Words:</strong> "consistent", "stable", "unchanged", "maintained"</p>
            <p><strong>Interpretation:</strong> Frequency of language indicating stability</p>
          </div>
        </div>
        
        <div className="notes-footer">
          <p><strong>Note:</strong> Consistency analysis compares vocabulary, terminology, and language patterns between consecutive reporting periods. Higher scores indicate more stable and predictable disclosure practices, which helps investors track changes and understand the company's evolution over time.</p>
        </div>
      </div>
    </div>
  );
};

export default ConsistencyReport;