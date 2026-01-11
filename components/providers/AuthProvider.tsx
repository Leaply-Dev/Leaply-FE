"use client";

import { useEffect, useRef } from "react";
import { authService } from "@/lib/services/auth";
import { useUserStore } from "@/lib/store/userStore";

/**
 * Decode JWT token payload without verification (client-side only)
 */
function decodeJwtPayload(token: string): { exp?: number } | null {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;
		const payload = JSON.parse(atob(parts[1]));
		return payload;
	} catch {
		return null;
	}
}

/**
 * Check if JWT token is expired
 */
function isTokenExpired(token: string): boolean {
	const payload = decodeJwtPayload(token);
	if (!payload?.exp) return true;
	// exp is in seconds, Date.now() is in milliseconds
	// Add 60 second buffer to account for clock skew
	return payload.exp * 1000 < Date.now() + 60000;
}

interface AuthProviderProps {
	children: React.ReactNode;
}

/**
 * Special token marker for cookie-based authentication (OAuth)
 * Backend sets httpOnly cookies that frontend cannot access
 */
const COOKIE_AUTH_TOKEN = "COOKIE_AUTH";

/**
 * AuthProvider validates the stored auth token on app load
 * Supports two authentication methods:
 * 1. Token-based (email/password): JWT in localStorage, sent via Bearer header
 * 2. Cookie-based (OAuth): httpOnly cookies, validated via backend
 *
 * - For token-based: Checks if JWT is expired locally, validates with backend
 * - For cookie-based: Always validates with backend (cannot read httpOnly cookies)
 * - Auto-logout if authentication is invalid or expired
 */
export function AuthProvider({ children }: AuthProviderProps) {
	const { accessToken, isAuthenticated, logout, login, profile } =
		useUserStore();
	const validationDone = useRef(false);

	useEffect(() => {
		// Only validate once per mount
		if (validationDone.current) return;
		validationDone.current = true;

		async function validateAuth() {
			// Skip if not authenticated
			if (!isAuthenticated) return;

			// Detect authentication type
			const isCookieAuth =
				!accessToken || accessToken === "" || accessToken === COOKIE_AUTH_TOKEN;

			// For token-based auth, check JWT expiry locally first
			// Note: API client will automatically refresh expired tokens,
			// but we can catch obviously expired tokens before making a request
			if (!isCookieAuth) {
				if (isTokenExpired(accessToken)) {
					// Don't logout immediately - the API client will attempt refresh
					// Just log for debugging
					console.debug(
						"Access token expired, will attempt refresh on next API call",
					);
				}
			}

			// Validate with backend
			// The API client will handle token refresh if needed
			try {
				const userContext = await authService.getCurrentUser();

				// For cookie-based auth, ensure token marker is set
				if (
					isCookieAuth &&
					accessToken !== COOKIE_AUTH_TOKEN &&
					userContext.user
				) {
					// Update token to marker without triggering logout
					login(
						profile || {
							id: userContext.user.id,
							email: userContext.user.email,
							fullName: "",
						},
						COOKIE_AUTH_TOKEN,
						COOKIE_AUTH_TOKEN,
						0,
						userContext.user.isOnboardingComplete,
					);
				}

				console.log("Auth validated successfully");
			} catch (error) {
				// 401 errors are handled by apiClient which will attempt refresh first
				// If refresh fails, apiClient will logout
				// Other errors might be network issues, don't logout
				console.error("Auth validation error:", error);
			}
		}

		validateAuth();
	}, [isAuthenticated, accessToken, logout, login, profile]);

	return <>{children}</>;
}
