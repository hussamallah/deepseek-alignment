// Archetype Detection System
class ArchetypeDetector {
    constructor() {
        this.currentArchetype = null;
        this.listeners = new Map();
    }

    analyze(answers) {
        // 5-question analysis
        const archetype = this.processAnswers(answers);
        this.lockArchetype(archetype);
        return archetype;
    }

    processAnswers(answers) {
        // Archetype determination logic
        const scores = {
            'W7EAAT': 0,
            'AL7ANOON': 0,
            'ZBARFUCKER': 0,
            'THROBGOD': 0,
            'ASHAR': 0,
            'WARAQ': 0,
            'KALEM': 0
        };

        // Score each answer
        answers.forEach((answer, index) => {
            this.scoreAnswer(answer, index, scores);
        });

        // Determine highest scoring archetype
        return Object.entries(scores)
            .reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }

    scoreAnswer(answer, index, scores) {
        // Archetype-specific scoring logic
        // This is a placeholder - implement actual scoring logic
        Object.keys(scores).forEach(archetype => {
            scores[archetype] += Math.random() * 10;
        });
    }

    lockArchetype(archetype) {
        this.currentArchetype = archetype;
        this.trigger('archetypeLock', archetype);
    }

    getCurrent() {
        return this.currentArchetype;
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    trigger(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }
}

export default ArchetypeDetector; 