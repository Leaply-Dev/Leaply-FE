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
	getSubFieldOptions,
	ROLE_TYPE_OPTIONS,
	TIMELINE_OPTIONS,
} from "@/lib/config/intakeConfig";
import type { IntakeDraft } from "@/lib/store/personaIntakeStore";

interface SectionScopeProps {
	draft: IntakeDraft;
	onChange: (updates: Partial<IntakeDraft>) => void;
	/** Primary target field key from onboarding (e.g. "cs_it"), may be undefined */
	primaryTargetField: string | undefined;
	locale: "vi" | "en";
}

export function SectionScope({
	draft,
	onChange,
	primaryTargetField,
	locale,
}: SectionScopeProps) {
	const t = useTranslations("personaLab.intake.sectionScope");
	const subFieldOptions = getSubFieldOptions(primaryTargetField);
	const showSubFieldDropdown = subFieldOptions.length > 0;
	const subFieldIsOther = draft.subField === "other";

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label className="text-sm font-medium">{t("subFieldLabel")}</Label>
				<p className="text-xs text-muted-foreground">{t("subFieldHelp")}</p>
				{showSubFieldDropdown ? (
					<Select
						value={draft.subField ?? ""}
						onValueChange={(v) =>
							onChange({
								subField: v,
								subFieldOther: v === "other" ? draft.subFieldOther : undefined,
							})
						}
					>
						<SelectTrigger>
							<SelectValue placeholder={t("subFieldPlaceholder")} />
						</SelectTrigger>
						<SelectContent>
							{subFieldOptions.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{locale === "vi" ? opt.labelVi : opt.labelEn}
								</SelectItem>
							))}
							<SelectItem value="other">{t("other")}</SelectItem>
						</SelectContent>
					</Select>
				) : (
					<Input
						value={draft.subField ?? ""}
						onChange={(e) => onChange({ subField: e.target.value })}
						placeholder={t("subFieldFreeTextPlaceholder")}
						maxLength={100}
					/>
				)}
				{showSubFieldDropdown && subFieldIsOther && (
					<Input
						value={draft.subFieldOther ?? ""}
						onChange={(e) => onChange({ subFieldOther: e.target.value })}
						placeholder={t("subFieldOtherPlaceholder")}
						maxLength={255}
					/>
				)}
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-medium">{t("roleTypeLabel")}</Label>
				<p className="text-xs text-muted-foreground">{t("roleTypeHelp")}</p>
				<Select
					value={draft.roleType ?? ""}
					onValueChange={(v) =>
						onChange({
							roleType: v as IntakeDraft["roleType"],
							roleTypeOther: v === "other" ? draft.roleTypeOther : undefined,
						})
					}
				>
					<SelectTrigger>
						<SelectValue placeholder={t("roleTypePlaceholder")} />
					</SelectTrigger>
					<SelectContent>
						{ROLE_TYPE_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{locale === "vi" ? opt.labelVi : opt.labelEn}
							</SelectItem>
						))}
						<SelectItem value="other">{t("other")}</SelectItem>
					</SelectContent>
				</Select>
				{draft.roleType === "other" && (
					<Input
						value={draft.roleTypeOther ?? ""}
						onChange={(e) => onChange({ roleTypeOther: e.target.value })}
						placeholder={t("roleTypeOtherPlaceholder")}
						maxLength={255}
					/>
				)}
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-medium">{t("timelineLabel")}</Label>
				<p className="text-xs text-muted-foreground">{t("timelineHelp")}</p>
				<Select
					value={draft.timeline ?? ""}
					onValueChange={(v) =>
						onChange({ timeline: v as IntakeDraft["timeline"] })
					}
				>
					<SelectTrigger>
						<SelectValue placeholder={t("timelinePlaceholder")} />
					</SelectTrigger>
					<SelectContent>
						{TIMELINE_OPTIONS.map((opt) => (
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

export function isSectionScopeValid(draft: IntakeDraft): boolean {
	if (!draft.subField || draft.subField.trim() === "") return false;
	if (draft.subField === "other" && !draft.subFieldOther?.trim()) return false;
	if (!draft.roleType) return false;
	if (draft.roleType === "other" && !draft.roleTypeOther?.trim()) return false;
	if (!draft.timeline) return false;
	return true;
}
