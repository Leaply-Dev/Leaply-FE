"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { analytics } from "@/lib/analytics/analytics";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	essayTrackRequiresPillar2,
	totalSectionsFor,
} from "@/lib/config/intakeConfig";
import {
	getGetIntakeQueryKey,
	useGetIntake,
	useSaveIntake,
	useSaveSection,
} from "@/lib/generated/api/endpoints/persona-lab-intake/persona-lab-intake";
import type { PersonaIntakeResponse } from "@/lib/generated/api/models";
import {
	type IntakeSection,
	usePersonaIntakeStore,
} from "@/lib/store/personaIntakeStore";
import { useUserStore } from "@/lib/store/userStore";
import { IntakeProgress } from "./IntakeProgress";
import { isSectionImpactValid, SectionImpact } from "./SectionImpact";
import { isSectionScopeValid, SectionScope } from "./SectionScope";
import { isSectionTrackValid, SectionTrack } from "./SectionTrack";

interface IntakeFormClientProps {
	/** If true, don't redirect to persona-lab chat on completion (edit mode) */
	editMode?: boolean;
}

export function IntakeFormClient({ editMode = false }: IntakeFormClientProps) {
	const router = useRouter();
	const locale = useLocale() as "vi" | "en";
	const t = useTranslations("personaLab.intake");
	const queryClient = useQueryClient();
	const { preferences } = useUserStore();
	const primaryTargetField = (
		preferences as { targetFields?: string[] } | undefined
	)?.targetFields?.[0];

	const {
		draft,
		setDraft,
		replaceDraft,
		currentSection,
		setCurrentSection,
		autosaveStatus,
		setAutosaveStatus,
		markSaved,
		resetDraft,
	} = usePersonaIntakeStore();

	const { data: intakeData, isLoading: isLoadingIntake } = useGetIntake();
	const intake = intakeData
		? unwrapResponse<PersonaIntakeResponse>(intakeData)
		: null;

	const saveSectionMutation = useSaveSection({
		mutation: {
			onSuccess: () => {
				markSaved();
				queryClient.invalidateQueries({ queryKey: getGetIntakeQueryKey() });
			},
			onError: () => setAutosaveStatus("error"),
		},
	});
	const saveIntakeMutation = useSaveIntake({
		mutation: {
			onSuccess: () => {
				markSaved();
				queryClient.invalidateQueries({ queryKey: getGetIntakeQueryKey() });
			},
			onError: () => setAutosaveStatus("error"),
		},
	});

	const [hasSyncedFromServer, setHasSyncedFromServer] = useState(false);

	useEffect(() => {
		if (hasSyncedFromServer || isLoadingIntake) return;
		if (intake) {
			replaceDraft({
				subField: intake.subField,
				subFieldOther: intake.subFieldOther,
				roleType: intake.roleType as never,
				roleTypeOther: intake.roleTypeOther,
				timeline: intake.timeline as never,
				essayTrack: intake.essayTrack as never,
				impactAreas: intake.impactAreas,
				impactAreaOther: intake.impactAreaOther,
				socialAspect: intake.socialAspect as never,
				socialAspectOther: intake.socialAspectOther,
				priorExposure: intake.priorExposure as never,
			});
			const resumeSection = Math.min(
				Math.max((intake.lastSectionSaved ?? 0) + 1, 1),
				3,
			) as IntakeSection;
			setCurrentSection(resumeSection);
		}
		setHasSyncedFromServer(true);
	}, [
		hasSyncedFromServer,
		intake,
		isLoadingIntake,
		replaceDraft,
		setCurrentSection,
	]);

	const totalSections = totalSectionsFor(draft.essayTrack);
	const isPillar2 = essayTrackRequiresPillar2(draft.essayTrack);

	const sectionLabels = useMemo(() => {
		const labels = [t("step.scope"), t("step.track")];
		if (isPillar2) labels.push(t("step.impact"));
		return labels;
	}, [isPillar2, t]);

	const isCurrentSectionValid = useMemo(() => {
		if (currentSection === 1) return isSectionScopeValid(draft);
		if (currentSection === 2) return isSectionTrackValid(draft);
		return isSectionImpactValid(draft);
	}, [currentSection, draft]);

	const handleNext = async () => {
		if (!isCurrentSectionValid) return;
		setAutosaveStatus("saving");
		try {
			await saveSectionMutation.mutateAsync({
				section: currentSection,
				data: draft,
			});
		} catch {
			return;
		}
		analytics.track("persona_lab_intake_step_completed", {
			step: currentSection,
			step_name: ["scope", "track", "impact"][currentSection - 1],
		});
		const isLast = currentSection >= totalSections;
		if (isLast) {
			setAutosaveStatus("saving");
			try {
				await saveIntakeMutation.mutateAsync({ data: draft });
			} catch {
				return;
			}
			analytics.track("persona_lab_intake_completed", {
				total_steps: totalSections,
			});
			if (editMode) {
				router.push("/persona-lab");
			} else {
				resetDraft();
				router.push("/persona-lab");
			}
			return;
		}
		setCurrentSection((currentSection + 1) as IntakeSection);
	};

	const handleBack = () => {
		if (currentSection === 1) {
			router.back();
			return;
		}
		setCurrentSection((currentSection - 1) as IntakeSection);
	};

	if (isLoadingIntake && !hasSyncedFromServer) {
		return (
			<div className="max-w-2xl mx-auto py-12 space-y-6">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
				<p className="text-muted-foreground">{t("subtitle")}</p>
			</div>

			<IntakeProgress
				currentSection={currentSection}
				totalSections={totalSections}
				labels={sectionLabels}
			/>

			<div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
				<div className="mb-6">
					<h2 className="text-xl font-semibold">
						{sectionLabels[currentSection - 1]}
					</h2>
					<p className="text-sm text-muted-foreground mt-1">
						{t(`sectionHint.${currentSection}`)}
					</p>
				</div>

				{currentSection === 1 && (
					<SectionScope
						draft={draft}
						onChange={setDraft}
						primaryTargetField={primaryTargetField}
						locale={locale}
					/>
				)}
				{currentSection === 2 && (
					<SectionTrack draft={draft} onChange={setDraft} locale={locale} />
				)}
				{currentSection === 3 && (
					<SectionImpact draft={draft} onChange={setDraft} locale={locale} />
				)}

				<div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
					<Button variant="outline" onClick={handleBack}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						{t("back")}
					</Button>

					<div className="text-xs text-muted-foreground min-h-[1.25rem]">
						{autosaveStatus === "saving" && (
							<span className="flex items-center gap-1">
								<Loader2 className="w-3 h-3 animate-spin" />{" "}
								{t("autosave.saving")}
							</span>
						)}
						{autosaveStatus === "saved" && (
							<span className="flex items-center gap-1 text-emerald-600">
								<Check className="w-3 h-3" /> {t("autosave.saved")}
							</span>
						)}
						{autosaveStatus === "error" && (
							<span className="text-destructive">{t("autosave.error")}</span>
						)}
					</div>

					<Button
						onClick={handleNext}
						disabled={
							!isCurrentSectionValid ||
							saveSectionMutation.isPending ||
							saveIntakeMutation.isPending
						}
					>
						{currentSection >= totalSections ? t("finish") : t("next")}
						<ArrowRight className="w-4 h-4 ml-2" />
					</Button>
				</div>
			</div>
		</div>
	);
}
