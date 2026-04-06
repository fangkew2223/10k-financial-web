#!/usr/bin/env python3
"""
Text Analyzer for 10-K Disclosure Transparency Analysis

This module provides functions to analyze the readability and clarity
of 10-K filing text sections including risk factors, MD&A, and accounting policies.
"""

import re
import math
from typing import Dict, List, Tuple
from collections import Counter


class TextAnalyzer:
    """Analyzes text readability and clarity metrics for disclosure transparency."""
    
    def __init__(self):
        # Common vague/qualitative words that reduce disclosure specificity
        self.vague_words = {
            'may', 'might', 'could', 'should', 'would', 'can', 'will', 'shall',
            'approximately', 'about', 'around', 'roughly', 'generally', 'typically',
            'usually', 'often', 'sometimes', 'occasionally', 'rarely', 'seldom',
            'potentially', 'possibly', 'likely', 'probably', 'seemingly', 'apparently',
            'arguably', 'presumably', 'supposedly', 'allegedly', 'reportedly',
            'significant', 'material', 'substantial', 'considerable', 'notable',
            'important', 'critical', 'essential', 'vital', 'crucial', 'key'
        }
        
        # Common complex/technical words that may indicate sophisticated disclosure
        self.sophisticated_words = {
            'quantitative', 'qualitative', 'methodology', 'framework', 'parameter',
            'metric', 'indicator', 'benchmark', 'threshold', 'criterion', 'criteria',
            'assessment', 'evaluation', 'analysis', 'analytics', 'statistical',
            'probabilistic', 'deterministic', 'stochastic', 'empirical', 'theoretical',
            'hypothesis', 'validation', 'verification', 'calibration', 'optimization',
            'simulation', 'modeling', 'forecasting', 'projection', 'estimation'
        }
    
    def calculate_readability_metrics(self, text: str) -> Dict[str, float]:
        """
        Calculate various readability metrics for the given text.
        
        Args:
            text (str): The text to analyze
            
        Returns:
            Dict[str, float]: Dictionary containing readability scores
        """
        if not text or not text.strip():
            return {
                'flesch_reading_ease': 0,
                'flesch_kincaid_grade': 0,
                'gunning_fog_index': 0,
                'smog_index': 0,
                'automated_readability_index': 0,
                'coleman_liau_index': 0,
                'text_length': 0,
                'word_count': 0,
                'sentence_count': 0,
                'avg_sentence_length': 0,
                'avg_word_length': 0
            }
        
        # Clean and prepare text
        cleaned_text = self._clean_text(text)
        
        # Count elements
        sentences = self._split_sentences(cleaned_text)
        words = self._extract_words(cleaned_text)
        syllables = self._count_syllables(words)
        
        # Calculate basic metrics
        word_count = len(words)
        sentence_count = len(sentences)
        syllable_count = sum(syllables.values())
        
        if word_count == 0 or sentence_count == 0:
            return self._get_empty_metrics()
        
        # Calculate averages
        avg_sentence_length = word_count / sentence_count
        avg_word_length = sum(len(word) for word in words) / word_count if words else 0
        
        # Calculate readability scores
        flesch_reading_ease = self._calculate_flesch_reading_ease(avg_sentence_length, syllable_count / word_count)
        flesch_kincaid_grade = self._calculate_flesch_kincaid_grade(avg_sentence_length, syllable_count / word_count)
        gunning_fog = self._calculate_gunning_fog_index(avg_sentence_length, self._count_complex_words(words) / word_count)
        smog_index = self._calculate_smog_index(sentences)
        ari = self._calculate_automated_readability_index(avg_sentence_length, avg_word_length)
        coleman_liau = self._calculate_coleman_liau_index(avg_sentence_length, self._count_letters(words) / word_count)
        
        return {
            'flesch_reading_ease': round(flesch_reading_ease, 2),
            'flesch_kincaid_grade': round(flesch_kincaid_grade, 2),
            'gunning_fog_index': round(gunning_fog, 2),
            'smog_index': round(smog_index, 2),
            'automated_readability_index': round(ari, 2),
            'coleman_liau_index': round(coleman_liau, 2),
            'text_length': len(text),
            'word_count': word_count,
            'sentence_count': sentence_count,
            'avg_sentence_length': round(avg_sentence_length, 2),
            'avg_word_length': round(avg_word_length, 2)
        }
    
    def calculate_disclosure_specificity(self, text: str) -> Dict[str, float]:
        """
        Calculate disclosure specificity metrics.
        
        Args:
            text (str): The text to analyze
            
        Returns:
            Dict[str, float]: Dictionary containing specificity scores
        """
        if not text or not text.strip():
            return {
                'vague_word_ratio': 0,
                'concrete_word_ratio': 0,
                'specificity_score': 0,
                'quantitative_ratio': 0,
                'qualitative_ratio': 0
            }
        
        cleaned_text = self._clean_text(text)
        words = self._extract_words(cleaned_text)
        
        if not words:
            return self._get_empty_specificity()
        
        # Count word types
        word_lower = [word.lower() for word in words]
        vague_count = sum(1 for word in word_lower if word in self.vague_words)
        sophisticated_count = sum(1 for word in word_lower if word in self.sophisticated_words)
        
        # Count quantitative vs qualitative words
        quantitative_words = self._count_quantitative_words(word_lower)
        qualitative_words = self._count_qualitative_words(word_lower)
        
        # Calculate ratios
        total_words = len(words)
        vague_ratio = vague_count / total_words
        concrete_ratio = sophisticated_count / total_words
        quantitative_ratio = quantitative_words / total_words
        qualitative_ratio = qualitative_words / total_words
        
        # Calculate specificity score (higher is more specific)
        # Penalize vague words, reward sophisticated/concrete words
        specificity_score = max(0, min(1, concrete_ratio - vague_ratio + 0.5))
        
        return {
            'vague_word_ratio': round(vague_ratio, 4),
            'concrete_word_ratio': round(concrete_ratio, 4),
            'specificity_score': round(specificity_score, 4),
            'quantitative_ratio': round(quantitative_ratio, 4),
            'qualitative_ratio': round(qualitative_ratio, 4)
        }
    
    def calculate_information_richness(self, text: str) -> Dict[str, float]:
        """
        Calculate information richness metrics.
        
        Args:
            text (str): The text to analyze
            
        Returns:
            Dict[str, float]: Dictionary containing richness scores
        """
        if not text or not text.strip():
            return {
                'content_density': 0,
                'unique_word_ratio': 0,
                'lexical_diversity': 0,
                'information_score': 0
            }
        
        cleaned_text = self._clean_text(text)
        words = self._extract_words(cleaned_text)
        
        if not words:
            return self._get_empty_richness()
        
        # Calculate content density (ratio of content words to total words)
        content_words = self._count_content_words(words)
        content_density = content_words / len(words)
        
        # Calculate lexical diversity (type-token ratio)
        unique_words = len(set(word.lower() for word in words))
        lexical_diversity = unique_words / len(words)
        
        # Calculate unique word ratio
        unique_word_ratio = unique_words / len(words)
        
        # Calculate overall information score
        # Combines content density and lexical diversity
        information_score = (content_density * 0.6) + (lexical_diversity * 0.4)
        
        return {
            'content_density': round(content_density, 4),
            'unique_word_ratio': round(unique_word_ratio, 4),
            'lexical_diversity': round(lexical_diversity, 4),
            'information_score': round(information_score, 4)
        }
    
    def _clean_text(self, text: str) -> str:
        """Clean text by removing extra whitespace and normalizing."""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s\.\,\;\:\!\?\-\(\)]', '', text)
        return text.strip()
    
    def _split_sentences(self, text: str) -> List[str]:
        """Split text into sentences."""
        # Simple sentence splitting - can be improved with more sophisticated methods
        sentences = re.split(r'[.!?]+', text)
        return [s.strip() for s in sentences if s.strip()]
    
    def _extract_words(self, text: str) -> List[str]:
        """Extract words from text."""
        # Remove punctuation and split into words
        words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
        return [word for word in words if len(word) > 1]  # Filter out single letters
    
    def _count_syllables(self, words: List[str]) -> Dict[str, int]:
        """Count syllables in words using a simple heuristic."""
        syllable_counts = {}
        for word in words:
            # Simple syllable counting heuristic
            word_lower = word.lower()
            syllables = max(1, len(re.findall(r'[aeiouy]+', word_lower)))
            # Subtract silent e at the end
            if word_lower.endswith('e') and not word_lower.endswith('le'):
                syllables = max(1, syllables - 1)
            syllable_counts[word] = syllables
        return syllable_counts
    
    def _count_complex_words(self, words: List[str]) -> int:
        """Count complex words (3 or more syllables)."""
        syllable_counts = self._count_syllables(words)
        return sum(1 for count in syllable_counts.values() if count >= 3)
    
    def _count_letters(self, words: List[str]) -> int:
        """Count total letters in words."""
        return sum(len(word) for word in words)
    
    def _count_quantitative_words(self, words: List[str]) -> int:
        """Count quantitative/numerical words."""
        quantitative_indicators = {
            'percent', 'percentage', 'rate', 'ratio', 'proportion', 'fraction',
            'amount', 'value', 'cost', 'price', 'revenue', 'income', 'profit',
            'loss', 'expense', 'asset', 'liability', 'equity', 'capital',
            'number', 'quantity', 'volume', 'size', 'scale', 'magnitude',
            'level', 'degree', 'extent', 'range', 'scope', 'capacity'
        }
        return sum(1 for word in words if word in quantitative_indicators)
    
    def _count_qualitative_words(self, words: List[str]) -> int:
        """Count qualitative/evaluative words."""
        qualitative_indicators = {
            'quality', 'performance', 'efficiency', 'effectiveness', 'impact',
            'influence', 'result', 'outcome', 'consequence', 'implication',
            'benefit', 'advantage', 'disadvantage', 'risk', 'opportunity',
            'challenge', 'issue', 'problem', 'solution', 'approach', 'method',
            'strategy', 'tactic', 'process', 'procedure', 'practice', 'policy'
        }
        return sum(1 for word in words if word in qualitative_indicators)
    
    def _count_content_words(self, words: List[str]) -> int:
        """Count content words (nouns, verbs, adjectives, adverbs)."""
        # Simple heuristic: content words are typically longer and more specific
        content_indicators = {
            'analysis', 'assessment', 'evaluation', 'measurement', 'calculation',
            'determination', 'estimation', 'projection', 'forecast', 'prediction',
            'identification', 'classification', 'categorization', 'organization',
            'management', 'operation', 'execution', 'implementation', 'deployment',
            'development', 'growth', 'expansion', 'contraction', 'reduction'
        }
        return sum(1 for word in words if word.lower() in content_indicators or len(word) > 3)
    
    def _calculate_flesch_reading_ease(self, avg_sentence_length: float, avg_syllables_per_word: float) -> float:
        """Calculate Flesch Reading Ease score."""
        return 206.835 - (1.015 * avg_sentence_length) - (84.6 * avg_syllables_per_word)
    
    def _calculate_flesch_kincaid_grade(self, avg_sentence_length: float, avg_syllables_per_word: float) -> float:
        """Calculate Flesch-Kincaid Grade Level."""
        return (0.39 * avg_sentence_length) + (11.8 * avg_syllables_per_word) - 15.59
    
    def _calculate_gunning_fog_index(self, avg_sentence_length: float, complex_word_ratio: float) -> float:
        """Calculate Gunning Fog Index."""
        return 0.4 * (avg_sentence_length + (100 * complex_word_ratio))
    
    def _calculate_smog_index(self, sentences: List[str]) -> float:
        """Calculate SMOG Index."""
        # Count sentences with 3+ complex words
        complex_sentences = 0
        for sentence in sentences:
            words = self._extract_words(sentence)
            complex_words = self._count_complex_words(words)
            if complex_words >= 3:
                complex_sentences += 1
        
        if len(sentences) < 30:
            return 0  # SMOG requires at least 30 sentences
        
        return 1.0430 * math.sqrt(complex_sentences * (30 / len(sentences))) + 3.1291
    
    def _calculate_automated_readability_index(self, avg_sentence_length: float, avg_word_length: float) -> float:
        """Calculate Automated Readability Index."""
        return (4.71 * avg_word_length) + (0.5 * avg_sentence_length) - 21.43
    
    def _calculate_coleman_liau_index(self, avg_sentence_length: float, avg_letters_per_word: float) -> float:
        """Calculate Coleman-Liau Index."""
        return (0.0588 * avg_letters_per_word * 100) - (0.296 * (100 / avg_sentence_length)) - 15.8
    
    def _get_empty_metrics(self) -> Dict[str, float]:
        """Return empty metrics dictionary."""
        return {
            'flesch_reading_ease': 0,
            'flesch_kincaid_grade': 0,
            'gunning_fog_index': 0,
            'smog_index': 0,
            'automated_readability_index': 0,
            'coleman_liau_index': 0,
            'text_length': 0,
            'word_count': 0,
            'sentence_count': 0,
            'avg_sentence_length': 0,
            'avg_word_length': 0
        }
    
    def _get_empty_specificity(self) -> Dict[str, float]:
        """Return empty specificity dictionary."""
        return {
            'vague_word_ratio': 0,
            'concrete_word_ratio': 0,
            'specificity_score': 0,
            'quantitative_ratio': 0,
            'qualitative_ratio': 0
        }
    
    def _get_empty_richness(self) -> Dict[str, float]:
        """Return empty richness dictionary."""
        return {
            'content_density': 0,
            'unique_word_ratio': 0,
            'lexical_diversity': 0,
            'information_score': 0
        }


def analyze_text_transparency(text: str) -> Dict[str, Dict[str, float]]:
    """
    Complete transparency analysis of text.
    
    Args:
        text (str): The text to analyze
        
    Returns:
        Dict[str, Dict[str, float]]: Complete analysis results
    """
    analyzer = TextAnalyzer()
    
    readability = analyzer.calculate_readability_metrics(text)
    specificity = analyzer.calculate_disclosure_specificity(text)
    richness = analyzer.calculate_information_richness(text)
    
    return {
        'readability': readability,
        'specificity': specificity,
        'richness': richness
    }


if __name__ == "__main__":
    # Example usage
    sample_text = """
    The company faces various risks including market volatility, regulatory changes, 
    and economic uncertainties. These factors may impact our financial performance. 
    We have implemented comprehensive risk management strategies to address these challenges. 
    Our quantitative analysis indicates a 15% probability of significant market disruption 
    in the next fiscal year. The company's operational efficiency has improved by 12% 
    compared to the previous year, demonstrating our commitment to continuous improvement.
    """
    
    results = analyze_text_transparency(sample_text)
    print("Transparency Analysis Results:")
    print(f"Readability: {results['readability']}")
    print(f"Specificity: {results['specificity']}")
    print(f"Richness: {results['richness']}")