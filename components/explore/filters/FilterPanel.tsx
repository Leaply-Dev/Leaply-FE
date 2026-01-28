"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

interface FilterPanelProps {
	/** Quick filter chips to show in the always-visible row */
	quickFilters?: ReactNode;
	/** Advanced filter controls shown when expanded */
	advancedFilters?: ReactNode;
	/** Initial expanded state */
	defaultExpanded?: boolean;
	/** Controlled expanded state */
	expanded?: boolean;
	/** Callback when expanded state changes */
	onExpandedChange?: (expanded: boolean) => void;
	/** Label for the expand button */
	expandLabel?: string;
	/** Label for the collapse button */
	collapseLabel?: string;
}

/**
 * Beautiful filter panel with quick filter chips and expandable advanced filters.
 * Extracted aesthetic from the original FilterBar component.
 */
export function FilterPanel({
	quickFilters,
	advancedFilters,
	defaultExpanded = false,
	expanded: controlledExpanded,
	onExpandedChange,
	expandLabel = "More Filters",
	collapseLabel = "Less Filters",
}: FilterPanelProps) {
	const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

	const isExpanded = controlledExpanded ?? internalExpanded;
	const setExpanded = onExpandedChange ?? setInternalExpanded;

	const hasAdvancedFilters = !!advancedFilters;

	return (
		<div className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 ease-in-out">
			<div className="p-4">
				{/* Quick Filter Chips Row */}
				<div className="flex items-center gap-3 flex-wrap">
					{quickFilters}

					{/* Expand Button - only show if there are advanced filters */}
					{hasAdvancedFilters && (
						<button
							type="button"
							onClick={() => setExpanded(!isExpanded)}
							className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-full transition-colors"
						>
							<span>{isExpanded ? collapseLabel : expandLabel}</span>
							<ChevronDown
								className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
							/>
						</button>
					)}
				</div>

				{/* Expanded Filter Options */}
				{hasAdvancedFilters && (
					<div
						className={`transition-all duration-300 ease-in-out ${
							isExpanded
								? "max-h-[500px] opacity-100 mt-4 pt-4 border-t border-border"
								: "max-h-0 opacity-0 overflow-hidden"
						}`}
					>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{advancedFilters}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * Compact inline filter panel variant - no card wrapper, just the filter row
 * Used inside existing card containers like the table header area
 */
export function FilterPanelInline({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`bg-card border border-border rounded-xl p-4 space-y-4 ${className}`}
		>
			<div className="flex flex-wrap items-center gap-3">{children}</div>
		</div>
	);
}
