"use client";

import {
	AlertTriangle,
	BookOpen,
	Calendar,
	Clock,
	DollarSign,
	GraduationCap,
	Languages,
	MapPin,
	Plus,
	Trophy,
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
import type { ProgramListItemResponse } from "@/lib/generated/api/models";
import type { Locale } from "@/lib/utils/displayFormatters";
import {
	formatCountryName,
	formatDeliveryModeI18n,
	formatDurationI18n,
	formatTuitionRange,
	getDeadlineInfo,
} from "@/lib/utils/displayFormatters";

// ============================================================================
// Types
// ============================================================================

interface CompareDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedProgramsList: ProgramListItemResponse[];
	onRemoveProgram: (id: string) => void;
	onAddToDashboard: (id: string) => void;
}

interface EnglishRequirement {
	type: "IELTS" | "TOEFL" | null;
	score: number | null;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getEnglishRequirement(
	program: ProgramListItemResponse,
): EnglishRequirement {
	// Prefer IELTS if available, otherwise TOEFL
	if (program.ieltsMinimum) {
		return { type: "IELTS", score: program.ieltsMinimum };
	}
	if (program.toeflMinimum) {
		return { type: "TOEFL", score: program.toeflMinimum };
	}
	return { type: null, score: null };
}

// ============================================================================
// Sub-Components
// ============================================================================

function ProgramHeaderCell({ program }: { program: ProgramListItemResponse }) {
	return (
		<th className="p-4 text-left border-l border-border min-w-64">
			<div className="space-y-3">
				<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
					{program.universityLogoUrl ? (
						<Image
							src={program.universityLogoUrl ?? ""}
							alt={program.universityName ?? ""}
							width={40}
							height={40}
							className="object-contain"
						/>
					) : (
						<span className="text-sm font-bold text-primary">
							{(program.universityName ?? "").charAt(0).toUpperCase()}
						</span>
					)}
				</div>

				<div>
					<h3 className="font-semibold text-foreground">
						{program.programName}
					</h3>
					<p className="text-sm text-muted-foreground">
						{program.universityName}
					</p>
				</div>

				<div className="flex items-center gap-1 text-sm text-muted-foreground">
					<MapPin className="w-3.5 h-3.5" />
					{formatCountryName(program.universityCountry)}
				</div>
			</div>
		</th>
	);
}

function TuitionCell({ program }: { program: ProgramListItemResponse }) {
	const t = useTranslations("compare");
	const locale = useLocale() as Locale;
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">
					{program.tuitionAnnualMin
						? formatTuitionRange(
								program.tuitionAnnualMin,
								program.tuitionAnnualMax,
								program.tuitionCurrency || "USD",
								locale,
							)
						: "N/A"}
				</p>
				{program.scholarshipAvailable && (
					<p className="text-sm text-green-600">✓ {t("hasScholarship")}</p>
				)}
				{!program.scholarshipAvailable && (
					<p className="text-sm text-muted-foreground italic">
						{t("noScholarshipThisTerm")}
					</p>
				)}
			</div>
		</td>
	);
}

function RankingCell({ program }: { program: ProgramListItemResponse }) {
	return (
		<td className="p-4 border-l border-border align-top">
			{program.rankingQsDisplay ? (
				<div className="flex flex-col gap-1.5">
					{program.rankingQsDisplay && (
						<div className="flex items-center gap-2">
							<Badge
								variant="outline"
								className="font-semibold text-purple-700 border-purple-300 bg-purple-50 dark:bg-purple-950/30"
							>
								QS #{program.rankingQsDisplay}
							</Badge>
						</div>
					)}
					{/* {program.rankingTimesDisplay && (
						<div className="flex items-center gap-2">
							<Badge
								variant="outline"
								className="font-semibold text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-950/30"
							>
								Times #{program.rankingTimesDisplay}
							</Badge>
						</div>
					)} */}
				</div>
			) : (
				<span className="text-muted-foreground">N/A</span>
			)}
		</td>
	);
}
function DegreeDeliveryCell({ program }: { program: ProgramListItemResponse }) {
	const locale = useLocale() as Locale;
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>
						{[
							program.degreeName,
							formatDeliveryModeI18n(program.deliveryMode, locale),
						]
							.filter((v) => v && v !== "N/A")
							.join(" • ")}
					</span>
				</div>
			</div>
		</td>
	);
}

