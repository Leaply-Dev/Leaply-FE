/**
 * @fileoverview Applications client component with outer tabs for Programs and Scholarships.
 * Each tab has its own sidebar and dashboard views.
 * Layout: Desktop (sidebar + dashboard), Mobile (sidebar only).
 *
 * This component is wrapped in Suspense by the page to handle useSearchParams() properly.
 */

"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Award, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { ApplicationDashboard } from "@/components/ApplicationDashboard";
import { ApplicationSidebar } from "@/components/ApplicationSidebar";
import { ScholarshipApplicationList } from "@/components/scholarships/ScholarshipApplicationList";
import { ScholarshipDashboard } from "@/components/scholarships/ScholarshipDashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getGetApplications1QueryKey,
	useDeleteApplication1,
	useGetApplications1,
	useUpdateApplication1,
} from "@/lib/generated/api/endpoints/applications/applications";
import {
	getGetApplicationsQueryKey as getScholarshipApplicationsQueryKey,
	useDeleteApplication as useDeleteScholarshipApplication,
	useGetApplications as useGetScholarshipApplications,
} from "@/lib/generated/api/endpoints/scholarship-applications/scholarship-applications";
import type {
	ApplicationListResponse,
	ScholarshipApplicationListResponse,
} from "@/lib/generated/api/models";
import { useApplicationStore } from "@/lib/store/applicationStore";
import { useScholarshipApplicationStore } from "@/lib/store/scholarshipApplicationStore";

type MainTab = "programs" | "scholarships";

