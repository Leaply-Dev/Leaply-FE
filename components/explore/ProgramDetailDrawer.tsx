"use client";

import {
	AlertTriangle,
	Award,
	BookOpen,
	Calendar,
	Check,
	CheckCircle2,
	ChevronDown,
	Circle,
	Clock,
	DollarSign,
	ExternalLink,
	Globe,
	GraduationCap,
	Link2,
	MapPin,
	Plus,
	Scale,
	TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetTitle,
} from "@/components/ui/sheet";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import { useGetProgramDetail } from "@/lib/generated/api/endpoints/explore/explore";
import type {
	BudgetGap,
	EnglishGap,
	GpaGap,
	ProgramDetailResponse,
	ProgramIntakeResponse,
} from "@/lib/generated/api/models";
import {
	formatCurrencyWithCode,
	formatDeliveryMode,
	formatLanguage,
	formatTuitionRange,
} from "@/lib/utils/displayFormatters";

interface ProgramDetailDrawerProps {
	programId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCompare?: (id: string) => void;
	onAddToDashboard?: (id: string) => void;
}

/**
 * Get status styling based on gap status
 */
function getGapStatusStyle(status?: string): {
	border: string;
	bg: string;
	icon: "check" | "warning" | "neutral" | "trending";
} {
	switch (status) {
		case "exceeds":
			return {
				border: "border-green-200",
				bg: "bg-green-50",
				icon: "trending",
			};
		case "meets":
		case "within":
			return {
				border: "border-primary/30",
				bg: "bg-primary/10",
				icon: "check",
			};
		case "stretch":
			return {
				border: "border-yellow-200",
				bg: "bg-yellow-50",
				icon: "warning",
			};
		case "gap":
		case "over":
			return {
				border: "border-orange-200",
				bg: "bg-orange-50",
				icon: "warning",
			};
		default:
			return { border: "border-border", bg: "bg-muted/50", icon: "neutral" };
	}
}

/**
 * Format delta value with sign
 */
function formatDelta(delta?: number, unit?: string): string {
	if (delta === undefined || delta === null) return "";
	const sign = delta >= 0 ? "+" : "";
	const formatted = Number.isInteger(delta)
		? delta.toString()
		: delta.toFixed(1);
	return `${sign}${formatted}${unit || ""}`;
}

/**
 * Gap-based requirement check item using pre-computed gap data from API
 */
function GapCheckItem({
	label,
	status,
	userValue,
	requiredValue,
	delta,
	userLabel,
	requiredLabel,
	note,
}: {
	label: string;
	status?: string;
	userValue?: number | string;
	requiredValue?: number | string;
	delta?: number;
	userLabel?: string;
	requiredLabel?: string;
	note?: string;
}) {
	const style = getGapStatusStyle(status);
	const hasData = status && status !== "unknown";

	const renderIcon = () => {
		switch (style.icon) {
			case "check":
				return (
					<div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
						<Check className="w-3 h-3 text-primary-foreground" />
					</div>
				);
			case "trending":
				return (
					<div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
						<TrendingUp className="w-3 h-3 text-white" />
					</div>
				);
			case "warning":
				return (
					<div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
						<AlertTriangle className="w-3 h-3 text-white" />
					</div>
				);
			default:
				return <Circle className="w-5 h-5 text-muted-foreground" />;
		}
	};

	return (
		<div className={`p-3 rounded-lg border ${style.border} ${style.bg}`}>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					{renderIcon()}
					<div>
						<p className="font-medium text-foreground text-sm">{label}</p>
						{hasData && userValue !== undefined && (
							<p className="text-xs text-muted-foreground">
								{userLabel || "You"}: {userValue}
								{requiredValue !== undefined && (
									<>
										{" "}
										<span className="text-muted-foreground/60">•</span>{" "}
										{requiredLabel || "Required"}: {requiredValue}
									</>
								)}
							</p>
						)}
						{!hasData && requiredValue !== undefined && (
							<p className="text-xs text-muted-foreground">
								Required: {requiredValue}
							</p>
						)}
					</div>
				</div>
				<div className="text-right">
					{hasData && delta !== undefined && delta !== 0 && (
						<span
							className={`text-sm font-semibold font-num ${
								delta >= 0 ? "text-green-600" : "text-orange-600"
							}`}
						>
							{formatDelta(delta)}
						</span>
					)}
					{note && (
						<p className="text-xs text-muted-foreground mt-0.5">{note}</p>
					)}
				</div>
			</div>
		</div>
	);
}

