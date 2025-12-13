"use client";

import { Calendar, Globe, SkipForward, Target, Wallet } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useUserStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";

const COUNTRY_OPTIONS = [
	{ id: "US", label: "United States", flag: "🇺🇸" },
	{ id: "UK", label: "United Kingdom", flag: "🇬🇧" },
	{ id: "Canada", label: "Canada", flag: "🇨🇦" },
	{ id: "Australia", label: "Australia", flag: "🇦🇺" },
	{ id: "EU", label: "European Union", flag: "🇪🇺" },
	{ id: "Asia", label: "Asia", flag: "🌏" },
];

const BUDGET_OPTIONS = [
	{
		value: "under-20k",
		label: "Dưới $20,000/năm",
		description: "Tìm trường có học phí thấp hoặc học bổng toàn phần",
	},
	{
		value: "20k-40k",
		label: "$20,000 - $40,000/năm",
		description: "Trường công lập hoặc có học bổng bán phần",
	},
	{
		value: "40k-60k",
		label: "$40,000 - $60,000/năm",
		description: "Đa số trường tư thục và các chương trình top",
	},
	{
		value: "over-60k",
		label: "Trên $60,000/năm",
		description: "Các trường top có chi phí cao nhất",
	},
	{
		value: "flexible",
		label: "Linh hoạt / Chưa xác định",
		description: "Tôi sẽ quyết định sau",
	},
];

// Generate timeline options dynamically
const generateTimelineOptions = () => {
	const options = [];
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();

	for (let year = currentYear; year <= currentYear + 3; year++) {
		if (year === currentYear && currentMonth >= 8) {
			// If we're past August, skip Fall of current year
			options.push({
				value: `spring-${year + 1}`,
				label: `Spring ${year + 1}`,
			});
		} else if (year === currentYear) {
			options.push({ value: `fall-${year}`, label: `Fall ${year}` });
			options.push({
				value: `spring-${year + 1}`,
				label: `Spring ${year + 1}`,
			});
		} else {
			options.push({ value: `fall-${year}`, label: `Fall ${year}` });
			options.push({
				value: `spring-${year + 1}`,
				label: `Spring ${year + 1}`,
			});
		}
	}

	return options.slice(0, 6); // Limit to 6 options
};

const TIMELINE_OPTIONS = generateTimelineOptions();

export default function GoalsPage() {
	const router = useRouter();
	const { updatePreferences } = useUserStore();

	const [formData, setFormData] = useState({
		targetCountries: [] as string[],
		budgetRange: "",
		timeline: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Map budget to min/max values
		const budgetMap: Record<string, { min: number; max: number }> = {
			"under-20k": { min: 0, max: 20000 },
			"20k-40k": { min: 20000, max: 40000 },
			"40k-60k": { min: 40000, max: 60000 },
			"over-60k": { min: 60000, max: 150000 },
			flexible: { min: 0, max: 150000 },
		};

		// Update user preferences
		updatePreferences({
			preferredRegions: formData.targetCountries,
			budgetRange: budgetMap[formData.budgetRange] || { min: 0, max: 150000 },
		});

		// Store timeline in localStorage
		localStorage.setItem("onboarding_timeline", formData.timeline);
		localStorage.setItem("onboarding_budgetRange", formData.budgetRange);

		router.push("/home");
	};

	const toggleCountry = (countryId: string) => {
		setFormData((prev) => ({
			...prev,
			targetCountries: prev.targetCountries.includes(countryId)
				? prev.targetCountries.filter((c) => c !== countryId)
				: [...prev.targetCountries, countryId],
		}));
	};

	const isFormValid =
		formData.targetCountries.length > 0 &&
		formData.budgetRange &&
		formData.timeline;

	const handleSkip = () => {
		router.push("/home");
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
								<Target className="w-8 h-8 text-primary" />
							</div>
							<CardTitle className="text-2xl">
								Mục tiêu du học của bạn
							</CardTitle>
							<CardDescription className="text-base">
								Cho chúng tôi biết bạn muốn đi đâu và khi nào. Bạn có thể bỏ qua
								và điền sau.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<form onSubmit={handleSubmit} className="space-y-8">
								{/* Target Countries */}
								<div className="space-y-4">
									<Label className="text-base font-medium flex items-center gap-2">
										<Globe className="w-4 h-4 text-primary" />
										Quốc gia mục tiêu
										<span className="text-sm font-normal text-muted-foreground">
											(Chọn một hoặc nhiều)
										</span>
									</Label>
									<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
										{COUNTRY_OPTIONS.map((country) => (
											<button
												key={country.id}
												type="button"
												onClick={() => toggleCountry(country.id)}
												className={cn(
													"flex items-center gap-2 p-3 rounded-lg border text-left transition-all",
													formData.targetCountries.includes(country.id)
														? "border-primary bg-primary/5 ring-1 ring-primary"
														: "border-border hover:border-primary/50",
												)}
											>
												<span className="text-2xl">{country.flag}</span>
												<span className="text-sm font-medium">
													{country.label}
												</span>
											</button>
										))}
									</div>
								</div>

								{/* Budget Range */}
								<div className="space-y-4">
									<Label className="text-base font-medium flex items-center gap-2">
										<Wallet className="w-4 h-4 text-primary" />
										Ngân sách hàng năm
										<span className="text-sm font-normal text-muted-foreground">
											(Học phí + sinh hoạt)
										</span>
									</Label>
									<div className="space-y-2">
										{BUDGET_OPTIONS.map((budget) => (
											<button
												key={budget.value}
												type="button"
												onClick={() =>
													setFormData((prev) => ({
														...prev,
														budgetRange: budget.value,
													}))
												}
												className={cn(
													"w-full flex flex-col items-start p-4 rounded-lg border text-left transition-all",
													formData.budgetRange === budget.value
														? "border-primary bg-primary/5 ring-1 ring-primary"
														: "border-border hover:border-primary/50",
												)}
											>
												<span className="font-medium text-foreground">
													{budget.label}
												</span>
												<span className="text-sm text-muted-foreground">
													{budget.description}
												</span>
											</button>
										))}
									</div>
								</div>

								{/* Timeline */}
								<div className="space-y-3">
									<Label
										htmlFor="timeline"
										className="text-base font-medium flex items-center gap-2"
									>
										<Calendar className="w-4 h-4 text-primary" />
										Khi nào bạn muốn bắt đầu học?
									</Label>
									<Select
										id="timeline"
										value={formData.timeline}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												timeline: e.target.value,
											}))
										}
										required
										className="w-full"
									>
										<option value="">Chọn kỳ nhập học</option>
										{TIMELINE_OPTIONS.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</Select>
									<p className="text-sm text-muted-foreground">
										Thông tin này giúp chúng tôi gợi ý deadline phù hợp
									</p>
								</div>

								<div className="flex justify-between gap-4 pt-6 border-t border-border">
									<Button
										type="button"
										variant="outline"
										onClick={() => router.push("/onboarding/quiz")}
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
											Hoàn thành
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
