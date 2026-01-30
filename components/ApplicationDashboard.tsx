"use client";

import {
	Award,
	ExternalLink,
	FileText,
	Info,
	MoreVertical,
	School,
	Trash2,
} from "lucide-react";
import Image from "next/image";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FEATURED_UNIVERSITIES } from "@/lib/data/marketing-config";
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

	const universityLogo = FEATURED_UNIVERSITIES.find(
		(u) => u.name === application.program?.universityName,
	)?.logo;

	return (
		<>
			<div className="flex-1 overflow-y-auto bg-muted/30">
				<div className="h-full flex flex-col p-6">
					{/* Header */}
					<div className="flex items-start justify-between mb-6 shrink-0">
						<div className="flex items-center gap-4 min-w-0 flex-1">
							{/* Logo */}
							<div className="shrink-0 w-16 h-16 bg-white rounded-xl border border-border/50 shadow-sm flex items-center justify-center overflow-hidden p-2">
								{universityLogo ? (
									<div className="relative w-full h-full">
										<Image
											src={universityLogo}
											alt={application.program?.universityName ?? "University"}
											fill
											className="object-contain"
										/>
									</div>
								) : (
									<School className="w-8 h-8 text-muted-foreground/50" />
								)}
							</div>

							<div className="min-w-0 flex-1">
								{/* Degree Name (Highlighted as Main Title) */}
								<h1 className="text-2xl font-bold text-foreground mb-1 truncate">
									{application.program?.degreeName ||
										application.program?.programName}
								</h1>
								{/* University Name (Subtitle) */}
								<p className="text-lg text-muted-foreground truncate">
									{application.program?.universityName}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2 ml-4 shrink-0">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsProgramDrawerOpen(true)}
							>
								<ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
								{t("viewDetails")}
							</Button>

							<Dialog
								open={deleteDialogOpen}
								onOpenChange={setDeleteDialogOpen}
							>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon">
											<MoreVertical className="w-4 h-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DialogTrigger asChild>
											<DropdownMenuItem className="text-destructive focus:text-destructive">
												<Trash2 className="w-4 h-4 mr-2" />
												{t("remove")}
											</DropdownMenuItem>
										</DialogTrigger>
									</DropdownMenuContent>
								</DropdownMenu>

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
					</div>

					{/* Tabs */}
					<Tabs
						value={activeTab}
						onValueChange={(value) =>
							setActiveTab(value as "info" | "documents" | "sop")
						}
						className="flex-1 flex flex-col min-h-0"
					>
						<div className="flex items-center justify-between shrink-0 mb-6">
							<TabsList>
								<TabsTrigger value="info" className="gap-2">
									<Info className="w-4 h-4" />
									{t("tabs.overview")}
								</TabsTrigger>
								<TabsTrigger value="documents" className="gap-2">
									<FileText className="w-4 h-4" />
									{t("tabs.documents")}
								</TabsTrigger>
								<TabsTrigger value="sop" className="gap-2">
									<Award className="w-4 h-4" />
									{t("tabs.sop")}
								</TabsTrigger>
							</TabsList>
						</div>

						<div className="flex-1 min-h-0 relative">
							{/* Info Tab */}
							<TabsContent value="info" className="mt-0 h-full overflow-y-auto">
								<InfoTab
									application={application}
									onUpdateStatus={onUpdateStatus}
								/>
								<div className="text-xs text-muted-foreground text-center mt-8 pb-8">
									{t("addedOn")}{" "}
									{new Date(application.createdAt ?? "").toLocaleDateString(
										"vi-VN",
									)}
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
							</TabsContent>

							{/* Documents Tab */}
							<TabsContent value="documents" className="mt-0 h-full">
								<ProgramDocumentsTab applicationId={application.id ?? ""} />
							</TabsContent>

							{/* SOP Tab */}
							<TabsContent value="sop" className="mt-0 h-full">
								<SopTab
									applicationId={application.id ?? ""}
									programName={application.program?.programName}
									universityName={application.program?.universityName}
								/>
							</TabsContent>
						</div>
					</Tabs>
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
