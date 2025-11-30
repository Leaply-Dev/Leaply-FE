"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
	Sparkles,
	Target,
	User,
	GraduationCap,
	Calendar,
	Compass,
	ArrowRight,
	Clock,
	School,
	FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageTransition, SlideUp, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { useUserStore } from "@/lib/store/userStore";
import { useUniversitiesStore } from "@/lib/store/universitiesStore";
import { useApplicationsStore } from "@/lib/store/applicationsStore";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Calculate profile completion percentage
function calculateProfileCompletion(profile: ReturnType<typeof useUserStore.getState>["profile"], preferences: ReturnType<typeof useUserStore.getState>["preferences"]): number {
	let filled = 0;
	let total = 10;

	if (profile?.fullName) filled++;
	if (profile?.email) filled++;
	if (profile?.currentEducationLevel) filled++;
	if (profile?.gpa) filled++;
	if (profile?.testScores && profile.testScores.length > 0) filled++;
	if (preferences?.desiredMajors && preferences.desiredMajors.length > 0) filled++;
	if (preferences?.targetCountries && preferences.targetCountries.length > 0) filled++;
	if (preferences?.budgetRange) filled++;
	if (preferences?.timeline) filled++;
	if (preferences?.priorities && preferences.priorities.length > 0) filled++;

	return Math.round((filled / total) * 100);
}

