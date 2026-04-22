/**
 * @fileoverview Applications client component — unified essay sidebar + dashboard.
 * One sidebar lists program + scholarship essays together. Dashboard renders
 * whichever kind matches the current selection.
 *
 * This component is wrapped in Suspense by the page to handle useSearchParams() properly.
 */

"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { ApplicationDashboard } from "@/components/ApplicationDashboard";
import { NewEssayWorkspace } from "@/components/applications/NewEssayWorkspace";
import { type EssayItemKind, EssayList } from "@/components/essays/EssayList";
import { ScholarshipDashboard } from "@/components/scholarships/ScholarshipDashboard";
import { Button } from "@/components/ui/button";
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

	const urlTab = searchParams.get("tab") as MainTab | null;
	const urlApplicationId = searchParams.get("id");
	const urlProgramId = searchParams.get("programId") ?? undefined;

	// Tracks when navigation was triggered internally (via handleSelect) so the
	// deep-link effect doesn't revert the store before the URL has caught up.
	const programmaticNavRef = useRef(false);

	const {
		selectedApplicationId,
		setSelectedApplicationId,
		sidebarCollapsed,
		toggleSidebar,
	} = useApplicationStore();

	const {
		selectedApplicationId: selectedScholarshipId,
		setSelectedApplicationId: setSelectedScholarshipId,
	} = useScholarshipApplicationStore();

	const {
		data: applicationsResponse,
		isLoading: isLoadingPrograms,
		error: programsError,
	} = useGetApplications1();

	const {
		data: scholarshipAppsResponse,
		isLoading: isLoadingScholarships,
		error: scholarshipsError,
	} = useGetScholarshipApplications();

	const appsData =
		unwrapResponse<ApplicationListResponse>(applicationsResponse);
	const applications = useMemo(
		() => appsData?.applications ?? [],
		[appsData?.applications],
	);

	const scholarshipAppsData =
		unwrapResponse<ScholarshipApplicationListResponse>(scholarshipAppsResponse);
	const scholarshipApplications = useMemo(
		() => scholarshipAppsData?.applications ?? [],
		[scholarshipAppsData?.applications],
	);

	const { mutateAsync: deleteApp } = useDeleteApplication1();
	const { mutateAsync: deleteScholarshipApp } =
		useDeleteScholarshipApplication();

	// Determine current kind: URL `tab` wins, fall back to whichever store has an id,
	// and default to program when both lists are empty.
	const activeKind: EssayItemKind = useMemo(() => {
		if (urlTab === "scholarships") return "scholarship";
		if (urlTab === "programs") return "program";
		if (selectedScholarshipId && !selectedApplicationId) return "scholarship";
		return "program";
	}, [urlTab, selectedScholarshipId, selectedApplicationId]);

	const selectedId =
		activeKind === "program" ? selectedApplicationId : selectedScholarshipId;

	const updateUrl = useCallback(
		(kind: EssayItemKind, id: string | null) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("tab", kind === "program" ? "programs" : "scholarships");
			if (id) params.set("id", id);
			else params.delete("id");
			router.replace(`/dashboard/applications?${params.toString()}`, {
				scroll: false,
			});
		},
		[router, searchParams],
	);

	const handleSelect = useCallback(
		(id: string, kind: EssayItemKind) => {
			programmaticNavRef.current = true;
			if (kind === "program") {
				setSelectedApplicationId(id);
				setSelectedScholarshipId(null);
			} else {
				setSelectedScholarshipId(id);
				setSelectedApplicationId(null);
			}
			updateUrl(kind, id);
		},
		[setSelectedApplicationId, setSelectedScholarshipId, updateUrl],
	);

	// Honour URL deep-link on mount / navigation
	useEffect(() => {
		// Skip sync when this render was triggered by our own handleSelect call.
		// The URL update from router.replace is async — if we don't guard here, the
		// effect sees the old urlApplicationId and reverts the store before the URL
		// has a chance to update.
		if (programmaticNavRef.current) {
			programmaticNavRef.current = false;
			return;
		}
		if (!urlApplicationId) return;
		if (applications.find((app) => app.id === urlApplicationId)) {
			if (selectedApplicationId !== urlApplicationId) {
				setSelectedApplicationId(urlApplicationId);
				setSelectedScholarshipId(null);
			}
			return;
		}
		if (scholarshipApplications.find((app) => app.id === urlApplicationId)) {
			if (selectedScholarshipId !== urlApplicationId) {
				setSelectedScholarshipId(urlApplicationId);
				setSelectedApplicationId(null);
			}
		}
	}, [
		urlApplicationId,
		applications,
		scholarshipApplications,
		selectedApplicationId,
		selectedScholarshipId,
		setSelectedApplicationId,
		setSelectedScholarshipId,
	]);

	// Auto-select first item when nothing is selected yet
	useEffect(() => {
		if (urlApplicationId) return;
		if (selectedApplicationId || selectedScholarshipId) return;
		if (applications.length > 0) {
			const firstId = applications[0].id ?? null;
			if (firstId) handleSelect(firstId, "program");
		} else if (scholarshipApplications.length > 0) {
			const firstId = scholarshipApplications[0].id ?? null;
			if (firstId) handleSelect(firstId, "scholarship");
		} else if (!isLoadingPrograms && !isLoadingScholarships) {
			// Auto redirect to new essay if user has no applications
			updateUrl("program", "new");
		}
	}, [
		urlApplicationId,
		applications,
		scholarshipApplications,
		selectedApplicationId,
		selectedScholarshipId,
		isLoadingPrograms,
		isLoadingScholarships,
		handleSelect,
		updateUrl,
	]);

	const selectedApplication =
		applications.find((app) => app.id === selectedApplicationId) ?? null;

	const handleDelete = async () => {
		if (selectedApplication?.id) {
			try {
				await deleteApp({ id: selectedApplication.id });
				setSelectedApplicationId(null);
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

	const handleCreated = useCallback(
		({
			applicationId,
			kind,
		}: {
			applicationId: string;
			kind: EssayItemKind;
		}) => {
			handleSelect(applicationId, kind);
		},
		[handleSelect],
	);

	const handleCancelNew = useCallback(() => {
		if (applications.length > 0) {
			const firstId = applications[0].id ?? null;
			if (firstId) handleSelect(firstId, "program");
		} else if (scholarshipApplications.length > 0) {
			const firstId = scholarshipApplications[0].id ?? null;
			if (firstId) handleSelect(firstId, "scholarship");
		} else {
			setSelectedApplicationId(null);
			setSelectedScholarshipId(null);
			updateUrl("program", null);
		}
	}, [
		applications,
		scholarshipApplications,
		handleSelect,
		updateUrl,
		setSelectedApplicationId,
		setSelectedScholarshipId,
	]);

	const apiError = programsError || scholarshipsError;
	const isLoading = isLoadingPrograms || isLoadingScholarships;

	return (
		<>
			<div className="p-4 lg:p-0 h-[calc(100vh-4rem)]">
				<div className="flex h-full">
					{/* Desktop Sidebar */}
					<div
						className={`shrink-0 hidden lg:block h-full sticky top-0 transition-all duration-300 ${
							sidebarCollapsed ? "w-16" : "w-full lg:w-80 xl:w-96"
						}`}
					>
						<div className="flex flex-col h-full bg-card border-r border-border relative">
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
								<div className="flex flex-col items-center py-4 gap-2">
									<div className="flex-1 overflow-y-auto w-full px-2">
										<EssayList
											collapsed
											withWrapper={false}
											applications={applications}
											scholarshipApplications={scholarshipApplications}
											selectedId={selectedId}
											onSelect={handleSelect}
											isLoading={isLoading}
										/>
									</div>
								</div>
							) : (
								<div className="flex-1 min-h-0 flex flex-col">
									<EssayList
										withWrapper={false}
										applications={applications}
										scholarshipApplications={scholarshipApplications}
										selectedId={selectedId}
										onSelect={handleSelect}
										isLoading={isLoading}
									/>
								</div>
							)}
						</div>
					</div>

					{/* Mobile */}
					<div className="lg:hidden w-full">
						<EssayList
							applications={applications}
							scholarshipApplications={scholarshipApplications}
							selectedId={selectedId}
							onSelect={handleSelect}
							isLoading={isLoading}
						/>
					</div>

					{/* Dashboard - Desktop only */}
					<div className="hidden lg:block flex-1 h-full overflow-hidden">
						{selectedId === "new" ? (
							<NewEssayWorkspace
								onCreated={handleCreated}
								onCancel={handleCancelNew}
								initialProgramId={urlProgramId}
							/>
						) : activeKind === "program" ? (
							<ApplicationDashboard
								application={selectedApplication}
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

			{apiError ? (
				<div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg">
					{apiError instanceof Error ? apiError.message : t("toast.loadFailed")}
				</div>
			) : null}
		</>
	);
}
