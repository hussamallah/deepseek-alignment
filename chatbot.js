/**
 * Enhanced Customer Service Chatbot with Improved Conversation Flow
 * Features:
 * - Multi-step conversation handling
 * - Context persistence
 * - Better question follow-through
 * - Conversation state tracking
 */

class CustomerServiceBot {
    constructor() {
        // Conversation state
        this.state = {
            currentIntent: null,
            context: {},
            conversationHistory: [],
            awaitingResponse: false,
            currentFlow: null,
            flowStep: 0,
            lastUserInput: null
        };

        // Conversation flows
        this.flows = {
            refund: {
                steps: [
                    { question: "I can help you with your refund request. Please provide your order number.", field: "orderNumber" },
                    { question: "Thank you. Now, please provide the reason for your refund request.", field: "refundReason" },
                    { question: "Would you like a refund to your original payment method or store credit?", field: "refundType" },
                    { question: "Finally, please provide your email address for confirmation.", field: "email" }
                ],
                complete: (context) => {
                    return `I've processed your refund request for order ${context.orderNumber}. ` +
                           `A confirmation email will be sent to ${context.email} shortly.`;
                }
            },
            billing: {
                steps: [
                    { question: "For billing questions, please provide your account number or email address.", field: "accountInfo" },
                    { question: "What specific billing question can I help you with?", field: "billingQuestion" },
                    { question: "Would you like to see your recent transactions?", field: "showTransactions" }
                ],
                complete: (context) => {
                    return `I've noted your billing question about "${context.billingQuestion}". ` +
                           `A billing specialist will contact you shortly.`;
                }
            },
            product_info: {
                steps: [
                    { question: "I can help you find information about our products. What specific product are you interested in?", field: "productName" },
                    { question: "Would you like information about pricing, features, or availability?", field: "infoType" }
                ],
                complete: (context) => {
                    return `Here's the information about ${context.productName}: [Product details would be fetched from database]`;
                }
            }
        };

        // Intent patterns
        this.intentPatterns = {
            "refund": [
                { pattern: "refund", weight: 1.0 },
                { pattern: "return", weight: 0.9 },
                { pattern: "money back", weight: 0.8 }
            ],
            "billing": [
                { pattern: "bill", weight: 1.0 },
                { pattern: "payment", weight: 0.9 },
                { pattern: "invoice", weight: 0.8 }
            ],
            "product_info": [
                { pattern: "product", weight: 1.0 },
                { pattern: "item", weight: 0.9 },
                { pattern: "specification", weight: 0.8 }
            ],
            "greeting": [
                { pattern: "hello", weight: 1.0 },
                { pattern: "hi", weight: 1.0 },
                { pattern: "hey", weight: 0.9 }
            ],
            "farewell": [
                { pattern: "bye", weight: 1.0 },
                { pattern: "goodbye", weight: 1.0 },
                { pattern: "thanks", weight: 0.7 }
            ]
        };
    }

    /**
     * Main response handler with conversation flow management
     */
    respond(userInput) {
        // Store the last user input
        this.state.lastUserInput = userInput;

        // If we're in the middle of a flow, handle the next step
        if (this.state.awaitingResponse && this.state.currentFlow) {
            return this.handleFlowResponse(userInput);
        }

        // Otherwise, classify the intent and start a new flow
        const { intent, confidence } = this.classifyIntent(userInput);
        
        if (confidence < 0.3) {
            return this.handleUncertainty();
        }

        // Start a new conversation flow
        if (this.flows[intent]) {
            this.state.currentFlow = intent;
            this.state.flowStep = 0;
            this.state.awaitingResponse = true;
            return this.flows[intent].steps[0].question;
        }

        // Handle non-flow intents
        return this.handleNonFlowIntent(intent);
    }

    /**
     * Handle response within an active flow
     */
    handleFlowResponse(userInput) {
        const flow = this.flows[this.state.currentFlow];
        const currentStep = flow.steps[this.state.flowStep];

        // Store the user's response
        this.state.context[currentStep.field] = userInput;

        // Move to next step
        this.state.flowStep++;

        // Check if flow is complete
        if (this.state.flowStep >= flow.steps.length) {
            this.state.awaitingResponse = false;
            const response = flow.complete(this.state.context);
            this.resetFlow();
            return response;
        }

        // Return next question
        return flow.steps[this.state.flowStep].question;
    }

    /**
     * Reset the current flow
     */
    resetFlow() {
        this.state.currentFlow = null;
        this.state.flowStep = 0;
        this.state.awaitingResponse = false;
        this.state.context = {};
    }

    /**
     * Handle non-flow intents
     */
    handleNonFlowIntent(intent) {
        switch (intent) {
            case "greeting":
                return "Hello! I'm your customer service assistant. How can I help you today?";
            case "farewell":
                this.resetFlow();
                return "Thank you for chatting with us! Have a great day!";
            default:
                return "I'm not sure how to help with that. Could you please try rephrasing?";
        }
    }

    /**
     * Classify user intent
     */
    classifyIntent(text) {
        const lowerText = text.toLowerCase();
        let maxScore = 0;
        let bestIntent = null;

        for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
            let score = 0;
            for (const { pattern, weight } of patterns) {
                if (lowerText.includes(pattern)) {
                    score += weight;
                }
            }
            if (score > maxScore) {
                maxScore = score;
                bestIntent = intent;
            }
        }

        return {
            intent: bestIntent,
            confidence: maxScore
        };
    }

    /**
     * Handle uncertain queries
     */
    handleUncertainty() {
        if (this.state.awaitingResponse) {
            return "I didn't quite understand that. " + 
                   this.flows[this.state.currentFlow].steps[this.state.flowStep].question;
        }
        return "I'm not entirely sure what you're asking. Could you please rephrase your question?";
    }

    /**
     * Get current conversation state
     */
    getConversationState() {
        return {
            currentFlow: this.state.currentFlow,
            flowStep: this.state.flowStep,
            awaitingResponse: this.state.awaitingResponse,
            context: { ...this.state.context }
        };
    }
}

// Export the class for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomerServiceBot;
} 