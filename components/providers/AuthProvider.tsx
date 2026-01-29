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
import { getCurrentUser } from "@/lib/generated/api/endpoints/authentication/authentication";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import type { UserContextResponse } from "@/lib/generated/api/models";
import { useUserStore } from "@/lib/store/userStore";

/**
 * Simplified AuthProvider for cookie-based authentication.
 *
 * After backend migration to HttpOnly cookies:
 * - No more client-side token tracking or expiry management
 * - Backend handles token refresh via cookies
 * - This provider just validates session on load and handles corruption detection
 */

/**
 * Routes that require authentication
 */
const PROTECTED_ROUTES = [
	"/dashboard",
	"/persona-lab",
	"/onboarding",
	"/explore",
];

/**
 * Session key for tracking validation state
 */
const AUTH_VALIDATION_KEY = "leaply-auth-validated";

interface AuthProviderProps {
	children: React.ReactNode;
}

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

export function useSessionWarning() {
	return useContext(SessionWarningContext);
}

/**
 * Check if auth was already validated this session
 */
function wasValidatedThisSession(): boolean {
	if (typeof window === "undefined") return false;
	return sessionStorage.getItem(AUTH_VALIDATION_KEY) === "true";
}

function markValidated(): void {
	if (typeof window === "undefined") return;
	sessionStorage.setItem(AUTH_VALIDATION_KEY, "true");
}

function isProtectedRoute(pathname: string): boolean {
	return PROTECTED_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);
}

export function AuthProvider({ children }: AuthProviderProps) {
	const { isAuthenticated, login, profile, _hasHydrated } = useUserStore();
	const validationInProgress = useRef(false);
	const pathname = usePathname();

	// Session warning state (kept for UI compatibility, but not actively used with cookie auth)
	const [showWarning, setShowWarning] = useState(false);
	const [secondsRemaining, setSecondsRemaining] = useState(0);

	const handleExtendSession = useCallback(() => {
		setShowWarning(false);
		setSecondsRemaining(0);
	}, []);

	useEffect(() => {
		if (!_hasHydrated) return;
		if (wasValidatedThisSession()) return;
		if (validationInProgress.current) return;
		validationInProgress.current = true;

		async function validateAuth() {
			const authStateCookie = Cookies.get("leaply-auth-state");
			let cookieAuth = false;

			try {
				const parsed = JSON.parse(authStateCookie || "{}");
				cookieAuth = parsed.isAuthenticated === true;
			} catch {
				// Invalid cookie
			}

			const redirectIfProtected = () => {
				if (isProtectedRoute(pathname)) {
					window.location.href = "/login?expired=true";
				}
			};

			// Corruption: Cookie says auth, but Zustand says not
			if (cookieAuth && !isAuthenticated) {
				Cookies.remove("leaply-auth-state", { path: "/" });
				validationInProgress.current = false;
				redirectIfProtected();
				return;
			}

			// Skip if not authenticated
			if (!isAuthenticated) {
				validationInProgress.current = false;
				return;
			}

			// Validate with backend
			try {
				const response = await getCurrentUser();
				const userContext = unwrapResponse<UserContextResponse>(response);

				// Update profile if needed
				if (userContext?.user) {
					login(
						profile || {
							id: userContext.user.id ?? "",
							email: userContext.user.email ?? "",
							fullName: "",
						},
						userContext.user.isOnboardingComplete,
					);
				}

				markValidated();
			} catch (_error) {
				// Don't logout on validation error - let individual API calls handle it
				markValidated();
			} finally {
				validationInProgress.current = false;
			}
		}

		validateAuth();
	}, [_hasHydrated, isAuthenticated, login, profile, pathname]);

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
