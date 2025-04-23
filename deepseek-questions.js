// Question Management System
class QuestionManager {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 10;
        this.answers = new Map();
        this.questionPatterns = [
            "What is your deepest truth?",
            "What fear do you hide from yourself?",
            "When was the last time you truly felt free?",
            "What memory would you erase if you could?",
            "What lie do you tell yourself daily?",
            "What power do you secretly desire?",
            "Who would you become if no one was watching?",
            "What truth have you never spoken aloud?",
            "What part of yourself have you buried?",
            "What would you sacrifice everything for?"
        ];
    }

    getCurrentQuestion() {
        return {
            number: this.currentQuestion,
            text: this.questionPatterns[this.currentQuestion - 1],
            total: this.totalQuestions
        };
    }

    submitAnswer(answer) {
        if (!answer || answer.trim().length === 0) {
            return {
                success: false,
                message: "Please provide an answer",
                currentQuestion: this.currentQuestion
            };
        }

        // Store the answer
        this.answers.set(this.currentQuestion, answer.trim());

        // Progress to next question
        if (this.currentQuestion < this.totalQuestions) {
            this.currentQuestion++;
            return {
                success: true,
                message: "Answer accepted",
                currentQuestion: this.currentQuestion,
                nextQuestion: this.questionPatterns[this.currentQuestion - 1],
                isComplete: false
            };
        } else {
            return {
                success: true,
                message: "All questions completed",
                currentQuestion: this.currentQuestion,
                isComplete: true
            };
        }
    }

    getProgress() {
        return {
            current: this.currentQuestion,
            total: this.totalQuestions,
            percentage: (this.currentQuestion - 1) / this.totalQuestions * 100
        };
    }
}

// Initialize and export
const questionManager = new QuestionManager();
export default questionManager; 