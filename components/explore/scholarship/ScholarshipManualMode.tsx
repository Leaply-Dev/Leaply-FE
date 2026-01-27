"use client";

import {
	ArrowRight,
	Award,
	Calendar,
	ChevronLeft,
	ChevronRight,
	DollarSign,
	Filter,
	Loader2,
	Search,
	Settings2,
	Sparkles,
	X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ScholarshipDetailDrawer } from "@/components/explore/scholarship/ScholarshipDetailDrawer";
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
import type {
	EnglishGapStatus,
	ScholarshipListItemResponse,
} from "@/lib/generated/api/models";
import {
	formatCoverageAmount,
	formatCoverageType,
	formatDate,
	formatEligibilityType,
} from "@/lib/utils/displayFormatters";

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

export interface ScholarshipFilterState {
	quickFilters: string[];
	coverageType: string;
	eligibilityType: string;
	region: string;
}

interface ScholarshipFilterBarProps {
	filters: ScholarshipFilterState;
	onFiltersChange: (filters: ScholarshipFilterState) => void;
}

function ScholarshipFilterBar({
	filters,
	onFiltersChange,
}: ScholarshipFilterBarProps) {
	const toggleQuickFilter = (filter: string) => {
		const current = filters.quickFilters;
		const updated = current.includes(filter)
			? current.filter((f) => f !== filter)
			: [...current, filter];
		onFiltersChange({ ...filters, quickFilters: updated });
	};

	const hasActiveFilters =
		filters.quickFilters.length > 0 ||
		filters.coverageType ||
		filters.eligibilityType ||
		filters.region;

	const clearAllFilters = () => {
		onFiltersChange({
			quickFilters: [],
			coverageType: "",
			eligibilityType: "",
			region: "",
		});
	};

	return (
		<div className="bg-card border border-border rounded-xl p-4 space-y-4">
			{/* Quick Filters */}
			<div className="flex flex-wrap items-center gap-2">
				<span className="text-sm font-medium text-foreground flex items-center gap-1.5">
					<Filter className="w-4 h-4" />
					Quick Filters:
				</span>
				<Button
					variant={
						filters.quickFilters.includes("fullFunded") ? "default" : "outline"
					}
					size="sm"
					onClick={() => toggleQuickFilter("fullFunded")}
					className="gap-1.5"
				>
					<Sparkles className="w-3.5 h-3.5" />
					Full Funded
				</Button>
				<Button
					variant={
						filters.quickFilters.includes("deadline60") ? "default" : "outline"
					}
					size="sm"
					onClick={() => toggleQuickFilter("deadline60")}
					className="gap-1.5"
				>
					<Calendar className="w-3.5 h-3.5" />
					Deadline 60+ days
				</Button>
				<Button
					variant={
						filters.quickFilters.includes("noGpa") ? "default" : "outline"
					}
					size="sm"
					onClick={() => toggleQuickFilter("noGpa")}
					className="gap-1.5"
				>
					No GPA Required
				</Button>
			</div>

			{/* Extended Filters */}
			<div className="flex flex-wrap items-center gap-3">
				<Select
					value={filters.coverageType}
					onValueChange={(v) =>
						onFiltersChange({ ...filters, coverageType: v })
					}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Coverage Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Coverage</SelectItem>
						<SelectItem value="full_funded">Full Funded</SelectItem>
						<SelectItem value="partial_funded">Partial Funded</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={filters.eligibilityType}
					onValueChange={(v) =>
						onFiltersChange({ ...filters, eligibilityType: v })
					}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Eligibility" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Types</SelectItem>
						<SelectItem value="merit">Merit-based</SelectItem>
						<SelectItem value="need_based">Need-based</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={filters.region}
					onValueChange={(v) => onFiltersChange({ ...filters, region: v })}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Region" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Regions</SelectItem>
						<SelectItem value="north_america">North America</SelectItem>
						<SelectItem value="europe">Europe</SelectItem>
						<SelectItem value="asia_pacific">Asia Pacific</SelectItem>
						<SelectItem value="oceania">Oceania</SelectItem>
					</SelectContent>
				</Select>

				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearAllFilters}
						className="text-muted-foreground hover:text-foreground gap-1.5"
					>
						<X className="w-3.5 h-3.5" />
						Clear all
					</Button>
				)}
			</div>
		</div>
	);
}

