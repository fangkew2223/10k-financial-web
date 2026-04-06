import React from "react";
import "./RichnessDashboard.css";

interface RichnessDashboardProps {
  richness: {
    filler_word_ratio: number;
    content_word_ratio: number;
    technical_term_ratio: number;
    lexical_diversity: number;
    semantic_density: number;
    information_richness_score: number;
    content_density: number;
    unique_word_ratio: number;
  };
  companyName: string;
  section: string;
  year: number;
}

const RichnessDashboard: React.FC<RichnessDashboardProps> = ({
  richness,
  companyName,
  section,
  year
}) => {
  const getRichnessColor = (score: number) => {
    if (score >= 0.8) return '#22c55e';
    if (score >= 0.7) return '#3b82f6';
    if (score >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  const getRichnessGrade = (score: number) => {
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

  const getDensityLevel = (score: number) => {
    if (score >= 0.7) return { level: 'High', color: '#22c55e' };
    if (score >= 0.5) return { level: 'Medium', color: '#f59e0b' };
    return { level: 'Low', color: '#ef4444' };
  };

  return (
    <div className="richness-dashboard">
      <div className="dashboard-header">
        <h2>Information Richness Analysis</h2>
        <p className="dashboard-subtitle">
          Measuring the informational value and content density of {companyName}'s {section} disclosure for FY {year}
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Overall Richness Score */}
        <div className="overall-richness-card">
          <div className="richness-header">
            <h3>Information Richness Score</h3>
            <span 
              className="richness-grade" 
              style={{ color: getRichnessColor(richness.information_richness_score) }}
            >
              {getRichnessGrade(richness.information_richness_score)}
            </span>
          </div>
          <div className="richness-value">{richness.information_richness_score.toFixed(3)}</div>
          <div className="richness-bar">
            <div 
              className="richness-fill" 
              style={{ 
                width: `${richness.information_richness_score * 100}%`,
                backgroundColor: getRichnessColor(richness.information_richness_score)
              }}
            ></div>
          </div>
          <div className="richness-desc">Higher scores indicate more information-dense content</div>
        </div>

        {/* Content Analysis */}
        <div className="content-analysis">
          <h3>Content Analysis</h3>
          <div className="analysis-grid">
            <div className="analysis-item">
              <div className="analysis-header">
                <span className="analysis-label">Filler Words</span>
                <span className="analysis-value">{formatPercentage(richness.filler_word_ratio)}</span>
              </div>
              <div className="analysis-bar">
                <div 
                  className="analysis-fill filler-fill"
                  style={{ width: `${richness.filler_word_ratio * 100}%` }}
                ></div>
              </div>
              <div className="analysis-desc">Non-essential words</div>
            </div>

            <div className="analysis-item">
              <div className="analysis-header">
                <span className="analysis-label">Content Words</span>
                <span className="analysis-value">{formatPercentage(richness.content_word_ratio)}</span>
              </div>
              <div className="analysis-bar">
                <div 
                  className="analysis-fill content-fill"
                  style={{ width: `${richness.content_word_ratio * 100}%` }}
                ></div>
              </div>
              <div className="analysis-desc">Information-bearing words</div>
            </div>

            <div className="analysis-item">
              <div className="analysis-header">
                <span className="analysis-label">Technical Terms</span>
                <span className="analysis-value">{formatPercentage(richness.technical_term_ratio)}</span>
              </div>
              <div className="analysis-bar">
                <div 
                  className="analysis-fill technical-fill"
                  style={{ width: `${richness.technical_term_ratio * 100}%` }}
                ></div>
              </div>
              <div className="analysis-desc">Specialized terminology</div>
            </div>
          </div>
        </div>

        {/* Density Metrics */}
        <div className="density-metrics">
          <h3>Density Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Lexical Diversity</span>
                <span className="metric-value">{richness.lexical_diversity.toFixed(3)}</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ 
                    width: `${richness.lexical_diversity * 100}%`,
                    backgroundColor: getRichnessColor(richness.lexical_diversity)
                  }}
                ></div>
              </div>
              <div className="metric-desc">Vocabulary variety</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Semantic Density</span>
                <span className="metric-value">{richness.semantic_density.toFixed(3)}</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ 
                    width: `${richness.semantic_density * 100}%`,
                    backgroundColor: getRichnessColor(richness.semantic_density)
                  }}
                ></div>
              </div>
              <div className="metric-desc">Meaning concentration</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Content Density</span>
                <span className="metric-value">{richness.content_density.toFixed(3)}</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ 
                    width: `${richness.content_density * 100}%`,
                    backgroundColor: getRichnessColor(richness.content_density)
                  }}
                ></div>
              </div>
              <div className="metric-desc">Information per word</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">Unique Word Ratio</span>
                <span className="metric-value">{formatPercentage(richness.unique_word_ratio)}</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ 
                    width: `${richness.unique_word_ratio * 100}%`,
                    backgroundColor: getRichnessColor(richness.unique_word_ratio)
                  }}
                ></div>
              </div>
              <div className="metric-desc">Vocabulary uniqueness</div>
            </div>
          </div>
        </div>
      </div>

      {/* Richness Breakdown */}
      <div className="richness-breakdown">
        <h3>Richness Breakdown</h3>
        <div className="breakdown-content">
          <div className="breakdown-item">
            <div className="breakdown-header">
              <span className="breakdown-label">Information Quality</span>
              <span 
                className="breakdown-score"
                style={{ color: getRichnessColor(richness.information_richness_score) }}
              >
                {getRichnessGrade(richness.information_richness_score)}
              </span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${richness.information_richness_score * 100}%`,
                  backgroundColor: getRichnessColor(richness.information_richness_score)
                }}
              ></div>
            </div>
            <div className="breakdown-desc">Overall information value</div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-header">
              <span className="breakdown-label">Content Density</span>
              <span 
                className="breakdown-score"
                style={{ color: getRichnessColor(richness.content_density) }}
              >
                {getRichnessGrade(richness.content_density)}
              </span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${richness.content_density * 100}%`,
                  backgroundColor: getRichnessColor(richness.content_density)
                }}
              ></div>
            </div>
            <div className="breakdown-desc">Information per unit of text</div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-header">
              <span className="breakdown-label">Lexical Quality</span>
              <span 
                className="breakdown-score"
                style={{ color: getRichnessColor(richness.lexical_diversity) }}
              >
                {getRichnessGrade(richness.lexical_diversity)}
              </span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${richness.lexical_diversity * 100}%`,
                  backgroundColor: getRichnessColor(richness.lexical_diversity)
                }}
              ></div>
            </div>
            <div className="breakdown-desc">Vocabulary sophistication</div>
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="richness-interpretation">
        <h3>Interpretation</h3>
        <div className="interpretation-content">
          <div className="interpretation-item">
            <span className="interpretation-label">Information Richness:</span>
            <span 
              className="interpretation-value"
              style={{ color: getRichnessColor(richness.information_richness_score) }}
            >
              {getRichnessGrade(richness.information_richness_score)} ({richness.information_richness_score.toFixed(3)})
            </span>
          </div>
          <div className="interpretation-item">
            <span className="interpretation-label">Content Quality:</span>
            <span 
              className="interpretation-value"
              style={{ color: getRichnessColor(richness.content_density) }}
            >
              {getRichnessGrade(richness.content_density)} ({richness.content_density.toFixed(3)})
            </span>
          </div>
          <div className="interpretation-item">
            <span className="interpretation-label">Vocabulary Diversity:</span>
            <span 
              className="interpretation-value"
              style={{ color: getRichnessColor(richness.lexical_diversity) }}
            >
              {getRichnessGrade(richness.lexical_diversity)} ({richness.lexical_diversity.toFixed(3)})
            </span>
          </div>
          <div className="interpretation-item">
            <span className="interpretation-label">Content Density:</span>
            <span className="interpretation-value">
              {getDensityLevel(richness.content_density).level} Density
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="richness-recommendations">
        <h3>Recommendations</h3>
        <div className="recommendations-list">
          {richness.filler_word_ratio > 0.2 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">✂️</span>
              <span className="recommendation-text">
                Reduce filler words to improve content density and information value
              </span>
            </div>
          )}
          {richness.content_word_ratio < 0.3 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">📝</span>
              <span className="recommendation-text">
                Increase use of content-bearing words to enhance information delivery
              </span>
            </div>
          )}
          {richness.technical_term_ratio < 0.05 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">📚</span>
              <span className="recommendation-text">
                Incorporate more technical terminology to demonstrate expertise
              </span>
            </div>
          )}
          {richness.lexical_diversity < 0.4 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">🎯</span>
              <span className="recommendation-text">
                Expand vocabulary variety to improve lexical diversity
              </span>
            </div>
          )}
          {richness.information_richness_score >= 0.7 && (
            <div className="recommendation-item">
              <span className="recommendation-icon">✅</span>
              <span className="recommendation-text">
                Disclosure demonstrates high information richness and content quality
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Calculation Notes */}
      <div className="calculation-notes">
        <h3>How Information Richness is Calculated</h3>
        <div className="notes-grid">
          <div className="note-card">
            <h4>Filler Word Ratio</h4>
            <p><strong>Formula:</strong> Count of filler words / Total word count</p>
            <p><strong>Filler Words:</strong> Non-essential words like "the", "and", "of", "to", "in"</p>
            <p><strong>Interpretation:</strong> Lower ratios indicate more information-dense content</p>
          </div>
          
          <div className="note-card">
            <h4>Content Word Ratio</h4>
            <p><strong>Formula:</strong> Count of content words / Total word count</p>
            <p><strong>Content Words:</strong> Nouns, verbs, adjectives, adverbs that carry meaning</p>
            <p><strong>Interpretation:</strong> Higher ratios indicate more information-bearing content</p>
          </div>
          
          <div className="note-card">
            <h4>Technical Term Ratio</h4>
            <p><strong>Formula:</strong> Count of technical terms / Total word count</p>
            <p><strong>Technical Terms:</strong> Industry-specific vocabulary and specialized terminology</p>
            <p><strong>Interpretation:</strong> Higher ratios show expertise and domain knowledge</p>
          </div>
          
          <div className="note-card">
            <h4>Lexical Diversity</h4>
            <p><strong>Formula:</strong> Unique word count / Total word count</p>
            <p><strong>Range:</strong> 0 (no diversity) to 1 (maximum diversity)</p>
            <p><strong>Interpretation:</strong> Higher scores indicate richer vocabulary usage</p>
          </div>
          
          <div className="note-card">
            <h4>Semantic Density</h4>
            <p><strong>Formula:</strong> Content words / (Content words + Function words)</p>
            <p><strong>Semantic Density:</strong> Measures meaning concentration in text</p>
            <p><strong>Interpretation:</strong> Higher scores indicate more meaning per word</p>
          </div>
          
          <div className="note-card">
            <h4>Content Density</h4>
            <p><strong>Formula:</strong> Information-bearing words / Total word count</p>
            <p><strong>Content Density:</strong> Overall information concentration</p>
            <p><strong>Interpretation:</strong> Higher scores indicate more valuable content per word</p>
          </div>
        </div>
        
        <div className="notes-footer">
          <p><strong>Note:</strong> Information richness analysis evaluates how efficiently text conveys information. It examines the balance between essential content and non-essential words, vocabulary diversity, and the concentration of meaningful information. High information richness indicates that the disclosure provides substantial value with minimal redundancy.</p>
        </div>
      </div>
    </div>
  );
};

export default RichnessDashboard;