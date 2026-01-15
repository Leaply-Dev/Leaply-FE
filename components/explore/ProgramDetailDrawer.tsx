"use client";

import {
	Award,
	Calendar,
	CheckCircle2,
	Clock,
	DollarSign,
	Gift,
	Globe,
	GraduationCap,
	Info,
	Plus,
	RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { ProgramListItemResponse } from "@/lib/generated/api/models";
import { formatCountryName } from "@/lib/utils/gapComputation";

interface ProgramDetailDrawerProps {
	program: ProgramListItemResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCompare?: (id: string) => void;
	onAddToDashboard?: (id: string) => void;
}

// Helper to get country flag emoji
function getCountryFlag(country: string): string {
	const countryMap: Record<string, string> = {
		Netherlands: "🇳🇱",
		Germany: "🇩🇪",
		France: "🇫🇷",
		"United States": "🇺🇸",
		USA: "🇺🇸",
		"United Kingdom": "🇬🇧",
		UK: "🇬🇧",
		Canada: "🇨🇦",
		Australia: "🇦🇺",
		Spain: "🇪🇸",
		Italy: "🇮🇹",
		Sweden: "🇸🇪",
		Denmark: "🇩🇰",
		Switzerland: "🇨🇭",
		Singapore: "🇸🇬",
		Japan: "🇯🇵",
		"South Korea": "🇰🇷",
		China: "🇨🇳",
		"Hong Kong": "🇭🇰",
	};
	return countryMap[country] || "🌍";
}

// Helper to format currency
function formatCurrency(value: number, currency = "USD"): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(value);
}

// Helper to convert USD to VND (approximate rate)
function usdToVnd(usd: number): string {
	const rate = 24500;
	const vnd = usd * rate;
	if (vnd >= 1000000000) {
		return `~ ${(vnd / 1000000000).toFixed(2)} tỷ VND`;
	}
	return `~ ${(vnd / 1000000).toFixed(0)} triệu VND`;
}

// Helper to format duration
function formatDuration(months?: number): string {
	if (!months) return "N/A";
	const years = Math.floor(months / 12);
	const remainingMonths = months % 12;
	if (years === 0) return `${remainingMonths} Tháng`;
	if (remainingMonths === 0) return `${years} Năm`;
	return `${years} Năm ${remainingMonths} Tháng`;
}

// Helper to format intake months
function formatIntakeMonths(intake?: string): string {
	if (!intake) return "N/A";
	// Parse intake like "Fall 2025" -> "Tháng 9"
	const intakeMonth: Record<string, string> = {
		Spring: "Tháng 2",
		Summer: "Tháng 6",
		Fall: "Tháng 9",
		Winter: "Tháng 1",
	};
	const season = intake.split(" ")[0];
	return intakeMonth[season] || intake;
}

