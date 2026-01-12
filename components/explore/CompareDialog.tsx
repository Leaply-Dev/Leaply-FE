"use client";

import {
	AlertTriangle,
	Calendar,
	CheckCircle2,
	DollarSign,
	GraduationCap,
	Info,
	Languages,
	MapPin,
	Plus,
	ThumbsUp,
	TrendingUp,
	Trophy,
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
import type { ProgramListItemResponse } from "@/lib/generated/api/models";
import { formatCountryName } from "@/lib/utils/gapComputation";

// ============================================================================
// Types
// ============================================================================

interface CompareDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedPrograms: Set<string>;
	programs: ProgramListItemResponse[];
	onRemoveProgram: (id: string) => void;
	onAddToDashboard: (id: string) => void;
}

interface DeadlineInfo {
	text: string;
	isUrgent: boolean;
	daysLeft: string | null;
	color?: string;
}

interface GpaRequirement {
	min: string;
	scale: string | null;
	userGpa: string | null;
	status: "pass" | "high";
}

interface EnglishRequirement {
	type: string;
	score: string;
	detail: string | null;
	status: "pass" | "need_improve";
	gap?: string;
}

interface ProgramRequirements {
	gpa: GpaRequirement;
	english: EnglishRequirement;
}

interface ProgramAnalysis {
	pros: string[];
	cons: string[];
	icon: "info" | "success" | "warning";
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
					High Match ({score}%)
				</Badge>
			);
		case "target":
			return (
				<Badge className="bg-blue-100 text-blue-700 border-blue-200 gap-1">
					<ThumbsUp className="w-3 h-3" />
					Good Match ({score}%)
				</Badge>
			);
		case "reach":
			return (
				<Badge className="bg-orange-100 text-orange-700 border-orange-200 gap-1">
					<TrendingUp className="w-3 h-3" />
					Reach ({score}%)
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

/**
 * Get mock requirements data (would come from API in real implementation)
 */
function getMockRequirements(
	program: ProgramListItemResponse,
): ProgramRequirements {
	const hash = (program.id ?? "").charCodeAt(0) % 3;
	const gpaRequirements: GpaRequirement[] = [
		{ min: "3.0", scale: "4.0", userGpa: "3.8", status: "pass" },
		{ min: "Honors Class II", scale: null, userGpa: null, status: "pass" },
		{ min: "2.5", scale: "4.0", userGpa: "3.8", status: "high" },
	];
	const englishRequirements: EnglishRequirement[] = [
		{ type: "IELTS", score: "6.5", detail: "(all band > 6.0)", status: "pass" },
		{
			type: "IELTS",
			score: "7.0",
			detail: null,
			status: "need_improve",
			gap: "+0.5",
		},
		{ type: "IELTS", score: "6.0", detail: null, status: "pass" },
	];
	return {
		gpa: gpaRequirements[hash],
		english: englishRequirements[hash],
	};
}

/**
 * Get detailed analysis based on fit category
 */
function getDetailedAnalysis(
	program: ProgramListItemResponse,
): ProgramAnalysis {
	const analyses: Record<string, ProgramAnalysis> = {
		safety: {
			icon: "info",
			pros: ["Chương trình an toàn. Có khả năng cao nhận offer trong 2 tuần."],
			cons: [
				`Chi phí sinh hoạt tại ${program.universityCity || formatCountryName(program.universityCountry ?? "")} cao hơn dự kiến ngân sách của bạn.`,
			],
		},
		target: {
			icon: "warning",
			pros: ["Background Toán học rất mạnh, phù hợp ngành Data Science."],
			cons: [
				`Điểm Writing của bạn (6.0) thấp hơn yêu cầu ${program.universityName ?? ""} (6.5). Cần thi lại.`,
			],
		},
		reach: {
			icon: "success",
			pros: [
				"GPA của bạn (3.8) cao hơn mức yêu cầu, tăng khả năng nhận học bổng.",
				"Hoạt động ngoại khóa phù hợp với tiêu chí tuyển sinh.",
			],
			cons: [],
		},
	};
	return analyses[program.fitCategory || "safety"] || analyses.safety;
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Program header cell in comparison table
 */
function ProgramHeaderCell({ program }: { program: ProgramListItemResponse }) {
	return (
		<th className="p-4 text-left border-l border-border min-w-64">
			<div className="space-y-3">
				{/* University Logo + Match Badge */}
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
					{getMatchBadge(program.fitCategory, program.fitScore)}
				</div>

				{/* Program Name */}
				<div>
					<h3 className="font-semibold text-foreground">
						{program.programName}
					</h3>
					<p className="text-sm text-muted-foreground">
						{program.universityName}
					</p>
				</div>

				{/* Location */}
				<div className="flex items-center gap-1 text-sm text-muted-foreground">
					<MapPin className="w-3.5 h-3.5" />
					{formatCountryName(program.universityCountry)}
				</div>
			</div>
		</th>
	);
}

/**
 * Tuition row cell
 */
function TuitionCell({ program }: { program: ProgramListItemResponse }) {
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">
					{program.tuitionAnnualUsd
						? `$${program.tuitionAnnualUsd.toLocaleString()} USD`
						: "N/A"}
				</p>
				{program.scholarshipAvailable && (
					<p className="text-sm text-green-600">✓ Có học bổng (đến 20%)</p>
				)}
				{!program.scholarshipAvailable && (
					<p className="text-sm text-muted-foreground italic">
						Không có học bổng kỳ này
					</p>
				)}
			</div>
		</td>
	);
}

/**
 * Ranking row cell
 */
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
					{program.rankingQsDisplay && (
						<div className="flex items-center gap-2">
							<Badge
								variant="outline"
								className="font-semibold text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-950/30"
							>
								Times #{program.rankingQsDisplay}
							</Badge>
						</div>
					)}
				</div>
			) : (
				<span className="text-muted-foreground">N/A</span>
			)}
		</td>
	);
}

