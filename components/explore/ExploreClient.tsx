"use client";

import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useState } from "react";
import { CompareDialog } from "@/components/explore/CompareDrawer";
import { CompareTray } from "@/components/explore/CompareTray";
import { ManualMode } from "@/components/explore/ManualMode";
import { PageTransition } from "@/components/PageTransition";
import type { ProgramListItemResponse } from "@/lib/generated/api/models";

export function ExploreClient() {
	const router = useRouter();

	const handleAddToDashboard = (programId: string) => {
		posthog.capture("program_apply_clicked", {
			program_id: programId,
		});
		router.push(
			`/dashboard/applications?tab=programs&id=new&programId=${programId}`,
		);
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
