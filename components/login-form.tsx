"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
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
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { authService } from "@/lib/services/auth";
import { useUserStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslations("auth");
	const login = useUserStore((state) => state.login);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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
		setIsLoading(true);
		setError(null);

		try {
			const response = await authService.login({ email, password });

			// Transform AuthResponse to UserProfile format expected by store
			const userProfile = {
				id: response.userId,
				email: response.email,
				fullName: "", // API doesn't return name on login yet, will need to fetch profile or adjust
			};

			login(userProfile, response.token, response.onboardingCompleted);

			if (response.onboardingCompleted) {
				router.push("/dashboard");
			} else {
				router.push("/onboarding");
			}
		} catch (err) {
			console.error("Login failed", err);
			setError(
				err instanceof Error ? err.message : "Invalid email or password",
			);
		} finally {
			setIsLoading(false);
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
									disabled={isLoading}
								/>
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
									disabled={isLoading}
								/>
							</Field>
							<Field>
								<Button type="submit" disabled={isLoading}>
									{isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{isLoading ? t("loggingIn") : t("signIn")}
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
