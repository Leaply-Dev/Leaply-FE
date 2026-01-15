"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CompareDialog } from "@/components/explore/CompareDialog";
import { CompareTray } from "@/components/explore/CompareTray";
import {
	type FilterState,
	HorizontalFilterBar,
} from "@/components/explore/FilterBar";
import { ProgramDetailDrawer } from "@/components/explore/ProgramDetailDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ProgramListItemResponse } from "@/lib/generated/api/models";
import { formatCountryName } from "@/lib/utils/gapComputation";

interface ManualModeProps {
	programs: ProgramListItemResponse[];
}

/**
 * Program table row component
 */
function ProgramTableRow({
	program,
	selected,
	onSelect,
	onClick,
	onAddToDashboard,
	isMaxReached,
}: {
	program: ProgramListItemResponse;
	selected: boolean;
	onSelect: () => void;
	onClick: () => void;
	onAddToDashboard: () => void;
	isMaxReached: boolean;
}) {
	const getDeadlineUrgency = (deadline?: string) => {
		if (!deadline) return { color: "text-muted-foreground", label: "N/A" };
		const daysUntil = Math.floor(
			(new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
		);

		if (daysUntil < 14) {
			return { color: "text-destructive", label: `⚠️ Còn ${daysUntil} ngày` };
		}
		if (daysUntil <= 30) {
			return { color: "text-orange-600", label: `⚠️ Còn ${daysUntil} ngày` };
		}
		return {
			color: "text-foreground",
			label: new Date(deadline).toLocaleDateString("vi-VN", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			}),
		};
	};

	const getFitBadge = (category?: string) => {
		switch (category) {
			case "safety":
				return (
					<Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
						An toàn
					</Badge>
				);
			case "target":
				return (
					<Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
						Cần nỗ lực
					</Badge>
				);
			case "reach":
				return (
					<Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
						Thách thức
					</Badge>
				);
			default:
				return null;
		}
	};

	const getRankingBadge = (rankingDisplay?: string, label?: string) => {
		if (!rankingDisplay) return null;

		// Parse ranking display to determine color tier
		const rankNum = Number.parseInt(rankingDisplay.replace(/[^0-9]/g, ""), 10);
		let colorClass = "bg-gray-100 text-gray-700 border-gray-200";

		if (label === "Times") {
			colorClass = "bg-amber-100 text-amber-700 border-amber-200";
		} else if (!Number.isNaN(rankNum)) {
			if (rankNum <= 50) {
				colorClass = "bg-purple-100 text-purple-700 border-purple-200";
			} else if (rankNum <= 100) {
				colorClass = "bg-blue-100 text-blue-700 border-blue-200";
			} else if (rankNum <= 200) {
				colorClass = "bg-slate-100 text-slate-700 border-slate-200";
			}
		}

		return (
			<Badge className={`${colorClass} hover:${colorClass}`}>
				{label && `${label} `}#{rankingDisplay}
			</Badge>
		);
	};

	const deadline = getDeadlineUrgency(program.nextDeadline);

	return (
		<tr
			className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
			onClick={(e) => {
				// Don't trigger row click if clicking checkbox or action buttons
				if ((e.target as HTMLElement).closest("input, button")) return;
				onClick();
			}}
		>
			{/* Checkbox */}
			<td className="p-4 text-center align-middle">
				<div className="flex items-center justify-center">
					<input
						type="checkbox"
						checked={selected}
						onChange={onSelect}
						onClick={(e) => e.stopPropagation()}
						disabled={isMaxReached && !selected}
						className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
					/>
				</div>
			</td>

			{/* University + Program */}
			<td className="p-4">
				<div className="flex items-start gap-3">
					<div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
						{program.universityLogoUrl ? (
							<Image
								src={program.universityLogoUrl}
								alt={program.universityName || "University"}
								width={48}
								height={48}
								className="object-contain"
							/>
						) : (
							<span className="text-xs font-bold text-primary">
								{(program.universityName || "U").substring(0, 2).toUpperCase()}
							</span>
						)}
					</div>
					<div className="flex-1 min-w-0">
						<h3
							className="font-semibold text-foreground text-sm mb-1 line-clamp-1"
							title={program.displayName || program.programName}
						>
							{program.displayName || program.programName}
						</h3>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<span>{program.universityName}</span>
							<span>•</span>
							<span>{formatCountryName(program.universityCountry)}</span>
						</div>
					</div>
				</div>
			</td>

			{/* Ranking */}
			<td className="p-4 text-center">
				{program.rankingQsDisplay ? (
					<div className="flex flex-col items-center gap-1.5">
						{getRankingBadge(program.rankingQsDisplay, "QS")}
					</div>
				) : (
					<span className="text-muted-foreground">N/A</span>
				)}
			</td>

			{/* Cost */}
			<td className="p-4 text-center">
				{program.tuitionAnnualUsd ? (
					<div className="flex flex-col items-center gap-1">
						<span className="font-semibold text-foreground">
							${program.tuitionAnnualUsd.toLocaleString()}
						</span>
						{program.scholarshipAvailable && (
							<span className="text-xs text-green-600">💰 Có học bổng</span>
						)}
					</div>
				) : (
					<span className="text-muted-foreground">N/A</span>
				)}
			</td>

			{/* Deadline */}
			<td className="p-4 text-center">
				<span className={`text-sm font-medium ${deadline.color}`}>
					{deadline.label}
				</span>
			</td>

			{/* Fit Badge */}
			<td className="p-4 text-center">{getFitBadge(program.fitCategory)}</td>

			{/* Quick Action */}
			<td className="p-4 text-center">
				<Button
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						onAddToDashboard();
					}}
					className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
				>
					Apply
					<ArrowRight className="w-4 h-4" />
				</Button>
			</td>
		</tr>
	);
}

