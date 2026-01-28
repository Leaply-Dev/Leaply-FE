"use client";

import type { LucideIcon } from "lucide-react";

interface QuickFilterChipProps {
	/** Unique identifier for the filter */
	id: string;
	/** Display label */
	label: string;
	/** Optional icon component */
	icon?: LucideIcon;
	/** Whether the filter is currently active */
	active: boolean;
	/** Callback when the filter is toggled */
	onToggle: (id: string) => void;
	/** Whether the chip is disabled */
	disabled?: boolean;
}

/**
 * Beautiful quick filter chip with icon and toggle state.
 * Extracted from the original FilterBar component aesthetic.
 */
export function QuickFilterChip({
	id,
	label,
	icon: Icon,
	active,
	onToggle,
	disabled = false,
}: QuickFilterChipProps) {
	return (
		<button
			type="button"
			onClick={() => onToggle(id)}
			disabled={disabled}
			className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
				active
					? "bg-primary text-primary-foreground border-primary"
					: "bg-muted/50 hover:bg-muted border-border text-foreground"
			} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
		>
			{Icon && <Icon className="w-4 h-4" />}
			<span className="text-sm font-medium">{label}</span>
		</button>
	);
}

interface QuickFilterChipsProps<T extends string> {
	/** Available filter options */
	filters: Array<{
		id: T;
		label: string;
		icon?: LucideIcon;
	}>;
	/** Currently active filter IDs */
	activeFilters: T[];
	/** Callback when filters change */
	onFiltersChange: (filters: T[]) => void;
	/** Whether all chips are disabled */
	disabled?: boolean;
}

/**
 * A group of quick filter chips with multi-select support.
 */
export function QuickFilterChips<T extends string>({
	filters,
	activeFilters,
	onFiltersChange,
	disabled = false,
}: QuickFilterChipsProps<T>) {
	const handleToggle = (id: T) => {
		if (activeFilters.includes(id)) {
			onFiltersChange(activeFilters.filter((f) => f !== id));
		} else {
			onFiltersChange([...activeFilters, id]);
		}
	};

	return (
		<>
			{filters.map((filter) => (
				<QuickFilterChip
					key={filter.id}
					id={filter.id}
					label={filter.label}
					icon={filter.icon}
					active={activeFilters.includes(filter.id)}
					onToggle={() => handleToggle(filter.id)}
					disabled={disabled}
				/>
			))}
		</>
	);
}
