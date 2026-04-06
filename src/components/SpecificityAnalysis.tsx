import React from "react";
import "./SpecificityAnalysis.css";

interface SpecificityAnalysisProps {
  specificity: {
    specific_word_ratio: number;
    vague_word_ratio: number;
    industry_term_ratio: number;
    risk_term_ratio: number;
    specificity_score: number;
    industry_expertise_score: number;
    risk_awareness_score: number;
    total_words: number;
    unique_words: number;
  };
  companyName: string;
  section: string;
  year: number;
}

const SpecificityAnalysis: React.FC<SpecificityAnalysisProps> = ({
  specificity,
  companyName,
  section,
  year
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return '#22c55e';
    if (score >= 0.7) return '#3b82f6';
    if (score >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 0.9) return 'A+';
    if (score >= 0.8) return 'A';
    if (score >= 0.7) return 'B';
    if (score >= 0.6) return 'C';
    if (score >= 0.5) return 'D';
    return 'F';
  };

  const formatPercentage = (ratio: number) => {
    return (ratio * 100).toFixed(2) + '%';
  };

  return (
    <div className="specificity-analysis">
      <div className="analysis-header">
        <h2>Disclosure Specificity Analysis</h2>
        <p className="analysis-subtitle">
          Measuring the precision and informativeness of {companyName}'s {section} disclosure for FY {year}
        </p>
      </div>

      <div className="analysis-grid">
        {/* Overall Specificity Score */}
        <div className="overall-score-card">
          <div className="score-header">
            <h3>Overall Specificity Score</h3>
            <span 
              className="score-grade" 
              style={{ color: getScoreColor(specificity.specificity_score) }}
            >
              {getScoreGrade(specificity.specificity_score)}
            </span>
          </div>
          <div className="score-value">{specificity.specificity_score.toFixed(3)}</div>
          <div className="score-bar">
            <div 
              className="score-fill" 
              style={{ 
                width: `${specificity.specificity_score * 100}%`,
                backgroundColor: getScoreColor(specificity.specificity_score)
              }}
            ></div>
          </div>
          <div className="score-desc">Higher scores indicate more precise and specific language</div>
        </div>

        {/* Specificity Breakdown */}
        <div className="specificity-breakdown">
          <h3>Content Analysis</h3>
          <div className="breakdown-grid">
            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">Specific Words</span>
                <span className="breakdown-value">{formatPercentage(specificity.specific_word_ratio)}</span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill specific-fill"
                  style={{ width: `${specificity.specific_word_ratio * 100}%` }}
                ></div>
              </div>
              <div className="breakdown-desc">Precise, unambiguous terms</div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">Vague Words</span>
                <span className="breakdown-value">{formatPercentage(specificity.vague_word_ratio)}</span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill vague-fill"
                  style={{ width: `${specificity.vague_word_ratio * 100}%` }}
                ></div>
              </div>
              <div className="breakdown-desc">Ambiguous, non-specific terms</div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">Industry Terms</span>
                <span className="breakdown-value">{formatPercentage(specificity.industry_term_ratio)}</span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill industry-fill"
                  style={{ width: `${specificity.industry_term_ratio * 100}%` }}
                ></div>
              </div>
              <div className="breakdown-desc">Specialized industry vocabulary</div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">Risk Terms</span>
                <span className="breakdown-value">{formatPercentage(specificity.risk_term_ratio)}</span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill risk-fill"
                  style={{ width: `${specificity.risk_term_ratio * 100}%` }}
                ></div>
              </div>
              <div className="breakdown-desc">Specific risk-related terminology</div>
            </div>
          </div>
        </div>

        {/* Expertise Scores */}
        <div className="expertise-scores">
          <h3>Expertise Assessment</h3>
          <div className="scores-grid">
            <div className="score-card">
              <div className="score-title">Industry Expertise</div>
              <div 
                className="score-number"
                style={{ color: getScoreColor(specificity.industry_expertise_score) }}
              >
                {specificity.industry_expertise_score.toFixed(3)}
              </div>
              <div className="score-bar">
                <div 
                  className="score-fill"
                  style={{ 
                    width: `${specificity.industry_expertise_score * 100}%`,
                    backgroundColor: getScoreColor(specificity.industry_expertise_score)
                  }}
                ></div>
              </div>
              <div className="score-grade">{getScoreGrade(specificity.industry_expertise_score)}</div>
            </div>

            <div className="score-card">
              <div className="score-title">Risk Awareness</div>
              <div 
                className="score-number"
                style={{ color: getScoreColor(specificity.risk_awareness_score) }}
              >
                {specificity.risk_awareness_score.toFixed(3)}
              </div>
              <div className="score-bar">
                <div 
                  className="score-fill"
                  style={{ 
                    width: `${specificity.risk_awareness_score * 100}%`,
                    backgroundColor: getScoreColor(specificity.risk_awareness_score)
                  }}
                ></div>
              </div>
              <div className="score-grade">{getScoreGrade(specificity.risk_awareness_score)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Word Analysis */}
      <div className="word-analysis">
        <h3>Word Analysis</h3>
        <div className="word-stats">
          <div className="word-stat">
            <span className="stat-label">Total Words</span>
            <span className="stat-value">{specificity.total_words.toLocaleString()}</span>
          </div>
          <div className="word-stat">
            <span className="stat-label">Unique Words</span>
            <span className="stat-value">{specificity.unique_words.toLocaleString()}</span>
          </div>
          <div className="word-stat">
            <span className="stat-label">Lexical Diversity</span>
            <span className="stat-value">{(specificity.unique_words / specificity.total_words).toFixed(3)}</span>
          </div>
          <div className="word-stat">
            <span className="stat-label">Specificity Ratio</span>
            <span className="stat-value">{formatPercentage(specificity.specific_word_ratio)}</span>
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="specificity-interpretation">
        <h3>Interpretation</h3>
        <div className="interpretation-content">
          <div className="interpretation-item">
            <span className="interpretation-label">Content Precision:</span>
            <span 
              className="interpretation-value"
              style={{ color: getScoreColor(specificity.specificity_score) }}
            >
              {getScoreGrade(specificity.specificity_score)} ({specificity.specificity_score.toFixed(3)})
            </span>
          </div>
          <div className="interpretation-item">
            <span className="interpretation-label">Industry Knowledge:</span>
            <span 
              className="interpretation-value"
              style={{ color: getScoreColor(specificity.industry_expertise_score) }}
            >
              {getScoreGrade(specificity.industry_expertise_score)} ({specificity.industry_expertise_score.toFixed(3)})
            </span>
          </div>
          <div className="interpretation-item">
            <span className="interpretation-label">Risk Communication:</span>
            <span 
              className="interpretation-value"
              style={{ color: getScoreColor(specificity.risk_awareness_score) }}
            >
              {getScoreGrade(specificity.risk_awareness_score)} ({specificity.risk_awareness_score.toFixed(3)})
            </span>
          </div>
          <div className="interpretation-item">
            <span className="interpretation-label">Language Clarity:</span>
            <span className="interpretation-value">
              {specificity.specific_word_ratio > 0.1 ? "Clear and precise" : 
               specificity.vague_word_ratio > 0.1 ? "Contains vague language" : 
               "Moderate clarity"}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="specificity-recommendations">
        <h3>Recommendations</h3>
        <div className="recommendations-list">
          {specificity.specific_word_ratio < 0.1 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">⚠️</span>
              <span className="recommendation-text">
                Consider using more specific terminology to improve clarity and precision
              </span>
            </div>
          )}
          {specificity.vague_word_ratio > 0.1 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">📝</span>
              <span className="recommendation-text">
                Reduce use of vague terms like "significant", "material", "substantial"
              </span>
            </div>
          )}
          {specificity.industry_term_ratio < 0.05 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">📚</span>
              <span className="recommendation-text">
                Incorporate more industry-specific terminology to demonstrate expertise
              </span>
            </div>
          )}
          {specificity.risk_term_ratio < 0.03 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">🎯</span>
              <span className="recommendation-text">
                Include more specific risk factors with quantifiable impacts
              </span>
            </div>
          )}
          {specificity.specific_word_ratio >= 0.1 && specificity.vague_word_ratio <= 0.1 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">✅</span>
              <span className="recommendation-text">
                Disclosure demonstrates good specificity and clarity
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Calculation Notes */}
      <div className="calculation-notes">
        <h3>How Specificity is Calculated</h3>
        <div className="notes-grid">
          <div className="note-card">
            <h4>Specific Word Ratio</h4>
            <p><strong>Formula:</strong> Count of specific words / Total word count</p>
            <p><strong>Specific Words:</strong> Precise terms like "revenue", "operating margin", "market share"</p>
            <p><strong>Interpretation:</strong> Higher ratios indicate more precise language</p>
          </div>
          
          <div className="note-card">
            <h4>Vague Word Ratio</h4>
            <p><strong>Formula:</strong> Count of vague words / Total word count</p>
            <p><strong>Vague Words:</strong> Non-specific terms like "significant", "material", "substantial"</p>
            <p><strong>Interpretation:</strong> Lower ratios indicate clearer communication</p>
          </div>
          
          <div className="note-card">
            <h4>Industry Term Ratio</h4>
            <p><strong>Formula:</strong> Count of industry-specific terms / Total word count</p>
            <p><strong>Industry Terms:</strong> Sector-specific vocabulary relevant to the company's business</p>
            <p><strong>Interpretation:</strong> Higher ratios show industry expertise and context</p>
          </div>
          
          <div className="note-card">
            <h4>Risk Term Ratio</h4>
            <p><strong>Formula:</strong> Count of specific risk terms / Total word count</p>
            <p><strong>Risk Terms:</strong> Quantifiable risk factors with measurable impacts</p>
            <p><strong>Interpretation:</strong> Higher ratios indicate comprehensive risk disclosure</p>
          </div>
        </div>
        
        <div className="notes-footer">
          <p><strong>Note:</strong> Specificity analysis uses natural language processing to categorize words into specific, vague, industry-specific, and risk-related categories. The overall specificity score combines these ratios to assess how precisely the company communicates its business and risks.</p>
        </div>
      </div>
    </div>
  );
};

export default SpecificityAnalysis;