"use client";

import { AlertCircle, Check, Circle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
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
	const [serverError, setServerError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof RegisterFormData, string[]>>
	>({});
	const [touchedFields, setTouchedFields] = useState<
		Set<keyof RegisterFormData>
	>(new Set());
	const [hasSubmitted, setHasSubmitted] = useState(false);

	const collectErrors = (data: typeof formData) => {
		const result = registerSchema.safeParse(data);
		if (result.success) return {};
		const errors: Partial<Record<keyof RegisterFormData, string[]>> = {};
		for (const issue of result.error.issues) {
			const field = issue.path[0] as keyof RegisterFormData | undefined;
			if (!field) continue;
			const existing = errors[field] ?? [];
			existing.push(issue.message);
			errors[field] = existing;
		}
		return errors;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const fieldId = e.target.id as keyof RegisterFormData;
		const newFormData = { ...formData, [fieldId]: e.target.value };
		setFormData(newFormData);

		if (touchedFields.size === 0) return;

		const fieldsToCheck = new Set<keyof RegisterFormData>();
		if (touchedFields.has(fieldId)) fieldsToCheck.add(fieldId);
		if (fieldId === "password" && touchedFields.has("confirmPassword")) {
			fieldsToCheck.add("confirmPassword");
		}

		if (fieldsToCheck.size > 0) {
			const allErrors = collectErrors(newFormData);
			setFieldErrors((prev) => {
				const next = { ...prev };
				for (const field of fieldsToCheck) {
					if (allErrors[field]?.length) {
						next[field] = allErrors[field];
					} else {
						delete next[field];
					}
				}
				return next;
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setServerError(null);
		setHasSubmitted(true);

		const errors = collectErrors(formData);
		const hasErrors = FIELD_ORDER.some((f) => (errors[f]?.length ?? 0) > 0);

		if (hasErrors) {
			setFieldErrors(errors);
			setTouchedFields((prev) => {
				const next = new Set(prev);
				for (const field of FIELD_ORDER) {
					if (errors[field]?.length) next.add(field);
				}
				return next;
			});
			const firstErrorField = FIELD_ORDER.find((f) => errors[f]?.length);
			if (firstErrorField) {
				document.getElementById(firstErrorField)?.focus();
			}
			return;
		}

		setFieldErrors({});

		try {
			const validatedData = registerSchema.parse(formData);
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

			const userProfile = {
				id: authResponse.userId ?? "",
				email: authResponse.email ?? "",
				fullName: validatedData.fullName,
			};

			login(userProfile, authResponse.onboardingCompleted ?? false);
			router.push("/verify-email");
		} catch (err) {
			console.error("Registration failed", err);
			setServerError(
				err instanceof Error ? err.message : "Failed to create account",
			);
		}
	};

	const passwordAllRulesPass = PASSWORD_RULES.every((r) =>
		r.test(formData.password),
	);
	const confirmPasswordMatch =
		formData.confirmPassword.length > 0 &&
		formData.password === formData.confirmPassword;

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">{t("signupTitle")}</CardTitle>
					<CardDescription>{t("signupSubtitle")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup className="gap-4">
							<Field>
								<GoogleLoginButton variant="register" />
							</Field>
							<FieldSeparator className="my-1 *:data-[slot=field-separator-content]:bg-card">
								{t("orContinueWith")}
							</FieldSeparator>

							{serverError && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>{t("error")}</AlertTitle>
									<AlertDescription>{serverError}</AlertDescription>
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
								{fieldErrors.fullName && fieldErrors.fullName.length > 0 && (
									<ul className="space-y-0.5 text-sm text-destructive">
										{fieldErrors.fullName.map((msg) => (
											<li key={msg}>{msg}</li>
										))}
									</ul>
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
									className={
										fieldErrors.email?.length ? "border-destructive" : ""
									}
								/>
								{fieldErrors.email && fieldErrors.email.length > 0 && (
									<ul className="space-y-0.5 text-sm text-destructive">
										{fieldErrors.email.map((msg) => (
											<li key={msg}>{msg}</li>
										))}
									</ul>
								)}
							</Field>

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
										hasSubmitted && !passwordAllRulesPass
											? "border-destructive"
											: ""
									}
								/>
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
									className={cn(
										fieldErrors.confirmPassword?.length && "border-destructive",
										confirmPasswordMatch &&
											!fieldErrors.confirmPassword?.length &&
											"border-green-600",
									)}
								/>
								{fieldErrors.confirmPassword &&
									fieldErrors.confirmPassword.length > 0 && (
										<p className="text-sm text-destructive">
											{fieldErrors.confirmPassword[0]}
										</p>
									)}
								{confirmPasswordMatch &&
									!fieldErrors.confirmPassword?.length && (
										<p className="flex items-center gap-1.5 text-sm text-green-600">
											<Check className="h-3.5 w-3.5 shrink-0" />
											{tValidation("confirmPassword.match")}
										</p>
									)}
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
