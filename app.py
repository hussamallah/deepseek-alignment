from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# In-memory data storage
data = {
    'archetype': None,
    'eas': 50,
    'step': 1
}

# Questions for each archetype
QUESTIONS = {
    'warrior': [
        "What is your greatest battle?",
        "How do you face your fears?",
        "What gives you strength?",
        "How do you protect what matters?",
        "What is your code of honor?"
    ],
    'healer': [
        "What pain do you seek to heal?",
        "How do you nurture others?",
        "What brings you peace?",
        "How do you restore balance?",
        "What is your healing gift?"
    ],
    'teacher': [
        "What wisdom do you share?",
        "How do you guide others?",
        "What lessons have shaped you?",
        "How do you inspire growth?",
        "What is your teaching philosophy?"
    ],
    'creator': [
        "What do you create?",
        "How do you express yourself?",
        "What inspires your work?",
        "How do you bring ideas to life?",
        "What is your creative process?"
    ]
}

@app.route('/')
def index():
    return render_template('questions.html')

@app.route('/detect', methods=['POST'])
def detect():
    answer = request.json.get('answer', '').lower()
    
    # Enhanced archetype detection
    if any(word in answer for word in ['fight', 'battle', 'warrior', 'strength', 'protect']):
        data['archetype'] = 'warrior'
    elif any(word in answer for word in ['heal', 'help', 'care', 'nurture', 'peace']):
        data['archetype'] = 'healer'
    elif any(word in answer for word in ['teach', 'learn', 'guide', 'wisdom', 'knowledge']):
        data['archetype'] = 'teacher'
    elif any(word in answer for word in ['create', 'build', 'make', 'design', 'art']):
        data['archetype'] = 'creator'
    else:
        data['archetype'] = random.choice(['warrior', 'healer', 'teacher', 'creator'])
    
    return jsonify({
        'archetype': data['archetype'],
        'next_url': f'/chamber/{data["archetype"]}'
    })

@app.route('/chamber/<archetype>')
def chamber(archetype):
    if archetype not in QUESTIONS:
        return "Invalid archetype", 404
    
    return render_template('chamber.html', 
                         title=f"{archetype.capitalize()} Chamber",
                         questions=QUESTIONS[archetype])

@app.route('/biofeedback', methods=['POST'])
def biofeedback():
    step = request.json.get('step', 1)
    answer = request.json.get('answer', '')
    
    # Enhanced EAS calculation
    length_bonus = min(len(answer) / 100, 0.5)  # Up to 0.5 points for length
    keyword_bonus = 0.2 if any(word in answer.lower() for word in ['truth', 'honest', 'real']) else 0
    emotion_bonus = 0.3 if any(word in answer.lower() for word in ['feel', 'emotion', 'heart']) else 0
    
    # Calculate new EAS
    new_eas = data['eas'] + length_bonus + keyword_bonus + emotion_bonus
    new_eas = max(0, min(100, new_eas))  # Keep between 0-100
    data['eas'] = new_eas
    
    # Generate appropriate reaction
    if new_eas > data['eas']:
        reaction = random.choice([
            "Your truth resonates deeply...",
            "The chamber hums with energy...",
            "Your alignment strengthens...",
            "The path becomes clearer..."
        ])
    else:
        reaction = random.choice([
            "The chamber grows silent...",
            "Your truth wavers...",
            "The path darkens...",
            "Alignment weakens..."
        ])
    
    return jsonify({
        'reaction': reaction,
        'eas': new_eas
    })

if __name__ == '__main__':
    app.run(debug=True) 