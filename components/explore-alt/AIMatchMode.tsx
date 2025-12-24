import { useState } from "react";
import { ChevronDown, Sparkles, Target, ShieldCheck } from "lucide-react";
import type { ProgramListItemResponse } from "@/lib/api/types";
import { ProgramCard } from "./ProgramCard";

/**
 * Collapsible Container for each Match Category
 */
export function CategoryContainer({
	title,
	programs,
	variant,
	onSaveToggle,
	defaultExpanded = true,
}: {
	title: string;
	programs: ProgramListItemResponse[];
	variant: "reach" | "target" | "safety";
	onSaveToggle?: (id: string) => void;
	defaultExpanded?: boolean;
}) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	const variantStyles = {
		reach: {
			border: "border-blue-500/20",
			bg: "bg-blue-500/5",
			text: "text-blue-700 dark:text-blue-300",
			icon: <Target className="w-5 h-5" />,
			description:
				"High ranking programs that are competitive but offer excellent prestige.",
		},
		target: {
			border: "border-yellow-500/20",
			bg: "bg-yellow-500/5",
			text: "text-yellow-700 dark:text-yellow-300",
			icon: <Sparkles className="w-5 h-5" />,
			description:
				"Programs where your profile is a strong match for successful applicants.",
		},
		safety: {
			border: "border-green-500/20",
			bg: "bg-green-500/5",
			text: "text-green-700 dark:text-green-300",
			icon: <ShieldCheck className="w-5 h-5" />,
			description:
				"Solid programs where you exceed the typical admission requirements.",
		},
	};

	const style = variantStyles[variant];

	return (
		<div
			className={`border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 mb-6 ${
				isExpanded ? "ring-1 ring-border" : "hover:border-primary/30"
			}`}
		>
			{/* Header (The Horizon Bar) */}
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className={`w-full flex items-center justify-between p-6 text-left transition-colors ${
					isExpanded ? style.bg : "bg-card"
				}`}
			>
				<div className="flex items-center gap-4">
					<div className={`p-3 rounded-xl ${style.bg} ${style.text}`}>
						{style.icon}
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h3 className="text-xl font-bold text-foreground">{title}</h3>
							<span
								className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${style.bg} ${style.text} border ${style.border}`}
							>
								{programs.length} Programs
							</span>
						</div>
						<p className="text-sm text-muted-foreground mt-1">
							{style.description}
						</p>
					</div>
				</div>
				<ChevronDown
					className={`w-6 h-6 text-muted-foreground transition-transform duration-300 ${
						isExpanded ? "rotate-180" : ""
					}`}
				/>
			</button>

			{/* Collapsible Content */}
			<div
				className={`transition-all duration-300 ease-in-out ${
					isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="p-6 border-t border-border bg-background">
					{programs.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{programs.map((program) => (
								<ProgramCard
									key={program.id}
									program={program}
									onSaveToggle={onSaveToggle}
								/>
							))}
						</div>
					) : (
						<div className="py-12 text-center">
							<p className="text-muted-foreground">
								No programs found in this category.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

/**
 * Categorized Results Layout - AI Match Mode (Vertical Horizons)
 */
export function SwimLanes({
	programs,
	onSaveToggle,
}: {
	programs: ProgramListItemResponse[];
	onSaveToggle?: (id: string) => void;
}) {
	const reach = programs.filter((p) => p.fitCategory === "reach");
	const target = programs.filter((p) => p.fitCategory === "target");
	const safety = programs.filter((p) => p.fitCategory === "safety");

	return (
		<div className="space-y-2">
			<CategoryContainer
				title="Reach Schools"
				programs={reach}
				variant="reach"
				onSaveToggle={onSaveToggle}
			/>
			<CategoryContainer
				title="Target Schools"
				programs={target}
				variant="target"
				onSaveToggle={onSaveToggle}
			/>
			<CategoryContainer
				title="Safety Schools"
				programs={safety}
				variant="safety"
				onSaveToggle={onSaveToggle}
			/>
		</div>
	);
}