interface ScholarshipManualModeProps {
	scholarships: ScholarshipListItemResponse[];
	selectedScholarships: Set<string>;
	onToggleSelection: (id: string) => void;
	isMaxReached: boolean;
	onAddToDashboard?: (id: string) => void;
	isScholarshipInDashboard?: (id: string) => boolean;
	onManageApplication?: (id: string) => void;
	// Server-side filtering props
	onFiltersChange?: (filters: ScholarshipFilterState) => void;
	onSearchChange?: (search: string) => void;
	onSortChange?: (sort: string, dir: string) => void;
	totalCount?: number;
	currentPage?: number;
	onPageChange?: (page: number) => void;
	pageSize?: number;
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
}) {
	const getDeadlineUrgency = (deadline?: string) => {
		if (!deadline) return { color: "text-muted-foreground", label: "N/A" };
		const daysUntil = Math.floor(
			(new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
		);

		if (daysUntil < 0) {
			return { color: "text-muted-foreground", label: "Closed" };
		}
		if (daysUntil < 14) {
			return { color: "text-destructive", label: `${daysUntil} days left` };
		}
		if (daysUntil <= 30) {
			return { color: "text-orange-600", label: `${daysUntil} days left` };
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
						Strong Fit
					</Badge>
				);
			case "target":
				return (
					<Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
						Good Fit
					</Badge>
				);
			case "reach":
				return (
					<Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
						Competitive
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
									<span>•</span>
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
					<span className="font-semibold text-foreground flex items-center gap-1">
						<DollarSign className="w-3.5 h-3.5" />
						{getCoverageDisplay()}
					</span>
					{scholarship.coverageType === "full_funded" && (
						<Badge className="bg-green-100 text-green-700 border-0 text-xs">
							Full Funded
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
				<span className={`text-sm font-medium ${deadline.color}`}>
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
							Manage
						</>
					) : isAdding ? (
						<>
							<Loader2 className="w-4 h-4 animate-spin" />
							Adding...
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

export function ScholarshipManualMode({
	scholarships,
	selectedScholarships,
	onToggleSelection,
	isMaxReached,
	onAddToDashboard,
	isScholarshipInDashboard,
	onManageApplication,
	totalCount,
	currentPage = 1,
	onPageChange,
	pageSize = 10,
	addingScholarshipId,
}: ScholarshipManualModeProps) {
	// Detail drawer state
	const [selectedScholarship, setSelectedScholarship] =
		useState<ScholarshipListItemResponse | null>(null);
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

	// Local pagination (for client-side filtering)
	const [localPage, setLocalPage] = useState(1);
	const itemsPerPage = pageSize;

	// Sorting state
	const [sortBy, setSortBy] = useState("fit_score");

	// Search state
	const [searchQuery, setSearchQuery] = useState("");

	// Filter state
	const [filters, setFilters] = useState<ScholarshipFilterState>({
		quickFilters: [],
		coverageType: "",
		eligibilityType: "",
		region: "",
	});

	// Reset page on filter change
	const handleFiltersChange = (newFilters: ScholarshipFilterState) => {
		setFilters(newFilters);
		setLocalPage(1);
	};

	// Client-side filtering (when server-side filtering is not available)
	const filteredScholarships = scholarships.filter((scholarship) => {
		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			const matchesSearch =
				(scholarship.name || "").toLowerCase().includes(query) ||
				(scholarship.universityName || "").toLowerCase().includes(query) ||
				(scholarship.sourceName || "").toLowerCase().includes(query);
			if (!matchesSearch) return false;
		}

		// Quick filters
		if (filters.quickFilters.includes("fullFunded")) {
			if (scholarship.coverageType?.toLowerCase() !== "full_funded")
				return false;
		}

		if (filters.quickFilters.includes("deadline60")) {
			if (!scholarship.applicationDeadline) return false;
			const daysUntil = Math.floor(
				(new Date(scholarship.applicationDeadline).getTime() - Date.now()) /
					(1000 * 60 * 60 * 24),
			);
			if (daysUntil < 60) return false;
		}

		if (filters.quickFilters.includes("noGpa")) {
			if (scholarship.minGpa && scholarship.minGpa > 0) return false;
		}

		// Coverage type filter
		if (filters.coverageType && filters.coverageType !== "all") {
			if (
				scholarship.coverageType?.toLowerCase() !==
				filters.coverageType.toLowerCase()
			)
				return false;
		}

		// Eligibility type filter
		if (filters.eligibilityType && filters.eligibilityType !== "all") {
			if (
				scholarship.eligibilityType?.toLowerCase() !==
				filters.eligibilityType.toLowerCase()
			)
				return false;
		}

		// Region filter
		if (filters.region && filters.region !== "all") {
			if (
				scholarship.universityRegion?.toLowerCase() !==
				filters.region.toLowerCase()
			)
				return false;
		}

		return true;
	});

	// Sort scholarships
	const sortedScholarships = [...filteredScholarships].sort((a, b) => {
		switch (sortBy) {
			case "fit_score":
				return (b.fitScore || 0) - (a.fitScore || 0);
			case "coverage_desc":
				return (
					(b.coverageAmountMax || b.coveragePercentage || 0) -
					(a.coverageAmountMax || a.coveragePercentage || 0)
				);
			case "deadline":
				return (
					new Date(a.applicationDeadline || "9999-12-31").getTime() -
					new Date(b.applicationDeadline || "9999-12-31").getTime()
				);
			case "name":
				return (a.name || "").localeCompare(b.name || "");
			default:
				return 0;
		}
	});

	// Pagination
	const actualPage = onPageChange ? currentPage : localPage;
	const setPage = onPageChange || setLocalPage;
	const total = totalCount || sortedScholarships.length;
	const totalPages = Math.ceil(total / itemsPerPage);
	const paginatedScholarships = onPageChange
		? scholarships // Use provided data if server-side pagination
		: sortedScholarships.slice(
				(actualPage - 1) * itemsPerPage,
				actualPage * itemsPerPage,
			);

	return (
		<div className="space-y-6">
			{/* Filter Bar */}
			<ScholarshipFilterBar
				filters={filters}
				onFiltersChange={handleFiltersChange}
			/>

			{/* Results List */}
			<div className="space-y-4">
				{/* Results Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<p className="text-sm text-muted-foreground">
							Showing {paginatedScholarships.length} of {total} results
						</p>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search scholarships..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setLocalPage(1);
								}}
								onFocus={(e) => e.target.select()}
								className="pl-9 w-64"
							/>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-sm text-foreground">Sort by:</span>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-44">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="fit_score">Best Match</SelectItem>
								<SelectItem value="coverage_desc">
									Coverage (High → Low)
								</SelectItem>
								<SelectItem value="deadline">Deadline (Soonest)</SelectItem>
								<SelectItem value="name">Name (A-Z)</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Table */}
				<div className="border border-border rounded-lg overflow-hidden">
					{paginatedScholarships.length > 0 ? (
						<table className="w-full">
							<thead className="bg-muted/50">
								<tr className="border-b border-border">
									<th className="p-4 text-center font-semibold text-sm text-foreground w-20">
										Compare
									</th>
									<th className="p-4 text-left font-semibold text-sm text-foreground">
										Scholarship
									</th>
									<th className="p-4 text-center font-semibold text-sm text-foreground">
										Coverage
									</th>
									<th className="p-4 text-center font-semibold text-sm text-foreground">
										Type
									</th>
									<th className="p-4 text-center font-semibold text-sm text-foreground">
										Deadline
									</th>
									<th className="p-4 text-center font-semibold text-sm text-foreground">
										Fit
									</th>
									<th className="p-4 text-center font-semibold text-sm text-foreground">
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{paginatedScholarships.map((scholarship) => (
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
								No scholarships found
							</h3>
							<p className="text-sm text-muted-foreground text-center max-w-md">
								No scholarships match your current filters. Try adjusting your
								filters or search terms.
							</p>
						</div>
					)}
				</div>

				{/* Pagination */}
				{totalPages > 1 && total > 0 && (
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Showing {(actualPage - 1) * itemsPerPage + 1}-
							{Math.min(actualPage * itemsPerPage, total)} of {total} results
						</p>

						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								disabled={actualPage === 1}
								onClick={() => setPage(Math.max(1, actualPage - 1))}
							>
								<ChevronLeft className="w-4 h-4" />
							</Button>

							{[...Array(Math.min(5, totalPages))].map((_, i) => {
								const pageNum = i + 1;
								return (
									<Button
										key={pageNum}
										variant={actualPage === pageNum ? "default" : "outline"}
										size="icon"
										onClick={() => setPage(pageNum)}
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
								disabled={actualPage === totalPages}
								onClick={() => setPage(Math.min(totalPages, actualPage + 1))}
							>
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>
					</div>
				)}
			</div>

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
