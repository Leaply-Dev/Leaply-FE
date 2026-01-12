"use client";

import { ArrowRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProgramListItemResponse } from "@/lib/generated/api/models";

interface SelectedProgramChipProps {
	program: ProgramListItemResponse;
	onRemove: () => void;
}

/**
 * Individual chip for a selected program in the compare tray
 */
export function SelectedProgramChip({
	program,
	onRemove,
}: SelectedProgramChipProps) {
	return (
		<Badge variant="secondary" className="gap-2 pr-1 text-sm py-1.5 px-3">
			<span className="font-medium">{program.universityName}</span>
			<button
				type="button"
				onClick={onRemove}
				className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
				aria-label="Remove"
			>
				<X className="w-3.5 h-3.5" />
			</button>
		</Badge>
	);
}

interface CompareTrayProps {
	selectedCount: number;
	maxPrograms: number;
	selectedProgramsList: (ProgramListItemResponse | undefined)[];
	onRemoveProgram: (id: string) => void;
	onClearAll: () => void;
	onCompare: () => void;
}

/**
 * Sticky bottom tray showing selected programs for comparison (checkout-style)
 */
export function CompareTray({
	selectedCount,
	maxPrograms,
	selectedProgramsList,
	onRemoveProgram,
	onClearAll,
	onCompare,
}: CompareTrayProps) {
	if (selectedCount === 0) {
		return null;
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-card via-card to-card/95 border-t-2 border-primary shadow-2xl z-50 backdrop-blur-sm">
			<div className="max-w-7xl mx-auto px-6 py-5">
				<div className="flex items-center justify-between gap-6">
					{/* Left: Title + Selected Programs */}
					<div className="flex-1 space-y-3">
						{/* Title */}
						<div className="flex items-center gap-2">
							<h3 className="text-lg font-bold text-foreground">
								So sánh chương trình
							</h3>
							<Badge variant="secondary" className="font-semibold">
								{selectedCount}/{maxPrograms}
							</Badge>
						</div>

						{/* Selected programs chips */}
						<div className="flex items-center gap-3 flex-wrap">
							<div className="flex items-center gap-2 flex-wrap">
								{selectedProgramsList.map(
									(program) =>
										program && (
											<SelectedProgramChip
												key={program.id}
												program={program}
												onRemove={() => onRemoveProgram(program.id ?? "")}
											/>
										),
								)}
								{selectedCount > 3 && (
									<Badge variant="outline" className="font-medium">
										+{selectedCount - 3} chương trình
									</Badge>
								)}
							</div>

							{/* Clear all button */}
							<button
								type="button"
								onClick={onClearAll}
								className="text-sm text-muted-foreground hover:text-destructive transition-colors font-medium underline underline-offset-2"
							>
								Xóa tất cả
							</button>
						</div>
					</div>

					{/* Right: CTA Button */}
					<div className="shrink-0">
						<Button
							size="lg"
							className="gap-2 px-8 py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
							onClick={onCompare}
						>
							So sánh ngay
							<ArrowRight className="w-5 h-5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
