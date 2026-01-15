"use client";

import {
	AlertTriangle,
	Calendar,
	CheckCircle2,
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

interface EnglishRequirement {
	type: "IELTS" | "TOEFL" | null;
	score: number | null;
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
		case "unknown":
			return (
				<Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1">
					<HelpCircle className="w-3 h-3" />
					Chưa đủ dữ liệu
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
 * Get English requirement from program data
 */
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
 * Note: GPA requirements data is sparse in our database, so we show N/A when not available
 */
function GpaCell({ program: _program }: { program: ProgramListItemResponse }) {
	// GPA requirements would come from _program.gpaMinimum if available
	// Currently most programs don't have this data
	return (
		<td className="p-4 border-l border-border align-top">
			<span className="text-muted-foreground">N/A</span>
		</td>
	);
}

/**
 * English requirements row cell
 */
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

/**
 * Detailed analysis row cell
 * Note: In the future, this will show AI-generated analysis from the backend
 */
function AnalysisCell({ program }: { program: ProgramListItemResponse }) {
	// Fit category-based simple insight
	const getFitInsight = () => {
		switch (program.fitCategory) {
			case "safety":
				return "Chương trình an toàn - khả năng cao đạt yêu cầu";
			case "target":
				return "Chương trình phù hợp - cần chuẩn bị kỹ hồ sơ";
			case "reach":
				return "Chương trình thử thách - cần nỗ lực nhiều hơn";
			default:
				return "Chưa đủ dữ liệu để phân tích chi tiết";
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
