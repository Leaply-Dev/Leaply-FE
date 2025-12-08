"use client";

import {
	BookOpen,
	ChevronDown,
	ChevronUp,
	DollarSign,
	Filter,
	MapPin,
	RotateCcw,
	X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterOption {
	value: string;
	label: string;
	count?: number;
}

export interface FilterState {
	regions: string[];
	majors: string[];
	tuitionRange: { min: number; max: number } | null;
}

interface FilterQuestionnaireProps {
	availableRegions: FilterOption[];
	availableMajors: FilterOption[];
	filters: FilterState;
	onFiltersChange: (filters: FilterState) => void;
	className?: string;
}

export function FilterQuestionnaire({
	availableRegions,
	availableMajors,
	filters,
	onFiltersChange,
	className,
}: FilterQuestionnaireProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [activeSection, setActiveSection] = useState<
		"region" | "major" | "tuition" | null
	>("region");

	const tuitionRanges = [
		{ value: "0-10000", label: "Under $10k", min: 0, max: 10000 },
		{ value: "10000-30000", label: "$10k - $30k", min: 10000, max: 30000 },
		{ value: "30000-50000", label: "$30k - $50k", min: 30000, max: 50000 },
		{ value: "50000+", label: "Over $50k", min: 50000, max: 100000 },
	];

	const hasActiveFilters =
		filters.regions.length > 0 ||
		filters.majors.length > 0 ||
		filters.tuitionRange !== null;

	const toggleRegion = (region: string) => {
		const newRegions = filters.regions.includes(region)
			? filters.regions.filter((r) => r !== region)
			: [...filters.regions, region];
		onFiltersChange({ ...filters, regions: newRegions });
	};

	const toggleMajor = (major: string) => {
		const newMajors = filters.majors.includes(major)
			? filters.majors.filter((m) => m !== major)
			: [...filters.majors, major];
		onFiltersChange({ ...filters, majors: newMajors });
	};

	const setTuitionRange = (range: { min: number; max: number } | null) => {
		onFiltersChange({ ...filters, tuitionRange: range });
	};

	const clearAllFilters = () => {
		onFiltersChange({ regions: [], majors: [], tuitionRange: null });
		setActiveSection("region");
	};

	const activeFilterCount =
		filters.regions.length +
		filters.majors.length +
		(filters.tuitionRange ? 1 : 0);

	return (
		<div
			className={cn(
				"bg-card rounded-xl border-2 border-border shadow-sm",
				className,
			)}
		>
			{/* Header */}
			<div className="p-4 border-b border-border">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Filter className="w-5 h-5 text-primary" />
						<h3 className="font-semibold text-foreground">
							Refine Your Search
						</h3>
						{activeFilterCount > 0 && (
							<Badge className="bg-primary text-white">
								{activeFilterCount}
							</Badge>
						)}
					</div>
					<div className="flex items-center gap-2">
						{hasActiveFilters && (
							<Button
								variant="ghost"
								size="sm"
								onClick={clearAllFilters}
								className="text-xs text-muted-foreground hover:text-foreground"
							>
								<RotateCcw className="w-3 h-3 mr-1" />
								Reset
							</Button>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsExpanded(!isExpanded)}
							className="md:hidden"
						>
							{isExpanded ? (
								<ChevronUp className="w-4 h-4" />
							) : (
								<ChevronDown className="w-4 h-4" />
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Filters Content */}
			<div className={cn("p-4 space-y-6", !isExpanded && "hidden md:block")}>
				{/* Step-by-step Questions */}
				<div className="space-y-4">
					{/* Question 1: Region */}
					<div className="space-y-3">
						<button
							type="button"
							onClick={() =>
								setActiveSection(activeSection === "region" ? null : "region")
							}
							className="w-full flex items-center justify-between text-left group"
						>
							<div className="flex items-center gap-2">
								<MapPin className="w-4 h-4 text-primary" />
								<span className="font-medium text-foreground group-hover:text-primary transition-colors">
									Where would you like to study?
								</span>
							</div>
							{filters.regions.length > 0 && (
								<Badge variant="outline" className="text-xs">
									{filters.regions.length} selected
								</Badge>
							)}
						</button>

						{activeSection === "region" && (
							<div className="pl-6 space-y-2 animate-in slide-in-from-top-2">
								<div className="flex flex-wrap gap-2">
									{availableRegions.map((region) => (
										<button
											type="button"
											key={region.value}
											onClick={() => toggleRegion(region.value)}
											className={cn(
												"px-4 py-2 rounded-full text-sm font-medium transition-all",
												filters.regions.includes(region.value)
													? "bg-primary text-white shadow-md"
													: "bg-muted text-muted-foreground hover:bg-gray-200",
											)}
										>
											{region.label}
											{region.count !== undefined && (
												<span className="ml-1.5 text-xs opacity-75">
													({region.count})
												</span>
											)}
										</button>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Question 2: Budget */}
					<div className="space-y-3">
						<button
							type="button"
							onClick={() =>
								setActiveSection(activeSection === "tuition" ? null : "tuition")
							}
							className="w-full flex items-center justify-between text-left group"
						>
							<div className="flex items-center gap-2">
								<DollarSign className="w-4 h-4 text-primary" />
								<span className="font-medium text-foreground group-hover:text-primary transition-colors">
									What's your annual budget?
								</span>
							</div>
							{filters.tuitionRange && (
								<Badge variant="outline" className="text-xs">
									${filters.tuitionRange.min.toLocaleString()} - $
									{filters.tuitionRange.max.toLocaleString()}
								</Badge>
							)}
						</button>

						{activeSection === "tuition" && (
							<div className="pl-6 space-y-2 animate-in slide-in-from-top-2">
								<div className="grid grid-cols-2 gap-2">
									{tuitionRanges.map((range) => {
										const isSelected =
											filters.tuitionRange?.min === range.min &&
											filters.tuitionRange?.max === range.max;
										return (
											<button
												type="button"
												key={range.value}
												onClick={() =>
													setTuitionRange(
														isSelected
															? null
															: { min: range.min, max: range.max },
													)
												}
												className={cn(
													"px-4 py-3 rounded-lg text-sm font-medium transition-all border-2",
													isSelected
														? "bg-primary text-white border-primary shadow-md"
														: "bg-card text-muted-foreground border-border hover:border-primary",
												)}
											>
												{range.label}
											</button>
										);
									})}
								</div>
							</div>
						)}
					</div>

					{/* Question 3: Major */}
					<div className="space-y-3">
						<button
							type="button"
							onClick={() =>
								setActiveSection(activeSection === "major" ? null : "major")
							}
							className="w-full flex items-center justify-between text-left group"
						>
							<div className="flex items-center gap-2">
								<BookOpen className="w-4 h-4 text-primary" />
								<span className="font-medium text-foreground group-hover:text-primary transition-colors">
									What do you want to study?
								</span>
							</div>
							{filters.majors.length > 0 && (
								<Badge variant="outline" className="text-xs">
									{filters.majors.length} selected
								</Badge>
							)}
						</button>

						{activeSection === "major" && (
							<div className="pl-6 space-y-2 animate-in slide-in-from-top-2">
								<div className="flex flex-wrap gap-2">
									{availableMajors.slice(0, 8).map((major) => (
										<button
											type="button"
											key={major.value}
											onClick={() => toggleMajor(major.value)}
											className={cn(
												"px-4 py-2 rounded-full text-sm font-medium transition-all",
												filters.majors.includes(major.value)
													? "bg-primary text-white shadow-md"
													: "bg-muted text-muted-foreground hover:bg-gray-200",
											)}
										>
											{major.label}
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Active Filters Summary */}
				{hasActiveFilters && (
					<div className="pt-4 border-t border-border">
						<div className="space-y-2">
							<p className="text-xs font-medium text-muted-foreground">
								Active filters:
							</p>
							<div className="flex flex-wrap gap-2">
								{filters.regions.map((region) => (
									<Badge key={region} variant="outline" className="gap-1">
										{region}
										<button
											type="button"
											onClick={() => toggleRegion(region)}
											className="ml-1 hover:text-red-500"
										>
											<X className="w-3 h-3" />
										</button>
									</Badge>
								))}
								{filters.majors.map((major) => (
									<Badge key={major} variant="outline" className="gap-1">
										{major}
										<button
											type="button"
											onClick={() => toggleMajor(major)}
											className="ml-1 hover:text-red-500"
										>
											<X className="w-3 h-3" />
										</button>
									</Badge>
								))}
								{filters.tuitionRange && (
									<Badge variant="outline" className="gap-1">
										${filters.tuitionRange.min.toLocaleString()} - $
										{filters.tuitionRange.max.toLocaleString()}
										<button
											type="button"
											onClick={() => setTuitionRange(null)}
											className="ml-1 hover:text-red-500"
										>
											<X className="w-3 h-3" />
										</button>
									</Badge>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
