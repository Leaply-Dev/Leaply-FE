"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScholarshipCompareDialog } from "@/components/explore/scholarship/ScholarshipCompareDialog";
import { ScholarshipCompareTray } from "@/components/explore/scholarship/ScholarshipCompareTray";
import { ScholarshipManualMode } from "@/components/explore/scholarship/ScholarshipManualMode";
import type { ScholarshipListItemResponse } from "@/lib/generated/api/models";

export function ScholarshipExploreClient() {
	const router = useRouter();

	const handleAddToDashboard = (scholarshipId: string) => {
		const params = new URLSearchParams({
			tab: "scholarships",
			id: "new",
			scholarshipId,
		});
		router.push(`/dashboard/applications?${params.toString()}`);
	};

	// Compare state
	const MAX_COMPARE_SCHOLARSHIPS = 4;
	const [selectedScholarshipsMap, setSelectedScholarshipsMap] = useState<
		Map<string, ScholarshipListItemResponse>
	>(new Map());
	const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);

	const toggleScholarshipSelection = (
		id: string,
		scholarship?: ScholarshipListItemResponse,
	) => {
		setSelectedScholarshipsMap((prev) => {
			const newMap = new Map(prev);
			if (newMap.has(id)) {
				newMap.delete(id);
			} else if (newMap.size < MAX_COMPARE_SCHOLARSHIPS && scholarship) {
				newMap.set(id, scholarship);
			}
			return newMap;
		});
	};

	const selectedScholarships = new Set(selectedScholarshipsMap.keys());
	const isMaxReached = selectedScholarshipsMap.size >= MAX_COMPARE_SCHOLARSHIPS;
	const selectedCount = selectedScholarshipsMap.size;
	const selectedScholarshipsList = Array.from(selectedScholarshipsMap.values());

	return (
		<div className="flex flex-col min-h-full">
			<div className="flex-1 container mx-auto px-6 py-6 pb-24">
				<ScholarshipManualMode
					selectedScholarships={selectedScholarships}
					onToggleSelection={toggleScholarshipSelection}
					isMaxReached={isMaxReached}
					onAddToDashboard={handleAddToDashboard}
				/>
			</div>

			{/* Compare Tray (Sticky Bottom) */}
			<ScholarshipCompareTray
				selectedCount={selectedCount}
				maxScholarships={MAX_COMPARE_SCHOLARSHIPS}
				selectedScholarshipsList={selectedScholarshipsList}
				onRemoveScholarship={(id) => toggleScholarshipSelection(id)}
				onClearAll={() => setSelectedScholarshipsMap(new Map())}
				onCompare={() => setIsCompareDialogOpen(true)}
			/>

			{/* Compare Dialog */}
			<ScholarshipCompareDialog
				open={isCompareDialogOpen}
				onOpenChange={setIsCompareDialogOpen}
				selectedScholarshipsList={selectedScholarshipsList}
				onRemoveScholarship={(id) => {
					toggleScholarshipSelection(id);
					if (selectedScholarships.size <= 1) {
						setIsCompareDialogOpen(false);
					}
				}}
				onAddToDashboard={handleAddToDashboard}
			/>
		</div>
	);
}
