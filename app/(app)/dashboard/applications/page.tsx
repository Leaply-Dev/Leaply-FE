/**
 * @fileoverview Applications page with sidebar and dashboard views.
 * Manages application list state, selection, and mutations (update/delete).
 * Layout: Desktop (sidebar + dashboard), Mobile (sidebar only).
 */

"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { ApplicationDashboard } from "@/components/ApplicationDashboard";
import { ApplicationSidebar } from "@/components/ApplicationSidebar";
import { PageTransition } from "@/components/PageTransition";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getGetApplicationsQueryKey,
	useDeleteApplication,
	useGetApplications,
	useUpdateApplication,
} from "@/lib/generated/api/endpoints/applications/applications";
import type { ApplicationListResponse } from "@/lib/generated/api/models";
import { useApplicationStore } from "@/lib/store/applicationStore";

export default function ApplicationsPage() {
	const queryClient = useQueryClient();
	const { selectedApplicationId, setSelectedApplicationId } =
		useApplicationStore();

	const {
		data: applicationsResponse,
		isLoading,
		error: apiError,
	} = useGetApplications();

	const { mutateAsync: updateStatus } = useUpdateApplication();
	const { mutateAsync: deleteApp } = useDeleteApplication();

	const appsData =
		unwrapResponse<ApplicationListResponse>(applicationsResponse);
	const applications = appsData?.applications ?? [];

	// Auto-select first application if none selected
	useEffect(() => {
		if (
			applications.length > 0 &&
			(!selectedApplicationId ||
				!applications.find((app) => app.id === selectedApplicationId))
		) {
			setSelectedApplicationId(applications[0].id ?? null);
		}
	}, [applications, selectedApplicationId, setSelectedApplicationId]);

	const selectedApplication =
		applications.find((app) => app.id === selectedApplicationId) ?? null;

	const handleUpdateStatus = async (status: string) => {
		if (selectedApplication) {
			try {
				await updateStatus({
					id: selectedApplication.id!,
					data: {
						status: status as "planning" | "writing" | "submitted",
					},
				});
				await queryClient.invalidateQueries({
					queryKey: getGetApplicationsQueryKey(),
				});
				return true;
			} catch (error) {
				toast.error("Failed to update status");
				return false;
			}
		}
		return false;
	};

	const handleDelete = async () => {
		if (selectedApplication) {
			try {
				await deleteApp({ id: selectedApplication.id! });
				await queryClient.invalidateQueries({
					queryKey: getGetApplicationsQueryKey(),
				});
				return true;
			} catch (error) {
				toast.error("Failed to delete application");
				return false;
			}
		}
		return false;
	};

	return (
		<PageTransition>
			<div className="flex min-h-[calc(100vh-16rem)]">
				{/* Sidebar - Fixed width on desktop, full width on mobile */}
				<div className="w-full lg:w-80 xl:w-96 shrink-0 hidden lg:block h-[calc(100vh-5rem)] sticky top-0">
					<ApplicationSidebar
						applications={applications}
						selectedId={selectedApplicationId}
						onSelectApplication={setSelectedApplicationId}
						isLoading={isLoading}
					/>
				</div>

				{/* Mobile Sidebar - Toggle view */}
				<div className="lg:hidden w-full min-h-screen">
					<ApplicationSidebar
						applications={applications}
						selectedId={selectedApplicationId}
						onSelectApplication={setSelectedApplicationId}
						isLoading={isLoading}
					/>
				</div>

				{/* Main Dashboard - Desktop only */}
				<div className="hidden lg:block flex-1">
					<ApplicationDashboard
						application={selectedApplication}
						onUpdateStatus={handleUpdateStatus}
						onDelete={handleDelete}
					/>
				</div>
			</div>

			{/* Error Toast */}
			{apiError ? (
				<div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg">
					{apiError instanceof Error
						? apiError.message
						: "Failed to load applications"}
				</div>
			) : null}
		</PageTransition>
	);
}
