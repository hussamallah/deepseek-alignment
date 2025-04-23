// Emotional Access Score Engine
class EAS_Engine {
    constructor() {
        this.score = 0;
        this.archetype = null;
        this.listeners = new Map();
        this.thresholds = {
            'W7EAAT': 70,
            'AL7ANOON': 60,
            'ZBARFUCKER': 80,
            'THROBGOD': 75,
            'ASHAR': 65,
            'WARAQ': 70,
            'KALEM': 75
        };
    }

    setArchetype(archetype) {
        this.archetype = archetype;
        this.adjustThreshold();
    }

    adjustThreshold() {
        if (this.archetype) {
            this.threshold = this.thresholds[this.archetype];
        }
    }

    getScore() {
        return this.score;
    }

    increaseScore(amount = 1) {
        this.score = Math.min(100, this.score + amount);
        this.trigger('scoreUpdate', this.score);
    }

    decreaseScore(amount = 1) {
        this.score = Math.max(0, this.score - amount);
        this.trigger('scoreUpdate', this.score);
    }

    meetsThreshold() {
        return this.score >= this.threshold;
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

export default EAS_Engine; 