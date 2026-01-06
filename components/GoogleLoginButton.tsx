"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface GoogleLoginButtonProps {
	variant?: "login" | "register";
	className?: string;
}

export function GoogleLoginButton({
	variant = "login",
	className,
}: GoogleLoginButtonProps) {
	const t = useTranslations("auth");
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleLogin = async () => {
		setIsLoading(true);

		try {
			const response = await fetch(`${API_URL}/oauth/google/url`, {
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to get OAuth URL");
			}

			const data = await response.json();

			if (data.success && data.data?.url) {
				// Redirect to Google OAuth
				window.location.href = data.data.url;
			} else {
				throw new Error(data.message || "Failed to get OAuth URL");
			}
		} catch (error) {
			console.error("Google OAuth error:", error);
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant="outline"
			type="button"
			disabled={isLoading}
			onClick={handleGoogleLogin}
			className={className}
		>
			{isLoading ? (
				<Loader2 className="mr-2 h-4 w-4 animate-spin" />
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					className="mr-2 h-4 w-4"
					aria-hidden="true"
				>
					<title>Google</title>
					<path
						d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
						fill="currentColor"
					/>
				</svg>
			)}
			{variant === "login" ? t("loginWithGoogle") : t("registerWithGoogle")}
		</Button>
	);
}
