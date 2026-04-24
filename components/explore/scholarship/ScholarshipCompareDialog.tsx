"use client";

import {
	AlertTriangle,
	Award,
	Calendar,
	DollarSign,
	FileText,
	GraduationCap,
	Languages,
	MapPin,
	Plus,
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
import { formatSnakeCaseLabel } from "@/lib/utils";
import type { Locale } from "@/lib/utils/displayFormatters";
import {
	formatCountryName,
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
// Sub-Components
// ============================================================================

function ScholarshipHeaderCell({
	scholarship,
}: {
	scholarship: ScholarshipListItemResponse;
}) {
	return (
		<th className="p-4 text-left border-l border-border min-w-64">
			<div className="space-y-3">
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
							? `${formatSnakeCaseLabel(scholarship.universityCity)}, ${formatCountryName(scholarship.universityCountry)}`
							: formatCountryName(scholarship.universityCountry)}
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

	const primaryCoverage = getCoverageDisplay();
	const isFullFunded =
		scholarship.coverageType?.toLowerCase() === "full_funded";
	const coverageTypeLine = scholarship.coverageType
		? formatCoverageTypeI18n(scholarship.coverageType, locale)
		: "";
	// Avoid "Toàn phần" + green badge "Toàn phần" when the headline is already the type label.
	const primaryAlreadyShowsCoverageType =
		coverageTypeLine.length > 0 &&
		primaryCoverage.trim().toLowerCase() ===
			coverageTypeLine.trim().toLowerCase();

	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">{primaryCoverage}</p>
				{isFullFunded && !primaryAlreadyShowsCoverageType && (
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
	const formatFieldList = (fields: string[]) =>
		fields.map((f) => formatSnakeCaseLabel(f)).join(", ");

	return (
		<td className="p-4 border-l border-border align-top">
			{scholarship.eligibleFields && scholarship.eligibleFields.length > 0 ? (
				<div className="text-sm">
					{scholarship.eligibleFields.length <= 3 ? (
						formatFieldList(scholarship.eligibleFields)
					) : (
						<>
							{formatFieldList(scholarship.eligibleFields.slice(0, 2))}
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
