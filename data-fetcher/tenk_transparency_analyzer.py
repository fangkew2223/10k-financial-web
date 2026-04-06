#!/usr/bin/env python3
"""
10-K Transparency Analyzer

This module orchestrates the complete transparency analysis of 10-K filings,
combining readability, specificity, consistency, and information richness analysis.
"""

import json
import os
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime

# Import our analysis modules
from text_analyzer import analyze_text_transparency
from disclosure_specificity import analyze_disclosure_specificity
from consistency_analyzer import analyze_disclosure_consistency
from information_richness import analyze_information_richness


@dataclass
class TransparencyMetrics:
    """Complete transparency analysis results for a 10-K section."""
    ticker: str
    fiscal_year: int
    section: str
    timestamp: str
    
    # Readability metrics
    flesch_reading_ease: float
    flesch_kincaid_grade: float
    gunning_fog_index: float
    smog_index: float
    automated_readability_index: float
    coleman_liau_index: float
    
    # Specificity metrics
    specificity_score: float
    transparency_score: float
    industry_expertise_score: float
    risk_awareness_score: float
    
    # Information richness metrics
    information_richness_score: float
    content_density_score: float
    lexical_diversity: float
    semantic_density: float
    
    # Overall scores
    overall_transparency_score: float
    transparency_grade: str
    
    # Raw analysis data (for detailed reporting)
    raw_readability: Dict[str, Any]
    raw_specificity: Dict[str, Any]
    raw_richness: Dict[str, Any]


