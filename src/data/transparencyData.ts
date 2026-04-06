export interface ReadabilityMetrics {
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
}

export interface SpecificityMetrics {
  specific_word_ratio: number;
  vague_word_ratio: number;
  industry_term_ratio: number;
  risk_term_ratio: number;
  specificity_score: number;
  industry_expertise_score: number;
  risk_awareness_score: number;
  total_words: number;
  unique_words: number;
}

export interface RichnessMetrics {
  filler_word_ratio: number;
  content_word_ratio: number;
  technical_term_ratio: number;
  lexical_diversity: number;
  semantic_density: number;
  information_richness_score: number;
  content_density: number;
  unique_word_ratio: number;
}

export interface ConsistencyMetrics {
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
}

export interface TransparencySection {
  section: string;
  fiscal_year: number;
  readability: ReadabilityMetrics;
  specificity: SpecificityMetrics;
  richness: RichnessMetrics;
  consistency?: ConsistencyMetrics;
  overall_transparency_score: number;
  transparency_grade: string;
}

export interface CompanyTransparencyData {
  ticker: string;
  company_name: string;
  sections: TransparencySection[];
  yearly_averages: { [year: number]: number };
  trend_analysis: {
    overall_trend: number;
    trend_direction: 'improving' | 'declining' | 'stable';
    years_analyzed: number[];
  };
}

export interface IndustryBenchmark {
  industry: string;
  average_transparency_score: number;
  median_transparency_score: number;
  top_quartile: number;
  bottom_quartile: number;
  peer_companies: string[];
}

