"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterBarProps {
	searchQuery?: string;
	onSearchChange?: (query: string) => void;
	filters?: {
		label: string;
		value: string;
		options: { label: string; value: string }[];
		onChange: (value: string) => void;
	}[];
	onClearFilters?: () => void;
	className?: string;
}

export function FilterBar({
	searchQuery = "",
	onSearchChange,
	filters = [],
	onClearFilters,
	className,
}: FilterBarProps) {
	return (
		<div
			className={cn("bg-card p-4 rounded-lg border border-border", className)}
		>
			<div className="flex flex-col md:flex-row gap-4">
				{/* Search Input */}
				{onSearchChange && (
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Search..."
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className="pl-10"
						/>
					</div>
				)}

				{/* Filter Dropdowns */}
				{filters.map((filter) => (
					<Select
						key={filter.label}
						value={filter.value}
						onChange={(e) => filter.onChange(e.target.value)}
						className="md:w-48"
					>
						<option value="">{filter.label}</option>
						{filter.options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</Select>
				))}

				{/* Clear Filters Button */}
				{onClearFilters && (
					<Button variant="outline" onClick={onClearFilters}>
						Clear Filters
					</Button>
				)}
			</div>
		</div>
	);
}
