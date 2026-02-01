"use client";

import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import { getCurrentUser } from "@/lib/generated/api/endpoints/authentication/authentication";
import type { UserContextResponse } from "@/lib/generated/api/models";
import { useUserStore } from "@/lib/store/userStore";

const AuthStateCookieSchema = z.object({
	isAuthenticated: z.boolean(),
	isOnboardingComplete: z.boolean().optional(),
});

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

function isProtectedRoute(pathname: string): boolean {
	return PROTECTED_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);
}

interface AuthProviderProps {
	children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const { isAuthenticated, login, profile, _hasHydrated } = useUserStore();
	const validationInProgress = useRef(false);
	const hasValidated = useRef(false);
	const pathname = usePathname();

	useEffect(() => {
		if (!_hasHydrated) return;
		if (hasValidated.current) return;
		if (validationInProgress.current) return;
		validationInProgress.current = true;

		async function validateAuth() {
			const authStateCookie = Cookies.get("leaply-auth-state");
			let cookieAuth = false;

			const parseResult = AuthStateCookieSchema.safeParse(
				(() => {
					try {
						return JSON.parse(authStateCookie || "{}");
					} catch {
						return {};
					}
				})(),
			);

			if (parseResult.success) {
				cookieAuth = parseResult.data.isAuthenticated === true;
			}

			const redirectIfProtected = () => {
				if (isProtectedRoute(pathname)) {
					window.location.href = "/login?expired=true";
				}
			};

			if (cookieAuth && !isAuthenticated) {
				Cookies.remove("leaply-auth-state", { path: "/" });
				validationInProgress.current = false;
				redirectIfProtected();
				return;
			}

			if (!isAuthenticated) {
				validationInProgress.current = false;
				return;
			}

			try {
				const response = await getCurrentUser();
				const userContext = unwrapResponse<UserContextResponse>(response);

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

				hasValidated.current = true;
			} catch (_error) {
				hasValidated.current = true;
			} finally {
				validationInProgress.current = false;
			}
		}

		validateAuth();
	}, [_hasHydrated, isAuthenticated, login, profile, pathname]);

	return <>{children}</>;
}