export function ProgramDetailDrawer({
	program,
	open,
	onOpenChange,
	onCompare,
	onAddToDashboard,
}: ProgramDetailDrawerProps) {
	if (!program) return null;

	// Build entry requirements from actual program data
	// Only include requirements that the program has specified
	const entryRequirements: Array<{
		name: string;
		requiredValue: string;
		status: "met" | "warning" | "unknown";
	}> = [];

	if (program.ieltsMinimum) {
		entryRequirements.push({
			name: "IELTS",
			requiredValue: `${program.ieltsMinimum}+`,
			status: "unknown", // Would be "met" or "warning" if we had user data
		});
	}

	if (program.toeflMinimum) {
		entryRequirements.push({
			name: "TOEFL",
			requiredValue: `${program.toeflMinimum}+`,
			status: "unknown",
		});
	}

	// Note: GPA requirement is not available in ProgramListItemResponse
	// When we have program detail API, we can add it from program.requirements.gpaMinimum

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-lg p-0 flex flex-col"
			>
				{/* Scrollable Content */}
				<ScrollArea className="flex-1">
					<div className="p-6 space-y-6">
						{/* Header - University Info */}
						<SheetHeader className="p-0 space-y-4">
							<div className="flex items-start gap-4">
								{/* University Logo */}
								<div className="w-14 h-14 rounded-xl bg-linear-to-br from-emerald-800 to-emerald-900 flex items-center justify-center shrink-0 shadow-lg border-2 border-emerald-600/30 overflow-hidden">
									{program.universityLogoUrl ? (
										<Image
											src={program.universityLogoUrl}
											alt={program.universityName || "University"}
											width={56}
											height={56}
											className="object-contain"
										/>
									) : (
										<GraduationCap className="w-7 h-7 text-amber-400" />
									)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<SheetTitle className="text-lg font-bold text-foreground">
											{program.universityName}
										</SheetTitle>
										<span className="text-xl shrink-0">
											{getCountryFlag(
												formatCountryName(program.universityCountry),
											)}
										</span>
									</div>
									<SheetDescription className="text-sm text-muted-foreground mt-0.5">
										{program.universityCity || "City"},{" "}
										{formatCountryName(program.universityCountry)}
									</SheetDescription>
								</div>
							</div>

							{/* Program Name */}
							<h2 className="text-xl font-bold text-foreground leading-tight">
								{program.programName}
							</h2>

							{/* Badges */}
							<div className="flex flex-wrap gap-2">
								{program.rankingQsDisplay && (
									<Badge
										variant="outline"
										className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800 px-3 py-1"
									>
										<Award className="w-3.5 h-3.5 mr-1.5" />
										QS #{program.rankingQsDisplay}
									</Badge>
								)}
								{program.rankingQsDisplay && (
									<Badge
										variant="outline"
										className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800 px-3 py-1"
									>
										<Award className="w-3.5 h-3.5 mr-1.5" />
										Times #{program.rankingQsDisplay}
									</Badge>
								)}
								{program.fitScore && (
									<Badge
										variant="outline"
										className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800 px-3 py-1"
									>
										<RefreshCw className="w-3.5 h-3.5 mr-1.5" />
										Fit Score: {program.fitScore}%
									</Badge>
								)}
							</div>
						</SheetHeader>

						{/* Overview Section */}
						<section>
							<div className="flex items-center gap-2 mb-4">
								<Info className="w-5 h-5 text-blue-600" />
								<h3 className="font-semibold text-foreground">Tổng quan</h3>
							</div>
							<div className="grid grid-cols-3 gap-3">
								{/* Duration */}
								<div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
									<div className="flex justify-center mb-3">
										<div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
											<Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
										</div>
									</div>
									<p className="text-xs text-muted-foreground text-center">
										Thời lượng
									</p>
									<p className="font-semibold text-foreground text-center text-sm mt-1">
										{formatDuration(program.durationMonths)}
									</p>
								</div>

								{/* Language */}
								<div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
									<div className="flex justify-center mb-3">
										<div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
											<Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
										</div>
									</div>
									<p className="text-xs text-muted-foreground text-center">
										Ngôn ngữ
									</p>
									<p className="font-semibold text-foreground text-center text-sm mt-1">
										Tiếng Anh
									</p>
								</div>

								{/* Intake */}
								<div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
									<div className="flex justify-center mb-3">
										<div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
											<Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
										</div>
									</div>
									<p className="text-xs text-muted-foreground text-center">
										Kỳ nhập học
									</p>
									<p className="font-semibold text-foreground text-center text-sm mt-1">
										{formatIntakeMonths(program.nextIntake) || "Tháng 2, 7"}
									</p>
								</div>
							</div>
						</section>

						{/* Cost & Scholarship Section */}
						<section>
							<div className="flex items-center gap-2 mb-4">
								<DollarSign className="w-5 h-5 text-emerald-600" />
								<h3 className="font-semibold text-foreground">
									Chi phí & Học bổng
								</h3>
							</div>
							<div className="grid grid-cols-2 gap-3 mb-3">
								{/* Annual Tuition */}
								<div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
									<div className="flex items-center justify-between mb-2">
										<p className="text-xs text-muted-foreground uppercase tracking-wide">
											Học phí năm
										</p>
										<DollarSign className="w-4 h-4 text-emerald-500" />
									</div>
									<p className="text-xl font-bold text-foreground">
										{program.tuitionAnnualUsd
											? formatCurrency(program.tuitionAnnualUsd, "AUD")
											: "N/A"}
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										{program.tuitionAnnualUsd
											? usdToVnd(program.tuitionAnnualUsd)
											: ""}
									</p>
								</div>

								{/* Total Cost */}
								<div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
									<div className="flex items-center justify-between mb-2">
										<p className="text-xs text-muted-foreground uppercase tracking-wide">
											Tổng khóa
										</p>
										<Gift className="w-4 h-4 text-purple-500" />
									</div>
									<p className="text-xl font-bold text-foreground">
										{program.tuitionAnnualUsd && program.durationMonths
											? formatCurrency(
													(program.tuitionAnnualUsd * program.durationMonths) /
														12,
													"AUD",
												)
											: "N/A"}
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										{program.tuitionAnnualUsd && program.durationMonths
											? usdToVnd(
													(program.tuitionAnnualUsd * program.durationMonths) /
														12,
												)
											: ""}
									</p>
								</div>
							</div>

							{/* Scholarship Info */}
							{program.scholarshipAvailable && (
								<div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
									<div className="flex items-start gap-3">
										<div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
											<GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
										</div>
										<div>
											<h4 className="font-semibold text-foreground text-sm">
												International Fee Remission
											</h4>
											<p className="text-sm text-muted-foreground mt-1">
												Cơ hội nhận học bổng lên đến{" "}
												<span className="font-semibold text-blue-600 dark:text-blue-400">
													10,000 AUD
												</span>{" "}
												cho năm đầu tiên dựa trên GPA xuất sắc.
											</p>
										</div>
									</div>
								</div>
							)}
						</section>

						{/* Entry Requirements Section */}
						{entryRequirements.length > 0 && (
							<section>
								<div className="flex items-center gap-2 mb-4">
									<CheckCircle2 className="w-5 h-5 text-violet-600" />
									<h3 className="font-semibold text-foreground">
										Yêu cầu đầu vào
									</h3>
								</div>
								<div className="border border-border rounded-xl overflow-hidden">
									{/* Table Header */}
									<div className="grid grid-cols-2 bg-muted/50 px-4 py-3 border-b border-border">
										<p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
											Tiêu chí
										</p>
										<p className="text-xs text-muted-foreground uppercase tracking-wide font-medium text-right">
											Yêu cầu tối thiểu
										</p>
									</div>

									{/* Table Rows */}
									{entryRequirements.map((req, index) => (
										<div
											key={req.name}
											className={`grid grid-cols-2 px-4 py-3 items-center ${
												index < entryRequirements.length - 1
													? "border-b border-border"
													: ""
											}`}
										>
											<div className="flex items-center gap-2">
												<div
													className={`w-6 h-6 rounded-full flex items-center justify-center ${
														req.status === "met"
															? "bg-emerald-100 dark:bg-emerald-900/50"
															: req.status === "warning"
																? "bg-amber-100 dark:bg-amber-900/50"
																: "bg-gray-100 dark:bg-gray-800/50"
													}`}
												>
													{req.status === "met" ? (
														<CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
													) : req.status === "warning" ? (
														<Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
													) : (
														<Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
													)}
												</div>
												<span className="text-sm font-medium text-foreground">
													{req.name}
												</span>
											</div>
											<div className="text-right">
												<Badge
													variant="outline"
													className={`${
														req.status === "met"
															? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
															: req.status === "warning"
																? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800"
																: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700"
													}`}
												>
													{req.requiredValue}
												</Badge>
											</div>
										</div>
									))}
								</div>
							</section>
						)}
					</div>
				</ScrollArea>

				{/* Fixed Footer */}
				<SheetFooter className="border-t border-border p-4 bg-background">
					<div className="flex gap-3 w-full">
						<Button
							variant="outline"
							className="flex-1 gap-2"
							onClick={() => program?.id && onCompare?.(program.id)}
						>
							<RefreshCw className="w-4 h-4" />
							So sánh
						</Button>
						<Button
							className="flex-2 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
							onClick={() => program?.id && onAddToDashboard?.(program.id)}
						>
							<Plus className="w-4 h-4" />
							Thêm vào Dashboard
						</Button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
