"use client";

import {
	AlertTriangle,
	ArrowRight,
	Award,
	Building2,
	Calendar,
	Check,
	DollarSign,
	GraduationCap,
	MapPin,
	Plus,
	Settings2,
	Sparkles,
	Target,
	Users,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScholarshipListItemResponse } from "@/lib/generated/api/models";
import {
	formatCoverageAmount,
	formatCoverageType,
	formatDate,
	formatEligibilityType,
	formatScholarshipDegreeLevel,
	isDeadlinePast,
} from "@/lib/utils/displayFormatters";

interface ScholarshipCardProps {
	scholarship: ScholarshipListItemResponse;
	onClick?: (scholarship: ScholarshipListItemResponse) => void;
	isSelected?: boolean;
	onToggleSelection?: (id: string) => void;
	isMaxReached?: boolean;
	onAddToDashboard?: (id: string) => void;
	isInDashboard?: boolean;
	onManage?: (id: string) => void;
}

export function ScholarshipCard({
	scholarship,
	onClick,
	isSelected,
	onToggleSelection,
	isMaxReached,
	onAddToDashboard,
	isInDashboard,
	onManage,
}: ScholarshipCardProps) {
	// Check if deadline exists and is not past
	const hasValidDeadline =
		scholarship.applicationDeadline &&
		!isDeadlinePast(scholarship.applicationDeadline);

	// Format coverage display
	const coverageDisplay = getCoverageDisplay(scholarship);

	// Get degree levels display
	const degreeLevelsDisplay = scholarship.degreeLevels
		?.slice(0, 2)
		.map((level) => formatScholarshipDegreeLevel(level))
		.join(", ");

	return (
		// biome-ignore lint/a11y/useSemanticElements: Cannot use <button> because it contains nested buttons
		<div
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.(scholarship);
				}
			}}
			className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			onClick={() => onClick?.(scholarship)}
		>
			{/* Header */}
			<div className="p-4">
				{/* Source Info */}
				<div className="flex items-center gap-3 mb-3">
					<div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border">
						{scholarship.universityLogoUrl ? (
							<Image
								src={scholarship.universityLogoUrl}
								alt={
									scholarship.universityName ||
									scholarship.sourceName ||
									"Scholarship"
								}
								width={64}
								height={64}
								className="object-contain"
							/>
						) : (
							<Award className="w-5 h-5 text-muted-foreground" />
						)}
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-bold text-base text-foreground line-clamp-2 leading-snug">
							{scholarship.name || "N/A"}
						</h3>
						<p className="font-medium text-sm text-foreground truncate">
							{scholarship.universityName || scholarship.sourceName || "N/A"}
						</p>
						{scholarship.universityCity && scholarship.universityCountry && (
							<div className="flex items-center gap-1 mt-0.5">
								<MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
								<span className="text-xs text-muted-foreground truncate">
									{scholarship.universityCity}, {scholarship.universityCountry}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Badges Row */}
				<div className="flex flex-wrap gap-1.5 mb-3">
					{scholarship.fitScore && (
						<Badge className="bg-primary/10 text-primary border-0 text-xs">
							{scholarship.fitScore}% Match
						</Badge>
					)}

					{scholarship.coverageType && (
						<Badge
							className={`border-0 text-xs gap-1 ${
								scholarship.coverageType.toLowerCase() === "full_funded"
									? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
									: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
							}`}
						>
							<Sparkles className="w-3 h-3" />
							{formatCoverageType(scholarship.coverageType)}
						</Badge>
					)}

					{scholarship.eligibilityType && (
						<Badge
							variant="outline"
							className="text-xs gap-1 border-muted-foreground/30"
						>
							<Target className="w-3 h-3" />
							{formatEligibilityType(scholarship.eligibilityType)}
						</Badge>
					)}

					{degreeLevelsDisplay && (
						<Badge
							variant="outline"
							className="text-xs gap-1 border-muted-foreground/30"
						>
							<GraduationCap className="w-3 h-3" />
							{degreeLevelsDisplay}
						</Badge>
					)}
				</div>

				{/* Quick Info Grid */}
				<div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mb-3">
					{/* Coverage Amount */}
					{coverageDisplay && (
						<div className="flex items-center gap-1.5 text-muted-foreground">
							<DollarSign className="w-3.5 h-3.5 shrink-0" />
							<span className="truncate">{coverageDisplay}</span>
						</div>
					)}

					{/* Eligible Fields */}
					{scholarship.eligibleFields &&
						scholarship.eligibleFields.length > 0 && (
							<div className="flex items-center gap-1.5 text-muted-foreground">
								<Building2 className="w-3.5 h-3.5 shrink-0" />
								<span className="truncate">
									{scholarship.eligibleFields.length === 1
										? scholarship.eligibleFields[0]
										: `${scholarship.eligibleFields.length} fields`}
								</span>
							</div>
						)}

					{/* Nationality Eligible */}
					{scholarship.nationalityEligible &&
						scholarship.nationalityEligible.length > 0 && (
							<div className="flex items-center gap-1.5 text-muted-foreground">
								<Users className="w-3.5 h-3.5 shrink-0" />
								<span className="truncate">
									{scholarship.nationalityEligible.includes("all")
										? "All nationalities"
										: `${scholarship.nationalityEligible.length} countries`}
								</span>
							</div>
						)}

					{/* Application Deadline */}
					{hasValidDeadline && (
						<div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
							<Calendar className="w-3.5 h-3.5 shrink-0" />
							<span className="truncate">
								Deadline:{" "}
								{formatDate(scholarship.applicationDeadline, { short: true })}
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Fit Gaps */}
			{scholarship.fitGaps && scholarship.fitGaps.length > 0 && (
				<div className="px-4 pb-3">
					<div className="bg-destructive/5 rounded-lg p-3 border border-destructive/20">
						<div className="flex items-center gap-2 mb-2">
							<AlertTriangle className="w-4 h-4 text-destructive" />
							<span className="text-xs font-semibold text-foreground uppercase tracking-wide">
								To improve
							</span>
						</div>
						<ul className="space-y-1">
							{scholarship.fitGaps.slice(0, 2).map((gap) => (
								<li
									key={gap}
									className="flex items-start gap-2 text-xs text-muted-foreground"
								>
									<AlertTriangle className="w-3 h-3 text-destructive mt-0.5 shrink-0" />
									<span className="line-clamp-1">{gap}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}

			{/* Footer Actions */}
			<div className="px-4 pb-4 flex gap-2">
				<Button
					variant={isSelected ? "secondary" : "outline"}
					size="sm"
					className={`flex-1 font-medium text-sm gap-2 ${
						isSelected
							? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
							: ""
					}`}
					disabled={!isSelected && isMaxReached}
					onClick={(e) => {
						e.stopPropagation();
						scholarship.id && onToggleSelection?.(scholarship.id);
					}}
				>
					{isSelected ? (
						<>
							<Check className="w-4 h-4" />
							Added
						</>
					) : (
						<>
							<Plus className="w-4 h-4" />
							Compare
						</>
					)}
				</Button>
				<Button
					size="sm"
					className="flex-1 font-medium gap-2 bg-primary hover:bg-primary/90 text-sm"
					onClick={(e) => {
						e.stopPropagation();
						if (isInDashboard && onManage) {
							scholarship.id && onManage(scholarship.id);
						} else {
							scholarship.id && onAddToDashboard?.(scholarship.id);
						}
					}}
				>
					{isInDashboard ? (
						<>
							<Settings2 className="w-4 h-4" />
							Manage
						</>
					) : (
						<>
							Apply
							<ArrowRight className="w-4 h-4" />
						</>
					)}
				</Button>
			</div>
		</div>
	);
}

/**
 * Get coverage display text based on available data
 */
function getCoverageDisplay(
	scholarship: ScholarshipListItemResponse,
): string | null {
	// Priority 1: Percentage (for partial scholarships)
	if (scholarship.coveragePercentage) {
		return `${scholarship.coveragePercentage}% tuition`;
	}

	// Priority 2: Amount range
	if (scholarship.coverageAmountMin || scholarship.coverageAmountMax) {
		return formatCoverageAmount(
			scholarship.coverageAmountMin,
			scholarship.coverageAmountMax,
			{ compact: true },
		);
	}

	// Priority 3: Full funded indicator
	if (scholarship.coverageType?.toLowerCase() === "full_funded") {
		return "Full tuition";
	}

	return null;
}
