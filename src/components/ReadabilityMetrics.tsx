import React from "react";
import "./ReadabilityMetrics.css";

interface ReadabilityMetricsProps {
  readability: {
    flesch_reading_ease: number;
    flesch_kincaid_grade: number;
    gunning_fog_index: number;
    smog_index: number;
    automated_readability_index: number;
    coleman_liau_index: number;
    text_length: number;
    word_count: number;
    sentence_count: number;
    avg_sentence_length: number;
    avg_word_length: number;
  };
  companyName: string;
  section: string;
  year: number;
}

const ReadabilityMetrics: React.FC<ReadabilityMetricsProps> = ({
  readability,
  companyName,
  section,
  year
}) => {
  const getReadabilityGrade = (score: number) => {
    if (score >= 90) return { grade: "Very Easy", color: "#22c55e" };
    if (score >= 80) return { grade: "Easy", color: "#3b82f6" };
    if (score >= 70) return { grade: "Fairly Easy", color: "#f59e0b" };
    if (score >= 60) return { grade: "Standard", color: "#6b7280" };
    if (score >= 50) return { grade: "Fairly Difficult", color: "#ef4444" };
    if (score >= 30) return { grade: "Difficult", color: "#dc2626" };
    return { grade: "Very Difficult", color: "#7f1d1d" };
  };

  const getComplexityLevel = (grade: number) => {
    if (grade <= 8) return { level: "High School", color: "#22c55e" };
    if (grade <= 12) return { level: "College", color: "#3b82f6" };
    return { level: "Graduate", color: "#ef4444" };
  };

  const readabilityGrade = getReadabilityGrade(readability.flesch_reading_ease);
  const complexityLevel = getComplexityLevel(readability.flesch_kincaid_grade);

  return (
    <div className="readability-metrics">
      <div className="metrics-header">
        <h2>Readability Analysis</h2>
        <p className="metrics-subtitle">
          Assessing the clarity and accessibility of {companyName}'s {section} disclosure for FY {year}
        </p>
      </div>

      <div className="metrics-grid">
        {/* Main Readability Score */}
        <div className="main-score-card">
          <div className="score-header">
            <h3>Flesch Reading Ease</h3>
            <span 
              className="score-grade" 
              style={{ color: readabilityGrade.color }}
            >
              {readabilityGrade.grade}
            </span>
          </div>
          <div className="score-value">{readability.flesch_reading_ease.toFixed(1)}</div>
          <div className="score-bar">
            <div 
              className="score-fill" 
              style={{ 
                width: `${readability.flesch_reading_ease}%`,
                backgroundColor: readabilityGrade.color
              }}
            ></div>
          </div>
          <div className="score-range">Range: 0 (Very Difficult) - 100 (Very Easy)</div>
        </div>

        {/* Complexity Level */}
        <div className="complexity-card">
          <div className="complexity-header">
            <h3>Reading Level</h3>
            <span 
              className="complexity-level" 
              style={{ color: complexityLevel.color }}
            >
              {complexityLevel.level}
            </span>
          </div>
          <div className="complexity-value">Grade {readability.flesch_kincaid_grade.toFixed(1)}</div>
          <div className="complexity-bar">
            <div 
              className="complexity-fill" 
              style={{ 
                width: `${(readability.flesch_kincaid_grade / 20) * 100}%`,
                backgroundColor: complexityLevel.color
              }}
            ></div>
          </div>
          <div className="complexity-text">Estimated education level required</div>
        </div>

        {/* Text Statistics */}
        <div className="text-stats">
          <h3>Text Statistics</h3>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-label">Total Words</span>
              <span className="stat-value">{readability.word_count.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Sentences</span>
              <span className="stat-value">{readability.sentence_count.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg Sentence Length</span>
              <span className="stat-value">{readability.avg_sentence_length.toFixed(1)} words</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg Word Length</span>
              <span className="stat-value">{readability.avg_word_length.toFixed(2)} chars</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Text Length</span>
              <span className="stat-value">{readability.text_length.toLocaleString()} chars</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Readability Indices */}
      <div className="additional-indices">
        <h3>Additional Readability Indices</h3>
        <div className="indices-grid">
          <div className="index-card">
            <div className="index-header">
              <span className="index-name">Gunning Fog Index</span>
              <span className="index-value">{readability.gunning_fog_index.toFixed(1)}</span>
            </div>
            <div className="index-desc">Years of education needed to understand</div>
          </div>
          
          <div className="index-card">
            <div className="index-header">
              <span className="index-name">SMOG Index</span>
              <span className="index-value">{readability.smog_index.toFixed(1)}</span>
            </div>
            <div className="index-desc">Years of education for comprehension</div>
          </div>
          
          <div className="index-card">
            <div className="index-header">
              <span className="index-name">Automated Readability Index</span>
              <span className="index-value">{readability.automated_readability_index.toFixed(1)}</span>
            </div>
            <div className="index-desc">US grade level required</div>
          </div>
          
          <div className="index-card">
            <div className="index-header">
              <span className="index-name">Coleman-Liau Index</span>
              <span className="index-value">{readability.coleman_liau_index.toFixed(1)}</span>
            </div>
            <div className="index-desc">US grade level based on characters</div>
          </div>
        </div>
      </div>

      {/* Readability Interpretation */}
      <div className="readability-interpretation">
        <h3>Interpretation</h3>
        <div className="interpretation-content">
          <div className="interpretation-item">
            <span className="interpretation-label">Readability:</span>
            <span 
              className="interpretation-value"
              style={{ color: readabilityGrade.color }}
            >
              {readabilityGrade.grade}
            </span>
          </div>
          <div className="interpretation-item">
            <span className="interpretation-label">Complexity:</span>
            <span 
              className="interpretation-value"
              style={{ color: complexityLevel.color }}
            >
              {complexityLevel.level} Level
            </span>
          </div>
          <div className="interpretation-item">
            <span className="interpretation-label">Target Audience:</span>
            <span className="interpretation-value">
              {readability.flesch_reading_ease >= 70 ? "General public" : 
               readability.flesch_reading_ease >= 60 ? "Business professionals" : 
               "Specialized audience"}
            </span>
          </div>
        </div>
      </div>

      {/* Calculation Notes */}
      <div className="calculation-notes">
        <h3>How Readability is Calculated</h3>
        <div className="notes-grid">
          <div className="note-card">
            <h4>Flesch Reading Ease</h4>
            <p><strong>Formula:</strong> 206.835 - 1.015 × (total words / sentences) - 84.6 × (total syllables / words)</p>
            <p><strong>Range:</strong> 0 (Very Difficult) to 100 (Very Easy)</p>
            <p><strong>Interpretation:</strong> Higher scores indicate easier-to-read text</p>
          </div>
          
          <div className="note-card">
            <h4>Flesch-Kincaid Grade Level</h4>
            <p><strong>Formula:</strong> 0.39 × (words/sentences) + 11.8 × (syllables/words) - 15.59</p>
            <p><strong>Range:</strong> Grade 1-12+ (US education system)</p>
            <p><strong>Interpretation:</strong> Grade level needed to understand the text</p>
          </div>
          
          <div className="note-card">
            <h4>Gunning Fog Index</h4>
            <p><strong>Formula:</strong> 0.4 × [(words/sentences) + 100 × (complex words/words)]</p>
            <p><strong>Range:</strong> 6-18+ (US grade levels)</p>
            <p><strong>Interpretation:</strong> Years of education needed to understand</p>
          </div>
          
          <div className="note-card">
            <h4>SMOG Index</h4>
            <p><strong>Formula:</strong> 1.0430 × √(polysyllable words × 30/sentences) + 3.1291</p>
            <p><strong>Range:</strong> 3-12+ (US grade levels)</p>
            <p><strong>Interpretation:</strong> Years of education for comprehension</p>
          </div>
        </div>
        
        <div className="notes-footer">
          <p><strong>Note:</strong> These metrics analyze sentence length, word complexity, and syllable count to assess how easily readers can understand the disclosure text. Shorter sentences and simpler words generally improve readability scores.</p>
        </div>
      </div>
    </div>
  );
};

export default ReadabilityMetrics;