/**
 * Deadline row cell
 */
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

/**
 * GPA requirements row cell
 */
function GpaCell({ program }: { program: ProgramListItemResponse }) {
	const req = getMockRequirements(program);
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">
					{req.gpa.scale
						? `Min ${req.gpa.min} / ${req.gpa.scale}`
						: req.gpa.min}
				</p>
				{req.gpa.userGpa && (
					<p
						className={`text-sm ${req.gpa.status === "high" ? "text-green-600" : "text-muted-foreground"}`}
					>
						Bạn đạt: {req.gpa.userGpa}{" "}
						{req.gpa.status === "high"
							? "(Cao)"
							: req.gpa.status === "pass"
								? "(Dư sức)"
								: ""}
					</p>
				)}
				{!req.gpa.userGpa && req.gpa.status === "pass" && (
					<p className="text-sm text-muted-foreground">Bạn đạt yêu cầu</p>
				)}
			</div>
		</td>
	);
}

/**
 * English requirements row cell
 */
function EnglishCell({ program }: { program: ProgramListItemResponse }) {
	const req = getMockRequirements(program);
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">
					{req.english.type} {req.english.score}
					{req.english.detail && (
						<span className="font-normal text-muted-foreground">
							{" "}
							{req.english.detail}
						</span>
					)}
				</p>
				{req.english.status === "pass" && (
					<p className="text-sm text-green-600 flex items-center gap-1">
						<CheckCircle2 className="w-3.5 h-3.5" />
						Đạt
					</p>
				)}
				{req.english.status === "need_improve" && (
					<p className="text-sm text-orange-600 flex items-center gap-1">
						<AlertTriangle className="w-3.5 h-3.5" />
						Bạn cần cải thiện ({req.english.gap})
					</p>
				)}
			</div>
		</td>
	);
}

/**
 * Detailed analysis row cell
 */
function AnalysisCell({ program }: { program: ProgramListItemResponse }) {
	const analysis = getDetailedAnalysis(program);
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-2">
				{analysis.pros.map((pro, idx) => (
					<div key={`pro-${idx}`} className="flex items-start gap-2 text-sm">
						<CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
						<span className="text-foreground">{pro}</span>
					</div>
				))}
				{analysis.cons.map((con, idx) => (
					<div key={`con-${idx}`} className="flex items-start gap-2 text-sm">
						<AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
						<span className="text-foreground">{con}</span>
					</div>
				))}
				{analysis.pros.length === 0 && analysis.cons.length === 0 && (
					<div className="flex items-start gap-2 text-sm">
						<Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
						<span className="text-muted-foreground">Đang phân tích...</span>
					</div>
				)}
			</div>
		</td>
	);
}