function DurationCell({ program }: { program: ProgramListItemResponse }) {
	const locale = useLocale() as Locale;
	return (
		<td className="p-4 border-l border-border align-top">
			<span className="text-foreground">
				{formatDurationI18n(program.durationMonths, locale)}
			</span>
		</td>
	);
}
function DeadlineCell({ program }: { program: ProgramListItemResponse }) {
	const deadline = getDeadlineInfo(program.nextDeadline, "vi");
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

function GpaCell({ program }: { program: ProgramListItemResponse }) {
	if (program.gpaGap?.requiredValue) {
		return (
			<td className="p-4 border-l border-border align-top">
				<p className="font-semibold text-foreground">
					{program.gpaGap.requiredValue}
					{program.gpaGap.requiredScale
						? ` / ${program.gpaGap.requiredScale}`
						: ""}
				</p>
			</td>
		);
	}
	return (
		<td className="p-4 border-l border-border align-top">
			<span className="text-muted-foreground">N/A</span>
		</td>
	);
}

function EnglishCell({ program }: { program: ProgramListItemResponse }) {
	const req = getEnglishRequirement(program);

	if (!req.type || !req.score) {
		return (
			<td className="p-4 border-l border-border align-top">
				<span className="text-muted-foreground">N/A</span>
			</td>
		);
	}

	return (
		<td className="p-4 border-l border-border align-top">
			<p className="font-semibold text-foreground">
				{req.type} {req.score}
			</p>
		</td>
	);
}

function ActionsCell({
	program,
	onAddToDashboard,
	onRemoveProgram,
}: {
	program: ProgramListItemResponse;
	onAddToDashboard: (id: string) => void;
	onRemoveProgram: (id: string) => void;
}) {
	const t = useTranslations("compare");
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-3">
				<Button
					className="w-full"
					onClick={(e) => {
						e.stopPropagation();
						program.id && onAddToDashboard(program.id);
					}}
				>
					{t("applyScholarship")}
				</Button>
				<button
					type="button"
					onClick={() => onRemoveProgram(program.id ?? "")}
					className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors text-center"
				>
					{t("removeFromCompare")}
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

export function CompareDialog({
	open,
	onOpenChange,
	selectedProgramsList,
	onRemoveProgram,
	onAddToDashboard,
}: CompareDialogProps) {
	const t = useTranslations("compare");
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className="max-h-[90vh] p-0 gap-0 overflow-hidden">
				<DrawerHeader className="sr-only">
					<DrawerTitle>{t("title")}</DrawerTitle>
					<DrawerDescription>{t("compareDesc")}</DrawerDescription>
				</DrawerHeader>

				<ScrollArea className="max-h-[90vh] overflow-y-auto">
					<div className="p-6">
						<div className="border border-border rounded-lg overflow-hidden">
							<table className="w-full">
								<thead>
									<tr className="border-b border-border bg-muted/30">
										<th className="p-4 text-left font-medium text-sm text-muted-foreground w-40 align-top">
											<span className="uppercase tracking-wide text-xs">
												{t("criteria")}
											</span>
										</th>
										{selectedProgramsList.map((program) => (
											<ProgramHeaderCell key={program.id} program={program} />
										))}
									</tr>
								</thead>
								<tbody>
									<tr className="border-b border-border">
										<RowLabel icon={DollarSign} label={t("tuitionPerYear")} />
										{selectedProgramsList.map((program) => (
											<TuitionCell key={program.id} program={program} />
										))}
									</tr>

									<tr className="border-b border-border">
										<RowLabel icon={Trophy} label={t("qsRanking")} />
										{selectedProgramsList.map((program) => (
											<RankingCell key={program.id} program={program} />
										))}
									</tr>

									<tr className="border-b border-border">
										<RowLabel icon={BookOpen} label={t("degreeFormat")} />
										{selectedProgramsList.map((program) => (
											<DegreeDeliveryCell key={program.id} program={program} />
										))}
									</tr>

									<tr className="border-b border-border">
										<RowLabel icon={Clock} label={t("studyDuration")} />
										{selectedProgramsList.map((program) => (
											<DurationCell key={program.id} program={program} />
										))}
									</tr>

									<tr className="border-b border-border">
										<RowLabel
											icon={Calendar}
											label={t("applicationDeadline")}
										/>
										{selectedProgramsList.map((program) => (
											<DeadlineCell key={program.id} program={program} />
										))}
									</tr>

									<tr className="border-b border-border">
										<RowLabel icon={GraduationCap} label={t("gpaRequired")} />
										{selectedProgramsList.map((program) => (
											<GpaCell key={program.id} program={program} />
										))}
									</tr>

									<tr className="border-b border-border">
										<RowLabel icon={Languages} label={t("english")} />
										{selectedProgramsList.map((program) => (
											<EnglishCell key={program.id} program={program} />
										))}
									</tr>

									<tr>
										<td className="p-4 align-top" />
										{selectedProgramsList.map((program) => (
											<ActionsCell
												key={program.id}
												program={program}
												onAddToDashboard={onAddToDashboard}
												onRemoveProgram={onRemoveProgram}
											/>
										))}
									</tr>
								</tbody>
							</table>
						</div>

						{selectedProgramsList.length < 4 && (
							<div className="mt-6 flex justify-center">
								<Button
									variant="outline"
									onClick={() => onOpenChange(false)}
									className="gap-2"
								>
									<Plus className="w-4 h-4" />
									{t("addMorePrograms")}
								</Button>
							</div>
						)}
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
}
