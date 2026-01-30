"use client";

import {
	Award,
	ExternalLink,
	FileText,
	Info,
	PenLine,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { ScholarshipDetailDrawer } from "@/components/explore/scholarship/ScholarshipDetailDrawer";
import { DocumentsTab } from "@/components/scholarships/tabs/DocumentsTab";
import { EssayTab } from "@/components/scholarships/tabs/EssayTab";
import { OverviewTab } from "@/components/scholarships/tabs/OverviewTab";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
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
	onDelete?: () => Promise<boolean>;
}

export function ScholarshipDashboard({
	applicationId,
	onDelete,
}: ScholarshipDashboardProps) {
	const t = useTranslations("scholarships");
	const { activeTab, setActiveTab } = useScholarshipApplicationStore();
	const [isScholarshipDrawerOpen, setIsScholarshipDrawerOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
			toast.error("Failed to update status");
			return false;
		}
	};

	// Handle delete
	const handleDelete = async () => {
		if (onDelete) {
			setIsDeleting(true);
			const success = await onDelete();
			setIsDeleting(false);
			if (success) {
				setDeleteDialogOpen(false);
			}
		}
	};

	// Empty state
	if (!applicationId) {
		return (
			<div className="flex items-center justify-center h-full bg-muted/30">
				<div className="text-center">
					<Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-foreground mb-2">
						{t("noScholarshipSelected")}
					</h3>
					<p className="text-muted-foreground mb-4">{t("selectScholarship")}</p>
					<Button asChild>
						<Link href="/explore?tab=scholarships">
							{t("exploreScholarships")}
							<Award className="w-4 h-4 ml-2" />
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	// Loading state
	if (isLoadingApplication) {
		return (
			<div className="flex-1 overflow-y-auto bg-muted/30">
				<div className="max-w-4xl mx-auto p-6 space-y-6">
					<div className="flex justify-between items-start">
						<div className="space-y-2">
							<Skeleton className="h-8 w-64" />
							<Skeleton className="h-5 w-48" />
						</div>
						<Skeleton className="h-9 w-28" />
					</div>
					<div className="space-y-6">
						<Skeleton className="h-10 w-full max-w-sm" />
						<Skeleton className="h-[400px] w-full rounded-xl" />
					</div>
				</div>
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
						{t("scholarshipNotFound")}
					</h3>
					<p className="text-muted-foreground">
						{t("scholarshipMayBeDeleted")}
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
							{t("viewDetails")}
						</Button>
					</div>

					{/* Tabs */}
					<Tabs
						value={activeTab}
						onValueChange={(value) =>
							setActiveTab(value as "overview" | "documents" | "essay")
						}
						className="space-y-6"
					>
						<div className="flex items-center justify-between">
							<TabsList>
								<TabsTrigger value="overview" className="gap-2">
									<Info className="w-4 h-4" />
									{t("tabs.overview")}
								</TabsTrigger>
								<TabsTrigger value="documents" className="gap-2">
									<FileText className="w-4 h-4" />
									{t("tabs.documents")}
									{documentsList.length > 0 && (
										<span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
											{documentsList.length}
										</span>
									)}
								</TabsTrigger>
								<TabsTrigger value="essay" className="gap-2">
									<PenLine className="w-4 h-4" />
									{t("tabs.essay")}
								</TabsTrigger>
							</TabsList>

							{/* Delete Button */}
							<Dialog
								open={deleteDialogOpen}
								onOpenChange={setDeleteDialogOpen}
							>
								<DialogTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="text-destructive hover:text-destructive"
									>
										<Trash2 className="w-4 h-4 mr-2" />
										{t("remove")}
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>{t("confirmRemove")}</DialogTitle>
										<DialogDescription>
											{t("confirmRemoveDescription", {
												scholarship: application.scholarship?.name ?? "",
											})}
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<Button
											variant="outline"
											onClick={() => setDeleteDialogOpen(false)}
										>
											{t("cancel")}
										</Button>
										<Button
											variant="destructive"
											onClick={handleDelete}
											disabled={isDeleting}
										>
											{isDeleting ? t("removing") : t("remove")}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>

						<TabsContent value="overview" className="mt-0">
							<OverviewTab
								application={application}
								onUpdateStatus={handleUpdateStatus}
							/>
						</TabsContent>

						<TabsContent value="documents" className="mt-0">
							{isLoadingDocuments ? (
								<div className="space-y-4 pt-4">
									{[1, 2, 3].map((i) => (
										<Skeleton key={i} className="h-20 w-full rounded-lg" />
									))}
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

					{/* Timestamps */}
					<div className="text-xs text-muted-foreground text-center mt-8">
						{t("addedOn")}{" "}
						{new Date(application.createdAt ?? "").toLocaleDateString("vi-VN")}
						{application.updatedAt !== application.createdAt && (
							<>
								{" "}
								• {t("lastUpdated")}{" "}
								{new Date(application.updatedAt ?? "").toLocaleDateString(
									"vi-VN",
								)}
							</>
						)}
					</div>
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
