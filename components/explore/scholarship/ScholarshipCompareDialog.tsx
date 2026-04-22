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
import { useLocale, useTranslations } from "next-intl";
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
import type { Locale } from "@/lib/utils/displayFormatters";
import {
	formatCoverageAmount,
	formatCoverageDurationI18n,
	formatCoverageTypeI18n,
	formatEligibilityTypeI18n,
	formatScholarshipDegreeLevelI18n,
	getDeadlineInfo,
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

// ============================================================================
// Helper Components (need translations passed in)
// ============================================================================

function getMatchBadge(
	fitCategory: string | undefined,
	fitScore: number | undefined,
	labels: {
		strongFit: string;
		goodFit: string;
		competitive: string;
		incompleteData: string;
	},
) {
	const score = fitScore ?? 0;
	switch (fitCategory) {
		case "safety":
			return (
				<Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
					<CheckCircle2 className="w-3 h-3" />
					{labels.strongFit} ({score}%)
				</Badge>
			);
		case "target":
			return (
				<Badge className="bg-blue-100 text-blue-700 border-blue-200 gap-1">
					<ThumbsUp className="w-3 h-3" />
					{labels.goodFit} ({score}%)
				</Badge>
			);
		case "reach":
			return (
				<Badge className="bg-orange-100 text-orange-700 border-orange-200 gap-1">
					<TrendingUp className="w-3 h-3" />
					{labels.competitive} ({score}%)
				</Badge>
			);
		case "unknown":
			return (
				<Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1">
					<HelpCircle className="w-3 h-3" />
					{labels.incompleteData}
				</Badge>
			);
		default:
			return null;
	}
}

// ============================================================================
// Sub-Components
// ============================================================================

function ScholarshipHeaderCell({
	scholarship,
	matchLabels,
}: {
	scholarship: ScholarshipListItemResponse;
	matchLabels: {
		strongFit: string;
		goodFit: string;
		competitive: string;
		incompleteData: string;
	};
}) {
	return (
		<th className="p-4 text-left border-l border-border min-w-64">
			<div className="space-y-3">
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
					{getMatchBadge(
						scholarship.fitCategory,
						scholarship.fitScore,
						matchLabels,
					)}
				</div>

				<div>
					<h3 className="font-semibold text-foreground line-clamp-2">
						{scholarship.name}
					</h3>
					<p className="text-sm text-muted-foreground">
						{scholarship.universityName || scholarship.sourceName}
					</p>
				</div>

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

function CoverageCell({
	scholarship,
	locale,
	fullFundedLabel,
}: {
	scholarship: ScholarshipListItemResponse;
	locale: Locale;
	fullFundedLabel: string;
}) {
	const getCoverageDisplay = () => {
		if (scholarship.coveragePercentage) {
			return `${scholarship.coveragePercentage}% tuition`;
		}
		if (scholarship.coverageAmountMin || scholarship.coverageAmountMax) {
			return formatCoverageAmount(
				scholarship.coverageAmountMin,
				scholarship.coverageAmountMax,
			);
		}
		return formatCoverageTypeI18n(scholarship.coverageType, locale);
	};

	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">{getCoverageDisplay()}</p>
				{scholarship.coverageType?.toLowerCase() === "full_funded" && (
					<Badge className="bg-green-100 text-green-700 border-0 text-xs">
						{fullFundedLabel}
					</Badge>
				)}
				<p className="text-sm text-muted-foreground">
					{formatCoverageDurationI18n(scholarship.coverageDuration, locale)}
				</p>
			</div>
		</td>
	);
}

function EligibilityCell({
	scholarship,
	locale,
	focusLabel,
}: {
	scholarship: ScholarshipListItemResponse;
	locale: Locale;
	focusLabel: string;
}) {
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">
					{formatEligibilityTypeI18n(scholarship.eligibilityType, locale)}
				</p>
				{scholarship.eligibilityFocus &&
					scholarship.eligibilityFocus.length > 0 && (
						<p className="text-sm text-muted-foreground">
							{focusLabel}:{" "}
							{scholarship.eligibilityFocus.slice(0, 2).join(", ")}
						</p>
					)}
			</div>
		</td>
	);
}

function DegreeLevelsCell({
	scholarship,
	locale,
	naLabel,
}: {
	scholarship: ScholarshipListItemResponse;
	locale: Locale;
	naLabel: string;
}) {
	return (
		<td className="p-4 border-l border-border align-top">
			{scholarship.degreeLevels && scholarship.degreeLevels.length > 0 ? (
				<div className="flex flex-wrap gap-1">
					{scholarship.degreeLevels.map((level) => (
						<Badge key={level} variant="outline" className="text-xs">
							{formatScholarshipDegreeLevelI18n(level, locale)}
						</Badge>
					))}
				</div>
			) : (
				<span className="text-muted-foreground">{naLabel}</span>
			)}
		</td>
	);
}

function FieldsCell({
	scholarship,
	nMoreLabel,
	allFieldsLabel,
}: {
	scholarship: ScholarshipListItemResponse;
	nMoreLabel: (n: number) => string;
	allFieldsLabel: string;
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
								{nMoreLabel(scholarship.eligibleFields.length - 2)}
							</span>
						</>
					)}
				</div>
			) : (
				<span className="text-muted-foreground">{allFieldsLabel}</span>
			)}
		</td>
	);
}

