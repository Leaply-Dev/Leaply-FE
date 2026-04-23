"use client";

import { ArrowRight, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScholarshipListItemResponse } from "@/lib/generated/api/models";
import type { Locale } from "@/lib/utils/displayFormatters";
import { formatCoverageTypeI18n } from "@/lib/utils/displayFormatters";

interface SelectedScholarshipChipProps {
	scholarship: ScholarshipListItemResponse;
	onRemove: () => void;
}

function SelectedScholarshipChip({
	scholarship,
	onRemove,
}: SelectedScholarshipChipProps) {
	const locale = useLocale() as Locale;
	return (
		<Badge variant="secondary" className="gap-2 pr-1 text-sm py-1.5 px-3">
			<span className="font-medium">
				{scholarship.name}
				{scholarship.coverageType && (
					<span className="text-muted-foreground ml-1">
						({formatCoverageTypeI18n(scholarship.coverageType, locale)})
					</span>
				)}
			</span>
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

interface ScholarshipCompareTrayProps {
	selectedCount: number;
	maxScholarships: number;
	selectedScholarshipsList: (ScholarshipListItemResponse | undefined)[];
	onRemoveScholarship: (id: string) => void;
	onClearAll: () => void;
	onCompare: () => void;
}

export function ScholarshipCompareTray({
	selectedCount,
	maxScholarships,
	selectedScholarshipsList,
	onRemoveScholarship,
	onClearAll,
	onCompare,
}: ScholarshipCompareTrayProps) {
	const t = useTranslations("compare");

	if (selectedCount === 0) {
		return null;
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-card via-card to-card/95 border-t-2 border-primary shadow-2xl z-50 backdrop-blur-sm">
			<div className="max-w-7xl mx-auto px-6 py-5">
				<div className="flex items-center justify-between gap-6">
					{/* Left: Title + Selected Scholarships */}
					<div className="flex-1 space-y-3">
						<div className="flex items-center gap-2">
							<h3 className="text-lg font-bold text-foreground">
								{t("compareScholarships")}
							</h3>
							<Badge variant="secondary" className="font-semibold">
								{selectedCount}/{maxScholarships}
							</Badge>
						</div>

						<div className="flex items-center gap-3 flex-wrap">
							<div className="flex items-center gap-2 flex-wrap">
								{selectedScholarshipsList.map((scholarship) => {
									if (!scholarship) return null;
									return (
										<SelectedScholarshipChip
											key={scholarship.id}
											scholarship={scholarship}
											onRemove={() => onRemoveScholarship(scholarship.id ?? "")}
										/>
									);
								})}
							</div>

							<button
								type="button"
								onClick={onClearAll}
								className="text-sm text-muted-foreground hover:text-destructive transition-colors font-medium underline underline-offset-2"
							>
								{t("clearAll")}
							</button>
						</div>
					</div>

					{/* Right: CTA Button */}
					<div className="shrink-0">
						<Button
							size="lg"
							disabled={selectedCount < 2}
							className={`gap-2 px-8 py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all ${
								selectedCount < 2
									? "opacity-50 cursor-not-allowed"
									: "hover:scale-105"
							}`}
							onClick={onCompare}
						>
							{t("compareNow")}
							<ArrowRight className="w-5 h-5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
