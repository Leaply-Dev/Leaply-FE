"use client";

import { Sparkles, Table } from "lucide-react";
import { useState } from "react";
import { ManualMode } from "@/components/explore/ManualMode";
import MOCK_PROGRAMS_JSON from "@/components/explore/programMockData.json";
import { ProgramDetailDrawer } from "@/components/explore/ProgramDetailDrawer";
import { SwimLanes } from "@/components/explore/AIMatchMode";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import type {
	AiMatchResponse,
	ProgramListItemResponse,
	ProgramListResponse,
} from "@/lib/api/types";
import { useAiMatch } from "@/lib/hooks/useAiMatch";
import { usePrograms, useSaveProgram } from "@/lib/hooks/usePrograms";
import { MANUAL_MODE_PROGRAMS } from "@/lib/mock/manualModeData";
import { cn } from "@/lib/utils";

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

interface ExploreClientProps {
	initialPrograms?: ProgramListResponse;
	initialAiMatch?: AiMatchResponse;
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

export function ExploreClient({
	initialPrograms,
	initialAiMatch,
}: ExploreClientProps) {
	const [activeMode, setActiveMode] = useState<"ai" | "manual">("ai");

	// Detail drawer state for AI mode
	const [selectedProgram, setSelectedProgram] =
		useState<ProgramListItemResponse | null>(null);
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

	// Use TanStack Query hooks with SSR data
	const { data: programsResponse } = usePrograms(
		{},
		USE_MOCK_DATA
			? {
					data: MOCK_PROGRAMS,
					pagination: {
						page: 1,
						size: 50,
						total: MOCK_PROGRAMS.length,
						totalPages: 1,
					},
				}
			: initialPrograms,
	);

	const {
		data: aiMatchData,
		isLoading: isLoadingAiMatch,
		error: aiMatchError,
	} = useAiMatch(USE_MOCK_DATA ? MOCK_MATCH_DATA : initialAiMatch);

	const saveMutation = useSaveProgram();

	// Extract data from responses
	const programs = programsResponse?.data ?? [];

	const handleSaveToggle = (id: string) => {
		const program = programs.find((p) => p.id === id);
		if (!program) return;

		// Trigger mutation (includes optimistic update)
		saveMutation.mutate({ id, isSaved: program.isSaved ?? false });
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
		<PageTransition className="flex flex-col min-h-screen">
			{/* Compact Header with Mode Switch */}
			<div className="border-b border-border bg-card/80 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-foreground">
								Explore Programs
							</h1>
							<p className="text-sm text-muted-foreground mt-1">
								{aiMatchData?.totalMatched || programs.length} programs matched
								to your profile
							</p>
						</div>

						{/* Mode Toggle */}
						<div className="flex items-center bg-muted rounded-lg p-1">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setActiveMode("ai")}
								className={cn(
									"h-9 px-4 rounded-md gap-2",
									activeMode === "ai"
										? "bg-background shadow-sm"
										: "hover:bg-transparent",
								)}
							>
								<Sparkles className="w-4 h-4" />
								<span className="text-sm font-medium">AI Enhanced</span>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setActiveMode("manual")}
								className={cn(
									"h-9 px-4 rounded-md gap-2",
									activeMode === "manual"
										? "bg-background shadow-sm"
										: "hover:bg-transparent",
								)}
							>
								<Table className="w-4 h-4" />
								<span className="text-sm font-medium">Manual</span>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				{/* AI Enhanced Mode */}
				{activeMode === "ai" && (
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
								<p className="text-muted-foreground mb-6">
									{aiMatchError instanceof Error
										? aiMatchError.message
										: "Unknown error"}
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
							<>
								{/* Swim Lanes Layout */}
								<SwimLanes
									programs={swimLanePrograms}
									onSaveToggle={handleSaveToggle}
									onProgramClick={(program) => {
										setSelectedProgram(program);
										setIsDetailDrawerOpen(true);
									}}
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
				)}

				{/* Manual Mode */}
				{activeMode === "manual" && (
					<ManualMode
						programs={USE_MOCK_DATA ? MANUAL_MODE_PROGRAMS : programs}
					/>
				)}
			</div>

			{/* Program Detail Drawer for AI Mode */}
			<ProgramDetailDrawer
				program={selectedProgram}
				open={isDetailDrawerOpen}
				onOpenChange={setIsDetailDrawerOpen}
				onCompare={(id) => {
					console.log("Compare:", id);
					setIsDetailDrawerOpen(false);
				}}
				onAddToDashboard={(id) => {
					console.log("Add to dashboard:", id);
					setIsDetailDrawerOpen(false);
				}}
			/>
		</PageTransition>
	);
}
