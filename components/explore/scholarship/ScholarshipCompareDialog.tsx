"use client";

import {
	AlertTriangle,
	Award,
	Calendar,
	CheckCircle2,
	DollarSign,
	FileText,
	GraduationCap,
	HelpCircle,
	Info,
	Languages,
	MapPin,
	Plus,
	ThumbsUp,
	TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ScholarshipListItemResponse } from "@/lib/generated/api/models";
import {
	formatCoverageAmount,
	formatCoverageDuration,
	formatCoverageType,
	formatDate,
	formatEligibilityType,
	formatScholarshipDegreeLevel,
} from "@/lib/utils/displayFormatters";

// ============================================================================
// Types
// ============================================================================

interface ScholarshipCompareDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedScholarshipsList: ScholarshipListItemResponse[];
	onRemoveScholarship: (id: string) => void;
	onAddToDashboard: (id: string) => void;
}

interface DeadlineInfo {
	text: string;
	isUrgent: boolean;
	daysLeft: string | null;
	color?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get match badge based on fit category
 */
function getMatchBadge(fitCategory?: string, fitScore?: number) {
	const score = fitScore ?? 0;
	switch (fitCategory) {
		case "safety":
			return (
				<Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
					<CheckCircle2 className="w-3 h-3" />
					Strong Fit ({score}%)
				</Badge>
			);
		case "target":
			return (
				<Badge className="bg-blue-100 text-blue-700 border-blue-200 gap-1">
					<ThumbsUp className="w-3 h-3" />
					Good Fit ({score}%)
				</Badge>
			);
		case "reach":
			return (
				<Badge className="bg-orange-100 text-orange-700 border-orange-200 gap-1">
					<TrendingUp className="w-3 h-3" />
					Competitive ({score}%)
				</Badge>
			);
		case "unknown":
			return (
				<Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1">
					<HelpCircle className="w-3 h-3" />
					Incomplete Data
				</Badge>
			);
		default:
			return null;
	}
}

/**
 * Get deadline info with urgency calculation
 */
function getDeadlineInfo(deadline?: string): DeadlineInfo {
	if (!deadline) return { text: "N/A", isUrgent: false, daysLeft: null };
	const daysUntil = Math.floor(
		(new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
	);

	if (daysUntil < 0) {
		return {
			text: "Closed",
			isUrgent: false,
			daysLeft: null,
			color: "text-muted-foreground",
		};
	}

	const formatted = formatDate(deadline);

	if (daysUntil < 14) {
		return {
			text: formatted,
			isUrgent: true,
			daysLeft: `Urgent (${daysUntil} days)`,
			color: "text-destructive",
		};
	}
	if (daysUntil <= 60) {
		return {
			text: formatted,
			isUrgent: false,
			daysLeft: `${Math.floor(daysUntil / 30)} month(s) left`,
			color: "text-muted-foreground",
		};
	}
	return {
		text: formatted,
		isUrgent: false,
		daysLeft: `${daysUntil} days left`,
		color: "text-muted-foreground",
	};
}

/**
 * Get coverage display
 */
function getCoverageDisplay(scholarship: ScholarshipListItemResponse): string {
	if (scholarship.coveragePercentage) {
		return `${scholarship.coveragePercentage}% tuition`;
	}
	if (scholarship.coverageAmountMin || scholarship.coverageAmountMax) {
		return formatCoverageAmount(
			scholarship.coverageAmountMin,
			scholarship.coverageAmountMax,
		);
	}
	return formatCoverageType(scholarship.coverageType);
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Scholarship header cell in comparison table
 */
function ScholarshipHeaderCell({
	scholarship,
}: {
	scholarship: ScholarshipListItemResponse;
}) {
	return (
		<th className="p-4 text-left border-l border-border min-w-64">
			<div className="space-y-3">
				{/* Logo + Match Badge */}
				<div className="flex items-start justify-between gap-2">
					<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
						{scholarship.universityLogoUrl ? (
							<Image
								src={scholarship.universityLogoUrl}
								alt={scholarship.universityName || scholarship.sourceName || ""}
								width={40}
								height={40}
								className="object-contain"
							/>
						) : (
							<Award className="w-5 h-5 text-primary" />
						)}
					</div>
					{getMatchBadge(scholarship.fitCategory, scholarship.fitScore)}
				</div>

				{/* Scholarship Name */}
				<div>
					<h3 className="font-semibold text-foreground line-clamp-2">
						{scholarship.name}
					</h3>
					<p className="text-sm text-muted-foreground">
						{scholarship.universityName || scholarship.sourceName}
					</p>
				</div>

				{/* Location */}
				{scholarship.universityCountry && (
					<div className="flex items-center gap-1 text-sm text-muted-foreground">
						<MapPin className="w-3.5 h-3.5" />
						{scholarship.universityCity
							? `${scholarship.universityCity}, ${scholarship.universityCountry}`
							: scholarship.universityCountry}
					</div>
				)}
			</div>
		</th>
	);
}

/**
 * Coverage row cell
 */
function CoverageCell({
	scholarship,
}: {
	scholarship: ScholarshipListItemResponse;
}) {
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">
					{getCoverageDisplay(scholarship)}
				</p>
				{scholarship.coverageType?.toLowerCase() === "full_funded" && (
					<Badge className="bg-green-100 text-green-700 border-0 text-xs">
						Full Funded
					</Badge>
				)}
				<p className="text-sm text-muted-foreground">
					{formatCoverageDuration(scholarship.coverageDuration)}
				</p>
			</div>
		</td>
	);
}

/**
 * Eligibility row cell
 */
function EligibilityCell({
	scholarship,
}: {
	scholarship: ScholarshipListItemResponse;
}) {
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">
					{formatEligibilityType(scholarship.eligibilityType)}
				</p>
				{scholarship.eligibilityFocus &&
					scholarship.eligibilityFocus.length > 0 && (
						<p className="text-sm text-muted-foreground">
							Focus: {scholarship.eligibilityFocus.slice(0, 2).join(", ")}
						</p>
					)}
			</div>
		</td>
	);
}

/**
 * Degree levels row cell
 */
function DegreeLevelsCell({
	scholarship,
}: {
	scholarship: ScholarshipListItemResponse;
}) {
	return (
		<td className="p-4 border-l border-border align-top">
			{scholarship.degreeLevels && scholarship.degreeLevels.length > 0 ? (
				<div className="flex flex-wrap gap-1">
					{scholarship.degreeLevels.map((level) => (
						<Badge key={level} variant="outline" className="text-xs">
							{formatScholarshipDegreeLevel(level)}
						</Badge>
					))}
				</div>
			) : (
				<span className="text-muted-foreground">N/A</span>
			)}
		</td>
	);
}

/**
 * Fields row cell
 */
function FieldsCell({
	scholarship,
}: {
	scholarship: ScholarshipListItemResponse;
}) {
	return (
		<td className="p-4 border-l border-border align-top">
			{scholarship.eligibleFields && scholarship.eligibleFields.length > 0 ? (
				<div className="text-sm">
					{scholarship.eligibleFields.length <= 3 ? (
						scholarship.eligibleFields.join(", ")
					) : (
						<>
							{scholarship.eligibleFields.slice(0, 2).join(", ")}
							<span className="text-muted-foreground">
								{" "}
								+{scholarship.eligibleFields.length - 2} more
							</span>
						</>
					)}
				</div>
			) : (
				<span className="text-muted-foreground">All fields</span>
			)}
		</td>
	);
}

/**
 * Deadline row cell
 */
function DeadlineCell({
	scholarship,
}: {
	scholarship: ScholarshipListItemResponse;
}) {
	const deadline = getDeadlineInfo(scholarship.applicationDeadline);
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">{deadline.text}</p>
				{deadline.daysLeft && (
					<p className={`text-sm flex items-center gap-1 ${deadline.color}`}>
						{deadline.isUrgent && <AlertTriangle className="w-3.5 h-3.5" />}
						{deadline.daysLeft}
					</p>
				)}
			</div>
		</td>
	);
}

