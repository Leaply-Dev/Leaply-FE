"use client";

import {
	DollarSign,
	Globe,
	MessageCircle,
	RotateCcw,
	Sparkles,
	Target,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export interface ProfileConfig {
	gpa: number;
	testScore: number;
	budget: number;
	region: string;
	extracurriculars: number;
}

interface University {
	name: string;
	country: string;
	fitScore: number;
	matchReasons: string[];
	rank: string;
}

interface PersonaLabProfileProps {
	onAskLeafy?: (profile: ProfileConfig) => void;
}

const regions = [
	"North America",
	"Europe",
	"Asia-Pacific",
	"UK & Ireland",
	"Any Region",
];

const extracurricularLevels = [
	{ value: 1, label: "Basic" },
	{ value: 2, label: "Moderate" },
	{ value: 3, label: "Strong" },
	{ value: 4, label: "Exceptional" },
	{ value: 5, label: "Outstanding" },
];

const DEFAULT_PROFILE: ProfileConfig = {
	gpa: 3.5,
	testScore: 1400,
	budget: 50000,
	region: "Any Region",
	extracurriculars: 3,
};

export function PersonaLabProfile({ onAskLeafy }: PersonaLabProfileProps) {
	const [profile, setProfile] = useState<ProfileConfig>(DEFAULT_PROFILE);
	const [savedProfiles, setSavedProfiles] = useState<
		{ name: string; config: ProfileConfig }[]
	>([]);

	const updateProfile = (key: keyof ProfileConfig, value: number | string) => {
		setProfile((prev) => ({ ...prev, [key]: value }));
	};

	const resetProfile = () => {
		setProfile(DEFAULT_PROFILE);
	};

	const saveProfile = () => {
		const name = `Profile ${savedProfiles.length + 1}`;
		setSavedProfiles((prev) => [...prev, { name, config: { ...profile } }]);
	};

	const loadProfile = (config: ProfileConfig) => {
		setProfile(config);
	};

	const handleAskLeafy = () => {
		onAskLeafy?.(profile);
	};

	// Calculate fit score based on profile
	const calculateFitScore = (uni: University): number => {
		let score = 80; // Base score

		// GPA impact
		if (profile.gpa >= 3.8) score += 10;
		else if (profile.gpa >= 3.5) score += 5;
		else if (profile.gpa < 3.0) score -= 10;

		// Test score impact
		if (profile.testScore >= 1500) score += 10;
		else if (profile.testScore >= 1400) score += 5;
		else if (profile.testScore < 1200) score -= 10;

		// Extracurriculars impact
		score += (profile.extracurriculars - 3) * 2;

		return Math.min(Math.max(score, 0), 100);
	};

	// Generate mock recommendations
	const generateRecommendations = (): University[] => {
		const baseUniversities: University[] = [
			{
				name: "Stanford University",
				country: "USA",
				fitScore: 0,
				matchReasons: [],
				rank: "#3 Global",
			},
			{
				name: "University of Oxford",
				country: "UK",
				fitScore: 0,
				matchReasons: [],
				rank: "#1 UK",
			},
			{
				name: "Technical University of Munich",
				country: "Germany",
				fitScore: 0,
				matchReasons: [],
				rank: "#1 Germany",
			},
			{
				name: "University of Toronto",
				country: "Canada",
				fitScore: 0,
				matchReasons: [],
				rank: "#1 Canada",
			},
			{
				name: "National University of Singapore",
				country: "Singapore",
				fitScore: 0,
				matchReasons: [],
				rank: "#1 Asia",
			},
		];

		// Filter by region
		let filtered = baseUniversities;
		if (profile.region !== "Any Region") {
			filtered = baseUniversities.filter((uni) => {
				if (profile.region === "North America")
					return ["USA", "Canada"].includes(uni.country);
				if (profile.region === "Europe")
					return ["Germany", "Netherlands", "France"].includes(uni.country);
				if (profile.region === "Asia-Pacific")
					return ["Singapore", "Australia", "Japan"].includes(uni.country);
				if (profile.region === "UK & Ireland")
					return ["UK"].includes(uni.country);
				return true;
			});
		}

		// Calculate fit scores and match reasons
		return filtered
			.map((uni) => {
				const fitScore = calculateFitScore(uni);
				const matchReasons: string[] = [];

				if (profile.region !== "Any Region" && uni.country) {
					matchReasons.push(
						`Matches your preferred region (${profile.region})`,
					);
				}

				if (profile.gpa >= 3.7) {
					matchReasons.push("Your strong GPA meets requirements");
				}

				if (profile.testScore >= 1450) {
					matchReasons.push("Test scores above average for this program");
				} else if (profile.testScore >= 1350) {
					matchReasons.push("Test scores meet requirements");
				}

				if (profile.extracurriculars >= 4) {
					matchReasons.push("Strong extracurricular profile");
				}

				if (profile.budget >= 60000) {
					matchReasons.push("Budget covers full tuition + living");
				} else if (profile.budget <= 20000 && uni.country === "Germany") {
					matchReasons.push("Low/no tuition fees fit your budget");
				}

				// Add program-specific reasons
				if (uni.name === "Stanford University") {
					matchReasons.push("Top-ranked program in your field");
				}
				if (uni.name === "Technical University of Munich") {
					matchReasons.push("Affordable tuition with excellent quality");
				}

				return {
					...uni,
					fitScore,
					matchReasons: matchReasons.slice(0, 3), // Limit to 3 reasons
				};
			})
			.sort((a, b) => b.fitScore - a.fitScore);
	};

	const recommendations = generateRecommendations();

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Profile Configuration */}
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Target className="w-5 h-5 text-primary" />
							Adjust Your Profile
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							Customize your academic profile to see matching universities
						</p>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* GPA Slider */}
						<Slider
							label="GPA"
							min={2.0}
							max={4.0}
							step={0.1}
							value={profile.gpa}
							onChange={(value) => updateProfile("gpa", value)}
							formatValue={(v) => v.toFixed(1)}
						/>

						{/* Test Score Slider (SAT) */}
						<Slider
							label="Test Score (SAT)"
							min={800}
							max={1600}
							step={10}
							value={profile.testScore}
							onChange={(value) => updateProfile("testScore", value)}
						/>

						{/* Budget Slider */}
						<Slider
							label="Annual Budget (USD)"
							min={0}
							max={100000}
							step={5000}
							value={profile.budget}
							onChange={(value) => updateProfile("budget", value)}
							formatValue={(v) => `$${(v / 1000).toFixed(0)}k`}
						/>

						{/* Region Select */}
						<div>
							<label className="text-sm font-medium text-foreground block mb-2">
								<Globe className="w-4 h-4 inline mr-1" />
								Preferred Region
							</label>
							<select
								value={profile.region}
								onChange={(e) => updateProfile("region", e.target.value)}
								className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-leaf-green text-sm"
							>
								{regions.map((region) => (
									<option key={region} value={region}>
										{region}
									</option>
								))}
							</select>
						</div>

						{/* Extracurriculars Slider */}
						<div>
							<Slider
								label="Extracurricular Strength"
								min={1}
								max={5}
								step={1}
								value={profile.extracurriculars}
								onChange={(value) => updateProfile("extracurriculars", value)}
								formatValue={(v) =>
									extracurricularLevels[v - 1]?.label || v.toString()
								}
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Leadership, competitions, research, community service, etc.
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-2 pt-4">
							<Button
								variant="outline"
								onClick={resetProfile}
								className="flex-1"
							>
								<RotateCcw className="w-4 h-4 mr-2" />
								Reset
							</Button>
							<Button onClick={saveProfile} className="flex-1">
								Save Profile
							</Button>
						</div>

						<Button
							onClick={handleAskLeafy}
							className="w-full bg-linear-to-r from-primary to-accent hover:opacity-90"
							size="lg"
						>
							<MessageCircle className="w-4 h-4 mr-2" />
							Ask Leafy About This Profile
						</Button>
					</CardContent>
				</Card>

				{/* Saved Profiles */}
				{savedProfiles.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Saved Profiles</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{savedProfiles.map((saved, index) => (
									<button
										key={index}
										onClick={() => loadProfile(saved.config)}
										className="w-full p-3 text-left border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
									>
										<div className="flex items-center justify-between">
											<span className="font-medium text-sm text-foreground">
												{saved.name}
											</span>
											<span className="text-xs text-muted-foreground">
												GPA: {saved.config.gpa.toFixed(1)} | SAT:{" "}
												{saved.config.testScore}
											</span>
										</div>
									</button>
								))}
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Recommendations */}
			<div>
				<Card className="sticky top-6">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Sparkles className="w-5 h-5 text-primary" />
							University Matches
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							Based on your profile configuration
						</p>
					</CardHeader>
					<CardContent>
						{recommendations.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<p>No universities match your current region filter.</p>
								<p className="text-sm mt-2">
									Try selecting &quot;Any Region&quot;
								</p>
							</div>
						) : (
							<div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
								{recommendations.map((uni, index) => (
									<div
										key={index}
										className="p-4 border border-border rounded-lg hover:border-primary hover:shadow-sm transition-all"
									>
										<div className="flex items-start justify-between mb-2">
											<div>
												<h4 className="font-semibold text-foreground">
													{uni.name}
												</h4>
												<p className="text-sm text-muted-foreground">
													{uni.country} • {uni.rank}
												</p>
											</div>
											<div className="text-right">
												<div className="text-2xl font-bold text-primary">
													{uni.fitScore}%
												</div>
												<div className="text-xs text-muted-foreground">
													Fit Score
												</div>
											</div>
										</div>

										<div className="space-y-1 mt-3">
											{uni.matchReasons.map((reason, idx) => (
												<div key={idx} className="flex items-start gap-2">
													<div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
													<p className="text-xs text-muted-foreground">
														{reason}
													</p>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
