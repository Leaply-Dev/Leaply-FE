"use client";

import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { refreshAccessToken } from "@/lib/api/client";
import { performLogout } from "@/lib/auth/logout";
import { authService } from "@/lib/services/auth";
import { useUserStore } from "@/lib/store/userStore";

// Session management configuration
const PROACTIVE_REFRESH_BUFFER_MS = 120000; // Refresh 2 minutes before expiry
const WARNING_BUFFER_MS = 60000; // Show warning 1 minute before expiry
const REFRESH_CHECK_INTERVAL_MS = 10000; // Check every 10 seconds

/**
 * Routes that require authentication
 * When auth is corrupted and user is on these routes, redirect to login
 */
const PROTECTED_ROUTES = [
	"/dashboard",
	"/persona-lab",
	"/onboarding",
	"/explore", // Some explore features require auth
];

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
 * Context for session timeout warning state
 */
interface SessionWarningContextValue {
	showWarning: boolean;
	secondsRemaining: number;
	onExtendSession: () => void;
}

const SessionWarningContext = createContext<SessionWarningContextValue>({
	showWarning: false,
	secondsRemaining: 0,
	onExtendSession: () => {},
});

/**
 * Hook to access session warning state
 */
export function useSessionWarning() {
	return useContext(SessionWarningContext);
}

/**
 * Special token marker for cookie-based authentication (OAuth)
 * Backend sets httpOnly cookies that frontend cannot access
 */
const COOKIE_AUTH_TOKEN = "COOKIE_AUTH";

/**
 * Session key for tracking validation state
 * Using sessionStorage instead of ref to survive HMR remounts in development
 */
const AUTH_VALIDATION_KEY = "leaply-auth-validated";

/**
 * Check if auth was already validated this session
 * Survives HMR remounts but resets on page refresh
 * Also forces re-validation if token is about to expire
 */
function wasValidatedThisSession(): boolean {
	if (typeof window === "undefined") return false;

	const validated = sessionStorage.getItem(AUTH_VALIDATION_KEY);
	if (validated !== "true") return false;

	// Force re-validation if token is expiring soon (within 2 minutes)
	// This prevents the UI from appearing authenticated while API calls fail with 401
	try {
		const persistedState = localStorage.getItem("leaply-user-store");
		if (persistedState) {
			const parsed = JSON.parse(persistedState);
			const tokenExpiresAt = parsed.state?.tokenExpiresAt;
			if (tokenExpiresAt && tokenExpiresAt < Date.now() + 120000) {
				// Token expiring soon, clear validation flag to force re-validation
				sessionStorage.removeItem(AUTH_VALIDATION_KEY);
				return false;
			}
		}
	} catch {
		// If we can't read the store, continue with normal validation
	}

	return true;
}

/**
 * Mark auth as validated for this session
 */
function markValidated(): void {
	if (typeof window === "undefined") return;
	sessionStorage.setItem(AUTH_VALIDATION_KEY, "true");
}

/**
 * AuthProvider validates the stored auth token on app load
 * Supports two authentication methods:
 * 1. Token-based (email/password): JWT in localStorage, sent via Bearer header
 * 2. Cookie-based (OAuth): httpOnly cookies, validated via backend
 *
 * - For token-based: Checks if JWT is expired locally, validates with backend
 * - For cookie-based: Always validates with backend (cannot read httpOnly cookies)
 * - Auto-logout only for token-based auth if refresh fails
 * - Uses sessionStorage to persist validation state across HMR remounts
 */
/**
 * Check if current path is a protected route that requires authentication
 */
function isProtectedRoute(pathname: string): boolean {
	return PROTECTED_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);
}

