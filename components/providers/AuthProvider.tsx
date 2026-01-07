"use client";

import { useEffect, useRef } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { authService } from "@/lib/services/auth";

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
 * AuthProvider validates the stored auth token on app load
 * - Checks if token is expired locally
 * - Validates token with backend by calling /auth/me
 * - Auto-logout if token is invalid or expired
 */
export function AuthProvider({ children }: AuthProviderProps) {
	const { token, isAuthenticated, logout, login, profile } = useUserStore();
	const validationDone = useRef(false);

	useEffect(() => {
		// Only validate once per mount
		if (validationDone.current) return;
		validationDone.current = true;

		async function validateAuth() {
			// Skip if not authenticated
			if (!isAuthenticated || !token) return;

			// Check if token is expired locally first (fast check)
			if (isTokenExpired(token)) {
				console.warn("JWT token expired. Logging out...");
				logout();
				return;
			}

			// Validate with backend
			try {
				const userContext = await authService.getCurrentUser();
				// Update profile if needed
				if (userContext.user && profile) {
					// Token is valid, user exists
					console.log("Auth validated successfully");
				}
			} catch (error) {
				// 401 errors are handled by apiClient which will logout
				// Other errors might be network issues, don't logout
				console.error("Auth validation error:", error);
			}
		}

		validateAuth();
	}, [isAuthenticated, token, logout, login, profile]);

	return <>{children}</>;
}
