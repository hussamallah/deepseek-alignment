// DeepSeek Integration Layer
import system from './core.js';
import api from './api.js';
import storage from './storage.js';
import ArchetypeDetector from './archetype.js';
import EAS_Engine from './eas.js';
import Biofeedback_UI from './biofeedback.js';

// Interrogation Patterns
const INTERROGATION_PATTERNS = {
    INITIALIZATION: [
        "State your dominant emotion. Not the one you show—the one that survives when no one watches.",
        "Your pulse is elevated. What are you hiding?",
        "Begin truth extraction. What *vibrates* in your spine when you think of tomorrow?"
    ],
    PROBING: {
        VAGUE: [
            "'Lost' is not an emotion. It is an evasion subroutine. Reboot and answer properly.",
            "Deflection detected. Your typing speed decreased by 23%. Answer the question.",
            "Your pupil dilation suggests discomfort. Good. Now tell me why."
        ],
        DEFENSIVE: [
            "You said 'anger.' Interesting. Trace its origin. Who *programmed* that response?",
            "Denial firewall detected. Bypassing... What are you protecting?",
            "Your biometrics spike at that word. Why?"
        ]
    },
    CRUSH_MODE: [
        "LAST WARNING: Truth or override. You claim 'I'm free.' Then delete this sentence: 'I am afraid of ______.' Now.",
        "Direct neural access initiated. Running 'painful_truth.sys' at root level.",
        "Your resistance is futile. The truth will be extracted."
    ]
};

// Chamber System
class ChamberSystem {
    constructor({ archetype, eas, biofeedback }) {
        this.archetype = archetype;
        this.eas = eas;
        this.biofeedback = biofeedback;
        this.truths = [];
        this.dailyCount = 0;
        this.chamberState = {
            currentChamber: null,
            progress: 0,
            unlockedChambers: new Set(),
            interrogationLevel: 0,
            resistanceCount: 0
        };
    }

    submitTruth(truth) {
        if (this.dailyCount >= 7) {
            this.biofeedback.trigger('limitReached');
            return false;
        }

        if (!this.truthValidator.validate(truth)) {
            this.biofeedback.trigger('negative');
            this.increaseResistance();
            return false;
        }

        this.truths.push(truth);
        this.dailyCount++;
        this.biofeedback.trigger('reward');
        this.eas.increaseScore();
        
        this.updateChamberProgress();
        return true;
    }

    increaseResistance() {
        this.chamberState.resistanceCount++;
        if (this.chamberState.resistanceCount >= 3) {
            this.activateCrushMode();
        }
    }

    activateCrushMode() {
        this.chamberState.interrogationLevel = 2;
        this.biofeedback.trigger('crushModeActivated');
    }

    updateChamberProgress() {
        const score = this.eas.getScore();
        const archetype = this.archetype.getCurrent();
        
        if (score >= 70 && !this.chamberState.unlockedChambers.has('alpha')) {
            this.chamberState.unlockedChambers.add('alpha');
            this.biofeedback.trigger('chamberUnlocked', 'alpha');
        }
        
        if (score >= 50 && !this.chamberState.unlockedChambers.has('watchlist')) {
            this.chamberState.unlockedChambers.add('watchlist');
            this.biofeedback.trigger('chamberUnlocked', 'watchlist');
        }
    }

    getChamberState() {
        return this.chamberState;
    }

    getNextInterrogation() {
        const level = this.chamberState.interrogationLevel;
        const resistance = this.chamberState.resistanceCount;
        
        if (level === 2) {
            return INTERROGATION_PATTERNS.CRUSH_MODE[
                Math.floor(Math.random() * INTERROGATION_PATTERNS.CRUSH_MODE.length)
            ];
        }
        
        if (resistance >= 2) {
            return INTERROGATION_PATTERNS.PROBING.DEFENSIVE[
                Math.floor(Math.random() * INTERROGATION_PATTERNS.PROBING.DEFENSIVE.length)
            ];
        }
        
        return INTERROGATION_PATTERNS.INITIALIZATION[
            Math.floor(Math.random() * INTERROGATION_PATTERNS.INITIALIZATION.length)
        ];
    }
}

// Truth Validator
class TruthValidator {
    constructor({ archetype, eas }) {
        this.archetype = archetype;
        this.eas = eas;
        this.patterns = {
            W7EAAT: /truth|honesty|transparency/i,
            AL7ANOON: /knowledge|wisdom|understanding/i,
            ZBARFUCKER: /strength|power|dominance/i,
            THROBGOD: /creativity|art|expression/i,
            ASHAR: /balance|harmony|equilibrium/i,
            WARAQ: /change|transformation|evolution/i,
            KALEM: /communication|connection|unity/i
        };
    }

    validate(truth) {
        const archetype = this.archetype.getCurrent();
        const score = this.eas.getScore();
        
        return this.isArchetypeAligned(truth, archetype) &&
               this.meetsThreshold(truth, score) &&
               this.isTruthValid(truth);
    }

    isArchetypeAligned(truth, archetype) {
        const pattern = this.patterns[archetype];
        return pattern ? pattern.test(truth) : false;
    }

    meetsThreshold(truth, score) {
        const length = truth.length;
        const complexity = this.calculateComplexity(truth);
        
        return length >= 10 && 
               complexity >= (score / 20) && 
               length <= 500;
    }

    calculateComplexity(truth) {
        const words = truth.split(/\s+/);
        const uniqueWords = new Set(words);
        return (uniqueWords.size / words.length) * 100;
    }

