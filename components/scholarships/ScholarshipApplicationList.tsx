"use client";

import { Award, Calendar, FileText, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ScholarshipApplicationResponse } from "@/lib/generated/api/models";
import { cn } from "@/lib/utils";

interface ScholarshipApplicationListProps {
	applications: ScholarshipApplicationResponse[];
	selectedId: string | null;
	onSelectApplication: (id: string) => void;
	isLoading?: boolean;
	withWrapper?: boolean;
}

const statusVariants: Record<
	string,
	"default" | "secondary" | "outline" | "destructive"
> = {
	planning: "secondary",
	writing: "outline",
	submitted: "default",
	accepted: "default",
	rejected: "destructive",
};

export function ScholarshipApplicationList({
	applications,
	selectedId,
	onSelectApplication,
	isLoading,
	withWrapper = true,
}: ScholarshipApplicationListProps) {
	const t = useTranslations("scholarships");
	const [searchQuery, setSearchQuery] = useState("");

	// Filter applications based on search
	const filteredApplications = useMemo(() => {
		const apps = applications ?? [];
		if (!searchQuery) return apps;

		const query = searchQuery.toLowerCase();
		return apps.filter(
			(app) =>
				app.scholarship?.name?.toLowerCase().includes(query) ||
				app.scholarship?.sourceName?.toLowerCase().includes(query),
		);
	}, [applications, searchQuery]);

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
						placeholder={t("searchScholarships")}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>

				{/* New Application Button */}
				<Button asChild className="w-full" size="sm">
					<Link href="/explore/scholarships">
						<Plus className="w-4 h-4 mr-2" />
						{t("addNewScholarship")}
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
						<Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
						<p className="text-sm text-muted-foreground mb-4">
							{searchQuery ? t("noScholarshipsFound") : t("noScholarshipsYet")}
						</p>
						{!searchQuery && (
							<Button asChild variant="outline" size="sm">
								<Link href="/explore/scholarships">
									<Plus className="w-4 h-4 mr-2" />
									{t("exploreScholarships")}
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
								{/* Scholarship Name & Source */}
								<div className="mb-2">
									<h3 className="font-semibold text-foreground text-sm truncate">
										{app.scholarship?.name}
									</h3>
									<p className="text-xs text-muted-foreground truncate">
										{app.scholarship?.sourceName}
									</p>
								</div>

								{/* Coverage & Status Row */}
								<div className="flex items-center gap-2 mb-2 flex-wrap">
									{/* Coverage Type */}
									{app.scholarship?.coverageType && (
										<Badge variant="outline" className="text-xs">
											{t(`coverage.${app.scholarship.coverageType}`)}
										</Badge>
									)}

									{/* Status Badge */}
									<Badge
										variant={
											statusVariants[app.status ?? "planning"] || "secondary"
										}
										className="text-xs"
									>
										{t(`status.${app.status ?? "planning"}`)}
									</Badge>
								</div>

								{/* Documents Count */}
								{app.documents && app.documents.length > 0 && (
									<div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
										<FileText className="w-3 h-3" />
										<span>
											{app.documents.length} {t("documents")}
										</span>
									</div>
								)}

								{/* Deadline */}
								{app.targetDeadline && (
									<div className="flex items-center gap-1 text-xs text-muted-foreground">
										<Calendar className="w-3 h-3" />
										<span>
											{t("deadline")}:{" "}
											{new Date(app.targetDeadline).toLocaleDateString("vi-VN")}
										</span>
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
