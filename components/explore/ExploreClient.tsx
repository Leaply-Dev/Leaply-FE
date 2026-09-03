"use client";

import { useMemo, useState } from "react";
import { CompareDialog } from "@/components/explore/CompareDrawer";
import { CompareTray } from "@/components/explore/CompareTray";
import { ManualMode } from "@/components/explore/ManualMode";
import { PageTransition } from "@/components/PageTransition";
import { analytics } from "@/lib/analytics/analytics";
import type { ProgramListItemResponse } from "@/lib/generated/api/models";
import { MAX_COMPARE_ITEMS, useCompareStore } from "@/lib/store/compareStore";

export function ExploreClient() {
	const selectedIds = useCompareStore((state) => state.selectedIds);
	const clearSelection = useCompareStore((state) => state.clear);
	const removeSelection = useCompareStore((state) => state.remove);

	const [programsById, setProgramsById] = useState<
		Map<string, ProgramListItemResponse>
	>(new Map());
	const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);

	const selectedProgramsList = useMemo(
		() =>
			Array.from(selectedIds)
				.map((id) => programsById.get(id))
				.filter((p): p is ProgramListItemResponse => p !== undefined),
		[selectedIds, programsById],
	);

	const handleRegisterProgram = (program: ProgramListItemResponse) => {
		setProgramsById((prev) => {
			if (!program.id || prev.has(program.id)) return prev;
			const next = new Map(prev);
			next.set(program.id, program);
			return next;
		});
	};

	const selectedCount = selectedIds.size;

	return (
		<PageTransition className="flex flex-col min-h-screen">
			<div className="flex-1 container mx-auto px-6 py-6 pb-24">
				<ManualMode onRegisterProgram={handleRegisterProgram} />
			</div>

			{/* Compare Tray (Sticky Bottom) */}
			<CompareTray
				selectedCount={selectedCount}
				maxItems={MAX_COMPARE_ITEMS}
				items={selectedProgramsList.map((program) => ({
					id: program.id ?? "",
					label: `${program.institution?.name ?? ""} - ${program.name ?? ""}`,
				}))}
				onRemoveItem={(id) => removeSelection(id)}
				onClearAll={() => clearSelection()}
				onCompare={() => {
					analytics.track("program_compare_opened", {
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
					removeSelection(id);
					if (selectedIds.size <= 1) {
						setIsCompareDialogOpen(false);
					}
				}}
			/>
		</PageTransition>
	);
}
