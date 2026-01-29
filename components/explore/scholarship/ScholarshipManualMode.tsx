"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
	ArrowRight,
	Award,
	Calendar,
	DollarSign,
	GraduationCap,
	Loader2,
	Search,
	Settings2,
	Sparkles,
	X,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	CoverageTypeFilter,
	DeadlineWithinFilter,
	EligibilityTypeFilter,
	FilterPanel,
	QuickFilterChips,
	RegionFilter,
	useRegionOptions,
} from "@/components/explore/filters";
import { ScholarshipDetailDrawer } from "@/components/explore/scholarship/ScholarshipDetailDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getListScholarshipsQueryKey,
	listScholarships,
} from "@/lib/generated/api/endpoints/scholarship-explore/scholarship-explore";
import type {
	EnglishGapStatus,
	ListScholarshipsParams,
	ScholarshipListItemResponse,
	ScholarshipListResponse,
} from "@/lib/generated/api/models";
import { useUserMe } from "@/lib/hooks/useUserMe";
import {
	formatCoverageAmount,
	formatCoverageType,
	formatDate,
	formatEligibilityType,
} from "@/lib/utils/displayFormatters";

const PAGE_SIZE = 20;

// Quick filter types for scholarships
type ScholarshipQuickFilter =
	| "fullFunded"
	| "meetReq"
	| "deadline"
	| "meritBased";