/**
 * Action buttons row cell
 */
function ActionsCell({
	program,
	onAddToDashboard,
	onRemoveProgram,
}: {
	program: ProgramListItemResponse;
	onAddToDashboard: (id: string) => void;
	onRemoveProgram: (id: string) => void;
}) {
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-3">
				<Button
					className="w-full"
					onClick={() => onAddToDashboard(program.id ?? "")}
				>
					Thêm vào Dashboard
				</Button>
				<button
					type="button"
					onClick={() => onRemoveProgram(program.id ?? "")}
					className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors text-center"
				>
					Bỏ khỏi so sánh
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
 * Compare Dialog - Side-by-side comparison view for selected programs
 */
export function CompareDialog({
	open,
	onOpenChange,
	selectedPrograms,
	programs,
	onRemoveProgram,
	onAddToDashboard,
}: CompareDialogProps) {
	const selectedProgramsList = Array.from(selectedPrograms)
		.map((id) => programs.find((p) => p.id === id))
		.filter(Boolean) as ProgramListItemResponse[];

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className="max-h-[90vh] p-0 gap-0 overflow-hidden">
				<DrawerHeader className="sr-only">
					<DrawerTitle>So sánh chương trình</DrawerTitle>
					<DrawerDescription>
						So sánh các chương trình học đã chọn
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
												Tiêu chí so sánh
											</span>
										</th>
										{/* Program Columns */}
										{selectedProgramsList.map((program) => (
											<ProgramHeaderCell key={program.id} program={program} />
										))}
									</tr>
								</thead>
								<tbody>
									{/* Tuition Row */}
									<tr className="border-b border-border">
										<RowLabel icon={DollarSign} label="Học phí / năm" />
										{selectedProgramsList.map((program) => (
											<TuitionCell key={program.id} program={program} />
										))}
									</tr>

									{/* QS Ranking Row */}
									<tr className="border-b border-border">
										<RowLabel icon={Trophy} label="Xếp hạng QS" />
										{selectedProgramsList.map((program) => (
											<RankingCell key={program.id} program={program} />
										))}
									</tr>

									{/* Deadline Row */}
									<tr className="border-b border-border">
										<RowLabel icon={Calendar} label="Hạn nộp hồ sơ" />
										{selectedProgramsList.map((program) => (
											<DeadlineCell key={program.id} program={program} />
										))}
									</tr>

									{/* GPA Requirements Row */}
									<tr className="border-b border-border">
										<RowLabel icon={GraduationCap} label="Yêu cầu GPA" />
										{selectedProgramsList.map((program) => (
											<GpaCell key={program.id} program={program} />
										))}
									</tr>

									{/* English Requirements Row */}
									<tr className="border-b border-border">
										<RowLabel icon={Languages} label="Tiếng Anh" />
										{selectedProgramsList.map((program) => (
											<EnglishCell key={program.id} program={program} />
										))}
									</tr>

									{/* Detailed Analysis Row */}
									<tr className="border-b border-border bg-blue-50/50">
										<td className="p-4 align-top">
											<div className="flex items-start gap-2 text-sm font-medium text-primary">
												<Info className="w-4 h-4 mt-0.5" />
												<div>
													<p>Phân tích chi tiết</p>
													<p className="font-normal text-xs text-muted-foreground mt-1">
														So sánh hồ sơ của bạn với yêu cầu từng trường
													</p>
												</div>
											</div>
										</td>
										{selectedProgramsList.map((program) => (
											<AnalysisCell key={program.id} program={program} />
										))}
									</tr>

									{/* Actions Row */}
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

						{/* Add More Programs CTA */}
						{selectedProgramsList.length < 4 && (
							<div className="mt-6 flex justify-center">
								<Button
									variant="outline"
									onClick={() => onOpenChange(false)}
									className="gap-2"
								>
									<Plus className="w-4 h-4" />
									Thêm chương trình khác để so sánh (Tối đa 4)
								</Button>
							</div>
						)}
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
}