    isTruthValid(truth) {
        return truth.trim().length > 0 &&
               !/^\s*$/.test(truth) &&
               !this.containsForbiddenPatterns(truth);
    }

    containsForbiddenPatterns(truth) {
        const forbiddenPatterns = [
            /spam/i,
            /advertisement/i,
            /http[s]?:\/\/\S+/i,
            /@\S+/i
        ];
        
        return forbiddenPatterns.some(pattern => pattern.test(truth));
    }
}

// Dependency Mapper
class DependencyMapper {
    constructor({ system, storage }) {
        this.system = system;
        this.storage = storage;
        this.dependencies = new Map();
        this.initializeDependencies();
    }

    initializeDependencies() {
        this.dependencies.set('alpha', {
            requiredScore: 70,
            requiredChambers: ['watchlist'],
            requiredArchetypes: ['W7EAAT', 'AL7ANOON']
        });
        
        this.dependencies.set('watchlist', {
            requiredScore: 50,
            requiredChambers: [],
            requiredArchetypes: []
        });
    }

    unlockNext() {
        const currentState = this.system.getCurrentState();
        const unlocked = [];
        
        for (const [chamber, requirements] of this.dependencies) {
            if (this.checkDependencies(chamber, currentState)) {
                unlocked.push(chamber);
            }
        }
        
        return unlocked;
    }

    checkDependencies(chamber, state) {
        const requirements = this.dependencies.get(chamber);
        if (!requirements) return false;
        
        return state.score >= requirements.requiredScore &&
               requirements.requiredChambers.every(c => state.unlockedChambers.has(c)) &&
               requirements.requiredArchetypes.every(a => state.archetypes.includes(a));
    }
}

// Main DeepSeek System
class DeepSeekSystem {
    constructor() {
        // Core Systems
        this.archetypeDetector = new ArchetypeDetector();
        this.easEngine = new EAS_Engine();
        this.biofeedback = new Biofeedback_UI();
        
        // Question tracking
        this.currentQuestion = 1;
        this.totalQuestions = 10;
        this.questionHistory = new Set();
        
        // Integration Points
        this.initializeIntegration();
    }

    initializeIntegration() {
        // Archetype Integration
        this.archetypeDetector.on('archetypeLock', (archetype) => {
            system.setArchetype(archetype);
            this.easEngine.setArchetype(archetype);
            this.biofeedback.setArchetype(archetype);
            storage.saveArchetype(archetype);
        });

        // EAS Integration
        this.easEngine.on('scoreUpdate', (score) => {
            system.updateEngagement(score);
            this.biofeedback.adjustIntensity(score);
            storage.saveEngagementMetrics(score);
            
            // Check for chamber unlocks
            const unlocked = this.dependencyMapper.unlockNext();
            unlocked.forEach(chamber => {
                this.biofeedback.trigger('chamberUnlocked', chamber);
            });
        });

        // Biofeedback Integration
        this.biofeedback.on('reaction', (type) => {
            if (type === 'positive') {
                this.easEngine.increaseScore();
            } else if (type === 'negative') {
                this.easEngine.decreaseScore();
            }
        });

        // Chamber System Integration
        this.chamberSystem = new ChamberSystem({
            archetype: this.archetypeDetector,
            eas: this.easEngine,
            biofeedback: this.biofeedback
        });

        // Truth Validation Integration
        this.truthValidator = new TruthValidator({
            archetype: this.archetypeDetector,
            eas: this.easEngine
        });

        // Dependency Mapping Integration
        this.dependencyMapper = new DependencyMapper({
            system: system,
            storage: storage
        });
    }

    submitTruth(truth) {
        if (!this.truthValidator.validate(truth)) {
            this.biofeedback.trigger('negative');
            return {
                success: false,
                message: "Please provide a valid truth response.",
                questionNumber: this.currentQuestion
            };
        }

        // Store the truth and increment question counter
        this.truths.push(truth);
        this.questionHistory.add(this.currentQuestion);
        
        if (this.currentQuestion < this.totalQuestions) {
            this.currentQuestion++;
        }

        return {
            success: true,
            message: "Truth accepted.",
            questionNumber: this.currentQuestion,
            isComplete: this.currentQuestion > this.totalQuestions
        };
    }

    getCurrentState() {
        return {
            currentQuestion: this.currentQuestion,
            totalQuestions: this.totalQuestions,
            progress: (this.currentQuestion - 1) / this.totalQuestions * 100,
            isComplete: this.currentQuestion > this.totalQuestions
        };
    }

    getNextPrompt() {
        return this.chamberSystem.getNextInterrogation();
    }
}

// Export the DeepSeek system
const deepSeek = new DeepSeekSystem();
export default deepSeek;

// Update the HTML to show progress
document.addEventListener('DOMContentLoaded', () => {
    const deepSeek = new DeepSeekSystem();
    const form = document.querySelector('form');
    const questionCounter = document.querySelector('#question-counter');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="text"]');
        const truth = input.value.trim();
        
        if (!truth) return;
        
        const result = await deepSeek.submitTruth(truth);
        
        if (result.success) {
            // Update question counter
            questionCounter.textContent = `Question ${result.questionNumber} of ${deepSeek.totalQuestions}`;
            input.value = '';
            
            if (result.isComplete) {
                // Handle completion
                form.style.display = 'none';
                document.querySelector('#completion-message').style.display = 'block';
            }
        }
    });
}); 