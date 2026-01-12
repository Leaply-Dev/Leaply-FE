"use client";

import { ArrowRight, Building2, MapPin, TrendingUp } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type {
	ProgramListItemResponse,
	UserContextResponse,
} from "@/lib/generated/api/models";
import {
	computeGapGrid,
	formatCountryName,
	type GapGridData,
	getGapStatusColor,
} from "@/lib/utils/gapComputation";

interface ProgramCardProps {
	program: ProgramListItemResponse;
	userProfile?: UserContextResponse | null;
	onSaveToggle?: (id: string) => void;
	onClick?: (program: ProgramListItemResponse) => void;
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
		Singapore: "🇸🇬",
		Japan: "🇯🇵",
		"South Korea": "🇰🇷",
		"New Zealand": "🇳🇿",
		"Hong Kong": "🇭🇰",
		Ireland: "🇮🇪",
		Belgium: "🇧🇪",
		Austria: "🇦🇹",
		Finland: "🇫🇮",
		Norway: "🇳🇴",
	};
	return countryMap[country] || "🌍";
}

/**
 * Gap Chip Component - Shows requirement status as readable chip
 */
function GapChip({
	label,
	userValue,
	requiredValue,
	status,
}: {
	label: string;
	userValue?: string | number;
	requiredValue?: string | number;
	status: string;
}) {
	const colors = getGapStatusColor(status as any);

	// Generate readable message
	let message = "";
	if (status === "gap") {
		const delta =
			typeof userValue === "number" && typeof requiredValue === "number"
				? Math.abs(requiredValue - userValue).toFixed(1)
				: "";
		message = delta
			? `${label} ${userValue} (need ${delta} more)`
			: `${label} ${userValue || "N/A"} (need ${requiredValue})`;
	} else if (status === "match" || status === "clear") {
		message = `${label} ${userValue} matched`;
	} else if (status === "bonus") {
		message = `${label} ${userValue} (bonus)`;
	} else {
		message = `${label} N/A`;
	}

	return (
		<div
			className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
		>
			{message}
		</div>
	);
}

/**
 * New Data-Driven Program Card with Gap Grid
 */
export function ProgramCard({
	program,
	userProfile,
	onClick,
}: ProgramCardProps) {
	const gapGrid: GapGridData = computeGapGrid(program, userProfile);

	// Calculate net cost (simplified - assuming 13k aid as in screenshot)
	const totalCost = program.tuitionAnnualUsd || 0;
	const estimatedAid = program.scholarshipAvailable ? 13000 : 0;
	const netCost = totalCost - estimatedAid;

	return (
		<div
			className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer"
			onClick={() => onClick?.(program)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					onClick?.(program);
				}
			}}
			role="button"
			tabIndex={0}
		>
			{/* Header */}
			<div className="p-4">
				{/* University Header */}
				<div className="flex items-start gap-3 mb-3">
					{/* University Logo */}
					<div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden border border-border">
						{program.universityLogoUrl ? (
							<Image
								src={program.universityLogoUrl}
								alt={program.universityName || "University"}
								width={48}
								height={48}
								className="object-contain"
							/>
						) : (
							<Building2 className="w-6 h-6 text-muted-foreground" />
						)}
					</div>

					{/* University Info */}
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-sm text-foreground truncate">
							{program.universityName}
						</h3>
						<div className="flex items-center gap-1.5 mt-1 flex-wrap">
							<MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
							<span className="text-xs text-muted-foreground">
								{program.universityCity && `${program.universityCity}, `}
								{formatCountryName(program.universityCountry)}{" "}
								{getCountryFlag(formatCountryName(program.universityCountry))}
							</span>
							{program.rankingQsDisplay && (
								<span className="text-xs font-medium px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
									QS #{program.rankingQsDisplay}
								</span>
							)}
							{/* Times ranking not available in API */}
						</div>
					</div>
				</div>

				{/* Program Name - Prominent */}
				<h4 className="font-bold text-base text-foreground line-clamp-2 leading-snug mb-3">
					{program.programName}
				</h4>
			</div>

			{/* Requirements Status Chips */}
			<div className="px-4 pb-3">
				<div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-800">
					{/* Section Title */}
					<div className="flex items-center gap-2 mb-2.5">
						<TrendingUp className="w-4 h-4 text-primary" />
						<span className="text-xs font-semibold text-foreground uppercase tracking-wide">
							Profile Match
						</span>
					</div>

					{/* Gap Chips - Wrapped layout */}
					<div className="flex flex-wrap gap-2">
						<GapChip
							label={gapGrid.gpa.label}
							userValue={gapGrid.gpa.userValue}
							requiredValue={gapGrid.gpa.requiredValue}
							status={gapGrid.gpa.status}
						/>
						<GapChip
							label={gapGrid.ielts.label}
							userValue={gapGrid.ielts.userValue}
							requiredValue={gapGrid.ielts.requiredValue}
							status={gapGrid.ielts.status}
						/>
						<GapChip
							label={gapGrid.budget.label}
							userValue={gapGrid.budget.userValue}
							requiredValue={gapGrid.budget.requiredValue}
							status={gapGrid.budget.status}
						/>
						<GapChip
							label={gapGrid.workExp.label}
							userValue={gapGrid.workExp.userValue}
							requiredValue={gapGrid.workExp.requiredValue}
							status={gapGrid.workExp.status}
						/>
					</div>
				</div>
			</div>

			{/* Net Cost Section */}
			<div className="px-4 pb-3">
				<div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
								EST. NET COST
							</div>
							<div className="flex items-baseline gap-2">
								<span className="text-xl font-bold text-foreground leading-none">
									${(netCost / 1000).toFixed(0)}k
								</span>
								{estimatedAid > 0 && (
									<span className="text-xs text-green-600 dark:text-green-400">
										(-${(estimatedAid / 1000).toFixed(0)}k Aid)
									</span>
								)}
							</div>
						</div>
						{program.scholarshipAvailable && (
							<div className="text-right">
								<span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300">
									Scholarship
								</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Footer Actions */}
			<div className="px-4 pb-4 flex gap-2">
				<Button
					variant="outline"
					size="sm"
					className="flex-1 font-medium text-sm"
					onClick={(e) => {
						e.stopPropagation();
						// TODO: Implement analyze gap
					}}
				>
					Analyze Gap
				</Button>
				<Button
					size="sm"
					className="flex-1 font-medium gap-2 bg-primary hover:bg-primary/90 text-sm"
					onClick={(e) => {
						e.stopPropagation();
						// TODO: Implement apply now
					}}
				>
					Apply Now
					<ArrowRight className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}
