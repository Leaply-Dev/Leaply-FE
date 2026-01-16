"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/lib/hooks/useLogin";
import { useUserStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";
import { type LoginFormData, loginSchema } from "@/lib/validations/auth";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslations("auth");
	const login = useUserStore((state) => state.login);
	const loginMutation = useLogin();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof LoginFormData, string>>
	>({});

	// Check for OAuth error or session expired in URL params
	useEffect(() => {
		const oauthError = searchParams.get("error");
		const expired = searchParams.get("expired");

		if (oauthError === "oauth_failed") {
			setError(t("oauthFailed"));
		} else if (expired === "true") {
			setError(t("sessionExpired"));
		}
	}, [searchParams, t]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setFieldErrors({});

		try {
			// Validate form data with Zod
			const formData = loginSchema.parse({ email, password });

			const response = await loginMutation.mutateAsync({ data: formData });

			// The API returns nested structure: response.data.data contains AuthResponse
			const authResponse = response.data.data;

			if (!authResponse) {
				throw new Error("Login failed - no data received");
			}

			// Add validation for critical fields
			if (!authResponse.accessToken) {
				console.error("Login response missing access token:", authResponse);
				throw new Error("Login failed - missing access token");
			}

			const userProfile = {
				id: authResponse.userId ?? "",
				email: authResponse.email ?? "",
				fullName: "", // API doesn't return name on login yet, will need to fetch profile or adjust
			};

			login(
				userProfile,
				authResponse.accessToken,
				authResponse.refreshToken ?? "",
				authResponse.expiresIn ?? 0,
				authResponse.onboardingCompleted ?? false,
			);

			// Wait for Zustand persist to complete
			// This ensures tokens are written to localStorage before redirect
			await new Promise((resolve) => setTimeout(resolve, 200));

			if (authResponse.onboardingCompleted) {
				router.push("/dashboard");
			} else {
				router.push("/onboarding");
			}
		} catch (err) {
			console.error("Login failed", err);

			// Handle Zod validation errors
			if (err && typeof err === "object" && "errors" in err) {
				const zodError = err as {
					errors: Array<{ path: string[]; message: string }>;
				};
				const errors: Partial<Record<keyof LoginFormData, string>> = {};
				zodError.errors.forEach((error) => {
					const field = error.path[0] as keyof LoginFormData;
					if (field) {
						errors[field] = error.message;
					}
				});
				setFieldErrors(errors);
				setError("Please fix the errors below");
			} else {
				setError(
					err instanceof Error ? err.message : "Invalid email or password",
				);
			}
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">{t("loginTitle")}</CardTitle>
					<CardDescription>{t("loginSubtitle")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<GoogleLoginButton variant="login" />
							</Field>
							<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
								{t("orContinueWith")}
							</FieldSeparator>

							{error && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>{t("error")}</AlertTitle>
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<Field>
								<FieldLabel htmlFor="email">{t("email")}</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder={t("emailPlaceholder")}
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={loginMutation.isPending}
									className={fieldErrors.email ? "border-destructive" : ""}
								/>
								{fieldErrors.email && (
									<p className="text-sm text-destructive">
										{fieldErrors.email}
									</p>
								)}
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">{t("password")}</FieldLabel>
									<Link
										href="/forgot-password"
										className="ml-auto text-sm underline-offset-4 hover:underline"
									>
										{t("forgotPasswordLink")}
									</Link>
								</div>
								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={loginMutation.isPending}
									className={fieldErrors.password ? "border-destructive" : ""}
								/>
								{fieldErrors.password && (
									<p className="text-sm text-destructive">
										{fieldErrors.password}
									</p>
								)}
							</Field>
							<Field>
								<Button type="submit" disabled={loginMutation.isPending}>
									{loginMutation.isPending && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{loginMutation.isPending ? t("loggingIn") : t("signIn")}
								</Button>
								<FieldDescription className="text-center">
									{t("noAccount")} <Link href="/register">{t("signUp")}</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				{t("tosAgreement")} <Link href="/tos">{t("tos")}</Link> {t("and")}{" "}
				<Link href="/privacy">{t("privacyPolicy")}</Link>.
			</FieldDescription>
		</div>
	);
}
