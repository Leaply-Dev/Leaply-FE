"use client";

import { Award, ExternalLink, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ScholarshipDetailDrawer } from "@/components/explore/scholarship/ScholarshipDetailDrawer";
import { DocumentsTab } from "@/components/scholarships/tabs/DocumentsTab";
import { EssayTab } from "@/components/scholarships/tabs/EssayTab";
import { OverviewTab } from "@/components/scholarships/tabs/OverviewTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	useGetApplication,
	useGetDocuments,
	useUpdateApplication,
} from "@/lib/generated/api/endpoints/scholarship-applications/scholarship-applications";
import type { ScholarshipApplicationResponse } from "@/lib/generated/api/models";
import { useScholarshipApplicationStore } from "@/lib/store/scholarshipApplicationStore";

interface ScholarshipDashboardProps {
	applicationId: string | null;
}

export function ScholarshipDashboard({
	applicationId,
}: ScholarshipDashboardProps) {
	const { activeTab, setActiveTab } = useScholarshipApplicationStore();
	const [isScholarshipDrawerOpen, setIsScholarshipDrawerOpen] = useState(false);

	// Fetch application details
	const {
		data: applicationResponse,
		isLoading: isLoadingApplication,
		refetch: refetchApplication,
	} = useGetApplication(applicationId ?? "", {
		query: {
			enabled: !!applicationId,
		},
	});

	// Fetch documents
	const { data: documentsResponse, isLoading: isLoadingDocuments } =
		useGetDocuments(applicationId ?? "", {
			query: {
				enabled: !!applicationId,
			},
		});

	// Update mutation
	const { mutateAsync: updateApplication } = useUpdateApplication();

	const application =
		unwrapResponse<ScholarshipApplicationResponse>(applicationResponse);
	const documents = unwrapResponse<{ documents?: unknown[] }>(
		documentsResponse,
	);
	const documentsList = Array.isArray(documents)
		? documents
		: (documents?.documents ?? []);

	// Handle status update
	const handleUpdateStatus = async (status: string): Promise<boolean> => {
		if (!applicationId) return false;
		try {
			await updateApplication({
				applicationId,
				data: { status: status as "planning" | "writing" | "submitted" },
			});
			await refetchApplication();
			return true;
		} catch {
			toast.error("Cập nhật trạng thái thất bại");
			return false;
		}
	};

	// Empty state
	if (!applicationId) {
		return (
			<div className="flex items-center justify-center h-full bg-muted/30">
				<div className="text-center">
					<Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-foreground mb-2">
						Chưa chọn học bổng
					</h3>
					<p className="text-muted-foreground">
						Chọn một đơn học bổng từ danh sách bên trái để xem chi tiết
					</p>
				</div>
			</div>
		);
	}

	// Loading state
	if (isLoadingApplication) {
		return (
			<div className="flex items-center justify-center h-full bg-muted/30">
				<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	// No application found
	if (!application) {
		return (
			<div className="flex items-center justify-center h-full bg-muted/30">
				<div className="text-center">
					<Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-foreground mb-2">
						Không tìm thấy đơn học bổng
					</h3>
					<p className="text-muted-foreground">
						Đơn học bổng này có thể đã bị xóa
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="flex-1 overflow-y-auto bg-muted/30">
				<div className="max-w-4xl mx-auto p-6">
					{/* Header */}
					<div className="flex items-start justify-between mb-6">
						<div className="min-w-0 flex-1">
							<h1 className="text-2xl font-bold text-foreground mb-1 truncate">
								{application.scholarship?.name}
							</h1>
							<p className="text-muted-foreground truncate">
								{application.scholarship?.sourceName}
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							className="shrink-0 ml-4"
							onClick={() => setIsScholarshipDrawerOpen(true)}
						>
							<ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
							Xem chi tiết
						</Button>
					</div>

					{/* Tabs */}
					<Tabs
						value={activeTab}
						onValueChange={(value) =>
							setActiveTab(value as "overview" | "documents" | "essay")
						}
					>
						<TabsList className="mb-6">
							<TabsTrigger value="overview" className="gap-2">
								<Award className="w-4 h-4" />
								Tổng quan
							</TabsTrigger>
							<TabsTrigger value="documents" className="gap-2">
								<FileText className="w-4 h-4" />
								Tài liệu
								{documentsList.length > 0 && (
									<span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
										{documentsList.length}
									</span>
								)}
							</TabsTrigger>
							<TabsTrigger value="essay" className="gap-2">
								<FileText className="w-4 h-4" />
								Bài luận
							</TabsTrigger>
						</TabsList>

						<TabsContent value="overview" className="mt-0">
							<OverviewTab
								application={application}
								onUpdateStatus={handleUpdateStatus}
							/>
						</TabsContent>

						<TabsContent value="documents" className="mt-0">
							{isLoadingDocuments ? (
								<div className="flex items-center justify-center h-64">
									<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
								</div>
							) : (
								<DocumentsTab
									applicationId={applicationId}
									documents={
										documentsList as Parameters<
											typeof DocumentsTab
										>[0]["documents"]
									}
								/>
							)}
						</TabsContent>

						<TabsContent value="essay" className="mt-0">
							<EssayTab
								applicationId={applicationId}
								documents={
									documentsList as Parameters<typeof EssayTab>[0]["documents"]
								}
							/>
						</TabsContent>
					</Tabs>
				</div>
			</div>

			{/* Scholarship Detail Drawer */}
			<ScholarshipDetailDrawer
				scholarshipId={application.scholarship?.id ?? null}
				open={isScholarshipDrawerOpen}
				onOpenChange={setIsScholarshipDrawerOpen}
			/>
		</>
	);
}
