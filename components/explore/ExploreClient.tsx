"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Sparkles, Table } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { TabBasedCategories } from "@/components/explore/AIMatchMode";
import { CompareDialog } from "@/components/explore/CompareDrawer";
import { CompareTray } from "@/components/explore/CompareTray";
import { ManualMode } from "@/components/explore/ManualMode";
import { ProgramDetailDrawer } from "@/components/explore/ProgramDetailDrawer";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	getGetApplicationsQueryKey,
	useCreateApplication,
	useGetApplications,
} from "@/lib/generated/api/endpoints/applications/applications";
import { getGetHomeDataQueryKey } from "@/lib/generated/api/endpoints/home/home";
import type { ProgramListItemResponse } from "@/lib/generated/api/models";
import { useApplicationStore } from "@/lib/store/applicationStore";

/**
 * Loading skeleton component for program cards
 */
function ProgramCardSkeleton() {
	return (
		<div className="bg-card border border-border rounded-lg p-4 space-y-3">
			<div className="flex items-start justify-between">
				<div className="space-y-2 flex-1">
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-3 w-1/2" />
				</div>
				<Skeleton className="h-8 w-8 rounded" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-2/3" />
			</div>
			<div className="flex items-center gap-2">
				<Skeleton className="h-5 w-16 rounded-full" />
				<Skeleton className="h-5 w-12 rounded-full" />
			</div>
		</div>
	);
}

import { useAiMatch } from "@/lib/hooks/useAiMatch";
import { usePrograms, useSaveProgram } from "@/lib/hooks/usePrograms";
import { useUserMe } from "@/lib/hooks/useUserMe";
import { cn } from "@/lib/utils";

