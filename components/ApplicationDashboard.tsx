"use client";

import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	ChevronRight,
	ExternalLink,
	FileText,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ImprovementTipsCard } from "@/components/applications/ImprovementTipsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ApplicationResponse, GapDto } from "@/lib/generated/api/models";
import { cn } from "@/lib/utils";

interface ApplicationDashboardProps {
	application: ApplicationResponse | null;
	onUpdateStatus?: (status: string) => Promise<boolean>;
	onDelete?: () => Promise<boolean>;
}

const statusConfig: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
		color: string;
	}
> = {
	planning: {
		label: "Planning",
		variant: "secondary",
		color: "text-muted-foreground bg-muted",
	},
	writing: {
		label: "Writing",
		variant: "outline",
		color: "text-blue-600 bg-blue-50",
	},
	submitted: {
		label: "Submitted",
		variant: "default",
		color: "text-primary bg-primary/10",
	},
	accepted: {
		label: "Accepted",
		variant: "default",
		color: "text-green-600 bg-green-50",
	},
	rejected: {
		label: "Rejected",
		variant: "destructive",
		color: "text-red-600 bg-red-50",
	},
};

const gapSeverityConfig: Record<
	string,
	{ color: string; icon: typeof AlertCircle }
> = {
	critical: {
		color: "text-red-600 bg-red-50 border-red-200",
		icon: AlertCircle,
	},
	warning: {
		color: "text-amber-600 bg-amber-50 border-amber-200",
		icon: AlertCircle,
	},
	info: {
		color: "text-blue-600 bg-blue-50 border-blue-200",
		icon: AlertCircle,
	},
};

