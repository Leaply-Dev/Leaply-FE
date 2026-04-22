"use client";

import { Award, FileText, GraduationCap, School, Search } from "lucide-react";
import Image from "next/image";
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
import type {
	ApplicationResponse,
	ScholarshipApplicationResponse,
} from "@/lib/generated/api/models";
import { cn } from "@/lib/utils";

export type EssayItemKind = "program" | "scholarship";

export interface UnifiedEssayItem {
	id: string;
	kind: EssayItemKind;
	title: string;
	subtitle: string;
	logoUrl?: string;
	universityName?: string;
	status?: string;
	sopStatus?: string;
	deadline?: string;
	updatedAt?: string;
}

interface EssayListProps {
	applications: ApplicationResponse[];
	scholarshipApplications: ScholarshipApplicationResponse[];
	selectedId: string | null;
	onSelect: (id: string, kind: EssayItemKind) => void;
	isLoading?: boolean;
	withWrapper?: boolean;
	collapsed?: boolean;
}

function buildItems(
	applications: ApplicationResponse[],
	scholarshipApplications: ScholarshipApplicationResponse[],
): UnifiedEssayItem[] {
	const fromPrograms = applications
		.filter((app) => !!app.id)
		.map<UnifiedEssayItem>((app) => ({
			id: app.id ?? "",
			kind: "program",
			title: app.program?.universityName ?? "",
			subtitle: app.program?.programName ?? "",
			universityName: app.program?.universityName,
			logoUrl: app.program?.universityLogoUrl,
			status: app.status,
			sopStatus: app.sopStatus,
			deadline: app.program?.nextDeadline,
			updatedAt: app.updatedAt,
		}));

	const fromScholarships = scholarshipApplications
		.filter((app) => !!app.id)
		.map<UnifiedEssayItem>((app) => ({
			id: app.id ?? "",
			kind: "scholarship",
			title: app.scholarship?.name ?? "",
			subtitle: app.scholarship?.sourceName ?? "",
			universityName: app.scholarship?.sourceName,
			status: app.status,
			deadline: app.targetDeadline ?? app.scholarship?.applicationDeadline,
			updatedAt: app.updatedAt,
		}));

	return [...fromPrograms, ...fromScholarships].sort((a, b) => {
		const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
		const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
		return tb - ta;
	});
}

const statusColors: Record<string, string> = {
	planning: "bg-muted",
	writing: "bg-primary",
	submitted: "bg-primary",
	under_review: "bg-amber-500",
	accepted: "bg-green-600",
	waitlisted: "bg-amber-500",
	rejected: "bg-destructive",
};

function getLogoByUniName(name?: string) {
	if (!name) return undefined;
	return FEATURED_UNIVERSITIES.find((u) => u.name === name)?.logo;
}

