import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    "/admin/dashboard/(.*)",
    "/resident/dashboard/(.*)",
]);

const isPublicRoute = createRouteMatcher([
    "/",
    "/admin/login",
    "/admin/forgot-password",
    "/resident/login",
    "/resident/forgot-password",
]);

export default clerkMiddleware((auth, req) => {
    if (isPublicRoute(req)) {
        return NextResponse.next();
    }

    if (isProtectedRoute(req)) {
        auth.protect();
    }
});

export const config = {
    matcher: [
        // Protect specific dashboard routes
        "/admin/:path*",
        "/resident/:path*",
        // Skip Next.js internals and static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
