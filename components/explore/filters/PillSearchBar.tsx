"use client";

import { ChevronDown, Search } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export interface PillFilter {
	id: string;
	label: string;
	activeLabel?: string;
	content: ReactNode;
	popoverClassName?: string;
}

interface PillSearchBarProps {
	searchValue: string;
	onSearchChange: (value: string) => void;
	searchPlaceholder?: string;
	filters: PillFilter[];
	onSearch?: () => void;
	searchLabel?: string;
}

export function PillSearchBar({
	searchValue,
	onSearchChange,
	searchPlaceholder = "Search...",
	filters,
	onSearch,
	searchLabel = "Search",
}: PillSearchBarProps) {
	return (
		<div className="flex flex-col md:flex-row md:items-stretch bg-card rounded-2xl md:rounded-full shadow-sm border border-border overflow-hidden">
			<div className="flex items-center px-5 py-3 md:py-0 md:flex-[3] min-w-0">
				<Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
				<input
					type="text"
					value={searchValue}
					onChange={(e) => onSearchChange(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") onSearch?.();
					}}
					placeholder={searchPlaceholder}
					className="w-full bg-transparent border-0 outline-none focus:ring-0 focus-visible:ring-0 text-sm text-slate-800 placeholder:text-slate-400 py-2 px-0"
				/>
			</div>

			{filters.map((filter) => (
				<PillFilterSlot key={filter.id} filter={filter} />
			))}

			<button
				type="button"
				onClick={onSearch}
				className="bg-primary text-primary-foreground px-8 py-3 md:py-0 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-medium text-sm shrink-0"
			>
				<Search className="w-4 h-4" />
				<span>{searchLabel}</span>
			</button>
		</div>
	);
}

function PillFilterSlot({ filter }: { filter: PillFilter }) {
	const [open, setOpen] = useState(false);
	const hasValue = !!filter.activeLabel;

	return (
		<>
			<div className="hidden md:block w-px bg-border/60 self-stretch" />
			<div className="block md:hidden h-px bg-border/60" />
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						type="button"
						className="flex items-center justify-between gap-2 px-4 py-3 md:py-0 text-sm hover:bg-muted/40 transition-colors min-w-[140px] md:min-w-[130px]"
					>
						<span
							className={
								hasValue
									? "text-slate-800 font-medium truncate"
									: "text-slate-600"
							}
						>
							{filter.activeLabel || filter.label}
						</span>
						<ChevronDown
							className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
								open ? "rotate-180" : ""
							}`}
						/>
					</button>
				</PopoverTrigger>
				<PopoverContent
					className={filter.popoverClassName ?? "w-64 p-3"}
					align="start"
				>
					{filter.content}
				</PopoverContent>
			</Popover>
		</>
	);
}

interface PillOptionListProps<T extends string | number | undefined> {
	options: Array<{ label: string; value: T }>;
	value: T | undefined;
	onChange: (value: T | undefined) => void;
	allLabel?: string;
}

export function PillOptionList<T extends string | number | undefined>({
	options,
	value,
	onChange,
	allLabel,
}: PillOptionListProps<T>) {
	return (
		<div className="flex flex-col gap-0.5">
			{allLabel && (
				<button
					type="button"
					onClick={() => onChange(undefined)}
					className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors text-left ${
						value === undefined || value === ""
							? "bg-primary/10 text-primary font-medium"
							: "hover:bg-muted"
					}`}
				>
					{allLabel}
				</button>
			)}
			{options.map((opt) => (
				<button
					key={String(opt.value)}
					type="button"
					onClick={() => onChange(opt.value)}
					className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors text-left ${
						value === opt.value
							? "bg-primary/10 text-primary font-medium"
							: "hover:bg-muted"
					}`}
				>
					{opt.label}
				</button>
			))}
		</div>
	);
}
