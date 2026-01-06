"use client";

import { Check, CheckCircle2, Loader2, Lock, X, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services/auth";
import { cn } from "@/lib/utils";

type ResetState = "form" | "submitting" | "success" | "error";

interface PasswordRequirement {
	key: string;
	label: string;
	test: (password: string) => boolean;
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslations("auth.resetPassword");

	const token = searchParams.get("token");

	const [state, setState] = useState<ResetState>(token ? "form" : "error");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	// Redirect to forgot-password if no token
	useEffect(() => {
		if (!token) {
			router.replace("/forgot-password");
		}
	}, [token, router]);

	const passwordRequirements: PasswordRequirement[] = [
		{
			key: "minLength",
			label: t("minLength"),
			test: (p) => p.length >= 8,
		},
		{
			key: "uppercase",
			label: t("uppercase"),
			test: (p) => /[A-Z]/.test(p),
		},
		{
			key: "lowercase",
			label: t("lowercase"),
			test: (p) => /[a-z]/.test(p),
		},
		{
			key: "number",
			label: t("number"),
			test: (p) => /\d/.test(p),
		},
	];

	const isPasswordValid = passwordRequirements.every((req) => req.test(newPassword));
	const doPasswordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isPasswordValid) {
			setError("Please meet all password requirements");
			return;
		}

		if (!doPasswordsMatch) {
			setError(t("passwordsNotMatch"));
			return;
		}

		if (!token) {
			setState("error");
			return;
		}

		setState("submitting");
		setError(null);

		try {
			await authService.resetPassword(token, newPassword);
			setState("success");
		} catch (err) {
			setState("error");
			setError(err instanceof Error ? err.message : "Password reset failed");
		}
	};

	const handleGoToLogin = () => {
		router.push("/login");
	};

	const renderContent = () => {
		switch (state) {
			case "submitting":
				return (
					<div className="flex flex-col items-center gap-4 py-8">
						<Loader2 className="h-12 w-12 animate-spin text-primary" />
						<p className="text-muted-foreground">{t("resetting")}</p>
					</div>
				);

			case "success":
				return (
					<div className="flex flex-col items-center gap-4 py-6">
						<div className="rounded-full bg-green-100 p-3">
							<CheckCircle2 className="h-12 w-12 text-green-600" />
						</div>
						<div className="text-center">
							<h3 className="text-xl font-semibold text-green-600">{t("success")}</h3>
							<p className="mt-2 text-muted-foreground">{t("successMessage")}</p>
						</div>
						<Button onClick={handleGoToLogin} className="mt-4 w-full">
							{t("goToLogin")}
						</Button>
					</div>
				);

			case "error":
				return (
					<div className="flex flex-col items-center gap-4 py-6">
						<div className="rounded-full bg-red-100 p-3">
							<XCircle className="h-12 w-12 text-red-600" />
						</div>
						<div className="text-center">
							<h3 className="text-xl font-semibold text-red-600">{t("invalidToken")}</h3>
							<p className="mt-2 text-muted-foreground">{t("invalidTokenMessage")}</p>
							{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
						</div>
						<Link href="/forgot-password" className="mt-4 w-full">
							<Button variant="outline" className="w-full">
								{t("requestNew")}
							</Button>
						</Link>
					</div>
				);

			case "form":
			default:
				return (
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<div className="flex justify-center pb-4">
								<div className="rounded-full bg-primary/10 p-3">
									<Lock className="h-8 w-8 text-primary" />
								</div>
							</div>

							{error && (
								<p className="text-center text-sm text-red-500">{error}</p>
							)}

							<Field>
								<FieldLabel htmlFor="newPassword">{t("newPassword")}</FieldLabel>
								<Input
									id="newPassword"
									type="password"
									placeholder={t("newPasswordPlaceholder")}
									required
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>
							</Field>

							{/* Password requirements checklist */}
							<div className="rounded-lg border bg-muted/50 p-3">
								<p className="mb-2 text-sm font-medium text-muted-foreground">
									{t("requirements")}
								</p>
								<ul className="space-y-1">
									{passwordRequirements.map((req) => {
										const isMet = req.test(newPassword);
										return (
											<li
												key={req.key}
												className={cn(
													"flex items-center gap-2 text-sm transition-colors",
													isMet ? "text-green-600" : "text-muted-foreground"
												)}
											>
												{isMet ? (
													<Check className="h-4 w-4" />
												) : (
													<X className="h-4 w-4" />
												)}
												{req.label}
											</li>
										);
									})}
								</ul>
							</div>

							<Field>
								<FieldLabel htmlFor="confirmPassword">{t("confirmPassword")}</FieldLabel>
								<Input
									id="confirmPassword"
									type="password"
									placeholder={t("confirmPasswordPlaceholder")}
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								{confirmPassword && !doPasswordsMatch && (
									<FieldDescription className="text-red-500">
										{t("passwordsNotMatch")}
									</FieldDescription>
								)}
								{doPasswordsMatch && (
									<FieldDescription className="text-green-600">
										<Check className="mr-1 inline h-3 w-3" />
										Passwords match
									</FieldDescription>
								)}
							</Field>

							<Field>
								<Button
									type="submit"
									className="w-full"
									disabled={!isPasswordValid || !doPasswordsMatch}
								>
									{t("resetPassword")}
								</Button>
							</Field>
						</FieldGroup>
					</form>
				);
		}
	};

	if (!token) {
		return null; // Will redirect
	}

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link href="/" className="flex items-center gap-2 self-center font-medium">
					<Image
						src="/images/leaply-logo.png"
						alt="Leaply"
						width={32}
						height={32}
					/>
					Leaply
				</Link>
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl">{t("title")}</CardTitle>
						<CardDescription>{t("subtitle")}</CardDescription>
					</CardHeader>
					<CardContent>
						{renderContent()}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
