"use client";

import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
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
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services/auth";

type ForgotState = "form" | "sending" | "sent";

export default function ForgotPasswordPage() {
	const t = useTranslations("auth.forgotPassword");

	const [state, setState] = useState<ForgotState>("form");
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setState("sending");
		setError(null);

		try {
			await authService.forgotPassword(email);
			setState("sent");
		} catch (err) {
			// Always show success to prevent email enumeration
			// The API also returns success regardless
			setState("sent");
		}
	};

	const handleTryAgain = () => {
		setState("form");
		setEmail("");
	};

	const renderContent = () => {
		switch (state) {
			case "sending":
				return (
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">{t("email")}</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder={t("emailPlaceholder")}
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled
								/>
							</Field>
							<Field>
								<Button type="submit" disabled className="w-full">
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t("sending")}
								</Button>
							</Field>
						</FieldGroup>
					</form>
				);

			case "sent":
				return (
					<div className="flex flex-col items-center gap-4 py-6">
						<div className="rounded-full bg-green-100 p-3">
							<CheckCircle2 className="h-12 w-12 text-green-600" />
						</div>
						<div className="text-center">
							<h3 className="text-xl font-semibold text-green-600">{t("emailSent")}</h3>
							<p className="mt-2 text-muted-foreground">{t("emailSentMessage")}</p>
							<p className="mt-2 text-sm text-muted-foreground">{t("checkSpam")}</p>
						</div>
						<div className="mt-4 flex w-full flex-col gap-2">
							<Button onClick={handleTryAgain} variant="outline" className="w-full">
								{t("tryAgain")}
							</Button>
							<Link href="/login">
								<Button variant="ghost" className="w-full">
									<ArrowLeft className="mr-2 h-4 w-4" />
									{t("backToLogin")}
								</Button>
							</Link>
						</div>
					</div>
				);

			case "form":
			default:
				return (
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<div className="flex justify-center pb-4">
								<div className="rounded-full bg-primary/10 p-3">
									<Mail className="h-8 w-8 text-primary" />
								</div>
							</div>

							{error && (
								<p className="text-center text-sm text-red-500">{error}</p>
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
								/>
							</Field>
							<Field>
								<Button type="submit" className="w-full">
									{t("sendLink")}
								</Button>
							</Field>
							<Field>
								<Link href="/login">
									<Button variant="ghost" className="w-full">
										<ArrowLeft className="mr-2 h-4 w-4" />
										{t("backToLogin")}
									</Button>
								</Link>
							</Field>
						</FieldGroup>
					</form>
				);
		}
	};

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
