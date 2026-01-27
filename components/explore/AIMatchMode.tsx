import { ChevronDown, ShieldCheck, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import { ProgramCard } from "@/components/explore/ProgramCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
	ProgramListItemResponse,
	UserContextResponse,
} from "@/lib/generated/api/models";

/**
 * Collapsible Container for each Match Category - Redesigned with new theming
 */
export function CategoryContainer({
	title,
	description,
	programs,
	variant,
	userProfile,
	onSaveToggle,
	onProgramClick,
	defaultExpanded = true,
	selectedPrograms,
	onToggleSelection,
	isMaxReached,
	onAddToDashboard,
	isProgramInDashboard,
	onManageApplication,
	addingProgramId,
}: {
	title: string;
	description: string;
	programs: ProgramListItemResponse[];
	variant: "reach" | "target" | "safety";
	userProfile?: UserContextResponse | null;
	onSaveToggle?: (id: string) => void;
	onProgramClick?: (program: ProgramListItemResponse) => void;
	defaultExpanded?: boolean;
	selectedPrograms?: Set<string>;
	onToggleSelection?: (id: string) => void;
	isMaxReached?: boolean;
	onAddToDashboard?: (id: string) => void;
	isProgramInDashboard?: (id: string) => boolean;
	onManageApplication?: (id: string) => void;
	addingProgramId?: string | null;
}) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const [showAll, setShowAll] = useState(false);

	const variantStyles = {
		reach: {
			border: "border-l-4 border-l-blue-500",
			bg: "bg-blue-50 dark:bg-blue-950/20",
			headerBg: "bg-blue-100 dark:bg-blue-950/40",
			text: "text-blue-700 dark:text-blue-300",
			badgeBg: "bg-blue-500",
			badgeText: "text-white",
			icon: <Target className="w-5 h-5" />,
			badge: "High Risk",
		},
		target: {
			border: "border-l-4 border-l-green-500",
			bg: "bg-green-50 dark:bg-green-950/20",
			headerBg: "bg-green-100 dark:bg-green-950/40",
			text: "text-green-700 dark:text-green-300",
			badgeBg: "bg-green-500",
			badgeText: "text-white",
			icon: <Sparkles className="w-5 h-5" />,
			badge: "Optimal",
		},
		safety: {
			border: "border-l-4 border-l-gray-500",
			bg: "bg-gray-50 dark:bg-gray-900/40",
			headerBg: "bg-gray-100 dark:bg-gray-900/60",
			text: "text-gray-700 dark:text-gray-300",
			badgeBg: "bg-gray-500",
			badgeText: "text-white",
			icon: <ShieldCheck className="w-5 h-5" />,
			badge: "Safe",
		},
	};

	const style = variantStyles[variant];

	// Show max 3 cards by default (matching grid layout)
	const MAX_PREVIEW_CARDS = 3;
	const displayedPrograms = showAll
		? programs
		: programs.slice(0, MAX_PREVIEW_CARDS);
	const hasMore = programs.length > MAX_PREVIEW_CARDS;

	return (
		<div
			className={`border rounded-xl overflow-hidden shadow-sm transition-all duration-300 mb-2 ${style.border} ${
				isExpanded ? "ring-1 ring-border" : "hover:border-primary/30"
			}`}
		>
			{/* Header (The Horizon Bar) - Redesigned */}
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className={`w-full text-left transition-colors ${
					isExpanded ? style.headerBg : "bg-card"
				}`}
			>
				<div className="p-4">
					<div className="flex items-center justify-between">
						{/* Left: Icon + Title + Badge */}
						<div className="flex items-center gap-3">
							<div
								className={`p-2.5 rounded-lg ${style.badgeBg} ${style.badgeText}`}
							>
								{style.icon}
							</div>
							<div>
								<div className="flex items-center gap-2.5">
									<h3 className="text-lg font-bold text-foreground">{title}</h3>
									<span
										className={`px-2.5 py-1 rounded-full text-xs font-bold ${style.badgeBg} ${style.badgeText}`}
									>
										{style.badge}
									</span>
									<span
										className={
											"px-2 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground"
										}
									>
										{programs.length}
									</span>
								</div>
								<p className="text-sm text-muted-foreground mt-1">
									{description}
								</p>
							</div>
						</div>

						{/* Right: Expand Icon */}
						<ChevronDown
							className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ml-4 ${
								isExpanded ? "rotate-180" : ""
							}`}
						/>
					</div>
				</div>
			</button>

			{/* Collapsible Content */}
			<div
				className={`transition-all duration-300 ease-in-out ${
					isExpanded ? "max-h-1250 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className={`px-4 pb-4 pt-1 ${style.bg}`}>
					{programs.length > 0 ? (
						<>
							{/* Card Grid - Default 3 cards in a row */}
							<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
								{displayedPrograms.map((program) => (
									<ProgramCard
										key={program.id}
										program={program}
										userProfile={userProfile}
										onSaveToggle={onSaveToggle}
										onClick={onProgramClick}
										isSelected={selectedPrograms?.has(program.id || "")}
										onToggleSelection={onToggleSelection}
										isMaxReached={isMaxReached}
										onAddToDashboard={onAddToDashboard}
										isInDashboard={
											program.id ? isProgramInDashboard?.(program.id) : false
										}
										isAdding={addingProgramId === program.id}
										onManage={onManageApplication}
									/>
								))}
							</div>

							{/* View All Button */}
							{hasMore && !showAll && (
								<div className="mt-4 text-center">
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											setShowAll(true);
										}}
										className="text-sm text-primary hover:text-primary/80 font-semibold px-5 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
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
										onClick={(e) => {
											e.stopPropagation();
											setShowAll(false);
										}}
										className="text-sm text-muted-foreground hover:text-foreground font-semibold px-5 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
									>
										Show less ↑
									</button>
								</div>
							)}
						</>
					) : (
						<div className="py-8 text-center">
							<p className="text-xs text-muted-foreground">
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
	userProfile,
	onSaveToggle,
	onProgramClick,
	selectedPrograms,
	onToggleSelection,
	isMaxReached,
	onAddToDashboard,
}: {
	programs: ProgramListItemResponse[];
	userProfile?: UserContextResponse | null;
	onSaveToggle?: (id: string) => void;
	onProgramClick?: (program: ProgramListItemResponse) => void;
	selectedPrograms?: Set<string>;
	onToggleSelection?: (id: string) => void;
	isMaxReached?: boolean;
	onAddToDashboard?: (id: string) => void;
}) {
	const reach = programs.filter((p) => p.fitCategory === "reach");
	const target = programs.filter((p) => p.fitCategory === "target");
	const safety = programs.filter((p) => p.fitCategory === "safety");

	return (
		<div className="space-y-0">
			<CategoryContainer
				title="Reach Programs"
				description="High reward options. Acceptance probability < 30% based on current profile."
				programs={reach}
				variant="reach"
				userProfile={userProfile}
				onSaveToggle={onSaveToggle}
				onProgramClick={onProgramClick}
				selectedPrograms={selectedPrograms}
				onToggleSelection={onToggleSelection}
				isMaxReached={isMaxReached}
				onAddToDashboard={onAddToDashboard}
			/>
			<CategoryContainer
				title="Target Programs"
				description="Balanced options. Acceptance probability > 50%."
				programs={target}
				variant="target"
				userProfile={userProfile}
				onSaveToggle={onSaveToggle}
				onProgramClick={onProgramClick}
				selectedPrograms={selectedPrograms}
				onToggleSelection={onToggleSelection}
				isMaxReached={isMaxReached}
				onAddToDashboard={onAddToDashboard}
			/>
			<CategoryContainer
				title="Safety Programs"
				description="Solid programs where you exceed the typical admission requirements."
				programs={safety}
				variant="safety"
				userProfile={userProfile}
				onSaveToggle={onSaveToggle}
				onProgramClick={onProgramClick}
				selectedPrograms={selectedPrograms}
				onToggleSelection={onToggleSelection}
				isMaxReached={isMaxReached}
				onAddToDashboard={onAddToDashboard}
			/>
		</div>
	);
}

