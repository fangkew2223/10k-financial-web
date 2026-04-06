#!/usr/bin/env python3
"""
Disclosure Specificity Analyzer for 10-K Analysis

This module provides advanced analysis of disclosure specificity,
measuring how concrete and detailed company disclosures are.
"""

import re
from typing import Dict, List, Set, Tuple
from collections import Counter


class DisclosureSpecificityAnalyzer:
    """Analyzes the specificity and concreteness of disclosure text."""
    
    def __init__(self):
        # Words that indicate high specificity and concreteness
        self.specific_indicators = {
            # Quantitative specificity
            'specific', 'exact', 'precise', 'accurate', 'detailed', 'comprehensive',
            'quantitative', 'numerical', 'statistical', 'measurable', 'calculable',
            'determinable', 'identifiable', 'traceable', 'verifiable', 'auditable',
            
            # Temporal specificity
            'immediate', 'current', 'present', 'recent', 'latest', 'up-to-date',
            'real-time', 'instantaneous', 'contemporary', 'timely', 'prompt',
            
            # Geographic specificity
            'local', 'regional', 'national', 'international', 'global', 'domestic',
            'foreign', 'overseas', 'abroad', 'territorial', 'jurisdictional',
            
            # Operational specificity
            'operational', 'functional', 'technical', 'procedural', 'methodological',
            'systematic', 'structured', 'organized', 'coordinated', 'integrated',
            
            # Financial specificity
            'financial', 'monetary', 'economic', 'fiscal', 'budgetary', 'accounting',
            'bookkeeping', 'reporting', 'disclosure', 'transparency', 'governance'
        }
        
        # Words that indicate low specificity and vagueness
        self.vague_indicators = {
            # Qualitative vagueness
            'general', 'broad', 'wide', 'extensive', 'comprehensive', 'overall',
            'universal', 'global', 'widespread', 'common', 'typical', 'standard',
            'normal', 'regular', 'usual', 'ordinary', 'average', 'median',
            
            # Temporal vagueness
            'soon', 'later', 'eventually', 'ultimately', 'finally', 'presently',
            'currently', 'recently', 'lately', 'formerly', 'previously', 'historically',
            
            # Quantitative vagueness
            'many', 'several', 'numerous', 'multiple', 'various', 'diverse',
            'different', 'distinct', 'separate', 'individual', 'particular', 'specific',
            
            # Modal vagueness (already in main analyzer but included for completeness)
            'may', 'might', 'could', 'should', 'would', 'can', 'will', 'shall',
            'possibly', 'probably', 'likely', 'potentially', 'presumably'
        }
        
        # Industry-specific terminology that indicates expertise and specificity
        self.industry_terms = {
            # Technology terms
            'algorithm', 'architecture', 'framework', 'protocol', 'interface',
            'integration', 'compatibility', 'scalability', 'performance', 'optimization',
            'security', 'encryption', 'authentication', 'authorization', 'compliance',
            
            # Financial terms
            'derivative', 'hedging', 'arbitrage', 'liquidity', 'volatility', 'correlation',
            'covariance', 'beta', 'alpha', 'Sharpe', 'VaR', 'stress', 'scenario',
            
            # Manufacturing terms
            'supply', 'chain', 'logistics', 'inventory', 'production', 'manufacturing',
            'quality', 'control', 'assurance', 'testing', 'validation', 'verification',
            
            # Healthcare terms
            'clinical', 'trial', 'protocol', 'regulatory', 'approval', 'compliance',
            'efficacy', 'safety', 'toxicity', 'pharmacology', 'therapeutic', 'diagnostic'
        }
        
        # Risk-specific terminology
        self.risk_terms = {
            'market', 'credit', 'operational', 'liquidity', 'regulatory', 'compliance',
            'reputational', 'strategic', 'financial', 'economic', 'political', 'geopolitical',
            'cybersecurity', 'data', 'privacy', 'security', 'fraud', 'corruption',
            'environmental', 'social', 'governance', 'ESG', 'climate', 'sustainability'
        }
    
    def analyze_specificity(self, text: str) -> Dict[str, float]:
        """
        Analyze the specificity of disclosure text.
        
        Args:
            text (str): The text to analyze
            
        Returns:
            Dict[str, float]: Specificity analysis results
        """
        if not text or not text.strip():
            return self._get_empty_specificity_results()
        
        # Clean and prepare text
        cleaned_text = self._clean_text(text)
        words = self._extract_words(cleaned_text)
        
        if not words:
            return self._get_empty_specificity_results()
        
        # Calculate various specificity metrics
        word_count = len(words)
        word_lower = [word.lower() for word in words]
        
        # Count specific vs vague words
        specific_count = sum(1 for word in word_lower if word in self.specific_indicators)
        vague_count = sum(1 for word in word_lower if word in self.vague_indicators)
        industry_count = sum(1 for word in word_lower if word in self.industry_terms)
        risk_count = sum(1 for word in word_lower if word in self.risk_terms)
        
        # Calculate ratios
        specific_ratio = specific_count / word_count
        vague_ratio = vague_count / word_count
        industry_ratio = industry_count / word_count
        risk_ratio = risk_count / word_count
        
        # Calculate specificity score
        # Higher specific ratio and lower vague ratio indicate higher specificity
        specificity_score = max(0, min(1, (specific_ratio * 2) - (vague_ratio * 1.5) + (industry_ratio * 0.5)))
        
        # Calculate industry expertise score
        industry_expertise = min(1, industry_ratio * 5)  # Scale up industry terms
        
        # Calculate risk awareness score
        risk_awareness = min(1, risk_ratio * 3)  # Scale up risk terms
        
        return {
            'specific_word_ratio': round(specific_ratio, 4),
            'vague_word_ratio': round(vague_ratio, 4),
            'industry_term_ratio': round(industry_ratio, 4),
            'risk_term_ratio': round(risk_ratio, 4),
            'specificity_score': round(specificity_score, 4),
            'industry_expertise_score': round(industry_expertise, 4),
            'risk_awareness_score': round(risk_awareness, 4),
            'total_words': word_count,
            'unique_words': len(set(word_lower))
        }
    
    def analyze_disclosure_quality(self, text: str) -> Dict[str, float]:
        """
        Analyze overall disclosure quality based on specificity metrics.
        
        Args:
            text (str): The text to analyze
            
        Returns:
            Dict[str, float]: Quality analysis results
        """
        specificity_results = self.analyze_specificity(text)
        
        # Calculate quality scores
        overall_quality = specificity_results['specificity_score']
        transparency_score = 1 - specificity_results['vague_word_ratio']  # Lower vague words = higher transparency
        expertise_score = specificity_results['industry_expertise_score']
        comprehensiveness_score = min(1, (specificity_results['specific_word_ratio'] + specificity_results['industry_term_ratio']) * 2)
        
        # Calculate weighted overall score
        quality_weighted = (
            (overall_quality * 0.3) +
            (transparency_score * 0.25) +
            (expertise_score * 0.25) +
            (comprehensiveness_score * 0.2)
        )
        
        return {
            'overall_quality_score': round(overall_quality, 4),
            'transparency_score': round(transparency_score, 4),
            'expertise_score': round(expertise_score, 4),
            'comprehensiveness_score': round(comprehensiveness_score, 4),
            'weighted_quality_score': round(quality_weighted, 4),
            'disclosure_grade': self._assign_grade(quality_weighted)
        }
    
    def analyze_risk_disclosure_quality(self, text: str) -> Dict[str, float]:
        """
        Specifically analyze risk disclosure quality.
        
        Args:
            text (str): The risk disclosure text to analyze
            
        Returns:
            Dict[str, float]: Risk disclosure quality analysis
        """
        if not text or not text.strip():
            return self._get_empty_risk_results()
        
        cleaned_text = self._clean_text(text)
        words = self._extract_words(cleaned_text)
        
        if not words:
            return self._get_empty_risk_results()
        
        word_count = len(words)
        word_lower = [word.lower() for word in words]
        
        # Count risk-related terms
        risk_count = sum(1 for word in word_lower if word in self.risk_terms)
        specific_risk_count = self._count_specific_risk_terms(word_lower)
        mitigation_count = self._count_mitigation_terms(word_lower)
        
        # Calculate risk disclosure metrics
        risk_density = risk_count / word_count
        specific_risk_density = specific_risk_count / word_count
        mitigation_density = mitigation_count / word_count
        
        # Calculate risk disclosure quality scores
        risk_awareness = min(1, risk_density * 4)
        risk_specificity = min(1, specific_risk_density * 6)
        mitigation_quality = min(1, mitigation_density * 8)
        
        # Overall risk disclosure score
        risk_disclosure_score = (
            (risk_awareness * 0.4) +
            (risk_specificity * 0.35) +
            (mitigation_quality * 0.25)
        )
        
        return {
            'risk_term_density': round(risk_density, 4),
            'specific_risk_density': round(specific_risk_density, 4),
            'mitigation_density': round(mitigation_density, 4),
            'risk_awareness_score': round(risk_awareness, 4),
            'risk_specificity_score': round(risk_specificity, 4),
            'mitigation_quality_score': round(mitigation_quality, 4),
            'overall_risk_disclosure_score': round(risk_disclosure_score, 4),
            'risk_disclosure_grade': self._assign_grade(risk_disclosure_score)
        }
    
    def _clean_text(self, text: str) -> str:
        """Clean text by removing extra whitespace and normalizing."""
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s\.\,\;\:\!\?\-\(\)]', '', text)
        return text.strip()
    
    def _extract_words(self, text: str) -> List[str]:
        """Extract words from text."""
        words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
        return [word for word in words if len(word) > 1]
    
    def _count_specific_risk_terms(self, words: List[str]) -> int:
        """Count specific risk terms."""
        specific_risk_terms = {
            'systematic', 'unsystematic', 'idiosyncratic', 'market-wide', 'sector-specific',
            'company-specific', 'country-specific', 'currency-specific', 'interest-rate',
            'inflation', 'commodity-price', 'equity-price', 'credit-spread', 'liquidity-spread',
            'operational-loss', 'fraud-loss', 'cyber-attack', 'data-breach', 'business-interruption'
        }
        return sum(1 for word in words if word in specific_risk_terms)
    
    def _count_mitigation_terms(self, words: List[str]) -> int:
        """Count risk mitigation terms."""
        mitigation_terms = {
            'mitigate', 'manage', 'control', 'monitor', 'supervise', 'oversee',
            'govern', 'regulate', 'comply', 'adhere', 'follow', 'implement',
            'establish', 'maintain', 'review', 'assess', 'evaluate', 'measure',
            'report', 'disclose', 'communicate', 'train', 'educate', 'inform'
        }
        return sum(1 for word in words if word in mitigation_terms)
    
    def _assign_grade(self, score: float) -> str:
        """Assign letter grade based on score."""
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
    
    def _get_empty_specificity_results(self) -> Dict[str, float]:
        """Return empty specificity results."""
        return {
            'specific_word_ratio': 0,
            'vague_word_ratio': 0,
            'industry_term_ratio': 0,
            'risk_term_ratio': 0,
            'specificity_score': 0,
            'industry_expertise_score': 0,
            'risk_awareness_score': 0,
            'total_words': 0,
            'unique_words': 0
        }
    
    def _get_empty_risk_results(self) -> Dict[str, float]:
        """Return empty risk results."""
        return {
            'risk_term_density': 0,
            'specific_risk_density': 0,
            'mitigation_density': 0,
            'risk_awareness_score': 0,
            'risk_specificity_score': 0,
            'mitigation_quality_score': 0,
            'overall_risk_disclosure_score': 0,
            'risk_disclosure_grade': 'N/A'
        }


