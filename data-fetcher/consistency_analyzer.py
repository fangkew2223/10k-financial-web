#!/usr/bin/env python3
"""
Consistency Analyzer for 10-K Disclosure Analysis

This module analyzes year-to-year consistency in company disclosures,
measuring how consistent and stable the disclosure language is over time.
"""

import re
import math
from typing import Dict, List, Set, Tuple
from collections import Counter, defaultdict


class ConsistencyAnalyzer:
    """Analyzes consistency and stability of disclosure text over time."""
    
    def __init__(self):
        # Words that indicate change or uncertainty (negative consistency indicators)
        self.change_indicators = {
            'change', 'changed', 'changing', 'changes', 'changing',
            'modify', 'modified', 'modifying', 'modification',
            'alter', 'altered', 'altering', 'alteration',
            'adjust', 'adjusted', 'adjusting', 'adjustment',
            'revise', 'revised', 'revising', 'revision',
            'update', 'updated', 'updating', 'update',
            'new', 'newer', 'newest', 'recent', 'latest',
            'different', 'differ', 'differed', 'difference',
            'shift', 'shifted', 'shifting', 'shifts',
            'transition', 'transitioned', 'transitioning', 'transitions',
            'evolve', 'evolved', 'evolving', 'evolution'
        }
        
        # Words that indicate stability and consistency (positive consistency indicators)
        self.stability_indicators = {
            'consistent', 'consistently', 'consistency',
            'stable', 'stability', 'stabilize', 'stabilized', 'stabilizing',
            'steady', 'steadily', 'steadiness',
            'constant', 'constantly', 'constancy',
            'reliable', 'reliably', 'reliability',
            'dependable', 'dependably', 'dependability',
            'predictable', 'predictably', 'predictability',
            'unchanged', 'unchanging', 'unchangeable',
            'permanent', 'permanently', 'permanence',
            'enduring', 'endurance', 'endures',
            'maintain', 'maintained', 'maintaining', 'maintenance',
            'preserve', 'preserved', 'preserving', 'preservation',
            'sustain', 'sustained', 'sustaining', 'sustainability'
        }
        
        # Risk-related terms that should be consistently addressed
        self.core_risk_terms = {
            'risk', 'risks', 'risk-management', 'risk-mitigation',
            'market-risk', 'credit-risk', 'operational-risk', 'liquidity-risk',
            'regulatory-risk', 'compliance-risk', 'reputational-risk',
            'strategic-risk', 'financial-risk', 'economic-risk',
            'volatility', 'uncertainty', 'exposure', 'sensitivity'
        }
        
        # Financial terms that should show consistency in reporting
        self.core_financial_terms = {
            'revenue', 'income', 'profit', 'loss', 'expense', 'cost',
            'asset', 'liability', 'equity', 'capital', 'investment',
            'cash-flow', 'liquidity', 'solvency', 'leverage', 'debt',
            'equity', 'shareholder', 'dividend', 'earnings', 'margin'
        }
    
    def analyze_consistency_between_years(self, text_current: str, text_previous: str) -> Dict[str, float]:
        """
        Analyze consistency between current and previous year disclosures.
        
        Args:
            text_current (str): Current year disclosure text
            text_previous (str): Previous year disclosure text
            
        Returns:
            Dict[str, float]: Consistency analysis results
        """
        if not text_current or not text_previous:
            return self._get_empty_consistency_results()
        
        # Clean and prepare texts
        cleaned_current = self._clean_text(text_current)
        cleaned_previous = self._clean_text(text_previous)
        
        words_current = self._extract_words(cleaned_current)
        words_previous = self._extract_words(cleaned_previous)
        
        if not words_current or not words_previous:
            return self._get_empty_consistency_results()
        
        # Calculate various consistency metrics
        word_count_current = len(words_current)
        word_count_previous = len(words_previous)
        
        # Convert to lowercase for comparison
        words_current_lower = [word.lower() for word in words_current]
        words_previous_lower = [word.lower() for word in words_previous]
        
        # Calculate vocabulary overlap
        unique_current = set(words_current_lower)
        unique_previous = set(words_previous_lower)
        
        overlap_count = len(unique_current.intersection(unique_previous))
        total_unique = len(unique_current.union(unique_previous))
        
        # Calculate Jaccard similarity
        jaccard_similarity = overlap_count / total_unique if total_unique > 0 else 0
        
        # Calculate cosine similarity
        cosine_similarity = self._calculate_cosine_similarity(words_current_lower, words_previous_lower)
        
        # Calculate term consistency for core terms
        risk_consistency = self._calculate_term_consistency(
            words_current_lower, words_previous_lower, self.core_risk_terms
        )
        financial_consistency = self._calculate_term_consistency(
            words_current_lower, words_previous_lower, self.core_financial_terms
        )
        
        # Calculate change/stability indicators
        change_score = self._calculate_change_indicators(words_current_lower, words_previous_lower)
        stability_score = self._calculate_stability_indicators(words_current_lower, words_previous_lower)
        
        # Calculate overall consistency score
        overall_consistency = (
            (jaccard_similarity * 0.25) +
            (cosine_similarity * 0.25) +
            (risk_consistency * 0.2) +
            (financial_consistency * 0.15) +
            (stability_score * 0.1) +
            ((1 - change_score) * 0.05)
        )
        
        return {
            'jaccard_similarity': round(jaccard_similarity, 4),
            'cosine_similarity': round(cosine_similarity, 4),
            'risk_term_consistency': round(risk_consistency, 4),
            'financial_term_consistency': round(financial_consistency, 4),
            'change_indicators_score': round(change_score, 4),
            'stability_indicators_score': round(stability_score, 4),
            'overall_consistency_score': round(overall_consistency, 4),
            'consistency_grade': self._assign_consistency_grade(overall_consistency),
            'vocabulary_overlap': overlap_count,
            'total_unique_words': total_unique,
            'current_word_count': word_count_current,
            'previous_word_count': word_count_previous
        }
    
    def analyze_disclosure_stability(self, disclosures: List[str]) -> Dict[str, float]:
        """
        Analyze stability of disclosures over multiple years.
        
        Args:
            disclosures (List[str]): List of disclosure texts ordered by year (oldest first)
            
        Returns:
            Dict[str, float]: Stability analysis results
        """
        if not disclosures or len(dislosures) < 2:
            return self._get_empty_stability_results()
        
        # Clean and prepare all disclosures
        cleaned_disclosures = [self._clean_text(text) for text in disclosures if text and text.strip()]
        
        if len(cleaned_disclosures) < 2:
            return self._get_empty_stability_results()
        
        # Extract words from all disclosures
        all_word_lists = [self._extract_words(text) for text in cleaned_disclosures]
        all_word_lists = [words for words in all_word_lists if words]  # Filter out empty lists
        
        if len(all_word_lists) < 2:
            return self._get_empty_stability_results()
        
        # Calculate pairwise similarities
        similarities = []
        for i in range(len(all_word_lists) - 1):
            words_current = [word.lower() for word in all_word_lists[i]]
            words_next = [word.lower() for word in all_word_lists[i + 1]]
            
            similarity = self._calculate_cosine_similarity(words_current, words_next)
            similarities.append(similarity)
        
        # Calculate stability metrics
        avg_similarity = sum(similarities) / len(similarities) if similarities else 0
        similarity_variance = self._calculate_variance(similarities)
        stability_trend = self._calculate_stability_trend(similarities)
        
        # Calculate vocabulary stability
        vocabulary_stability = self._calculate_vocabulary_stability(all_word_lists)
        
        # Calculate term consistency over time
        risk_stability = self._calculate_term_stability_over_time(all_word_lists, self.core_risk_terms)
        financial_stability = self._calculate_term_stability_over_time(all_word_lists, self.core_financial_terms)
        
        # Calculate overall stability score
        overall_stability = (
            (avg_similarity * 0.3) +
            (vocabulary_stability * 0.25) +
            (risk_stability * 0.2) +
            (financial_stability * 0.15) +
            (stability_trend * 0.1)
        )
        
        return {
            'average_similarity': round(avg_similarity, 4),
            'similarity_variance': round(similarity_variance, 4),
            'stability_trend': round(stability_trend, 4),
            'vocabulary_stability': round(vocabulary_stability, 4),
            'risk_term_stability': round(risk_stability, 4),
            'financial_term_stability': round(financial_stability, 4),
            'overall_stability_score': round(overall_stability, 4),
            'stability_grade': self._assign_stability_grade(overall_stability),
            'number_of_years': len(all_word_lists),
            'similarity_scores': [round(s, 4) for s in similarities]
        }
    
    def detect_disclosure_changes(self, text_current: str, text_previous: str) -> Dict[str, List[str]]:
        """
        Detect specific changes between current and previous disclosures.
        
        Args:
            text_current (str): Current year disclosure text
            text_previous (str): Previous year disclosure text
            
        Returns:
            Dict[str, List[str]]: Detected changes
        """
        if not text_current or not text_previous:
            return {'new_terms': [], 'removed_terms': [], 'changed_terms': []}
        
        cleaned_current = self._clean_text(text_current)
        cleaned_previous = self._clean_text(text_previous)
        
        words_current = [word.lower() for word in self._extract_words(cleaned_current)]
        words_previous = [word.lower() for word in self._extract_words(cleaned_previous)]
        
        if not words_current or not words_previous:
            return {'new_terms': [], 'removed_terms': [], 'changed_terms': []}
        
        # Count word frequencies
        freq_current = Counter(words_current)
        freq_previous = Counter(words_previous)
        
        # Find new terms (in current but not in previous)
        new_terms = set(freq_current.keys()) - set(freq_previous.keys())
        
        # Find removed terms (in previous but not in current)
        removed_terms = set(freq_previous.keys()) - set(freq_current.keys())
        
        # Find changed terms (frequency changed significantly)
        changed_terms = []
        for term in set(freq_current.keys()) & set(freq_previous.keys()):
            current_freq = freq_current[term]
            previous_freq = freq_previous[term]
            
            # Consider significant change if frequency changed by more than 50%
            if previous_freq > 0:
                change_ratio = abs(current_freq - previous_freq) / previous_freq
                if change_ratio > 0.5:
                    changed_terms.append(term)
        
        return {
            'new_terms': list(new_terms),
            'removed_terms': list(removed_terms),
            'changed_terms': changed_terms
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
    
    def _calculate_cosine_similarity(self, words1: List[str], words2: List[str]) -> float:
        """Calculate cosine similarity between two word lists."""
        if not words1 or not words2:
            return 0
        
        # Count word frequencies
        freq1 = Counter(words1)
        freq2 = Counter(words2)
        
        # Get all unique words
        all_words = set(freq1.keys()) | set(freq2.keys())
        
        # Calculate dot product and magnitudes
        dot_product = sum(freq1.get(word, 0) * freq2.get(word, 0) for word in all_words)
        magnitude1 = math.sqrt(sum(freq1.get(word, 0) ** 2 for word in all_words))
        magnitude2 = math.sqrt(sum(freq2.get(word, 0) ** 2 for word in all_words))
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0
        
        return dot_product / (magnitude1 * magnitude2)
    
    def _calculate_term_consistency(self, words1: List[str], words2: List[str], target_terms: Set[str]) -> float:
        """Calculate consistency of specific terms between two word lists."""
        terms1 = [word for word in words1 if word in target_terms]
        terms2 = [word for word in words2 if word in target_terms]
        
        if not terms1 and not terms2:
            return 1.0  # Both empty, perfectly consistent
        
        if not terms1 or not terms2:
            return 0.0  # One has terms, other doesn't
        
        # Calculate overlap
        set1 = set(terms1)
        set2 = set(terms2)
        
        overlap = len(set1.intersection(set2))
        total = len(set1.union(set2))
        
        return overlap / total if total > 0 else 0
    
    def _calculate_change_indicators(self, words_current: List[str], words_previous: List[str]) -> float:
        """Calculate change indicators score."""
        current_changes = sum(1 for word in words_current if word in self.change_indicators)
        previous_changes = sum(1 for word in words_previous if word in self.change_indicators)
        
        current_ratio = current_changes / len(words_current) if words_current else 0
        previous_ratio = previous_changes / len(words_previous) if words_previous else 0
        
        # Higher change indicator ratio means lower consistency
        return (current_ratio + previous_ratio) / 2
    
    def _calculate_stability_indicators(self, words_current: List[str], words_previous: List[str]) -> float:
        """Calculate stability indicators score."""
        current_stability = sum(1 for word in words_current if word in self.stability_indicators)
        previous_stability = sum(1 for word in words_previous if word in self.stability_indicators)
        
        current_ratio = current_stability / len(words_current) if words_current else 0
        previous_ratio = previous_stability / len(words_previous) if words_previous else 0
        
        # Higher stability indicator ratio means higher consistency
        return (current_ratio + previous_ratio) / 2
    
    def _calculate_variance(self, values: List[float]) -> float:
        """Calculate variance of a list of values."""
        if not values:
            return 0
        
        mean = sum(values) / len(values)
        variance = sum((x - mean) ** 2 for x in values) / len(values)
        
        return variance
    
    def _calculate_stability_trend(self, similarities: List[float]) -> float:
        """Calculate stability trend over time."""
        if len(similarities) < 2:
            return 0
        
        # Calculate trend using linear regression slope
        n = len(similarities)
        x_values = list(range(n))
        y_values = similarities
        
        x_mean = sum(x_values) / n
        y_mean = sum(y_values) / n
        
        numerator = sum((x_values[i] - x_mean) * (y_values[i] - y_mean) for i in range(n))
        denominator = sum((x_values[i] - x_mean) ** 2 for i in range(n))
        
        if denominator == 0:
            return 0
        
        slope = numerator / denominator
        
        # Normalize slope to 0-1 range
        # Assuming reasonable slope range of -0.1 to 0.1
        normalized_slope = max(0, min(1, (slope + 0.1) / 0.2))
        
        return normalized_slope
    
    def _calculate_vocabulary_stability(self, all_word_lists: List[List[str]]) -> float:
        """Calculate vocabulary stability over time."""
        if len(all_word_lists) < 2:
            return 0
        
        # Calculate pairwise Jaccard similarities
        similarities = []
        for i in range(len(all_word_lists) - 1):
            set1 = set(all_word_lists[i])
            set2 = set(all_word_lists[i + 1])
            
            overlap = len(set1.intersection(set2))
            total = len(set1.union(set2))
            
            similarity = overlap / total if total > 0 else 0
            similarities.append(similarity)
        
        return sum(similarities) / len(similarities) if similarities else 0
    
    def _calculate_term_stability_over_time(self, all_word_lists: List[List[str]], target_terms: Set[str]) -> float:
        """Calculate stability of specific terms over time."""
        if len(all_word_lists) < 2:
            return 0
        
        # Calculate term presence in each year
        term_presence = []
        for word_list in all_word_lists:
            terms_found = [word for word in word_list if word in target_terms]
            presence_ratio = len(terms_found) / len(word_list) if word_list else 0
            term_presence.append(presence_ratio)
        
        # Calculate stability as inverse of variance
        if len(term_presence) < 2:
            return 0
        
        mean_presence = sum(term_presence) / len(term_presence)
        variance = sum((x - mean_presence) ** 2 for x in term_presence) / len(term_presence)
        
        # Normalize variance to 0-1 range (assuming max reasonable variance of 0.25)
        stability = max(0, 1 - (variance / 0.25))
        
        return stability
    
    def _assign_consistency_grade(self, score: float) -> str:
        """Assign consistency grade based on score."""
        if score >= 0.85:
            return 'A'
        elif score >= 0.75:
            return 'B'
        elif score >= 0.65:
            return 'C'
        elif score >= 0.55:
            return 'D'
        else:
            return 'F'
    
    def _assign_stability_grade(self, score: float) -> str:
        """Assign stability grade based on score."""
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
    
    def _get_empty_consistency_results(self) -> Dict[str, float]:
        """Return empty consistency results."""
        return {
            'jaccard_similarity': 0,
            'cosine_similarity': 0,
            'risk_term_consistency': 0,
            'financial_term_consistency': 0,
            'change_indicators_score': 0,
            'stability_indicators_score': 0,
            'overall_consistency_score': 0,
            'consistency_grade': 'N/A',
            'vocabulary_overlap': 0,
            'total_unique_words': 0,
            'current_word_count': 0,
            'previous_word_count': 0
        }
    
    def _get_empty_stability_results(self) -> Dict[str, float]:
        """Return empty stability results."""
        return {
            'average_similarity': 0,
            'similarity_variance': 0,
            'stability_trend': 0,
            'vocabulary_stability': 0,
            'risk_term_stability': 0,
            'financial_term_stability': 0,
            'overall_stability_score': 0,
            'stability_grade': 'N/A',
            'number_of_years': 0,
            'similarity_scores': []
        }


def analyze_disclosure_consistency(text_current: str, text_previous: str) -> Dict:
    """
    Complete consistency analysis between two disclosure texts.
    
    Args:
        text_current (str): Current year disclosure text
        text_previous (str): Previous year disclosure text
        
    Returns:
        Dict: Complete consistency analysis
    """
    analyzer = ConsistencyAnalyzer()
    
    consistency = analyzer.analyze_consistency_between_years(text_current, text_previous)
    changes = analyzer.detect_disclosure_changes(text_current, text_previous)
    
    return {
        'consistency_metrics': consistency,
        'detected_changes': changes
    }


if __name__ == "__main__":
    # Example usage
    current_text = """
    The company faces significant market risks including fluctuations in equity prices,
    interest rates, and foreign exchange rates. We have implemented comprehensive risk
    management strategies to mitigate these exposures through hedging activities and
    diversification. Our operational risk framework includes robust controls for fraud
    prevention, cybersecurity protection, and business continuity planning.
    """
    
    previous_text = """
    The company faces various market risks including fluctuations in equity prices,
    interest rates, and foreign exchange rates. We have implemented risk management
    strategies to mitigate these exposures through hedging activities and
    diversification. Our operational risk framework includes controls for fraud
    prevention, cybersecurity protection, and business continuity planning.
    """
    
    results = analyze_disclosure_consistency(current_text, previous_text)
    print("Disclosure Consistency Analysis Results:")
    print(f"Consistency Metrics: {results['consistency_metrics']}")
    print(f"Detected Changes: {results['detected_changes']}")