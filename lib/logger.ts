import * as Sentry from "@sentry/nextjs";

type ErrorContext = Record<string, unknown>;

export const logger = {
    error: (error: unknown, context?: ErrorContext) => {
        // 1. Log to Console (for Vercel logs / Local dev)
        console.error("🔴 Server Error:", error);
        if (context) console.error("Context:", context);

        // 2. Report to Sentry
        Sentry.captureException(error, {
            extra: context
        });
    },

    info: (message: string, context?: ErrorContext) => {
        console.log("ℹ️", message, context || "");
        Sentry.addBreadcrumb({
            message,
            data: context,
            level: "info"
        });
    },

    warn: (message: string, context?: ErrorContext) => {
        console.warn("⚠️", message, context || "");
        Sentry.addBreadcrumb({
            message,
            data: context,
            level: "warning"
        });
    }
};
