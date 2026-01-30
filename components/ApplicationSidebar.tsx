"use client";

import { AlertCircle, FileText, Plus, School, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { FEATURED_UNIVERSITIES } from "@/lib/data/marketing-config";
import type { ApplicationResponse } from "@/lib/generated/api/models";
import { cn } from "@/lib/utils";

interface ApplicationSidebarProps {
	applications: ApplicationResponse[];
	selectedId: string | null;
	onSelectApplication: (id: string) => void;
	isLoading?: boolean;
	withWrapper?: boolean;
	collapsed?: boolean;
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
		color: "bg-secondary text-secondary-foreground",
	},
	writing: {
		label: "Writing",
		variant: "outline",
		color: "bg-background border-border text-foreground",
	},
	submitted: {
		label: "Submitted",
		variant: "default",
		color: "bg-primary text-primary-foreground",
	},
	accepted: {
		label: "Accepted",
		variant: "default",
		color: "bg-green-600 text-white",
	},
	rejected: {
		label: "Rejected",
		variant: "destructive",
		color: "bg-destructive text-destructive-foreground",
	},
};

export function ApplicationSidebar({
	applications,
	selectedId,
	onSelectApplication,
	isLoading,
	withWrapper = true,
	collapsed = false,
}: ApplicationSidebarProps) {
	const t = useTranslations("applications");
	const [searchQuery, setSearchQuery] = useState("");

	// Filter applications based on search (handle undefined safely)
	const filteredApplications = useMemo(() => {
		const apps = applications ?? [];
		if (!searchQuery) return apps;

		const query = searchQuery.toLowerCase();
		return apps.filter(
			(app) =>
				app.program?.universityName?.toLowerCase().includes(query) ||
				app.program?.programName?.toLowerCase().includes(query),
		);
	}, [applications, searchQuery]);

	// Get SOP status display
	const getSopStatusBadge = (sopStatus?: string) => {
		if (!sopStatus || sopStatus === "not_started") return null;
		if (sopStatus === "in_progress") {
			return (
				<Badge variant="outline" className="text-xs">
					<FileText className="w-3 h-3 mr-1" />
					SOP Draft
				</Badge>
			);
		}
		if (sopStatus === "done") {
			return (
				<Badge variant="default" className="text-xs bg-green-600">
					<FileText className="w-3 h-3 mr-1" />
					SOP Done
				</Badge>
			);
		}
		return null;
	};

	// Helper to get university logo
	const getUniversityLogo = (universityName?: string) => {
		return FEATURED_UNIVERSITIES.find((u) => u.name === universityName)?.logo;
	};

	// Collapsed view - just icons for each application
	if (collapsed) {
		if (isLoading) {
			return (
				<div className="flex flex-col gap-2">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="animate-pulse h-10 w-10 bg-muted rounded-lg mx-auto"
						/>
					))}
				</div>
			);
		}

		if (filteredApplications.length === 0) {
			return (
				<div className="flex justify-center py-4">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button asChild variant="ghost" size="icon">
								<Link href="/explore">
									<Plus className="w-4 h-4" />
								</Link>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="right">{t("newApplication")}</TooltipContent>
					</Tooltip>
				</div>
			);
		}

		return (
			<div className="flex flex-col gap-2 items-center w-full px-2">
				{filteredApplications.map((app) => {
					const logo = getUniversityLogo(app.program?.universityName);
					const statusColor =
						statusConfig[app.status ?? "planning"]?.color || "bg-muted";

					return (
						<Tooltip key={app.id}>
							<TooltipTrigger asChild>
								<button
									type="button"
									onClick={() => app.id && onSelectApplication(app.id)}
									className={cn(
										"relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
										selectedId === app.id
											? "bg-background shadow-md ring-2 ring-primary/20 scale-105"
											: "hover:bg-muted hover:scale-105",
										"group",
									)}
								>
									{logo ? (
										<div className="relative w-7 h-7">
											<Image
												src={logo}
												alt={app.program?.universityName ?? "Uni"}
												fill
												className="object-contain"
											/>
										</div>
									) : (
										<School className="w-5 h-5 text-muted-foreground" />
									)}

									{/* Status Dot */}
									<div
										className={cn(
											"absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
											statusColor.split(" ")[0], // Get background color class
										)}
									/>
								</button>
							</TooltipTrigger>
							<TooltipContent side="right" className="max-w-[200px]">
								<p className="font-medium">{app.program?.universityName}</p>
								<p className="text-xs text-muted-foreground">
									{app.program?.programName}
								</p>
								<div className="mt-1 flex items-center gap-2">
									<span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
										{t(`status.${app.status}`)}
									</span>
								</div>
							</TooltipContent>
						</Tooltip>
					);
				})}
			</div>
		);
	}

	const content = (
		<>
			{/* Header */}
			<div className="p-4 border-b border-border space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-foreground">
						{t("title")}
					</h2>
					<span className="text-sm text-muted-foreground">
						{applications?.length ?? 0}
					</span>
				</div>

				{/* Search */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder={t("searchUniversities")}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>

				{/* New Application Button */}
				<Button asChild className="w-full" size="sm">
					<Link href="/explore">
						<Plus className="w-4 h-4 mr-2" />
						{t("newApplication")}
					</Link>
				</Button>
			</div>

			{/* Applications List */}
			<div className="flex-1 overflow-y-auto pb-4">
				{isLoading ? (
					<div className="p-4 space-y-3">
						{[1, 2, 3].map((i) => (
							<div key={i} className="animate-pulse">
								<div className="h-20 bg-muted rounded-lg" />
							</div>
						))}
					</div>
				) : filteredApplications.length === 0 ? (
					<div className="p-6 text-center">
						<FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
						<p className="text-sm text-muted-foreground mb-4">
							{searchQuery ? t("noApplicationsFound") : t("noApplicationsYet")}
						</p>
						{!searchQuery && (
							<Button asChild variant="outline" size="sm">
								<Link href="/explore">
									<Plus className="w-4 h-4 mr-2" />
									{t("explorePrograms")}
								</Link>
							</Button>
						)}
					</div>
				) : (
					<div className="px-3 py-2 space-y-1">
						{filteredApplications.map((app) => {
							const logo = getUniversityLogo(app.program?.universityName);

							return (
								<button
									type="button"
									key={app.id}
									onClick={() => app.id && onSelectApplication(app.id)}
									className={cn(
										"w-full p-3 text-left hover:bg-muted/50 transition-all rounded-xl border border-transparent group",
										selectedId === app.id
											? "bg-card border-border shadow-sm"
											: "hover:border-border/50",
									)}
								>
									<div className="flex items-start gap-3">
										{/* Logo Box */}
										<div className="shrink-0 w-10 h-10 bg-white rounded-lg border border-border/50 shadow-sm flex items-center justify-center overflow-hidden p-1.5">
											{logo ? (
												<div className="relative w-full h-full">
													<Image
														src={logo}
														alt={app.program?.universityName ?? "Uni"}
														fill
														className="object-contain"
													/>
												</div>
											) : (
												<School className="w-5 h-5 text-muted-foreground/50" />
											)}
										</div>

										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-foreground text-sm truncate leading-tight mb-1">
												{app.program?.universityName}
											</h3>
											<p className="text-xs text-muted-foreground truncate leading-tight">
												{app.program?.programName}
											</p>

											{/* Metadata Row */}
											<div className="flex items-center gap-2 mt-2 flex-wrap">
												<Badge
													variant={
														statusConfig[app.status ?? "planning"]?.variant ||
														"secondary"
													}
													className="text-xs font-normal"
												>
													{t(`status.${app.status}`)}
												</Badge>

												{/* SOP Status */}
												{getSopStatusBadge(app.sopStatus)}

												{/* Gaps Warning - Badge */}
												{app.gaps && app.gaps.length > 0 && (
													<Badge
														variant="outline"
														className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-300 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 w-fit flex items-center gap-1.5 font-normal text-xs transition-colors"
													>
														<AlertCircle className="w-3 h-3 shrink-0" />
														<span>{app.gaps.length} gap left</span>
													</Badge>
												)}
											</div>

											{/* Next Deadline - Separate Line */}
											{app.program?.nextDeadline && (
												<div className="mt-1 text-[10px] text-muted-foreground">
													Deadline:{" "}
													{new Date(
														app.program.nextDeadline,
													).toLocaleDateString(undefined, {
														month: "short",
														day: "numeric",
													})}
												</div>
											)}
										</div>
									</div>
								</button>
							);
						})}
					</div>
				)}
			</div>
		</>
	);

	if (!withWrapper) return content;

	return (
		<div className="flex flex-col h-full bg-card border-r border-border">
			{content}
		</div>
	);
}
