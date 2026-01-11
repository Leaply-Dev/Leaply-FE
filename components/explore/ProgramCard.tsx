"use client";

import {
	Building2,
	Calendar,
	CheckCircle,
	DollarSign,
	FileWarning,
	Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProgramListItemResponse } from "@/lib/api/types";

interface ProgramCardProps {
	program: ProgramListItemResponse;
	onSaveToggle?: (id: string) => void;
}

// Helper to get country flag emoji
function getCountryFlag(country: string): string {
	const countryMap: Record<string, string> = {
		Netherlands: "🇳🇱",
		Germany: "🇩🇪",
		France: "🇫🇷",
		"United States": "🇺🇸",
		USA: "🇺🇸",
		"United Kingdom": "🇬🇧",
		UK: "🇬🇧",
		Canada: "🇨🇦",
		Australia: "🇦🇺",
		Spain: "🇪🇸",
		Italy: "🇮🇹",
		Sweden: "🇸🇪",
		Denmark: "🇩🇰",
		Switzerland: "🇨🇭",
	};
	return countryMap[country] || "🌍";
}

// Format tuition fee
function formatTuition(tuitionAnnualUsd?: number): string {
	if (!tuitionAnnualUsd) return "N/A";
	const formatted = (tuitionAnnualUsd / 1000).toFixed(0);
	return `~${formatted}tr/năm`;
}

// Format deadline
function formatDeadline(deadline?: string): string {
	if (!deadline) return "N/A";
	const date = new Date(deadline);
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${month}/${day}`;
}

export function ProgramCard({ program }: ProgramCardProps) {
	return (
		<div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
			{/* Header with University Info */}
			<div className="p-4 border-b border-border">
				<div className="flex items-center gap-3">
					{/* University Icon */}
					<div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
						<Building2 className="w-6 h-6 text-muted-foreground" />
					</div>

					{/* University Name and Country */}
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-foreground truncate text-base">
								{program.universityName}
							</h3>
							<span className="text-xl shrink-0">
								{getCountryFlag(program.universityCountry)}
							</span>
						</div>
						<p className="text-sm text-slate-600 dark:text-slate-400">
							{program.universityCountry}
						</p>
					</div>
				</div>
			</div>

			{/* Program Details */}
			<div className="p-4 space-y-4">
				{/* Program Title */}
				<h4 className="font-semibold text-foreground line-clamp-2 text-base">
					{program.programName}
				</h4>

				{/* Meta Info */}
				<div className="flex flex-wrap items-center gap-3 text-sm">
					{/* Ranking Badge */}
					{program.rankingQs && (
						<div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-md border border-blue-200 dark:border-blue-800">
							<span className="font-medium">
								🌍 Top {program.rankingQs} Global
							</span>
						</div>
					)}

					{/* Tuition */}
					<div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
						<DollarSign className="w-4 h-4" />
						<span>{formatTuition(program.tuitionAnnualUsd)}</span>
					</div>

					{/* Deadline */}
					{program.nextDeadline && (
						<div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
							<Calendar className="w-4 h-4" />
							<span className="font-medium">
								Deadline: {formatDeadline(program.nextDeadline)}
							</span>
						</div>
					)}
				</div>

				{/* Match Criteria Section - Placeholder */}
				<div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 space-y-3 border border-slate-200 dark:border-slate-800">
					{/* Fit Reasons (Green checkmarks) */}
					{program.fitReasons && program.fitReasons.length > 0 && (
						<div className="flex items-start gap-2">
							<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
							<div className="flex-1">
								<p className="text-sm font-medium text-green-700 dark:text-green-400">
									Phù hợp:
								</p>
								<p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
									{program.fitReasons.join(", ")}
								</p>
							</div>
						</div>
					)}

					{/* Fit Gaps (Yellow warnings) */}
					{program.fitGaps && program.fitGaps.length > 0 && (
						<div className="flex items-start gap-2">
							<FileWarning className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
							<div className="flex-1">
								<p className="text-sm font-medium text-amber-700 dark:text-amber-400">
									Lưu ý:
								</p>
								<p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
									{program.fitGaps.join(", ")}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Footer Actions */}
			<div className="p-4 border-t border-border flex justify-between items-center gap-3">
				{/* Add to Dashboard Button */}
				<Button
					variant="default"
					size="sm"
					className="flex-1 bg-primary/70 hover:bg-primary/90 text-white"
				>
					<Plus /> Thêm vào Dashboard
				</Button>

				{/* View Details Link */}
				<Button variant="ghost" size="sm" className="text-primary px-3">
					Xem chi tiết
				</Button>
			</div>
		</div>
	);
}