/**
 * GPA requirements row cell
 */
function GpaCell({
	scholarship,
}: {
	scholarship: ScholarshipListItemResponse;
}) {
	if (scholarship.minGpa) {
		return (
			<td className="p-4 border-l border-border align-top">
				<p className="font-semibold text-foreground">{scholarship.minGpa}+</p>
			</td>
		);
	}
	return (
		<td className="p-4 border-l border-border align-top">
			<span className="text-muted-foreground">Not required</span>
		</td>
	);
}

/**
 * English requirements row cell
 */
function EnglishCell({
	scholarship,
}: {
	scholarship: ScholarshipListItemResponse;
}) {
	const requirements: string[] = [];
	if (scholarship.minIelts) requirements.push(`IELTS ${scholarship.minIelts}+`);
	if (scholarship.minToefl) requirements.push(`TOEFL ${scholarship.minToefl}+`);

	if (requirements.length === 0) {
		return (
			<td className="p-4 border-l border-border align-top">
				<span className="text-muted-foreground">Not specified</span>
			</td>
		);
	}

	return (
		<td className="p-4 border-l border-border align-top">
			<p className="font-semibold text-foreground">
				{requirements.join(" / ")}
			</p>
		</td>
	);
}

/**
 * Detailed analysis row cell
 */
