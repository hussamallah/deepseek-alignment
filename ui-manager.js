// UI Manager for DeepSeek
class UIManager {
    constructor() {
        this.elements = {
            input: document.getElementById('answerInput'),
            reaction: document.getElementById('reaction'),
            easBar: document.getElementById('easBar'),
            progressBar: document.getElementById('progressBar'),
            questionText: document.getElementById('questionText'),
            questionCounter: document.getElementById('questionCounter'),
            pulseBall: document.getElementById('pulseBall')
        };
    }

    shakeInput() {
        this.elements.input.classList.add('shake');
        setTimeout(() => {
            this.elements.input.classList.remove('shake');
        }, 500);
    }

    showReaction(text) {
        this.elements.reaction.textContent = text;
        this.elements.reaction.classList.add('fade-in');
        setTimeout(() => {
            this.elements.reaction.classList.remove('fade-in');
        }, 2000);
    }

    updateEASBar(score) {
        const percentage = Math.max(0, Math.min(100, score));
        this.elements.easBar.style.width = `${percentage}%`;
        this.elements.easBar.classList.add('pulse');
        setTimeout(() => {
            this.elements.easBar.classList.remove('pulse');
        }, 500);
    }

    pulseBall(color) {
        this.elements.pulseBall.style.backgroundColor = color;
        this.elements.pulseBall.classList.add('pulse');
        setTimeout(() => {
            this.elements.pulseBall.classList.remove('pulse');
        }, 500);
    }

    updateProgressBar(percent) {
        this.elements.progressBar.style.width = `${percent}%`;
        this.elements.progressBar.classList.add('pulse');
        setTimeout(() => {
            this.elements.progressBar.classList.remove('pulse');
        }, 500);
    }

    showQuestion(question) {
        this.elements.questionText.classList.add('fade-out');
        setTimeout(() => {
            this.elements.questionText.textContent = question;
            this.elements.questionText.classList.remove('fade-out');
            this.elements.questionText.classList.add('fade-in');
            setTimeout(() => {
                this.elements.questionText.classList.remove('fade-in');
            }, 500);
        }, 500);
    }

    clearInput() {
        this.elements.input.value = '';
        this.elements.input.focus();
    }

    showFinalScreen(userInfo) {
        const container = document.querySelector('.container');
        container.innerHTML = `
            <h1>Alignment Complete</h1>
            <div class="user-info">
                <div>User: <span>${userInfo.name}</span></div>
                <div>Session: <span>${userInfo.sessionId}</span></div>
                <div>Final EAS Score: <span>${userInfo.easScore}</span></div>
            </div>
            <div class="completion-message">
                Your journey through truth has been recorded.
                The deeper you go, the more you'll find.
            </div>
            <button onclick="location.reload()">Begin New Journey</button>
        `;
    }
}

// Export singleton instance
const uiManager = new UIManager();
export default uiManager; 