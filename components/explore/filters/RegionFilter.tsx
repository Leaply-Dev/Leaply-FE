"use client";

import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export interface RegionOption {
	label: string;
	value: string;
}

interface RegionFilterProps {
	/** Currently selected region values (comma-separated string) */
	value: string;
	/** Callback when regions change */
	onChange: (value: string) => void;
	/** Region options to display */
	options: RegionOption[];
	/** Placeholder text when no regions selected */
	placeholder?: string;
	/** Custom class name */
	className?: string;
}

/**
 * Region multi-select filter with chip display and popover for adding.
 * Chips show selected regions, "Add" button opens a popover with available options.
 */
export function RegionFilter({
	value,
	onChange,
	options,
	placeholder = "All Regions",
	className = "",
}: RegionFilterProps) {
	const [open, setOpen] = useState(false);

	// Convert comma-separated string to array of selected values
	const selectedRegions = useMemo(() => {
		if (!value) return [];
		return value.split(",").filter(Boolean);
	}, [value]);

	// Handle adding a new region
	const handleAddRegion = (newValue: string) => {
		if (selectedRegions.includes(newValue)) return;
		const newRegions = [...selectedRegions, newValue];
		onChange(newRegions.join(","));
	};

	// Handle removing a region
	const handleRemoveRegion = (regionToRemove: string) => {
		const newRegions = selectedRegions.filter((r) => r !== regionToRemove);
		onChange(newRegions.join(","));
	};

	// Get available (unselected) options
	const availableOptions = useMemo(() => {
		return options.filter((opt) => !selectedRegions.includes(opt.value));
	}, [options, selectedRegions]);

	return (
		<div className={`flex flex-wrap items-center gap-2 ${className}`}>
			{/* Selected region chips */}
			{selectedRegions.map((regionValue) => {
				const option = options.find((opt) => opt.value === regionValue);
				return (
					<div
						key={regionValue}
						className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium"
					>
						{option?.label || regionValue}
						<button
							type="button"
							onClick={() => handleRemoveRegion(regionValue)}
							className="hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					</div>
				);
			})}

			{/* Placeholder when empty */}
			{selectedRegions.length === 0 && (
				<span className="text-sm text-muted-foreground px-1">
					{placeholder}
				</span>
			)}

			{/* Add button with popover */}
			{availableOptions.length > 0 && (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-8 px-3 rounded-full border-dashed gap-1.5"
						>
							<Plus className="h-4 w-4" />
							Add
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-48 p-2" align="start">
						<div className="flex flex-col gap-1">
							{availableOptions.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => {
										handleAddRegion(opt.value);
										// Keep popover open for multi-select convenience
									}}
									className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
								>
									{opt.label}
								</button>
							))}
						</div>
					</PopoverContent>
				</Popover>
			)}
		</div>
	);
}

/**
 * Hook to get standard region options with translations
 */
export function useRegionOptions(t: (key: string) => string): RegionOption[] {
	return useMemo(
		() => [
			{ label: t("northAmerica"), value: "north_america" },
			{ label: t("westernEurope"), value: "western_europe" },
			{ label: t("centralEurope"), value: "central_europe" },
			{ label: t("northernEurope"), value: "northern_europe" },
			{ label: t("eastAsia"), value: "east_asia" },
			{ label: t("southeastAsia"), value: "southeast_asia" },
			{ label: t("oceania"), value: "oceania" },
		],
		[t],
	);
}
