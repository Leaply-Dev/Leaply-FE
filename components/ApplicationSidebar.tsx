"use client";

import {
	AlertCircle,
	FileText,
	GraduationCap,
	Plus,
	Search,
} from "lucide-react";
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
	}
> = {
	planning: { label: "Planning", variant: "secondary" },
	writing: { label: "Writing", variant: "outline" },
	submitted: { label: "Submitted", variant: "default" },
	accepted: { label: "Accepted", variant: "default" },
	rejected: { label: "Rejected", variant: "destructive" },
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
			<div className="flex flex-col gap-1">
				{filteredApplications.map((app) => (
					<Tooltip key={app.id}>
						<TooltipTrigger asChild>
							<button
								type="button"
								onClick={() => app.id && onSelectApplication(app.id)}
								className={cn(
									"w-10 h-10 mx-auto rounded-lg flex items-center justify-center transition-colors hover:bg-muted",
									selectedId === app.id && "bg-primary/10 ring-2 ring-primary",
								)}
							>
								<GraduationCap className="w-4 h-4 text-muted-foreground" />
							</button>
						</TooltipTrigger>
						<TooltipContent side="right" className="max-w-[200px]">
							<p className="font-medium">{app.program?.universityName}</p>
							<p className="text-xs text-muted-foreground">
								{app.program?.programName}
							</p>
						</TooltipContent>
					</Tooltip>
				))}
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
					<div>
						{filteredApplications.map((app, index) => (
							<button
								type="button"
								key={app.id}
								onClick={() => app.id && onSelectApplication(app.id)}
								className={cn(
									"w-full px-4 py-4 text-left hover:bg-muted/50 transition-colors border-b border-border",
									selectedId === app.id &&
										"bg-primary/5 border-l-4 border-l-primary",
									index === filteredApplications.length - 1 && "border-b-0",
								)}
							>
								{/* University & Program */}
								<div className="mb-2">
									<h3 className="font-semibold text-foreground text-sm truncate">
										{app.program?.universityName}
									</h3>
									<p className="text-xs text-muted-foreground truncate">
										{app.program?.programName}
									</p>
								</div>

								{/* Status Row */}
								<div className="flex items-center gap-2 mb-2">
									{/* Status Badge */}
									<Badge
										variant={
											statusConfig[app.status ?? "planning"]?.variant ||
											"secondary"
										}
										className="text-xs"
									>
										{t(`status.${app.status}`)}
									</Badge>
								</div>

								{/* Gaps Warning */}
								{app.gaps && app.gaps.length > 0 && (
									<div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
										<AlertCircle className="w-3 h-3" />
										<span>
											{app.gaps.length} {t("gapsToAddress")}
										</span>
									</div>
								)}

								{/* SOP Status */}
								{getSopStatusBadge(app.sopStatus)}

								{/* Next Deadline */}
								{app.program?.nextDeadline && (
									<div className="mt-2 text-xs text-muted-foreground">
										Deadline:{" "}
										{new Date(app.program.nextDeadline).toLocaleDateString()}
									</div>
								)}
							</button>
						))}
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
