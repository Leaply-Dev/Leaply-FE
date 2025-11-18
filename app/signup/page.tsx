"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserStore } from "@/lib/store/userStore";
import { PageTransition } from "@/components/PageTransition";

export default function SignupPage() {
	const router = useRouter();
	const { login } = useUserStore();
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [agreeToTerms, setAgreeToTerms] = useState(false);

	const handleSignup = (e: React.FormEvent) => {
		e.preventDefault();

		// Mock signup - no validation for demo
		const mockProfile = {
			id: `user-${Date.now()}`,
			email,
			fullName,
		};

		login(mockProfile);
		router.push("/onboarding");
	};

	return (
		<PageTransition>
			<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted py-12 px-4 sm:px-6 lg:px-8">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold text-center">
							Create Your Account
						</CardTitle>
						<CardDescription className="text-center">
							Start your journey to global education
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSignup} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="fullName">Full Name</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										id="fullName"
										type="text"
										placeholder="John Doe"
										value={fullName}
										onChange={(e) => setFullName(e.target.value)}
										className="pl-10"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										id="email"
										type="email"
										placeholder="you@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="pl-10"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										id="password"
										type="password"
										placeholder="••••••••"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="pl-10"
										required
									/>
								</div>
								<p className="text-xs text-muted-foreground">
									Must be at least 8 characters
								</p>
							</div>

							<div className="flex items-start gap-2">
								<Checkbox
									id="terms"
									checked={agreeToTerms}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgreeToTerms(e.target.checked)}
									required
								/>
								<label
									htmlFor="terms"
									className="text-sm text-muted-foreground"
								>
									I agree to the{" "}
									<Link href="#" className="text-primary hover:text-accent">
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link href="#" className="text-primary hover:text-accent">
										Privacy Policy
									</Link>
								</label>
							</div>

							<Button type="submit" className="w-full" size="lg">
								Create Account
							</Button>

							<div className="relative my-6">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-border"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="bg-card px-4 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<Button type="button" variant="outline" className="w-full">
									Google
								</Button>
								<Button type="button" variant="outline" className="w-full">
									Facebook
								</Button>
							</div>
						</form>

						<p className="text-center text-sm text-muted-foreground mt-6">
							Already have an account?{" "}
							<Link
								href="/login"
								className="text-primary hover:text-accent font-medium"
							>
								Sign in
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</PageTransition>
	);
}
