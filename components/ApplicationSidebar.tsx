"use client";

import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { EnhancedApplication } from "@/lib/data/enhancedApplications";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ApplicationSidebarProps {
	applications: EnhancedApplication[];
	selectedId: string | null;
	onSelectApplication: (id: string) => void;
	onNewApplication?: () => void;
}

export function ApplicationSidebar({
	applications,
	selectedId,
	onSelectApplication,
	onNewApplication,
}: ApplicationSidebarProps) {
	const { t } = useTranslation();
	const [searchQuery, setSearchQuery] = useState("");

	// Filter applications based on search
	const filteredApplications = useMemo(() => {
		if (!searchQuery) return applications;

		const query = searchQuery.toLowerCase();
		return applications.filter(
			(app) =>
				app.universityName.toLowerCase().includes(query) ||
				app.program.toLowerCase().includes(query) ||
				app.universityCountry.toLowerCase().includes(query),
		);
	}, [applications, searchQuery]);

	// Get fit score color
	const getFitScoreColor = (score: number) => {
		if (score >= 85) return "text-green-600 bg-green-50";
		if (score >= 70) return "text-chart-2 bg-sky-50";
		if (score >= 50) return "text-chart-4 bg-orange-50";
		return "text-muted-foreground bg-muted";
	};

	return (
		<div className="flex flex-col h-full bg-card border-r border-border">
			{/* Header */}
			<div className="p-4 border-b border-border space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-foreground">
						{t("applications", "title")}
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
						placeholder={t("applications", "searchUniversities")}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>

				{/* New Application Button */}
				<Button onClick={onNewApplication} className="w-full" size="sm">
					<Plus className="w-4 h-4 mr-2" />
					{t("applications", "newApplication")}
				</Button>
			</div>

			{/* Applications List */}
			<div className="flex-1 overflow-y-auto pb-4">
				{filteredApplications.length === 0 ? (
					<div className="p-4 text-center text-sm text-muted-foreground">
						{t("applications", "noApplicationsFound")}
					</div>
				) : (
					<div>
						{filteredApplications.map((app, index) => (
							<button
								type="button"
								key={app.id}
								onClick={() => onSelectApplication(app.id)}
								className={cn(
									"w-full px-4 py-5 text-left hover:bg-muted/50 transition-colors border-b border-border",
									selectedId === app.id &&
										"bg-primary/5 border-l-4 border-primary",
									index === filteredApplications.length - 1 && "border-b-0",
								)}
							>
								{/* University Header */}
								<div className="flex items-start gap-3 mb-3.5">
									<Avatar className="h-12 w-12 shrink-0">
										<AvatarImage
											src={app.universityLogo}
											alt={app.universityName}
										/>
										<AvatarFallback>
											{app.universityName.substring(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>

									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-foreground text-sm truncate">
											{app.universityName}
										</h3>
										<p className="text-xs text-muted-foreground truncate">
											{app.program}
										</p>

										{/* Fit Score Badge */}
										<div className="mt-1">
											<span
											className={cn(
												"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
												getFitScoreColor(app.fitScore),
											)}
										>
											{app.fitScore}% {t("applications", "match")}
										</span>
										</div>
									</div>
								</div>

								{/* Progress Bar */}
								<div className="mb-2.5">
									<div className="flex items-center justify-between mb-1.5">
										<span className="text-xs text-muted-foreground">
											{t("applications", "progress")}
										</span>
										<span className="text-xs font-medium text-foreground">
											{app.completionPercentage}%
										</span>
									</div>
									<Progress value={app.completionPercentage} className="h-2" />
								</div>

								{/* Reminder Tags */}
								{app.reminders.length > 0 && (
									<div className="flex gap-1.5 flex-wrap">
										{app.reminders.slice(0, 2).map((reminder, idx) => (
											<Badge
												key={idx}
												variant="warning"
												className="text-xs px-2 py-0.5"
											>
												{reminder}
											</Badge>
										))}
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
