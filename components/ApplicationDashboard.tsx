"use client";

import {
	Award,
	ExternalLink,
	FileText,
	MoreVertical,
	School,
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
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isProgramDrawerOpen, setIsProgramDrawerOpen] = useState(false);

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
