"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ScholarshipCompareDialog } from "@/components/explore/scholarship/ScholarshipCompareDialog";
import { ScholarshipCompareTray } from "@/components/explore/scholarship/ScholarshipCompareTray";
import { ScholarshipManualMode } from "@/components/explore/scholarship/ScholarshipManualMode";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import { useGetApplications } from "@/lib/generated/api/endpoints/scholarship-applications/scholarship-applications";
import type {
	ScholarshipApplicationListResponse,
	ScholarshipListItemResponse,
} from "@/lib/generated/api/models";

export function ScholarshipExploreClient() {
	const router = useRouter();
	const tToast = useTranslations("explore.toast");

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

	const handleAddToDashboard = (scholarshipId: string) => {
		if (applicationsByScholarshipId.has(scholarshipId)) {
			toast.info(tToast("scholarshipAlreadyAddedTitle"), {
				description: tToast("scholarshipAlreadyAddedDesc"),
			});
			return;
		}
		const params = new URLSearchParams({
			tab: "scholarships",
			id: "new",
			scholarshipId,
		});
		router.push(`/dashboard/applications?${params.toString()}`);
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
					isScholarshipInDashboard={isScholarshipInDashboard}
					onManageApplication={handleManageApplication}
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
