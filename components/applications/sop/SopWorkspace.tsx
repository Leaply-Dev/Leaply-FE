"use client";

import { FileEdit, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { analytics } from "@/lib/analytics/analytics";
import { useWorkspaceStatus } from "@/lib/api/sop-workspace";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import { useGetIntake } from "@/lib/generated/api/endpoints/persona-lab-intake/persona-lab-intake";
import type { PersonaIntakeResponse } from "@/lib/generated/api/models";
import { WritingWorkspace } from "./WritingWorkspace";

type UIPhase = "writing" | "completed";

const PHASE_ORDER: Record<UIPhase, number> = {
	writing: 0,
	completed: 1,
};

interface SopWorkspaceProps {
	applicationId: string;
}

export function SopWorkspace({ applicationId }: SopWorkspaceProps) {
	const t = useTranslations("sop");
	const {
		data: status,
		isLoading,
		error,
		refetch,
	} = useWorkspaceStatus(applicationId);
	const [currentPhase, setCurrentPhase] = useState<UIPhase>("writing");

	const { data: intakeData, isLoading: isLoadingIntake } = useGetIntake();
	const intake = intakeData
		? unwrapResponse<PersonaIntakeResponse>(intakeData)
		: null;
	const intakeComplete = intake?.complete === true;

	// Sync phase from server — never regress below what the user has already reached locally.
	useEffect(() => {
		if (!status) return;
		const phase = status.sopPhase;

		const serverPhase: UIPhase =
			phase === "completed" ? "completed" : "writing";

		setCurrentPhase((prev) =>
			PHASE_ORDER[serverPhase] > PHASE_ORDER[prev] ? serverPhase : prev,
		);
	}, [status]);

	if (isLoading || isLoadingIntake) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="space-y-3 w-full max-w-xl">
					<Skeleton className="h-8 w-48 mx-auto rounded-lg" />
					<Skeleton className="h-[80px] w-full rounded-md" />
					<Skeleton className="h-11 w-full rounded-md" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center p-8">
				<p className="text-muted-foreground mb-4">{t("loadError")}</p>
				<Button onClick={() => refetch()}>{t("retry")}</Button>
			</div>
		);
	}

	// Persona Lab not complete → block with a gate before ANY phase.
	if (!intakeComplete) {
		return (
			<div className="flex items-center justify-center h-full">
				<Card className="max-w-md w-full">
					<CardHeader className="text-center pb-4">
						<div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
							<Sparkles className="w-6 h-6 text-amber-500" />
						</div>
						<CardTitle className="text-lg">{t("personaLabRequired")}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-center">
						<p className="text-sm text-muted-foreground">
							{t("personaLabRequiredDesc")}
						</p>
						<Button asChild className="w-full">
							<Link href="/persona-lab/intake">{t("goToPersonaLab")}</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (currentPhase === "writing") {
		return (
			<WritingWorkspace
				applicationId={applicationId}
				onComplete={() => {
					analytics.track("sop_completed", {
						application_id: applicationId,
					});
					setCurrentPhase("completed");
				}}
				sopPrompt={status?.sopPrompt}
			/>
		);
	}

	if (currentPhase === "completed") {
		return <CompletedState onEdit={() => setCurrentPhase("writing")} />;
	}

	return null;
}

interface CompletedStateProps {
	onEdit: () => void;
}

function CompletedState({ onEdit }: CompletedStateProps) {
	const t = useTranslations("sop");
	return (
		<Card className="max-w-xl mx-auto">
			<CardHeader className="text-center">
				<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<Sparkles className="w-8 h-8 text-green-600" />
				</div>
				<CardTitle className="text-green-700">{t("completed")}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6 text-center">
				<p className="text-muted-foreground">{t("completedDesc")}</p>

				<div className="flex justify-center gap-3">
					<Button variant="outline" onClick={onEdit}>
						<FileEdit className="w-4 h-4 mr-2" />
						{t("edit")}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
