import { ChevronDown, ShieldCheck, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import { ProgramCard } from "@/components/explore/ProgramCard";
import type { ProgramListItemResponse } from "@/lib/api/types";

/**
 * Collapsible Container for each Match Category - Compact Version
 */
export function CategoryContainer({
	title,
	programs,
	variant,
	onSaveToggle,
	onProgramClick,
	defaultExpanded = true,
}: {
	title: string;
	programs: ProgramListItemResponse[];
	variant: "reach" | "target" | "safety";
	onSaveToggle?: (id: string) => void;
	onProgramClick?: (program: ProgramListItemResponse) => void;
	defaultExpanded?: boolean;
}) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const [showAll, setShowAll] = useState(false);

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

	// Show max 2 cards by default
	const MAX_PREVIEW_CARDS = 2;
	const displayedPrograms = showAll
		? programs
		: programs.slice(0, MAX_PREVIEW_CARDS);
	const hasMore = programs.length > MAX_PREVIEW_CARDS;

	return (
		<div
			className={`border rounded-xl overflow-hidden shadow-sm transition-all duration-300 mb-3 ${
				isExpanded ? "ring-1 ring-border" : "hover:border-primary/30"
			}`}
		>
			{/* Header (The Horizon Bar) - More Compact */}
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
					isExpanded ? style.bg : "bg-card"
				}`}
			>
				<div className="flex items-center gap-3">
					<div className={`p-2 rounded-lg ${style.bg} ${style.text}`}>
						{style.icon}
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h3 className="text-lg font-bold text-foreground">{title}</h3>
							<span
								className={`px-2 py-0.5 rounded-full text-xs font-semibold ${style.bg} ${style.text} border ${style.border}`}
							>
								{programs.length}
							</span>
						</div>
					</div>
				</div>
				<ChevronDown
					className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
						isExpanded ? "rotate-180" : ""
					}`}
				/>
			</button>

			{/* Collapsible Content - Compact */}
			<div
				className={`transition-all duration-300 ease-in-out ${
					isExpanded ? "max-h-500 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="px-4 pb-4 border-t border-border bg-background">
					{programs.length > 0 ? (
						<>
							{/* Card Grid - Show max 2 cards in a row */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
								{displayedPrograms.map((program) => (
									<ProgramCard
										key={program.id}
										program={program}
										onSaveToggle={onSaveToggle}
										onClick={onProgramClick}
									/>
								))}
							</div>

							{/* View All Button */}
							{hasMore && !showAll && (
								<div className="mt-4 text-center">
									<button
										type="button"
										onClick={() => setShowAll(true)}
										className="text-sm text-primary hover:text-primary/80 font-medium"
									>
										View all {programs.length} programs →
									</button>
								</div>
							)}

							{/* Show Less Button */}
							{showAll && (
								<div className="mt-4 text-center">
									<button
										type="button"
										onClick={() => setShowAll(false)}
										className="text-sm text-muted-foreground hover:text-foreground font-medium"
									>
										Show less ↑
									</button>
								</div>
							)}
						</>
					) : (
						<div className="py-8 text-center">
							<p className="text-sm text-muted-foreground">
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
	onProgramClick,
}: {
	programs: ProgramListItemResponse[];
	onSaveToggle?: (id: string) => void;
	onProgramClick?: (program: ProgramListItemResponse) => void;
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
				onProgramClick={onProgramClick}
			/>
			<CategoryContainer
				title="Target Schools"
				programs={target}
				variant="target"
				onSaveToggle={onSaveToggle}
				onProgramClick={onProgramClick}
			/>
			<CategoryContainer
				title="Safety Schools"
				programs={safety}
				variant="safety"
				onSaveToggle={onSaveToggle}
				onProgramClick={onProgramClick}
			/>
		</div>
	);
}
