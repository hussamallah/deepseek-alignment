// Feedback Engine for DeepSeek
class FeedbackEngine {
    constructor() {
        this.reactions = {
            positive: [
                "Deeper. You're getting closer.",
                "Good, but push further.",
                "Interesting. Now go deeper.",
                "You're scratching the surface. Dig deeper.",
                "That's a start. What lies beneath?"
            ],
            negative: [
                "Too shallow. Try again.",
                "You're holding back. Let go.",
                "That's not your truth. Dig deeper.",
                "Surface level. Go deeper.",
                "You're protecting something. What is it?"
            ],
            neutral: [
                "Interesting. Elaborate.",
                "Go on...",
                "And what else?",
                "There's more. Continue.",
                "What's beneath that?"
            ]
        };
    }

    analyzeAnswerDepth(answer) {
        const words = answer.split(/\s+/);
        const uniqueWords = new Set(words);
        const complexity = (uniqueWords.size / words.length) * 100;
        const depth = Math.min(100, Math.max(0, 
            (words.length * 0.5) + 
            (complexity * 0.3) + 
            (this.countEmotionalWords(answer) * 0.2)
        ));
        return depth;
    }

    countEmotionalWords(text) {
        const emotionalWords = [
            'fear', 'love', 'hate', 'anger', 'joy', 'pain', 'truth',
            'lie', 'hide', 'reveal', 'secret', 'deep', 'surface',
            'protect', 'expose', 'vulnerable', 'strong', 'weak'
        ];
        return text.toLowerCase().split(/\s+/)
            .filter(word => emotionalWords.includes(word)).length;
    }

    processAnswer(answer, archetype, easScore) {
        const depth = this.analyzeAnswerDepth(answer);
        const baseDelta = Math.floor((depth - 50) / 5); // -10 to +10
        
        // Adjust based on current EAS score
        const easAdjustment = easScore < 50 ? 1.5 : 0.5;
        const easDelta = Math.floor(baseDelta * easAdjustment);
        
        // Determine reaction type
        let reactionType;
        if (depth > 70) reactionType = 'positive';
        else if (depth < 30) reactionType = 'negative';
        else reactionType = 'neutral';

        // Get random reaction of appropriate type
        const reactions = this.reactions[reactionType];
        const reactionText = reactions[Math.floor(Math.random() * reactions.length)];

        return {
            reactionText,
            easDelta,
            depth
        };
    }
}

// Export singleton instance
const feedbackEngine = new FeedbackEngine();
export default feedbackEngine; 