"use client";

import {
	Award,
	BookOpen,
	ExternalLink,
	FileText,
	MoreVertical,
	PenSquare,
	School,
	Sparkles,
	Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
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
import { useWorkspaceStatus } from "@/lib/api/sop-workspace";
import { FEATURED_UNIVERSITIES } from "@/lib/data/marketing-config";
import type { ApplicationResponse } from "@/lib/generated/api/models";

interface ApplicationDashboardProps {
	application: ApplicationResponse | null;
	onDelete?: () => Promise<boolean>;
}

export function ApplicationDashboard({
	application,
	onDelete,
}: ApplicationDashboardProps) {
	const t = useTranslations("applications");
	const tSetup = useTranslations("sop.setup");
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isProgramDrawerOpen, setIsProgramDrawerOpen] = useState(false);

	const { data: status } = useWorkspaceStatus(application?.id ?? "");

	if (!application) {
		return null;
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
							<div className="min-w-0 flex-1">
								{/* Essay Type (Highlighted as Main Title) */}
								<h1 className="text-2xl font-bold text-foreground mb-1 truncate">
									{status?.essayType
										? tSetup(
												`essayType.${status.essayType.toLowerCase()}` as Parameters<
													typeof tSetup
												>[0],
											)
										: application.program?.degreeName ||
											application.program?.programName}
								</h1>
								{/* Degree & University Name (Subtitle) */}
								<p className="text-lg text-muted-foreground truncate">
									{application.program?.degreeName
										? `${application.program.degreeName}, `
										: ""}
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

					{/* Essay editor */}
					<div className="flex-1 min-h-0">
						<SopTab
							applicationId={application.id ?? ""}
							programName={application.program?.programName}
							universityName={application.program?.universityName}
						/>
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
