"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
	ArrowRight,
	Filter,
	Loader2,
	Search,
	Settings2,
	X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getListProgramsQueryKey,
	listPrograms,
} from "@/lib/generated/api/endpoints/explore/explore";
import type {
	BudgetGapStatus,
	EnglishGapStatus,
	ListProgramsParams,
	ProgramListItemResponse,
	ProgramListResponse,
} from "@/lib/generated/api/models";
import { useUserMe } from "@/lib/hooks/useUserMe";
import { formatCountryName } from "@/lib/utils/displayFormatters";

const PAGE_SIZE = 20;

/**
 * Compact gap indicator for list view
 * Shows status icons for English, GPA, Budget gaps
 */
function GapIndicators({ program }: { program: ProgramListItemResponse }) {
	const indicators: { label: string; status: string; icon: string }[] = [];

	// English gap indicator
	if (program.englishGap?.status && program.englishGap.status !== "unknown") {
		const status = program.englishGap.status as EnglishGapStatus;
		indicators.push({
			label: "IELTS",
			status,
			icon: status === "exceeds" || status === "meets" ? "\u2713" : "!",
		});
	}

	// GPA gap indicator
	if (program.gpaGap?.status && program.gpaGap.status !== "unknown") {
		const status = program.gpaGap.status;
		indicators.push({
			label: "GPA",
			status,
			icon: status === "exceeds" || status === "meets" ? "\u2713" : "!",
		});
	}

	// Budget gap indicator
	if (program.budgetGap?.status && program.budgetGap.status !== "unknown") {
		const status = program.budgetGap.status as BudgetGapStatus;
		indicators.push({
			label: "Budget",
			status,
			icon: status === "within" ? "\u2713" : status === "stretch" ? "~" : "!",
		});
	}

	if (indicators.length === 0) return null;

	const getStatusColor = (status: string) => {
		switch (status) {
			case "exceeds":
			case "meets":
			case "within":
				return "text-green-600";
			case "stretch":
				return "text-yellow-600";
			case "gap":
			case "over":
				return "text-orange-600";
			default:
				return "text-muted-foreground";
		}
	};

	return (
		<div className="flex items-center justify-center gap-2 mt-1.5 text-xs">
			{indicators.slice(0, 3).map((ind) => (
				<span
					key={ind.label}
					className={`${getStatusColor(ind.status)} font-medium`}
					title={`${ind.label}: ${ind.status}`}
				>
					{ind.label}
					{ind.icon}
				</span>
			))}
		</div>
	);
}

interface ManualModeProps {
	selectedPrograms: Set<string>;
	onToggleSelection: (id: string) => void;
	isMaxReached: boolean;
	onAddToDashboard?: (id: string) => void;
	isProgramInDashboard?: (id: string) => boolean;
	onManageApplication?: (id: string) => void;
	addingProgramId?: string | null;
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
	isInDashboard,
	isAdding,
	onManage,
}: {
	program: ProgramListItemResponse;
	selected: boolean;
	onSelect: () => void;
	onClick: () => void;
	onAddToDashboard: (id: string) => void;
	isMaxReached: boolean;
	isInDashboard?: boolean;
	isAdding?: boolean;
	onManage?: (id: string) => void;
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

			{/* Fit Badge + Gap Indicators */}
			<td className="p-4 text-center">
				{getFitBadge(program.fitCategory)}
				<GapIndicators program={program} />
			</td>

			{/* Quick Action */}
			<td className="p-4 text-center">
				<Button
					size="sm"
					disabled={isAdding}
					onClick={(e) => {
						e.stopPropagation();
						if (isInDashboard && onManage) {
							program.id && onManage(program.id);
						} else if (!isAdding) {
							program.id && onAddToDashboard(program.id);
						}
					}}
					className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
				>
					{isAdding ? (
						<>
							<Loader2 className="w-4 h-4 animate-spin" />
							Adding...
						</>
					) : isInDashboard ? (
						<>
							<Settings2 className="w-4 h-4" />
							Manage
						</>
					) : (
						<>
							Apply
							<ArrowRight className="w-4 h-4" />
						</>
					)}
				</Button>
			</td>
		</tr>
	);
}

// Filter state interface for server-side filtering
interface ServerFilterState {
	search: string;
	regions: string;
	tuitionMax: number | undefined;
	scholarshipOnly: boolean;
	deadlineWithin: number | undefined;
}

/**
 * Manual Mode - Table view with server-side pagination and infinite scroll
 * Shows ALL programs (not limited by AI filters) with sorting and optional filtering
 */