export default function HomePage() {
	const { t } = useTranslation();
	const router = useRouter();
	const { profile, preferences, journeyType, isAuthenticated, lastActivity } = useUserStore();
	const { savedUniversities } = useUniversitiesStore();
	const { applications } = useApplicationsStore();

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) {
		return null;
	}

	const profileCompletion = calculateProfileCompletion(profile, preferences);
	const upcomingDeadlines = applications.filter(
		(app) => app.decisionDeadline && new Date(app.decisionDeadline) > new Date()
	).length;

	// Get time of day for greeting
	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return t("home", "greeting.morning");
		if (hour < 18) return t("home", "greeting.afternoon");
		return t("home", "greeting.evening");
	};

	// Format last activity time
	const formatLastActivity = (timestamp?: number) => {
		if (!timestamp) return null;
		const diff = Date.now() - timestamp;
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return `${days} ${t("home", "daysAgo")}`;
		if (hours > 0) return `${hours} ${t("home", "hoursAgo")}`;
		if (minutes > 0) return `${minutes} ${t("home", "minutesAgo")}`;
		return t("home", "justNow");
	};

	return (
		<PageTransition>
			<div className="min-h-screen bg-background">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<SlideUp>
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-foreground mb-2">
								{getGreeting()}, {profile?.fullName?.split(" ")[0] || t("home", "you")}!
							</h1>
							<p className="text-lg text-muted-foreground">
								{t("home", "subtitle")}
							</p>
						</div>
					</SlideUp>

					{/* Suggested Next Action */}
					<SlideUp delay={0.1}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							{journeyType === "exploring" ? (
								<Card className="mb-8 bg-gradient-to-br from-primary/5 via-chart-2/5 to-transparent border-primary/20 overflow-hidden relative">
									<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
									<CardContent className="p-6 relative">
										<div className="flex items-start gap-4">
											<div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
												<Sparkles className="w-7 h-7 text-primary" />
											</div>
											<div className="flex-1">
												<Badge className="bg-primary/10 text-primary mb-2 hover:bg-primary/20">
													{t("home", "suggestedForYou")}
												</Badge>
												<h3 className="text-xl font-semibold text-foreground mb-2">
													{t("home", "startDiscovery")}
												</h3>
												<p className="text-muted-foreground mb-4">
													{t("home", "startDiscoveryDesc")}
												</p>
												<Button asChild>
													<Link href="/persona-lab">
														{t("home", "goToPersonaLab")}
														<ArrowRight className="w-4 h-4 ml-2" />
													</Link>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							) : (
								<Card className="mb-8 bg-gradient-to-br from-chart-2/5 via-primary/5 to-transparent border-chart-2/20 overflow-hidden relative">
									<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-chart-2/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
									<CardContent className="p-6 relative">
										<div className="flex items-start gap-4">
											<div className="w-14 h-14 bg-chart-2/10 rounded-2xl flex items-center justify-center shrink-0">
												<Target className="w-7 h-7 text-chart-2" />
											</div>
											<div className="flex-1">
												<Badge className="bg-chart-2/10 text-chart-2 mb-2 hover:bg-chart-2/20">
													{t("home", "suggestedForYou")}
												</Badge>
												<h3 className="text-xl font-semibold text-foreground mb-2">
													{t("home", "addFirstTarget")}
												</h3>
												<p className="text-muted-foreground mb-4">
													{t("home", "addFirstTargetDesc")}
												</p>
												<Button asChild className="bg-chart-2 hover:bg-chart-2/90">
													<Link href="/universities">
														{t("home", "exploreSchools")}
														<ArrowRight className="w-4 h-4 ml-2" />
													</Link>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							)}
						</motion.div>
					</SlideUp>

					{/* Quick Stats */}
					<SlideUp delay={0.2}>
						<StaggerContainer>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
								<StaggerItem>
									<Card className="hover:shadow-md transition-shadow">
										<CardContent className="p-5">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
													<User className="w-5 h-5 text-primary" />
												</div>
												<span className="text-sm font-medium text-muted-foreground">
													{t("home", "profile")}
												</span>
											</div>
											<div className="space-y-2">
												<div className="flex items-baseline justify-between">
													<span className="text-2xl font-bold text-foreground">
														{profileCompletion}%
													</span>
													<span className="text-xs text-muted-foreground">{t("home", "completed")}</span>
												</div>
												<Progress value={profileCompletion} className="h-2" />
											</div>
										</CardContent>
									</Card>
								</StaggerItem>

								<StaggerItem>
									<Card className="hover:shadow-md transition-shadow">
										<CardContent className="p-5">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center">
													<GraduationCap className="w-5 h-5 text-chart-2" />
												</div>
												<span className="text-sm font-medium text-muted-foreground">
													{t("home", "schoolsSaved")}
												</span>
											</div>
											<div className="flex items-baseline gap-2">
												<span className="text-2xl font-bold text-foreground">
													{savedUniversities.length}
												</span>
												<span className="text-sm text-muted-foreground">{t("home", "schools")}</span>
											</div>
										</CardContent>
									</Card>
								</StaggerItem>

								<StaggerItem>
									<Card className="hover:shadow-md transition-shadow">
										<CardContent className="p-5">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center">
													<Calendar className="w-5 h-5 text-chart-4" />
												</div>
												<span className="text-sm font-medium text-muted-foreground">
													{t("home", "upcomingDeadlines")}
												</span>
											</div>
											<div className="flex items-baseline gap-2">
												<span className="text-2xl font-bold text-foreground">
													{upcomingDeadlines}
												</span>
												<span className="text-sm text-muted-foreground">{t("home", "deadlines")}</span>
											</div>
										</CardContent>
									</Card>
								</StaggerItem>

								<StaggerItem>
									<Card className="hover:shadow-md transition-shadow">
										<CardContent className="p-5">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-chart-3/10 rounded-lg flex items-center justify-center">
													<Compass className="w-5 h-5 text-chart-3" />
												</div>
												<span className="text-sm font-medium text-muted-foreground">
													{t("home", "discovery")}
												</span>
											</div>
											<div className="flex items-baseline gap-2">
												<span className="text-2xl font-bold text-foreground">0</span>
												<span className="text-sm text-muted-foreground">/ 4 {t("home", "tracks")}</span>
											</div>
										</CardContent>
									</Card>
								</StaggerItem>
							</div>
						</StaggerContainer>
					</SlideUp>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Your Schools */}
						<div className="lg:col-span-2">
							<SlideUp delay={0.3}>
								<Card>
									<CardHeader className="flex flex-row items-center justify-between pb-2">
										<CardTitle className="text-lg flex items-center gap-2">
											<School className="w-5 h-5 text-muted-foreground" />
											{t("home", "yourSchools")}
										</CardTitle>
										<Button variant="ghost" size="sm" asChild>
											<Link href="/dashboard/applications">
												{t("home", "viewAll")}
												<ArrowRight className="w-4 h-4 ml-1" />
											</Link>
										</Button>
									</CardHeader>
									<CardContent>
										{savedUniversities.length > 0 ? (
											<div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
												{savedUniversities.slice(0, 4).map((uni) => (
													<Card
														key={uni}
														className="min-w-[200px] shrink-0 hover:shadow-md transition-shadow cursor-pointer"
													>
														<CardContent className="p-4">
															<div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-3">
																<GraduationCap className="w-5 h-5 text-muted-foreground" />
															</div>
															<h4 className="font-medium text-sm text-foreground truncate">
																University #{uni}
															</h4>
															<p className="text-xs text-muted-foreground">{t("home", "saved")}</p>
														</CardContent>
													</Card>
												))}
											</div>
										) : (
											<div className="text-center py-8">
												<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
													<GraduationCap className="w-8 h-8 text-muted-foreground" />
												</div>
												<p className="text-muted-foreground mb-4">
													{t("home", "noSchoolsSaved")}
												</p>
												<Button variant="outline" size="sm" asChild>
													<Link href="/universities">{t("home", "exploreSchools")}</Link>
												</Button>
											</div>
										)}
									</CardContent>
								</Card>
							</SlideUp>
						</div>

						{/* Continue Where You Left */}
						<div>
							<SlideUp delay={0.4}>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-lg flex items-center gap-2">
											<Clock className="w-5 h-5 text-muted-foreground" />
											{t("home", "continueWhereYouLeft")}
										</CardTitle>
									</CardHeader>
									<CardContent>
										{lastActivity ? (
											<div className="space-y-4">
												<div className="p-4 bg-muted/50 rounded-lg">
													<div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
														<Clock className="w-3 h-3" />
														{formatLastActivity(lastActivity.timestamp)}
													</div>
													<p className="font-medium text-foreground mb-1">
														{lastActivity.title}
													</p>
													<p className="text-sm text-muted-foreground">
														{lastActivity.type}
													</p>
												</div>
												<Button className="w-full" asChild>
													<Link href={lastActivity.path}>
														{t("home", "continueWhereYouLeft")}
														<ArrowRight className="w-4 h-4 ml-2" />
													</Link>
												</Button>
											</div>
										) : (
											<div className="text-center py-6">
												<div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
													<FileText className="w-6 h-6 text-muted-foreground" />
												</div>
												<p className="text-sm text-muted-foreground">
													{t("home", "startYourJourney")}
												</p>
											</div>
										)}
									</CardContent>
								</Card>
							</SlideUp>

							{/* Quick Actions */}
							<SlideUp delay={0.5}>
								<Card className="mt-6">
									<CardHeader className="pb-2">
										<CardTitle className="text-lg">{t("home", "quickActions")}</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<Button
											variant="outline"
											className="w-full justify-start"
											asChild
										>
											<Link href="/persona-lab">
												<Sparkles className="w-4 h-4 mr-2 text-primary" />
												Persona Lab
											</Link>
										</Button>
										<Button
											variant="outline"
											className="w-full justify-start"
											asChild
										>
											<Link href="/universities">
												<GraduationCap className="w-4 h-4 mr-2 text-chart-2" />
												{t("home", "exploreSchools")}
											</Link>
										</Button>
										<Button
											variant="outline"
											className="w-full justify-start"
											asChild
										>
											<Link href="/dashboard/profile">
												<User className="w-4 h-4 mr-2 text-chart-4" />
												{t("home", "updateProfile")}
											</Link>
										</Button>
									</CardContent>
								</Card>
							</SlideUp>
						</div>
					</div>
				</div>
			</div>
		</PageTransition>
	);
}

