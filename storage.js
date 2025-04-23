// Data storage and persistence
class StorageManager {
    constructor() {
        this.storageKey = 'broski_reset_temple_data';
        this.data = this.loadData();
    }

    // Load data from localStorage
    loadData() {
        const savedData = localStorage.getItem(this.storageKey);
        return savedData ? JSON.parse(savedData) : {
            users: {},
            engagementMetrics: {},
            lastUpdated: new Date().toISOString()
        };
    }

    // Save data to localStorage
    saveData(data) {
        this.data = {
            ...this.data,
            ...data,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    // Save user data
    saveUser(user) {
        const users = this.data.users || {};
        users[user.id] = user;
        this.saveData({ users });
    }

    // Save engagement metrics
    saveEngagementMetrics(metrics) {
        this.saveData({ engagementMetrics: metrics });
    }

    // Get all users
    getUsers() {
        return this.data.users || {};
    }

    // Get engagement metrics
    getEngagementMetrics() {
        return this.data.engagementMetrics || {};
    }

    // Clear all data
    clearData() {
        localStorage.removeItem(this.storageKey);
        this.data = {
            users: {},
            engagementMetrics: {},
            lastUpdated: new Date().toISOString()
        };
    }
}

// Export the storage manager
const storage = new StorageManager();
export default storage; 