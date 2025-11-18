"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

export default function OnboardingQuizPage() {
	const router = useRouter();
	const { updatePreferences } = useUserStore();

	const [formData, setFormData] = useState({
		desiredMajor: "",
		preferredRegions: [] as string[],
		budgetMin: 10000,
		budgetMax: 50000,
		campusSetting: "",
		languagesOfInstruction: [] as string[],
		interests: [] as string[],
	});

	const regions = [
		"North America",
		"Europe",
		"Asia",
		"Oceania",
		"South America",
		"Africa",
	];
	const languages = [
		"English",
		"Spanish",
		"French",
		"German",
		"Mandarin",
		"Japanese",
	];
	const interests = [
		"Research",
		"Entrepreneurship",
		"Sports",
		"Arts",
		"Community Service",
		"Technology",
	];

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Update user preferences
		updatePreferences({
			desiredMajor: formData.desiredMajor,
			preferredRegions: formData.preferredRegions,
			budgetRange: {
				min: formData.budgetMin,
				max: formData.budgetMax,
			},
			campusSetting: formData.campusSetting as "urban" | "suburban" | "rural",
			languagesOfInstruction: formData.languagesOfInstruction,
			interests: formData.interests,
		});

		router.push("/onboarding/summary");
	};

	const toggleArrayItem = (
		field: "preferredRegions" | "languagesOfInstruction" | "interests",
		value: string,
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: prev[field].includes(value)
				? prev[field].filter((item) => item !== value)
				: [...prev[field], value],
		}));
	};

	return (
		<PageTransition>
			<div className="min-h-[calc(100vh-4rem)] bg-muted py-12">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
					<OnboardingProgress
						steps={["Profile", "Preferences", "Summary"]}
						currentStep={1}
						className="mb-12"
					/>

					<Card>
						<CardHeader>
							<CardTitle>Your Preferences</CardTitle>
							<CardDescription>
								Help us understand what you&apos;re looking for in a university
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-8">
								<div className="space-y-2">
									<Label htmlFor="major">Desired Major / Field of Study</Label>
									<Input
										id="major"
										type="text"
										placeholder="e.g., Computer Science"
										value={formData.desiredMajor}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												desiredMajor: e.target.value,
											}))
										}
										required
									/>
								</div>

								<div className="space-y-3">
									<Label>Preferred Study Regions (Select all that apply)</Label>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										{regions.map((region) => (
											<Label
												htmlFor={region}
												key={region}
												className="flex items-center gap-2 cursor-pointer"
											>
												<Checkbox
													id={region}
													checked={formData.preferredRegions.includes(region)}
													onChange={() =>
														toggleArrayItem("preferredRegions", region)
													}
												/>
												<Label htmlFor={region} className="text-sm">{region}</Label>
											</Label>
										))}
									</div>
								</div>

								<div className="space-y-3">
									<Label>Annual Budget Range (Tuition + Living Costs)</Label>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label
												htmlFor="budgetMin"
												className="text-xs text-muted-foreground"
											>
												Minimum
											</Label>
											<Input
												id="budgetMin"
												type="number"
												step="1000"
												value={formData.budgetMin}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														budgetMin: parseInt(e.target.value,10),
													}))
												}
												required
											/>
										</div>
										<div>
											<Label
												htmlFor="budgetMax"
												className="text-xs text-muted-foreground"
											>
												Maximum
											</Label>
											<Input
												id="budgetMax"
												type="number"
												step="1000"
												value={formData.budgetMax}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														budgetMax: parseInt(e.target.value,10),
													}))
												}
												required
											/>
										</div>
									</div>
									<p className="text-sm text-muted-foreground">
										Current range: ${formData.budgetMin.toLocaleString()} - $
										{formData.budgetMax.toLocaleString()}
									</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="campusSetting">
										Campus Setting Preference
									</Label>
									<Select
										id="campusSetting"
										value={formData.campusSetting}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												campusSetting: e.target.value,
											}))
										}
										required
									>
										<option value="">Select preference</option>
										<option value="urban">Urban - City center location</option>
										<option value="suburban">
											Suburban - Near city but quieter
										</option>
										<option value="rural">Rural - Countryside setting</option>
									</Select>
								</div>

								<div className="space-y-3">
									<Label>Languages of Instruction</Label>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										{languages.map((language) => (
											<Label
												htmlFor={language}
												key={language}
												className="flex items-center gap-2 cursor-pointer"
											>
												<Checkbox
													id={language}
													checked={formData.languagesOfInstruction.includes(
														language,
													)}
													onChange={() =>
														toggleArrayItem("languagesOfInstruction", language)
													}
												/>
												<Label htmlFor={language} className="text-sm">{language}</Label>
											</Label>
										))}
									</div>
								</div>

								<div className="space-y-3">
									<Label>Areas of Interest</Label>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										{interests.map((interest) => (
											<Label
												htmlFor={interest}
												key={interest}
												className="flex items-center gap-2 cursor-pointer"
											>
												<Checkbox
													id={interest}
													checked={formData.interests.includes(interest)}
													onChange={() =>
														toggleArrayItem("interests", interest)
													}
												/>
												<Label htmlFor={interest} className="text-sm">{interest}</Label>
											</Label>
										))}
									</div>
								</div>

								<div className="flex justify-between gap-4 pt-6 border-t border-border">
									<Button
										type="button"
										variant="outline"
										onClick={() => router.back()}
									>
										Back
									</Button>
									<Button type="submit">Continue to Summary</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</PageTransition>
	);
}
