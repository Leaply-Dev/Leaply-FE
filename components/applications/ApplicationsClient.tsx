/**
 * @fileoverview Applications client component with outer tabs for Programs and Scholarships.
 * Each tab has its own sidebar and dashboard views.
 * Layout: Desktop (sidebar + dashboard), Mobile (sidebar only).
 *
 * This component is wrapped in Suspense by the page to handle useSearchParams() properly.
 */

"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Award, GraduationCap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { ApplicationDashboard } from "@/components/ApplicationDashboard";
import { ApplicationSidebar } from "@/components/ApplicationSidebar";
import { ScholarshipApplicationList } from "@/components/scholarships/ScholarshipApplicationList";
import { ScholarshipDashboard } from "@/components/scholarships/ScholarshipDashboard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
	const { selectedApplicationId, setSelectedApplicationId } =
		useApplicationStore();

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

	const { mutateAsync: updateStatus } = useUpdateApplication1();
	const { mutateAsync: deleteApp } = useDeleteApplication1();
	const { mutateAsync: deleteScholarshipApp } =
		useDeleteScholarshipApplication();

	// Parse program applications
	const appsData =
		unwrapResponse<ApplicationListResponse>(applicationsResponse);
	const applications = appsData?.applications ?? [];

	// Parse scholarship applications
	const scholarshipAppsData =
		unwrapResponse<ScholarshipApplicationListResponse>(scholarshipAppsResponse);
	const scholarshipApplications = scholarshipAppsData?.applications ?? [];

	// Auto-select first program application if none selected
	useEffect(() => {
		if (
			applications.length > 0 &&
			(!selectedApplicationId ||
				!applications.find((app) => app.id === selectedApplicationId))
		) {
			setSelectedApplicationId(applications[0].id ?? null);
		}
	}, [applications, selectedApplicationId, setSelectedApplicationId]);

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
		if (selectedApplication) {
			try {
				await updateStatus({
					id: selectedApplication.id!,
					data: {
						status: status as "planning" | "writing" | "submitted",
					},
				});
				await queryClient.invalidateQueries({
					queryKey: getGetApplications1QueryKey(),
				});
				return true;
			} catch {
				toast.error("Cập nhật trạng thái thất bại");
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
					queryKey: getGetApplications1QueryKey(),
				});
				return true;
			} catch {
				toast.error("Xóa đơn thất bại");
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
				toast.error("Xóa đơn học bổng thất bại");
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
						<div className="w-full lg:w-80 xl:w-96 shrink-0 hidden lg:block h-[calc(100vh-5rem)] sticky top-0">
							<div className="flex flex-col h-full bg-card border-r border-border">
								{/* Tabs Header */}
								<div className="p-4 border-b border-border">
									<TabsList className="w-full grid grid-cols-2">
										<TabsTrigger value="programs" className="gap-2">
											<GraduationCap className="w-4 h-4" />
											Chương trình
											{applications.length > 0 && (
												<span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
													{applications.length}
												</span>
											)}
										</TabsTrigger>
										<TabsTrigger value="scholarships" className="gap-2">
											<Award className="w-4 h-4" />
											Học bổng
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
							</div>
						</div>

						{/* Mobile - Full width with tabs */}
						<div className="lg:hidden w-full">
							<div className="p-4 border-b border-border bg-card">
								<TabsList className="w-full grid grid-cols-2">
									<TabsTrigger value="programs" className="gap-2">
										<GraduationCap className="w-4 h-4" />
										Chương trình
										{applications.length > 0 && (
											<span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
												{applications.length}
											</span>
										)}
									</TabsTrigger>
									<TabsTrigger value="scholarships" className="gap-2">
										<Award className="w-4 h-4" />
										Học bổng
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
					{apiError instanceof Error
						? apiError.message
						: "Không thể tải dữ liệu"}
				</div>
			) : null}
		</>
	);
}