export function ApplicationDashboard({
	application,
	onUpdateStatus,
	onDelete,
}: ApplicationDashboardProps) {
	const t = useTranslations("applications");
	const _router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
							<ExternalLink className="w-4 h-4 ml-2" />
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	const config =
		statusConfig[application.status ?? "planning"] || statusConfig.planning;

	// Calculate days until deadline
	const getDaysUntilDeadline = () => {
		if (!application.program?.nextDeadline) return null;
		const deadline = new Date(application.program.nextDeadline);
		const now = new Date();
		const diff = deadline.getTime() - now.getTime();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	};

	const daysUntilDeadline = getDaysUntilDeadline();

	const handleStatusChange = async (newStatus: string) => {
		if (onUpdateStatus) {
			await onUpdateStatus(newStatus);
		}
	};

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
		<div className="flex-1 overflow-y-auto bg-muted/30">
			<div className="max-w-4xl mx-auto p-6 space-y-6">
				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl font-bold text-foreground mb-1">
							{application.program?.universityName}
						</h1>
						<p className="text-lg text-muted-foreground">
							{application.program?.programName}
						</p>
						{application.program?.degreeName && (
							<p className="text-sm text-muted-foreground">
								{application.program.degreeName}
							</p>
						)}
					</div>
					<div className="flex items-center gap-2">
						<Badge variant={config.variant} className="text-sm">
							{t(`status.${application.status}`)}
						</Badge>
					</div>
				</div>

				{/* Quick Stats Row */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Status */}
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-2 mb-1">
								<CheckCircle2 className="w-4 h-4 text-muted-foreground" />
								<span className="text-xs font-medium text-muted-foreground">
									{t("status.label")}
								</span>
							</div>
							<Select
								value={application.status}
								onValueChange={handleStatusChange}
							>
								<SelectTrigger className="w-full h-8 text-sm mt-1">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="planning">
										{t("status.planning")}
									</SelectItem>
									<SelectItem value="writing">{t("status.writing")}</SelectItem>
									<SelectItem value="submitted">
										{t("status.submitted")}
									</SelectItem>
								</SelectContent>
							</Select>
						</CardContent>
					</Card>

					{/* SOP Status */}
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-2 mb-1">
								<FileText className="w-4 h-4 text-muted-foreground" />
								<span className="text-xs font-medium text-muted-foreground">
									{t("sopStatus")}
								</span>
							</div>
							<p className="text-lg font-semibold text-foreground capitalize">
								{application.sopStatus?.replace("_", " ") || t("notStarted")}
							</p>
						</CardContent>
					</Card>

					{/* Next Deadline */}
					<Card
						className={cn(
							daysUntilDeadline !== null &&
								daysUntilDeadline <= 7 &&
								"border-red-200 bg-red-50",
						)}
					>
						<CardContent className="p-4">
							<div className="flex items-center gap-2 mb-1">
								<Calendar className="w-4 h-4 text-muted-foreground" />
								<span className="text-xs font-medium text-muted-foreground">
									{t("nextDeadline")}
								</span>
							</div>
							{application.program?.nextDeadline ? (
								<>
									<p className="text-sm font-semibold text-foreground">
										{new Date(
											application.program.nextDeadline,
										).toLocaleDateString()}
									</p>
									{daysUntilDeadline !== null && (
										<p
											className={cn(
												"text-xs font-medium",
												daysUntilDeadline <= 7
													? "text-red-600"
													: daysUntilDeadline <= 30
														? "text-amber-600"
														: "text-muted-foreground",
											)}
										>
											{daysUntilDeadline} {t("daysRemaining")}
										</p>
									)}
								</>
							) : (
								<p className="text-sm text-muted-foreground">
									{t("noDeadline")}
								</p>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Gaps Analysis */}
				{application.gaps && application.gaps.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg">
								<AlertCircle className="w-5 h-5 text-amber-500" />
								{t("gapsToAddress")}
							</CardTitle>
							<CardDescription>{t("gapsDescription")}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{application.gaps?.map((gap: GapDto) => {
									const severityConfig =
										gapSeverityConfig[gap.severity ?? "info"] ||
										gapSeverityConfig.info;
									return (
										<div
											key={gap.field}
											className={cn(
												"flex items-start gap-3 p-3 rounded-lg border",
												severityConfig.color,
											)}
										>
											<severityConfig.icon className="w-5 h-5 mt-0.5 shrink-0" />
											<div>
												<p className="font-medium text-sm capitalize">
													{gap.field?.replace("_", " ") ?? ""}
												</p>
												<p className="text-sm opacity-80">
													{gap.message ?? ""}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Improvement Tips */}
				<ImprovementTipsCard tips={application.improvementTips} />

				{/* Next Intake */}
				{application.program?.nextIntake && (
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">{t("intakeInfo")}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">
										{t("nextIntake")}
									</p>
									<p className="text-lg font-semibold">
										{application.program?.nextIntake}
									</p>
								</div>
								<Button variant="outline" asChild>
									<Link href={`/explore/${application.program?.id}`}>
										{t("viewProgramDetails")}
										<ChevronRight className="w-4 h-4 ml-1" />
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Actions */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">{t("actions")}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-3">
							<Button asChild>
								<Link href={`/dashboard/applications/${application.id}/sop`}>
									<FileText className="w-4 h-4 mr-2" />
									{application.sopStatus === "not_started" ||
									!application.sopStatus
										? t("startSop")
										: t("continueSop")}
								</Link>
							</Button>

							<Button variant="outline" asChild>
								<Link href={`/explore/${application.program?.id ?? ""}`}>
									<ExternalLink className="w-4 h-4 mr-2" />
									{t("viewProgram")}
								</Link>
							</Button>

							<Dialog
								open={deleteDialogOpen}
								onOpenChange={setDeleteDialogOpen}
							>
								<DialogTrigger asChild>
									<Button variant="ghost" className="text-destructive">
										<Trash2 className="w-4 h-4 mr-2" />
										{t("removeApplication")}
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
					</CardContent>
				</Card>

				{/* Timestamps */}
				<div className="text-xs text-muted-foreground text-center">
					{t("addedOn")}{" "}
					{new Date(application.createdAt ?? "").toLocaleDateString()}
					{application.updatedAt !== application.createdAt && (
						<>
							{" "}
							• {t("lastUpdated")}{" "}
							{new Date(application.updatedAt ?? "").toLocaleDateString()}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
