"use client";

import { GraduationCap, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useUserStore } from "@/lib/store/userStore";

const ONBOARDING_STEPS = ["Thông tin cơ bản", "Hành trình"];

export default function OnboardingPage() {
	const router = useRouter();
	const { profile, updateProfile } = useUserStore();

	const [formData, setFormData] = useState({
		fullName: profile?.fullName || "",
		email: profile?.email || "",
		currentEducationLevel: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Update user profile with basic info
		updateProfile({
			fullName: formData.fullName,
			email: formData.email,
			currentEducationLevel: formData.currentEducationLevel,
		});

		// Go directly to journey selection
		router.push("/onboarding/journey");
	};

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const isFormValid =
		formData.fullName.trim() &&
		formData.email.trim() &&
		formData.currentEducationLevel;

	return (
		<PageTransition>
			<div className="min-h-[calc(100vh-4rem)] bg-muted py-12">
				<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
					<OnboardingProgress
						steps={ONBOARDING_STEPS}
						currentStep={0}
						className="mb-12"
					/>

					<Card className="shadow-lg">
						<CardHeader className="text-center pb-2">
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<User className="w-8 h-8 text-primary" />
							</div>
							<CardTitle className="text-2xl">
								Chào mừng bạn đến Leaply!
							</CardTitle>
							<CardDescription className="text-base">
								Hãy bắt đầu với một số thông tin cơ bản về bạn
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Name and Email */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<Label htmlFor="fullName">Họ và tên</Label>
										<Input
											id="fullName"
											type="text"
											placeholder="Nguyễn Văn A"
											value={formData.fullName}
											onChange={(e) => updateField("fullName", e.target.value)}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="email@example.com"
											value={formData.email}
											onChange={(e) => updateField("email", e.target.value)}
											required
										/>
									</div>
								</div>

								{/* Education Level */}
								<div className="space-y-2">
									<Label
										htmlFor="educationLevel"
										className="flex items-center gap-2"
									>
										<GraduationCap className="w-4 h-4 text-muted-foreground" />
										Trình độ học vấn hiện tại
									</Label>
									<Select
										id="educationLevel"
										value={formData.currentEducationLevel}
										onChange={(e) =>
											updateField("currentEducationLevel", e.target.value)
										}
										required
									>
										<option value="">Chọn trình độ</option>
										<option value="High School">
											Trung học phổ thông (High School)
										</option>
										<option value="Undergraduate">
											Đại học (Undergraduate)
										</option>
										<option value="Graduate">Sau đại học (Graduate)</option>
									</Select>
								</div>

								<div className="flex justify-end gap-4 pt-6 border-t border-border">
									<Button
										type="button"
										variant="outline"
										onClick={() => router.push("/getting-started")}
									>
										Quay lại
									</Button>
									<Button type="submit" disabled={!isFormValid}>
										Tiếp tục
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</PageTransition>
	);
}
