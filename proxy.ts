import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_ROUTES = [
	"/dashboard",
	"/explore",
	"/persona-lab",
	"/onboarding",
];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if the path is a protected route
	const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
		pathname.startsWith(route),
	);

	if (!isProtectedRoute) {
		return NextResponse.next();
	}

	// Check if user is authenticated
	const authStateCookie = request.cookies.get("leaply-auth-state")?.value;

	if (!authStateCookie) {
		return NextResponse.redirect(new URL(`/login`, request.url));
	}

	let isAuthenticated = false;
	let isOnboardingComplete = false;

	try {
		const authState = JSON.parse(authStateCookie);
		isAuthenticated = authState.isAuthenticated;
		isOnboardingComplete = authState.isOnboardingComplete;
	} catch {
		// If cookie is invalid, redirect to login
		return NextResponse.redirect(new URL(`/login`, request.url));
	}

	if (!isAuthenticated) {
		return NextResponse.redirect(new URL(`/login`, request.url));
	}

	if (pathname === "/onboarding" || pathname.startsWith("/onboarding")) {
		if (isOnboardingComplete) {
			// Already completed onboarding → redirect to dashboard
			return NextResponse.redirect(new URL(`/dashboard`, request.url));
		}
		// Allow access to onboarding
		return NextResponse.next();
	}

	// For all other protected routes, require onboarding completion
	if (!isOnboardingComplete) {
		return NextResponse.redirect(new URL(`/onboarding`, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Skip all internal paths (_next, static files, api routes)
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
	],
};
