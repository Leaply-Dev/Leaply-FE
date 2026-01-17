"use client";

import {
	AlertTriangle,
	Award,
	BookOpen,
	Briefcase,
	Calendar,
	Check,
	CheckCircle2,
	DollarSign,
	ExternalLink,
	FileText,
	Globe,
	GraduationCap,
	Link2,
	MapPin,
	Plus,
	Scale,
	Sparkles,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetTitle,
} from "@/components/ui/sheet";
import { useGetScholarshipDetail } from "@/lib/generated/api/endpoints/scholarship-explore/scholarship-explore";
import type { EnglishGap, GpaGap } from "@/lib/generated/api/models";
import {
	formatCoverageAmount,
	formatCoverageDuration,
	formatCoverageType,
	formatDate,
	formatEligibilityFocus,
	formatEligibilityType,
	formatRequiredDocument,
	formatScholarshipDegreeLevel,
	formatSourceType,
} from "@/lib/utils/displayFormatters";

interface ScholarshipDetailDrawerProps {
	scholarshipId: string | null;
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
				border: "border-green-200 dark:border-green-800",
				bg: "bg-green-50 dark:bg-green-900/20",
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
				border: "border-yellow-200 dark:border-yellow-800",
				bg: "bg-yellow-50 dark:bg-yellow-900/20",
				icon: "warning",
			};
		case "gap":
		case "over":
			return {
				border: "border-orange-200 dark:border-orange-800",
				bg: "bg-orange-50 dark:bg-orange-900/20",
				icon: "warning",
			};
		default:
			return { border: "border-border", bg: "bg-muted/50", icon: "neutral" };
	}
}

/**
 * Format delta value with sign
 */
function formatDelta(delta?: number): string {
	if (delta === undefined || delta === null) return "";
	const sign = delta >= 0 ? "+" : "";
	const formatted = Number.isInteger(delta)
		? delta.toString()
		: delta.toFixed(1);
	return `${sign}${formatted}`;
}

