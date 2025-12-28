"use client";

import {
	ArrowLeft,
	Bookmark,
	BookmarkCheck,
	Check,
	ExternalLink,
	Loader2,
	MapPin,
	Plus,
	Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import {
	ApplicationSidebar,
	FitScoreExpanded,
	ProgramTabs,
	QuickFactsBar,
} from "@/components/explore-alt/program-detail";
import { MOCK_PROGRAM_DETAIL } from "@/components/explore-alt/program-detail/mockDetailData";
import { PageTransition, SlideUp } from "@/components/PageTransition";
import { exploreApi } from "@/lib/api/exploreApi";
import type { ProgramDetailResponse } from "@/lib/api/types";
import { useApplicationsStore } from "@/lib/store/applicationsStore";

// Feature flag to toggle between mock data and API
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export default function ProgramDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const resolvedParams = use(params);
	const router = useRouter();
	const [program, setProgram] = useState<ProgramDetailResponse | null>(
		USE_MOCK_DATA ? MOCK_PROGRAM_DETAIL : null,
	);
	const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
	const [error, setError] = useState<string | null>(null);
	const [isSaved, setIsSaved] = useState(false);
	const [isAddingToApplications, setIsAddingToApplications] = useState(false);
	const [addedToApplications, setAddedToApplications] = useState(false);

	const { addApplication, applications, fetchApplications } =
		useApplicationsStore();

	// Fetch applications to check if already added
	useEffect(() => {
		fetchApplications();
	}, [fetchApplications]);

	// Check if program is already in applications
	useEffect(() => {
		if (program && applications.length > 0) {
			const isAlreadyAdded = applications.some(
				(app) => app.program.id === program.id,
			);
			setAddedToApplications(isAlreadyAdded);
		}
	}, [program, applications]);

	useEffect(() => {
		if (USE_MOCK_DATA) {
			setProgram(MOCK_PROGRAM_DETAIL);
			setIsSaved(MOCK_PROGRAM_DETAIL.isSaved ?? false);
			return;
		}

		async function fetchProgram() {
			try {
				setIsLoading(true);
				setError(null);
				const data = await exploreApi.getProgramDetail(resolvedParams.id);
				setProgram(data);
				setIsSaved(data.isSaved ?? false);
			} catch (err) {
				console.error("Failed to fetch program detail:", err);
				setError(
					err instanceof Error ? err.message : "Failed to load program details",
				);
				// Fallback to mock data on error for development
				if (process.env.NODE_ENV === "development") {
					setProgram(MOCK_PROGRAM_DETAIL);
					setIsSaved(MOCK_PROGRAM_DETAIL.isSaved ?? false);
				}
			} finally {
				setIsLoading(false);
			}
		}

		fetchProgram();
	}, [resolvedParams.id]);

	const handleSaveToggle = async () => {
		if (!program) return;

		const newSavedState = !isSaved;
		setIsSaved(newSavedState); // Optimistic update

		if (!USE_MOCK_DATA) {
			try {
				if (newSavedState) {
					await exploreApi.saveProgram(program.id);
				} else {
					await exploreApi.unsaveProgram(program.id);
				}
			} catch (err) {
				console.error("Failed to update save status:", err);
				setIsSaved(!newSavedState); // Revert on error
			}
		}
	};

	const handleAddToApplications = async () => {
		if (!program || addedToApplications || isAddingToApplications) return;

		setIsAddingToApplications(true);
		try {
			const applicationId = await addApplication({ programId: program.id });
			if (applicationId) {
				setAddedToApplications(true);
				// Navigate to applications dashboard
				router.push("/dashboard/applications");
			}
		} catch (err) {
			console.error("Failed to add to applications:", err);
		} finally {
			setIsAddingToApplications(false);
		}
	};

	// Loading State
	if (isLoading) {
		return (
			<PageTransition>
				<section className="relative bg-background border-b border-border">
					<div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />
					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						{/* Back Navigation */}
						<Link
							href="/explore"
							className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Explore
						</Link>

						{/* Loading Skeleton */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
							<div className="lg:col-span-2">
								<div className="flex items-start gap-4 mb-6">
									<div className="h-20 w-20 rounded-xl bg-muted" />
									<div className="flex-1 space-y-3">
										<div className="h-4 bg-muted rounded w-32" />
										<div className="h-8 bg-muted rounded w-3/4" />
										<div className="h-4 bg-muted rounded w-40" />
									</div>
								</div>
							</div>
							<div className="lg:col-span-1">
								<div className="bg-card border border-border rounded-xl p-4">
									<div className="space-y-3">
										<div className="h-4 bg-muted rounded w-24" />
										<div className="h-10 bg-muted rounded w-16" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Content Skeleton */}
				<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="flex items-center justify-center py-24">
						<Loader2 className="w-8 h-8 animate-spin text-primary" />
						<span className="ml-3 text-muted-foreground">
							Loading program details...
						</span>
					</div>
				</section>
			</PageTransition>
		);
	}

	// Error State
	if (error && !program) {
		return (
			<PageTransition>
				<section className="relative bg-background border-b border-border">
					<div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />
					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<Link
							href="/explore"
							className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Explore
						</Link>
					</div>
				</section>

				<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="flex flex-col items-center justify-center py-24 text-center">
						<div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
							<span className="text-2xl">⚠️</span>
						</div>
						<h2 className="text-xl font-semibold text-foreground mb-2">
							Failed to Load Program
						</h2>
						<p className="text-muted-foreground mb-6">{error}</p>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
						>
							Try Again
						</button>
					</div>
				</section>
			</PageTransition>
		);
	}

	// No program data
	if (!program) {
		return null;
	}

	return (
		<PageTransition>
			{/* Hero Section */}
			<section className="relative bg-background border-b border-border">
				{/* Background gradient */}
				<div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Back Navigation */}
					<SlideUp>
						<Link
							href="/explore"
							className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Explore
						</Link>
					</SlideUp>

					{/* Main Hero Content */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Left: Program Info */}
						<div className="lg:col-span-2">
							<SlideUp delay={0.1}>
								<div className="flex items-start gap-4 mb-6">
									{/* University Logo */}
									<div className="h-20 w-20 rounded-xl bg-card border border-border flex items-center justify-center text-3xl font-bold text-muted-foreground shrink-0">
										{program.universityLogoUrl ? (
											<Image
												src={program.universityLogoUrl}
												alt={program.universityName}
												width={80}
												height={80}
												className="rounded-xl object-contain"
											/>
										) : (
											program.universityName.charAt(0)
										)}
									</div>

									{/* University & Program Name */}
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<span className="text-sm font-medium text-muted-foreground">
												{program.universityName}
											</span>
											{program.rankingQs && (
												<span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
													#{program.rankingQs} QS World
												</span>
											)}
										</div>
										<h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-2">
											{program.programName}
										</h1>
										<div className="flex items-center gap-2 text-muted-foreground">
											<MapPin className="w-4 h-4" />
											<span>
												{program.universityCity}, {program.universityCountry}
											</span>
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex flex-wrap gap-3">
									<button
										type="button"
										onClick={handleSaveToggle}
										className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
											isSaved
												? "bg-primary text-primary-foreground"
												: "bg-card border border-border text-foreground hover:bg-muted"
										}`}
									>
										{isSaved ? (
											<BookmarkCheck className="w-5 h-5" />
										) : (
											<Bookmark className="w-5 h-5" />
										)}
										{isSaved ? "Saved" : "Save to List"}
									</button>

									<button
										type="button"
										onClick={handleAddToApplications}
										disabled={isAddingToApplications || addedToApplications}
										className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
											addedToApplications
												? "bg-green-600 text-white cursor-default"
												: isAddingToApplications
													? "bg-primary/70 text-primary-foreground cursor-wait"
													: "bg-primary text-primary-foreground hover:bg-primary/90"
										}`}
									>
										{isAddingToApplications ? (
											<>
												<Loader2 className="w-4 h-4 animate-spin" />
												Adding...
											</>
										) : addedToApplications ? (
											<>
												<Check className="w-4 h-4" />
												Added to Applications
											</>
										) : (
											<>
												<Plus className="w-4 h-4" />
												Add to My Applications
											</>
										)}
									</button>

									<button
										type="button"
										className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
									>
										<Share2 className="w-4 h-4" />
									</button>
								</div>
							</SlideUp>
						</div>

						{/* Right: Fit Score Card (Compact for Hero) */}
						<div className="lg:col-span-1">
							<SlideUp delay={0.2}>
								<div className="bg-card border border-border rounded-xl p-4 shadow-sm">
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm font-medium text-muted-foreground">
											Your Fit Score
										</span>
										<span
											className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
												program.fitCategory === "reach"
													? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
													: program.fitCategory === "safety"
														? "bg-green-500/20 text-green-700 dark:text-green-300"
														: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
											}`}
										>
											{program.fitCategory} School
										</span>
									</div>
									<div className="flex items-baseline gap-1">
										<span className="text-4xl font-bold text-foreground">
											{program.fitScore}
										</span>
										<span className="text-muted-foreground">/100</span>
									</div>
								</div>
							</SlideUp>
						</div>
					</div>
				</div>
			</section>

			{/* Quick Facts Bar */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
				<SlideUp delay={0.3}>
					<QuickFactsBar program={program} />
				</SlideUp>
			</section>

			{/* Main Content Area */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left: Tabbed Content */}
					<div className="lg:col-span-2 space-y-8">
						<SlideUp delay={0.4}>
							<ProgramTabs program={program} />
						</SlideUp>

						{/* Fit Score Expanded (Below Tabs) */}
						<SlideUp delay={0.5}>
							<FitScoreExpanded program={program} />
						</SlideUp>
					</div>

					{/* Right: Sticky Sidebar */}
					<div className="lg:col-span-1">
						<div className="sticky top-24">
							<SlideUp delay={0.5}>
								<ApplicationSidebar program={program} />
							</SlideUp>
						</div>
					</div>
				</div>
			</section>
		</PageTransition>
	);
}
