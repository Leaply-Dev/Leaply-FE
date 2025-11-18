"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	CheckCircle,
	GraduationCap,
	MapPin,
	DollarSign,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { useUserStore } from "@/lib/store/userStore";
import { useUniversitiesStore } from "@/lib/store/universitiesStore";
import { mockUniversities } from "@/lib/data/universities";
import {
	PageTransition,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";

export default function OnboardingSummaryPage() {
	const router = useRouter();
	const { profile, preferences, completeOnboarding } = useUserStore();
	const { setUniversities } = useUniversitiesStore();

	useEffect(() => {
		// Initialize universities on mount
		setUniversities(mockUniversities);
	}, [setUniversities]);

	// Get top 3 recommended universities based on preferences
	const recommendedUniversities = mockUniversities
		.filter((uni) => {
			if (
				preferences.preferredRegions &&
				preferences.preferredRegions.length > 0
			) {
				return preferences.preferredRegions.includes(uni.region);
			}
			return true;
		})
		.slice(0, 3);

	const handleFinish = () => {
		completeOnboarding();
		router.push("/universities");
	};

	return (
		<PageTransition>
			<div className="min-h-[calc(100vh-4rem)] bg-muted py-12">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<OnboardingProgress
						steps={["Profile", "Preferences", "Summary"]}
						currentStep={2}
						className="mb-12"
					/>

					<div className="text-center mb-12">
						<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
							<CheckCircle className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-3xl font-bold text-foreground mb-2">
							Profile Complete!
						</h1>
						<p className="text-lg text-muted-foreground">
							Based on your preferences, we&apos;ve found some great
							universities for you
						</p>
					</div>

					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Sparkles className="w-5 h-5 text-primary" />
								Your Profile Summary
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h3 className="font-semibold text-foreground mb-3">
										Academic Background
									</h3>
									<dl className="space-y-2 text-sm">
										<div>
											<dt className="text-muted-foreground">Education Level</dt>
											<dd className="font-medium">
												{profile?.currentEducationLevel}
											</dd>
										</div>
										<div>
											<dt className="text-muted-foreground">GPA</dt>
											<dd className="font-medium">{profile?.gpa}</dd>
										</div>
										<div>
											<dt className="text-muted-foreground">Nationality</dt>
											<dd className="font-medium">{profile?.nationality}</dd>
										</div>
									</dl>
								</div>
								<div>
									<h3 className="font-semibold text-foreground mb-3">
										Study Preferences
									</h3>
									<dl className="space-y-2 text-sm">
										<div>
											<dt className="text-muted-foreground">Desired Major</dt>
											<dd className="font-medium">
												{preferences.desiredMajor}
											</dd>
										</div>
										<div>
											<dt className="text-muted-foreground">Budget Range</dt>
											<dd className="font-medium">
												${preferences.budgetRange?.min.toLocaleString()} - $
												{preferences.budgetRange?.max.toLocaleString()}
											</dd>
										</div>
										<div>
											<dt className="text-muted-foreground">
												Preferred Regions
											</dt>
											<dd className="flex flex-wrap gap-1 mt-1">
												{preferences.preferredRegions?.map((region) => (
													<Badge key={region} variant="secondary">
														{region}
													</Badge>
												))}
											</dd>
										</div>
									</dl>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="mb-8">
						<h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
							<GraduationCap className="w-6 h-6 text-primary" />
							Recommended Universities
						</h2>
						<StaggerContainer>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{recommendedUniversities.map((uni) => (
									<StaggerItem key={uni.id}>
										<Card className="h-full hover:shadow-lg transition-shadow">
											<CardContent className="p-6">
												<div className="text-center mb-4">
													<div className="w-16 h-16 bg-muted rounded-full mx-auto mb-3" />
													<h3 className="font-semibold text-foreground mb-1">
														{uni.name}
													</h3>
													<div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-2">
														<MapPin className="w-3 h-3" />
														{uni.city}, {uni.country}
													</div>
													<Badge variant="outline">
														#{uni.ranking} Worldwide
													</Badge>
												</div>
												<div className="space-y-2 text-sm">
													<div className="flex items-center gap-2 text-muted-foreground">
														<DollarSign className="w-4 h-4" />$
														{uni.averageTuition.toLocaleString()}/year
													</div>
												</div>
											</CardContent>
										</Card>
									</StaggerItem>
								))}
							</div>
						</StaggerContainer>
					</div>

					<div className="flex justify-center gap-4">
						<Button variant="outline" onClick={() => router.back()}>
							Back
						</Button>
						<Button size="lg" onClick={handleFinish}>
							Explore All Universities
						</Button>
					</div>
				</div>
			</div>
		</PageTransition>
	);
}
