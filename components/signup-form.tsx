"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
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

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const t = useTranslations("auth");
	const login = useUserStore((state) => state.login);
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		if (formData.password !== formData.confirmPassword) {
			setError(t("passwordsNotMatch"));
			setIsLoading(false);
			return;
		}

		try {
			// Register returns AuthResponse which includes token
			const response = await authService.register({
				fullName: formData.fullName,
				email: formData.email,
				password: formData.password,
				// fullName isn't in RegisterRequest yet, keeping it local or enhancing endpoint later
			});

			// Transform to UserProfile
			const userProfile = {
				id: response.userId,
				email: response.email,
				fullName: formData.fullName, // Capture full name from form
			};

			login(userProfile, response.token, response.onboardingCompleted);

			// Register always leads to onboarding or dashboard for new users
			router.push("/onboarding");
		} catch (err) {
			console.error("Registration failed", err);
			setError(err instanceof Error ? err.message : "Failed to create account");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">{t("signupTitle")}</CardTitle>
					<CardDescription>{t("signupSubtitle")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<GoogleLoginButton variant="register" />
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
								<FieldLabel htmlFor="fullName">{t("fullName")}</FieldLabel>
								<Input
									id="fullName"
									type="text"
									placeholder={t("fullNamePlaceholder")}
									required
									value={formData.fullName}
									onChange={handleChange}
									disabled={isLoading}
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="email">{t("email")}</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder={t("emailPlaceholder")}
									required
									value={formData.email}
									onChange={handleChange}
									disabled={isLoading}
								/>
							</Field>
							<Field>
								<Field className="grid grid-cols-2 gap-4">
									<Field>
										<FieldLabel htmlFor="password">{t("password")}</FieldLabel>
										<Input
											id="password"
											type="password"
											required
											value={formData.password}
											onChange={handleChange}
											disabled={isLoading}
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor="confirmPassword">
											{t("confirmPassword")}
										</FieldLabel>
										<Input
											id="confirmPassword"
											type="password"
											required
											value={formData.confirmPassword}
											onChange={handleChange}
											disabled={isLoading}
										/>
									</Field>
								</Field>
								<FieldDescription>{t("passwordDescription")}</FieldDescription>
							</Field>
							<Field>
								<Button type="submit" disabled={isLoading}>
									{isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{isLoading ? t("creatingAccount") : t("createAccount")}
								</Button>
								<FieldDescription className="text-center">
									{t("alreadyHaveAccount")}{" "}
									<Link href="/login">{t("signIn")}</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				{t("tosAgreement")} <Link href="/terms">{t("tos")}</Link> {t("and")}{" "}
				<Link href="/privacy">{t("privacyPolicy")}</Link>.
			</FieldDescription>
		</div>
	);
}
