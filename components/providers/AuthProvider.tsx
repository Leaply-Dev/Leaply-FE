"use client";

import Cookies from "js-cookie";
import { useEffect, useRef } from "react";
import { performLogout } from "@/lib/auth/logout";
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
	const { accessToken, isAuthenticated, login, profile } = useUserStore();
	const validationDone = useRef(false);

	useEffect(() => {
		// Only validate once per mount
		if (validationDone.current) return;
		validationDone.current = true;

		async function validateAuth() {
			// Check for auth state corruption first
			const authStateCookie = Cookies.get("leaply-auth-state");
			let cookieAuth = false;

			try {
				const parsed = JSON.parse(authStateCookie || "{}");
				cookieAuth = parsed.isAuthenticated === true;
			} catch {
				// Invalid cookie - will be handled below
			}

			// Corruption Case 1: Cookie says auth, but Zustand says not auth
			// This happens when logout() was called but cookie subscription didn't run
			if (cookieAuth && !isAuthenticated) {
				console.warn("Auth state corruption detected: clearing stale cookie");
				Cookies.remove("leaply-auth-state", { path: "/" });
				return;
			}

			// Corruption Case 2: Zustand says auth, but no valid token
			// This happens when localStorage was cleared but cookie remains
			if (isAuthenticated && !accessToken) {
				console.warn("Auth state corruption detected: auth but no token");
				performLogout();
				return;
			}

			// Skip if not authenticated (after corruption checks)
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
	}, [isAuthenticated, accessToken, login, profile]);

	return <>{children}</>;
}
