import { ShieldCheck, Sparkles, Target } from "lucide-react";
import { ProgramCard } from "@/components/explore/ProgramCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
	ProgramListItemResponse,
	UserContextResponse,
} from "@/lib/generated/api/models";

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
