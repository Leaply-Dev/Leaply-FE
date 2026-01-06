import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/explore", "/persona-lab"];

// Routes only for unauthenticated users
const AUTH_ROUTES = ["/login", "/register"];

// Routes that require auth but allow incomplete onboarding
const ONBOARDING_ROUTES = ["/onboarding"];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if the path is a protected route
	const isProtectedRoute = PROTECTED_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);

	// Check if current path matches auth routes
	const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

	// Check if current path is onboarding
	const isOnboardingRoute = ONBOARDING_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);

	// Public routes don't need any checks
	if (!isProtectedRoute && !isAuthRoute && !isOnboardingRoute) {
		return NextResponse.next();
	}

	// Check if user is authenticated
	const authStateCookie = request.cookies.get("leaply-auth-state")?.value;
	let isAuthenticated = false;
	let isOnboardingComplete = false;

	if (authStateCookie) {
		try {
			const authState = JSON.parse(authStateCookie);
			isAuthenticated = authState.isAuthenticated;
			isOnboardingComplete = authState.isOnboardingComplete;
		} catch {
			// If cookie is invalid, treat as unauthenticated
		}
	}

	// Auth routes - redirect authenticated users away
	if (isAuthRoute) {
		if (isAuthenticated) {
			const redirectPath = isOnboardingComplete ? "/dashboard" : "/onboarding";
			return NextResponse.redirect(new URL(redirectPath, request.url));
		}
		return NextResponse.next();
	}

	// Onboarding route - require auth but not completed onboarding
	if (isOnboardingRoute) {
		if (!isAuthenticated) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		if (isOnboardingComplete) {
			// Already completed onboarding → redirect to dashboard
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
		return NextResponse.next();
	}

	// Protected routes - require authentication AND completed onboarding
	if (isProtectedRoute) {
		if (!isAuthenticated) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		if (!isOnboardingComplete) {
			return NextResponse.redirect(new URL("/onboarding", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Skip all internal paths (_next, static files, api routes)
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
	],
};
