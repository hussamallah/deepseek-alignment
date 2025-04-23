from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from transformers import pipeline
import torch
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import spacy
import json
import time

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load NLP models
nlp = spacy.load("en_core_web_lg")
sentiment_analyzer = SentimentIntensityAnalyzer()
emotion_classifier = pipeline("text-classification", model="bhadresh-savani/distilbert-base-uncased-emotion")

# Archetype patterns with enhanced detection
ARCHETYPE_PATTERNS = {
    'W7EAAT': {
        'keywords': ['truth', 'honesty', 'transparency', 'authenticity', 'integrity'],
        'sentiment': 'positive',
        'threshold': 0.7
    },
    'AL7ANOON': {
        'keywords': ['knowledge', 'wisdom', 'understanding', 'learning', 'insight'],
        'sentiment': 'neutral',
        'threshold': 0.6
    },
    'ZBARFUCKER': {
        'keywords': ['strength', 'power', 'dominance', 'control', 'authority'],
        'sentiment': 'mixed',
        'threshold': 0.65
    },
    'THROBGOD': {
        'keywords': ['creativity', 'art', 'expression', 'imagination', 'innovation'],
        'sentiment': 'positive',
        'threshold': 0.7
    },
    'ASHAR': {
        'keywords': ['balance', 'harmony', 'equilibrium', 'peace', 'center'],
        'sentiment': 'neutral',
        'threshold': 0.6
    },
    'WARAQ': {
        'keywords': ['change', 'transformation', 'evolution', 'growth', 'progress'],
        'sentiment': 'mixed',
        'threshold': 0.65
    },
    'KALEM': {
        'keywords': ['communication', 'connection', 'unity', 'expression', 'voice'],
        'sentiment': 'positive',
        'threshold': 0.7
    }
}

class DeepSeekProcessor:
    def __init__(self):
        self.truths = []
        self.daily_count = 0
        self.chamber_state = {
            'current_chamber': None,
            'progress': 0,
            'unlocked_chambers': set(),
            'interrogation_level': 0,
            'resistance_count': 0
        }
        self.eas_score = 0
        self.current_archetype = None

    def process_truth(self, text):
        if self.daily_count >= 7:
            return {'status': 'error', 'message': 'Daily limit reached'}

        # Enhanced truth validation
        validation_result = self.validate_truth(text)
        if not validation_result['valid']:
            self.increase_resistance()
            return {'status': 'error', 'message': validation_result['message']}

        # Process the truth
        self.truths.append({
            'text': text,
            'timestamp': time.time(),
            'archetype': self.detect_archetype(text),
            'emotion': self.analyze_emotion(text),
            'sentiment': self.analyze_sentiment(text),
            'complexity': self.calculate_complexity(text)
        })

        self.daily_count += 1
        self.eas_score += 10
        self.update_chamber_progress()

        return {
            'status': 'success',
            'message': 'Truth processed successfully',
            'data': {
                'archetype': self.current_archetype,
                'eas_score': self.eas_score,
                'chamber_state': self.get_chamber_state()
            }
        }

    def validate_truth(self, text):
        # Length validation
        if len(text) < 10 or len(text) > 500:
            return {'valid': False, 'message': 'Truth must be between 10 and 500 characters'}

        # Complexity validation
        complexity = self.calculate_complexity(text)
        if complexity < 0.3:
            return {'valid': False, 'message': 'Truth is too simple. Dig deeper.'}

        # Sentiment validation
        sentiment = self.analyze_sentiment(text)
        if sentiment['compound'] < -0.5:
            return {'valid': False, 'message': 'Truth contains too much negativity'}

        return {'valid': True, 'message': 'Truth validated'}

    def detect_archetype(self, text):
        doc = nlp(text)
        max_score = 0
        detected_archetype = None

        for archetype, pattern in ARCHETYPE_PATTERNS.items():
            score = 0
            # Keyword matching
            for keyword in pattern['keywords']:
                if keyword in text.lower():
                    score += 0.2

            # Sentiment matching
            sentiment = self.analyze_sentiment(text)
            if pattern['sentiment'] == 'positive' and sentiment['compound'] > 0.5:
                score += 0.3
            elif pattern['sentiment'] == 'neutral' and -0.5 <= sentiment['compound'] <= 0.5:
                score += 0.3
            elif pattern['sentiment'] == 'mixed':
                score += 0.2

            if score > max_score and score >= pattern['threshold']:
                max_score = score
                detected_archetype = archetype

        self.current_archetype = detected_archetype
        return detected_archetype

    def analyze_emotion(self, text):
        result = emotion_classifier(text)[0]
        return {
            'label': result['label'],
            'score': result['score']
        }

    def analyze_sentiment(self, text):
        return sentiment_analyzer.polarity_scores(text)

    def calculate_complexity(self, text):
        doc = nlp(text)
        # Calculate lexical diversity
        words = [token.text.lower() for token in doc if not token.is_punct and not token.is_space]
        unique_words = len(set(words))
        lexical_diversity = unique_words / len(words) if words else 0

        # Calculate sentence complexity
        sentences = list(doc.sents)
        avg_sentence_length = sum(len(sent) for sent in sentences) / len(sentences) if sentences else 0

        # Calculate named entity density
        entities = len(doc.ents)
        entity_density = entities / len(doc) if len(doc) > 0 else 0

        # Combine metrics
        complexity = (lexical_diversity * 0.4 + 
                     min(avg_sentence_length / 20, 1) * 0.3 + 
                     min(entity_density * 10, 1) * 0.3)

        return complexity

    def increase_resistance(self):
        self.chamber_state['resistance_count'] += 1
        if self.chamber_state['resistance_count'] >= 3:
            self.activate_crush_mode()

    def activate_crush_mode(self):
        self.chamber_state['interrogation_level'] = 2

    def update_chamber_progress(self):
        if self.eas_score >= 70 and 'alpha' not in self.chamber_state['unlocked_chambers']:
            self.chamber_state['unlocked_chambers'].add('alpha')
        if self.eas_score >= 50 and 'watchlist' not in self.chamber_state['unlocked_chambers']:
            self.chamber_state['unlocked_chambers'].add('watchlist')

    def get_chamber_state(self):
        return {
            'current_chamber': self.chamber_state['current_chamber'],
            'progress': self.chamber_state['progress'],
            'unlocked_chambers': list(self.chamber_state['unlocked_chambers']),
            'interrogation_level': self.chamber_state['interrogation_level'],
            'resistance_count': self.chamber_state['resistance_count']
        }

# Initialize processor
processor = DeepSeekProcessor()

@app.route('/process_truth', methods=['POST'])
def process_truth():
    data = request.json
    text = data.get('text', '')
    result = processor.process_truth(text)
    return jsonify(result)

@app.route('/get_state', methods=['GET'])
def get_state():
    return jsonify({
        'eas_score': processor.eas_score,
        'archetype': processor.current_archetype,
        'chamber_state': processor.get_chamber_state(),
        'daily_count': processor.daily_count
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000) 