"use client";

import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
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
import { useResendVerification } from "@/lib/hooks/useResendVerification";
import { useVerifyEmail } from "@/lib/hooks/useVerifyEmail";
import { useUserStore } from "@/lib/store/userStore";

export default function VerifyEmailPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslations("auth.verifyEmail");
	const profile = useUserStore((state) => state.profile);

	const token = searchParams.get("token");

	// TanStack Query hook - automatically deduplicates in React Strict Mode
	const {
		error: verifyError,
		isLoading: isVerifying,
		isSuccess: verifySuccess,
	} = useVerifyEmail(token);

	// Mutation for resending verification
	const resendMutation = useResendVerification();

	const [countdown, setCountdown] = useState(0);

	// Countdown timer for resend
	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [countdown]);

	const handleSendVerification = async () => {
		if (!profile?.email) return;

		try {
			await resendMutation.mutateAsync(profile.email);
			setCountdown(60); // 60 second cooldown
		} catch (err) {
			console.error("Failed to resend verification", err);
		}
	};

	const handleResend = async () => {
		if (countdown > 0 || !profile?.email) return;
		await handleSendVerification();
	};

	const handleSkip = () => {
		router.push("/onboarding");
	};

	const handleGoToDashboard = () => {
		router.push("/dashboard");
	};

	// Render based on state (using TanStack Query states)
	const renderContent = () => {
		// Token verification states
		if (token) {
			if (isVerifying) {
				return (
					<div className="flex flex-col items-center gap-4 py-8">
						<Loader2 className="h-12 w-12 animate-spin text-primary" />
						<p className="text-muted-foreground">{t("verifying")}</p>
					</div>
				);
			}

			if (verifySuccess) {
				return (
					<div className="flex flex-col items-center gap-4 py-6">
						<div className="rounded-full bg-green-100 p-3">
							<CheckCircle2 className="h-12 w-12 text-green-600" />
						</div>
						<div className="text-center">
							<h3 className="text-xl font-semibold text-green-600">
								{t("success")}
							</h3>
							<p className="mt-2 text-muted-foreground">
								{t("successMessage")}
							</p>
						</div>
						<Button onClick={handleGoToDashboard} className="mt-4 w-full">
							{t("goToDashboard")}
						</Button>
					</div>
				);
			}

			if (verifyError) {
				return (
					<div className="flex flex-col items-center gap-4 py-6">
						<div className="rounded-full bg-red-100 p-3">
							<XCircle className="h-12 w-12 text-red-600" />
						</div>
						<div className="text-center">
							<h3 className="text-xl font-semibold text-red-600">
								{t("invalidToken")}
							</h3>
							<p className="mt-2 text-muted-foreground">
								{t("invalidTokenMessage")}
							</p>
							{verifyError instanceof Error && (
								<p className="mt-1 text-sm text-red-500">
									{verifyError.message}
								</p>
							)}
						</div>
						<Button
							onClick={handleSendVerification}
							variant="outline"
							className="mt-4 w-full"
						>
							{t("requestNew")}
						</Button>
					</div>
				);
			}
		}

		// Resend verification states
		if (resendMutation.isSuccess) {
			return (
				<div className="flex flex-col items-center gap-4 py-6">
					<div className="rounded-full bg-green-100 p-3">
						<CheckCircle2 className="h-12 w-12 text-green-600" />
					</div>
					<div className="text-center">
						<h3 className="text-xl font-semibold text-green-600">
							{t("emailSent")}
						</h3>
						<p className="mt-2 text-muted-foreground">{t("checkInbox")}</p>
						{profile?.email && (
							<p className="mt-1 text-sm font-medium">{profile.email}</p>
						)}
					</div>
					<div className="mt-4 flex w-full flex-col gap-2">
						<Button
							onClick={handleResend}
							variant="outline"
							disabled={countdown > 0}
							className="w-full"
						>
							{countdown > 0 ? `${t("resendIn")} ${countdown}s` : t("resend")}
						</Button>
						<Button onClick={handleSkip} variant="ghost" className="w-full">
							{t("skipForNow")}
						</Button>
					</div>
				</div>
			);
		}

		// Default prompt state
		return (
			<div className="flex flex-col items-center gap-4 py-6">
				<div className="rounded-full bg-primary/10 p-3">
					<Mail className="h-12 w-12 text-primary" />
				</div>
				<div className="text-center">
					<h3 className="text-xl font-semibold">{t("promptTitle")}</h3>
					<p className="mt-2 text-muted-foreground">{t("promptSubtitle")}</p>
					{profile?.email && (
						<p className="mt-1 text-sm font-medium">{profile.email}</p>
					)}
				</div>
				{resendMutation.error && (
					<p className="text-sm text-red-500">
						{resendMutation.error instanceof Error
							? resendMutation.error.message
							: "Failed to send verification email"}
					</p>
				)}
				<div className="mt-4 flex w-full flex-col gap-2">
					<Button
						onClick={handleSendVerification}
						disabled={resendMutation.isPending}
						className="w-full"
					>
						{resendMutation.isPending && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						{resendMutation.isPending ? t("sending") : t("sendVerification")}
					</Button>
					<Button onClick={handleSkip} variant="ghost" className="w-full">
						{t("skipForNow")}
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					href="/"
					className="flex items-center gap-2 self-center font-medium"
				>
					<Image src="/Logo.png" alt="Leaply" width={120} height={40} />
				</Link>
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl">{t("title")}</CardTitle>
						<CardDescription>{t("subtitle")}</CardDescription>
					</CardHeader>
					<CardContent>{renderContent()}</CardContent>
				</Card>
				{!token && !resendMutation.isSuccess && (
					<p className="px-6 text-center text-sm text-muted-foreground">
						{t("alreadyVerified")}{" "}
						<Link
							href="/dashboard"
							className="underline underline-offset-4 hover:text-primary"
						>
							{t("continueToApp")}
						</Link>
					</p>
				)}
			</div>
		</div>
	);
}
