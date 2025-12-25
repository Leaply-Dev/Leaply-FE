"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { ApplicationDashboard } from "@/components/ApplicationDashboard";
import { ApplicationSidebar } from "@/components/ApplicationSidebar";
import { PageTransition } from "@/components/PageTransition";
import { useApplicationsStore } from "@/lib/store/applicationsStore";

export default function ApplicationsPage() {
	const t = useTranslations("applications");
	const {
		applications,
		isLoading,
		error,
		selectedApplicationId,
		fetchApplications,
		setSelectedApplication,
		updateApplicationStatus,
		removeApplication,
		getSelectedApplication,
	} = useApplicationsStore();

	useEffect(() => {
		fetchApplications();
	}, [fetchApplications]);

	const selectedApplication = getSelectedApplication();

	const handleUpdateStatus = async (status: string) => {
		if (selectedApplicationId) {
			return await updateApplicationStatus(selectedApplicationId, {
				status: status as "planning" | "writing" | "submitted",
			});
		}
		return false;
	};

	const handleDelete = async () => {
		if (selectedApplicationId) {
			return await removeApplication(selectedApplicationId);
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
						onSelectApplication={setSelectedApplication}
						isLoading={isLoading}
					/>
				</div>

				{/* Mobile Sidebar - Toggle view */}
				<div className="lg:hidden w-full min-h-screen">
					{!selectedApplicationId ? (
						<ApplicationSidebar
							applications={applications}
							selectedId={selectedApplicationId}
							onSelectApplication={setSelectedApplication}
							isLoading={isLoading}
						/>
					) : (
						<div className="flex flex-col">
							{/* Mobile back button */}
							<div className="p-4 border-b border-border bg-card lg:hidden sticky top-0 z-10">
								<button
									type="button"
									onClick={() => setSelectedApplication(null)}
									className="flex items-center gap-2 text-sm text-primary hover:text-foreground transition-colors"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										role="img"
										aria-label="Back to Applications"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 19l-7-7 7-7"
										/>
									</svg>
									{t("backToApplications")}
								</button>
							</div>
							<ApplicationDashboard
								application={selectedApplication}
								onUpdateStatus={handleUpdateStatus}
								onDelete={handleDelete}
							/>
						</div>
					)}
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
			{error && (
				<div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg">
					{error}
				</div>
			)}
		</PageTransition>
	);
}