function AnalysisCell({
	scholarship,
}: {
	scholarship: ScholarshipListItemResponse;
}) {
	const getFitInsight = () => {
		switch (scholarship.fitCategory) {
			case "safety":
				return "Strong match - You exceed most eligibility requirements";
			case "target":
				return "Good fit - You meet the core requirements";
			case "reach":
				return "Competitive - Consider strengthening your application";
			default:
				return "Not enough data for detailed analysis";
		}
	};

	return (
		<td className="p-4 border-l border-border align-top">
			<div className="flex items-start gap-2 text-sm">
				<Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
				<span className="text-muted-foreground">{getFitInsight()}</span>
			</div>
		</td>
	);
}

/**
 * Action buttons row cell
 */
function ActionsCell({
	scholarship,
	onAddToDashboard,
	onRemoveScholarship,
}: {
	scholarship: ScholarshipListItemResponse;
	onAddToDashboard: (id: string) => void;
	onRemoveScholarship: (id: string) => void;
}) {
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-3">
				<Button
					className="w-full"
					onClick={(e) => {
						e.stopPropagation();
						scholarship.id && onAddToDashboard(scholarship.id);
					}}
				>
					Apply Now
				</Button>
				<button
					type="button"
					onClick={() => onRemoveScholarship(scholarship.id ?? "")}
					className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors text-center"
				>
					Remove from comparison
				</button>
			</div>
		</td>
	);
}

/**
 * Comparison table row label cell
 */
