"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { ESSAY_TRACK_OPTIONS } from "@/lib/config/intakeConfig";
import type { IntakeDraft } from "@/lib/store/personaIntakeStore";
import { cn } from "@/lib/utils";

interface SectionTrackProps {
	draft: IntakeDraft;
	onChange: (updates: Partial<IntakeDraft>) => void;
	locale: "vi" | "en";
}

export function SectionTrack({ draft, onChange, locale }: SectionTrackProps) {
	const t = useTranslations("personaLab.intake.sectionTrack");

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label className="text-sm font-medium">{t("label")}</Label>
				<p className="text-xs text-muted-foreground">{t("help")}</p>
				<div className="grid grid-cols-1 gap-3">
					{ESSAY_TRACK_OPTIONS.map((opt) => {
						const isSelected = draft.essayTrack === opt.value;
						return (
							<button
								type="button"
								key={opt.value}
								onClick={() =>
									onChange({
										essayTrack: opt.value as IntakeDraft["essayTrack"],
									})
								}
								className={cn(
									"text-left rounded-xl border p-4 transition-all hover:border-primary/60",
									isSelected
										? "border-primary ring-2 ring-primary/20 bg-primary/5"
										: "border-border",
								)}
							>
								<div className="font-medium text-sm">
									{locale === "vi" ? opt.labelVi : opt.labelEn}
								</div>
								<div className="mt-1 text-xs text-muted-foreground">
									{t(`desc.${opt.value}`)}
								</div>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export function isSectionTrackValid(draft: IntakeDraft): boolean {
	return Boolean(draft.essayTrack);
}
