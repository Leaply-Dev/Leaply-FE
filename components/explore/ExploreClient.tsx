"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useState } from "react";
import { toast } from "sonner";
import { CompareDialog } from "@/components/explore/CompareDrawer";
import { CompareTray } from "@/components/explore/CompareTray";
import { ManualMode } from "@/components/explore/ManualMode";
import { PageTransition } from "@/components/PageTransition";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getGetApplications1QueryKey,
	useCreateApplication1,
	useGetApplications1,
} from "@/lib/generated/api/endpoints/applications/applications";
import { getGetHomeDataQueryKey } from "@/lib/generated/api/endpoints/home/home";
import type {
	ApplicationListResponse,
	ProgramListItemResponse,
} from "@/lib/generated/api/models";
import { useApplicationStore } from "@/lib/store/applicationStore";

export function ExploreClient() {
	const [addingProgramId, setAddingProgramId] = useState<string | null>(null);

	const router = useRouter();
	const queryClient = useQueryClient();
	const { mutate: createApplication } = useCreateApplication1();
	const { data: applicationsResponse } = useGetApplications1();
	const { setSelectedApplicationId } = useApplicationStore();

	// Get applications to check if program is already in dashboard
	const appsData =
		unwrapResponse<ApplicationListResponse>(applicationsResponse);
	const applications = appsData?.applications ?? [];
	const applicationsByProgramId = new Map(
		applications.map((app) => [app.program?.id, app.id]),
	);

	const handleAddToDashboard = (programId: string) => {
		posthog.capture("program_added_to_dashboard", {
			program_id: programId,
		});
		setAddingProgramId(programId);
		createApplication(
			{
				data: {
					programId,
				},
			},
			{
				onSuccess: async () => {
					await Promise.all([
						queryClient.invalidateQueries({
							queryKey: getGetHomeDataQueryKey(),
						}),
						queryClient.invalidateQueries({
							queryKey: getGetApplications1QueryKey(),
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
				onSettled: () => {
					setAddingProgramId(null);
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
	const [selectedProgramsMap, setSelectedProgramsMap] = useState<
		Map<string, ProgramListItemResponse>
	>(new Map());
	const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);

	const toggleProgramSelection = (
		id: string,
		program?: ProgramListItemResponse,
	) => {
		setSelectedProgramsMap((prev) => {
			const newMap = new Map(prev);
			if (newMap.has(id)) {
				newMap.delete(id);
			} else if (newMap.size < MAX_COMPARE_PROGRAMS && program) {
				newMap.set(id, program);
			}
			return newMap;
		});
	};

	const selectedPrograms = new Set(selectedProgramsMap.keys());
	const isMaxReached = selectedProgramsMap.size >= MAX_COMPARE_PROGRAMS;
	const selectedCount = selectedProgramsMap.size;
	const selectedProgramsList = Array.from(selectedProgramsMap.values());

	return (
		<PageTransition className="flex flex-col min-h-screen">
			<div className="flex-1 container mx-auto px-6 py-6 pb-24">
				<ManualMode
					selectedPrograms={selectedPrograms}
					onToggleSelection={toggleProgramSelection}
					isMaxReached={isMaxReached}
					onAddToDashboard={handleAddToDashboard}
					isProgramInDashboard={isProgramInDashboard}
					onManageApplication={handleManageApplication}
					addingProgramId={addingProgramId}
				/>
			</div>

			{/* Compare Tray (Sticky Bottom) */}
			<CompareTray
				selectedCount={selectedCount}
				maxPrograms={MAX_COMPARE_PROGRAMS}
				selectedProgramsList={selectedProgramsList}
				onRemoveProgram={toggleProgramSelection}
				onClearAll={() => setSelectedProgramsMap(new Map())}
				onCompare={() => {
					posthog.capture("program_compare_opened", {
						program_count: selectedCount,
					});
					setIsCompareDialogOpen(true);
				}}
			/>

			{/* Compare Dialog */}
			<CompareDialog
				open={isCompareDialogOpen}
				onOpenChange={setIsCompareDialogOpen}
				selectedProgramsList={selectedProgramsList}
				onRemoveProgram={(id) => {
					toggleProgramSelection(id);
					if (selectedPrograms.size <= 1) {
						setIsCompareDialogOpen(false);
					}
				}}
				onAddToDashboard={handleAddToDashboard}
			/>
		</PageTransition>
	);
}