export function ManualMode({
	selectedPrograms,
	onToggleSelection,
	isMaxReached,
	onAddToDashboard,
	isProgramInDashboard,
	onManageApplication,
	addingProgramId,
}: ManualModeProps) {
	// Detail drawer state
	const [selectedProgram, setSelectedProgram] =
		useState<ProgramListItemResponse | null>(null);
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

	// User auth state for preference sorting
	const { data: userResponse } = useUserMe();
	const isAuthenticated = !!userResponse;

	// Sorting state - default to preference (auth) or ranking_qs (guest)
	const [sortBy, setSortBy] = useState(() =>
		isAuthenticated ? "preference" : "ranking_qs",
	);

	// Update sort when auth state changes
	useEffect(() => {
		if (isAuthenticated && sortBy === "ranking_qs") {
			setSortBy("preference");
		}
	}, [isAuthenticated, sortBy]);

	// Search state (with debounce)
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	// Filter state
	const [filters, setFilters] = useState<ServerFilterState>({
		search: "",
		regions: "",
		tuitionMax: undefined,
		scholarshipOnly: false,
		deadlineWithin: undefined,
	});

	// Show/hide filter panel
	const [showFilters, setShowFilters] = useState(false);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Build query params
	const queryParams = useMemo((): ListProgramsParams => {
		const params: ListProgramsParams = {
			sort: sortBy,
			size: PAGE_SIZE,
		};

		if (debouncedSearch) params.search = debouncedSearch;
		if (filters.regions) params.regions = filters.regions;
		if (filters.tuitionMax) params.tuitionMax = filters.tuitionMax;
		if (filters.scholarshipOnly) params.scholarshipOnly = true;
		if (filters.deadlineWithin) params.deadlineWithin = filters.deadlineWithin;

		return params;
	}, [sortBy, debouncedSearch, filters]);

	// Infinite query for programs
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error,
	} = useInfiniteQuery({
		queryKey: [...getListProgramsQueryKey(queryParams), "infinite"],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await listPrograms({ ...queryParams, page: pageParam });
			return response;
		},
		getNextPageParam: (lastPage) => {
			const result = unwrapResponse<ProgramListResponse>(lastPage);
			if (!result?.pagination) return undefined;
			const { page = 1, totalPages = 1 } = result.pagination;
			return page < totalPages ? page + 1 : undefined;
		},
		initialPageParam: 1,
	});

	// Flatten all pages into a single array
	const programs = useMemo(() => {
		if (!data?.pages) return [];
		return data.pages.flatMap((page) => {
			const result = unwrapResponse<ProgramListResponse>(page);
			return result?.data ?? [];
		});
	}, [data]);

	// Get total count from first page
	const totalCount = useMemo(() => {
		if (!data?.pages?.[0]) return 0;
		const result = unwrapResponse<ProgramListResponse>(data.pages[0]);
		return result?.pagination?.total ?? 0;
	}, [data]);

	// Infinite scroll - intersection observer
	const loadMoreRef = useRef<HTMLDivElement>(null);

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [target] = entries;
			if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		[fetchNextPage, hasNextPage, isFetchingNextPage],
	);

	useEffect(() => {
		const element = loadMoreRef.current;
		const option = { threshold: 0.1 };

		const observer = new IntersectionObserver(handleObserver, option);
		if (element) observer.observe(element);

		return () => {
			if (element) observer.unobserve(element);
		};
	}, [handleObserver]);

	// Check if any filters are active
	const hasActiveFilters =
		filters.regions ||
		filters.tuitionMax ||
		filters.scholarshipOnly ||
		filters.deadlineWithin;

	const clearAllFilters = () => {
		setFilters({
			search: "",
			regions: "",
			tuitionMax: undefined,
			scholarshipOnly: false,
			deadlineWithin: undefined,
		});
		setSearchQuery("");
	};

	return (
		<div className="space-y-6">
			{/* Results Header with Search and Sort */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<p className="text-sm text-muted-foreground">
							{isLoading
								? "Đang tải..."
								: `Hiện ${programs.length} trong ${totalCount} kết quả`}
						</p>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Tìm kiếm trường, program..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onFocus={(e) => e.target.select()}
								className="pl-9 w-64"
							/>
						</div>
						<Button
							variant={showFilters ? "default" : "outline"}
							size="sm"
							onClick={() => setShowFilters(!showFilters)}
							className="gap-2"
						>
							<Filter className="w-4 h-4" />
							Bộ lọc
							{hasActiveFilters && (
								<Badge variant="secondary" className="ml-1">
									{
										[
											filters.regions,
											filters.tuitionMax,
											filters.scholarshipOnly,
											filters.deadlineWithin,
										].filter(Boolean).length
									}
								</Badge>
							)}
						</Button>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-sm text-foreground">Sắp xếp:</span>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-56">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{isAuthenticated && (
									<SelectItem value="preference">
										Ưu tiên của bạn (Recommended)
									</SelectItem>
								)}
								<SelectItem value="ranking_qs">
									Ranking QS (cao → thấp)
								</SelectItem>
								<SelectItem value="tuition_asc">
									Chi phí (thấp → cao)
								</SelectItem>
								<SelectItem value="tuition_desc">
									Chi phí (cao → thấp)
								</SelectItem>
								<SelectItem value="deadline">Deadline (gần nhất)</SelectItem>
								{isAuthenticated && (
									<SelectItem value="fit_score">Độ phù hợp</SelectItem>
								)}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Collapsible Filters Panel */}
				{showFilters && (
					<div className="bg-card border border-border rounded-xl p-4 space-y-4">
						<div className="flex flex-wrap items-center gap-3">
							<Select
								value={filters.regions}
								onValueChange={(v) =>
									setFilters({ ...filters, regions: v === "all" ? "" : v })
								}
							>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Khu vực" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả khu vực</SelectItem>
									<SelectItem value="north_america">Bắc Mỹ</SelectItem>
									<SelectItem value="europe">Châu Âu</SelectItem>
									<SelectItem value="asia_pacific">Châu Á TBD</SelectItem>
									<SelectItem value="oceania">Châu Đại Dương</SelectItem>
								</SelectContent>
							</Select>

							<Select
								value={filters.tuitionMax?.toString() || "all"}
								onValueChange={(v) =>
									setFilters({
										...filters,
										tuitionMax:
											v === "all" ? undefined : Number.parseInt(v, 10),
									})
								}
							>
								<SelectTrigger className="w-44">
									<SelectValue placeholder="Học phí tối đa" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Không giới hạn</SelectItem>
									<SelectItem value="20000">≤ $20,000/năm</SelectItem>
									<SelectItem value="30000">≤ $30,000/năm</SelectItem>
									<SelectItem value="50000">≤ $50,000/năm</SelectItem>
									<SelectItem value="70000">≤ $70,000/năm</SelectItem>
								</SelectContent>
							</Select>

							<Select
								value={filters.deadlineWithin?.toString() || "all"}
								onValueChange={(v) =>
									setFilters({
										...filters,
										deadlineWithin:
											v === "all" ? undefined : Number.parseInt(v, 10),
									})
								}
							>
								<SelectTrigger className="w-44">
									<SelectValue placeholder="Deadline trong" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả</SelectItem>
									<SelectItem value="30">Trong 30 ngày</SelectItem>
									<SelectItem value="60">Trong 60 ngày</SelectItem>
									<SelectItem value="90">Trong 90 ngày</SelectItem>
								</SelectContent>
							</Select>

							<Button
								variant={filters.scholarshipOnly ? "default" : "outline"}
								size="sm"
								onClick={() =>
									setFilters({
										...filters,
										scholarshipOnly: !filters.scholarshipOnly,
									})
								}
								className="gap-1.5"
							>
								💰 Có học bổng
							</Button>

							{hasActiveFilters && (
								<Button
									variant="ghost"
									size="sm"
									onClick={clearAllFilters}
									className="text-muted-foreground hover:text-foreground gap-1.5"
								>
									<X className="w-3.5 h-3.5" />
									Xóa bộ lọc
								</Button>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Table */}
			<div className="border border-border rounded-lg overflow-hidden">
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-16 px-4">
						<Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
						<p className="text-sm text-muted-foreground">
							Đang tải chương trình...
						</p>
					</div>
				) : isError ? (
					<div className="flex flex-col items-center justify-center py-16 px-4">
						<div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
							<span className="text-2xl">⚠️</span>
						</div>
						<h3 className="text-lg font-semibold text-foreground mb-2">
							Không thể tải dữ liệu
						</h3>
						<p className="text-sm text-muted-foreground text-center max-w-md">
							{error instanceof Error ? error.message : "Đã xảy ra lỗi"}
						</p>
					</div>
				) : programs.length > 0 ? (
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
							{programs.map((program) => (
								<ProgramTableRow
									key={program.id}
									program={program}
									selected={selectedPrograms.has(program.id || "")}
									onSelect={() => onToggleSelection(program.id || "")}
									onClick={() => {
										setSelectedProgram(program);
										setIsDetailDrawerOpen(true);
									}}
									onAddToDashboard={() => {
										program.id && onAddToDashboard?.(program.id);
									}}
									isMaxReached={isMaxReached}
									isInDashboard={
										program.id ? isProgramInDashboard?.(program.id) : false
									}
									isAdding={addingProgramId === program.id}
									onManage={onManageApplication}
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

			{/* Infinite scroll trigger + Loading indicator */}
			{hasNextPage && (
				<div
					ref={loadMoreRef}
					className="flex items-center justify-center py-4"
				>
					{isFetchingNextPage && (
						<div className="flex items-center gap-2 text-muted-foreground">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span className="text-sm">Đang tải thêm...</span>
						</div>
					)}
				</div>
			)}

			{/* End of list indicator */}
			{!hasNextPage && programs.length > 0 && (
				<div className="flex items-center justify-center py-4">
					<p className="text-sm text-muted-foreground">
						Đã hiển thị tất cả {programs.length} chương trình
					</p>
				</div>
			)}

			{/* Program Detail Drawer */}
			<ProgramDetailDrawer
				programId={selectedProgram?.id || null}
				open={isDetailDrawerOpen}
				onOpenChange={setIsDetailDrawerOpen}
				onCompare={(id) => {
					onToggleSelection(id);
					setIsDetailDrawerOpen(false);
				}}
				onAddToDashboard={onAddToDashboard}
			/>
		</div>
	);
}
