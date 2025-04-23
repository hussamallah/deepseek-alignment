// Data Center for DeepSeek Answers
class DataCenter {
    constructor() {
        this.answers = new Map(); // Map of userID -> answers
        this.users = new Map();   // Map of userID -> userInfo
    }

    // Generate a unique user ID
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Register a new user
    registerUser(name) {
        const userId = this.generateUserId();
        this.users.set(userId, {
            name: name,
            timestamp: new Date().toISOString(),
            answers: new Array(10).fill(null)
        });
        return userId;
    }

    // Save an answer for a specific question
    saveAnswer(userId, questionNumber, answer) {
        if (!this.users.has(userId)) {
            throw new Error('User not found');
        }

        const user = this.users.get(userId);
        user.answers[questionNumber - 1] = {
            answer: answer,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage for persistence
        localStorage.setItem('deepseek_answers', JSON.stringify(Array.from(this.users.entries())));
    }

    // Get all answers for a user
    getUserAnswers(userId) {
        if (!this.users.has(userId)) {
            throw new Error('User not found');
        }
        return this.users.get(userId).answers;
    }

    // Load saved data from localStorage
    loadSavedData() {
        const savedData = localStorage.getItem('deepseek_answers');
        if (savedData) {
            this.users = new Map(JSON.parse(savedData));
        }
    }
}

// Export singleton instance
const dataCenter = new DataCenter();
dataCenter.loadSavedData();
export default dataCenter; 