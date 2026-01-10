"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store/userStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function OAuthSuccessPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const login = useUserStore((state) => state.login);
	const updatePreferences = useUserStore((state) => state.updatePreferences);
	const [status, setStatus] = useState<"loading" | "error">("loading");

	useEffect(() => {
		const verifyAuth = async () => {
			try {
				// Call /auth/me with credentials to verify the cookie-based auth
				const response = await fetch(`${API_URL}/v1/auth/me`, {
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error("Authentication failed");
				}

				const data = await response.json();

				if (data.success && data.data) {
					const userContext = data.data;

					// Transform to UserProfile format
					const userProfile = {
						id: userContext.user.id,
						email: userContext.user.email,
						fullName: userContext.profile?.fullName || "",
					};

					// Login to store with COOKIE_AUTH marker
					// Backend sets httpOnly cookies (access_token, refresh_token)
					// Frontend cannot access these cookies, so we use a marker token
					login(
						userProfile,
						"COOKIE_AUTH", // Special marker for cookie-based authentication
						"COOKIE_AUTH", // Refresh token is also in httpOnly cookie
						0, // expiresIn not needed for cookie auth - backend handles it
						userContext.user.isOnboardingComplete,
					);

					// Update preferences if available
					if (userContext.preferences) {
						updatePreferences({
							fieldOfInterest: userContext.preferences.fieldOfInterest,
							preferredRegions: userContext.preferences.preferredRegions,
							intendedStartTerm: userContext.preferences.intendedStartTerm,
							budgetLabel: userContext.preferences.budgetLabel,
							journeyType: userContext.preferences.journeyType,
							programType: userContext.preferences.programType,
							campusSetting: userContext.preferences
								.campusSetting as UserPreferences["campusSetting"],
							interests: userContext.preferences.interests,
						});
					}

					// Check if onboarding is needed
					const needsOnboarding = searchParams.get("onboarding") === "true";

					if (needsOnboarding || !userContext.user.isOnboardingComplete) {
						router.replace("/onboarding");
					} else {
						router.replace("/dashboard");
					}
				} else {
					throw new Error("Invalid response");
				}
			} catch (error) {
				console.error("OAuth verification failed:", error);
				setStatus("error");
				// Redirect to login with error after a short delay
				setTimeout(() => {
					router.replace("/login?error=oauth_failed");
				}, 2000);
			}
		};

		verifyAuth();
	}, [router, login, updatePreferences, searchParams]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-muted">
			<div className="flex flex-col items-center gap-4">
				{status === "loading" ? (
					<>
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<p className="text-muted-foreground">Đang xử lý...</p>
					</>
				) : (
					<>
						<p className="text-destructive">Đăng nhập thất bại</p>
						<p className="text-sm text-muted-foreground">
							Đang chuyển hướng...
						</p>
					</>
				)}
			</div>
		</div>
	);
}

// Type import for preferences
interface UserPreferences {
	campusSetting?: "urban" | "suburban" | "rural";
}
