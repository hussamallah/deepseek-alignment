// Biofeedback User Interface
class Biofeedback_UI {
    constructor() {
        this.archetype = null;
        this.listeners = new Map();
        this.reactions = {
            positive: {
                color: '#4CAF50',
                sound: 'positive.mp3',
                intensity: 1
            },
            negative: {
                color: '#F44336',
                sound: 'negative.mp3',
                intensity: 1
            },
            limitReached: {
                color: '#FFC107',
                sound: 'limit.mp3',
                intensity: 0.5
            }
        };
    }

    setArchetype(archetype) {
        this.archetype = archetype;
        this.adjustReactions();
    }

    adjustReactions() {
        // Archetype-specific reaction adjustments
        if (this.archetype) {
            // Adjust reaction parameters based on archetype
            this.reactions.positive.intensity = this.getArchetypeIntensity();
        }
    }

    getArchetypeIntensity() {
        // Archetype-specific intensity mapping
        const intensities = {
            'W7EAAT': 1.2,
            'AL7ANOON': 0.8,
            'ZBARFUCKER': 1.5,
            'THROBGOD': 1.0,
            'ASHAR': 0.9,
            'WARAQ': 1.1,
            'KALEM': 1.3
        };
        return intensities[this.archetype] || 1.0;
    }

    trigger(type) {
        const reaction = this.reactions[type];
        if (reaction) {
            this.playSound(reaction.sound);
            this.animateBall(reaction);
            this.trigger('reaction', type);
        }
    }

    playSound(soundFile) {
        const audio = new Audio(soundFile);
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio playback failed:', e));
    }

    animateBall(reaction) {
        // Ball animation logic
        const ball = document.querySelector('.biofeedback-ball');
        if (ball) {
            ball.style.backgroundColor = reaction.color;
            ball.style.transform = `scale(${reaction.intensity})`;
            setTimeout(() => {
                ball.style.transform = 'scale(1)';
            }, 500);
        }
    }

    adjustIntensity(score) {
        // Adjust reaction intensity based on EAS score
        const intensity = score / 100;
        Object.values(this.reactions).forEach(reaction => {
            reaction.intensity = intensity;
        });
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

export default Biofeedback_UI; 