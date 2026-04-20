"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	IMPACT_AREA_OPTIONS,
	MAX_IMPACT_AREAS,
	PRIOR_EXPOSURE_OPTIONS,
	SOCIAL_ASPECT_OPTIONS,
} from "@/lib/config/intakeConfig";
import type { IntakeDraft } from "@/lib/store/personaIntakeStore";
import { cn } from "@/lib/utils";

interface SectionImpactProps {
	draft: IntakeDraft;
	onChange: (updates: Partial<IntakeDraft>) => void;
	locale: "vi" | "en";
}

export function SectionImpact({ draft, onChange, locale }: SectionImpactProps) {
	const t = useTranslations("personaLab.intake.sectionImpact");
	const selectedAreas = draft.impactAreas ?? [];
	const includesOther = selectedAreas.includes("other");

	const toggleImpactArea = (value: string) => {
		const current = selectedAreas;
		if (current.includes(value)) {
			const next = current.filter((v) => v !== value);
			onChange({
				impactAreas: next,
				impactAreaOther: value === "other" ? undefined : draft.impactAreaOther,
			});
			return;
		}
		if (current.length >= MAX_IMPACT_AREAS) return;
		onChange({ impactAreas: [...current, value] });
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label className="text-sm font-medium">{t("impactAreasLabel")}</Label>
				<p className="text-xs text-muted-foreground">
					{t("impactAreasHelp", { max: MAX_IMPACT_AREAS })}
				</p>
				<div className="flex flex-wrap gap-2 pt-1">
					{IMPACT_AREA_OPTIONS.map((opt) => {
						const isSelected = selectedAreas.includes(opt.value);
						const isDisabled =
							!isSelected && selectedAreas.length >= MAX_IMPACT_AREAS;
						return (
							<button
								type="button"
								key={opt.value}
								onClick={() => toggleImpactArea(opt.value)}
								disabled={isDisabled}
								className={cn(
									"text-sm rounded-full border px-3 py-1.5 transition-colors",
									isSelected
										? "border-primary bg-primary text-primary-foreground"
										: "border-muted-foreground/30 hover:border-primary/60",
									isDisabled && "opacity-40 cursor-not-allowed",
								)}
							>
								{locale === "vi" ? opt.labelVi : opt.labelEn}
							</button>
						);
					})}
					<button
						type="button"
						onClick={() => toggleImpactArea("other")}
						disabled={
							!includesOther && selectedAreas.length >= MAX_IMPACT_AREAS
						}
						className={cn(
							"text-sm rounded-full border px-3 py-1.5 transition-colors",
							includesOther
								? "border-primary bg-primary text-primary-foreground"
								: "border-muted-foreground/30 hover:border-primary/60",
							!includesOther &&
								selectedAreas.length >= MAX_IMPACT_AREAS &&
								"opacity-40 cursor-not-allowed",
						)}
					>
						{t("other")}
					</button>
				</div>
				{includesOther && (
					<Input
						className="mt-2"
						value={draft.impactAreaOther ?? ""}
						onChange={(e) => onChange({ impactAreaOther: e.target.value })}
						placeholder={t("impactAreaOtherPlaceholder")}
						maxLength={255}
					/>
				)}
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-medium">{t("socialAspectLabel")}</Label>
				<p className="text-xs text-muted-foreground">{t("socialAspectHelp")}</p>
				<Select
					value={draft.socialAspect ?? ""}
					onValueChange={(v) =>
						onChange({
							socialAspect: v as IntakeDraft["socialAspect"],
							socialAspectOther:
								v === "other" ? draft.socialAspectOther : undefined,
						})
					}
				>
					<SelectTrigger>
						<SelectValue placeholder={t("socialAspectPlaceholder")} />
					</SelectTrigger>
					<SelectContent>
						{SOCIAL_ASPECT_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{locale === "vi" ? opt.labelVi : opt.labelEn}
							</SelectItem>
						))}
						<SelectItem value="other">{t("other")}</SelectItem>
					</SelectContent>
				</Select>
				{draft.socialAspect === "other" && (
					<Input
						value={draft.socialAspectOther ?? ""}
						onChange={(e) => onChange({ socialAspectOther: e.target.value })}
						placeholder={t("socialAspectOtherPlaceholder")}
						maxLength={255}
					/>
				)}
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-medium">{t("priorExposureLabel")}</Label>
				<p className="text-xs text-muted-foreground">
					{t("priorExposureHelp")}
				</p>
				<Select
					value={draft.priorExposure ?? ""}
					onValueChange={(v) =>
						onChange({ priorExposure: v as IntakeDraft["priorExposure"] })
					}
				>
					<SelectTrigger>
						<SelectValue placeholder={t("priorExposurePlaceholder")} />
					</SelectTrigger>
					<SelectContent>
						{PRIOR_EXPOSURE_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{locale === "vi" ? opt.labelVi : opt.labelEn}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}

export function isSectionImpactValid(draft: IntakeDraft): boolean {
	const areas = draft.impactAreas ?? [];
	if (areas.length === 0) return false;
	if (areas.includes("other") && !draft.impactAreaOther?.trim()) return false;
	if (!draft.socialAspect) return false;
	if (draft.socialAspect === "other" && !draft.socialAspectOther?.trim())
		return false;
	if (!draft.priorExposure) return false;
	return true;
}
