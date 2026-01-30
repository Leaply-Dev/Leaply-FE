"use client";

import {
	AlertTriangle,
	BookOpen,
	Calendar,
	CheckCircle2,
	Clock,
	DollarSign,
	GraduationCap,
	HelpCircle,
	Info,
	Languages,
	MapPin,
	Plus,
	ThumbsUp,
	TrendingUp,
	Trophy,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
import {
	formatCountryName,
	formatDeliveryMode,
	formatDuration,
	formatTuitionRange,
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

interface DeadlineInfo {
	text: string;
	isUrgent: boolean;
	daysLeft: string | null;
	color?: string;
}

interface EnglishRequirement {
	type: "IELTS" | "TOEFL" | null;
	score: number | null;
}

// ============================================================================
// Helper Functions
// ============================================================================

function MatchBadge({
	fitCategory,
	fitScore,
}: {
	fitCategory?: string;
	fitScore?: number;
}) {
	const t = useTranslations("compare");
	const score = fitScore ?? 0;
	switch (fitCategory) {
		case "safety":
			return (
				<Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
					<CheckCircle2 className="w-3 h-3" />
					{t("highMatch")} ({score}%)
				</Badge>
			);
		case "target":
			return (
				<Badge className="bg-blue-100 text-blue-700 border-blue-200 gap-1">
					<ThumbsUp className="w-3 h-3" />
					{t("goodMatch")} ({score}%)
				</Badge>
			);
		case "reach":
			return (
				<Badge className="bg-orange-100 text-orange-700 border-orange-200 gap-1">
					<TrendingUp className="w-3 h-3" />
					{t("reach")} ({score}%)
				</Badge>
			);
		case "unknown":
			return (
				<Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1">
					<HelpCircle className="w-3 h-3" />
					{t("insufficientData")}
				</Badge>
			);
		default:
			return null;
	}
}

function getDeadlineInfo(deadline?: string): DeadlineInfo {
	if (!deadline) return { text: "N/A", isUrgent: false, daysLeft: null };
	const daysUntil = Math.floor(
		(new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
	);
	const formatted = new Date(deadline).toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

	if (daysUntil < 14) {
		return {
			text: formatted,
			isUrgent: true,
			daysLeft: `Sắp hết hạn (${daysUntil} ngày)`,
			color: "text-destructive",
		};
	}
	if (daysUntil <= 60) {
		return {
			text: formatted,
			isUrgent: false,
			daysLeft: `Còn ${Math.floor(daysUntil / 30)} tháng`,
			color: "text-muted-foreground",
		};
	}
	return {
		text: formatted,
		isUrgent: false,
		daysLeft: `Còn ${daysUntil} ngày`,
		color: "text-muted-foreground",
	};
}

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
				<div className="flex items-start justify-between gap-2">
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
					<MatchBadge
						fitCategory={program.fitCategory}
						fitScore={program.fitScore}
					/>
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
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">
					{program.tuitionAnnualMin
						? formatTuitionRange(
								program.tuitionAnnualMin,
								program.tuitionAnnualMax,
								program.tuitionCurrency || "USD",
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
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>
						{[program.degreeName, formatDeliveryMode(program.deliveryMode)]
							.filter((v) => v && v !== "N/A")
							.join(" • ")}
					</span>
				</div>
			</div>
		</td>
	);
}

function DurationCell({ program }: { program: ProgramListItemResponse }) {
	return (
		<td className="p-4 border-l border-border align-top">
			<span className="text-foreground">
				{formatDuration(program.durationMonths)}
			</span>
		</td>
	);
}
function DeadlineCell({ program }: { program: ProgramListItemResponse }) {
	const deadline = getDeadlineInfo(program.nextDeadline);
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

// AI-generated analysis from backend (future feature)
function AnalysisCell({ program }: { program: ProgramListItemResponse }) {
	const t = useTranslations("compare");
	// Fit category-based simple insight
	const getFitInsight = () => {
		switch (program.fitCategory) {
			case "safety":
				return t("safeProgram");
			case "target":
				return t("targetProgram");
			case "reach":
				return t("reachProgram");
			default:
				return t("unknownProgram");
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

									<tr className="border-b border-border bg-blue-50/50">
										<td className="p-4 align-top">
											<div className="flex items-start gap-2 text-sm font-medium text-primary">
												<Info className="w-4 h-4 mt-0.5" />
												<div>
													<p>{t("detailedAnalysis")}</p>
													<p className="font-normal text-xs text-muted-foreground mt-1">
														{t("compareYourProfile")}
													</p>
												</div>
											</div>
										</td>
										{selectedProgramsList.map((program) => (
											<AnalysisCell key={program.id} program={program} />
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
