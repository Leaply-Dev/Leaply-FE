"use client";

import {
	ArrowRight,
	ChevronLeft,
	ChevronRight,
	Plus,
	Search,
	X,
} from "lucide-react";
import { useState } from "react";
import { HorizontalFilterBar } from "@/components/explore/FilterBar";
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
import type { ProgramListItemResponse } from "@/lib/api/types";

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

	const getRankingBadge = (ranking?: number) => {
		if (!ranking) return <span className="text-muted-foreground">N/A</span>;

		let tier = "";
		let colorClass = "";

		if (ranking <= 50) {
			tier = "Top 50";
			colorClass = "bg-purple-100 text-purple-700 border-purple-200";
		} else if (ranking <= 100) {
			tier = "51-100";
			colorClass = "bg-blue-100 text-blue-700 border-blue-200";
		} else if (ranking <= 200) {
			tier = "101-200";
			colorClass = "bg-slate-100 text-slate-700 border-slate-200";
		} else {
			tier = "200+";
			colorClass = "bg-gray-100 text-gray-700 border-gray-200";
		}

		return (
			<Badge className={`${colorClass} hover:${colorClass}`}>{tier}</Badge>
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
			<td className="p-4 w-12">
				<input
					type="checkbox"
					checked={selected}
					onChange={onSelect}
					onClick={(e) => e.stopPropagation()}
					disabled={isMaxReached && !selected}
					className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				/>
			</td>

			{/* University + Program */}
			<td className="p-4">
				<div className="flex items-start gap-3">
					<div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
						<span className="text-xs font-bold text-primary">
							{program.universityName.substring(0, 2).toUpperCase()}
						</span>
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-1">
							<h3 className="font-semibold text-foreground text-sm">
								{program.universityName}
							</h3>
							<span className="text-xs text-muted-foreground">
								{program.universityCountry}
							</span>
						</div>
						<p className="text-sm text-muted-foreground">
							{program.programName}
						</p>
					</div>
				</div>
			</td>

			{/* Ranking */}
			<td className="p-4 text-center">{getRankingBadge(program.rankingQs)}</td>

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
					variant="outline"
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						onAddToDashboard();
					}}
					className="gap-2"
				>
					<Plus className="w-4 h-4" />
					Add to dashboard
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

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5; // Show 5 items per page for testing

	// Sorting state
	const [sortBy, setSortBy] = useState("ranking");

	// Search state
	const [searchQuery, setSearchQuery] = useState("");

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

	// Filter programs by search query
	const filteredPrograms = programs.filter((program) => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		return (
			program.universityName.toLowerCase().includes(query) ||
			program.programName.toLowerCase().includes(query) ||
			program.universityCountry.toLowerCase().includes(query)
		);
	});

	// Sort programs
	const sortedPrograms = [...filteredPrograms].sort((a, b) => {
		switch (sortBy) {
			case "ranking":
				return (a.rankingQs || 999) - (b.rankingQs || 999);
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
			<HorizontalFilterBar />

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
					<table className="w-full">
						<thead className="bg-muted/50">
							<tr className="border-b border-border">
								<th className="p-4 text-left font-semibold text-sm text-foreground">
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
									selected={selectedPrograms.has(program.id)}
									onSelect={() => toggleProgramSelection(program.id)}
									onClick={() => {
										// TODO: Open detail drawer
										console.log("Open detail for", program.id);
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
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
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
			{selectedCount > 0 && (
				<div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-card via-card to-card/95 border-t-2 border-primary shadow-2xl z-50 backdrop-blur-sm">
					<div className="max-w-7xl mx-auto px-6 py-5">
						<div className="flex items-center justify-between gap-6">
							{/* Left: Title + Selected Programs */}
							<div className="flex-1 space-y-3">
								{/* Title */}
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-bold text-foreground">
										So sánh chương trình
									</h3>
									<Badge variant="secondary" className="font-semibold">
										{selectedCount}/{MAX_COMPARE_PROGRAMS}
									</Badge>
								</div>

								{/* Selected programs chips */}
								<div className="flex items-center gap-3 flex-wrap">
									<div className="flex items-center gap-2 flex-wrap">
										{selectedProgramsList.map((program) => (
											<Badge
												key={program?.id}
												variant="secondary"
												className="gap-2 pr-1 text-sm py-1.5 px-3"
											>
												<span className="font-medium">
													{program?.universityName}
												</span>
												<button
													type="button"
													onClick={() =>
														program && toggleProgramSelection(program.id)
													}
													className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
													aria-label="Remove"
												>
													<X className="w-3.5 h-3.5" />
												</button>
											</Badge>
										))}
										{selectedCount > 3 && (
											<Badge variant="outline" className="font-medium">
												+{selectedCount - 3} chương trình
											</Badge>
										)}
									</div>

									{/* Clear all button */}
									<button
										type="button"
										onClick={() => setSelectedPrograms(new Set())}
										className="text-sm text-muted-foreground hover:text-destructive transition-colors font-medium underline underline-offset-2"
									>
										Xóa tất cả
									</button>
								</div>
							</div>

							{/* Right: CTA Button */}
							<div className="flex-shrink-0">
								<Button
									size="lg"
									className="gap-2 px-8 py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
								>
									So sánh ngay
									<ArrowRight className="w-5 h-5" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
