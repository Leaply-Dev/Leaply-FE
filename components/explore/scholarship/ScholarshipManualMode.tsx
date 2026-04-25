"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
	Calendar,
	Check,
	DollarSign,
	GraduationCap,
	Loader2,
	Search,
	Sparkles,
	X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	type PillFilter,
	PillOptionList,
	PillSearchBar,
	QuickFilterChips,
	useRegionOptions,
} from "@/components/explore/filters";
import { ScholarshipCard } from "@/components/explore/scholarship/ScholarshipCard";
import { ScholarshipDetailDrawer } from "@/components/explore/scholarship/ScholarshipDetailDrawer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { analytics } from "@/lib/analytics/analytics";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import { useGetCurrentUser } from "@/lib/generated/api/endpoints/authentication/authentication";
import {
	getListScholarshipsQueryKey,
	listScholarships,
} from "@/lib/generated/api/endpoints/scholarship-explore/scholarship-explore";
import type {
	ListScholarshipsParams,
	ScholarshipListItemResponse,
	ScholarshipListResponse,
} from "@/lib/generated/api/models";

const PAGE_SIZE = 20;

// Quick filter types for scholarships
type ScholarshipQuickFilter =
	| "fullFunded"
	| "meetReq"
	| "deadline"
	| "meritBased";

interface ScholarshipManualModeProps {
	selectedScholarships: Set<string>;
	onToggleSelection: (
		id: string,
		scholarship?: ScholarshipListItemResponse,
	) => void;
	isMaxReached: boolean;
	onAddToDashboard?: (id: string) => void;
}

