"use client";

import { Globe, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SwimLanes } from "@/components/explore-alt/AIMatchMode";
// Import explore-alt components
import { AIMatchSummary } from "@/components/explore-alt/AIMatchSummary";
import { ProgramGrid } from "@/components/explore-alt/ExploreAll";
import { HorizontalFilterBar } from "@/components/explore-alt/FilterBar";
import MOCK_PROGRAMS_JSON from "@/components/explore-alt/programMockData.json";
import { PageTransition, SlideUp } from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exploreApi } from "@/lib/api/exploreApi";
import type {
	AiMatchResponse,
	ProgramListItemResponse,
	ProgramListParams,
} from "@/lib/api/types";

// Feature flag to toggle between mock data and API
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

const MOCK_PROGRAMS = MOCK_PROGRAMS_JSON as ProgramListItemResponse[];

// Mock AI Match Response based on AiMatchResponse type
const MOCK_MATCH_DATA: AiMatchResponse = {
	reach: MOCK_PROGRAMS.filter((p) => p.fitCategory === "reach"),
	target: MOCK_PROGRAMS.filter((p) => p.fitCategory === "target"),
	safety: MOCK_PROGRAMS.filter((p) => p.fitCategory === "safety"),
	recommendation:
		"Based on your GPA (3.6) and interest in Computer Science, you have a strong profile for target universities in Europe. Consider improving your IELTS score to unlock more prestigious US reach schools.",
	profileCompleteness: 85,
	missingFields: ["Work Experience", "Portfolio"],
	totalMatched: 847,
};

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Hero Section with Search
 */
function HeroSection({
	totalMatched,
	onSearch,
}: {
	totalMatched: number;
	onSearch: (query: string) => void;
}) {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = () => {
		onSearch(searchQuery);
	};

	return (
		<section className="relative bg-background py-16 overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0 z-0">
				<Image
					src="/hero.png"
					alt="Hero background"
					fill
					className="object-cover opacity-20"
					priority
					quality={90}
				/>
				<div className="absolute inset-0" />
			</div>

			{/* Content */}
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<SlideUp>
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-foreground mb-4">
							Discover Your Perfect Program
						</h1>
						<p className="text-lg text-muted-foreground">
							{totalMatched} programs across 12 countries matched to your
							profile
						</p>
					</div>

					{/* Search Bar */}
					<div className="max-w-3xl mx-auto">
						<div className="flex gap-3 bg-card rounded-xl p-2 shadow-lg border border-border">
							<div className="flex-1 flex items-center gap-3 px-3">
								<Search className="w-5 h-5 text-muted-foreground" />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleSearch()}
									placeholder="Search programs, universities, or fields..."
									className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
								/>
							</div>
							<button
								type="button"
								onClick={handleSearch}
								className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
							>
								Search
							</button>
						</div>
					</div>
				</SlideUp>
			</div>
		</section>
	);
}

/**
 * Results Header with Sort
 */
function ResultsHeader({
	count,
	sort,
	onSortChange,
}: {
	count: number;
	sort: string;
	onSortChange: (sort: ProgramListParams["sort"]) => void;
}) {
	return (
		<div className="flex items-center justify-between mb-6">
			<div>
				<h2 className="text-xl font-bold text-foreground">All Programs</h2>
				<p className="text-sm text-muted-foreground">{count} programs found</p>
			</div>
			<select
				value={sort}
				onChange={(e) =>
					onSortChange(e.target.value as ProgramListParams["sort"])
				}
				className="h-10 px-4 rounded-lg border border-border bg-background text-foreground text-sm"
			>
				<option value="fit_score">Sort by: Fit Score</option>
				<option value="ranking_qs">Sort by: QS Ranking</option>
				<option value="tuition_asc">Sort by: Tuition (Low to High)</option>
				<option value="tuition_desc">Sort by: Tuition (High to Low)</option>
				<option value="deadline">Sort by: Deadline</option>
			</select>
		</div>
	);
}

/**
 * Loading Skeleton for Program Cards
 */
