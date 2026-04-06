#!/usr/bin/env python3
"""
Information Richness Analyzer for 10-K Disclosure Analysis

This module analyzes the information richness and content density
of company disclosures, measuring how much substantive information
is provided relative to the total disclosure volume.
"""

import re
import math
from typing import Dict, List, Set, Tuple
from collections import Counter


class InformationRichnessAnalyzer:
    """Analyzes information richness and content density of disclosure text."""
    
    def __init__(self):
        # Common filler/empty words that reduce information richness
        self.filler_words = {
            # Generic filler words
            'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'else',
            'when', 'where', 'how', 'what', 'which', 'who', 'why',
            'this', 'that', 'these', 'those', 'my', 'your', 'our', 'their',
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
            'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could',
            'can', 'may', 'might', 'must', 'shall',
            
            # Vague descriptors
            'very', 'really', 'quite', 'rather', 'somewhat', 'fairly',
            'quite', 'rather', 'pretty', 'sort', 'kind', 'type', 'way',
            'thing', 'stuff', 'aspect', 'factor', 'element', 'part',
            
            # Redundant phrases (common in disclosures)
            'in order to', 'as well as', 'due to the fact that', 'in terms of',
            'with regard to', 'in relation to', 'as a result of', 'because of',
            'in addition to', 'on the other hand', 'in the event that'
        }
        
        # Content-rich words that indicate substantive information
        self.content_words = {
            # Action/decision words
            'implement', 'execute', 'deploy', 'launch', 'develop', 'create',
            'build', 'design', 'plan', 'strategy', 'tactic', 'approach',
            'method', 'process', 'procedure', 'system', 'framework',
            
            # Measurement/analysis words
            'measure', 'analyze', 'evaluate', 'assess', 'calculate', 'compute',
            'determine', 'estimate', 'forecast', 'predict', 'project', 'model',
            'simulate', 'test', 'validate', 'verify', 'audit', 'review',
            
            # Financial/quantitative words
            'revenue', 'income', 'profit', 'loss', 'cost', 'expense', 'asset',
            'liability', 'equity', 'capital', 'investment', 'return', 'margin',
            'ratio', 'percentage', 'amount', 'value', 'price', 'rate',
            
            # Risk/compliance words
            'risk', 'exposure', 'volatility', 'uncertainty', 'sensitivity',
            'compliance', 'regulation', 'governance', 'control', 'monitor',
            'supervise', 'audit', 'report', 'disclose'
        }
        
        # Industry-specific technical terms
        self.technical_terms = {
            # Technology terms
            'algorithm', 'architecture', 'framework', 'protocol', 'interface',
            'API', 'SDK', 'database', 'server', 'client', 'network', 'security',
            'encryption', 'authentication', 'authorization', 'firewall',
            
            # Financial terms
            'derivative', 'hedging', 'arbitrage', 'liquidity', 'volatility',
            'correlation', 'covariance', 'beta', 'alpha', 'Sharpe', 'VaR',
            'stress', 'scenario', 'Monte', 'Carlo', 'Black', 'Scholes',
            
            # Manufacturing terms
            'supply', 'chain', 'logistics', 'inventory', 'production', 'manufacturing',
            'quality', 'control', 'assurance', 'testing', 'validation', 'verification',
            'efficiency', 'throughput', 'capacity', 'yield', 'defect',
            
            # Healthcare terms
            'clinical', 'trial', 'protocol', 'regulatory', 'approval', 'compliance',
            'efficacy', 'safety', 'toxicity', 'pharmacology', 'therapeutic',
            'diagnostic', 'treatment', 'outcome', 'mortality', 'morbidity'
        }
    
    def analyze_information_richness(self, text: str) -> Dict[str, float]:
        """
        Analyze the information richness of disclosure text.
        
        Args:
            text (str): The text to analyze
            
        Returns:
            Dict[str, float]: Information richness analysis results
        """
        if not text or not text.strip():
            return self._get_empty_richness_results()
        
        # Clean and prepare text
        cleaned_text = self._clean_text(text)
        words = self._extract_words(cleaned_text)
        
        if not words:
            return self._get_empty_richness_results()
        
        # Calculate various richness metrics
        total_words = len(words)
        word_lower = [word.lower() for word in words]
        
        # Count different types of words
        filler_count = sum(1 for word in word_lower if word in self.filler_words)
        content_count = sum(1 for word in word_lower if word in self.content_words)
        technical_count = sum(1 for word in word_lower if word in self.technical_terms)
        
        # Calculate ratios
        filler_ratio = filler_count / total_words
        content_ratio = content_count / total_words
        technical_ratio = technical_count / total_words
        
        # Calculate lexical diversity (type-token ratio)
        unique_words = len(set(word_lower))
        lexical_diversity = unique_words / total_words
        
        # Calculate semantic density
        semantic_density = (content_ratio + technical_ratio) / (1 + filler_ratio)
        
        # Calculate information richness score
        # Higher content ratio, technical ratio, and lexical diversity increase richness
        # Higher filler ratio decreases richness
        information_richness = (
            (content_ratio * 0.4) +
            (technical_ratio * 0.3) +
            (lexical_diversity * 0.2) -
            (filler_ratio * 0.1)
        )
        
        # Ensure score is between 0 and 1
        information_richness = max(0, min(1, information_richness))
        
        return {
            'filler_word_ratio': round(filler_ratio, 4),
            'content_word_ratio': round(content_ratio, 4),
            'technical_term_ratio': round(technical_ratio, 4),
            'lexical_diversity': round(lexical_diversity, 4),
            'semantic_density': round(semantic_density, 4),
            'information_richness_score': round(information_richness, 4),
            'richness_grade': self._assign_richness_grade(information_richness),
            'total_words': total_words,
            'unique_words': unique_words,
            'content_words_count': content_count,
            'technical_terms_count': technical_count
        }
    
    def analyze_content_density(self, text: str) -> Dict[str, float]:
        """
        Analyze the content density of disclosure text.
        
        Args:
            text (str): The text to analyze
            
        Returns:
            Dict[str, float]: Content density analysis results
        """
        if not text or not text.strip():
            return self._get_empty_density_results()
        
        cleaned_text = self._clean_text(text)
        words = self._extract_words(cleaned_text)
        
        if not words:
            return self._get_empty_density_results()
        
        total_words = len(words)
        word_lower = [word.lower() for word in words]
        
        # Count substantive vs. non-substantive words
        substantive_words = self._count_substantive_words(word_lower)
        non_substantive_words = total_words - substantive_words
        
        substantive_ratio = substantive_words / total_words
        non_substantive_ratio = non_substantive_words / total_words
        
        # Calculate content density score
        content_density = substantive_ratio
        
        # Calculate information-to-fluff ratio
        info_fluff_ratio = substantive_words / max(1, non_substantive_words)
        
        return {
            'substantive_word_ratio': round(substantive_ratio, 4),
            'non_substantive_word_ratio': round(non_substantive_ratio, 4),
            'content_density_score': round(content_density, 4),
            'information_to_fluff_ratio': round(info_fluff_ratio, 4),
            'content_density_grade': self._assign_density_grade(content_density),
            'substantive_words_count': substantive_words,
            'non_substantive_words_count': non_substantive_words,
            'total_words': total_words
        }
    
    def analyze_disclosure_depth(self, text: str) -> Dict[str, float]:
        """
        Analyze the depth and sophistication of disclosure content.
        
        Args:
            text (str): The text to analyze
            
        Returns:
            Dict[str, float]: Disclosure depth analysis results
        """
        if not text or not text.strip():
            return self._get_empty_depth_results()
        
        cleaned_text = self._clean_text(text)
        words = self._extract_words(cleaned_text)
        
        if not words:
            return self._get_empty_depth_results()
        
        total_words = len(words)
        word_lower = [word.lower() for word in words]
        
        # Count sophisticated vs. basic words
        sophisticated_count = self._count_sophisticated_words(word_lower)
        basic_count = self._count_basic_words(word_lower)
        
        sophisticated_ratio = sophisticated_count / total_words
        basic_ratio = basic_count / total_words
        
        # Calculate depth indicators
        conceptual_depth = self._calculate_conceptual_depth(word_lower)
        analytical_depth = self._calculate_analytical_depth(word_lower)
        
        # Calculate overall depth score
        depth_score = (
            (sophisticated_ratio * 0.4) +
            (conceptual_depth * 0.35) +
            (analytical_depth * 0.25)
        )
        
        return {
            'sophisticated_word_ratio': round(sophisticated_ratio, 4),
            'basic_word_ratio': round(basic_ratio, 4),
            'conceptual_depth_score': round(conceptual_depth, 4),
            'analytical_depth_score': round(analytical_depth, 4),
            'overall_depth_score': round(depth_score, 4),
            'depth_grade': self._assign_depth_grade(depth_score),
            'sophisticated_words_count': sophisticated_count,
            'basic_words_count': basic_count,
            'total_words': total_words
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
    
    def _count_substantive_words(self, words: List[str]) -> int:
        """Count substantive (content-rich) words."""
        substantive_indicators = {
            'analysis', 'assessment', 'evaluation', 'measurement', 'calculation',
            'determination', 'estimation', 'projection', 'forecast', 'prediction',
            'identification', 'classification', 'categorization', 'organization',
            'management', 'operation', 'execution', 'implementation', 'deployment',
            'development', 'growth', 'expansion', 'contraction', 'reduction',
            'strategy', 'tactic', 'approach', 'method', 'process', 'procedure',
            'system', 'framework', 'model', 'structure', 'architecture'
        }
        return sum(1 for word in words if word in substantive_indicators or len(word) > 4)
    
    def _count_sophisticated_words(self, words: List[str]) -> int:
        """Count sophisticated/complex words."""
        sophisticated_indicators = {
            'comprehensive', 'sophisticated', 'complex', 'intricate', 'detailed',
            'thorough', 'extensive', 'comprehensive', 'systematic', 'methodical',
            'analytical', 'critical', 'evaluative', 'assessive', 'measurable',
            'quantifiable', 'predictable', 'reliable', 'consistent', 'stable',
            'durable', 'sustainable', 'resilient', 'adaptive', 'flexible'
        }
        return sum(1 for word in words if word in sophisticated_indicators or len(word) > 6)
    
    def _count_basic_words(self, words: List[str]) -> int:
        """Count basic/simple words."""
        basic_indicators = {
            'good', 'bad', 'big', 'small', 'new', 'old', 'high', 'low', 'long',
            'short', 'fast', 'slow', 'easy', 'hard', 'simple', 'basic', 'clear',
            'obvious', 'important', 'key', 'main', 'major', 'minor', 'few',
            'many', 'much', 'some', 'any', 'all', 'none', 'very', 'really'
        }
        return sum(1 for word in words if word in basic_indicators or len(word) <= 4)
    
    def _calculate_conceptual_depth(self, words: List[str]) -> float:
        """Calculate conceptual depth of the text."""
        conceptual_terms = {
            'concept', 'idea', 'principle', 'theory', 'hypothesis', 'framework',
            'paradigm', 'model', 'conceptual', 'theoretical', 'philosophical',
            'fundamental', 'essential', 'core', 'basic', 'underlying', 'implicit',
            'explicit', 'abstract', 'concrete', 'tangible', 'intangible'
        }
        
        conceptual_count = sum(1 for word in words if word in conceptual_terms)
        return min(1, conceptual_count / len(words) * 10) if words else 0
    
    def _calculate_analytical_depth(self, words: List[str]) -> float:
        """Calculate analytical depth of the text."""
        analytical_terms = {
            'analyze', 'analysis', 'analytical', 'examine', 'examination',
            'investigate', 'investigation', 'research', 'study', 'studies',
            'explore', 'exploration', 'understand', 'understanding', 'comprehend',
            'comprehension', 'interpret', 'interpretation', 'explain', 'explanation'
        }
        
        analytical_count = sum(1 for word in words if word in analytical_terms)
        return min(1, analytical_count / len(words) * 15) if words else 0
    
    def _assign_richness_grade(self, score: float) -> str:
        """Assign richness grade based on score."""
        if score >= 0.8:
            return 'A'
        elif score >= 0.7:
            return 'B'
        elif score >= 0.6:
            return 'C'
        elif score >= 0.5:
            return 'D'
        else:
            return 'F'
    
    def _assign_density_grade(self, score: float) -> str:
        """Assign density grade based on score."""
        if score >= 0.7:
            return 'A'
        elif score >= 0.6:
            return 'B'
        elif score >= 0.5:
            return 'C'
        elif score >= 0.4:
            return 'D'
        else:
            return 'F'
    
    def _assign_depth_grade(self, score: float) -> str:
        """Assign depth grade based on score."""
        if score >= 0.75:
            return 'A'
        elif score >= 0.65:
            return 'B'
        elif score >= 0.55:
            return 'C'
        elif score >= 0.45:
            return 'D'
        else:
            return 'F'
    
    def _get_empty_richness_results(self) -> Dict[str, float]:
        """Return empty richness results."""
        return {
            'filler_word_ratio': 0,
            'content_word_ratio': 0,
            'technical_term_ratio': 0,
            'lexical_diversity': 0,
            'semantic_density': 0,
            'information_richness_score': 0,
            'richness_grade': 'N/A',
            'total_words': 0,
            'unique_words': 0,
            'content_words_count': 0,
            'technical_terms_count': 0
        }
    
    def _get_empty_density_results(self) -> Dict[str, float]:
        """Return empty density results."""
        return {
            'substantive_word_ratio': 0,
            'non_substantive_word_ratio': 0,
            'content_density_score': 0,
            'information_to_fluff_ratio': 0,
            'content_density_grade': 'N/A',
            'substantive_words_count': 0,
            'non_substantive_words_count': 0,
            'total_words': 0
        }
    
    def _get_empty_depth_results(self) -> Dict[str, float]:
        """Return empty depth results."""
        return {
            'sophisticated_word_ratio': 0,
            'basic_word_ratio': 0,
            'conceptual_depth_score': 0,
            'analytical_depth_score': 0,
            'overall_depth_score': 0,
            'depth_grade': 'N/A',
            'sophisticated_words_count': 0,
            'basic_words_count': 0,
            'total_words': 0
        }


def analyze_information_richness(text: str) -> Dict:
    """
    Complete information richness analysis of text.
    
    Args:
        text (str): The text to analyze
        
    Returns:
        Dict: Complete richness analysis
    """
    analyzer = InformationRichnessAnalyzer()
    
    richness = analyzer.analyze_information_richness(text)
    density = analyzer.analyze_content_density(text)
    depth = analyzer.analyze_disclosure_depth(text)
    
    return {
        'richness_metrics': richness,
        'density_analysis': density,
        'depth_analysis': depth
    }


if __name__ == "__main__":
    # Example usage
    sample_text = """
    The company has implemented a comprehensive risk management framework that includes
    sophisticated analytical models and detailed quantitative assessments. Our approach
    involves systematic analysis of market conditions, thorough evaluation of potential
    exposures, and continuous monitoring of key performance indicators. We utilize
    advanced algorithms and cutting-edge technology to ensure accurate forecasting
    and reliable predictions for strategic decision-making.
    """
    
    results = analyze_information_richness(sample_text)
    print("Information Richness Analysis Results:")
    print(f"Richness Metrics: {results['richness_metrics']}")
    print(f"Density Analysis: {results['density_analysis']}")
    print(f"Depth Analysis: {results['depth_analysis']}")