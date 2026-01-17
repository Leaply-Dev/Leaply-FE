"use client";

import { Award, ExternalLink, FileText, Info, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { InfoTab } from "@/components/applications/tabs/InfoTab";
import { ProgramDocumentsTab } from "@/components/applications/tabs/ProgramDocumentsTab";
import { SopTab } from "@/components/applications/tabs/SopTab";
import { ProgramDetailDrawer } from "@/components/explore/ProgramDetailDrawer";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ApplicationResponse } from "@/lib/generated/api/models";

interface ApplicationDashboardProps {
	application: ApplicationResponse | null;
	onUpdateStatus?: (status: string) => Promise<boolean>;
	onDelete?: () => Promise<boolean>;
}

export function ApplicationDashboard({
	application,
	onUpdateStatus,
	onDelete,
}: ApplicationDashboardProps) {
	const t = useTranslations("applications");
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isProgramDrawerOpen, setIsProgramDrawerOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"info" | "documents" | "sop">(
		"info",
	);

	if (!application) {
		return (
			<div className="flex items-center justify-center h-full bg-muted/30">
				<div className="text-center">
					<FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-foreground mb-2">
						{t("noApplicationSelected")}
					</h3>
					<p className="text-muted-foreground mb-4">{t("selectApplication")}</p>
					<Button asChild>
						<Link href="/explore">
							{t("explorePrograms")}
							<Award className="w-4 h-4 ml-2" />
						</Link>
					</Button>
				</div>
			</div>
		);
	}

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

	return (
		<>
			<div className="flex-1 overflow-y-auto bg-muted/30">
				<div className="max-w-4xl mx-auto p-6">
					{/* Header */}
					<div className="flex items-start justify-between mb-6">
						<div className="min-w-0 flex-1">
							<h1 className="text-2xl font-bold text-foreground mb-1 truncate">
								{application.program?.universityName}
							</h1>
							<p className="text-lg text-muted-foreground truncate">
								{application.program?.programName}
							</p>
							{application.program?.degreeName && (
								<p className="text-sm text-muted-foreground">
									{application.program.degreeName}
								</p>
							)}
						</div>
						<Button
							variant="outline"
							size="sm"
							className="shrink-0 ml-4"
							onClick={() => setIsProgramDrawerOpen(true)}
						>
							<ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
							Xem chi tiết
						</Button>
					</div>

				{/* Tabs */}
				<Tabs
					value={activeTab}
					onValueChange={(value) =>
						setActiveTab(value as "info" | "documents" | "sop")
					}
					className="space-y-6"
				>
					<div className="flex items-center justify-between">
						<TabsList>
							<TabsTrigger value="info" className="gap-2">
								<Info className="w-4 h-4" />
								Thông tin
							</TabsTrigger>
							<TabsTrigger value="documents" className="gap-2">
								<FileText className="w-4 h-4" />
								Tài liệu
							</TabsTrigger>
							<TabsTrigger value="sop" className="gap-2">
								<Award className="w-4 h-4" />
								SOP
							</TabsTrigger>
						</TabsList>

						{/* Delete Button */}
						<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
							<DialogTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="text-destructive hover:text-destructive"
								>
									<Trash2 className="w-4 h-4 mr-2" />
									Xóa
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>{t("confirmRemove")}</DialogTitle>
									<DialogDescription>
										{t("confirmRemoveDescription", {
											program: application.program?.programName ?? "",
											university: application.program?.universityName ?? "",
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

					{/* Info Tab */}
					<TabsContent value="info" className="mt-0">
						<InfoTab
							application={application}
							onUpdateStatus={onUpdateStatus}
						/>
					</TabsContent>

					{/* Documents Tab */}
					<TabsContent value="documents" className="mt-0">
						<ProgramDocumentsTab applicationId={application.id ?? ""} />
					</TabsContent>

					{/* SOP Tab */}
					<TabsContent value="sop" className="mt-0">
						<SopTab
							applicationId={application.id ?? ""}
							programName={application.program?.programName}
							universityName={application.program?.universityName}
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

		{/* Program Detail Drawer */}
		<ProgramDetailDrawer
			programId={application.program?.id ?? null}
			open={isProgramDrawerOpen}
			onOpenChange={setIsProgramDrawerOpen}
		/>
	</>
	);
}
