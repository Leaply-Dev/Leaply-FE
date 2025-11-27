"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Award, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { useUserStore } from "@/lib/store/userStore";
import { PageTransition } from "@/components/PageTransition";

const ONBOARDING_STEPS = [
	"Basic Info",
	"Academic",
	"Interests",
	"Goals",
	"Journey",
];

const MAJOR_OPTIONS = [
	"Computer Science",
	"Engineering",
	"Business Administration",
	"Economics",
	"Medicine / Health Sciences",
	"Law",
	"Arts & Design",
	"Social Sciences",
	"Natural Sciences",
	"Education",
	"Communications / Media",
	"Other",
];

export default function AcademicProfilePage() {
	const router = useRouter();
	const { updateProfile } = useUserStore();

	const [formData, setFormData] = useState({
		gpa: "",
		gpaScale: "4.0",
		currentMajor: "",
		englishTestType: "",
		englishTestScore: "",
		standardizedTestType: "",
		standardizedTestScore: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Build test scores array
		const testScores: { type: string; score: string }[] = [];
		
		if (formData.englishTestType && formData.englishTestScore) {
			testScores.push({
				type: formData.englishTestType,
				score: formData.englishTestScore,
			});
		}
		
		if (formData.standardizedTestType && formData.standardizedTestScore) {
			testScores.push({
				type: formData.standardizedTestType,
				score: formData.standardizedTestScore,
			});
		}

		// Update user profile with academic info
		updateProfile({
			gpa: parseFloat(formData.gpa) || 0,
			testScores: testScores.length > 0 ? testScores : undefined,
		});

		// Store current major in localStorage for now
		localStorage.setItem("onboarding_currentMajor", formData.currentMajor);
		localStorage.setItem("onboarding_gpaScale", formData.gpaScale);

		router.push("/onboarding/quiz");
	};

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const isFormValid = formData.gpa && formData.currentMajor;

	return (
		<PageTransition>
			<div className="min-h-[calc(100vh-4rem)] bg-muted py-12">
				<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
					<OnboardingProgress
						steps={ONBOARDING_STEPS}
						currentStep={1}
						className="mb-12"
					/>

					<Card className="shadow-lg">
						<CardHeader className="text-center pb-2">
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<BookOpen className="w-8 h-8 text-primary" />
							</div>
							<CardTitle className="text-2xl">Hồ sơ học thuật</CardTitle>
							<CardDescription className="text-base">
								Cho chúng tôi biết về thành tích học tập của bạn
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* GPA */}
								<div className="space-y-4">
									<Label className="flex items-center gap-2 text-base font-medium">
										<Award className="w-4 h-4 text-primary" />
										Điểm trung bình (GPA)
									</Label>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="gpa" className="text-sm text-muted-foreground">
												Điểm GPA
											</Label>
											<Input
												id="gpa"
												type="number"
												step="0.01"
												min="0"
												max={formData.gpaScale === "4.0" ? "4" : "10"}
												placeholder={formData.gpaScale === "4.0" ? "3.5" : "8.5"}
												value={formData.gpa}
												onChange={(e) => updateField("gpa", e.target.value)}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="gpaScale" className="text-sm text-muted-foreground">
												Thang điểm
											</Label>
											<Select
												id="gpaScale"
												value={formData.gpaScale}
												onChange={(e) => updateField("gpaScale", e.target.value)}
											>
												<option value="4.0">Thang 4.0</option>
												<option value="10">Thang 10</option>
											</Select>
										</div>
									</div>
								</div>

								{/* Current Major */}
								<div className="space-y-2">
									<Label htmlFor="currentMajor" className="flex items-center gap-2">
										<GraduationCap className="w-4 h-4 text-muted-foreground" />
										Ngành học hiện tại / Đã tốt nghiệp
									</Label>
									<Select
										id="currentMajor"
										value={formData.currentMajor}
										onChange={(e) => updateField("currentMajor", e.target.value)}
										required
									>
										<option value="">Chọn ngành học</option>
										{MAJOR_OPTIONS.map((major) => (
											<option key={major} value={major}>
												{major}
											</option>
										))}
									</Select>
								</div>

								{/* Test Scores Section */}
								<div className="space-y-4 pt-4 border-t border-border">
									<h3 className="text-base font-medium text-foreground flex items-center gap-2">
										<Award className="w-4 h-4 text-primary" />
										Điểm thi chuẩn hóa
										<span className="text-sm font-normal text-muted-foreground">(Không bắt buộc)</span>
									</h3>

									{/* English Proficiency */}
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="englishTestType" className="text-sm text-muted-foreground">
												Chứng chỉ tiếng Anh
											</Label>
											<Select
												id="englishTestType"
												value={formData.englishTestType}
												onChange={(e) => updateField("englishTestType", e.target.value)}
											>
												<option value="">Chọn loại</option>
												<option value="IELTS">IELTS</option>
												<option value="TOEFL">TOEFL iBT</option>
												<option value="Duolingo">Duolingo English Test</option>
												<option value="PTE">PTE Academic</option>
											</Select>
										</div>
										<div className="space-y-2">
											<Label htmlFor="englishTestScore" className="text-sm text-muted-foreground">
												Điểm
											</Label>
											<Input
												id="englishTestScore"
												type="text"
												placeholder={
													formData.englishTestType === "IELTS" ? "7.5" :
													formData.englishTestType === "TOEFL" ? "100" :
													formData.englishTestType === "Duolingo" ? "120" :
													"Nhập điểm"
												}
												value={formData.englishTestScore}
												onChange={(e) => updateField("englishTestScore", e.target.value)}
												disabled={!formData.englishTestType}
											/>
										</div>
									</div>

									{/* Standardized Tests */}
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="standardizedTestType" className="text-sm text-muted-foreground">
												Bài thi chuẩn hóa
											</Label>
											<Select
												id="standardizedTestType"
												value={formData.standardizedTestType}
												onChange={(e) => updateField("standardizedTestType", e.target.value)}
											>
												<option value="">Chọn loại</option>
												<option value="SAT">SAT</option>
												<option value="ACT">ACT</option>
												<option value="GRE">GRE</option>
												<option value="GMAT">GMAT</option>
											</Select>
										</div>
										<div className="space-y-2">
											<Label htmlFor="standardizedTestScore" className="text-sm text-muted-foreground">
												Điểm
											</Label>
											<Input
												id="standardizedTestScore"
												type="text"
												placeholder={
													formData.standardizedTestType === "SAT" ? "1450" :
													formData.standardizedTestType === "ACT" ? "32" :
													formData.standardizedTestType === "GRE" ? "320" :
													formData.standardizedTestType === "GMAT" ? "700" :
													"Nhập điểm"
												}
												value={formData.standardizedTestScore}
												onChange={(e) => updateField("standardizedTestScore", e.target.value)}
												disabled={!formData.standardizedTestType}
											/>
										</div>
									</div>
								</div>

								<div className="flex justify-between gap-4 pt-6 border-t border-border">
									<Button
										type="button"
										variant="outline"
										onClick={() => router.push("/onboarding")}
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

