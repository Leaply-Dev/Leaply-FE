"use client";

import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const { t } = useTranslation();

	return (
		<form className={cn("flex flex-col gap-6", className)} {...props}>
			<FieldGroup>
				<div className="flex flex-col items-center gap-1 text-center">
					<h1 className="text-2xl font-bold">{t("auth", "signupTitle")}</h1>
					<p className="text-muted-foreground text-sm text-balance">
						{t("auth", "signupSubtitle")}
					</p>
					<p className="text-muted-foreground text-sm mt-2">
						{t("auth", "alreadyHaveAccount")}{" "}
						<a href="/login" className="text-primary hover:underline">
							{t("auth", "login")}
						</a>
					</p>
				</div>
				<Field>
					<FieldLabel htmlFor="name">{t("auth", "fullName")}</FieldLabel>
					<Input
						id="name"
						type="text"
						placeholder={t("auth", "fullNamePlaceholder")}
						required
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="email">{t("auth", "email")}</FieldLabel>
					<Input
						id="email"
						type="email"
						placeholder={t("auth", "emailPlaceholder")}
						required
					/>
					<FieldDescription>{t("auth", "emailDescription")}</FieldDescription>
				</Field>
				<Field>
					<FieldLabel htmlFor="password">{t("auth", "password")}</FieldLabel>
					<Input id="password" type="password" required />
					<FieldDescription>
						{t("auth", "passwordDescription")}
					</FieldDescription>
				</Field>
				<Field>
					<FieldLabel htmlFor="confirm-password">
						{t("auth", "confirmPassword")}
					</FieldLabel>
					<Input id="confirm-password" type="password" required />
					<FieldDescription>
						{t("auth", "confirmPasswordDescription")}
					</FieldDescription>
				</Field>
				<Field>
					<Button type="submit">{t("auth", "createAccount")}</Button>
					<FieldDescription className="text-center">
						{t("auth", "tosAgreement")}{" "}
						<a href="/terms" className="text-primary hover:underline">
							{t("auth", "tos")}
						</a>{" "}
						{t("auth", "and")}{" "}
						<a href="/privacy" className="text-primary hover:underline">
							{t("auth", "privacyPolicy")}
						</a>
					</FieldDescription>
				</Field>
				<FieldSeparator>{t("auth", "orContinueWith")}</FieldSeparator>
				<Field>
					<Button variant="outline" type="button">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<title>GitHub</title>
							<path
								d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
								fill="currentColor"
							/>
						</svg>
						{t("auth", "signupWithGithub")}
					</Button>
				</Field>
			</FieldGroup>
		</form>
	);
}
