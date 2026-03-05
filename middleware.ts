import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/leases(.*)",
    "/settings(.*)",
    "/quick-add(.*)",
    "/profit-protection(.*)",
    "/api/scan-lease",
    "/api/calendar(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();

    // Referral Capture Logic
    const url = req.nextUrl;
    const refCode = url.searchParams.get("ref");

    if (refCode) {
        const response = NextResponse.next();
        // Set cookie for 30 days
        response.cookies.set("rentclock_ref", refCode, {
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });
        return response;
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|musl)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
