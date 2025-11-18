"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
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
import { useUserStore } from "@/lib/store/userStore";
import { PageTransition } from "@/components/PageTransition";

export default function LoginPage() {
	const router = useRouter();
	const { login } = useUserStore();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();

		// Mock login - no validation for demo
		const mockProfile = {
			id: "user-001",
			email,
			fullName: "John Doe",
			nationality: "United States",
			currentEducationLevel: "High School",
			gpa: 3.8,
		};

		login(mockProfile);
		router.push("/dashboard");
	};

	return (
		<PageTransition>
			<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted py-12 px-4 sm:px-6 lg:px-8">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold text-center">
							Welcome Back
						</CardTitle>
						<CardDescription className="text-center">
							Sign in to your Leaply account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleLogin} className="space-y-4">
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
							</div>

							<div className="flex items-center justify-between text-sm">
								<label className="flex items-center gap-2">
									<input type="checkbox" className="rounded-sm" />
									<span className="text-muted-foreground">Remember me</span>
								</label>
								<Link href="#" className="text-primary hover:text-accent">
									Forgot password?
								</Link>
							</div>

							<Button type="submit" className="w-full" size="lg">
								Sign In
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
							Don&apos;t have an account?{" "}
							<Link
								href="/signup"
								className="text-primary hover:text-accent font-medium"
							>
								Sign up
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</PageTransition>
	);
}
