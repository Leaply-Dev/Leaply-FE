"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ApplicationDashboard } from "@/components/ApplicationDashboard";
import { ApplicationSidebar } from "@/components/ApplicationSidebar";
import { PageTransition } from "@/components/PageTransition";
import {
	type EnhancedApplication,
	mockEnhancedApplications,
} from "@/lib/data/enhancedApplications";
import { useApplicationsStore } from "@/lib/store/applicationsStore";

export default function ApplicationsPage() {
	const t = useTranslations("applications");
	const { applications, setApplications } = useApplicationsStore();
	const [selectedApplicationId, setSelectedApplicationId] = useState<
		string | null
	>(null);
	const [enhancedApplications, setEnhancedApplications] = useState<
		EnhancedApplication[]
	>([]);

	useEffect(() => {
		// Initialize applications with enhanced data
		setEnhancedApplications(mockEnhancedApplications);

		// Also update the store with base applications
		if (applications.length === 0) {
			setApplications(mockEnhancedApplications);
		}

		// Auto-select first application if none selected
		if (!selectedApplicationId && mockEnhancedApplications.length > 0) {
			setSelectedApplicationId(mockEnhancedApplications[0].id);
		}
	}, [applications.length, setApplications, selectedApplicationId]);

	const selectedApplication =
		enhancedApplications.find((app) => app.id === selectedApplicationId) ||
		null;

	const handleNewApplication = () => {
		// TODO: Implement new application creation
		console.log("New application clicked");
	};

	return (
		<PageTransition>
			<div className="flex min-h-[calc(100vh-16rem)]">
				{/* Sidebar - Fixed width on desktop, full width on mobile */}
				<div className="w-full lg:w-80 xl:w-96 shrink-0 hidden lg:block h-[calc(100vh-5rem)] sticky top-0">
					<ApplicationSidebar
						applications={enhancedApplications}
						selectedId={selectedApplicationId}
						onSelectApplication={setSelectedApplicationId}
						onNewApplication={handleNewApplication}
					/>
				</div>

				{/* Mobile Sidebar - Toggle view */}
				<div className="lg:hidden w-full min-h-screen">
					{!selectedApplicationId ? (
						<ApplicationSidebar
							applications={enhancedApplications}
							selectedId={selectedApplicationId}
							onSelectApplication={setSelectedApplicationId}
							onNewApplication={handleNewApplication}
						/>
					) : (
						<div className="flex flex-col">
							{/* Mobile back button */}
							<div className="p-4 border-b border-border bg-card lg:hidden sticky top-0 z-10">
								<button
									type="button"
									onClick={() => setSelectedApplicationId(null)}
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
							<ApplicationDashboard application={selectedApplication} />
						</div>
					)}
				</div>

				{/* Main Dashboard - Desktop only */}
				<div className="hidden lg:block flex-1">
					<ApplicationDashboard application={selectedApplication} />
				</div>
			</div>
		</PageTransition>
	);
}
