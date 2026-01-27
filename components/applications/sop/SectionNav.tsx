"use client";

import { Check, Circle, Loader2 } from "lucide-react";
import type { SectionResponse } from "@/lib/api/sop-workspace";
import { cn } from "@/lib/utils";

interface SectionNavProps {
	sections: SectionResponse[];
	currentIndex: number;
	onSelect: (index: number) => void;
}

export function SectionNav({
	sections,
	currentIndex,
	onSelect,
}: SectionNavProps) {
	return (
		<nav className="space-y-1">
			<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
				Sections
			</p>

			{sections.map((section, index) => {
				const isCurrent = index === currentIndex;
				const isDone = section.status === "done";
				const hasContent = section.wordCount > 0;

				return (
					<button
						key={section.id}
						type="button"
						onClick={() => onSelect(index)}
						className={cn(
							"w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
							isCurrent
								? "bg-primary/10 text-primary"
								: "hover:bg-muted text-foreground",
						)}
					>
						{/* Status icon */}
						<div
							className={cn(
								"w-5 h-5 rounded-full flex items-center justify-center shrink-0",
								isDone && "bg-green-500 text-white",
								!isDone && hasContent && "bg-amber-500 text-white",
								!isDone && !hasContent && "border-2 border-muted-foreground/30",
							)}
						>
							{isDone ? (
								<Check className="w-3 h-3" />
							) : hasContent ? (
								<Loader2 className="w-3 h-3" />
							) : (
								<Circle className="w-2 h-2 text-muted-foreground/30" />
							)}
						</div>

						{/* Section info */}
						<div className="flex-1 min-w-0">
							<p
								className={cn(
									"text-sm font-medium truncate",
									isCurrent ? "text-primary" : "text-foreground",
								)}
							>
								{section.title || `Section ${index + 1}`}
							</p>
							<p className="text-xs text-muted-foreground">
								{section.wordCount}
								{section.wordTarget && (
									<span>
										/{section.wordTarget.min}-{section.wordTarget.max}
									</span>
								)}{" "}
								từ
							</p>
						</div>
					</button>
				);
			})}
		</nav>
	);
}