/**
 * Tab-based Layout - AI Match Mode with Easy Navigation
 * Only 3 categories: Target, Reach, Safety (no Unknown)
 */
export function TabBasedCategories({
	programs,
	userProfile,
	onSaveToggle,
	onProgramClick,
	selectedPrograms,
	onToggleSelection,
	isMaxReached,
	onAddToDashboard,
	isProgramInDashboard,
	onManageApplication,
	addingProgramId,
}: {
	programs: ProgramListItemResponse[];
	userProfile?: UserContextResponse | null;
	onSaveToggle?: (id: string) => void;
	onProgramClick?: (program: ProgramListItemResponse) => void;
	selectedPrograms?: Set<string>;
	onToggleSelection?: (id: string) => void;
	isMaxReached?: boolean;
	onAddToDashboard?: (id: string) => void;
	isProgramInDashboard?: (id: string) => boolean;
	onManageApplication?: (id: string) => void;
	addingProgramId?: string | null;
}) {
	const reach = programs.filter((p) => p.fitCategory === "reach");
	const target = programs.filter((p) => p.fitCategory === "target");
	const safety = programs.filter((p) => p.fitCategory === "safety");

	const categories = [
		{
			id: "target",
			title: "Target Programs",
			description: "Balanced options. Acceptance probability > 50%.",
			programs: target,
			icon: <Sparkles className="w-4 h-4" />,
			badge: "Optimal",
			color: "text-green-700 dark:text-green-300",
			bgColor: "bg-green-50 dark:bg-green-950/20",
			tabActiveColor:
				"data-[state=active]:bg-green-500 data-[state=active]:text-white",
			tabHoverColor: "hover:bg-green-50 dark:hover:bg-green-950/30",
		},
		{
			id: "reach",
			title: "Reach Programs",
			description:
				"High reward options. Acceptance probability < 30% based on current profile.",
			programs: reach,
			icon: <Target className="w-4 h-4" />,
			badge: "High Risk",
			color: "text-blue-700 dark:text-blue-300",
			bgColor: "bg-blue-50 dark:bg-blue-950/20",
			tabActiveColor:
				"data-[state=active]:bg-blue-500 data-[state=active]:text-white",
			tabHoverColor: "hover:bg-blue-50 dark:hover:bg-blue-950/30",
		},
		{
			id: "safety",
			title: "Safety Programs",
			description:
				"Solid programs where you exceed the typical admission requirements.",
			programs: safety,
			icon: <ShieldCheck className="w-4 h-4" />,
			badge: "Safe",
			color: "text-gray-700 dark:text-gray-300",
			bgColor: "bg-gray-50 dark:bg-gray-900/40",
			tabActiveColor:
				"data-[state=active]:bg-gray-500 data-[state=active]:text-white",
			tabHoverColor: "hover:bg-gray-50 dark:hover:bg-gray-900/30",
		},
	];

	const defaultTab =
		target.length > 0 ? "target" : reach.length > 0 ? "reach" : "safety";

	return (
		<Tabs defaultValue={defaultTab} className="w-full">
			{/* Tab Navigation - Always 3 columns */}
			<TabsList className="grid w-full h-auto p-1 bg-muted rounded-lg mb-4 grid-cols-3">
				{categories.map((category) => (
					<TabsTrigger
						key={category.id}
						value={category.id}
						className={`flex flex-col items-center gap-1.5 py-3 px-4 rounded-md transition-all ${category.tabActiveColor} ${category.tabHoverColor}`}
					>
						<div className="flex items-center gap-2">
							{category.icon}
							<span className="font-semibold text-sm">{category.title}</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-xs opacity-80">{category.badge}</span>
							<span className="text-xs font-bold px-2 py-0.5 rounded-full bg-background/50">
								{category.programs.length}
							</span>
						</div>
					</TabsTrigger>
				))}
			</TabsList>

			{/* Tab Content */}
			{categories.map((category) => (
				<TabsContent key={category.id} value={category.id} className="mt-0">
					<div className={`rounded-xl border p-4 ${category.bgColor}`}>
						{/* Category Header */}
						<div className="mb-4">
							<div className="flex items-center gap-2 mb-1">
								<h3 className={`text-lg font-bold ${category.color}`}>
									{category.title}
								</h3>
								<span
									className={`px-2.5 py-1 rounded-full text-xs font-semibold bg-background/80 ${category.color}`}
								>
									{category.programs.length} programs
								</span>
							</div>
							<p className="text-sm text-muted-foreground">
								{category.description}
							</p>
						</div>

						{/* Programs Grid */}
						{category.programs.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
								{category.programs.map((program) => (
									<ProgramCard
										key={program.id}
										program={program}
										userProfile={userProfile}
										onSaveToggle={onSaveToggle}
										onClick={onProgramClick}
										isSelected={selectedPrograms?.has(program.id || "")}
										onToggleSelection={onToggleSelection}
										isMaxReached={isMaxReached}
										onAddToDashboard={onAddToDashboard}
										isInDashboard={
											program.id ? isProgramInDashboard?.(program.id) : false
										}
										isAdding={addingProgramId === program.id}
										onManage={onManageApplication}
									/>
								))}
							</div>
						) : (
							<div className="py-12 text-center">
								<div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
									{category.icon}
								</div>
								<p className="text-sm text-muted-foreground">
									No programs found in this category.
								</p>
							</div>
						)}
					</div>
				</TabsContent>
			))}
		</Tabs>
	);
}