/**
 * Manual Mode - Table view with filtering per spec
 */
export function ManualMode({ programs }: ManualModeProps) {
	// Constants
	const MAX_COMPARE_PROGRAMS = 4;

	// Selection state
	const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(
		new Set(),
	);

	// Compare dialog state
	const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);

	// Detail drawer state
	const [selectedProgram, setSelectedProgram] =
		useState<ProgramListItemResponse | null>(null);
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10; // Show 10 items per page

	// Sorting state
	const [sortBy, setSortBy] = useState("ranking");

	// Search state
	const [searchQuery, setSearchQuery] = useState("");

	// Filter state
	const [filters, setFilters] = useState<FilterState>({
		quickFilters: [],
		fieldOfStudy: "",
		region: "",
		tuitionRange: "",
		duration: "",
	});

	// Reset to first page when filters change
	const handleFiltersChange = (newFilters: FilterState) => {
		setFilters(newFilters);
		setCurrentPage(1);
	};

	// Toggle program selection
	const toggleProgramSelection = (id: string) => {
		setSelectedPrograms((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				// Always allow deselecting
				newSet.delete(id);
			} else {
				// Only add if under the limit
				if (newSet.size < MAX_COMPARE_PROGRAMS) {
					newSet.add(id);
				}
			}
			return newSet;
		});
	};

	// Check if max selection limit is reached
	const isMaxReached = selectedPrograms.size >= MAX_COMPARE_PROGRAMS;

	// Apply filters to programs
	const filteredPrograms = programs.filter((program) => {
		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			const matchesSearch =
				(program.universityName || "").toLowerCase().includes(query) ||
				(program.programName || "").toLowerCase().includes(query) ||
				(program.universityCountry || "").toLowerCase().includes(query);
			if (!matchesSearch) return false;
		}

		// Quick filters
		if (filters.quickFilters.includes("budget")) {
			// Assuming budget filter checks if tuition is under a certain threshold
			// You can adjust this threshold based on user profile
			if (!program.tuitionAnnualUsd || program.tuitionAnnualUsd > 50000)
				return false;
		}

		if (filters.quickFilters.includes("scholarship")) {
			if (!program.scholarshipAvailable) return false;
		}

		if (filters.quickFilters.includes("deadline")) {
			// Deadline > 60 days
			if (!program.nextDeadline) return false;
			const daysUntil = Math.floor(
				(new Date(program.nextDeadline).getTime() - Date.now()) /
					(1000 * 60 * 60 * 24),
			);
			if (daysUntil <= 60) return false;
		}

		// Extended filters
		if (filters.tuitionRange) {
			const maxTuition = Number.parseInt(filters.tuitionRange, 10);
			if (!program.tuitionAnnualUsd || program.tuitionAnnualUsd > maxTuition)
				return false;
		}

		// Region filter (basic implementation - can be enhanced)
		if (filters.region) {
			const country = (program.universityCountry || "").toLowerCase();
			if (filters.region === "na") {
				if (!["us", "ca", "usa", "canada"].some((c) => country.includes(c)))
					return false;
			} else if (filters.region === "eu") {
				if (
					!["uk", "de", "fr", "nl", "se", "ch", "europe"].some((c) =>
						country.includes(c),
					)
				)
					return false;
			} else if (filters.region === "asia") {
				if (
					!["sg", "jp", "kr", "cn", "hk", "singapore", "japan"].some((c) =>
						country.includes(c),
					)
				)
					return false;
			}
		}

		return true;
	});

	// Helper to parse ranking display string to number for sorting
	const parseRanking = (rankingDisplay?: string): number => {
		if (!rankingDisplay) return 999;
		const num = Number.parseInt(rankingDisplay.replace(/[^0-9]/g, ""), 10);
		return Number.isNaN(num) ? 999 : num;
	};

	// Sort programs
	const sortedPrograms = [...filteredPrograms].sort((a, b) => {
		switch (sortBy) {
			case "ranking":
				return (
					parseRanking(a.rankingQsDisplay) - parseRanking(b.rankingQsDisplay)
				);
			case "cost_asc":
				return (a.tuitionAnnualUsd || 0) - (b.tuitionAnnualUsd || 0);
			case "cost_desc":
				return (b.tuitionAnnualUsd || 0) - (a.tuitionAnnualUsd || 0);
			case "deadline":
				return (
					new Date(a.nextDeadline || "9999-12-31").getTime() -
					new Date(b.nextDeadline || "9999-12-31").getTime()
				);
			default:
				return 0;
		}
	});

	// Paginate programs
	const totalPages = Math.ceil(sortedPrograms.length / itemsPerPage);
	const paginatedPrograms = sortedPrograms.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const selectedCount = selectedPrograms.size;
	const selectedProgramsList = Array.from(selectedPrograms)
		.map((id) => programs.find((p) => p.id === id))
		.filter(Boolean)
		.slice(0, 3); // Max 3 for display

	return (
		<div className="space-y-6">
			{/* Filter Bar */}
			<HorizontalFilterBar
				filters={filters}
				onFiltersChange={handleFiltersChange}
			/>

			{/* Results List */}
			<div className="space-y-4">
				{/* Results Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<p className="text-sm text-muted-foreground">
							Hiện {paginatedPrograms.length} trong {sortedPrograms.length} kết
							quả
						</p>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Tìm kiếm trường, program..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setCurrentPage(1); // Reset to first page on search
								}}
								onFocus={(e) => e.target.select()}
								className="pl-9 w-64"
							/>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-sm text-foreground">Sắp xếp:</span>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-50">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ranking">Ranking (cao → thấp)</SelectItem>
								<SelectItem value="cost_asc">Chi phí (thấp → cao)</SelectItem>
								<SelectItem value="cost_desc">Chi phí (cao → thấp)</SelectItem>
								<SelectItem value="deadline">Deadline (gần nhất)</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Table */}
				<div className="border border-border rounded-lg overflow-hidden">
					{paginatedPrograms.length > 0 ? (
						<table className="w-full">
							<thead className="bg-muted/50">
								<tr className="border-b border-border">
									<th className="p-4 text-center font-semibold text-sm text-foreground w-30">
										So sánh
									</th>
									<th className="p-4 text-left font-semibold text-sm text-foreground">
										Chương trình
									</th>
									<th className="p-4 text-center font-semibold text-sm text-foreground">
										Xếp hạng
									</th>
									<th className="p-4 text-center font-semibold text-sm text-foreground">
										Chi phí
									</th>
									<th className="p-4 text-center font-semibold text-sm text-foreground">
										Deadline
									</th>
									<th className="p-4 text-center font-semibold text-sm text-foreground">
										Độ phù hợp
									</th>
									<th className="p-4 text-center font-semibold text-sm text-foreground">
										Hành động
									</th>
								</tr>
							</thead>
							<tbody>
								{paginatedPrograms.map((program) => (
									<ProgramTableRow
										key={program.id}
										program={program}
										selected={selectedPrograms.has(program.id || "")}
										onSelect={() => toggleProgramSelection(program.id || "")}
										onClick={() => {
											setSelectedProgram(program);
											setIsDetailDrawerOpen(true);
										}}
										onAddToDashboard={() => {
											// TODO: Implement add to dashboard functionality
											console.log("Add to dashboard:", program.id);
										}}
										isMaxReached={isMaxReached}
									/>
								))}
							</tbody>
						</table>
					) : (
						<div className="flex flex-col items-center justify-center py-16 px-4">
							<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
								<Search className="w-8 h-8 text-muted-foreground" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-2">
								Không tìm thấy chương trình
							</h3>
							<p className="text-sm text-muted-foreground text-center max-w-md">
								Không có chương trình nào phù hợp với bộ lọc của bạn. Thử điều
								chỉnh các bộ lọc hoặc tìm kiếm với từ khóa khác.
							</p>
						</div>
					)}
				</div>

				{/* Pagination */}
				{totalPages > 1 && sortedPrograms.length > 0 && (
					<div className="flex items-center justify-between">
						{/* Results count on left */}
						<p className="text-sm text-muted-foreground">
							Hiện {(currentPage - 1) * itemsPerPage + 1}-
							{Math.min(currentPage * itemsPerPage, sortedPrograms.length)}{" "}
							trong {sortedPrograms.length} kết quả
						</p>

						{/* Pagination controls on right */}
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								disabled={currentPage === 1}
								onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							>
								<ChevronLeft className="w-4 h-4" />
							</Button>

							{[...Array(Math.min(5, totalPages))].map((_, i) => {
								const pageNum = i + 1;
								return (
									<Button
										key={pageNum}
										variant={currentPage === pageNum ? "default" : "outline"}
										size="icon"
										onClick={() => setCurrentPage(pageNum)}
									>
										{pageNum}
									</Button>
								);
							})}

							{totalPages > 5 && (
								<span className="text-muted-foreground">...</span>
							)}

							<Button
								variant="outline"
								size="icon"
								disabled={currentPage === totalPages}
								onClick={() =>
									setCurrentPage((p) => Math.min(totalPages, p + 1))
								}
							>
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>
					</div>
				)}
			</div>

			{/* Zone 3: Compare Tray (Sticky Bottom - Checkout Style) */}
			<CompareTray
				selectedCount={selectedCount}
				maxPrograms={MAX_COMPARE_PROGRAMS}
				selectedProgramsList={selectedProgramsList}
				onRemoveProgram={toggleProgramSelection}
				onClearAll={() => setSelectedPrograms(new Set())}
				onCompare={() => setIsCompareDialogOpen(true)}
			/>

			{/* Compare Dialog */}
			<CompareDialog
				open={isCompareDialogOpen}
				onOpenChange={setIsCompareDialogOpen}
				selectedPrograms={selectedPrograms}
				programs={programs}
				onRemoveProgram={(id) => {
					toggleProgramSelection(id);
					// Close dialog if no programs left
					if (selectedPrograms.size <= 1) {
						setIsCompareDialogOpen(false);
					}
				}}
				onAddToDashboard={(id) => {
					// TODO: Implement add to dashboard functionality
					console.log("Add to dashboard:", id);
				}}
			/>

			{/* Program Detail Drawer */}
			<ProgramDetailDrawer
				program={selectedProgram}
				open={isDetailDrawerOpen}
				onOpenChange={setIsDetailDrawerOpen}
				onCompare={(id) => {
					toggleProgramSelection(id);
					setIsDetailDrawerOpen(false);
				}}
				onAddToDashboard={(id) => {
					// TODO: Implement add to dashboard functionality
					console.log("Add to dashboard:", id);
					setIsDetailDrawerOpen(false);
				}}
			/>
		</div>
	);
}