function DeadlineCell({
	scholarship,
	locale,
}: {
	scholarship: ScholarshipListItemResponse;
	locale: Locale;
}) {
	const deadline = getDeadlineInfo(scholarship.applicationDeadline, locale);
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

function GpaCell({
	scholarship,
	notRequiredLabel,
}: {
	scholarship: ScholarshipListItemResponse;
	notRequiredLabel: string;
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
			<span className="text-muted-foreground">{notRequiredLabel}</span>
		</td>
	);
}

function EnglishCell({
	scholarship,
	notSpecifiedLabel,
}: {
	scholarship: ScholarshipListItemResponse;
	notSpecifiedLabel: string;
}) {
	const requirements: string[] = [];
	if (scholarship.minIelts) requirements.push(`IELTS ${scholarship.minIelts}+`);
	if (scholarship.minToefl) requirements.push(`TOEFL ${scholarship.minToefl}+`);

	if (requirements.length === 0) {
		return (
			<td className="p-4 border-l border-border align-top">
				<span className="text-muted-foreground">{notSpecifiedLabel}</span>
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

function AnalysisCell({
	scholarship,
	analysisFn,
}: {
	scholarship: ScholarshipListItemResponse;
	analysisFn: (cat?: string) => string;
}) {
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="flex items-start gap-2 text-sm">
				<Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
				<span className="text-muted-foreground">
					{analysisFn(scholarship.fitCategory)}
				</span>
			</div>
		</td>
	);
}

function ActionsCell({
	scholarship,
	onAddToDashboard,
	onRemoveScholarship,
	applyLabel,
	removeLabel,
}: {
	scholarship: ScholarshipListItemResponse;
	onAddToDashboard: (id: string) => void;
	onRemoveScholarship: (id: string) => void;
	applyLabel: string;
	removeLabel: string;
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
					{applyLabel}
				</Button>
				<button
					type="button"
					onClick={() => onRemoveScholarship(scholarship.id ?? "")}
					className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors text-center"
				>
					{removeLabel}
				</button>
			</div>
		</td>
	);
}

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

export function ScholarshipCompareDialog({
	open,
	onOpenChange,
	selectedScholarshipsList,
	onRemoveScholarship,
	onAddToDashboard,
}: ScholarshipCompareDialogProps) {
	const t = useTranslations("compare");
	const locale = useLocale() as Locale;

	const matchLabels = {
		strongFit: t("strongFitLabel"),
		goodFit: t("goodFitLabel"),
		competitive: t("competitiveLabel"),
		incompleteData: t("incompleteDataLabel"),
	};

	const getFitAnalysis = (cat?: string) => {
		switch (cat) {
			case "safety":
				return t("strongFitAnalysis");
			case "target":
				return t("goodFitAnalysis");
			case "reach":
				return t("reachAnalysis");
			default:
				return t("unknownAnalysis");
		}
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className="max-h-[90vh] p-0 gap-0 overflow-hidden">
				<DrawerHeader className="sr-only">
					<DrawerTitle>{t("compareScholarships")}</DrawerTitle>
					<DrawerDescription>{t("compareScholarshipsDesc")}</DrawerDescription>
				</DrawerHeader>

				<ScrollArea className="max-h-[90vh] overflow-y-auto">
					<div className="p-6">
						<div className="border border-border rounded-lg overflow-hidden">
							<table className="w-full">
								<thead>
									<tr className="border-b border-border bg-muted/30">
										<th className="p-4 text-left font-medium text-sm text-muted-foreground w-40 align-top">
											<span className="uppercase tracking-wide text-xs">
												{t("comparisonCriteria")}
											</span>
										</th>
										{selectedScholarshipsList.map((scholarship) => (
											<ScholarshipHeaderCell
												key={scholarship.id}
												scholarship={scholarship}
												matchLabels={matchLabels}
											/>
										))}
									</tr>
								</thead>
								<tbody>
									{/* Coverage Row */}
									<tr className="border-b border-border">
										<RowLabel icon={DollarSign} label={t("coverage")} />
										{selectedScholarshipsList.map((scholarship) => (
											<CoverageCell
												key={scholarship.id}
												scholarship={scholarship}
												locale={locale}
												fullFundedLabel={t("fullFunded")}
											/>
										))}
									</tr>

									{/* Eligibility Type Row */}
									<tr className="border-b border-border">
										<RowLabel icon={Award} label={t("eligibilityType")} />
										{selectedScholarshipsList.map((scholarship) => (
											<EligibilityCell
												key={scholarship.id}
												scholarship={scholarship}
												locale={locale}
												focusLabel={t("focus")}
											/>
										))}
									</tr>

									{/* Degree Levels Row */}
									<tr className="border-b border-border">
										<RowLabel icon={GraduationCap} label={t("degreeLevels")} />
										{selectedScholarshipsList.map((scholarship) => (
											<DegreeLevelsCell
												key={scholarship.id}
												scholarship={scholarship}
												locale={locale}
												naLabel="N/A"
											/>
										))}
									</tr>

									{/* Eligible Fields Row */}
									<tr className="border-b border-border">
										<RowLabel icon={FileText} label={t("eligibleFields")} />
										{selectedScholarshipsList.map((scholarship) => (
											<FieldsCell
												key={scholarship.id}
												scholarship={scholarship}
												nMoreLabel={(n) => t("nMore").replace("{n}", String(n))}
												allFieldsLabel={t("allFields")}
											/>
										))}
									</tr>

									{/* Deadline Row */}
									<tr className="border-b border-border">
										<RowLabel
											icon={Calendar}
											label={t("applicationDeadline")}
										/>
										{selectedScholarshipsList.map((scholarship) => (
											<DeadlineCell
												key={scholarship.id}
												scholarship={scholarship}
												locale={locale}
											/>
										))}
									</tr>

									{/* GPA Requirements Row */}
									<tr className="border-b border-border">
										<RowLabel icon={GraduationCap} label={t("minGpa")} />
										{selectedScholarshipsList.map((scholarship) => (
											<GpaCell
												key={scholarship.id}
												scholarship={scholarship}
												notRequiredLabel={t("notRequired")}
											/>
										))}
									</tr>

									{/* English Requirements Row */}
									<tr className="border-b border-border">
										<RowLabel
											icon={Languages}
											label={t("englishRequirement")}
										/>
										{selectedScholarshipsList.map((scholarship) => (
											<EnglishCell
												key={scholarship.id}
												scholarship={scholarship}
												notSpecifiedLabel={t("notSpecified")}
											/>
										))}
									</tr>

									{/* Fit Analysis Row */}
									<tr className="border-b border-border bg-blue-50/50 dark:bg-blue-950/20">
										<td className="p-4 align-top">
											<div className="flex items-start gap-2 text-sm font-medium text-primary">
												<Info className="w-4 h-4 mt-0.5" />
												<div>
													<p>{t("fitAnalysis")}</p>
													<p className="font-normal text-xs text-muted-foreground mt-1">
														{t("basedOnYourProfile")}
													</p>
												</div>
											</div>
										</td>
										{selectedScholarshipsList.map((scholarship) => (
											<AnalysisCell
												key={scholarship.id}
												scholarship={scholarship}
												analysisFn={getFitAnalysis}
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
												applyLabel={t("applyNow")}
												removeLabel={t("removeFromComparison")}
											/>
										))}
									</tr>
								</tbody>
							</table>
						</div>

						{/* Add More CTA */}
						{selectedScholarshipsList.length < 4 && (
							<div className="mt-6 flex justify-center">
								<Button
									variant="outline"
									onClick={() => onOpenChange(false)}
									className="gap-2"
								>
									<Plus className="w-4 h-4" />
									{t("addMoreScholarships")}
								</Button>
							</div>
						)}
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
}