function ScholarshipCardSkeleton() {
	return (
		<div className="bg-card border border-border rounded-xl p-4 space-y-3">
			<div className="flex items-start gap-3">
				<Skeleton className="h-16 w-16 rounded-lg shrink-0" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-5 w-3/4" />
					<Skeleton className="h-4 w-1/2" />
					<Skeleton className="h-3 w-1/3" />
				</div>
			</div>
			<div className="flex flex-wrap gap-1.5">
				<Skeleton className="h-5 w-16 rounded-full" />
				<Skeleton className="h-5 w-20 rounded-full" />
				<Skeleton className="h-5 w-16 rounded-full" />
			</div>
			<div className="grid grid-cols-2 gap-2">
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-full" />
			</div>
			<div className="flex gap-2 pt-2">
				<Skeleton className="h-9 flex-1" />
				<Skeleton className="h-9 flex-1" />
			</div>
		</div>
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
 * Scholarship Manual Mode - Card grid view with server-side pagination and infinite scroll
 * Shows ALL scholarships with optional filtering
 */
export function ScholarshipManualMode({
	selectedScholarships,
	onToggleSelection,
	isMaxReached,
	onAddToDashboard,
}: ScholarshipManualModeProps) {
	const t = useTranslations("explore");

	// Detail drawer state
	const [selectedScholarship, setSelectedScholarship] =
		useState<ScholarshipListItemResponse | null>(null);
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

	// User auth state for fit_score sorting
	const { data: userResponse } = useGetCurrentUser();
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

		if (filters.quickFilters.includes("fullFunded")) {
			params.coverageTypes = "full_funded";
		} else if (filters.coverageTypes) {
			params.coverageTypes = filters.coverageTypes;
		}

		if (filters.quickFilters.includes("meritBased")) {
			params.eligibilityTypes = "merit";
		} else if (filters.eligibilityTypes) {
			params.eligibilityTypes = filters.eligibilityTypes;
		}

		if (filters.quickFilters.includes("deadline")) {
			params.deadlineWithin = 60;
		} else if (filters.deadlineWithin) {
			params.deadlineWithin = filters.deadlineWithin;
		}

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

	// Track scholarship search after results land, deduplicated by query key
	const searchTrackedRef = useRef<string>("");
	useEffect(() => {
		if (isLoading) return;
		const key = JSON.stringify(queryParams);
		if (searchTrackedRef.current === key) return;
		searchTrackedRef.current = key;
		const totalResults =
			data?.pages.reduce((acc, page) => {
				const result = unwrapResponse<ScholarshipListResponse>(page);
				return acc + (result?.pagination?.total ?? 0);
			}, 0) ?? 0;
		const activeFilterCount = Object.entries(queryParams).filter(
			([k, v]) =>
				k !== "sort" &&
				k !== "size" &&
				k !== "page" &&
				v !== undefined &&
				v !== "",
		).length;
		analytics.track("program_search_performed", {
			query: queryParams.search ?? "",
			filter_count: activeFilterCount,
			results_count: totalResults,
		});
	}, [data, isLoading, queryParams]);

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

	// Selected region values (multi-select)
	const selectedRegions = useMemo(
		() => (filters.regions ? filters.regions.split(",").filter(Boolean) : []),
		[filters.regions],
	);

	const toggleRegion = (value: string) => {
		const next = selectedRegions.includes(value)
			? selectedRegions.filter((r) => r !== value)
			: [...selectedRegions, value];
		setFilters({ ...filters, regions: next.join(",") });
	};

	// Compute active labels for pill triggers
	const regionActiveLabel = useMemo(() => {
		if (selectedRegions.length === 0) return undefined;
		if (selectedRegions.length === 1) {
			return regionOptions.find((o) => o.value === selectedRegions[0])?.label;
		}
		return `${selectedRegions.length} ${t("filters.region").toLowerCase()}`;
	}, [selectedRegions, regionOptions, t]);

	const coverageOptions = useMemo(
		() => [
			{ label: t("filters.fullFunded"), value: "full_funded" },
			{ label: t("filters.partialFunded"), value: "partial_funded" },
		],
		[t],
	);
	const coverageActiveLabel = filters.coverageTypes
		? coverageOptions.find((o) => o.value === filters.coverageTypes)?.label
		: undefined;

	const eligibilityOptions = useMemo(
		() => [
			{ label: t("filters.meritBased"), value: "merit" },
			{ label: t("filters.needBased"), value: "need_based" },
		],
		[t],
	);
	const eligibilityActiveLabel = filters.eligibilityTypes
		? eligibilityOptions.find((o) => o.value === filters.eligibilityTypes)
				?.label
		: undefined;

	const deadlineOptions = useMemo(
		() => [
			{ label: t("filters.within30Days"), value: 30 },
			{ label: t("filters.within60Days"), value: 60 },
			{ label: t("filters.within90Days"), value: 90 },
		],
		[t],
	);
	const deadlineActiveLabel = filters.deadlineWithin
		? deadlineOptions.find((o) => o.value === filters.deadlineWithin)?.label
		: undefined;

	const pillFilters: PillFilter[] = [
		{
			id: "region",
			label: t("filters.region"),
			activeLabel: regionActiveLabel,
			popoverClassName: "w-64 p-2",
			content: (
				<div className="flex flex-col gap-0.5">
					{regionOptions.map((opt) => {
						const active = selectedRegions.includes(opt.value);
						return (
							<button
								key={opt.value}
								type="button"
								onClick={() => toggleRegion(opt.value)}
								className={`flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md transition-colors text-left ${
									active
										? "bg-primary/10 text-primary font-medium"
										: "hover:bg-muted"
								}`}
							>
								<span>{opt.label}</span>
								{active && <Check className="w-4 h-4" />}
							</button>
						);
					})}
				</div>
			),
		},
		{
			id: "coverage",
			label: t("filters.coverageType"),
			activeLabel: coverageActiveLabel,
			content: (
				<PillOptionList
					options={coverageOptions}
					value={filters.coverageTypes || undefined}
					onChange={(v) =>
						setFilters({ ...filters, coverageTypes: (v as string) || "" })
					}
					allLabel={t("filters.allCoverage")}
				/>
			),
		},
		{
			id: "eligibility",
			label: t("filters.eligibility"),
			activeLabel: eligibilityActiveLabel,
			content: (
				<PillOptionList
					options={eligibilityOptions}
					value={filters.eligibilityTypes || undefined}
					onChange={(v) =>
						setFilters({ ...filters, eligibilityTypes: (v as string) || "" })
					}
					allLabel={t("filters.allTypes")}
				/>
			),
		},
		{
			id: "deadline",
			label: t("filters.deadlineWithin"),
			activeLabel: deadlineActiveLabel,
			content: (
				<PillOptionList
					options={deadlineOptions}
					value={filters.deadlineWithin}
					onChange={(v) =>
						setFilters({ ...filters, deadlineWithin: v as number | undefined })
					}
					allLabel={t("filters.all")}
				/>
			),
		},
	];

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
		<div className="space-y-4">
			{/* Pill Search Bar */}
			<PillSearchBar
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				searchPlaceholder={t("filters.searchByUniversity")}
				searchLabel={t("filters.searchAction")}
				onSearch={() => setDebouncedSearch(searchQuery)}
				filters={pillFilters}
			/>

			{/* Quick Filters Row */}
			<div className="flex flex-wrap items-center gap-2">
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
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearAllFilters}
						className="ml-auto text-muted-foreground hover:text-foreground gap-1.5"
					>
						<X className="w-3.5 h-3.5" />
						{t("filters.clearAll")}
					</Button>
				)}
			</div>

			{/* Card Grid */}
			{isLoading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr gap-4">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<ScholarshipCardSkeleton key={i} />
					))}
				</div>
			) : isError ? (
				<div className="flex flex-col items-center justify-center py-16 px-4 border border-border rounded-lg">
					<div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
						<span className="text-2xl">!</span>
					</div>
					<h3 className="text-lg font-semibold text-foreground mb-2">
						{t("filters.failedToLoad")}
					</h3>
					<p className="text-sm text-muted-foreground text-center max-w-md">
						{error instanceof Error ? error.message : t("filters.failedToLoad")}
					</p>
				</div>
			) : scholarships.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr gap-4">
					{scholarships.map((scholarship) => (
						<ScholarshipCard
							key={scholarship.id}
							scholarship={scholarship}
							isSelected={selectedScholarships.has(scholarship.id || "")}
							onToggleSelection={onToggleSelection}
							isMaxReached={isMaxReached}
							onClick={(s) => {
								if (s.id)
									analytics.track("scholarship_viewed", {
										scholarship_id: s.id,
									});
								setSelectedScholarship(s);
								setIsDetailDrawerOpen(true);
							}}
							onAddToDashboard={onAddToDashboard}
							isAdding={false}
						/>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-16 px-4 border border-border rounded-lg">
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
					onToggleSelection(id, selectedScholarship || undefined);
					setIsDetailDrawerOpen(false);
				}}
				onAddToDashboard={onAddToDashboard}
			/>
		</div>
	);
}
