import { useState } from "react";
import {
	Calendar,
	ChevronDown,
	DollarSign,
	GraduationCap,
	Sparkles,
} from "lucide-react";

/**
 * Horizontal Filter Bar with Chips
 */
export function HorizontalFilterBar() {
	const [isExpanded, setIsExpanded] = useState(false);
	const [activeFilters, setActiveFilters] = useState<string[]>([]);

	const toggleFilter = (filter: string) => {
		setActiveFilters((prev) =>
			prev.includes(filter)
				? prev.filter((f) => f !== filter)
				: [...prev, filter],
		);
	};

	const filters = [
		{ id: "budget", label: "Within Budget", icon: DollarSign },
		{ id: "testscore", label: "Meet Test Req.", icon: GraduationCap },
		{ id: "deadline", label: "Deadline > 60 days", icon: Calendar },
		{ id: "scholarship", label: "Scholarship Available", icon: Sparkles },
	];

	return (
		<div className="bg-card border border-border rounded-xl p-4">
			{/* Quick Filter Chips Row */}
			<div className="flex items-center gap-3 flex-wrap">
				{filters.map((filter) => {
					const Icon = filter.icon;
					const isActive = activeFilters.includes(filter.id);
					return (
						<button
							key={filter.id}
							type="button"
							onClick={() => toggleFilter(filter.id)}
							className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
								isActive
									? "bg-primary text-primary-foreground border-primary"
									: "bg-muted/50 hover:bg-muted border-border text-foreground"
							}`}
						>
							<Icon className="w-4 h-4" />
							<span className="text-sm font-medium">{filter.label}</span>
						</button>
					);
				})}

				{/* Expand Button */}
				<button
					type="button"
					onClick={() => setIsExpanded(!isExpanded)}
					className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-full transition-colors"
				>
					<span>{isExpanded ? "Less" : "More"} Filters</span>
					<ChevronDown
						className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
					/>
				</button>
			</div>

			{/* Expanded Filter Options */}
			{isExpanded && (
				<div className="mt-4 pt-4 border-t border-border">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{/* Field of Study */}
						<div className="space-y-2">
							<span className="text-sm font-medium text-muted-foreground">
								Field of Study
							</span>
							<select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground">
								<option value="">All Fields</option>
								<option value="cs">Computer Science</option>
								<option value="ds">Data Science</option>
								<option value="ai">Artificial Intelligence</option>
							</select>
						</div>

						{/* Region */}
						<div className="space-y-2">
							<span className="text-sm font-medium text-muted-foreground">
								Region
							</span>
							<select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground">
								<option value="">All Regions</option>
								<option value="na">North America</option>
								<option value="eu">Europe</option>
								<option value="asia">Asia Pacific</option>
							</select>
						</div>

						{/* Tuition Range */}
						<div className="space-y-2">
							<span className="text-sm font-medium text-muted-foreground">
								Tuition Range
							</span>
							<select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground">
								<option value="">Any Budget</option>
								<option value="30000">Under $30,000</option>
								<option value="50000">Under $50,000</option>
								<option value="70000">Under $70,000</option>
							</select>
						</div>

						{/* Duration */}
						<div className="space-y-2">
							<span className="text-sm font-medium text-muted-foreground">
								Duration
							</span>
							<select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground">
								<option value="">Any Duration</option>
								<option value="12">1 Year</option>
								<option value="18">18 Months</option>
								<option value="24">2 Years</option>
							</select>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