function RowLabel({
	icon: Icon,
	label,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
}) {
	return (
		<td className="p-4 align-top">
			<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
				<Icon className="w-4 h-4" />
				{label}
			</div>
		</td>
	);
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Scholarship Compare Dialog - Side-by-side comparison view for selected scholarships
 */
export function ScholarshipCompareDialog({
	open,
	onOpenChange,
	selectedScholarshipsList,
	onRemoveScholarship,
	onAddToDashboard,
}: ScholarshipCompareDialogProps) {
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className="max-h-[90vh] p-0 gap-0 overflow-hidden">
				<DrawerHeader className="sr-only">
					<DrawerTitle>Compare Scholarships</DrawerTitle>
					<DrawerDescription>
						Compare selected scholarships side by side
					</DrawerDescription>
				</DrawerHeader>

				<ScrollArea className="max-h-[90vh] overflow-y-auto">
					<div className="p-6">
						{/* Comparison Table */}
						<div className="border border-border rounded-lg overflow-hidden">
							<table className="w-full">
								<thead>
									<tr className="border-b border-border bg-muted/30">
										{/* Label Column */}
										<th className="p-4 text-left font-medium text-sm text-muted-foreground w-40 align-top">
											<span className="uppercase tracking-wide text-xs">
												Comparison Criteria
											</span>
										</th>
										{/* Scholarship Columns */}
										{selectedScholarshipsList.map((scholarship) => (
											<ScholarshipHeaderCell
												key={scholarship.id}
												scholarship={scholarship}
											/>
										))}
									</tr>
								</thead>
								<tbody>
									{/* Coverage Row */}
									<tr className="border-b border-border">
										<RowLabel icon={DollarSign} label="Coverage" />
										{selectedScholarshipsList.map((scholarship) => (
											<CoverageCell
												key={scholarship.id}
												scholarship={scholarship}
											/>
										))}
									</tr>

									{/* Eligibility Type Row */}
									<tr className="border-b border-border">
										<RowLabel icon={Award} label="Eligibility Type" />
										{selectedScholarshipsList.map((scholarship) => (
											<EligibilityCell
												key={scholarship.id}
												scholarship={scholarship}
											/>
										))}
									</tr>

									{/* Degree Levels Row */}
									<tr className="border-b border-border">
										<RowLabel icon={GraduationCap} label="Degree Levels" />
										{selectedScholarshipsList.map((scholarship) => (
											<DegreeLevelsCell
												key={scholarship.id}
												scholarship={scholarship}
											/>
										))}
									</tr>

									{/* Eligible Fields Row */}
									<tr className="border-b border-border">
										<RowLabel icon={FileText} label="Eligible Fields" />
										{selectedScholarshipsList.map((scholarship) => (
											<FieldsCell
												key={scholarship.id}
												scholarship={scholarship}
											/>
										))}
									</tr>

									{/* Deadline Row */}
									<tr className="border-b border-border">
										<RowLabel icon={Calendar} label="Application Deadline" />
										{selectedScholarshipsList.map((scholarship) => (
											<DeadlineCell
												key={scholarship.id}
												scholarship={scholarship}
											/>
										))}
									</tr>

									{/* GPA Requirements Row */}
									<tr className="border-b border-border">
										<RowLabel icon={GraduationCap} label="Min GPA" />
										{selectedScholarshipsList.map((scholarship) => (
											<GpaCell key={scholarship.id} scholarship={scholarship} />
										))}
									</tr>

									{/* English Requirements Row */}
									<tr className="border-b border-border">
										<RowLabel icon={Languages} label="English Requirement" />
										{selectedScholarshipsList.map((scholarship) => (
											<EnglishCell
												key={scholarship.id}
												scholarship={scholarship}
											/>
										))}
									</tr>

									{/* Detailed Analysis Row */}
									<tr className="border-b border-border bg-blue-50/50 dark:bg-blue-950/20">
										<td className="p-4 align-top">
											<div className="flex items-start gap-2 text-sm font-medium text-primary">
												<Info className="w-4 h-4 mt-0.5" />
												<div>
													<p>Fit Analysis</p>
													<p className="font-normal text-xs text-muted-foreground mt-1">
														Based on your profile
													</p>
												</div>
											</div>
										</td>
										{selectedScholarshipsList.map((scholarship) => (
											<AnalysisCell
												key={scholarship.id}
												scholarship={scholarship}
											/>
										))}
									</tr>

									{/* Actions Row */}
									<tr>
										<td className="p-4 align-top" />
										{selectedScholarshipsList.map((scholarship) => (
											<ActionsCell
												key={scholarship.id}
												scholarship={scholarship}
												onAddToDashboard={onAddToDashboard}
												onRemoveScholarship={onRemoveScholarship}
											/>
										))}
									</tr>
								</tbody>
							</table>
						</div>

						{/* Add More Scholarships CTA */}
						{selectedScholarshipsList.length < 4 && (
							<div className="mt-6 flex justify-center">
								<Button
									variant="outline"
									onClick={() => onOpenChange(false)}
									className="gap-2"
								>
									<Plus className="w-4 h-4" />
									Add more scholarships to compare (Max 4)
								</Button>
							</div>
						)}
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
}
