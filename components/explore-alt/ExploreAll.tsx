import type { ProgramListItemResponse } from "@/lib/api/types";
import { ProgramCard } from "./ProgramCard";

/**
 * Grid Layout - Explore All Mode
 */
export function ProgramGrid({
	programs,
	onSaveToggle,
}: {
	programs: ProgramListItemResponse[];
	onSaveToggle?: (id: string) => void;
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{programs.map((program) => (
				<ProgramCard
					key={program.id}
					program={program}
					onSaveToggle={onSaveToggle}
				/>
			))}
		</div>
	);
}
