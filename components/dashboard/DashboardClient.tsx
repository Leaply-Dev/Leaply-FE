"use client";

import { m } from "framer-motion";
import {
	ArrowRight,
	Calendar,
	Compass,
	FolderOpen,
	School,
	Sparkles,
	Target,
	User,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { PageTransition, SlideUp } from "@/components/PageTransition";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import { useGetHomeData } from "@/lib/generated/api/endpoints/home/home";
import { useGetPartsProgress } from "@/lib/generated/api/endpoints/persona-lab/persona-lab";
import type {
	HomeResponse,
	PartsStatus,
	RecentApplicationDto,
	UpcomingDeadlineDto,
} from "@/lib/generated/api/models";
import { useUserStore } from "@/lib/store/userStore";

// Deadline urgency thresholds
const URGENT_DAYS = 7;

export function DashboardClient() {
	const tHome = useTranslations("home");
	const { profile } = useUserStore();
	const { data: homeData, isLoading } = useGetHomeData();
	const { data: partsProgressData, isLoading: isPartsLoading } =
		useGetPartsProgress();

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
		const partsProgress = unwrapResponse<PartsStatus>(partsProgressData);
		if (!data) {
			return {
				profileCompletion: 0,
				upcomingDeadlines: [] as UpcomingDeadlineDto[],
				applicationsCount: 0,
				submittedApplications: 0,
				suggestedAction: null,
				recentApplications: [] as RecentApplicationDto[],
				firstName: null,
				discoveryCompletedCount: partsProgress?.completedCount ?? 0,
			};
		}

		return {
			profileCompletion: data.profileCompletion ?? 0,
			upcomingDeadlines: data.upcomingDeadlines ?? [],
			applicationsCount: data.applications?.total ?? 0,
			suggestedAction: data.suggestedAction,
			recentApplications: data.recentApplications ?? [],
			firstName: data.firstName,
			discoveryCompletedCount: partsProgress?.completedCount ?? 0,
		};
	}, [homeData, partsProgressData]);

	const {
		profileCompletion,
		upcomingDeadlines,
		applicationsCount,
		suggestedAction,
		recentApplications,
		firstName,
		discoveryCompletedCount,
	} = dashboardData;

	return (
		<PageTransition>
			<div className="min-h-screen bg-background text-foreground">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Header & Key Metrics Strip */}
					<SlideUp>
						<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
							<div>
								<h1 className="text-3xl font-bold tracking-tight mb-1">
									{greeting || <span className="invisible">…</span>},{" "}
									{firstName ||
										profile?.fullName?.split(" ").pop() ||
										tHome("you")}
									!
								</h1>
								<p className="text-muted-foreground text-lg">
									{tHome("subtitle")}
								</p>
							</div>

							{/* Top Level Compact Stats */}
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-3 px-4 py-2 bg-card border rounded-full shadow-sm">
									<div className="p-1.5 bg-primary/10 rounded-full">
										<User className="w-4 h-4 text-primary" />
									</div>
									<div className="flex flex-col">
										<span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
											{tHome("profile")}
										</span>
										<div className="flex items-center gap-2">
											<span className="font-bold text-sm">
												{isLoading ? (
													<Skeleton className="h-5 w-8" />
												) : (
													`${profileCompletion}%`
												)}
											</span>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-3 px-4 py-2 bg-card border rounded-full shadow-sm">
									<div className="p-1.5 bg-chart-2/10 rounded-full">
										<FolderOpen className="w-4 h-4 text-chart-2" />
									</div>
									<div className="flex flex-col">
										<span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
											{tHome("applications")}
										</span>
										<span className="font-bold text-sm">
											{isLoading ? (
												<Skeleton className="h-5 w-4" />
											) : (
												applicationsCount
											)}
										</span>
									</div>
								</div>

								<div className="flex items-center gap-3 px-4 py-2 bg-card border rounded-full shadow-sm">
									<div className="p-1.5 bg-chart-3/10 rounded-full">
										<Compass className="w-4 h-4 text-chart-3" />
									</div>
									<div className="flex flex-col">
										<span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
											{tHome("discovery")}
										</span>
										<span className="font-bold text-sm">
											{isLoading || isPartsLoading ? (
												<Skeleton className="h-5 w-8" />
											) : (
												`${discoveryCompletedCount}/4`
											)}
										</span>
									</div>
								</div>
							</div>
						</div>
					</SlideUp>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Left Column: Suggested + Applications */}
						<div className="lg:col-span-2 space-y-8">
							{/* Suggested Action - Compact Banner Design */}
							<SlideUp delay={0.1}>
								<m.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
								>
									{isLoading ? (
										<Skeleton className="h-24 w-full rounded-xl" />
									) : suggestedAction ? (
										suggestedAction.type === "persona" ||
										suggestedAction.type === "writing" ? (
											<div className="relative overflow-hidden rounded-xl border bg-linear-to-r from-primary/10 via-background to-background p-1">
												<div className="flex items-center gap-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-1">
															<Badge
																variant="secondary"
																className="bg-primary/10 text-primary hover:bg-primary/20 text-[10px] px-2 py-0 h-5"
															>
																{tHome("suggestedForYou")}
															</Badge>
															<h3 className="font-semibold text-sm">
																{tHome(
																	`suggestedActions.${suggestedAction.type}.title`,
																)}
															</h3>
														</div>
														<p className="text-sm text-muted-foreground line-clamp-1">
															{tHome(
																`suggestedActions.${suggestedAction.type}.description`,
															)}
														</p>
													</div>
													<Button size="sm" asChild className="shrink-0">
														<Link
															href={suggestedAction?.link || "/persona-lab"}
														>
															{tHome(
																`suggestedActions.${suggestedAction.type}.cta`,
															)}
															<ArrowRight className="w-3.5 h-3.5 ml-1.5" />
														</Link>
													</Button>
												</div>
											</div>
										) : (
											// Fallback/Generic Suggested Action
											<div className="relative overflow-hidden rounded-xl border bg-linear-to-r from-muted/50 to-background p-4 flex items-center justify-between gap-4">
												<div className="flex items-center gap-4">
													<div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
														<Sparkles className="w-5 h-5 text-foreground" />
													</div>
													<div>
														<h3 className="font-semibold text-sm">
															{tHome("suggestedActions.explore.title")}
														</h3>
														<p className="text-sm text-muted-foreground">
															{tHome("suggestedActions.explore.description")}
														</p>
													</div>
												</div>
												<Button variant="outline" size="sm" asChild>
													<Link href={suggestedAction?.link || "/explore"}>
														Go <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
													</Link>
												</Button>
											</div>
										)
									) : null}
								</m.div>
							</SlideUp>

							{/* Your Applications - Table View */}
							<SlideUp delay={0.2}>
								<div className="space-y-4">
									<div className="flex items-center justify-between px-1">
										<h2 className="text-lg font-semibold flex items-center gap-2">
											<School className="w-5 h-5 text-muted-foreground" />
											{tHome("yourApplications")}
										</h2>
										<Button
											variant="link"
											size="sm"
											asChild
											className="text-muted-foreground hover:text-foreground"
										>
											<Link href="/dashboard/applications">
												{tHome("viewAll")}{" "}
												<ArrowRight className="w-4 h-4 ml-1" />
											</Link>
										</Button>
									</div>

									<Card className="overflow-hidden border-border/50 shadow-sm">
										{isLoading ? (
											<div className="p-6 space-y-4">
												{[1, 2, 3].map((i) => (
													<div
														key={`recent-app-skeleton-${i}`}
														className="flex items-center gap-4"
													>
														<Skeleton className="h-10 w-10 rounded-full" />
														<div className="space-y-2 flex-1">
															<Skeleton className="h-4 w-1/3" />
															<Skeleton className="h-3 w-1/4" />
														</div>
													</div>
												))}
											</div>
										) : recentApplications.length > 0 ? (
											<Table>
												<TableHeader className="bg-muted/30">
													<TableRow className="hover:bg-transparent">
														<TableHead className="w-[50%]">
															University & Program
														</TableHead>
														<TableHead>Status</TableHead>
														<TableHead className="text-right">Action</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{recentApplications.map(
														(app: RecentApplicationDto) => (
															<TableRow
																key={app.id}
																className="group cursor-pointer hover:bg-muted/30"
															>
																<TableCell className="py-3">
																	<div className="flex items-center gap-3">
																		<Avatar className="h-9 w-9 border">
																			<AvatarFallback className="text-[10px] text-muted-foreground">
																				{(app.universityName ?? "")
																					.substring(0, 2)
																					.toUpperCase()}
																			</AvatarFallback>
																		</Avatar>
																		<div className="flex flex-col">
																			<span className="font-medium text-sm leading-none mb-1">
																				{app.universityName}
																			</span>
																			<span className="text-xs text-muted-foreground leading-none">
																				{app.programName}
																			</span>
																		</div>
																	</div>
																</TableCell>
																<TableCell className="py-3">
																	<Badge
																		variant={
																			app.status === "submitted"
																				? "default"
																				: "secondary"
																		}
																		className="text-[10px] px-2.5 py-0.5 capitalize shadow-none font-medium"
																	>
																		{app.status}
																	</Badge>
																</TableCell>
																<TableCell className="text-right py-3">
																	<Button
																		variant="ghost"
																		size="icon"
																		className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
																		asChild
																	>
																		<Link
																			href={`/dashboard/applications?id=${app.id}`}
																		>
																			<ArrowRight className="w-4 h-4 text-muted-foreground" />
																		</Link>
																	</Button>
																</TableCell>
															</TableRow>
														),
													)}
												</TableBody>
											</Table>
										) : (
											<div className="flex flex-col items-center justify-center py-12 text-center px-4">
												<div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-3">
													<FolderOpen className="w-6 h-6 text-muted-foreground" />
												</div>
												<p className="text-sm text-muted-foreground mb-4 max-w-[200px]">
													{tHome("noApplicationsYet")}
												</p>
												<Button variant="outline" size="sm" asChild>
													<Link href="/explore">{tHome("exploreSchools")}</Link>
												</Button>
											</div>
										)}
									</Card>
								</div>
							</SlideUp>
						</div>

						{/* Right Column: Deadlines & Widgets */}
						<div className="space-y-8">
							{/* Upcoming Deadlines */}
							<SlideUp delay={0.3}>
								<div className="space-y-4">
									<h2 className="text-lg font-semibold flex items-center gap-2 px-1">
										<Calendar className="w-5 h-5 text-muted-foreground" />
										{tHome("upcomingDeadlines")}
									</h2>
									<Card className="border-border/50 shadow-sm">
										<CardContent className="p-0">
											{isLoading ? (
												<div className="p-4 space-y-3">
													{[1, 2].map((i) => (
														<Skeleton key={i} className="h-12 w-full" />
													))}
												</div>
											) : upcomingDeadlines.length > 0 ? (
												<div className="divide-y divide-border/40">
													{upcomingDeadlines.slice(0, 5).map((deadline) => (
														<Link
															key={deadline.applicationId}
															href={`/dashboard/applications?id=${deadline.applicationId}`}
															className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors group"
														>
															<div
																className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0 border ${
																	deadline.daysRemaining !== undefined &&
																	deadline.daysRemaining <= URGENT_DAYS
																		? "bg-red-50/50 border-red-100 text-red-600 dark:bg-red-950/20 dark:border-red-900/50"
																		: "bg-muted/30 border-border/50 text-muted-foreground"
																}`}
															>
																<span className="text-xs font-bold leading-none">
																	{deadline.daysRemaining}
																</span>
																<span className="text-[9px] uppercase leading-none mt-0.5">
																	Days
																</span>
															</div>
															<div className="min-w-0 flex-1">
																<p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
																	{deadline.programName}
																</p>
																<p className="text-xs text-muted-foreground">
																	{deadline.deadline}
																</p>
															</div>
														</Link>
													))}
												</div>
											) : (
												<div className="p-8 text-center">
													<p className="text-sm text-muted-foreground">
														No upcoming deadlines
													</p>
												</div>
											)}
										</CardContent>
									</Card>
								</div>
							</SlideUp>

							{/* Help / Resources Widget (Example) */}
							<SlideUp delay={0.4}>
								<Card className="bg-primary/5 border-primary/10 overflow-hidden">
									<CardContent className="p-5">
										<div className="flex items-start gap-4">
											<div className="p-2 bg-background rounded-lg shadow-xs">
												<Target className="w-5 h-5 text-primary" />
											</div>
											<div>
												<h3 className="font-semibold text-sm mb-1">
													Persona Lab
												</h3>
												<p className="text-xs text-muted-foreground mb-3">
													Discover your strengths and find the perfect program
													match.
												</p>
												<Button
													variant="outline"
													size="sm"
													className="h-7 text-xs bg-background hover:bg-background/90"
													asChild
												>
													<Link href="/persona-lab">Resume</Link>
												</Button>
											</div>
										</div>
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