/**
 * Gap-based requirement check item
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
				return (
					<div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
						<div className="w-2 h-2 rounded-full bg-muted-foreground" />
					</div>
				);
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
							className={`text-sm font-semibold ${
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
	fallbackIelts,
	fallbackToefl,
}: {
	gap?: EnglishGap;
	fallbackIelts?: number;
	fallbackToefl?: number;
}) {
	if (!gap || gap.status === "unknown") {
		if (fallbackIelts || fallbackToefl) {
			const requirements: string[] = [];
			if (fallbackIelts) requirements.push(`IELTS ${fallbackIelts}+`);
			if (fallbackToefl) requirements.push(`TOEFL ${fallbackToefl}+`);
			return (
				<GapCheckItem
					label="English"
					requiredValue={requirements.join(" / ")}
				/>
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
	fallbackScale,
}: {
	gap?: GpaGap;
	fallbackRequired?: number;
	fallbackScale?: number;
}) {
	if (!gap || gap.status === "unknown") {
		if (fallbackRequired) {
			const scaleDisplay = fallbackScale ? ` / ${fallbackScale}` : "";
			return (
				<GapCheckItem
					label="GPA"
					requiredValue={`${fallbackRequired}+${scaleDisplay}`}
				/>
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

export function ScholarshipDetailDrawer({
	scholarshipId,
	open,
	onOpenChange,
	onCompare,
	onAddToDashboard,
}: ScholarshipDetailDrawerProps) {
	// Fetch detailed scholarship data
	const {
		data: scholarshipDetail,
		isLoading,
		error,
	} = useGetScholarshipDetail(scholarshipId || "", {
		query: {
			enabled: !!scholarshipId && open,
			staleTime: 5 * 60 * 1000, // cache for 5 minutes
		},
	});

	const scholarship = scholarshipDetail?.data?.data;

	// Format coverage display
	const coverageDisplay = scholarship ? getCoverageDisplay(scholarship) : null;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-lg p-0 flex flex-col h-full"
			>
				<SheetTitle className="sr-only">Scholarship Details</SheetTitle>
				{isLoading ? (
					<div className="flex-1 flex items-center justify-center">
						<div className="flex flex-col items-center gap-3">
							<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
							<p className="text-sm text-muted-foreground">
								Loading scholarship details...
							</p>
						</div>
					</div>
				) : error || !scholarship ? (
					<div className="flex-1 flex items-center justify-center p-6 text-center">
						<div className="space-y-3">
							<div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
								<AlertTriangle className="w-6 h-6 text-destructive" />
							</div>
							<h3 className="text-lg font-semibold">Failed to load details</h3>
							<p className="text-sm text-muted-foreground max-w-xs mx-auto">
								{error instanceof Error
									? error.message
									: "Could not retrieve scholarship information. Please try again."}
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
												<Award className="w-8 h-8 text-primary" />
											)}
										</div>
										<div className="flex-1 min-w-0">
											<h1 className="text-xl font-bold text-foreground leading-tight">
												{scholarship.name || "N/A"}
											</h1>
											<p className="text-sm font-medium text-muted-foreground mt-1">
												{scholarship.universityName ||
													scholarship.sourceName ||
													"N/A"}
											</p>
											{scholarship.universityCity &&
												scholarship.universityCountry && (
													<div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
														<MapPin className="w-3.5 h-3.5" />
														<span>
															{scholarship.universityCity},{" "}
															{scholarship.universityCountry}
														</span>
													</div>
												)}
										</div>
									</div>

									{/* Badges */}
									<div className="flex flex-wrap gap-2">
										{scholarship.fitScore && (
											<Badge className="bg-primary/10 text-primary border-0 px-2.5 py-0.5 text-xs font-medium">
												{scholarship.fitScore}% Match
											</Badge>
										)}
										{scholarship.coverageType && (
											<Badge
												className={`border-0 px-2.5 py-0.5 text-xs font-medium gap-1 ${
													scholarship.coverageType.toLowerCase() ===
													"full_funded"
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
												className="px-2.5 py-0.5 text-xs font-medium gap-1"
											>
												<Target className="w-3 h-3" />
												{formatEligibilityType(scholarship.eligibilityType)}
											</Badge>
										)}
										{scholarship.sourceType && (
											<Badge
												variant="outline"
												className="px-2.5 py-0.5 text-xs font-medium"
											>
												{formatSourceType(scholarship.sourceType)}
											</Badge>
										)}
									</div>
								</header>

								{/* Info Grid */}
								<section className="grid grid-cols-3 gap-3">
									{/* Coverage */}
									<div className="bg-primary/5 rounded-xl p-3 border border-primary/20 text-center">
										<DollarSign className="w-5 h-5 text-primary mx-auto mb-2" />
										<p className="text-xs text-muted-foreground">Coverage</p>
										<p className="font-semibold text-sm text-foreground mt-0.5">
											{coverageDisplay || "N/A"}
										</p>
									</div>
									{/* Duration */}
									<div className="bg-primary/5 rounded-xl p-3 border border-primary/20 text-center">
										<Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
										<p className="text-xs text-muted-foreground">Duration</p>
										<p className="font-semibold text-sm text-foreground mt-0.5">
											{formatCoverageDuration(scholarship.coverageDuration)}
										</p>
									</div>
									{/* Degree Levels */}
									<div className="bg-primary/5 rounded-xl p-3 border border-primary/20 text-center">
										<GraduationCap className="w-5 h-5 text-primary mx-auto mb-2" />
										<p className="text-xs text-muted-foreground">Degree</p>
										<p className="font-semibold text-sm text-foreground mt-0.5 line-clamp-1">
											{scholarship.degreeLevels?.length
												? scholarship.degreeLevels
														.map(formatScholarshipDegreeLevel)
														.join(", ")
												: "N/A"}
										</p>
									</div>
								</section>

								{/* Description */}
								{scholarship.description && (
									<section>
										<div className="flex items-center gap-2 mb-3">
											<BookOpen className="w-5 h-5 text-primary" />
											<h3 className="font-semibold text-foreground">About</h3>
										</div>
										<p className="text-sm text-muted-foreground leading-relaxed">
											{scholarship.description}
										</p>
									</section>
								)}

								{/* Eligibility Section */}
								<section>
									<div className="flex items-center gap-2 mb-3">
										<Users className="w-5 h-5 text-primary" />
										<h3 className="font-semibold text-foreground">
											Eligibility
										</h3>
									</div>
									<div className="space-y-3">
										{/* Eligible Fields */}
										{scholarship.eligibleFields &&
											scholarship.eligibleFields.length > 0 && (
												<div className="p-3 rounded-lg border border-border bg-muted/50">
													<p className="font-medium text-foreground text-sm mb-2">
														Eligible Fields
													</p>
													<div className="flex flex-wrap gap-1.5">
														{scholarship.eligibleFields.map((field) => (
															<Badge
																key={field}
																variant="secondary"
																className="text-xs"
															>
																{field}
															</Badge>
														))}
													</div>
												</div>
											)}

										{/* Eligibility Focus */}
										{scholarship.eligibilityFocus &&
											scholarship.eligibilityFocus.length > 0 && (
												<div className="p-3 rounded-lg border border-border bg-muted/50">
													<p className="font-medium text-foreground text-sm mb-2">
														Selection Criteria
													</p>
													<div className="flex flex-wrap gap-1.5">
														{scholarship.eligibilityFocus.map((focus) => (
															<Badge
																key={focus}
																variant="secondary"
																className="text-xs"
															>
																{formatEligibilityFocus(focus)}
															</Badge>
														))}
													</div>
												</div>
											)}

										{/* Nationality */}
										{scholarship.nationalityEligible &&
											scholarship.nationalityEligible.length > 0 && (
												<div className="p-3 rounded-lg border border-border bg-muted/50">
													<p className="font-medium text-foreground text-sm mb-2">
														Eligible Nationalities
													</p>
													<p className="text-sm text-muted-foreground">
														{scholarship.nationalityEligible.includes("all")
															? "All nationalities"
															: scholarship.nationalityEligible.join(", ")}
													</p>
												</div>
											)}
									</div>
								</section>

								{/* Requirements Section */}
								<section>
									<div className="flex items-center gap-2 mb-3">
										<CheckCircle2 className="w-5 h-5 text-primary" />
										<h3 className="font-semibold text-foreground">
											Requirements
										</h3>
									</div>
									<div className="space-y-2">
										{/* GPA */}
										<GpaGapItem
											gap={scholarship.gpaGap}
											fallbackRequired={scholarship.minGpa}
											fallbackScale={scholarship.gpaScale}
										/>

										{/* English */}
										<EnglishGapItem
											gap={scholarship.englishGap}
											fallbackIelts={scholarship.minIelts}
											fallbackToefl={scholarship.minToefl}
										/>

										{/* GRE */}
										{scholarship.minGre && (
											<GapCheckItem
												label="GRE"
												requiredValue={`${scholarship.minGre}+`}
											/>
										)}

										{/* GMAT */}
										{scholarship.minGmat && (
											<GapCheckItem
												label="GMAT"
												requiredValue={`${scholarship.minGmat}+`}
											/>
										)}

										{/* Work Experience */}
										{scholarship.workExperienceRequired && (
											<div className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5">
												<div className="flex items-center gap-3">
													<Briefcase className="w-5 h-5 text-primary" />
													<p className="font-medium text-foreground text-sm">
														Work Experience
													</p>
												</div>
												<Badge className="bg-primary text-primary-foreground border-0">
													{scholarship.minWorkExperienceYears
														? `${scholarship.minWorkExperienceYears}+ years`
														: "Required"}
												</Badge>
											</div>
										)}

										{/* Required Documents */}
										{scholarship.requiredDocuments &&
											scholarship.requiredDocuments.length > 0 && (
												<div className="p-3 rounded-lg border border-border bg-muted/50">
													<div className="flex items-center gap-2 mb-2">
														<FileText className="w-4 h-4 text-muted-foreground" />
														<p className="font-medium text-foreground text-sm">
															Required Documents
														</p>
													</div>
													<ul className="text-xs text-muted-foreground space-y-1">
														{scholarship.requiredDocuments.map((doc) => (
															<li key={doc}>• {formatRequiredDocument(doc)}</li>
														))}
													</ul>
													{scholarship.requiredDocumentsOther && (
														<p className="text-xs text-muted-foreground mt-2 italic">
															{scholarship.requiredDocumentsOther}
														</p>
													)}
												</div>
											)}

										{/* Other Requirements */}
										{scholarship.otherRequirements && (
											<div className="p-3 rounded-lg border border-border bg-muted/50">
												<p className="font-medium text-foreground text-sm mb-1">
													Other Requirements
												</p>
												<p className="text-xs text-muted-foreground">
													{scholarship.otherRequirements}
												</p>
											</div>
										)}
									</div>
								</section>

								{/* Application Info */}
								<section>
									<div className="flex items-center gap-2 mb-3">
										<Calendar className="w-5 h-5 text-primary" />
										<h3 className="font-semibold text-foreground">
											Application Timeline
										</h3>
									</div>
									<div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<p className="text-xs text-muted-foreground">Opens</p>
												<p className="font-semibold text-sm text-foreground mt-0.5">
													{scholarship.applicationOpenDate
														? formatDate(scholarship.applicationOpenDate)
														: "N/A"}
												</p>
											</div>
											<div>
												<p className="text-xs text-muted-foreground">
													Deadline
												</p>
												<p className="font-semibold text-sm text-foreground mt-0.5">
													{scholarship.applicationDeadline
														? formatDate(scholarship.applicationDeadline)
														: "N/A"}
												</p>
											</div>
										</div>
										{scholarship.intakeSeasons &&
											scholarship.intakeSeasons.length > 0 && (
												<div className="mt-3 pt-3 border-t border-primary/20">
													<p className="text-xs text-muted-foreground mb-1">
														Intake Seasons
													</p>
													<div className="flex flex-wrap gap-1.5">
														{scholarship.intakeSeasons.map((season) => (
															<Badge
																key={season}
																variant="secondary"
																className="text-xs capitalize"
															>
																{season}
															</Badge>
														))}
													</div>
												</div>
											)}
										{scholarship.applyWithProgram && (
											<p className="text-xs text-primary mt-3">
												✓ Applied together with program application
											</p>
										)}
									</div>
								</section>

								{/* Additional Benefits */}
								{scholarship.additionalBenefits && (
									<section>
										<div className="flex items-center gap-2 mb-3">
											<Sparkles className="w-5 h-5 text-primary" />
											<h3 className="font-semibold text-foreground">
												Additional Benefits
											</h3>
										</div>
										<div className="space-y-2">
											{scholarship.additionalBenefits.livingStipend && (
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Check className="w-4 h-4 text-green-500" />
													Living stipend included
												</div>
											)}
											{scholarship.additionalBenefits.travelAllowance && (
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Check className="w-4 h-4 text-green-500" />
													Travel allowance included
												</div>
											)}
											{scholarship.additionalBenefits.healthInsurance && (
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Check className="w-4 h-4 text-green-500" />
													Health insurance included
												</div>
											)}
											{scholarship.additionalBenefits.bookAllowance && (
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Check className="w-4 h-4 text-green-500" />
													Book allowance included
												</div>
											)}
											{scholarship.additionalBenefits.researchGrant && (
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Check className="w-4 h-4 text-green-500" />
													Research grant included
												</div>
											)}
											{scholarship.additionalBenefits.other && (
												<p className="text-sm text-muted-foreground">
													{typeof scholarship.additionalBenefits.other ===
													"string"
														? scholarship.additionalBenefits.other
														: JSON.stringify(
																scholarship.additionalBenefits.other,
															)}
												</p>
											)}
										</div>
									</section>
								)}

								{/* Coverage Notes */}
								{scholarship.coverageNotes && (
									<section className="p-3 rounded-lg border border-border bg-muted/50">
										<p className="text-xs text-muted-foreground">
											<span className="font-medium">Note:</span>{" "}
											{scholarship.coverageNotes}
										</p>
									</section>
								)}

								{/* External Links */}
								{(scholarship.url || scholarship.programApplicationUrl) && (
									<section>
										<div className="flex items-center gap-2 mb-3">
											<Link2 className="w-5 h-5 text-primary" />
											<h3 className="font-semibold text-foreground">
												External Links
											</h3>
										</div>
										<div className="space-y-2">
											{scholarship.url && (
												<a
													href={scholarship.url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors group"
												>
													<div className="flex items-center gap-3">
														<Award className="w-5 h-5 text-primary" />
														<span className="text-sm font-medium text-foreground">
															Scholarship Page
														</span>
													</div>
													<ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
												</a>
											)}
											{scholarship.programApplicationUrl && (
												<a
													href={scholarship.programApplicationUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors group"
												>
													<div className="flex items-center gap-3">
														<Globe className="w-5 h-5 text-primary" />
														<span className="text-sm font-medium text-foreground">
															Application Portal
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
									onClick={() => scholarship?.id && onCompare?.(scholarship.id)}
								>
									<Scale className="w-4 h-4" />
									Compare
								</Button>
								<Button
									className="flex-2 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
									onClick={() =>
										scholarship?.id && onAddToDashboard?.(scholarship.id)
									}
								>
									<Plus className="w-4 h-4" />
									Apply Now
								</Button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}

/**
 * Get coverage display text based on available data
 */
function getCoverageDisplay(scholarship: {
	coveragePercentage?: number;
	coverageAmountMin?: number;
	coverageAmountMax?: number;
	coverageType?: string;
}): string | null {
	// Priority 1: Percentage
	if (scholarship.coveragePercentage) {
		return `${scholarship.coveragePercentage}%`;
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
