"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services/auth";
import { useUserStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
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
			setError("Passwords do not match");
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
					<CardTitle className="text-xl">Create your account</CardTitle>
					<CardDescription>Create your account with Google</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<Button variant="outline" type="button" disabled={isLoading}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<title>Google</title>
										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									Register with Google
								</Button>
							</Field>
							<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
								Or continue with
							</FieldSeparator>

							{error && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Error</AlertTitle>
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<Field>
								<FieldLabel htmlFor="fullName">Full Name</FieldLabel>
								<Input
									id="fullName"
									type="text"
									placeholder="John Doe"
									required
									value={formData.fullName}
									onChange={handleChange}
									disabled={isLoading}
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									value={formData.email}
									onChange={handleChange}
									disabled={isLoading}
								/>
							</Field>
							<Field>
								<Field className="grid grid-cols-2 gap-4">
									<Field>
										<FieldLabel htmlFor="password">Password</FieldLabel>
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
											Confirm Password
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
								<FieldDescription>
									Must be at least 8 characters long.
								</FieldDescription>
							</Field>
							<Field>
								<Button type="submit" disabled={isLoading}>
									{isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{isLoading ? "Creating Account..." : "Create Account"}
								</Button>
								<FieldDescription className="text-center">
									Already have an account? <Link href="/login">Sign in</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our{" "}
				<Link href="/terms">Terms of Service</Link> and{" "}
				<Link href="/privacy">Privacy Policy</Link>.
			</FieldDescription>
		</div>
	);
}
