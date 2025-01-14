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
    "/suspended-account",
    "/api/webhooks(.*)",
]);

const isSignUpRoute = createRouteMatcher(["/resident/signup", "/admin/signup"]);
const isAdminRoute = createRouteMatcher(["/admin/(.*)"]);
const isResidentRoute = createRouteMatcher(["/resident/(.*)"]);

export default clerkMiddleware((auth, req) => {
    if (isPublicRoute(req) || isSignUpRoute(req)) {
        return NextResponse.next();
    }

    if (isProtectedRoute(req)) {
        auth.protect();
    }

    return NextResponse.next();
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
