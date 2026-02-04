export const APP_CONFIG = {
    ADMIN: {
        ALLOWED_EMAILS: ["support@rentclock.online"]
    },
    LIMITS: {
        FREE_TIER_LEASES: 3,
        AI_SCAN_RATE_LIMIT: 20 // requests per hour
    },
    SUPPORT: {
        EMAIL: "support@rentclock.online"
    }
} as const;