def analyze_disclosure_specificity(text: str) -> Dict[str, Dict[str, float]]:
    """
    Complete disclosure specificity analysis.
    
    Args:
        text (str): The text to analyze
        
    Returns:
        Dict[str, Dict[str, float]]: Complete specificity analysis
    """
    analyzer = DisclosureSpecificityAnalyzer()
    
    specificity = analyzer.analyze_specificity(text)
    quality = analyzer.analyze_disclosure_quality(text)
    risk_quality = analyzer.analyze_risk_disclosure_quality(text)
    
    return {
        'specificity_metrics': specificity,
        'quality_assessment': quality,
        'risk_disclosure_quality': risk_quality
    }


if __name__ == "__main__":
    # Example usage
    sample_risk_text = """
    The company faces significant market risks including fluctuations in equity prices,
    interest rates, and foreign exchange rates. We have implemented comprehensive risk
    management strategies to mitigate these exposures through hedging activities and
    diversification. Our operational risk framework includes robust controls for fraud
    prevention, cybersecurity protection, and business continuity planning. We regularly
    monitor and assess these risks through our enterprise risk management committee.
    """
    
    results = analyze_disclosure_specificity(sample_risk_text)
    print("Disclosure Specificity Analysis Results:")
    print(f"Specificity Metrics: {results['specificity_metrics']}")
    print(f"Quality Assessment: {results['quality_assessment']}")
    print(f"Risk Disclosure Quality: {results['risk_disclosure_quality']}")