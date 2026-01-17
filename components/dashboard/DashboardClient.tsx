"use client";

import { m } from "framer-motion";
import {
	AlertCircle,
	ArrowRight,
	Calendar,
	Compass,
	FolderOpen,
	GraduationCap,
	School,
	Sparkles,
	Target,
	User,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
	PageTransition,
	SlideUp,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import { useGetCoverage } from "@/lib/generated/api/endpoints/persona-lab/persona-lab";
import type {
	CoverageMetrics,
	HomeResponse,
	RecentApplicationDto,
	UpcomingDeadlineDto,
} from "@/lib/generated/api/models";
import { useHomeData } from "@/lib/hooks/useHomeData";
import { useUserStore } from "@/lib/store/userStore";

// Coverage category info for display
const COVERAGE_CATEGORIES = [
	{ key: "goals", label: "Goals", color: "bg-primary" },
	{ key: "evidence", label: "Evidence", color: "bg-chart-2" },
	{ key: "skills", label: "Skills", color: "bg-chart-3" },
	{ key: "values", label: "Values", color: "bg-chart-4" },
	{ key: "tensions", label: "Tensions", color: "bg-chart-5" },
] as const;

// Deadline urgency thresholds
const URGENT_DAYS = 7;
const WARNING_DAYS = 30;

function getDeadlineUrgency(daysRemaining: number | undefined): {
	color: string;
	bgColor: string;
} {
	if (daysRemaining === undefined)
		return { color: "text-muted-foreground", bgColor: "bg-muted" };
	if (daysRemaining <= URGENT_DAYS)
		return { color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950/30" };
	if (daysRemaining <= WARNING_DAYS)
		return {
			color: "text-amber-600",
			bgColor: "bg-amber-50 dark:bg-amber-950/30",
		};
	return { color: "text-muted-foreground", bgColor: "bg-muted/50" };
}

export function DashboardClient() {
	const tHome = useTranslations("home");
	const { profile } = useUserStore();
	const { data: homeData, isLoading } = useHomeData();

	// Fetch persona coverage metrics for enhanced progress display
	const { data: coverageData, isLoading: isCoverageLoading } = useGetCoverage();

	// Time-dependent state - computed only on client to prevent hydration mismatch
	const [greeting, setGreeting] = useState<string>("");

	// Compute greeting on client only (prevents hydration mismatch from server/client time difference)
	useEffect(() => {
		const hour = new Date().getHours();
		if (hour < 12) {
			setGreeting(tHome("greeting.morning"));
		} else if (hour < 18) {
			setGreeting(tHome("greeting.afternoon"));
		} else {
			setGreeting(tHome("greeting.evening"));
		}
	}, [tHome]);

	// Memoize derived values from homeData to prevent unnecessary recalculations
	const dashboardData = useMemo(() => {
		const data = unwrapResponse<HomeResponse>(homeData);
		if (!data) {
			return {
				profileCompletion: 0,
				upcomingDeadlines: [] as UpcomingDeadlineDto[],
				applicationsCount: 0,
				submittedApplications: 0,
				suggestedAction: null,
				recentApplications: [] as RecentApplicationDto[],
				firstName: null,
			};
		}

		return {
			profileCompletion: data.profileCompletion ?? 0,
			upcomingDeadlines: data.upcomingDeadlines ?? [],
			applicationsCount: data.applications?.total ?? 0,
			submittedApplications: data.applications?.byStatus?.submitted ?? 0,
			suggestedAction: data.suggestedAction,
			recentApplications: data.recentApplications ?? [],
			firstName: data.firstName,
		};
	}, [homeData]);

	// Extract coverage metrics
	const coverage = useMemo(() => {
		if (!coverageData) return null;
		// Handle the API response structure
		const response = coverageData as {
			data?: CoverageMetrics;
			status?: number;
		};
		if (response?.data && response.status === 200) {
			return response.data;
		}
		return null;
	}, [coverageData]);

	const {
		profileCompletion,
		upcomingDeadlines,
		applicationsCount,
		submittedApplications,
		suggestedAction,
		recentApplications,
		firstName,
	} = dashboardData;

	// Compute contextual quick actions based on user state
	const quickActions = useMemo(() => {
		const actions: Array<{
			href: string;
			icon: typeof Sparkles;
			label: string;
			color: string;
		}> = [];

		// Priority 1: If profile incomplete, suggest completing it
		if (profileCompletion < 100) {
			actions.push({
				href: "/dashboard/profile",
				icon: User,
				label: `${tHome("updateProfile")} (${profileCompletion}%)`,
				color: "text-chart-4",
			});
		}

		// Priority 2: If no applications, suggest exploring schools
		if (applicationsCount === 0) {
			actions.push({
				href: "/explore",
				icon: GraduationCap,
				label: tHome("exploreSchools"),
				color: "text-chart-2",
			});
		}

		// Priority 3: If coverage is low, suggest persona discovery
		const overallProgress = coverage?.overallProgress ?? 0;
		if (overallProgress < 50) {
			actions.push({
				href: "/persona-lab",
				icon: Sparkles,
				label: "Persona Lab",
				color: "text-primary",
			});
		}

		// Always show these as fallback options
		if (!actions.some((a) => a.href === "/persona-lab")) {
			actions.push({
				href: "/persona-lab",
				icon: Sparkles,
				label: "Persona Lab",
				color: "text-primary",
			});
		}
		if (!actions.some((a) => a.href === "/explore")) {
			actions.push({
				href: "/explore",
				icon: GraduationCap,
				label: tHome("exploreSchools"),
				color: "text-chart-2",
			});
		}
		if (!actions.some((a) => a.href === "/dashboard/profile")) {
			actions.push({
				href: "/dashboard/profile",
				icon: User,
				label: tHome("updateProfile"),
				color: "text-chart-4",
			});
		}

		return actions.slice(0, 3);
	}, [profileCompletion, applicationsCount, coverage, tHome]);

	return (
		<PageTransition>
			<div className="min-h-screen bg-background">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<SlideUp>
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-foreground mb-2">
								{greeting || <span className="invisible">…</span>},{" "}
								{firstName ||
									profile?.fullName?.split(" ").pop() ||
									tHome("you")}
								!
							</h1>
							<p className="text-lg text-muted-foreground">
								{tHome("subtitle")}
							</p>
						</div>
					</SlideUp>

					{/* Suggested Next Action */}
					<SlideUp delay={0.1}>
						<m.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							{isLoading ? (
								<Card className="mb-8">
									<CardContent className="p-6">
										<div className="flex items-start gap-4">
											<Skeleton className="w-14 h-14 rounded-2xl" />
											<div className="flex-1 space-y-3">
												<Skeleton className="h-5 w-24" />
												<Skeleton className="h-6 w-48" />
												<Skeleton className="h-4 w-64" />
												<Skeleton className="h-10 w-32" />
											</div>
										</div>
									</CardContent>
								</Card>
							) : suggestedAction?.type === "persona" ||
								suggestedAction?.type === "writing" ? (
								<Card className="mb-8 bg-linear-to-br from-primary/5 via-chart-2/5 to-transparent border-primary/20 overflow-hidden relative group hover:shadow-lg transition-shadow duration-300">
									<div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
									<CardContent className="p-6 relative">
										<div className="flex items-start gap-4">
											<div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
												<Sparkles className="w-7 h-7 text-primary" />
											</div>
											<div className="flex-1">
												<Badge className="bg-primary/10 text-primary mb-2 hover:bg-primary/20">
													{tHome("suggestedForYou")}
												</Badge>
												<h3 className="text-xl font-semibold text-foreground mb-2">
													{suggestedAction?.title || tHome("startDiscovery")}
												</h3>
												<p className="text-muted-foreground mb-4">
													{suggestedAction?.description ||
														tHome("startDiscoveryDesc")}
												</p>
												<Button asChild>
													<Link href={suggestedAction?.link || "/persona-lab"}>
														{tHome("goToPersonaLab")}
														<ArrowRight className="w-4 h-4 ml-2" />
													</Link>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							) : suggestedAction?.type === "deadline" ? (
								<Card className="mb-8 bg-linear-to-br from-chart-4/5 via-primary/5 to-transparent border-chart-4/20 overflow-hidden relative group hover:shadow-lg transition-shadow duration-300">
									<div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-chart-4/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
									<CardContent className="p-6 relative">
										<div className="flex items-start gap-4">
											<div className="w-14 h-14 bg-chart-4/10 rounded-2xl flex items-center justify-center shrink-0">
												<Calendar className="w-7 h-7 text-chart-4" />
											</div>
											<div className="flex-1">
												<Badge className="bg-chart-4/10 text-chart-4 mb-2 hover:bg-chart-4/20">
													{tHome("suggestedForYou")}
												</Badge>
												<h3 className="text-xl font-semibold text-foreground mb-2">
													{suggestedAction?.title}
												</h3>
												<p className="text-muted-foreground mb-4">
													{suggestedAction?.description}
												</p>
												<Button
													asChild
													className="bg-chart-4 hover:bg-chart-4/90"
												>
													<Link
														href={
															suggestedAction?.link || "/dashboard/applications"
														}
													>
														{tHome("viewAll")}
														<ArrowRight className="w-4 h-4 ml-2" />
													</Link>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							) : (
								<Card className="mb-8 bg-linear-to-br from-chart-2/5 via-primary/5 to-transparent border-chart-2/20 overflow-hidden relative group hover:shadow-lg transition-shadow duration-300">
									<div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-chart-2/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
									<CardContent className="p-6 relative">
										<div className="flex items-start gap-4">
											<div className="w-14 h-14 bg-chart-2/10 rounded-2xl flex items-center justify-center shrink-0">
												<Target className="w-7 h-7 text-chart-2" />
											</div>
											<div className="flex-1">
												<Badge className="bg-chart-2/10 text-chart-2 mb-2 hover:bg-chart-2/20">
													{tHome("suggestedForYou")}
												</Badge>
												<h3 className="text-xl font-semibold text-foreground mb-2">
													{suggestedAction?.title || tHome("addFirstTarget")}
												</h3>
												<p className="text-muted-foreground mb-4">
													{suggestedAction?.description ||
														tHome("addFirstTargetDesc")}
												</p>
												<Button
													asChild
													className="bg-chart-2 hover:bg-chart-2/90"
												>
													<Link href={suggestedAction?.link || "/explore"}>
														{tHome("exploreSchools")}
														<ArrowRight className="w-4 h-4 ml-2" />
													</Link>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							)}
						</m.div>
					</SlideUp>

					{/* Quick Stats */}
					<SlideUp delay={0.2}>
						<StaggerContainer>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
								{/* Profile Completion */}
								<StaggerItem>
									<Card className="hover:shadow-md transition-shadow">
										<CardContent className="p-5">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
													<User className="w-5 h-5 text-primary" />
												</div>
												<span className="text-sm font-medium text-muted-foreground">
													{tHome("profile")}
												</span>
											</div>
											<div className="space-y-2">
												<div className="flex items-baseline justify-between">
													<span className="text-2xl font-bold text-foreground">
														{isLoading ? (
															<Skeleton className="h-7 w-12 inline-block" />
														) : (
															`${profileCompletion}%`
														)}
													</span>
													<span className="text-xs text-muted-foreground">
														{tHome("completed")}
													</span>
												</div>
												<Progress
													value={isLoading ? 0 : profileCompletion}
													className="h-2"
												/>
											</div>
										</CardContent>
									</Card>
								</StaggerItem>

								{/* Applications */}
								<StaggerItem>
									<Card className="hover:shadow-md transition-shadow">
										<CardContent className="p-5">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center">
													<FolderOpen className="w-5 h-5 text-chart-2" />
												</div>
												<span className="text-sm font-medium text-muted-foreground">
													{tHome("applications")}
												</span>
											</div>
											<div className="flex items-baseline gap-2">
												<span className="text-2xl font-bold text-foreground">
													{isLoading ? (
														<Skeleton className="h-7 w-8 inline-block" />
													) : (
														applicationsCount
													)}
												</span>
												<span className="text-sm text-muted-foreground">
													{submittedApplications} {tHome("submitted")}
												</span>
											</div>
										</CardContent>
									</Card>
								</StaggerItem>

								{/* Upcoming Deadlines */}
								<StaggerItem>
									<Card className="hover:shadow-md transition-shadow">
										<CardContent className="p-5">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center">
													<Calendar className="w-5 h-5 text-chart-4" />
												</div>
												<span className="text-sm font-medium text-muted-foreground">
													{tHome("upcomingDeadlines")}
												</span>
											</div>
											<div className="flex items-baseline gap-2">
												<span className="text-2xl font-bold text-foreground">
													{isLoading ? (
														<Skeleton className="h-7 w-8 inline-block" />
													) : (
														upcomingDeadlines.length
													)}
												</span>
												<span className="text-sm text-muted-foreground">
													{tHome("deadlines")}
												</span>
											</div>
										</CardContent>
									</Card>
								</StaggerItem>

								{/* Persona Progress - Coverage-based */}
								<StaggerItem>
									<Card className="hover:shadow-md transition-shadow">
										<CardContent className="p-5">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-chart-3/10 rounded-lg flex items-center justify-center">
													<Compass className="w-5 h-5 text-chart-3" />
												</div>
												<span className="text-sm font-medium text-muted-foreground">
													{tHome("discovery")}
												</span>
											</div>
											<div className="space-y-2">
												<div className="flex items-baseline justify-between">
													<span className="text-2xl font-bold text-foreground">
														{isLoading || isCoverageLoading ? (
															<Skeleton className="h-7 w-12 inline-block" />
														) : (
															`${coverage?.overallProgress ?? 0}%`
														)}
													</span>
													<span className="text-xs text-muted-foreground">
														{tHome("completed")}
													</span>
												</div>
												<Progress
													value={
														isLoading || isCoverageLoading
															? 0
															: (coverage?.overallProgress ?? 0)
													}
													className="h-2"
												/>
											</div>
										</CardContent>
									</Card>
								</StaggerItem>
							</div>
						</StaggerContainer>
					</SlideUp>

					{/* Main Content - 2 column layout */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Left Column - Applications & Deadlines */}
						<div className="lg:col-span-2 space-y-6">
							{/* Your Applications */}
							<SlideUp delay={0.3}>
								<Card>
									<CardHeader className="flex flex-row items-center justify-between pb-2">
										<CardTitle className="text-lg flex items-center gap-2">
											<School
												className="w-5 h-5 text-muted-foreground"
												aria-hidden="true"
											/>
											{tHome("yourApplications")}
										</CardTitle>
										<Button variant="ghost" size="sm" asChild>
											<Link href="/dashboard/applications">
												{tHome("viewAll")}
												<ArrowRight className="w-4 h-4 ml-1" />
											</Link>
										</Button>
									</CardHeader>
									<CardContent>
										{isLoading ? (
											<div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
												{[1, 2, 3].map((i) => (
													<div key={i} className="min-w-[220px] shrink-0">
														<Card className="h-full">
															<CardContent className="p-4 space-y-3">
																<div className="flex items-start gap-3">
																	<Skeleton className="h-10 w-10 rounded-full" />
																	<div className="flex-1 space-y-2">
																		<Skeleton className="h-4 w-24" />
																		<Skeleton className="h-3 w-32" />
																	</div>
																</div>
																<div className="flex justify-between">
																	<Skeleton className="h-5 w-16" />
																	<Skeleton className="h-4 w-12" />
																</div>
															</CardContent>
														</Card>
													</div>
												))}
											</div>
										) : recentApplications.length > 0 ? (
											<div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
												{recentApplications.map((app: RecentApplicationDto) => (
													<Link
														key={app.id}
														href={`/dashboard/applications/${app.id}`}
														className="min-w-[220px] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
													>
														<Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
															<CardContent className="p-4">
																<div className="flex items-start gap-3 mb-3">
																	<Avatar className="h-10 w-10 shrink-0">
																		<AvatarFallback className="text-xs">
																			{(app.universityName ?? "")
																				.substring(0, 2)
																				.toUpperCase()}
																		</AvatarFallback>
																	</Avatar>
																	<div className="flex-1 min-w-0">
																		<h4 className="font-medium text-sm text-foreground truncate">
																			{app.universityName}
																		</h4>
																		<p className="text-xs text-muted-foreground truncate">
																			{app.programName}
																		</p>
																	</div>
																</div>
																<div className="space-y-2">
																	<div className="flex items-center justify-between">
																		<Badge
																			variant={
																				app.status === "submitted"
																					? "default"
																					: "secondary"
																			}
																			className="text-xs capitalize"
																		>
																			{app.status}
																		</Badge>
																	</div>
																</div>
															</CardContent>
														</Card>
													</Link>
												))}
											</div>
										) : (
											<div className="text-center py-8">
												<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
													<GraduationCap
														className="w-8 h-8 text-muted-foreground"
														aria-hidden="true"
													/>
												</div>
												<p className="text-muted-foreground mb-4">
													{tHome("noApplicationsYet")}
												</p>
												<Button variant="outline" size="sm" asChild>
													<Link href="/explore">{tHome("exploreSchools")}</Link>
												</Button>
											</div>
										)}
									</CardContent>
								</Card>
							</SlideUp>

							{/* Upcoming Deadlines Section */}
							{upcomingDeadlines.length > 0 && (
								<SlideUp delay={0.35}>
									<Card>
										<CardHeader className="flex flex-row items-center justify-between pb-2">
											<CardTitle className="text-lg flex items-center gap-2">
												<Calendar
													className="w-5 h-5 text-muted-foreground"
													aria-hidden="true"
												/>
												{tHome("upcomingDeadlines")}
											</CardTitle>
											<Button variant="ghost" size="sm" asChild>
												<Link href="/dashboard/applications">
													{tHome("viewAll")}
													<ArrowRight className="w-4 h-4 ml-1" />
												</Link>
											</Button>
										</CardHeader>
										<CardContent>
											<div className="space-y-3">
												{upcomingDeadlines.slice(0, 3).map((deadline) => {
													const urgency = getDeadlineUrgency(
														deadline.daysRemaining,
													);
													return (
														<Link
															key={deadline.applicationId}
															href={`/dashboard/applications/${deadline.applicationId}`}
															className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
														>
															<div className="flex items-center gap-3 min-w-0">
																<div
																	className={`w-10 h-10 ${urgency.bgColor} rounded-lg flex items-center justify-center shrink-0`}
																>
																	{deadline.daysRemaining !== undefined &&
																	deadline.daysRemaining <= URGENT_DAYS ? (
																		<AlertCircle
																			className={`w-5 h-5 ${urgency.color}`}
																			aria-hidden="true"
																		/>
																	) : (
																		<Calendar
																			className={`w-5 h-5 ${urgency.color}`}
																			aria-hidden="true"
																		/>
																	)}
																</div>
																<div className="min-w-0">
																	<p className="font-medium text-sm text-foreground truncate">
																		{deadline.programName}
																	</p>
																	<p className="text-xs text-muted-foreground">
																		{deadline.deadline}
																	</p>
																</div>
															</div>
															<div className="flex items-center gap-2 shrink-0">
																<Badge
																	variant="outline"
																	className={`${urgency.color} border-current text-xs font-medium`}
																>
																	{deadline.daysRemaining}{" "}
																	{tHome("daysAgo").replace("ago", "left")}
																</Badge>
																<ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
															</div>
														</Link>
													);
												})}
											</div>
										</CardContent>
									</Card>
								</SlideUp>
							)}
						</div>

						{/* Right Column - Quick Actions & Coverage */}
						<div className="space-y-6">
							{/* Coverage Breakdown (if data available) */}
							{coverage && (coverage.overallProgress ?? 0) > 0 && (
								<SlideUp delay={0.4}>
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-lg flex items-center gap-2">
												<Sparkles
													className="w-5 h-5 text-muted-foreground"
													aria-hidden="true"
												/>
												Persona Coverage
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-3">
												{COVERAGE_CATEGORIES.map(({ key, label, color }) => {
													const value = coverage[
														key as keyof CoverageMetrics
													] as number | undefined;
													return (
														<div key={key} className="space-y-1">
															<div className="flex items-center justify-between text-sm">
																<span className="text-muted-foreground">
																	{label}
																</span>
																<span className="font-medium tabular-nums">
																	{value ?? 0}%
																</span>
															</div>
															<div className="h-1.5 bg-muted rounded-full overflow-hidden">
																<div
																	className={`h-full ${color} rounded-full transition-all duration-500`}
																	style={{ width: `${value ?? 0}%` }}
																/>
															</div>
														</div>
													);
												})}
											</div>
											<div className="mt-4 pt-4 border-t">
												<Button asChild className="w-full" variant="outline">
													<Link href="/persona-lab">
														{tHome("goToPersonaLab")}
														<ArrowRight className="w-4 h-4 ml-2" />
													</Link>
												</Button>
											</div>
										</CardContent>
									</Card>
								</SlideUp>
							)}

							{/* Quick Actions */}
							<SlideUp delay={0.45}>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-lg">
											{tHome("quickActions")}
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										{quickActions.map((action) => {
											const Icon = action.icon;
											return (
												<Button
													key={action.href}
													variant="outline"
													className="w-full justify-start"
													asChild
												>
													<Link href={action.href}>
														<Icon
															className={`w-4 h-4 mr-2 ${action.color}`}
															aria-hidden="true"
														/>
														{action.label}
													</Link>
												</Button>
											);
										})}
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