export function EssayList({
	applications,
	scholarshipApplications,
	selectedId,
	onSelect,
	isLoading,
	withWrapper = true,
	collapsed = false,
}: EssayListProps) {
	const t = useTranslations("applications");
	const [searchQuery, setSearchQuery] = useState("");

	const items = useMemo(
		() => buildItems(applications ?? [], scholarshipApplications ?? []),
		[applications, scholarshipApplications],
	);

	const filteredItems = useMemo(() => {
		if (!searchQuery) return items;
		const q = searchQuery.toLowerCase();
		return items.filter(
			(item) =>
				item.title.toLowerCase().includes(q) ||
				item.subtitle.toLowerCase().includes(q) ||
				item.universityName?.toLowerCase().includes(q),
		);
	}, [items, searchQuery]);

	const displayItems = useMemo(() => {
		const result = [...filteredItems];
		if (selectedId === "new" && !result.find((i) => i.id === "new")) {
			result.unshift({
				id: "new",
				kind: "program",
				title: t("newEssayTitle"),
				subtitle: t("setupInProgress"),
				status: "planning",
			});
		}
		return result;
	}, [filteredItems, selectedId, t]);

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

		return (
			<div className="flex flex-col gap-2 items-center w-full px-2">
				{displayItems.map((item) => {
					const logo = item.logoUrl ?? getLogoByUniName(item.universityName);
					const statusDot =
						statusColors[item.status ?? "planning"] ?? "bg-muted";
					return (
						<Tooltip key={`${item.kind}-${item.id}`}>
							<TooltipTrigger asChild>
								<button
									type="button"
									onClick={() => onSelect(item.id, item.kind)}
									className={cn(
										"relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
										selectedId === item.id
											? "bg-background shadow-md ring-2 ring-primary/20 scale-105"
											: "hover:bg-muted hover:scale-105",
									)}
								>
									{logo ? (
										<div className="relative w-7 h-7">
											<Image
												src={logo}
												alt={item.title}
												fill
												className="object-contain"
											/>
										</div>
									) : item.kind === "program" ? (
										<School className="w-5 h-5 text-muted-foreground" />
									) : (
										<Award className="w-5 h-5 text-muted-foreground" />
									)}
									<div
										className={cn(
											"absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
											statusDot,
										)}
									/>
								</button>
							</TooltipTrigger>
							<TooltipContent side="right" className="max-w-[220px]">
								<p className="font-medium">{item.title}</p>
								<p className="text-xs text-muted-foreground">{item.subtitle}</p>
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
			<div className="p-4 border-b border-border space-y-3">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-foreground">
						{t("title")}
					</h2>
					<Button
						size="sm"
						className="gap-2"
						onClick={() => onSelect("new", "program")}
					>
						<FileText className="w-4 h-4" />
						{t("newEssay")}
					</Button>
				</div>

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
			</div>

			{/* List */}
			<div className="flex-1 overflow-y-auto pb-4">
				{isLoading ? (
					<div className="p-4 space-y-3">
						{[1, 2, 3].map((i) => (
							<div key={i} className="animate-pulse">
								<div className="h-20 bg-muted rounded-lg" />
							</div>
						))}
					</div>
				) : displayItems.length === 0 ? (
					<div className="p-6 text-center">
						<FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
						<p className="text-sm text-muted-foreground">
							{searchQuery ? t("noApplicationsFound") : t("noEssayYet")}
						</p>
					</div>
				) : (
					<div className="px-3 py-2 space-y-1">
						{displayItems.map((item) => {
							const logo =
								item.logoUrl ?? getLogoByUniName(item.universityName);
							const KindIcon = item.kind === "program" ? GraduationCap : Award;

							return (
								<button
									type="button"
									key={`${item.kind}-${item.id}`}
									onClick={() => onSelect(item.id, item.kind)}
									className={cn(
										"w-full p-3 text-left hover:bg-muted/50 transition-all rounded-xl border border-transparent group",
										selectedId === item.id
											? "bg-card border-border shadow-sm"
											: "hover:border-border/50",
									)}
								>
									<div className="flex items-start gap-3">
										<div className="shrink-0 w-10 h-10 bg-white rounded-lg border border-border/50 shadow-sm flex items-center justify-center overflow-hidden p-1.5">
											{logo ? (
												<div className="relative w-full h-full">
													<Image
														src={logo}
														alt={item.title}
														fill
														className="object-contain"
													/>
												</div>
											) : item.kind === "program" ? (
												<School className="w-5 h-5 text-muted-foreground/50" />
											) : (
												<Award className="w-5 h-5 text-muted-foreground/50" />
											)}
										</div>

										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-foreground text-sm truncate leading-tight mb-1">
												{item.title}
											</h3>
											<p className="text-xs text-muted-foreground truncate leading-tight">
												{item.subtitle}
											</p>

											<div className="flex items-center gap-2 mt-2 flex-wrap">
												<Badge
													variant="outline"
													className="text-[10px] font-normal gap-1 py-0 h-5"
												>
													<KindIcon className="w-3 h-3" />
													{t(`kind.${item.kind}`)}
												</Badge>
												{item.status && (
													<Badge
														variant="secondary"
														className="text-[10px] font-normal h-5"
													>
														{t(`status.${item.status}`)}
													</Badge>
												)}
											</div>

											{item.deadline && (
												<div className="mt-1 text-[10px] text-muted-foreground">
													{new Date(item.deadline).toLocaleDateString(
														undefined,
														{
															month: "short",
															day: "numeric",
															year: "numeric",
														},
													)}
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