// Sample transparency data for demonstration
export const sampleTransparencyData: CompanyTransparencyData[] = [
  {
    ticker: "AAPL",
    company_name: "Apple Inc.",
    sections: [
      {
        section: "Risk Factors",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 65.2,
          flesch_kincaid_grade: 10.5,
          gunning_fog_index: 12.8,
          smog_index: 9.2,
          automated_readability_index: 11.3,
          coleman_liau_index: 10.8,
          text_length: 15420,
          word_count: 2856,
          sentence_count: 89,
          avg_sentence_length: 32.1,
          avg_word_length: 4.8
        },
        specificity: {
          specific_word_ratio: 0.1245,
          vague_word_ratio: 0.0823,
          industry_term_ratio: 0.0678,
          risk_term_ratio: 0.0456,
          specificity_score: 0.7234,
          industry_expertise_score: 0.8456,
          risk_awareness_score: 0.7891,
          total_words: 2856,
          unique_words: 1234
        },
        richness: {
          filler_word_ratio: 0.1567,
          content_word_ratio: 0.3421,
          technical_term_ratio: 0.0892,
          lexical_diversity: 0.4321,
          semantic_density: 0.3845,
          information_richness_score: 0.7567,
          content_density: 0.6789,
          unique_word_ratio: 0.4321
        },
        consistency: {
          jaccard_similarity: 0.7234,
          cosine_similarity: 0.7891,
          risk_term_consistency: 0.6543,
          financial_term_consistency: 0.7123,
          change_indicators_score: 0.1234,
          stability_indicators_score: 0.6789,
          overall_consistency_score: 0.7123,
          consistency_grade: "B",
          vocabulary_overlap: 0.6456,
          total_unique_words: 1567,
          current_word_count: 2856,
          previous_word_count: 2745
        },
        overall_transparency_score: 0.7823,
        transparency_grade: "B+"
      },
      {
        section: "MD&A",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 58.7,
          flesch_kincaid_grade: 12.3,
          gunning_fog_index: 14.2,
          smog_index: 11.5,
          automated_readability_index: 13.1,
          coleman_liau_index: 12.8,
          text_length: 28750,
          word_count: 5234,
          sentence_count: 124,
          avg_sentence_length: 42.2,
          avg_word_length: 5.2
        },
        specificity: {
          specific_word_ratio: 0.0987,
          vague_word_ratio: 0.1123,
          industry_term_ratio: 0.0745,
          risk_term_ratio: 0.0321,
          specificity_score: 0.6456,
          industry_expertise_score: 0.7234,
          risk_awareness_score: 0.6543,
          total_words: 5234,
          unique_words: 1876
        },
        richness: {
          filler_word_ratio: 0.1892,
          content_word_ratio: 0.3123,
          technical_term_ratio: 0.0678,
          lexical_diversity: 0.3567,
          semantic_density: 0.3245,
          information_richness_score: 0.6789,
          content_density: 0.6234,
          unique_word_ratio: 0.3567
        },
        consistency: {
          jaccard_similarity: 0.6456,
          cosine_similarity: 0.7012,
          risk_term_consistency: 0.5891,
          financial_term_consistency: 0.6234,
          change_indicators_score: 0.1567,
          stability_indicators_score: 0.5892,
          overall_consistency_score: 0.6345,
          consistency_grade: "C+",
          vocabulary_overlap: 0.5678,
          total_unique_words: 2145,
          current_word_count: 5234,
          previous_word_count: 5123
        },
        overall_transparency_score: 0.7012,
        transparency_grade: "B-"
      }
    ],
    yearly_averages: {
      2022: 0.7234,
      2023: 0.7567,
      2024: 0.7418
    },
    trend_analysis: {
      overall_trend: 0.023,
      trend_direction: "improving",
      years_analyzed: [2022, 2023, 2024]
    }
  },
  {
    ticker: "MSFT",
    company_name: "Microsoft Corporation",
    sections: [
      {
        section: "Risk Factors",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 72.1,
          flesch_kincaid_grade: 9.2,
          gunning_fog_index: 11.4,
          smog_index: 8.7,
          automated_readability_index: 9.8,
          coleman_liau_index: 9.5,
          text_length: 18230,
          word_count: 3456,
          sentence_count: 95,
          avg_sentence_length: 36.4,
          avg_word_length: 4.6
        },
        specificity: {
          specific_word_ratio: 0.1456,
          vague_word_ratio: 0.0678,
          industry_term_ratio: 0.0892,
          risk_term_ratio: 0.0567,
          specificity_score: 0.8123,
          industry_expertise_score: 0.8945,
          risk_awareness_score: 0.8234,
          total_words: 3456,
          unique_words: 1456
        },
        richness: {
          filler_word_ratio: 0.1345,
          content_word_ratio: 0.3789,
          technical_term_ratio: 0.1023,
          lexical_diversity: 0.4678,
          semantic_density: 0.4234,
          information_richness_score: 0.8123,
          content_density: 0.7234,
          unique_word_ratio: 0.4678
        },
        consistency: {
          jaccard_similarity: 0.7891,
          cosine_similarity: 0.8456,
          risk_term_consistency: 0.7654,
          financial_term_consistency: 0.8123,
          change_indicators_score: 0.0892,
          stability_indicators_score: 0.8234,
          overall_consistency_score: 0.7912,
          consistency_grade: "B+",
          vocabulary_overlap: 0.7234,
          total_unique_words: 1789,
          current_word_count: 3456,
          previous_word_count: 3345
        },
        overall_transparency_score: 0.8345,
        transparency_grade: "A-"
      }
    ],
    yearly_averages: {
      2022: 0.7891,
      2023: 0.8023,
      2024: 0.8345
    },
    trend_analysis: {
      overall_trend: 0.045,
      trend_direction: "improving",
      years_analyzed: [2022, 2023, 2024]
    }
  },
  {
    ticker: "NVDA",
    company_name: "NVIDIA Corporation",
    sections: [
      {
        section: "Risk Factors",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 68.5,
          flesch_kincaid_grade: 10.2,
          gunning_fog_index: 12.1,
          smog_index: 9.8,
          automated_readability_index: 10.9,
          coleman_liau_index: 10.3,
          text_length: 16780,
          word_count: 3124,
          sentence_count: 92,
          avg_sentence_length: 33.9,
          avg_word_length: 4.7
        },
        specificity: {
          specific_word_ratio: 0.1389,
          vague_word_ratio: 0.0756,
          industry_term_ratio: 0.0923,
          risk_term_ratio: 0.0512,
          specificity_score: 0.7845,
          industry_expertise_score: 0.8678,
          risk_awareness_score: 0.8012,
          total_words: 3124,
          unique_words: 1367
        },
        richness: {
          filler_word_ratio: 0.1423,
          content_word_ratio: 0.3654,
          technical_term_ratio: 0.0945,
          lexical_diversity: 0.4456,
          semantic_density: 0.3987,
          information_richness_score: 0.7891,
          content_density: 0.7023,
          unique_word_ratio: 0.4456
        },
        consistency: {
          jaccard_similarity: 0.7567,
          cosine_similarity: 0.8123,
          risk_term_consistency: 0.6987,
          financial_term_consistency: 0.7456,
          change_indicators_score: 0.1123,
          stability_indicators_score: 0.7234,
          overall_consistency_score: 0.7456,
          consistency_grade: "B",
          vocabulary_overlap: 0.6891,
          total_unique_words: 1678,
          current_word_count: 3124,
          previous_word_count: 3012
        },
        overall_transparency_score: 0.8023,
        transparency_grade: "B+"
      }
    ],
    yearly_averages: {
      2022: 0.7456,
      2023: 0.7789,
      2024: 0.8023
    },
    trend_analysis: {
      overall_trend: 0.057,
      trend_direction: "improving",
      years_analyzed: [2022, 2023, 2024]
    }
  },
  {
    ticker: "AMZN",
    company_name: "Amazon.com, Inc.",
    sections: [
      {
        section: "Risk Factors",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 62.3,
          flesch_kincaid_grade: 11.1,
          gunning_fog_index: 13.2,
          smog_index: 10.4,
          automated_readability_index: 11.8,
          coleman_liau_index: 11.2,
          text_length: 22340,
          word_count: 4156,
          sentence_count: 108,
          avg_sentence_length: 38.5,
          avg_word_length: 4.9
        },
        specificity: {
          specific_word_ratio: 0.1123,
          vague_word_ratio: 0.0945,
          industry_term_ratio: 0.0765,
          risk_term_ratio: 0.0478,
          specificity_score: 0.6987,
          industry_expertise_score: 0.8123,
          risk_awareness_score: 0.7456,
          total_words: 4156,
          unique_words: 1789
        },
        richness: {
          filler_word_ratio: 0.1678,
          content_word_ratio: 0.3345,
          technical_term_ratio: 0.0789,
          lexical_diversity: 0.4234,
          semantic_density: 0.3765,
          information_richness_score: 0.7345,
          content_density: 0.6678,
          unique_word_ratio: 0.4234
        },
        consistency: {
          jaccard_similarity: 0.6987,
          cosine_similarity: 0.7567,
          risk_term_consistency: 0.6234,
          financial_term_consistency: 0.6891,
          change_indicators_score: 0.1345,
          stability_indicators_score: 0.6456,
          overall_consistency_score: 0.6891,
          consistency_grade: "C+",
          vocabulary_overlap: 0.6234,
          total_unique_words: 1987,
          current_word_count: 4156,
          previous_word_count: 4045
        },
        overall_transparency_score: 0.7234,
        transparency_grade: "B-"
      }
    ],
    yearly_averages: {
      2022: 0.6891,
      2023: 0.7023,
      2024: 0.7234
    },
    trend_analysis: {
      overall_trend: 0.034,
      trend_direction: "improving",
      years_analyzed: [2022, 2023, 2024]
    }
  },
  {
    ticker: "META",
    company_name: "Meta Platforms, Inc.",
    sections: [
      {
        section: "Risk Factors",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 66.8,
          flesch_kincaid_grade: 10.7,
          gunning_fog_index: 12.5,
          smog_index: 9.6,
          automated_readability_index: 11.2,
          coleman_liau_index: 10.9,
          text_length: 19450,
          word_count: 3624,
          sentence_count: 98,
          avg_sentence_length: 37.0,
          avg_word_length: 4.8
        },
        specificity: {
          specific_word_ratio: 0.1278,
          vague_word_ratio: 0.0867,
          industry_term_ratio: 0.0812,
          risk_term_ratio: 0.0491,
          specificity_score: 0.7456,
          industry_expertise_score: 0.8345,
          risk_awareness_score: 0.7678,
          total_words: 3624,
          unique_words: 1523
        },
        richness: {
          filler_word_ratio: 0.1523,
          content_word_ratio: 0.3523,
          technical_term_ratio: 0.0856,
          lexical_diversity: 0.4378,
          semantic_density: 0.3912,
          information_richness_score: 0.7654,
          content_density: 0.6891,
          unique_word_ratio: 0.4378
        },
        consistency: {
          jaccard_similarity: 0.7345,
          cosine_similarity: 0.7912,
          risk_term_consistency: 0.6789,
          financial_term_consistency: 0.7234,
          change_indicators_score: 0.1267,
          stability_indicators_score: 0.6891,
          overall_consistency_score: 0.7123,
          consistency_grade: "B",
          vocabulary_overlap: 0.6678,
          total_unique_words: 1845,
          current_word_count: 3624,
          previous_word_count: 3512
        },
        overall_transparency_score: 0.7567,
        transparency_grade: "B"
      }
    ],
    yearly_averages: {
      2022: 0.7123,
      2023: 0.7345,
      2024: 0.7567
    },
    trend_analysis: {
      overall_trend: 0.044,
      trend_direction: "improving",
      years_analyzed: [2022, 2023, 2024]
    }
  },
  {
    ticker: "TSLA",
    company_name: "Tesla, Inc.",
    sections: [
      {
        section: "Risk Factors",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 60.1,
          flesch_kincaid_grade: 11.8,
          gunning_fog_index: 13.8,
          smog_index: 11.2,
          automated_readability_index: 12.5,
          coleman_liau_index: 12.1,
          text_length: 25670,
          word_count: 4789,
          sentence_count: 115,
          avg_sentence_length: 41.6,
          avg_word_length: 5.1
        },
        specificity: {
          specific_word_ratio: 0.1056,
          vague_word_ratio: 0.1023,
          industry_term_ratio: 0.0698,
          risk_term_ratio: 0.0534,
          specificity_score: 0.6789,
          industry_expertise_score: 0.7891,
          risk_awareness_score: 0.7123,
          total_words: 4789,
          unique_words: 1945
        },
        richness: {
          filler_word_ratio: 0.1789,
          content_word_ratio: 0.3267,
          technical_term_ratio: 0.0723,
          lexical_diversity: 0.4089,
          semantic_density: 0.3645,
          information_richness_score: 0.7123,
          content_density: 0.6456,
          unique_word_ratio: 0.4089
        },
        consistency: {
          jaccard_similarity: 0.6678,
          cosine_similarity: 0.7234,
          risk_term_consistency: 0.5987,
          financial_term_consistency: 0.6456,
          change_indicators_score: 0.1456,
          stability_indicators_score: 0.6012,
          overall_consistency_score: 0.6543,
          consistency_grade: "C+",
          vocabulary_overlap: 0.5987,
          total_unique_words: 2156,
          current_word_count: 4789,
          previous_word_count: 4678
        },
        overall_transparency_score: 0.6987,
        transparency_grade: "C+"
      }
    ],
    yearly_averages: {
      2022: 0.6543,
      2023: 0.6789,
      2024: 0.6987
    },
    trend_analysis: {
      overall_trend: 0.044,
      trend_direction: "improving",
      years_analyzed: [2022, 2023, 2024]
    }
  },
  {
    ticker: "GOOGL",
    company_name: "Alphabet Inc.",
    sections: [
      {
        section: "Risk Factors",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 70.3,
          flesch_kincaid_grade: 9.8,
          gunning_fog_index: 11.9,
          smog_index: 9.1,
          automated_readability_index: 10.4,
          coleman_liau_index: 9.9,
          text_length: 17560,
          word_count: 3287,
          sentence_count: 91,
          avg_sentence_length: 36.1,
          avg_word_length: 4.7
        },
        specificity: {
          specific_word_ratio: 0.1345,
          vague_word_ratio: 0.0789,
          industry_term_ratio: 0.0867,
          risk_term_ratio: 0.0523,
          specificity_score: 0.7923,
          industry_expertise_score: 0.8765,
          risk_awareness_score: 0.8145,
          total_words: 3287,
          unique_words: 1478
        },
        richness: {
          filler_word_ratio: 0.1389,
          content_word_ratio: 0.3723,
          technical_term_ratio: 0.0978,
          lexical_diversity: 0.4523,
          semantic_density: 0.4089,
          information_richness_score: 0.7987,
          content_density: 0.7145,
          unique_word_ratio: 0.4523
        },
        consistency: {
          jaccard_similarity: 0.7723,
          cosine_similarity: 0.8267,
          risk_term_consistency: 0.7456,
          financial_term_consistency: 0.7891,
          change_indicators_score: 0.0987,
          stability_indicators_score: 0.7912,
          overall_consistency_score: 0.7823,
          consistency_grade: "B+",
          vocabulary_overlap: 0.7123,
          total_unique_words: 1823,
          current_word_count: 3287,
          previous_word_count: 3176
        },
        overall_transparency_score: 0.8234,
        transparency_grade: "A-"
      }
    ],
    yearly_averages: {
      2022: 0.7891,
      2023: 0.8045,
      2024: 0.8234
    },
    trend_analysis: {
      overall_trend: 0.034,
      trend_direction: "improving",
      years_analyzed: [2022, 2023, 2024]
    }
  },
  {
    ticker: "AVGO",
    company_name: "Broadcom Inc.",
    sections: [
      {
        section: "Risk Factors",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 67.8,
          flesch_kincaid_grade: 10.4,
          gunning_fog_index: 12.3,
          smog_index: 9.9,
          automated_readability_index: 11.1,
          coleman_liau_index: 10.6,
          text_length: 17890,
          word_count: 3345,
          sentence_count: 94,
          avg_sentence_length: 35.6,
          avg_word_length: 4.8
        },
        specificity: {
          specific_word_ratio: 0.1312,
          vague_word_ratio: 0.0812,
          industry_term_ratio: 0.0845,
          risk_term_ratio: 0.0489,
          specificity_score: 0.7654,
          industry_expertise_score: 0.8523,
          risk_awareness_score: 0.7867,
          total_words: 3345,
          unique_words: 1489
        },
        richness: {
          filler_word_ratio: 0.1467,
          content_word_ratio: 0.3612,
          technical_term_ratio: 0.0891,
          lexical_diversity: 0.4412,
          semantic_density: 0.3945,
          information_richness_score: 0.7745,
          content_density: 0.6978,
          unique_word_ratio: 0.4412
        },
        consistency: {
          jaccard_similarity: 0.7456,
          cosine_similarity: 0.8012,
          risk_term_consistency: 0.7123,
          financial_term_consistency: 0.7567,
          change_indicators_score: 0.1098,
          stability_indicators_score: 0.7345,
          overall_consistency_score: 0.7567,
          consistency_grade: "B",
          vocabulary_overlap: 0.6912,
          total_unique_words: 1765,
          current_word_count: 3345,
          previous_word_count: 3234
        },
        overall_transparency_score: 0.7912,
        transparency_grade: "B+"
      }
    ],
    yearly_averages: {
      2022: 0.7567,
      2023: 0.7745,
      2024: 0.7912
    },
    trend_analysis: {
      overall_trend: 0.035,
      trend_direction: "improving",
      years_analyzed: [2022, 2023, 2024]
    }
  },
  {
    ticker: "COST",
    company_name: "Costco Wholesale Corporation",
    sections: [
      {
        section: "Risk Factors",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 64.2,
          flesch_kincaid_grade: 10.8,
          gunning_fog_index: 12.9,
          smog_index: 10.1,
          automated_readability_index: 11.5,
          coleman_liau_index: 11.0,
          text_length: 16230,
          word_count: 3023,
          sentence_count: 87,
          avg_sentence_length: 34.8,
          avg_word_length: 4.9
        },
        specificity: {
          specific_word_ratio: 0.1198,
          vague_word_ratio: 0.0876,
          industry_term_ratio: 0.0723,
          risk_term_ratio: 0.0467,
          specificity_score: 0.7123,
          industry_expertise_score: 0.8234,
          risk_awareness_score: 0.7543,
          total_words: 3023,
          unique_words: 1345
        },
        richness: {
          filler_word_ratio: 0.1612,
          content_word_ratio: 0.3398,
          technical_term_ratio: 0.0756,
          lexical_diversity: 0.4289,
          semantic_density: 0.3823,
          information_richness_score: 0.7456,
          content_density: 0.6789,
          unique_word_ratio: 0.4289
        },
        consistency: {
          jaccard_similarity: 0.7123,
          cosine_similarity: 0.7678,
          risk_term_consistency: 0.6456,
          financial_term_consistency: 0.6987,
          change_indicators_score: 0.1278,
          stability_indicators_score: 0.6678,
          overall_consistency_score: 0.7012,
          consistency_grade: "C+",
          vocabulary_overlap: 0.6456,
          total_unique_words: 1678,
          current_word_count: 3023,
          previous_word_count: 2912
        },
        overall_transparency_score: 0.7345,
        transparency_grade: "B-"
      }
    ],
    yearly_averages: {
      2022: 0.6987,
      2023: 0.7123,
      2024: 0.7345
    },
    trend_analysis: {
      overall_trend: 0.036,
      trend_direction: "improving",
      years_analyzed: [2022, 2023, 2024]
    }
  },
  {
    ticker: "NFLX",
    company_name: "Netflix, Inc.",
    sections: [
      {
        section: "Risk Factors",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 63.7,
          flesch_kincaid_grade: 11.2,
          gunning_fog_index: 13.1,
          smog_index: 10.6,
          automated_readability_index: 11.9,
          coleman_liau_index: 11.4,
          text_length: 18760,
          word_count: 3498,
          sentence_count: 96,
          avg_sentence_length: 36.4,
          avg_word_length: 4.8
        },
        specificity: {
          specific_word_ratio: 0.1234,
          vague_word_ratio: 0.0891,
          industry_term_ratio: 0.0789,
          risk_term_ratio: 0.0489,
          specificity_score: 0.7345,
          industry_expertise_score: 0.8345,
          risk_awareness_score: 0.7678,
          total_words: 3498,
          unique_words: 1567
        },
        richness: {
          filler_word_ratio: 0.1578,
          content_word_ratio: 0.3467,
          technical_term_ratio: 0.0812,
          lexical_diversity: 0.4356,
          semantic_density: 0.3878,
          information_richness_score: 0.7567,
          content_density: 0.6891,
          unique_word_ratio: 0.4356
        },
        consistency: {
          jaccard_similarity: 0.7234,
          cosine_similarity: 0.7812,
          risk_term_consistency: 0.6678,
          financial_term_consistency: 0.7123,
          change_indicators_score: 0.1212,
          stability_indicators_score: 0.6891,
          overall_consistency_score: 0.7123,
          consistency_grade: "B",
          vocabulary_overlap: 0.6678,
          total_unique_words: 1890,
          current_word_count: 3498,
          previous_word_count: 3387
        },
        overall_transparency_score: 0.7456,
        transparency_grade: "B"
      }
    ],
    yearly_averages: {
      2022: 0.7012,
      2023: 0.7234,
      2024: 0.7456
    },
    trend_analysis: {
      overall_trend: 0.044,
      trend_direction: "improving",
      years_analyzed: [2022, 2023, 2024]
    }
  },
  {
    ticker: "PEP",
    company_name: "PepsiCo, Inc.",
    sections: [
      {
        section: "Risk Factors",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 65.8,
          flesch_kincaid_grade: 10.6,
          gunning_fog_index: 12.6,
          smog_index: 9.8,
          automated_readability_index: 11.3,
          coleman_liau_index: 10.8,
          text_length: 17120,
          word_count: 3189,
          sentence_count: 90,
          avg_sentence_length: 35.4,
          avg_word_length: 4.8
        },
        specificity: {
          specific_word_ratio: 0.1267,
          vague_word_ratio: 0.0834,
          industry_term_ratio: 0.0798,
          risk_term_ratio: 0.0478,
          specificity_score: 0.7456,
          industry_expertise_score: 0.8412,
          risk_awareness_score: 0.7745,
          total_words: 3189,
          unique_words: 1423
        },
        richness: {
          filler_word_ratio: 0.1534,
          content_word_ratio: 0.3567,
          technical_term_ratio: 0.0823,
          lexical_diversity: 0.4423,
          semantic_density: 0.3945,
          information_richness_score: 0.7678,
          content_density: 0.6923,
          unique_word_ratio: 0.4423
        },
        consistency: {
          jaccard_similarity: 0.7345,
          cosine_similarity: 0.7923,
          risk_term_consistency: 0.6891,
          financial_term_consistency: 0.7345,
          change_indicators_score: 0.1156,
          stability_indicators_score: 0.7012,
          overall_consistency_score: 0.7234,
          consistency_grade: "B",
          vocabulary_overlap: 0.6789,
          total_unique_words: 1745,
          current_word_count: 3189,
          previous_word_count: 3078
        },
        overall_transparency_score: 0.7678,
        transparency_grade: "B"
      }
    ],
    yearly_averages: {
      2022: 0.7234,
      2023: 0.7456,
      2024: 0.7678
    },
    trend_analysis: {
      overall_trend: 0.044,
      trend_direction: "improving",
      years_analyzed: [2022, 2023, 2024]
    }
  },
  {
    ticker: "GS",
    company_name: "Goldman Sachs Group, Inc.",
    sections: [
      {
        section: "Risk Factors",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 55.3,
          flesch_kincaid_grade: 12.8,
          gunning_fog_index: 14.5,
          smog_index: 11.8,
          automated_readability_index: 13.2,
          coleman_liau_index: 12.5,
          text_length: 32450,
          word_count: 5890,
          sentence_count: 142,
          avg_sentence_length: 41.5,
          avg_word_length: 5.3
        },
        specificity: {
          specific_word_ratio: 0.1456,
          vague_word_ratio: 0.0712,
          industry_term_ratio: 0.0956,
          risk_term_ratio: 0.0589,
          specificity_score: 0.8012,
          industry_expertise_score: 0.8923,
          risk_awareness_score: 0.8345,
          total_words: 5890,
          unique_words: 2345
        },
        richness: {
          filler_word_ratio: 0.1312,
          content_word_ratio: 0.3812,
          technical_term_ratio: 0.1045,
          lexical_diversity: 0.4567,
          semantic_density: 0.4123,
          information_richness_score: 0.8123,
          content_density: 0.7234,
          unique_word_ratio: 0.4567
        },
        consistency: {
          jaccard_similarity: 0.7612,
          cosine_similarity: 0.8234,
          risk_term_consistency: 0.7345,
          financial_term_consistency: 0.7891,
          change_indicators_score: 0.1023,
          stability_indicators_score: 0.7567,
          overall_consistency_score: 0.7712,
          consistency_grade: "B+",
          vocabulary_overlap: 0.7012,
          total_unique_words: 2567,
          current_word_count: 5890,
          previous_word_count: 5678
        },
        overall_transparency_score: 0.8123,
        transparency_grade: "B+"
      }
    ],
    yearly_averages: {
      2022: 0.7678,
      2023: 0.7891,
      2024: 0.8123
    },
    trend_analysis: {
      overall_trend: 0.045,
      trend_direction: "improving",
      years_analyzed: [2022, 2023, 2024]
    }
  },
  {
    ticker: "MS",
    company_name: "Morgan Stanley",
    sections: [
      {
        section: "Risk Factors",
        fiscal_year: 2024,
        readability: {
          flesch_reading_ease: 57.8,
          flesch_kincaid_grade: 12.2,
          gunning_fog_index: 14.1,
          smog_index: 11.3,
          automated_readability_index: 12.8,
          coleman_liau_index: 12.1,
          text_length: 29870,
          word_count: 5456,
          sentence_count: 135,
          avg_sentence_length: 40.4,
          avg_word_length: 5.2
        },
        specificity: {
          specific_word_ratio: 0.1389,
          vague_word_ratio: 0.0745,
          industry_term_ratio: 0.0912,
          risk_term_ratio: 0.0556,
          specificity_score: 0.7891,
          industry_expertise_score: 0.8812,
          risk_awareness_score: 0.8234,
          total_words: 5456,
          unique_words: 2234
        },
        richness: {
          filler_word_ratio: 0.1356,
          content_word_ratio: 0.3745,
          technical_term_ratio: 0.0989,
          lexical_diversity: 0.4489,
          semantic_density: 0.4056,
          information_richness_score: 0.7989,
          content_density: 0.7123,
          unique_word_ratio: 0.4489
        },
        consistency: {
          jaccard_similarity: 0.7534,
          cosine_similarity: 0.8156,
          risk_term_consistency: 0.7234,
          financial_term_consistency: 0.7789,
          change_indicators_score: 0.1078,
          stability_indicators_score: 0.7456,
          overall_consistency_score: 0.7623,
          consistency_grade: "B",
          vocabulary_overlap: 0.6934,
          total_unique_words: 2456,
          current_word_count: 5456,
          previous_word_count: 5312
        },
        overall_transparency_score: 0.7989,
        transparency_grade: "B+"
      }
    ],
    yearly_averages: {
      2022: 0.7567,
      2023: 0.7789,
      2024: 0.7989
    },
    trend_analysis: {
      overall_trend: 0.042,
      trend_direction: "improving",
      years_analyzed: [2022, 2023, 2024]
    }
  }
];

