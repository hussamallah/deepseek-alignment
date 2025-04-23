// Core system functionality
class UserManagementSystem {
    constructor() {
        this.users = new Map();
        this.archetypes = ['W7EAAT', 'AL7ANOON', 'ZBARFUCKER', 'THROBGOD', 'ASHAR', 'WARAQ', 'KALEM'];
        this.tiers = ['alpha', 'watchlist', 'discard'];
        this.engagementMetrics = new Map();
    }

    // Add new user to the system
    addUser(userData) {
        const user = {
            id: Date.now(),
            name: userData.name,
            archetype: userData.archetype,
            tier: 'watchlist',
            day: 1,
            status: 'active',
            engagement: 0,
            lastActive: new Date(),
            alignmentScore: 0,
            ...userData
        };
        
        this.users.set(user.id, user);
        this.updateEngagementMetrics(user);
        return user;
    }

    // Update user engagement metrics
    updateEngagementMetrics(user) {
        if (!this.engagementMetrics.has(user.archetype)) {
            this.engagementMetrics.set(user.archetype, {
                total: 0,
                count: 0,
                lastUpdated: new Date()
            });
        }
        
        const metrics = this.engagementMetrics.get(user.archetype);
        metrics.total += user.engagement;
        metrics.count++;
        metrics.lastUpdated = new Date();
    }

    // Change user tier
    changeTier(userId, newTier) {
        const user = this.users.get(userId);
        if (user && this.tiers.includes(newTier)) {
            user.tier = newTier;
            return true;
        }
        return false;
    }

    // Process daily alignment
    processDailyAlignment(userId) {
        const user = this.users.get(userId);
        if (!user) return false;

        user.day++;
        if (user.day > 7) {
            // Final decision point
            if (user.tier === 'alpha' && user.alignmentScore >= 80) {
                user.status = 'aligned';
                return 'aligned';
            } else {
                user.status = 'discarded';
                return 'discarded';
            }
        }
        return 'ongoing';
    }

    // Calculate alignment score
    calculateAlignmentScore(userId) {
        const user = this.users.get(userId);
        if (!user) return 0;

        const baseScore = user.engagement * 10;
        const tierMultiplier = {
            'alpha': 1.2,
            'watchlist': 1.0,
            'discard': 0.8
        };

        user.alignmentScore = Math.min(100, baseScore * tierMultiplier[user.tier]);
        return user.alignmentScore;
    }

    // Get users by tier
    getUsersByTier(tier) {
        return Array.from(this.users.values())
            .filter(user => user.tier === tier);
    }

    // Get engagement metrics by archetype
    getEngagementMetrics() {
        const metrics = {};
        this.engagementMetrics.forEach((value, key) => {
            metrics[key] = {
                average: value.total / value.count,
                lastUpdated: value.lastUpdated
            };
        });
        return metrics;
    }
}

// Export the system
const system = new UserManagementSystem();
export default system; 