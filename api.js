// API communication module
class APIManager {
    constructor() {
        this.baseUrl = '/api';
        this.endpoints = {
            users: '/users',
            metrics: '/metrics',
            alignment: '/alignment'
        };
    }

    // User management endpoints
    async createUser(userData) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.users}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async updateUser(userId, updates) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.users}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async getUser(userId) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.users}/${userId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    // Metrics endpoints
    async getEngagementMetrics() {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.metrics}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching metrics:', error);
            throw error;
        }
    }

    async updateEngagementMetrics(metrics) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.metrics}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(metrics)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating metrics:', error);
            throw error;
        }
    }

    // Alignment endpoints
    async processAlignment(userId) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.alignment}/${userId}`, {
                method: 'POST'
            });
            return await response.json();
        } catch (error) {
            console.error('Error processing alignment:', error);
            throw error;
        }
    }

    async getAlignmentScore(userId) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.alignment}/${userId}/score`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching alignment score:', error);
            throw error;
        }
    }
}

// Export the API manager
const api = new APIManager();
export default api; 