export function ExploreClient() {
	const [activeMode, setActiveMode] = useState<"ai" | "manual">("ai");

	// Detail drawer state for AI mode
	const [selectedProgram, setSelectedProgram] =
		useState<ProgramListItemResponse | null>(null);
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

	// Use TanStack Query hooks
	const { data: programsResponse } = usePrograms({});

	const {
		data: aiMatchData,
		isLoading: isLoadingAiMatch,
		error: aiMatchError,
	} = useAiMatch();

	const { data: userProfile } = useUserMe();

	const saveMutation = useSaveProgram();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { mutate: createApplication } = useCreateApplication();
	const { data: applicationsResponse } = useGetApplications();
	const { setSelectedApplicationId } = useApplicationStore();

	// Get applications to check if program is already in dashboard
	const applications = applicationsResponse?.data?.data?.applications ?? [];
	const applicationsByProgramId = new Map(
		applications.map((app) => [app.program?.id, app.id]),
	);

	// Extract data from responses (unwrap ApiResponse)
	const programs = programsResponse?.data?.data?.data ?? [];

	const handleSaveToggle = (id: string) => {
		const program = programs.find((p: ProgramListItemResponse) => p.id === id);
		if (!program) return;

		// Trigger mutation (includes optimistic update)
		saveMutation.mutate({ id, isSaved: program.isSaved ?? false });
	};

	const handleAddToDashboard = (programId: string) => {
		createApplication(
			{
				data: {
					programId,
				},
			},
			{
				onSuccess: async () => {
					// Invalidate queries to ensure dashboard and applications list are fresh
					await Promise.all([
						queryClient.invalidateQueries({
							queryKey: getGetHomeDataQueryKey(),
						}),
						queryClient.invalidateQueries({
							queryKey: getGetApplicationsQueryKey(),
						}),
					]);

					toast.success("Application created", {
						description: "The program has been added to your dashboard.",
					});
					router.push("/dashboard/applications");
				},
				onError: () => {
					toast.error("Failed to create application", {
						description: "Please try again later.",
					});
				},
			},
		);
	};

	const handleManageApplication = (programId: string) => {
		const applicationId = applicationsByProgramId.get(programId);
		if (applicationId) {
			setSelectedApplicationId(applicationId);
			router.push("/dashboard/applications");
		}
	};

	const isProgramInDashboard = (programId: string) => {
		return applicationsByProgramId.has(programId);
	};

	// Compare state
	const MAX_COMPARE_PROGRAMS = 4;
	const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(
		new Set(),
	);
	const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);

	// Toggle program selection
	const toggleProgramSelection = (id: string) => {
		setSelectedPrograms((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else if (newSet.size < MAX_COMPARE_PROGRAMS) {
				newSet.add(id);
			}
			return newSet;
		});
	};

	const isMaxReached = selectedPrograms.size >= MAX_COMPARE_PROGRAMS;
	const selectedCount = selectedPrograms.size;
	const selectedProgramsList = Array.from(selectedPrograms)
		.map((id) => {
			// Search in valid programs list first
			const inPrograms = programs.find(
				(p: ProgramListItemResponse) => p.id === id,
			);
			if (inPrograms) return inPrograms;

			// If not found, search in AI Match data (no unknown category)
			if (aiMatchData?.data?.data) {
				const { reach, target, safety } = aiMatchData.data.data;
				const inAi = [
					...(reach || []),
					...(target || []),
					...(safety || []),
				].find((p) => p.id === id);
				if (inAi) return inAi;
			}
			return undefined;
		})
		.filter((p): p is ProgramListItemResponse => !!p);

	// Compute swimlane programs from AI Match or programs (no unknown category)
	const swimLanePrograms: ProgramListItemResponse[] = aiMatchData?.data?.data
		? [
				...(aiMatchData.data.data.reach || []),
				...(aiMatchData.data.data.target || []),
				...(aiMatchData.data.data.safety || []),
			]
		: programs;

	return (
		<PageTransition className="flex flex-col min-h-screen">
			{/* Compact Header with Mode Switch */}
			<div className="border-b border-border bg-card/80 backdrop-blur-sm">
				<div className="container mx-auto px-6 py-3">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-xl font-bold text-foreground">
								Explore Programs
							</h1>
							<p className="text-xs text-muted-foreground mt-0.5">
								{aiMatchData?.data?.data?.totalMatched || programs.length}{" "}
								programs matched to your profile
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
			<div className="flex-1 container mx-auto px-6 py-4 pb-24">
				{/* AI Enhanced Mode */}
				{activeMode === "ai" && (
					<div className="space-y-3">
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
								{/* Live Analyzer Section */}
								{aiMatchData?.data?.data?.recommendation && (
									<div className="mb-6 bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/20">
										<div className="flex items-start gap-4">
											<div className="shrink-0">
												<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
													<Sparkles className="w-6 h-6 text-primary-foreground" />
												</div>
											</div>
											<div className="flex-1">
												<h3 className="text-lg font-bold text-foreground mb-2">
													Live Analyzer
												</h3>
												<p className="text-sm text-muted-foreground leading-relaxed">
													{aiMatchData.data.data.recommendation}
												</p>
											</div>
										</div>
									</div>
								)}

								{/* Incomplete Profile Warning Banner */}
								{aiMatchData?.data?.data?.criticalMissingFields &&
									aiMatchData.data.data.criticalMissingFields.length > 0 && (
										<div className="mb-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
											<div className="flex items-start gap-3">
												<AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
												<div className="flex-1">
													<h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
														Hồ sơ chưa đầy đủ
													</h3>
													<p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
														Thêm điểm IELTS/TOEFL và ngân sách để nhận gợi ý
														chính xác hơn.
													</p>
													<Button
														asChild
														variant="outline"
														size="sm"
														className="mt-3 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30"
													>
														<Link href="/profile?focus=preferences">
															Cập nhật hồ sơ
														</Link>
													</Button>
												</div>
											</div>
										</div>
									)}

								{/* Tab-Based Categories Layout */}
								<TabBasedCategories
									programs={swimLanePrograms}
									userProfile={userProfile?.data?.data}
									onSaveToggle={handleSaveToggle}
									onProgramClick={(program) => {
										setSelectedProgram(program);
										setIsDetailDrawerOpen(true);
									}}
									selectedPrograms={selectedPrograms}
									onToggleSelection={toggleProgramSelection}
									isMaxReached={isMaxReached}
									onAddToDashboard={handleAddToDashboard}
									isProgramInDashboard={isProgramInDashboard}
									onManageApplication={handleManageApplication}
								/>
							</>
						)}
					</div>
				)}

				{/* Manual Mode */}
				{activeMode === "manual" && (
					<ManualMode
						programs={swimLanePrograms}
						selectedPrograms={selectedPrograms}
						onToggleSelection={toggleProgramSelection}
						isMaxReached={isMaxReached}
						onAddToDashboard={handleAddToDashboard}
						isProgramInDashboard={isProgramInDashboard}
						onManageApplication={handleManageApplication}
					/>
				)}
			</div>

			{/* Zone 3: Compare Tray (Sticky Bottom - Checkout Style) */}
			<CompareTray
				selectedCount={selectedCount}
				maxPrograms={MAX_COMPARE_PROGRAMS}
				selectedProgramsList={selectedProgramsList}
				onRemoveProgram={toggleProgramSelection}
				onClearAll={() => setSelectedPrograms(new Set())}
				onCompare={() => setIsCompareDialogOpen(true)}
			/>

			{/* Compare Dialog */}
			<CompareDialog
				open={isCompareDialogOpen}
				onOpenChange={setIsCompareDialogOpen}
				selectedProgramsList={selectedProgramsList}
				onRemoveProgram={(id) => {
					toggleProgramSelection(id);
					// Close dialog if no programs left
					if (selectedPrograms.size <= 1) {
						setIsCompareDialogOpen(false);
					}
				}}
				onAddToDashboard={handleAddToDashboard}
			/>

			{/* Program Detail Drawer for AI Mode */}
			<ProgramDetailDrawer
				programId={selectedProgram?.id || null}
				open={isDetailDrawerOpen}
				onOpenChange={setIsDetailDrawerOpen}
				onCompare={(id) => {
					toggleProgramSelection(id);
					setIsDetailDrawerOpen(false);
				}}
				onAddToDashboard={handleAddToDashboard}
			/>
		</PageTransition>
	);
}