class TenKTransparencyAnalyzer:
    """Main analyzer for 10-K transparency analysis."""
    
    def __init__(self):
        self.readability_analyzer = None  # Will be imported when needed
        self.specificity_analyzer = None
        self.consistency_analyzer = None
        self.richness_analyzer = None
    
    def analyze_section(self, ticker: str, fiscal_year: int, section: str, text: str) -> TransparencyMetrics:
        """
        Analyze transparency of a specific 10-K section.
        
        Args:
            ticker (str): Company ticker symbol
            fiscal_year (int): Fiscal year of the filing
            section (str): Section name (e.g., 'Risk Factors', 'MD&A')
            text (str): Text content of the section
            
        Returns:
            TransparencyMetrics: Complete analysis results
        """
        if not text or not text.strip():
            return self._create_empty_metrics(ticker, fiscal_year, section)
        
        # Run all analyses
        readability_results = analyze_text_transparency(text)
        specificity_results = analyze_disclosure_specificity(text)
        richness_results = analyze_information_richness(text)
        
        # Extract key metrics
        readability = readability_results['readability']
        specificity = specificity_results['quality_assessment']
        richness = richness_results['richness_metrics']
        
        # Calculate overall transparency score
        overall_score = self._calculate_overall_transparency_score(
            readability, specificity, richness
        )
        
        # Assign transparency grade
        grade = self._assign_transparency_grade(overall_score)
        
        return TransparencyMetrics(
            ticker=ticker,
            fiscal_year=fiscal_year,
            section=section,
            timestamp=datetime.now().isoformat(),
            
            # Readability metrics
            flesch_reading_ease=readability.get('flesch_reading_ease', 0),
            flesch_kincaid_grade=readability.get('flesch_kincaid_grade', 0),
            gunning_fog_index=readability.get('gunning_fog_index', 0),
            smog_index=readability.get('smog_index', 0),
            automated_readability_index=readability.get('automated_readability_index', 0),
            coleman_liau_index=readability.get('coleman_liau_index', 0),
            
            # Specificity metrics
            specificity_score=specificity.get('specificity_score', 0),
            transparency_score=specificity.get('transparency_score', 0),
            industry_expertise_score=specificity.get('expertise_score', 0),
            risk_awareness_score=specificity.get('risk_awareness_score', 0),
            
            # Information richness metrics
            information_richness_score=richness.get('information_richness_score', 0),
            content_density_score=richness.get('content_density', 0),
            lexical_diversity=richness.get('lexical_diversity', 0),
            semantic_density=richness.get('semantic_density', 0),
            
            # Overall scores
            overall_transparency_score=overall_score,
            transparency_grade=grade,
            
            # Raw data for detailed reporting
            raw_readability=readability,
            raw_specificity=specificity,
            raw_richness=richness
        )
    
    def analyze_company_over_time(self, ticker: str, disclosures_by_year: Dict[int, Dict[str, str]]) -> Dict[str, Any]:
        """
        Analyze transparency trends for a company over multiple years.
        
        Args:
            ticker (str): Company ticker symbol
            disclosures_by_year (Dict[int, Dict[str, str]]): Disclosures by year and section
            
        Returns:
            Dict[str, Any]: Trend analysis results
        """
        if not disclosures_by_year:
            return self._get_empty_trend_results(ticker)
        
        # Analyze each year
        yearly_results = {}
        for year, sections in disclosures_by_year.items():
            year_results = {}
            for section, text in sections.items():
                metrics = self.analyze_section(ticker, year, section, text)
                year_results[section] = asdict(metrics)
            yearly_results[year] = year_results
        
        # Calculate trends
        trends = self._calculate_transparency_trends(yearly_results)
        
        return {
            'ticker': ticker,
            'analysis_period': list(disclosures_by_year.keys()),
            'yearly_results': yearly_results,
            'trends': trends,
            'summary': self._create_trend_summary(trends)
        }
    
    def compare_companies(self, companies_data: Dict[str, Dict[int, Dict[str, str]]]) -> Dict[str, Any]:
        """
        Compare transparency across multiple companies.
        
        Args:
            companies_data (Dict[str, Dict[int, Dict[str, str]]]): Data for multiple companies
            
        Returns:
            Dict[str, Any]: Comparison results
        """
        if not companies_data:
            return {'error': 'No company data provided'}
        
        # Analyze each company
        company_results = {}
        for ticker, disclosures in companies_data.items():
            company_results[ticker] = self.analyze_company_over_time(ticker, disclosures)
        
        # Calculate comparative metrics
        comparisons = self._calculate_comparisons(company_results)
        
        return {
            'companies': list(companies_data.keys()),
            'analysis_period': list(companies_data[list(companies_data.keys())[0]].keys()),
            'company_results': company_results,
            'comparisons': comparisons,
            'ranking': self._create_company_ranking(comparisons)
        }
    
    def _calculate_overall_transparency_score(self, readability: Dict, specificity: Dict, richness: Dict) -> float:
        """Calculate overall transparency score from all metrics."""
        # Weighted combination of key scores
        readability_score = self._normalize_readability_score(readability.get('flesch_reading_ease', 0))
        specificity_score = specificity.get('specificity_score', 0)
        transparency_score = specificity.get('transparency_score', 0)
        richness_score = richness.get('information_richness_score', 0)
        
        # Weighted average
        overall = (
            (readability_score * 0.25) +
            (specificity_score * 0.3) +
            (transparency_score * 0.25) +
            (richness_score * 0.2)
        )
        
        return max(0, min(1, overall))
    
    def _normalize_readability_score(self, flesch_score: float) -> float:
        """Normalize Flesch Reading Ease score to 0-1 range."""
        # Flesch scores typically range from 0-100, where higher is easier to read
        # We want higher scores to indicate better transparency
        if flesch_score < 0:
            return 0
        elif flesch_score > 100:
            return 1
        else:
            return flesch_score / 100
    
    def _assign_transparency_grade(self, score: float) -> str:
        """Assign letter grade based on transparency score."""
        if score >= 0.9:
            return 'A+'
        elif score >= 0.85:
            return 'A'
        elif score >= 0.8:
            return 'A-'
        elif score >= 0.75:
            return 'B+'
        elif score >= 0.7:
            return 'B'
        elif score >= 0.65:
            return 'B-'
        elif score >= 0.6:
            return 'C+'
        elif score >= 0.55:
            return 'C'
        elif score >= 0.5:
            return 'C-'
        elif score >= 0.4:
            return 'D'
        else:
            return 'F'
    
    def _calculate_transparency_trends(self, yearly_results: Dict[int, Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate transparency trends over time."""
        if not yearly_results:
            return {}
        
        years = sorted(yearly_results.keys())
        if len(years) < 2:
            return {'trend_available': False}
        
        # Calculate trends for key metrics
        overall_scores = []
        readability_scores = []
        specificity_scores = []
        richness_scores = []
        
        for year in years:
            sections = yearly_results[year]
            if 'Risk Factors' in sections:
                metrics = sections['Risk Factors']
                overall_scores.append(metrics['overall_transparency_score'])
                readability_scores.append(self._normalize_readability_score(
                    metrics['raw_readability']['flesch_reading_ease']
                ))
                specificity_scores.append(metrics['specificity_score'])
                richness_scores.append(metrics['information_richness_score'])
        
        trends = {
            'trend_available': len(overall_scores) >= 2,
            'years_analyzed': years,
            'overall_trend': self._calculate_trend_slope(overall_scores),
            'readability_trend': self._calculate_trend_slope(readability_scores),
            'specificity_trend': self._calculate_trend_slope(specificity_scores),
            'richness_trend': self._calculate_trend_slope(richness_scores),
            'improvement_count': sum(1 for i in range(1, len(overall_scores)) if overall_scores[i] > overall_scores[i-1]),
            'decline_count': sum(1 for i in range(1, len(overall_scores)) if overall_scores[i] < overall_scores[i-1]),
            'stability_count': sum(1 for i in range(1, len(overall_scores)) if abs(overall_scores[i] - overall_scores[i-1]) < 0.01)
        }
        
        return trends
    
    def _calculate_trend_slope(self, values: List[float]) -> float:
        """Calculate trend slope using linear regression."""
        if len(values) < 2:
            return 0
        
        n = len(values)
        x_values = list(range(n))
        y_values = values
        
        x_mean = sum(x_values) / n
        y_mean = sum(y_values) / n
        
        numerator = sum((x_values[i] - x_mean) * (y_values[i] - y_mean) for i in range(n))
        denominator = sum((x_values[i] - x_mean) ** 2 for i in range(n))
        
        if denominator == 0:
            return 0
        
        slope = numerator / denominator
        
        # Normalize to -1 to 1 range
        return max(-1, min(1, slope * 10))  # Scale factor to make slopes more meaningful
    
    def _create_trend_summary(self, trends: Dict[str, Any]) -> Dict[str, str]:
        """Create a textual summary of trends."""
        if not trends.get('trend_available', False):
            return {'summary': 'Insufficient data for trend analysis'}
        
        overall_trend = trends.get('overall_trend', 0)
        if overall_trend > 0.1:
            trend_text = "improving"
        elif overall_trend < -0.1:
            trend_text = "declining"
        else:
            trend_text = "stable"
        
        return {
            'transparency_trend': trend_text,
            'overall_slope': f"{overall_trend:.3f}",
            'improvements': str(trends.get('improvement_count', 0)),
            'declines': str(trends.get('decline_count', 0)),
            'stable_periods': str(trends.get('stability_count', 0))
        }
    
    def _calculate_comparisons(self, company_results: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate comparative metrics across companies."""
        comparisons = {}
        
        # Calculate average scores by year
        yearly_averages = {}
        for ticker, results in company_results.items():
            for year, year_data in results['yearly_results'].items():
                if year not in yearly_averages:
                    yearly_averages[year] = []
                
                if 'Risk Factors' in year_data:
                    yearly_averages[year].append(year_data['Risk Factors']['overall_transparency_score'])
        
        # Calculate company rankings
        company_scores = {}
        for ticker, results in company_results.items():
            scores = []
            for year_data in results['yearly_results'].values():
                if 'Risk Factors' in year_data:
                    scores.append(year_data['Risk Factors']['overall_transparency_score'])
            
            if scores:
                company_scores[ticker] = sum(scores) / len(scores)
        
        comparisons = {
            'yearly_averages': {year: sum(scores)/len(scores) if scores else 0 
                              for year, scores in yearly_averages.items()},
            'company_averages': company_scores,
            'industry_average': sum(company_scores.values()) / len(company_scores) if company_scores else 0
        }
        
        return comparisons
    
    def _create_company_ranking(self, comparisons: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Create company ranking based on transparency scores."""
        company_averages = comparisons.get('company_averages', {})
        
        ranking = []
        for ticker, score in sorted(company_averages.items(), key=lambda x: x[1], reverse=True):
            ranking.append({
                'ticker': ticker,
                'average_score': round(score, 4),
                'grade': self._assign_transparency_grade(score)
            })
        
        return ranking
    
    def _create_empty_metrics(self, ticker: str, fiscal_year: int, section: str) -> TransparencyMetrics:
        """Create empty metrics for missing data."""
        return TransparencyMetrics(
            ticker=ticker,
            fiscal_year=fiscal_year,
            section=section,
            timestamp=datetime.now().isoformat(),
            flesch_reading_ease=0,
            flesch_kincaid_grade=0,
            gunning_fog_index=0,
            smog_index=0,
            automated_readability_index=0,
            coleman_liau_index=0,
            specificity_score=0,
            transparency_score=0,
            industry_expertise_score=0,
            risk_awareness_score=0,
            information_richness_score=0,
            content_density_score=0,
            lexical_diversity=0,
            semantic_density=0,
            overall_transparency_score=0,
            transparency_grade='N/A',
            raw_readability={},
            raw_specificity={},
            raw_richness={}
        )
    
    def _get_empty_trend_results(self, ticker: str) -> Dict[str, Any]:
        """Return empty trend results."""
        return {
            'ticker': ticker,
            'analysis_period': [],
            'yearly_results': {},
            'trends': {'trend_available': False},
            'summary': {'summary': 'Insufficient data for trend analysis'}
        }
    
    def save_results(self, results: Dict[str, Any], filename: str) -> None:
        """Save analysis results to JSON file."""
        with open(filename, 'w') as f:
            json.dump(results, f, indent=2, default=str)
    
    def load_results(self, filename: str) -> Dict[str, Any]:
        """Load analysis results from JSON file."""
        with open(filename, 'r') as f:
            return json.load(f)


def analyze_sample_disclosures():
    """Example function to demonstrate the analyzer with sample data."""
    analyzer = TenKTransparencyAnalyzer()
    
    # Sample data
    sample_data = {
        'AAPL': {
            2023: {
                'Risk Factors': """
                Apple faces various risks including supply chain disruptions, regulatory changes,
                and intense competition in the technology sector. The company has implemented
                comprehensive risk management strategies to address these challenges through
                diversification of suppliers, robust compliance programs, and continuous
                innovation in product development.
                """,
                'MD&A': """
                Management's discussion and analysis provides detailed insights into the company's
                financial performance, operational results, and future outlook. The company has
                demonstrated strong growth in revenue and profitability through effective strategic
                planning and execution of key initiatives across all business segments.
                """
            },
            2024: {
                'Risk Factors': """
                Apple continues to face evolving risks including cybersecurity threats, geopolitical
                uncertainties, and changing consumer preferences. The company maintains proactive
                risk assessment processes and implements comprehensive mitigation strategies to
                address these dynamic challenges effectively.
                """,
                'MD&A': """
                The management team provides comprehensive analysis of financial results, highlighting
                key performance indicators and strategic initiatives. The company remains committed
                to innovation and operational excellence to drive sustainable growth and value creation.
                """
            }
        }
    }
    
    # Analyze the sample data
    results = analyzer.compare_companies(sample_data)
    
    # Save results
    analyzer.save_results(results, 'sample_transparency_analysis.json')
    
    return results


if __name__ == "__main__":
    # Run sample analysis
    results = analyze_sample_disclosures()
    print("Sample transparency analysis completed and saved to sample_transparency_analysis.json")
    
    # Print summary
    print("\nCompany Rankings:")
    for ranking in results.get('ranking', []):
        print(f"{ranking['ticker']}: {ranking['average_score']:.3f} ({ranking['grade']})")