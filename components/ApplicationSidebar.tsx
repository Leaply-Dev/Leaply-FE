"use client";

import { Plus, Search, FileText, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApplicationResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface ApplicationSidebarProps {
	applications: ApplicationResponse[];
	selectedId: string | null;
	onSelectApplication: (id: string) => void;
	isLoading?: boolean;
}

const statusConfig: Record<
	string,
	{ label: string; variant: "default" | "secondary" | "outline" | "destructive" }
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
}: ApplicationSidebarProps) {
	const t = useTranslations("applications");
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");

	// Filter applications based on search
	const filteredApplications = useMemo(() => {
		if (!searchQuery) return applications;

		const query = searchQuery.toLowerCase();
		return applications.filter(
			(app) =>
				app.program.universityName.toLowerCase().includes(query) ||
				app.program.programName.toLowerCase().includes(query),
		);
	}, [applications, searchQuery]);

	// Get fit score color based on category
	const getFitScoreStyle = (
		fitScore?: number,
		fitCategory?: string,
	): string => {
		if (!fitScore) return "text-muted-foreground bg-muted";

		switch (fitCategory) {
			case "safety":
				return "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30";
			case "target":
				return "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30";
			case "reach":
				return "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30";
			default:
				if (fitScore >= 80) return "text-green-600 bg-green-50";
				if (fitScore >= 60) return "text-blue-600 bg-blue-50";
				return "text-amber-600 bg-amber-50";
		}
	};

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

	const handleNewApplication = () => {
		router.push("/explore");
	};

	return (
		<div className="flex flex-col h-full bg-card border-r border-border">
			{/* Header */}
			<div className="p-4 border-b border-border space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-foreground">
						{t("title")}
					</h2>
					<span className="text-sm text-muted-foreground">
						{applications.length}
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
				<Button onClick={handleNewApplication} className="w-full" size="sm">
					<Plus className="w-4 h-4 mr-2" />
					{t("newApplication")}
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
							<Button
								onClick={handleNewApplication}
								variant="outline"
								size="sm"
							>
								<Plus className="w-4 h-4 mr-2" />
								{t("explorePrograms")}
							</Button>
						)}
					</div>
				) : (
					<div>
						{filteredApplications.map((app, index) => (
							<button
								type="button"
								key={app.id}
								onClick={() => onSelectApplication(app.id)}
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
										{app.program.universityName}
									</h3>
									<p className="text-xs text-muted-foreground truncate">
										{app.program.programName}
									</p>
								</div>

								{/* Fit Score & Status Row */}
								<div className="flex items-center justify-between gap-2 mb-2">
									{/* Fit Score */}
									{app.fitScore && (
										<span
											className={cn(
												"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
												getFitScoreStyle(app.fitScore, app.fitCategory),
											)}
										>
											{app.fitScore}% {t("match")}
										</span>
									)}

									{/* Status Badge */}
									<Badge
										variant={statusConfig[app.status]?.variant || "secondary"}
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
								{app.program.nextDeadline && (
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
		</div>
	);
}