export function AuthProvider({ children }: AuthProviderProps) {
	const { accessToken, isAuthenticated, login, profile, tokenExpiresAt } =
		useUserStore();
	const validationInProgress = useRef(false);
	const proactiveRefreshInProgress = useRef(false);
	const pathname = usePathname();

	// Session timeout warning state
	const [showWarning, setShowWarning] = useState(false);
	const [secondsRemaining, setSecondsRemaining] = useState(0);

	// Handler to dismiss warning after successful refresh
	const handleExtendSession = useCallback(() => {
		setShowWarning(false);
		setSecondsRemaining(0);
	}, []);

	// Proactive token refresh and warning detection
	useEffect(() => {
		// Only run if authenticated
		if (!isAuthenticated || !tokenExpiresAt) return;

		const checkTokenExpiry = async () => {
			const now = Date.now();
			const timeUntilExpiry = tokenExpiresAt - now;

			// Show warning if within WARNING_BUFFER_MS (1 minute)
			if (timeUntilExpiry <= WARNING_BUFFER_MS && timeUntilExpiry > 0) {
				const seconds = Math.ceil(timeUntilExpiry / 1000);
				setSecondsRemaining(seconds);
				setShowWarning(true);
				return; // Don't proactively refresh while warning is shown
			}

			// Proactive refresh if within PROACTIVE_REFRESH_BUFFER_MS (2 minutes)
			// but not yet in warning zone
			if (
				timeUntilExpiry <= PROACTIVE_REFRESH_BUFFER_MS &&
				timeUntilExpiry > WARNING_BUFFER_MS
			) {
				if (proactiveRefreshInProgress.current) return;
				proactiveRefreshInProgress.current = true;

				try {
					console.log("Proactively refreshing token before expiry...");
					const result = await refreshAccessToken();
					if (result) {
						console.log("Proactive token refresh successful");
					} else {
						console.warn("Proactive token refresh failed");
						// Don't logout here - let the warning modal handle it
					}
				} catch (error) {
					console.error("Proactive token refresh error:", error);
				} finally {
					proactiveRefreshInProgress.current = false;
				}
			}

			// Hide warning if we're no longer in warning zone (e.g., after refresh)
			if (timeUntilExpiry > WARNING_BUFFER_MS && showWarning) {
				setShowWarning(false);
				setSecondsRemaining(0);
			}
		};

		// Initial check
		checkTokenExpiry();

		// Set up interval
		const interval = setInterval(checkTokenExpiry, REFRESH_CHECK_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [isAuthenticated, tokenExpiresAt, showWarning]);

	useEffect(() => {
		// Skip if already validated this session (survives HMR)
		if (wasValidatedThisSession()) {
			console.log("Auth already validated this session, skipping");
			return;
		}
		// Prevent concurrent validations
		if (validationInProgress.current) return;
		validationInProgress.current = true;

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

			// Helper: redirect to login if on protected route
			const redirectIfProtected = () => {
				if (isProtectedRoute(pathname)) {
					console.log(
						"On protected route with invalid auth, redirecting to login",
					);
					window.location.href = "/login?expired=true";
				}
			};

			// Corruption Case 1: Cookie says auth, but Zustand says not auth
			// This happens when logout() was called but cookie subscription didn't run
			// Or after deployment when localStorage was cleared but stale cookie remains
			if (cookieAuth && !isAuthenticated) {
				console.warn("Auth state corruption detected: clearing stale cookie");
				Cookies.remove("leaply-auth-state", { path: "/" });
				validationInProgress.current = false;
				redirectIfProtected();
				return;
			}

			// Corruption Case 2: Zustand says auth, but no valid token
			// This happens when localStorage was cleared but cookie remains
			if (isAuthenticated && !accessToken) {
				console.warn("Auth state corruption detected: auth but no token");
				performLogout({ redirect: "/login?expired=true" });
				validationInProgress.current = false;
				return;
			}

			// Skip if not authenticated (after corruption checks)
			if (!isAuthenticated) {
				validationInProgress.current = false;
				return;
			}

			// Detect authentication type
			const isCookieAuth =
				!accessToken || accessToken === "" || accessToken === COOKIE_AUTH_TOKEN;

			// For token-based auth, check JWT expiry locally first
			// Note: API client will automatically refresh expired tokens,
			// but we can catch obviously expired tokens before making a request
			if (!isCookieAuth && accessToken) {
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
					// Handle optional fields from UserInfo (OpenAPI schema has id and email as optional)
					login(
						profile || {
							id: userContext.user.id ?? "",
							email: userContext.user.email ?? "",
							fullName: "",
						},
						COOKIE_AUTH_TOKEN,
						COOKIE_AUTH_TOKEN,
						0,
						userContext.user.isOnboardingComplete,
					);
				}

				// Mark as validated so we don't re-validate on HMR
				markValidated();
				console.log("Auth validated successfully");
			} catch (error) {
				// For cookie-based auth, don't logout on validation error
				// The session might still be valid - let individual API calls handle it
				if (isCookieAuth) {
					console.warn(
						"Cookie auth validation failed, session may be expired:",
						error,
					);
					// Still mark as validated to prevent infinite loops
					markValidated();
				} else {
					// For token-based auth, be lenient - don't logout immediately
					// The token might be fresh from login and just needs a moment to propagate
					// Individual API calls will handle refresh/logout if truly expired
					console.warn(
						"Auth validation error (token-based), but continuing:",
						error,
					);
					// Mark as validated to prevent re-validation loop
					markValidated();
				}
			} finally {
				validationInProgress.current = false;
			}
		}

		validateAuth();
	}, [isAuthenticated, accessToken, login, profile, pathname]);

	// Context value for session warning
	const sessionWarningValue: SessionWarningContextValue = {
		showWarning,
		secondsRemaining,
		onExtendSession: handleExtendSession,
	};

	return (
		<SessionWarningContext.Provider value={sessionWarningValue}>
			{children}
		</SessionWarningContext.Provider>
	);
}