export function ApplicationsClient() {
	const t = useTranslations("applications");
	const queryClient = useQueryClient();
	const router = useRouter();
	const searchParams = useSearchParams();

	// Get tab from URL, default to "programs"
	const mainTab = (searchParams.get("tab") as MainTab) || "programs";

	// Handle tab change by updating URL
	// Use replace instead of push to avoid history stack issues and re-render flashes
	const handleTabChange = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", value);
		router.replace(`/dashboard/applications?${params.toString()}`, {
			scroll: false,
		});
	};

	// Program applications state
	const {
		selectedApplicationId,
		setSelectedApplicationId,
		sidebarCollapsed,
		toggleSidebar,
	} = useApplicationStore();

	// Scholarship applications state
	const {
		selectedApplicationId: selectedScholarshipId,
		setSelectedApplicationId: setSelectedScholarshipId,
	} = useScholarshipApplicationStore();

	// Fetch program applications
	const {
		data: applicationsResponse,
		isLoading: isLoadingPrograms,
		error: programsError,
	} = useGetApplications1();

	// Fetch scholarship applications
	const {
		data: scholarshipAppsResponse,
		isLoading: isLoadingScholarships,
		error: scholarshipsError,
	} = useGetScholarshipApplications();

	// Parse program applications
	const appsData =
		unwrapResponse<ApplicationListResponse>(applicationsResponse);
	const applications = appsData?.applications ?? [];

	// Parse scholarship applications
	const scholarshipAppsData =
		unwrapResponse<ScholarshipApplicationListResponse>(scholarshipAppsResponse);
	const scholarshipApplications = scholarshipAppsData?.applications ?? [];

	// Helper to check if any application needs tips polling (created <60s ago, no tips)
	const hasPendingTips = useMemo(() => {
		const now = Date.now();
		const allApps = [...applications, ...scholarshipApplications];
		return allApps.some(
			(app) =>
				!app.improvementTips?.tips?.length &&
				app.createdAt &&
				now - new Date(app.createdAt).getTime() < 60000,
		);
	}, [applications, scholarshipApplications]);

	// Poll for tips updates when there are pending applications
	useEffect(() => {
		if (!hasPendingTips) return;

		const interval = setInterval(() => {
			queryClient.invalidateQueries({
				queryKey: getGetApplications1QueryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: getScholarshipApplicationsQueryKey(),
			});
		}, 5000);

		return () => clearInterval(interval);
	}, [hasPendingTips, queryClient]);

	const { mutateAsync: updateStatus } = useUpdateApplication1();
	const { mutateAsync: deleteApp } = useDeleteApplication1();
	const { mutateAsync: deleteScholarshipApp } =
		useDeleteScholarshipApplication();

	// Get application id from URL param (for deep linking from dashboard)
	const urlApplicationId = searchParams.get("id");

	// Auto-select application: prioritize URL param, then first application
	useEffect(() => {
		if (applications.length === 0) return;

		// If URL has id param and it exists in applications, select it
		if (
			urlApplicationId &&
			applications.find((app) => app.id === urlApplicationId)
		) {
			if (selectedApplicationId !== urlApplicationId) {
				setSelectedApplicationId(urlApplicationId);
			}
			return;
		}

		// Otherwise auto-select first if none selected or current selection invalid
		if (
			!selectedApplicationId ||
			!applications.find((app) => app.id === selectedApplicationId)
		) {
			setSelectedApplicationId(applications[0].id ?? null);
		}
	}, [
		applications,
		selectedApplicationId,
		setSelectedApplicationId,
		urlApplicationId,
	]);

	// Auto-select first scholarship application if none selected
	useEffect(() => {
		if (
			scholarshipApplications.length > 0 &&
			(!selectedScholarshipId ||
				!scholarshipApplications.find(
					(app) => app.id === selectedScholarshipId,
				))
		) {
			setSelectedScholarshipId(scholarshipApplications[0].id ?? null);
		}
	}, [
		scholarshipApplications,
		selectedScholarshipId,
		setSelectedScholarshipId,
	]);

	const selectedApplication =
		applications.find((app) => app.id === selectedApplicationId) ?? null;

	const handleUpdateStatus = async (status: string) => {
		if (selectedApplication?.id) {
			try {
				await updateStatus({
					id: selectedApplication.id,
					data: {
						status: status as "planning" | "writing" | "submitted",
					},
				});
				await queryClient.invalidateQueries({
					queryKey: getGetApplications1QueryKey(),
				});
				return true;
			} catch {
				toast.error(t("toast.statusUpdateFailed"));
				return false;
			}
		}
		return false;
	};

	const handleDelete = async () => {
		if (selectedApplication?.id) {
			try {
				await deleteApp({ id: selectedApplication.id });
				await queryClient.invalidateQueries({
					queryKey: getGetApplications1QueryKey(),
				});
				return true;
			} catch {
				toast.error(t("toast.deleteFailed"));
				return false;
			}
		}
		return false;
	};

	const handleDeleteScholarship = async () => {
		if (selectedScholarshipId) {
			try {
				await deleteScholarshipApp({ applicationId: selectedScholarshipId });
				setSelectedScholarshipId(null);
				await queryClient.invalidateQueries({
					queryKey: getScholarshipApplicationsQueryKey(),
				});
				return true;
			} catch {
				toast.error(t("toast.deleteScholarshipFailed"));
				return false;
			}
		}
		return false;
	};

	const apiError = programsError || scholarshipsError;

	return (
		<>
			<Tabs value={mainTab} onValueChange={handleTabChange}>
				<div className="p-4 lg:p-0">
					<div className="flex min-h-[calc(100vh-16rem)]">
						{/* Desktop Sidebar - Unified sticky container */}
						<div
							className={`shrink-0 hidden lg:block h-[calc(100vh-5rem)] sticky top-0 transition-all duration-300 ${
								sidebarCollapsed ? "w-16" : "w-full lg:w-80 xl:w-96"
							}`}
						>
							<div className="flex flex-col h-full bg-card border-r border-border relative">
								{/* Collapse Toggle Button */}
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											onClick={toggleSidebar}
											className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-muted"
										>
											{sidebarCollapsed ? (
												<ChevronRight className="h-3 w-3" />
											) : (
												<ChevronLeft className="h-3 w-3" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent side="right">
										{sidebarCollapsed
											? t("sidebar.expand")
											: t("sidebar.collapse")}
									</TooltipContent>
								</Tooltip>

								{sidebarCollapsed ? (
									/* Collapsed Sidebar */
									<div className="flex flex-col items-center py-4 gap-2">
										{/* Tab Icons */}
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant={
														mainTab === "programs" ? "secondary" : "ghost"
													}
													size="icon"
													onClick={() => handleTabChange("programs")}
													className="relative"
												>
													<GraduationCap className="h-4 w-4" />
													{applications.length > 0 && (
														<span className="absolute -top-1 -right-1 text-[10px] bg-primary text-primary-foreground px-1 rounded-full min-w-[16px]">
															{applications.length}
														</span>
													)}
												</Button>
											</TooltipTrigger>
											<TooltipContent side="right">
												{t("sidebar.programs")}
											</TooltipContent>
										</Tooltip>

										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant={
														mainTab === "scholarships" ? "secondary" : "ghost"
													}
													size="icon"
													onClick={() => handleTabChange("scholarships")}
													className="relative"
												>
													<Award className="h-4 w-4" />
													{scholarshipApplications.length > 0 && (
														<span className="absolute -top-1 -right-1 text-[10px] bg-primary text-primary-foreground px-1 rounded-full min-w-[16px]">
															{scholarshipApplications.length}
														</span>
													)}
												</Button>
											</TooltipTrigger>
											<TooltipContent side="right">
												{t("sidebar.scholarships")}
											</TooltipContent>
										</Tooltip>

										<div className="w-8 border-t border-border my-2" />

										{/* Mini Application List */}
										<div className="flex-1 overflow-y-auto w-full px-2">
											{mainTab === "programs" ? (
												<ApplicationSidebar
													collapsed
													withWrapper={false}
													applications={applications}
													selectedId={selectedApplicationId}
													onSelectApplication={setSelectedApplicationId}
													isLoading={isLoadingPrograms}
												/>
											) : (
												<ScholarshipApplicationList
													collapsed
													withWrapper={false}
													applications={scholarshipApplications}
													selectedId={selectedScholarshipId}
													onSelectApplication={setSelectedScholarshipId}
													isLoading={isLoadingScholarships}
												/>
											)}
										</div>
									</div>
								) : (
									/* Expanded Sidebar */
									<>
										{/* Tabs Header */}
										<div className="p-4 border-b border-border">
											<TabsList className="w-full grid grid-cols-2">
												<TabsTrigger value="programs" className="gap-2">
													<GraduationCap className="w-4 h-4" />
													{t("sidebar.programs")}
													{applications.length > 0 && (
														<span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
															{applications.length}
														</span>
													)}
												</TabsTrigger>
												<TabsTrigger value="scholarships" className="gap-2">
													<Award className="w-4 h-4" />
													{t("sidebar.scholarships")}
													{scholarshipApplications.length > 0 && (
														<span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
															{scholarshipApplications.length}
														</span>
													)}
												</TabsTrigger>
											</TabsList>
										</div>

										{/* Sidebar Content - Conditional */}
										<div className="flex-1 min-h-0 flex flex-col">
											{mainTab === "programs" ? (
												<ApplicationSidebar
													withWrapper={false}
													applications={applications}
													selectedId={selectedApplicationId}
													onSelectApplication={setSelectedApplicationId}
													isLoading={isLoadingPrograms}
												/>
											) : (
												<ScholarshipApplicationList
													withWrapper={false}
													applications={scholarshipApplications}
													selectedId={selectedScholarshipId}
													onSelectApplication={setSelectedScholarshipId}
													isLoading={isLoadingScholarships}
												/>
											)}
										</div>
									</>
								)}
							</div>
						</div>

						{/* Mobile - Full width with tabs */}
						<div className="lg:hidden w-full">
							<div className="p-4 border-b border-border bg-card">
								<TabsList className="w-full grid grid-cols-2">
									<TabsTrigger value="programs" className="gap-2">
										<GraduationCap className="w-4 h-4" />
										{t("sidebar.programs")}
										{applications.length > 0 && (
											<span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
												{applications.length}
											</span>
										)}
									</TabsTrigger>
									<TabsTrigger value="scholarships" className="gap-2">
										<Award className="w-4 h-4" />
										{t("sidebar.scholarships")}
										{scholarshipApplications.length > 0 && (
											<span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
												{scholarshipApplications.length}
											</span>
										)}
									</TabsTrigger>
								</TabsList>
							</div>
							{mainTab === "programs" ? (
								<ApplicationSidebar
									applications={applications}
									selectedId={selectedApplicationId}
									onSelectApplication={setSelectedApplicationId}
									isLoading={isLoadingPrograms}
								/>
							) : (
								<ScholarshipApplicationList
									applications={scholarshipApplications}
									selectedId={selectedScholarshipId}
									onSelectApplication={setSelectedScholarshipId}
									isLoading={isLoadingScholarships}
								/>
							)}
						</div>

						{/* Dashboard - Desktop only */}
						<div className="hidden lg:block flex-1">
							{mainTab === "programs" ? (
								<ApplicationDashboard
									application={selectedApplication}
									onUpdateStatus={handleUpdateStatus}
									onDelete={handleDelete}
								/>
							) : (
								<ScholarshipDashboard
									applicationId={selectedScholarshipId}
									onDelete={handleDeleteScholarship}
								/>
							)}
						</div>
					</div>
				</div>
			</Tabs>

			{/* Error Toast */}
			{apiError ? (
				<div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg">
					{apiError instanceof Error ? apiError.message : t("toast.loadFailed")}
				</div>
			) : null}
		</>
	);
}
