"use client";

import { Heart, Search, SkipForward, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/lib/store/userStore";

const MAJOR_OPTIONS = [
	"Computer Science",
	"Data Science / AI",
	"Software Engineering",
	"Electrical Engineering",
	"Mechanical Engineering",
	"Civil Engineering",
	"Business Administration",
	"Finance",
	"Marketing",
	"Economics",
	"Medicine",
	"Nursing",
	"Public Health",
	"Psychology",
	"Law",
	"International Relations",
	"Communications / Media",
	"Arts & Design",
	"Architecture",
	"Education",
	"Environmental Science",
	"Biology",
	"Chemistry",
	"Physics",
	"Mathematics",
];

const PRIORITY_OPTIONS = [
	{
		id: "research",
		label: "Research opportunities",
		description: "Access to labs, research projects, and faculty",
	},
	{
		id: "campus",
		label: "Campus life",
		description: "Student activities, clubs, and social experience",
	},
	{
		id: "career",
		label: "Career prospects",
		description: "Job placement, internships, and industry connections",
	},
	{
		id: "scholarship",
		label: "Scholarship availability",
		description: "Financial aid and scholarship programs",
	},
	{
		id: "location",
		label: "Location",
		description: "City, climate, and surrounding environment",
	},
];

export default function OnboardingQuizPage() {
	const router = useRouter();
	const { updatePreferences } = useUserStore();

	const [formData, setFormData] = useState({
		desiredMajors: [] as string[],
		priorities: [] as string[],
		selfDescription: "",
	});

	const [majorSearch, setMajorSearch] = useState("");

	const filteredMajors = MAJOR_OPTIONS.filter(
		(major) =>
			major.toLowerCase().includes(majorSearch.toLowerCase()) &&
			!formData.desiredMajors.includes(major),
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Update user preferences
		updatePreferences({
			desiredMajor: formData.desiredMajors[0] || "",
			interests: formData.priorities,
		});

		// Store additional data
		localStorage.setItem(
			"onboarding_desiredMajors",
			JSON.stringify(formData.desiredMajors),
		);
		localStorage.setItem(
			"onboarding_priorities",
			JSON.stringify(formData.priorities),
		);
		localStorage.setItem(
			"onboarding_selfDescription",
			formData.selfDescription,
		);

		router.push("/onboarding/goals");
	};

	const toggleMajor = (major: string) => {
		setFormData((prev) => ({
			...prev,
			desiredMajors: prev.desiredMajors.includes(major)
				? prev.desiredMajors.filter((m) => m !== major)
				: [...prev.desiredMajors, major],
		}));
	};

	const togglePriority = (priorityId: string) => {
		setFormData((prev) => ({
			...prev,
			priorities: prev.priorities.includes(priorityId)
				? prev.priorities.filter((p) => p !== priorityId)
				: [...prev.priorities, priorityId],
		}));
	};

	const addMajorFromSearch = (major: string) => {
		if (!formData.desiredMajors.includes(major)) {
			setFormData((prev) => ({
				...prev,
				desiredMajors: [...prev.desiredMajors, major],
			}));
		}
		setMajorSearch("");
	};

	const removeMajor = (major: string) => {
		setFormData((prev) => ({
			...prev,
			desiredMajors: prev.desiredMajors.filter((m) => m !== major),
		}));
	};

	const isFormValid =
		formData.desiredMajors.length > 0 && formData.priorities.length > 0;

	const handleSkip = () => {
		router.push("/onboarding/goals");
	};

	return (
		<PageTransition>
			<div className="min-h-[calc(100vh-4rem)] bg-muted py-12">
				<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
					<Card className="shadow-lg">
						<CardHeader className="text-center pb-2">
							<Badge variant="secondary" className="w-fit mx-auto mb-4 text-xs">
								Không bắt buộc
							</Badge>
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<Heart className="w-8 h-8 text-primary" />
							</div>
							<CardTitle className="text-2xl">
								Hãy giúp Leaply hiểu bạn hơn
							</CardTitle>
							<CardDescription className="text-base">
								Cho chúng tôi biết về sở thích và điều quan trọng với bạn. Bạn
								có thể bỏ qua và điền sau.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<form onSubmit={handleSubmit} className="space-y-8">
								{/* Desired Majors - Multi-select with search */}
								<div className="space-y-3">
									<Label className="text-base font-medium">
										Ngành học mong muốn
										<span className="text-sm font-normal text-muted-foreground ml-2">
											(Chọn một hoặc nhiều)
										</span>
									</Label>

									{/* Selected majors */}
									{formData.desiredMajors.length > 0 && (
										<div className="flex flex-wrap gap-2 mb-3">
											{formData.desiredMajors.map((major) => (
												<Badge
													key={major}
													variant="secondary"
													className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 text-sm"
												>
													{major}
													<button
														type="button"
														onClick={() => removeMajor(major)}
														className="ml-2 hover:text-destructive"
													>
														<X className="w-3 h-3" />
													</button>
												</Badge>
											))}
										</div>
									)}

									{/* Search input */}
									<div className="relative">
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
										<Input
											type="text"
											placeholder="Tìm kiếm ngành học..."
											value={majorSearch}
											onChange={(e) => setMajorSearch(e.target.value)}
											className="pl-10"
										/>
									</div>

									{/* Filtered suggestions */}
									{majorSearch && (
										<div className="border border-border rounded-lg max-h-48 overflow-y-auto">
											{filteredMajors.length > 0 ? (
												filteredMajors.slice(0, 8).map((major) => (
													<button
														key={major}
														type="button"
														onClick={() => addMajorFromSearch(major)}
														className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm"
													>
														{major}
													</button>
												))
											) : (
												<p className="px-4 py-2 text-sm text-muted-foreground">
													Không tìm thấy ngành phù hợp
												</p>
											)}
										</div>
									)}

									{/* Quick select popular majors */}
									{!majorSearch && formData.desiredMajors.length === 0 && (
										<div className="flex flex-wrap gap-2">
											{MAJOR_OPTIONS.slice(0, 6).map((major) => (
												<button
													key={major}
													type="button"
													onClick={() => toggleMajor(major)}
													className="px-3 py-1.5 rounded-full border border-border text-sm hover:border-primary hover:text-primary transition-colors"
												>
													{major}
												</button>
											))}
										</div>
									)}
								</div>

								{/* Priorities */}
								<div className="space-y-4">
									<Label className="text-base font-medium">
										Điều gì quan trọng với bạn?
										<span className="text-sm font-normal text-muted-foreground ml-2">
											(Chọn tất cả áp dụng)
										</span>
									</Label>
									<div className="space-y-3">
										{PRIORITY_OPTIONS.map((priority) => (
											<label
												key={priority.id}
												htmlFor={priority.id}
												className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
													formData.priorities.includes(priority.id)
														? "border-primary bg-primary/5"
														: "border-border hover:border-primary/50"
												}`}
											>
												<Checkbox
													id={priority.id}
													checked={formData.priorities.includes(priority.id)}
													onChange={() => togglePriority(priority.id)}
													className="mt-0.5"
												/>
												<div className="flex-1">
													<span className="font-medium text-foreground">
														{priority.label}
													</span>
													<p className="text-sm text-muted-foreground mt-0.5">
														{priority.description}
													</p>
												</div>
											</label>
										))}
									</div>
								</div>

								{/* Self Description */}
								<div className="space-y-2">
									<Label
										htmlFor="selfDescription"
										className="text-base font-medium"
									>
										Một câu mô tả bản thân
										<span className="text-sm font-normal text-muted-foreground ml-2">
											(Không bắt buộc)
										</span>
									</Label>
									<Textarea
										id="selfDescription"
										placeholder="VD: Tôi thích giải quyết vấn đề thực tế bằng công nghệ"
										value={formData.selfDescription}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												selfDescription: e.target.value,
											}))
										}
										rows={3}
										className="resize-none"
									/>
									<p className="text-xs text-muted-foreground">
										Đây sẽ giúp chúng tôi hiểu bạn hơn để đưa ra gợi ý phù hợp
									</p>
								</div>

								<div className="flex justify-between gap-4 pt-6 border-t border-border">
									<Button
										type="button"
										variant="outline"
										onClick={() => router.push("/onboarding/academic")}
									>
										Quay lại
									</Button>
									<div className="flex gap-2">
										<Button
											type="button"
											variant="ghost"
											onClick={handleSkip}
											className="text-muted-foreground"
										>
											<SkipForward className="w-4 h-4 mr-2" />
											Bỏ qua
										</Button>
										<Button type="submit" disabled={!isFormValid}>
											Tiếp tục
										</Button>
									</div>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</PageTransition>
	);
}