/**
 * English gap display component
 */
function EnglishGapItem({
	gap,
	fallbackRequired,
}: {
	gap?: EnglishGap;
	fallbackRequired?: number;
}) {
	if (!gap || gap.status === "unknown") {
		// Fallback to showing just the requirement if available
		if (fallbackRequired) {
			return (
				<GapCheckItem label="IELTS" requiredValue={`${fallbackRequired}+`} />
			);
		}
		return null;
	}

	const userDisplay = gap.userValue
		? `${gap.userValue} (${gap.userType?.toUpperCase() || "IELTS"})`
		: undefined;
	const requiredDisplay = gap.requiredValue
		? `${gap.requiredValue}+ (${gap.requiredType?.toUpperCase() || "IELTS"})`
		: undefined;

	return (
		<GapCheckItem
			label="English"
			status={gap.status}
			userValue={userDisplay}
			requiredValue={requiredDisplay}
			delta={gap.delta}
			note={
				gap.status === "exceeds"
					? "Exceeds requirement"
					: gap.status === "gap"
						? "Below requirement"
						: undefined
			}
		/>
	);
}

/**
 * GPA gap display component
 */
function GpaGapItem({
	gap,
	fallbackRequired,
}: {
	gap?: GpaGap;
	fallbackRequired?: number;
}) {
	if (!gap || gap.status === "unknown") {
		if (fallbackRequired) {
			return (
				<GapCheckItem label="GPA" requiredValue={`${fallbackRequired}+`} />
			);
		}
		return null;
	}

	const userDisplay =
		gap.userValue !== undefined
			? `${gap.userValue.toFixed(2)}${gap.userScale ? ` / ${gap.userScale}` : ""}`
			: undefined;
	const requiredDisplay =
		gap.requiredValue !== undefined
			? `${gap.requiredValue}+${gap.requiredScale ? ` / ${gap.requiredScale}` : ""}`
			: undefined;

	return (
		<GapCheckItem
			label="GPA"
			status={gap.status}
			userValue={userDisplay}
			requiredValue={requiredDisplay}
			delta={gap.delta}
			note={
				gap.status === "exceeds"
					? "Exceeds requirement"
					: gap.status === "gap"
						? "Below requirement"
						: undefined
			}
		/>
	);
}

/**
 * Budget gap display component
 */
function BudgetGapItem({
	gap,
	tuitionAnnual,
}: {
	gap?: BudgetGap;
	tuitionAnnual?: number;
}) {
	if (!gap || gap.status === "unknown") {
		return null;
	}

	const formatBudget = (value?: number) => {
		if (!value) return undefined;
		return `$${(value / 1000).toFixed(0)}k`;
	};

	const getNote = () => {
		if (gap.status === "within") return "Within budget";
		if (gap.status === "stretch") {
			return gap.scholarshipAvailable
				? "Stretch - Scholarships available"
				: "Stretch budget";
		}
		if (gap.status === "over") {
			const overAmount = gap.overBudgetUsd
				? `$${(gap.overBudgetUsd / 1000).toFixed(0)}k over`
				: "Over budget";
			return gap.scholarshipAvailable
				? `${overAmount} - Scholarships available`
				: overAmount;
		}
		return undefined;
	};

	return (
		<GapCheckItem
			label="Budget"
			status={gap.status}
			userValue={formatBudget(gap.userBudgetUsd)}
			userLabel="Your max"
			requiredValue={formatBudget(gap.tuitionUsd || tuitionAnnual)}
			requiredLabel="Tuition"
			note={getNote()}
		/>
	);
}

function formatCurrency(value?: number): string {
	if (!value) return "N/A";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(value);
}

