"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { analytics } from "@/lib/analytics/analytics";
import {
	getAppsProfilingApiPersonaQuestionsQueryKey,
	useAppsProfilingApiPersonaQuestions,
	useAppsProfilingApiSavePersona,
} from "@/lib/generated/api/endpoints/onboarding/onboarding";
import type { PersonaQuestionnaireRequest } from "@/lib/generated/api/models";
import { cn } from "@/lib/utils";

type Answers = Record<string, string | string[]>;

function buildRequest(answers: Answers): PersonaQuestionnaireRequest {
	const s = (key: string) => {
		const value = answers[key];
		return typeof value === "string" && value.trim().length > 0 ? value : null;
	};
	const a = (key: string) => {
		const value = answers[key];
		return Array.isArray(value) ? value : [];
	};
	return {
		career_intent: s("career_intent"),
		top_values: a("top_values"),
		risk_tolerance: s("risk_tolerance"),
		independence_level: s("independence_level"),
		learning_style: s("learning_style"),
		constraints: a("constraints"),
		non_negotiables: s("non_negotiables") ?? "",
		motivations: s("motivations") ?? "",
		fears_concerns: s("fears_concerns") ?? "",
	};
}

export function PersonaLabsClient() {
	const t = useTranslations("personaLabs.form");
	const queryClient = useQueryClient();
	const { data: response, isLoading } = useAppsProfilingApiPersonaQuestions();
	const save = useAppsProfilingApiSavePersona();
	const [answers, setAnswers] = useState<Answers>({});
	const [formError, setFormError] = useState<string | null>(null);
	const [saved, setSaved] = useState(false);

	const questions = response?.data?.data?.questions ?? [];
	const allAnswered = questions.every((question) => {
		const value = answers[question.key];
		return question.type === "multi"
			? Array.isArray(value) && value.length > 0
			: typeof value === "string" && value.trim().length > 0;
	});

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFormError(null);
		setSaved(false);
		if (!allAnswered) {
			setFormError(t("error"));
			return;
		}
		try {
			await save.mutateAsync({ data: buildRequest(answers) });
			analytics.track("persona_saved", { is_complete: true });
			setAnswers({});
			setSaved(true);
			await queryClient.invalidateQueries({
				queryKey: getAppsProfilingApiPersonaQuestionsQueryKey(),
			});
		} catch {
			setFormError(t("error"));
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-full max-w-md" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
			</div>
		);
	}

	return (
		<Card>
			<CardContent className="p-6 space-y-6">
				<p className="text-sm text-muted-foreground">{t("requiredHint")}</p>

				{saved && (
					<Alert>
						<CheckCircle2 className="h-4 w-4" />
						<AlertTitle>{t("saved")}</AlertTitle>
					</Alert>
				)}

				{formError && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{formError}</AlertDescription>
					</Alert>
				)}

				<form onSubmit={handleSubmit} className="space-y-8">
					{questions.map((question) => (
						<div key={question.key} className="space-y-3">
							<Label className="text-base font-medium">{question.label}</Label>

							{question.type === "single" && (
								<div className="grid gap-2">
									{question.options?.map((option) => (
										<label
											key={option.value}
											className={cn(
												"flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors hover:bg-accent",
												answers[question.key] === option.value &&
													"border-primary bg-primary/5",
											)}
										>
											<input
												type="radio"
												name={question.key}
												value={option.value}
												checked={answers[question.key] === option.value}
												onChange={() =>
													setAnswers((prev) => ({
														...prev,
														[question.key]: option.value,
													}))
												}
												className="size-4 accent-primary"
											/>
											<span className="text-sm">{option.label}</span>
										</label>
									))}
								</div>
							)}

							{question.type === "multi" && (
								<div className="grid gap-2">
									{question.options?.map((option) => {
										const checkboxId = `${question.key}-${option.value}`;
										const selected = (
											(answers[question.key] as string[]) ?? []
										).includes(option.value);
										return (
											<label
												htmlFor={checkboxId}
												key={option.value}
												className={cn(
													"flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors hover:bg-accent",
													selected && "border-primary bg-primary/5",
												)}
											>
												<Checkbox
													id={checkboxId}
													checked={selected}
													onCheckedChange={(checked) =>
														setAnswers((prev) => {
															const current =
																(prev[question.key] as string[]) ?? [];
															const next =
																checked === true
																	? [...current, option.value]
																	: current.filter((v) => v !== option.value);
															return { ...prev, [question.key]: next };
														})
													}
												/>
												<span className="text-sm">{option.label}</span>
											</label>
										);
									})}
								</div>
							)}

							{question.type === "text" && (
								<Textarea
									value={(answers[question.key] as string) ?? ""}
									onChange={(event) =>
										setAnswers((prev) => ({
											...prev,
											[question.key]: event.target.value,
										}))
									}
									rows={4}
								/>
							)}
						</div>
					))}

					<Button
						type="submit"
						disabled={save.isPending || !allAnswered}
						className="w-full sm:w-auto"
					>
						{save.isPending ? t("saving") : t("submit")}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