export const industryBenchmarks: IndustryBenchmark[] = [
  {
    industry: "Technology",
    average_transparency_score: 0.7567,
    median_transparency_score: 0.7423,
    top_quartile: 0.8234,
    bottom_quartile: 0.6543,
    peer_companies: ["AAPL", "MSFT", "GOOGL", "NVDA", "AMZN"]
  },
  {
    industry: "Consumer Goods",
    average_transparency_score: 0.6891,
    median_transparency_score: 0.6745,
    top_quartile: 0.7654,
    bottom_quartile: 0.5892,
    peer_companies: ["PEP", "COST", "NFLX"]
  },
  {
    industry: "Financial Services",
    average_transparency_score: 0.8056,
    median_transparency_score: 0.8056,
    top_quartile: 0.8123,
    bottom_quartile: 0.7989,
    peer_companies: ["GS", "MS"]
  }
];

export function getCompanyTransparencyData(ticker: string): CompanyTransparencyData | undefined {
  return sampleTransparencyData.find(data => data.ticker === ticker);
}

export function getIndustryBenchmark(industry: string): IndustryBenchmark | undefined {
  return industryBenchmarks.find(bench => bench.industry.toLowerCase() === industry.toLowerCase());
}

export function getAllTransparencyData(): CompanyTransparencyData[] {
  return sampleTransparencyData;
}