function formatDuration(months?: number): string {
	if (!months) return "N/A";
	const years = Math.floor(months / 12);
	const remainingMonths = months % 12;
	if (years === 0) return `${remainingMonths} months`;
	if (remainingMonths === 0) return `${years} year${years > 1 ? "s" : ""}`;
	return `${years}y ${remainingMonths}m`;
}

// TODO: Enable IntakeCard when backend supports detailed intake data (seasons, deadlines, etc.)
function _IntakeCard({
	intake,
	isExpanded,
	onToggle,
}: {
	intake: ProgramIntakeResponse;
	isExpanded: boolean;
	onToggle: () => void;
}) {
	return (
		<div className="border border-border rounded-xl overflow-hidden">
			<button
				type="button"
				onClick={onToggle}
				className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
			>
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
						<Calendar className="w-5 h-5 text-primary" />
					</div>
					<div className="text-left">
						<p className="font-semibold text-foreground">
							{intake.seasonDisplay || intake.season || "N/A"}
						</p>
						<p className="text-xs text-muted-foreground">
							Deadline: {intake.applicationDeadline || "N/A"}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{intake.isActive && (
						<Badge className="bg-primary/10 text-primary border-0">Open</Badge>
					)}
					<ChevronDown
						className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
					/>
				</div>
			</button>
			{isExpanded && (
				<div className="px-4 pb-4 pt-0 border-t border-border bg-muted/30">
					<div className="pt-3 space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Application Opens</span>
							<span className="font-medium">
								{intake.applicationStartDate || "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Early Deadline</span>
							<span className="font-medium">
								{intake.earlyDeadline || "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">
								Application Deadline
							</span>
							<span className="font-medium">
								{intake.applicationDeadline || "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Classes Begin</span>
							<span className="font-medium">{intake.startDate || "N/A"}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export function ProgramDetailDrawer({
	programId,
	open,
	onOpenChange,
	onCompare,
	onAddToDashboard,
}: ProgramDetailDrawerProps) {
	// TODO: Implement intake expansion UI when backend provides multiple intake periods
	const [_expandedIntake, _setExpandedIntake] = useState<string | null>(null);

	// Fetch detailed program data
	const {
		data: programDetail,
		isLoading,
		error,
	} = useGetProgramDetail(programId || "", {
		query: {
			enabled: !!programId && open,
			staleTime: 5 * 60 * 1000, // cache for 5 minutes
		},
	});

	const program = unwrapResponse<ProgramDetailResponse>(programDetail);
	const req = program?.requirements;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-lg p-0 flex flex-col h-full"
			>
				<SheetTitle className="sr-only">Program Details</SheetTitle>
				{isLoading ? (
					<div className="flex-1 flex items-center justify-center">
						<div className="flex flex-col items-center gap-3">
							<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
							<p className="text-sm text-muted-foreground">
								Loading program details...
							</p>
						</div>
					</div>
				) : error || !program ? (
					<div className="flex-1 flex items-center justify-center p-6 text-center">
						<div className="space-y-3">
							<div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
								<AlertTriangle className="w-6 h-6 text-destructive" />
							</div>
							<h3 className="text-lg font-semibold">Failed to load details</h3>
							<p className="text-sm text-muted-foreground max-w-xs mx-auto">
								{error instanceof Error
									? error.message
									: "Could not retrieve program information. Please try again."}
							</p>
							<Button onClick={() => onOpenChange(false)} variant="outline">
								Close
							</Button>
						</div>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1">
							<div className="p-6 space-y-6">
								{/* Header */}
								<header className="space-y-4">
									<div className="flex items-start gap-4">
										<div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border overflow-hidden">
											{program.universityLogoUrl ? (
												<Image
													src={program.universityLogoUrl}
													alt={program.universityName || "University"}
													width={64}
													height={64}
													className="object-contain"
												/>
											) : (
												<GraduationCap className="w-8 h-8 text-primary" />
											)}
										</div>
										<div className="flex-1 min-w-0">
											<h1 className="text-xl font-bold text-foreground leading-tight">
												{program.programName || "N/A"}
											</h1>
											<p className="text-sm font-medium text-muted-foreground mt-1">
												{program.universityName || "N/A"}
											</p>
											<div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
												<MapPin className="w-3.5 h-3.5" />
												<span>
													{program.universityCity || "N/A"},{" "}
													{program.universityCountry || "N/A"}
												</span>
											</div>
										</div>
									</div>

									{/* Ranking Badges */}
									<div className="flex flex-wrap gap-2">
										{program.rankingQsDisplay && (
											<Badge className="bg-primary/10 text-primary border-0 px-2.5 py-0.5 text-xs font-medium font-num">
												<Award className="w-3 h-3 mr-1" />
												QS #{program.rankingQsDisplay}
											</Badge>
										)}
										{program.rankingTimesDisplay && (
											<Badge className="bg-primary/10 text-primary border-0 px-2.5 py-0.5 text-xs font-medium font-num">
												<Award className="w-3 h-3 mr-1" />
												Times #{program.rankingTimesDisplay}
											</Badge>
										)}
										{program.fitScore && (
											<Badge className="bg-primary/10 text-primary border-0 px-2.5 py-0.5 text-xs font-medium font-num">
												{program.fitScore}% Match
											</Badge>
										)}
									</div>
								</header>

								{/* Info Grid */}
								<section className="grid grid-cols-3 gap-3">
									<div className="bg-primary/5 rounded-xl p-3 border border-primary/20 text-center">
										<Clock className="w-5 h-5 text-primary mx-auto mb-2" />
										<p className="text-xs text-muted-foreground">Duration</p>
										<p className="font-semibold text-sm text-foreground mt-0.5 font-num">
											{formatDuration(program.durationMonths)}
										</p>
									</div>
									<div className="bg-primary/5 rounded-xl p-3 border border-primary/20 text-center">
										<BookOpen className="w-5 h-5 text-primary mx-auto mb-2" />
										<p className="text-xs text-muted-foreground">Study Mode</p>
										<p className="font-semibold text-sm text-foreground mt-0.5">
											{formatDeliveryMode(program.deliveryMode)}
										</p>
									</div>
									<div className="bg-primary/5 rounded-xl p-3 border border-primary/20 text-center">
										<Globe className="w-5 h-5 text-primary mx-auto mb-2" />
										<p className="text-xs text-muted-foreground">Language</p>
										<p className="font-semibold text-sm text-foreground mt-0.5">
											{formatLanguage(program.language)}
										</p>
									</div>
								</section>

								{/* Tuition Fees */}
								<section className="bg-primary/5 rounded-xl p-4 border border-primary/20">
									<div className="flex items-center gap-2 mb-3">
										<DollarSign className="w-5 h-5 text-primary" />
										<h3 className="font-semibold text-foreground">
											Tuition Fees
										</h3>
									</div>
									<div className="grid grid-cols-3 gap-4">
										<div>
											<p className="text-xs text-muted-foreground">Per Year</p>
											<p className="text-lg font-bold text-foreground font-num">
												{formatTuitionRange(
													program.tuition?.annualMin,
													program.tuition?.annualMax,
													program.tuition?.currency || "USD",
												)}
											</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground">
												Total Program
											</p>
											<p className="text-lg font-bold text-foreground font-num">
												{program.tuition?.total
													? formatCurrencyWithCode(
															program.tuition.total,
															program.tuition?.currency || "USD",
														)
													: "N/A"}
											</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground">App Fee</p>
											<p className="text-lg font-bold text-foreground font-num">
												{formatCurrency(program.applicationFeeUsd)}
											</p>
										</div>
									</div>
									{program.tuition?.notes && (
										<p className="text-xs text-muted-foreground mt-2">
											{program.tuition.notes}
										</p>
									)}
									{program.scholarshipAvailable && (
										<p className="text-xs text-primary mt-2">
											✓ Scholarship available
										</p>
									)}
								</section>

								{/* Requirements Section - Using pre-computed gap data from API */}
								<section>
									<div className="flex items-center gap-2 mb-3">
										<CheckCircle2 className="w-5 h-5 text-primary" />
										<h3 className="font-semibold text-foreground">
											Entry Requirements
										</h3>
									</div>
									<div className="space-y-2">
										{/* GPA - using gap data */}
										<GpaGapItem
											gap={program.gpaGap}
											fallbackRequired={req?.gpaMinimum}
										/>

										{/* English - using gap data */}
										<EnglishGapItem
											gap={program.englishGap}
											fallbackRequired={req?.ieltsMinimum}
										/>

										{/* Budget - using gap data */}
										<BudgetGapItem
											gap={program.budgetGap}
											tuitionAnnual={program.tuition?.annualMin}
										/>

										{/* TOEFL - show if required and no English gap (fallback) */}
										{req?.toeflMinimum && !program.englishGap && (
											<GapCheckItem
												label="TOEFL"
												requiredValue={`${req.toeflMinimum}+`}
											/>
										)}

										{/* GRE - show if required */}
										{req?.greMinimum && (
											<GapCheckItem
												label="GRE"
												requiredValue={`${req.greMinimum}+`}
											/>
										)}

										{/* GMAT - show if required */}
										{req?.gmatMinimum && (
											<GapCheckItem
												label="GMAT"
												requiredValue={`${req.gmatMinimum}+`}
											/>
										)}

										{/* Additional Requirements */}
										{req?.documents && req.documents.length > 0 && (
											<div className="p-3 rounded-lg border border-border bg-muted/50">
												<p className="font-medium text-foreground text-sm mb-2">
													Additional Requirements
												</p>
												<ul className="text-xs text-muted-foreground space-y-1">
													{req.documents.map((doc: string) => (
														<li key={doc}>• {doc}</li>
													))}
												</ul>
											</div>
										)}

										{/* Work Experience */}
										{req?.workExperienceYears && (
											<div className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5">
												<p className="font-medium text-foreground text-sm">
													Work Experience
												</p>
												<Badge className="bg-primary text-primary-foreground border-0 font-num">
													{req.workExperienceYears}+ years
												</Badge>
											</div>
										)}
									</div>
									{req?.notes && (
										<p className="text-xs text-muted-foreground mt-3">
											{req.notes}
										</p>
									)}
								</section>

								{/* External Links Section */}
								{(program.programUrl ||
									program.admissionsUrl ||
									program.universityWebsiteUrl) && (
									<section>
										<div className="flex items-center gap-2 mb-3">
											<Link2 className="w-5 h-5 text-primary" />
											<h3 className="font-semibold text-foreground">
												External Links
											</h3>
										</div>
										<div className="space-y-2">
											{program.programUrl && (
												<a
													href={program.programUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors group"
												>
													<div className="flex items-center gap-3">
														<GraduationCap className="w-5 h-5 text-primary" />
														<span className="text-sm font-medium text-foreground">
															Program Page
														</span>
													</div>
													<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
												</a>
											)}
											{program.admissionsUrl && (
												<a
													href={program.admissionsUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors group"
												>
													<div className="flex items-center gap-3">
														<CheckCircle2 className="w-5 h-5 text-primary" />
														<span className="text-sm font-medium text-foreground">
															Admissions Info
														</span>
													</div>
													<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
												</a>
											)}
											{program.universityWebsiteUrl && (
												<a
													href={program.universityWebsiteUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors group"
												>
													<div className="flex items-center gap-3">
														<Globe className="w-5 h-5 text-primary" />
														<span className="text-sm font-medium text-foreground">
															University Website
														</span>
													</div>
													<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
												</a>
											)}
										</div>
									</section>
								)}
							</div>
						</ScrollArea>

						{/* Sticky Footer */}
						<SheetFooter className="border-t border-border p-4 bg-background">
							<div className="flex gap-3 w-full">
								<Button
									variant="outline"
									className="flex-1 gap-2"
									onClick={() => program?.id && onCompare?.(program.id)}
								>
									<Scale className="w-4 h-4" />
									Compare
								</Button>
								<Button
									className="flex-2 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
									onClick={() => program?.id && onAddToDashboard?.(program.id)}
								>
									<Plus className="w-4 h-4" />
									Nộp học bổng
								</Button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