function ProgramCardSkeleton() {
	return (
		<div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm animate-pulse">
			<div className="p-4 border-b border-border">
				<div className="flex items-center gap-3">
					<div className="h-12 w-12 rounded-lg bg-muted" />
					<div className="flex-1 space-y-2">
						<div className="h-4 bg-muted rounded w-3/4" />
						<div className="h-3 bg-muted rounded w-1/2" />
					</div>
				</div>
			</div>
			<div className="p-4 space-y-4">
				<div className="h-5 bg-muted rounded w-full" />
				<div className="h-4 bg-muted rounded w-2/3" />
				<div className="bg-muted/30 rounded-lg p-4 space-y-3">
					<div className="h-6 bg-muted rounded w-1/3" />
					<div className="h-2 bg-muted rounded w-full" />
					<div className="space-y-2">
						<div className="h-3 bg-muted rounded w-4/5" />
						<div className="h-3 bg-muted rounded w-3/5" />
					</div>
				</div>
			</div>
			<div className="p-4 border-t border-border flex justify-between">
				<div className="h-9 w-9 bg-muted rounded-lg" />
				<div className="h-9 w-24 bg-muted rounded-lg" />
			</div>
		</div>
	);
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ExploreAltPage() {
	const [activeMode, setActiveMode] = useState<"ai-match" | "explore-all">(
		"ai-match",
	);

	// State for programs list (Explore All mode)
	const [programs, setPrograms] = useState<ProgramListItemResponse[]>(
		USE_MOCK_DATA ? MOCK_PROGRAMS : [],
	);
	const [isLoadingPrograms, setIsLoadingPrograms] = useState(!USE_MOCK_DATA);
	const [programsError, setProgramsError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [sort, setSort] = useState<ProgramListParams["sort"]>("fit_score");
	const [totalPrograms, setTotalPrograms] = useState(
		USE_MOCK_DATA ? MOCK_PROGRAMS.length : 0,
	);

	// State for AI Match mode
	const [aiMatchData, setAiMatchData] = useState<AiMatchResponse | null>(
		USE_MOCK_DATA ? MOCK_MATCH_DATA : null,
	);
	const [isLoadingAiMatch, setIsLoadingAiMatch] = useState(!USE_MOCK_DATA);
	const [aiMatchError, setAiMatchError] = useState<string | null>(null);

	// Fetch AI Match data
	useEffect(() => {
		if (USE_MOCK_DATA) {
			setAiMatchData(MOCK_MATCH_DATA);
			return;
		}

		async function fetchAiMatch() {
			try {
				setIsLoadingAiMatch(true);
				setAiMatchError(null);
				const data = await exploreApi.getAiMatch();
				setAiMatchData(data);
			} catch (err) {
				console.error("Failed to fetch AI match data:", err);
				setAiMatchError(
					err instanceof Error ? err.message : "Failed to load AI matches",
				);
				// Fallback to mock data in development
				if (process.env.NODE_ENV === "development") {
					setAiMatchData(MOCK_MATCH_DATA);
				}
			} finally {
				setIsLoadingAiMatch(false);
			}
		}

		fetchAiMatch();
	}, []);

	// Fetch programs list (for Explore All mode)
	useEffect(() => {
		if (USE_MOCK_DATA) {
			setPrograms(MOCK_PROGRAMS);
			setTotalPrograms(MOCK_PROGRAMS.length);
			return;
		}

		async function fetchPrograms() {
			try {
				setIsLoadingPrograms(true);
				setProgramsError(null);
				const response = await exploreApi.getPrograms({
					search: searchQuery || undefined,
					sort,
				});
				setPrograms(response.data);
				setTotalPrograms(response.pagination.total);
			} catch (err) {
				console.error("Failed to fetch programs:", err);
				setProgramsError(
					err instanceof Error ? err.message : "Failed to load programs",
				);
				// Fallback to mock data in development
				if (process.env.NODE_ENV === "development") {
					setPrograms(MOCK_PROGRAMS);
					setTotalPrograms(MOCK_PROGRAMS.length);
				}
			} finally {
				setIsLoadingPrograms(false);
			}
		}

		// Only fetch when in explore-all mode or initial load
		if (activeMode === "explore-all" || programs.length === 0) {
			fetchPrograms();
		}
	}, [activeMode, searchQuery, sort, programs.length]);

	const handleSaveToggle = async (id: string) => {
		const program = programs.find((p) => p.id === id);
		if (!program) return;

		const newSavedState = !program.isSaved;

		// Optimistic update
		setPrograms((prev) =>
			prev.map((p) => (p.id === id ? { ...p, isSaved: newSavedState } : p)),
		);

		if (!USE_MOCK_DATA) {
			try {
				if (newSavedState) {
					await exploreApi.saveProgram(id);
				} else {
					await exploreApi.unsaveProgram(id);
				}
			} catch (err) {
				console.error("Failed to update save status:", err);
				// Revert on error
				setPrograms((prev) =>
					prev.map((p) =>
						p.id === id ? { ...p, isSaved: !newSavedState } : p,
					),
				);
			}
		}
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleSortChange = (newSort: ProgramListParams["sort"]) => {
		setSort(newSort);
	};

	// Compute swimlane programs from AI Match or programs
	const swimLanePrograms = aiMatchData
		? [
				...(aiMatchData.reach || []),
				...(aiMatchData.target || []),
				...(aiMatchData.safety || []),
			]
		: programs;

	return (
		<PageTransition>
			{/* Hero Section */}
			<HeroSection
				totalMatched={aiMatchData?.totalMatched || totalPrograms}
				onSearch={handleSearch}
			/>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Mode Switch Tabs */}
				<div className="mb-8">
					<Tabs
						value={activeMode}
						onValueChange={(value) =>
							setActiveMode(value as "ai-match" | "explore-all")
						}
						className="w-full"
					>
						<div className="flex justify-center mb-6">
							<TabsList className="grid w-full max-w-md grid-cols-2">
								<TabsTrigger
									type="button"
									value="ai-match"
									className="flex items-center gap-2"
								>
									<Sparkles className="w-4 h-4" />
									AI Match
								</TabsTrigger>
								<TabsTrigger
									type="button"
									value="explore-all"
									className="flex items-center gap-2"
								>
									<Globe className="w-4 h-4" />
									Explore All
								</TabsTrigger>
							</TabsList>
						</div>

						{/* AI Match Mode */}
						<TabsContent value="ai-match" className="mt-0">
							<div className="space-y-6">
								{isLoadingAiMatch ? (
									<>
										{/* Loading Skeleton for AI Match Summary */}
										<div className="bg-card border border-border rounded-xl p-6 animate-pulse">
											<div className="flex items-start gap-4">
												<div className="w-12 h-12 rounded-full bg-muted" />
												<div className="flex-1 space-y-3">
													<div className="h-5 bg-muted rounded w-1/3" />
													<div className="h-4 bg-muted rounded w-full" />
													<div className="h-4 bg-muted rounded w-4/5" />
												</div>
											</div>
										</div>

										{/* Loading Skeleton for Swim Lanes */}
										<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
											{[1, 2, 3].map((i) => (
												<div key={i} className="space-y-4">
													<div className="h-6 bg-muted rounded w-24 mb-4" />
													<ProgramCardSkeleton />
													<ProgramCardSkeleton />
												</div>
											))}
										</div>
									</>
								) : aiMatchError && !aiMatchData ? (
									<div className="flex flex-col items-center justify-center py-12 text-center">
										<div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
											<span className="text-2xl">⚠️</span>
										</div>
										<h2 className="text-xl font-semibold text-foreground mb-2">
											Failed to Load AI Matches
										</h2>
										<p className="text-muted-foreground mb-6">{aiMatchError}</p>
										<button
											type="button"
											onClick={() => window.location.reload()}
											className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
										>
											Try Again
										</button>
									</div>
								) : (
									<>
										{/* AI Match Summary */}
										<AIMatchSummary
											recommendation={aiMatchData?.recommendation}
											totalMatched={aiMatchData?.totalMatched || 0}
											profileCompleteness={aiMatchData?.profileCompleteness}
											missingFields={aiMatchData?.missingFields}
										/>

										{/* Swim Lanes Layout */}
										<SwimLanes
											programs={swimLanePrograms}
											onSaveToggle={handleSaveToggle}
										/>

										{/* Recommendation Note */}
										<div className="text-center py-4">
											<p className="text-muted-foreground">
												💡 Recommendation: Apply to 2-3 Safety, 3-4 Target, 1-2
												Reach
											</p>
										</div>
									</>
								)}
							</div>
						</TabsContent>

						{/* Explore All Mode */}
						<TabsContent value="explore-all" className="mt-0">
							<div className="space-y-6">
								{/* Horizontal Filter Bar */}
								<HorizontalFilterBar />

								{/* Main Content Area */}
								<main className="w-full">
									{/* Results Header */}
									<ResultsHeader
										count={totalPrograms}
										sort={sort || "fit_score"}
										onSortChange={handleSortChange}
									/>

									{isLoadingPrograms ? (
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
											{[1, 2, 3, 4, 5, 6].map((i) => (
												<ProgramCardSkeleton key={i} />
											))}
										</div>
									) : programsError && programs.length === 0 ? (
										<div className="flex flex-col items-center justify-center py-12 text-center">
											<div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
												<span className="text-2xl">⚠️</span>
											</div>
											<h2 className="text-xl font-semibold text-foreground mb-2">
												Failed to Load Programs
											</h2>
											<p className="text-muted-foreground mb-6">
												{programsError}
											</p>
											<button
												type="button"
												onClick={() => window.location.reload()}
												className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
											>
												Try Again
											</button>
										</div>
									) : (
										<ProgramGrid
											programs={programs}
											onSaveToggle={handleSaveToggle}
										/>
									)}
								</main>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</PageTransition>
	);
}
