"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Sparkles, Table } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ScholarshipTabBasedCategories } from "@/components/explore/scholarship/ScholarshipAIMatchMode";
import { ScholarshipCompareDialog } from "@/components/explore/scholarship/ScholarshipCompareDialog";
import { ScholarshipCompareTray } from "@/components/explore/scholarship/ScholarshipCompareTray";
import { ScholarshipDetailDrawer } from "@/components/explore/scholarship/ScholarshipDetailDrawer";
import { ScholarshipManualMode } from "@/components/explore/scholarship/ScholarshipManualMode";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getGetApplicationsQueryKey,
	useCreateApplication,
	useGetApplications,
} from "@/lib/generated/api/endpoints/scholarship-applications/scholarship-applications";
import type {
	ScholarshipAiMatchResponse,
	ScholarshipApplicationListResponse,
	ScholarshipListItemResponse,
} from "@/lib/generated/api/models";
import { useScholarshipAiMatch } from "@/lib/hooks/useScholarshipAiMatch";
import { cn } from "@/lib/utils";

/**
 * Loading skeleton component for scholarship cards
 */
function ScholarshipCardSkeleton() {
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

export function ScholarshipExploreClient() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const [activeMode, setActiveMode] = useState<"ai" | "manual">("ai");
	const [addingScholarshipId, setAddingScholarshipId] = useState<string | null>(
		null,
	);

	// Detail drawer state for AI mode
	const [selectedScholarship, setSelectedScholarship] =
		useState<ScholarshipListItemResponse | null>(null);
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

	// Use TanStack Query hooks
	const {
		data: aiMatchData,
		isLoading: isLoadingAiMatch,
		error: aiMatchError,
	} = useScholarshipAiMatch();

	// Fetch existing scholarship applications to check if already applied
	const { data: scholarshipAppsResponse } = useGetApplications();
	const scholarshipAppsData =
		unwrapResponse<ScholarshipApplicationListResponse>(scholarshipAppsResponse);
	const scholarshipApplications = scholarshipAppsData?.applications ?? [];

	// Create a map of scholarshipId -> applicationId for quick lookup
	const applicationsByScholarshipId = useMemo(() => {
		const map = new Map<string, string>();
		for (const app of scholarshipApplications) {
			if (app.scholarship?.id && app.id) {
				map.set(app.scholarship.id, app.id);
			}
		}
		return map;
	}, [scholarshipApplications]);

	// Mutation for creating scholarship applications
	const createApplicationMutation = useCreateApplication();

	// Extract scholarships from AI match response
	const aiMatchResult = unwrapResponse<ScholarshipAiMatchResponse>(aiMatchData);
	const allScholarships: ScholarshipListItemResponse[] = aiMatchResult
		? [
				...(aiMatchResult.reach || []),
				...(aiMatchResult.target || []),
				...(aiMatchResult.safety || []),
			]
		: [];

	const handleAddToDashboard = (scholarshipId: string) => {
		// Check if already in dashboard
		if (applicationsByScholarshipId.has(scholarshipId)) {
			toast.info("Học bổng đã có trong danh sách", {
				description: "Bạn đã thêm học bổng này vào dashboard.",
			});
			return;
		}

		setAddingScholarshipId(scholarshipId);

		// Create scholarship application
		createApplicationMutation.mutate(
			{ data: { scholarshipId } },
			{
				onSuccess: async () => {
					// Invalidate queries to refresh data
					await queryClient.invalidateQueries({
						queryKey: getGetApplicationsQueryKey(),
					});
					toast.success("Đã thêm vào danh sách ứng tuyển", {
						description: "Học bổng đã được thêm vào dashboard của bạn.",
					});
					router.push("/dashboard/applications?tab=scholarships");
				},
				onError: () => {
					toast.error("Không thể thêm học bổng", {
						description: "Vui lòng thử lại sau.",
					});
				},
				onSettled: () => {
					setAddingScholarshipId(null);
				},
			},
		);
	};

	const handleManageApplication = (scholarshipId: string) => {
		const applicationId = applicationsByScholarshipId.get(scholarshipId);
		if (applicationId) {
			router.push(
				`/dashboard/applications?tab=scholarships&id=${applicationId}`,
			);
		} else {
			router.push("/dashboard/applications?tab=scholarships");
		}
	};

	const isScholarshipInDashboard = (scholarshipId: string) => {
		return applicationsByScholarshipId.has(scholarshipId);
	};

	// Compare state
	const MAX_COMPARE_SCHOLARSHIPS = 4;
	const [selectedScholarships, setSelectedScholarships] = useState<Set<string>>(
		new Set(),
	);
	const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);

	// Toggle scholarship selection
	const toggleScholarshipSelection = (id: string) => {
		setSelectedScholarships((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else if (newSet.size < MAX_COMPARE_SCHOLARSHIPS) {
				newSet.add(id);
			}
			return newSet;
		});
	};

	const isMaxReached = selectedScholarships.size >= MAX_COMPARE_SCHOLARSHIPS;
	const selectedCount = selectedScholarships.size;
	const selectedScholarshipsList = Array.from(selectedScholarships)
		.map((id) => allScholarships.find((s) => s.id === id))
		.filter((s): s is ScholarshipListItemResponse => !!s);

	return (
		<div className="flex flex-col min-h-full">
			{/* Compact Header with Mode Switch */}
			<div className="border-b border-border bg-card/80 backdrop-blur-sm">
				<div className="container mx-auto px-6 py-3">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-xl font-bold text-foreground">
								Explore Scholarships
							</h1>
							<p className="text-xs text-muted-foreground mt-0.5">
								{aiMatchResult?.totalMatched || allScholarships.length}{" "}
								scholarships matched to your profile
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

								{/* Loading Skeleton for Scholarship Cards */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									{[1, 2, 3].map((i) => (
										<div key={i} className="space-y-4">
											<div className="h-6 bg-muted rounded w-24 mb-4" />
											<ScholarshipCardSkeleton />
											<ScholarshipCardSkeleton />
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
								{aiMatchResult?.recommendation && (
									<div className="mb-6 bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/20">
										<div className="flex items-start gap-4">
											<div className="shrink-0">
												<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
													<Sparkles className="w-6 h-6 text-primary-foreground" />
												</div>
											</div>
											<div className="flex-1">
												<h3 className="text-lg font-bold text-foreground mb-2">
													Scholarship Advisor
												</h3>
												<p className="text-sm text-muted-foreground leading-relaxed">
													{aiMatchResult.recommendation}
												</p>
											</div>
										</div>
									</div>
								)}

								{/* Tab-Based Categories Layout */}
								<ScholarshipTabBasedCategories
									scholarships={allScholarships}
									onScholarshipClick={(scholarship) => {
										setSelectedScholarship(scholarship);
										setIsDetailDrawerOpen(true);
									}}
									selectedScholarships={selectedScholarships}
									onToggleSelection={toggleScholarshipSelection}
									isMaxReached={isMaxReached}
									onAddToDashboard={handleAddToDashboard}
									isScholarshipInDashboard={isScholarshipInDashboard}
									onManageApplication={handleManageApplication}
									addingScholarshipId={addingScholarshipId}
								/>
							</>
						)}
					</div>
				)}

				{/* Manual Mode */}
				{activeMode === "manual" && (
					<ScholarshipManualMode
						scholarships={allScholarships}
						selectedScholarships={selectedScholarships}
						onToggleSelection={toggleScholarshipSelection}
						isMaxReached={isMaxReached}
						onAddToDashboard={handleAddToDashboard}
						isScholarshipInDashboard={isScholarshipInDashboard}
						onManageApplication={handleManageApplication}
						addingScholarshipId={addingScholarshipId}
					/>
				)}
			</div>

			{/* Compare Tray (Sticky Bottom - Checkout Style) */}
			<ScholarshipCompareTray
				selectedCount={selectedCount}
				maxScholarships={MAX_COMPARE_SCHOLARSHIPS}
				selectedScholarshipsList={selectedScholarshipsList}
				onRemoveScholarship={toggleScholarshipSelection}
				onClearAll={() => setSelectedScholarships(new Set())}
				onCompare={() => setIsCompareDialogOpen(true)}
			/>

			{/* Compare Dialog */}
			<ScholarshipCompareDialog
				open={isCompareDialogOpen}
				onOpenChange={setIsCompareDialogOpen}
				selectedScholarshipsList={selectedScholarshipsList}
				onRemoveScholarship={(id) => {
					toggleScholarshipSelection(id);
					// Close dialog if no scholarships left
					if (selectedScholarships.size <= 1) {
						setIsCompareDialogOpen(false);
					}
				}}
				onAddToDashboard={handleAddToDashboard}
			/>

			{/* Scholarship Detail Drawer for AI Mode */}
			<ScholarshipDetailDrawer
				scholarshipId={selectedScholarship?.id || null}
				open={isDetailDrawerOpen}
				onOpenChange={setIsDetailDrawerOpen}
				onCompare={(id) => {
					toggleScholarshipSelection(id);
					setIsDetailDrawerOpen(false);
				}}
				onAddToDashboard={handleAddToDashboard}
			/>
		</div>
	);
}
