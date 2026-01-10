"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
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
import { useRegister } from "@/lib/hooks/useRegister";
import { useUserStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";
import { type RegisterFormData, registerSchema } from "@/lib/validations/auth";

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const t = useTranslations("auth");
	const login = useUserStore((state) => state.login);
	const registerMutation = useRegister();
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof RegisterFormData, string>>
	>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setFieldErrors({});

		try {
			// Validate form data with Zod
			const validatedData = registerSchema.parse(formData);

			// Register returns AuthResponse which includes token
			const response = await registerMutation.mutateAsync({
				fullName: validatedData.fullName,
				email: validatedData.email,
				password: validatedData.password,
			});

			// Transform to UserProfile
			const userProfile = {
				id: response.userId,
				email: response.email,
				fullName: validatedData.fullName,
			};

			login(
				userProfile,
				response.accessToken,
				response.refreshToken,
				response.expiresIn,
				response.onboardingCompleted,
			);

			// Redirect to verify-email page for email verification prompt
			router.push("/verify-email");
		} catch (err) {
			console.error("Registration failed", err);

			// Handle Zod validation errors
			if (err && typeof err === "object" && "errors" in err) {
				const zodError = err as {
					errors: Array<{ path: string[]; message: string }>;
				};
				const errors: Partial<Record<keyof RegisterFormData, string>> = {};
				zodError.errors.forEach((error) => {
					const field = error.path[0] as keyof RegisterFormData;
					if (field) {
						errors[field] = error.message;
					}
				});
				setFieldErrors(errors);
				setError("Please fix the errors below");
			} else {
				setError(
					err instanceof Error ? err.message : "Failed to create account",
				);
			}
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
									disabled={registerMutation.isPending}
									className={fieldErrors.fullName ? "border-destructive" : ""}
								/>
								{fieldErrors.fullName && (
									<p className="text-sm text-destructive">
										{fieldErrors.fullName}
									</p>
								)}
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
									disabled={registerMutation.isPending}
									className={fieldErrors.email ? "border-destructive" : ""}
								/>
								{fieldErrors.email && (
									<p className="text-sm text-destructive">
										{fieldErrors.email}
									</p>
								)}
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
											disabled={registerMutation.isPending}
											className={
												fieldErrors.password ? "border-destructive" : ""
											}
										/>
										{fieldErrors.password && (
											<p className="text-sm text-destructive">
												{fieldErrors.password}
											</p>
										)}
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
											disabled={registerMutation.isPending}
											className={
												fieldErrors.confirmPassword ? "border-destructive" : ""
											}
										/>
										{fieldErrors.confirmPassword && (
											<p className="text-sm text-destructive">
												{fieldErrors.confirmPassword}
											</p>
										)}
									</Field>
								</Field>
								<FieldDescription>{t("passwordDescription")}</FieldDescription>
							</Field>
							<Field>
								<Button type="submit" disabled={registerMutation.isPending}>
									{registerMutation.isPending && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{registerMutation.isPending
										? t("creatingAccount")
										: t("createAccount")}
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
				{t("tosAgreement")} <Link href="/tos">{t("tos")}</Link> {t("and")}{" "}
				<Link href="/privacy">{t("privacyPolicy")}</Link>.
			</FieldDescription>
		</div>
	);
}
