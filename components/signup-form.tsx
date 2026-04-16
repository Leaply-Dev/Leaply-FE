"use client";

import { AlertCircle, Check, Circle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ZodError } from "zod";
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
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import { useRegister } from "@/lib/generated/api/endpoints/authentication/authentication";
import type { AuthResponse } from "@/lib/generated/api/models";
import { useUserStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";
import {
	createRegisterSchema,
	type RegisterFormData,
} from "@/lib/validations/auth";

const FIELD_ORDER: Array<keyof RegisterFormData> = [
	"fullName",
	"email",
	"password",
	"confirmPassword",
];

const PASSWORD_RULES = [
	{ key: "min", test: (p: string) => p.length >= 8 },
	{ key: "uppercase", test: (p: string) => /[A-Z]/.test(p) },
	{ key: "lowercase", test: (p: string) => /[a-z]/.test(p) },
	{ key: "number", test: (p: string) => /[0-9]/.test(p) },
] as const;

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const t = useTranslations("auth");
	const tValidation = useTranslations("auth.validation");
	const registerSchema = useMemo(
		() => createRegisterSchema(tValidation),
		[tValidation],
	);
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
		Partial<Record<keyof RegisterFormData, string[]>>
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
				data: {
					fullName: validatedData.fullName,
					email: validatedData.email,
					password: validatedData.password,
				},
			});

			const authResponse = unwrapResponse<AuthResponse>(response);
			if (!authResponse) {
				throw new Error("Registration failed - no data received");
			}

			// Transform to UserProfile
			const userProfile = {
				id: authResponse.userId ?? "",
				email: authResponse.email ?? "",
				fullName: validatedData.fullName,
			};

			// Backend now sets HttpOnly cookies - we just update UI state
			login(userProfile, authResponse.onboardingCompleted ?? false);

			// Redirect to verify-email page for email verification prompt
			router.push("/verify-email");
		} catch (err) {
			console.error("Registration failed", err);

			// Handle Zod validation errors
			if (err instanceof ZodError) {
				const errors: Partial<Record<keyof RegisterFormData, string[]>> = {};
				for (const issue of err.issues) {
					const field = issue.path[0] as keyof RegisterFormData | undefined;
					if (!field) continue;
					const existing = errors[field] ?? [];
					existing.push(issue.message);
					errors[field] = existing;
				}
				setFieldErrors(errors);
				setError(t("pleaseFixErrors"));
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
									<AlertDescription>
										<p>{error}</p>
										{FIELD_ORDER.some(
											(key) => (fieldErrors[key]?.length ?? 0) > 0,
										) && (
											<div className="mt-2 space-y-2">
												{FIELD_ORDER.map((key) => {
													const messages = fieldErrors[key];
													if (!messages || messages.length === 0) return null;
													return (
														<div key={key}>
															<p className="font-medium">{t(key)}:</p>
															<ul className="list-disc pl-5">
																{messages.map((msg) => (
																	<li key={msg}>{msg}</li>
																))}
															</ul>
														</div>
													);
												})}
											</div>
										)}
									</AlertDescription>
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
									className={
										fieldErrors.fullName?.length ? "border-destructive" : ""
									}
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
									disabled={registerMutation.isPending}
									className={
										fieldErrors.email?.length ? "border-destructive" : ""
									}
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
											disabled={registerMutation.isPending}
											className={
												fieldErrors.password?.length ? "border-destructive" : ""
											}
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
											disabled={registerMutation.isPending}
											className={
												fieldErrors.confirmPassword?.length
													? "border-destructive"
													: ""
											}
										/>
									</Field>
								</Field>
								<ul className="mt-1 space-y-1 text-sm">
									{PASSWORD_RULES.map((rule) => {
										const ok = rule.test(formData.password);
										return (
											<li
												key={rule.key}
												className={cn(
													"flex items-center gap-2",
													ok ? "text-green-600" : "text-muted-foreground",
												)}
											>
												{ok ? (
													<Check className="h-3.5 w-3.5 shrink-0" />
												) : (
													<Circle className="h-3.5 w-3.5 shrink-0" />
												)}
												<span>{tValidation(`password.${rule.key}`)}</span>
											</li>
										);
									})}
								</ul>
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