function ScholarshipGapIndicators({
	scholarship,
}: {
	scholarship: ScholarshipListItemResponse;
}) {
	const indicators: { label: string; status: string; icon: string }[] = [];

	// English gap indicator
	if (
		scholarship.englishGap?.status &&
		scholarship.englishGap.status !== "unknown"
	) {
		const status = scholarship.englishGap.status as EnglishGapStatus;
		indicators.push({
			label: "IELTS",
			status,
			icon: status === "exceeds" || status === "meets" ? "\u2713" : "!",
		});
	}

	// GPA gap indicator
	if (scholarship.gpaGap?.status && scholarship.gpaGap.status !== "unknown") {
		const status = scholarship.gpaGap.status;
		indicators.push({
			label: "GPA",
			status,
			icon: status === "exceeds" || status === "meets" ? "\u2713" : "!",
		});
	}

	if (indicators.length === 0) return null;

	const getStatusColor = (status: string) => {
		switch (status) {
			case "exceeds":
			case "meets":
				return "text-green-600";
			case "stretch":
				return "text-yellow-600";
			case "gap":
				return "text-orange-600";
			default:
				return "text-muted-foreground";
		}
	};

	return (
		<div className="flex items-center justify-center gap-2 mt-1.5 text-xs">
			{indicators.slice(0, 2).map((ind) => (
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

interface ScholarshipManualModeProps {
	selectedScholarships: Set<string>;
	onToggleSelection: (id: string) => void;
	isMaxReached: boolean;
	onAddToDashboard?: (id: string) => void;
	isScholarshipInDashboard?: (id: string) => boolean;
	onManageApplication?: (id: string) => void;
	addingScholarshipId?: string | null;
}

function ScholarshipTableRow({
	scholarship,
	selected,
	onSelect,
	onClick,
	onAddToDashboard,
	isMaxReached,
	isInDashboard,
	onManage,
	isAdding,
	t,
}: {
	scholarship: ScholarshipListItemResponse;
	selected: boolean;
	onSelect: () => void;
	onClick: () => void;
	onAddToDashboard: (id: string) => void;
	isMaxReached: boolean;
	isInDashboard?: boolean;
	onManage?: (id: string) => void;
	isAdding?: boolean;
	t: ReturnType<typeof useTranslations<"explore">>;
}) {
	const getDeadlineUrgency = (deadline?: string) => {
		if (!deadline)
			return { color: "text-muted-foreground", label: t("table.na") };
		const daysUntil = Math.floor(
			(new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
		);

		if (daysUntil < 0) {
			return { color: "text-muted-foreground", label: t("table.closed") };
		}
		if (daysUntil < 14) {
			return {
				color: "text-destructive",
				label: t("table.daysLeft", { days: daysUntil }),
			};
		}
		if (daysUntil <= 30) {
			return {
				color: "text-orange-600",
				label: t("table.daysLeft", { days: daysUntil }),
			};
		}
		return {
			color: "text-foreground",
			label: formatDate(deadline, { short: true }),
		};
	};

	const getFitBadge = (category?: string) => {
		switch (category) {
			case "safety":
				return (
					<Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
						{t("table.strongFit")}
					</Badge>
				);
			case "target":
				return (
					<Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
						{t("table.goodFit")}
					</Badge>
				);
			case "reach":
				return (
					<Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
						{t("table.competitive")}
					</Badge>
				);
			default:
				return null;
		}
	};

	const getCoverageDisplay = () => {
		if (scholarship.coveragePercentage) {
			return `${scholarship.coveragePercentage}%`;
		}
		if (scholarship.coverageAmountMin || scholarship.coverageAmountMax) {
			return formatCoverageAmount(
				scholarship.coverageAmountMin,
				scholarship.coverageAmountMax,
				{ compact: true },
			);
		}
		return formatCoverageType(scholarship.coverageType);
	};

	const deadline = getDeadlineUrgency(scholarship.applicationDeadline);

	return (
		<tr
			className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
			onClick={(e) => {
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

			{/* Scholarship Name + Source */}
			<td className="p-4">
				<div className="flex items-start gap-3">
					<div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
						{scholarship.universityLogoUrl ? (
							<Image
								src={scholarship.universityLogoUrl}
								alt={
									scholarship.universityName ||
									scholarship.sourceName ||
									"Scholarship"
								}
								width={48}
								height={48}
								className="object-contain"
							/>
						) : (
							<Award className="w-5 h-5 text-primary" />
						)}
					</div>
					<div className="flex-1 min-w-0">
						<h3
							className="font-semibold text-foreground text-sm mb-1 line-clamp-1"
							title={scholarship.name}
						>
							{scholarship.name}
						</h3>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<span>
								{scholarship.universityName || scholarship.sourceName}
							</span>
							{scholarship.universityCountry && (
								<>
									<span>-</span>
									<span>{scholarship.universityCountry}</span>
								</>
							)}
						</div>
					</div>
				</div>
			</td>

			{/* Coverage */}
			<td className="p-4 text-center">
				<div className="flex flex-col items-center gap-1">
					<span className="font-semibold text-foreground font-num flex items-center gap-1">
						<DollarSign className="w-3.5 h-3.5" />
						{getCoverageDisplay()}
					</span>
					{scholarship.coverageType === "full_funded" && (
						<Badge className="bg-green-100 text-green-700 border-0 text-xs">
							{t("filters.fullFunded")}
						</Badge>
					)}
				</div>
			</td>

			{/* Type */}
			<td className="p-4 text-center">
				<span className="text-sm text-muted-foreground">
					{formatEligibilityType(scholarship.eligibilityType)}
				</span>
			</td>

			{/* Deadline */}
			<td className="p-4 text-center">
				<span className={`text-sm font-medium font-num ${deadline.color}`}>
					{deadline.label}
				</span>
			</td>

			{/* Fit */}
			<td className="p-4 text-center">
				{getFitBadge(scholarship.fitCategory)}
				<ScholarshipGapIndicators scholarship={scholarship} />
			</td>

			{/* Action */}
			<td className="p-4 text-center">
				<Button
					size="sm"
					disabled={isAdding}
					onClick={(e) => {
						e.stopPropagation();
						if (isInDashboard && onManage) {
							scholarship.id && onManage(scholarship.id);
						} else {
							scholarship.id && onAddToDashboard(scholarship.id);
						}
					}}
					className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
				>
					{isInDashboard ? (
						<>
							<Settings2 className="w-4 h-4" />
							{t("table.manage")}
						</>
					) : isAdding ? (
						<>
							<Loader2 className="w-4 h-4 animate-spin" />
							{t("table.adding")}
						</>
					) : (
						<>
							{t("table.apply")}
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
	coverageTypes: string;
	eligibilityTypes: string;
	deadlineWithin: number | undefined;
	quickFilters: ScholarshipQuickFilter[];
}

/**
 * Scholarship Manual Mode - Table view with server-side pagination and infinite scroll
 * Shows ALL scholarships (not limited by AI filters) with optional filtering
 */
export function ScholarshipManualMode({
	selectedScholarships,
	onToggleSelection,
	isMaxReached,
	onAddToDashboard,
	isScholarshipInDashboard,
	onManageApplication,
	addingScholarshipId,
}: ScholarshipManualModeProps) {
	const t = useTranslations("explore");

	// Detail drawer state
	const [selectedScholarship, setSelectedScholarship] =
		useState<ScholarshipListItemResponse | null>(null);
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

	// User auth state for fit_score sorting
	const { data: userResponse } = useUserMe();
	const isAuthenticated = !!userResponse;

	// Auto-determine sort based on auth state (fit_score for auth, deadline for guest)
	const sortBy = isAuthenticated ? "fit_score" : "deadline";

	// Search state (with debounce)
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	// Filter state
	const [filters, setFilters] = useState<ServerFilterState>({
		search: "",
		regions: "",
		coverageTypes: "",
		eligibilityTypes: "",
		deadlineWithin: undefined,
		quickFilters: [],
	});

	// Region options from shared hook
	const regionOptions = useRegionOptions((key) => t(`filters.${key}`));

	// Quick filter definitions for scholarships
	const quickFilterOptions = useMemo(
		() => [
			{
				id: "fullFunded" as ScholarshipQuickFilter,
				label: t("filters.fullFunded"),
				icon: DollarSign,
			},
			{
				id: "meetReq" as ScholarshipQuickFilter,
				label: t("filters.meetTestReq"),
				icon: GraduationCap,
			},
			{
				id: "deadline" as ScholarshipQuickFilter,
				label: t("filters.deadlineOver60Days"),
				icon: Calendar,
			},
			{
				id: "meritBased" as ScholarshipQuickFilter,
				label: t("filters.meritBased"),
				icon: Sparkles,
			},
		],
		[t],
	);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Build query params
	const queryParams = useMemo((): ListScholarshipsParams => {
		const params: ListScholarshipsParams = {
			sort: sortBy,
			size: PAGE_SIZE,
		};

		if (debouncedSearch) params.search = debouncedSearch;
		if (filters.regions) params.regions = filters.regions;

		// Quick filter: full funded
		if (filters.quickFilters.includes("fullFunded")) {
			params.coverageTypes = "full_funded";
		} else if (filters.coverageTypes) {
			params.coverageTypes = filters.coverageTypes;
		}

		// Quick filter: merit based
		if (filters.quickFilters.includes("meritBased")) {
			params.eligibilityTypes = "merit";
		} else if (filters.eligibilityTypes) {
			params.eligibilityTypes = filters.eligibilityTypes;
		}

		// Quick filter: deadline > 60 days
		if (filters.quickFilters.includes("deadline")) {
			params.deadlineWithin = 60;
		} else if (filters.deadlineWithin) {
			params.deadlineWithin = filters.deadlineWithin;
		}

		// Note: "meetReq" quick filter requires backend support
		// This is UI-only for now and will be enabled when the API supports it
		// if (filters.quickFilters.includes("meetReq")) { params.meetRequirements = true; }

		return params;
	}, [sortBy, debouncedSearch, filters]);

	// Infinite query for scholarships
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error,
	} = useInfiniteQuery({
		queryKey: [...getListScholarshipsQueryKey(queryParams), "infinite"],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await listScholarships({
				...queryParams,
				page: pageParam,
			});
			return response;
		},
		getNextPageParam: (lastPage) => {
			const result = unwrapResponse<ScholarshipListResponse>(lastPage);
			if (!result?.pagination) return undefined;
			const { page = 1, totalPages = 1 } = result.pagination;
			return page < totalPages ? page + 1 : undefined;
		},
		initialPageParam: 1,
	});

	// Flatten all pages into a single array
	const scholarships = useMemo(() => {
		if (!data?.pages) return [];
		return data.pages.flatMap((page) => {
			const result = unwrapResponse<ScholarshipListResponse>(page);
			return result?.data ?? [];
		});
	}, [data]);

	// Get total count from first page
	const totalCount = useMemo(() => {
		if (!data?.pages?.[0]) return 0;
		const result = unwrapResponse<ScholarshipListResponse>(data.pages[0]);
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
		filters.coverageTypes ||
		filters.eligibilityTypes ||
		filters.deadlineWithin ||
		filters.quickFilters.length > 0;

	const clearAllFilters = () => {
		setFilters({
			search: "",
			regions: "",
			coverageTypes: "",
			eligibilityTypes: "",
			deadlineWithin: undefined,
			quickFilters: [],
		});
		setSearchQuery("");
	};

	return (
		<div className="space-y-6">
			{/* Search Bar */}
			<div className="flex items-center gap-4">
				<p className="text-sm text-muted-foreground">
					{isLoading
						? t("filters.loading")
						: t("filters.showingResults", {
								count: scholarships.length,
								total: totalCount,
							})}
				</p>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder={t("filters.searchScholarships")}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onFocus={(e) => e.target.select()}
						className="pl-9 w-64"
					/>
				</div>
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearAllFilters}
						className="text-muted-foreground hover:text-foreground gap-1.5"
					>
						<X className="w-3.5 h-3.5" />
						{t("filters.clearAll")}
					</Button>
				)}
			</div>

			{/* Beautiful Filter Panel */}
			<FilterPanel
				expandLabel={t("filters.moreFilters")}
				collapseLabel={t("filters.lessFilters")}
				quickFilters={
					<QuickFilterChips
						filters={quickFilterOptions}
						activeFilters={filters.quickFilters}
						onFiltersChange={(newFilters) =>
							setFilters({ ...filters, quickFilters: newFilters })
						}
						disabled={
							!isAuthenticated && filters.quickFilters.includes("meetReq")
						}
					/>
				}
				advancedFilters={
					<>
						<div className="space-y-2 col-span-2">
							<span className="text-sm font-medium text-muted-foreground">
								{t("filters.region")}
							</span>
							<RegionFilter
								value={filters.regions}
								onChange={(regions) => setFilters({ ...filters, regions })}
								options={regionOptions}
								placeholder={t("filters.allRegions")}
							/>
						</div>

						<div className="space-y-2">
							<span className="text-sm font-medium text-muted-foreground">
								{t("filters.coverageType")}
							</span>
							<CoverageTypeFilter
								value={filters.coverageTypes}
								onChange={(coverageTypes) =>
									setFilters({ ...filters, coverageTypes })
								}
								t={(key) => t(`filters.${key}`)}
							/>
						</div>

						<div className="space-y-2">
							<span className="text-sm font-medium text-muted-foreground">
								{t("filters.eligibility")}
							</span>
							<EligibilityTypeFilter
								value={filters.eligibilityTypes}
								onChange={(eligibilityTypes) =>
									setFilters({ ...filters, eligibilityTypes })
								}
								t={(key) => t(`filters.${key}`)}
							/>
						</div>

						<div className="space-y-2">
							<span className="text-sm font-medium text-muted-foreground">
								{t("filters.deadlineWithin")}
							</span>
							<DeadlineWithinFilter
								value={filters.deadlineWithin}
								onChange={(deadlineWithin) =>
									setFilters({ ...filters, deadlineWithin })
								}
								t={(key) => t(`filters.${key}`)}
							/>
						</div>
					</>
				}
			/>

			{/* Table */}
			<div className="border border-border rounded-lg overflow-hidden">
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-16 px-4">
						<Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
						<p className="text-sm text-muted-foreground">
							{t("filters.loadingScholarships")}
						</p>
					</div>
				) : isError ? (
					<div className="flex flex-col items-center justify-center py-16 px-4">
						<div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
							<span className="text-2xl">!</span>
						</div>
						<h3 className="text-lg font-semibold text-foreground mb-2">
							{t("filters.failedToLoad")}
						</h3>
						<p className="text-sm text-muted-foreground text-center max-w-md">
							{error instanceof Error
								? error.message
								: t("filters.failedToLoad")}
						</p>
					</div>
				) : scholarships.length > 0 ? (
					<table className="w-full">
						<thead className="bg-muted/50">
							<tr className="border-b border-border">
								<th className="p-4 text-center font-semibold text-sm text-foreground w-20">
									{t("table.compare")}
								</th>
								<th className="p-4 text-left font-semibold text-sm text-foreground">
									{t("table.scholarship")}
								</th>
								<th className="p-4 text-center font-semibold text-sm text-foreground">
									{t("table.coverage")}
								</th>
								<th className="p-4 text-center font-semibold text-sm text-foreground">
									{t("table.type")}
								</th>
								<th className="p-4 text-center font-semibold text-sm text-foreground">
									{t("table.deadline")}
								</th>
								<th className="p-4 text-center font-semibold text-sm text-foreground">
									{t("table.fit")}
								</th>
								<th className="p-4 text-center font-semibold text-sm text-foreground">
									{t("table.action")}
								</th>
							</tr>
						</thead>
						<tbody>
							{scholarships.map((scholarship) => (
								<ScholarshipTableRow
									key={scholarship.id}
									scholarship={scholarship}
									selected={selectedScholarships.has(scholarship.id || "")}
									onSelect={() => onToggleSelection(scholarship.id || "")}
									onClick={() => {
										setSelectedScholarship(scholarship);
										setIsDetailDrawerOpen(true);
									}}
									onAddToDashboard={() => {
										scholarship.id && onAddToDashboard?.(scholarship.id);
									}}
									isMaxReached={isMaxReached}
									isInDashboard={
										scholarship.id
											? isScholarshipInDashboard?.(scholarship.id)
											: false
									}
									onManage={onManageApplication}
									isAdding={addingScholarshipId === scholarship.id}
									t={t}
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
							{t("filters.noScholarships")}
						</h3>
						<p className="text-sm text-muted-foreground text-center max-w-md">
							{t("filters.noScholarshipsDesc")}
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
							<span className="text-sm">{t("filters.loadingMore")}</span>
						</div>
					)}
				</div>
			)}

			{/* End of list indicator */}
			{!hasNextPage && scholarships.length > 0 && (
				<div className="flex items-center justify-center py-4">
					<p className="text-sm text-muted-foreground">
						{t("filters.showingAllScholarships", {
							count: scholarships.length,
						})}
					</p>
				</div>
			)}

			{/* Scholarship Detail Drawer */}
			<ScholarshipDetailDrawer
				scholarshipId={selectedScholarship?.id || null}
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
