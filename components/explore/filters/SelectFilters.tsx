"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface SelectFilterProps<T extends string | number | undefined> {
	/** Current value */
	value: T;
	/** Callback when value changes */
	onChange: (value: T) => void;
	/** Placeholder text */
	placeholder?: string;
	/** Options to display */
	options: Array<{ label: string; value: T }>;
	/** "All" option label (displays when value is undefined) */
	allLabel?: string;
	/** Custom class name for the trigger */
	className?: string;
}

/**
 * Generic select filter component
 */
export function SelectFilter<T extends string | number | undefined>({
	value,
	onChange,
	placeholder,
	options,
	allLabel = "All",
	className = "w-44",
}: SelectFilterProps<T>) {
	const handleChange = (v: string) => {
		if (v === "all") {
			onChange(undefined as T);
		} else {
			// Try to parse as number if the first option's value is a number
			const firstNonAllOption = options.find((o) => o.value !== undefined);
			if (typeof firstNonAllOption?.value === "number") {
				onChange(Number.parseInt(v, 10) as T);
			} else {
				onChange(v as T);
			}
		}
	};

	return (
		<Select value={value?.toString() || "all"} onValueChange={handleChange}>
			<SelectTrigger className={className}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">{allLabel}</SelectItem>
				{options.map((opt) => (
					<SelectItem
						key={opt.value?.toString()}
						value={opt.value?.toString() || ""}
					>
						{opt.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

interface DeadlineWithinFilterProps {
	value: number | undefined;
	onChange: (value: number | undefined) => void;
	/** Translation function */
	t: (key: string) => string;
	className?: string;
}

/**
 * Deadline within days filter
 */
export function DeadlineWithinFilter({
	value,
	onChange,
	t,
	className = "w-44",
}: DeadlineWithinFilterProps) {
	return (
		<SelectFilter
			value={value}
			onChange={onChange}
			placeholder={t("deadlineWithin")}
			allLabel={t("all")}
			className={className}
			options={[
				{ label: t("within30Days"), value: 30 },
				{ label: t("within60Days"), value: 60 },
				{ label: t("within90Days"), value: 90 },
			]}
		/>
	);
}

interface TuitionMaxFilterProps {
	value: number | undefined;
	onChange: (value: number | undefined) => void;
	/** Translation function */
	t: (key: string) => string;
	className?: string;
}

/**
 * Maximum tuition filter for programs
 */
export function TuitionMaxFilter({
	value,
	onChange,
	t,
	className = "w-44",
}: TuitionMaxFilterProps) {
	return (
		<SelectFilter
			value={value}
			onChange={onChange}
			placeholder={t("tuitionMax")}
			allLabel={t("noLimit")}
			className={className}
			options={[
				{ label: "\u2264 $20,000/year", value: 20000 },
				{ label: "\u2264 $30,000/year", value: 30000 },
				{ label: "\u2264 $50,000/year", value: 50000 },
				{ label: "\u2264 $70,000/year", value: 70000 },
			]}
		/>
	);
}

interface CoverageTypeFilterProps {
	value: string;
	onChange: (value: string) => void;
	/** Translation function */
	t: (key: string) => string;
	className?: string;
}

/**
 * Coverage type filter for scholarships
 */
export function CoverageTypeFilter({
	value,
	onChange,
	t,
	className = "w-44",
}: CoverageTypeFilterProps) {
	return (
		<SelectFilter
			value={value || undefined}
			onChange={(v) => onChange(v || "")}
			placeholder={t("coverageType")}
			allLabel={t("allCoverage")}
			className={className}
			options={[
				{ label: t("fullFunded"), value: "full_funded" },
				{ label: t("partialFunded"), value: "partial_funded" },
			]}
		/>
	);
}

interface EligibilityTypeFilterProps {
	value: string;
	onChange: (value: string) => void;
	/** Translation function */
	t: (key: string) => string;
	className?: string;
}

/**
 * Eligibility type filter for scholarships
 */
export function EligibilityTypeFilter({
	value,
	onChange,
	t,
	className = "w-40",
}: EligibilityTypeFilterProps) {
	return (
		<SelectFilter
			value={value || undefined}
			onChange={(v) => onChange(v || "")}
			placeholder={t("eligibility")}
			allLabel={t("allTypes")}
			className={className}
			options={[
				{ label: t("meritBased"), value: "merit" },
				{ label: t("needBased"), value: "need_based" },
			]}
		/>
	);
}
