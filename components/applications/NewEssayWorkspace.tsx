"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
	Award,
	Building2,
	Check,
	GraduationCap,
	Loader2,
	Search,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	useGenerateIdeation,
	useSavePrompt,
	useUpdateIdeation,
} from "@/lib/api/sop-workspace";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getGetApplications1QueryKey,
	useCreateApplication1,
} from "@/lib/generated/api/endpoints/applications/applications";
import { useListPrograms } from "@/lib/generated/api/endpoints/explore/explore";
import { useGetIntake } from "@/lib/generated/api/endpoints/persona-lab-intake/persona-lab-intake";
import {
	getGetApplicationsQueryKey,
	useCreateApplication,
} from "@/lib/generated/api/endpoints/scholarship-applications/scholarship-applications";
import { useListScholarships } from "@/lib/generated/api/endpoints/scholarship-explore/scholarship-explore";
import type {
	PersonaIntakeResponse,
	ProgramListItemResponse,
	ScholarshipListItemResponse,
} from "@/lib/generated/api/models";
import { cn } from "@/lib/utils";

type TargetKind = "program" | "scholarship";

interface SelectedTarget {
	kind: TargetKind;
	id: string;
	name: string;
	subtitle: string;
	logoUrl?: string;
}

interface NewEssayWorkspaceProps {
	onCreated?: (args: { applicationId: string; kind: TargetKind }) => void;
	onCancel?: () => void;
}

const MIN_SEARCH_CHARS = 2;
const SEARCH_DEBOUNCE_MS = 300;
const PAGE_SIZE = 8;

/**
 * Motifs keyed by essay type — values match backend NarrativeMotif enum exactly.
 * PS: 5 narrative motifs, SOP: 3 professional archetypes.
 */
const MOTIFS_BY_ESSAY_TYPE: Record<string, string[]> = {
	ps: [
		"NARRATIVE_DRIVEN",
		"REFLECTIVE",
		"METAPHORICAL",
		"GROWTH",
		"CULTURAL_IDENTITY",
	],
	sop: ["DEEP_SPECIALIST", "CAREER_CHANGER", "VISIONARY_BUILDER"],
};

export function NewEssayWorkspace({
	onCreated,
	onCancel,
}: NewEssayWorkspaceProps) {
	const tDialog = useTranslations("applications.newEssayDialog");
	const tSetup = useTranslations("sop.setup");
	const queryClient = useQueryClient();

	const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

	// Step 1 State
	const [kind, setKind] = useState<TargetKind>("program");
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [selectedTarget, setSelectedTarget] = useState<SelectedTarget | null>(
		null,
	);
	const [wordLimit, setWordLimit] = useState("");

	// Step 2 & 3 State
	const [selectedEssayType, setSelectedEssayType] = useState<string | null>(
		null,
	);
	const [selectedMotif, setSelectedMotif] = useState<string | null>(null);

	const [isSubmitting, setIsSubmitting] = useState(false);

	// Debounce search
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery.trim());
		}, SEARCH_DEBOUNCE_MS);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Clear selection when switching target type
	const handleKindChange = (next: TargetKind) => {
		if (next === kind) return;
		setKind(next);
		setSelectedTarget(null);
		setSearchQuery("");
		setDebouncedSearch("");
	};

	const searchEnabled =
		!selectedTarget && debouncedSearch.length >= MIN_SEARCH_CHARS;

	const programsQuery = useListPrograms(
		{ search: debouncedSearch, size: PAGE_SIZE, page: 1 },
		{
			query: {
				enabled: searchEnabled && kind === "program",
				staleTime: 30_000,
			},
		},
	);

	const scholarshipsQuery = useListScholarships(
		{ search: debouncedSearch, size: PAGE_SIZE, page: 1 },
		{
			query: {
				enabled: searchEnabled && kind === "scholarship",
				staleTime: 30_000,
			},
		},
	);

	const programList =
		unwrapResponse<{ data?: ProgramListItemResponse[] }>(programsQuery.data)
			?.data ?? [];
	const scholarshipList =
		unwrapResponse<{ data?: ScholarshipListItemResponse[] }>(
			scholarshipsQuery.data,
		)?.data ?? [];

	const isSearching =
		kind === "program"
			? programsQuery.isFetching
			: scholarshipsQuery.isFetching;

	const { mutateAsync: createProgramApp } = useCreateApplication1();
	const { mutateAsync: createScholarshipApp } = useCreateApplication();
	const { mutateAsync: saveProgramPrompt } = useSavePrompt();
	const { mutateAsync: generateIdeation } = useGenerateIdeation();
	const { mutateAsync: updateIdeation } = useUpdateIdeation();

	const { data: intakeData } = useGetIntake();
	const intake = intakeData
		? unwrapResponse<PersonaIntakeResponse>(intakeData)
		: null;
	const intakeComplete = intake?.complete === true;
	const needsPersonaLab = !intakeComplete;

	const canProceedToStep2 = !!selectedTarget && !needsPersonaLab;

	const handleNext = () => {
		setStep(2);
	};

	const handleEssayTypeSelect = (type: string) => {
		setSelectedEssayType(type);
		setSelectedMotif(null); // Clear motif when switching essay type
		setStep(3);
	};

	const handleSubmit = async () => {
		if (!selectedTarget) return;
		setIsSubmitting(true);

		const parsedLimit = wordLimit.trim()
			? Number.parseInt(wordLimit, 10)
			: undefined;
		const limit =
			parsedLimit !== undefined &&
			Number.isFinite(parsedLimit) &&
			parsedLimit > 0
				? parsedLimit
				: undefined;

		try {
			let applicationId: string | undefined;

			if (selectedTarget.kind === "program") {
				const res = await createProgramApp({
					data: { programId: selectedTarget.id },
				});
				applicationId = unwrapResponse<{ id?: string }>(res)?.id;
				if (!applicationId) throw new Error("Missing application id");
				queryClient.invalidateQueries({
					queryKey: getGetApplications1QueryKey(),
				});
			} else {
				const res = await createScholarshipApp({
					data: { scholarshipId: selectedTarget.id },
				});
				applicationId = unwrapResponse<{ id?: string }>(res)?.id;
				if (!applicationId) throw new Error("Missing application id");
				queryClient.invalidateQueries({
					queryKey: getGetApplicationsQueryKey(),
				});
			}

			// Both program and scholarship use the same SOP workspace prompt + ideation flow
			await saveProgramPrompt({
				applicationId,
				data: {
					wordLimit: limit,
					essayType: selectedEssayType ?? undefined,
					narrativeMotif: selectedMotif ?? undefined,
				},
			});

			setStep(4);
			const result = await generateIdeation(applicationId);
			const angles = result.angles ?? [];
			const best =
				angles.find((a) => a.matchLevel === "STRONG") ??
				angles.find((a) => a.matchLevel === "MODERATE") ??
				angles[0];
			if (best) {
				await updateIdeation({
					applicationId,
					data: { selectedAngleId: best.id, tonePreference: "academic" },
				});
			}

			onCreated?.({ applicationId, kind: selectedTarget.kind });
		} catch (err) {
			const message =
				err instanceof Error && /409|exists|duplicate/i.test(err.message)
					? tDialog("errorAlreadyExists")
					: tDialog("errorCreate");
			toast.error(message);
			setIsSubmitting(false);
			setStep(3);
		}
	};

	return (
		<div className="flex-1 overflow-y-auto bg-muted/30 p-8 h-full">
			{step === 1 && (
				<div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
					<div className="text-center space-y-2">
						<h2 className="text-3xl font-bold tracking-tight">
							Create New Essay
						</h2>
						<p className="text-muted-foreground">
							Select your target school or scholarship to get started.
						</p>
					</div>

					<Card className="p-6">
						<div className="space-y-6">
							<div className="space-y-2">
								<Label className="text-sm font-medium">
									{tDialog("targetTypeLabel")}
								</Label>
								<ToggleGroup
									type="single"
									value={kind}
									onValueChange={(v) => v && handleKindChange(v as TargetKind)}
									variant="outline"
									className="w-full"
								>
									<ToggleGroupItem value="program" className="flex-1 gap-2">
										<GraduationCap className="w-4 h-4" />
										{tDialog("targetType.program")}
									</ToggleGroupItem>
									<ToggleGroupItem value="scholarship" className="flex-1 gap-2">
										<Award className="w-4 h-4" />
										{tDialog("targetType.scholarship")}
									</ToggleGroupItem>
								</ToggleGroup>
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-medium">
									{tDialog("searchLabel")}
								</Label>
								{selectedTarget ? (
									<SelectedTargetCard
										target={selectedTarget}
										onChange={() => setSelectedTarget(null)}
										changeLabel={tDialog("change")}
										selectedLabel={tDialog("selected")}
									/>
								) : (
									<>
										<div className="relative">
											<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
											<Input
												autoFocus
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
												placeholder={
													kind === "program"
														? tDialog("searchProgramPlaceholder")
														: tDialog("searchScholarshipPlaceholder")
												}
												className="pl-9"
											/>
										</div>
										<SearchResults
											kind={kind}
											debouncedSearch={debouncedSearch}
											isLoading={isSearching}
											programs={programList}
											scholarships={scholarshipList}
											onSelect={setSelectedTarget}
											hintMsg={tDialog("searchHint")}
											emptyMsg={tDialog("searchEmpty")}
										/>
									</>
								)}
							</div>

							<div className="flex flex-col gap-3">
								<Label htmlFor="essay-word-limit" className="text-sm">
									{tDialog("wordLimitLabel")}
								</Label>
								<div className="flex items-center gap-3">
									<Input
										id="essay-word-limit"
										type="number"
										inputMode="numeric"
										min={1}
										value={wordLimit}
										onChange={(e) => setWordLimit(e.target.value)}
										placeholder={tDialog("wordLimitPlaceholder")}
										className="w-28"
									/>
									<span className="text-xs text-muted-foreground">
										{tDialog("wordLimitSuffix")}
									</span>
								</div>
							</div>

							{needsPersonaLab && (
								<div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
									<p className="font-medium text-amber-800">
										{tDialog("personaLabRequired")}
									</p>
									<Button
										variant="link"
										asChild
										className="h-auto p-0 mt-1 text-amber-700"
									>
										<Link href="/persona-lab/intake">
											{tDialog("goToPersonaLab")}
										</Link>
									</Button>
								</div>
							)}

							<div className="pt-4 flex justify-end gap-3">
								<Button
									variant="outline"
									onClick={onCancel}
									disabled={isSubmitting}
								>
									{tDialog("cancel")}
								</Button>
								<Button
									onClick={handleNext}
									disabled={!canProceedToStep2 || isSubmitting}
								>
									{isSubmitting ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											{tDialog("submitting")}
										</>
									) : (
										"Next"
									)}
								</Button>
							</div>
						</div>
					</Card>
				</div>
			)}

			{step === 2 && (
				<div className="flex flex-col items-center justify-center min-h-[60vh] max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
					<div className="text-center space-y-2">
						<h2 className="text-3xl font-bold tracking-tight">
							{tSetup("step1Title")}
						</h2>
						<p className="text-muted-foreground">{tSetup("step1Desc")}</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-8">
						{["ps", "sop"].map((type) => (
							<Card
								key={type}
								className={cn(
									"cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
									selectedEssayType === type
										? "border-primary ring-1 ring-primary"
										: "",
								)}
								onClick={() => handleEssayTypeSelect(type)}
							>
								<CardHeader>
									<CardTitle className="text-xl">
										{tSetup(
											`essayType.${type}` as Parameters<typeof tSetup>[0],
										)}
									</CardTitle>
									<CardDescription className="text-sm mt-2 leading-relaxed">
										{tSetup(
											`essayType.${type}Desc` as Parameters<typeof tSetup>[0],
										)}
									</CardDescription>
								</CardHeader>
							</Card>
						))}
					</div>
					<Button variant="ghost" onClick={() => setStep(1)} className="mt-8">
						Back
					</Button>
				</div>
			)}

			{step === 3 && (
				<div className="flex flex-col items-center justify-center min-h-[60vh] max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
					<div className="text-center space-y-2">
						<h2 className="text-3xl font-bold tracking-tight">
							{tSetup("step2Title")}
						</h2>
						<p className="text-muted-foreground">{tSetup("step2Desc")}</p>
					</div>

					<div
						className={cn(
							"grid grid-cols-1 gap-4 w-full mt-6 items-stretch",
							selectedEssayType === "sop"
								? "md:grid-cols-3"
								: "md:grid-cols-3 lg:grid-cols-5",
						)}
					>
						{(MOTIFS_BY_ESSAY_TYPE[selectedEssayType ?? "ps"] ?? []).map(
							(motif) => (
								<Card
									key={motif}
									className={cn(
										"cursor-pointer transition-all hover:border-primary/50 flex flex-col",
										selectedMotif === motif
											? "border-primary ring-1 ring-primary bg-primary/5"
											: "",
									)}
									onClick={() => setSelectedMotif(motif)}
								>
									<CardHeader className="pb-3 flex-grow">
										<CardTitle className="text-lg mb-2">
											{tSetup(`motif.${motif}` as Parameters<typeof tSetup>[0])}
										</CardTitle>
										<CardDescription className="text-sm">
											{tSetup(
												`motif.${motif}_desc` as Parameters<typeof tSetup>[0],
											)}
										</CardDescription>
									</CardHeader>
									<CardContent className="pt-0 mt-auto">
										<Badge
											variant="secondary"
											className="font-normal w-full justify-start text-left whitespace-normal leading-tight"
										>
											{tSetup(
												`motif.${motif}_for` as Parameters<typeof tSetup>[0],
											)}
										</Badge>
									</CardContent>
								</Card>
							),
						)}
					</div>

					<div className="flex gap-4 pt-8">
						<Button variant="outline" onClick={() => setStep(2)}>
							Back
						</Button>
						<Button
							size="lg"
							className="min-w-[120px]"
							disabled={!selectedMotif || isSubmitting}
							onClick={handleSubmit}
						>
							{isSubmitting ? (
								<Loader2 className="w-4 h-4 animate-spin mr-2" />
							) : (
								"Complete Setup"
							)}
						</Button>
					</div>
				</div>
			)}

			{step === 4 && (
				<div className="flex items-center justify-center h-full min-h-[60vh]">
					<div className="text-center max-w-sm">
						<div className="relative w-16 h-16 mx-auto mb-6">
							<div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
							<div className="relative w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
								<Sparkles className="w-7 h-7 text-primary animate-pulse" />
							</div>
						</div>
						<h3 className="text-lg font-semibold text-foreground mb-2">
							Setting up your workspace…
						</h3>
						<p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
							<Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
							Analysing your profile and crafting essay angles
						</p>
					</div>
				</div>
			)}
		</div>
	);
}

function SelectedTargetCard({
	target,
	onChange,
	changeLabel,
	selectedLabel,
}: {
	target: SelectedTarget;
	onChange: () => void;
	changeLabel: string;
	selectedLabel: string;
}) {
	return (
		<div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
			<div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 overflow-hidden">
				{target.logoUrl ? (
					// biome-ignore lint/performance/noImgElement: external
					<img
						src={target.logoUrl}
						alt=""
						className="w-full h-full object-contain"
					/>
				) : (
					<Building2 className="w-5 h-5 text-muted-foreground" />
				)}
			</div>
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
					<Check className="w-3.5 h-3.5" />
					{selectedLabel}
				</div>
				<div className="font-medium truncate">{target.name}</div>
				<div className="text-xs text-muted-foreground truncate">
					{target.subtitle}
				</div>
			</div>
			<Button variant="ghost" size="sm" onClick={onChange}>
				{changeLabel}
			</Button>
		</div>
	);
}

function SearchResults({
	kind,
	debouncedSearch,
	isLoading,
	programs,
	scholarships,
	onSelect,
	hintMsg,
	emptyMsg,
}: {
	kind: TargetKind;
	debouncedSearch: string;
	isLoading: boolean;
	programs: ProgramListItemResponse[];
	scholarships: ScholarshipListItemResponse[];
	onSelect: (item: SelectedTarget) => void;
	hintMsg: string;
	emptyMsg: string;
}) {
	if (debouncedSearch.length < MIN_SEARCH_CHARS)
		return (
			<div className="text-xs text-muted-foreground px-1 py-3">{hintMsg}</div>
		);
	if (isLoading)
		return (
			<div className="space-y-2">
				{[0, 1, 2].map((i) => (
					<Skeleton key={i} className="h-14 w-full rounded-md" />
				))}
			</div>
		);

	const items =
		kind === "program"
			? programs
					.filter((p) => !!p.id)
					.map((p) => ({
						kind: "program" as const,
						id: p.id ?? "",
						name: p.displayName || p.programName || "",
						subtitle: [p.universityName, p.universityCountry]
							.filter(Boolean)
							.join(" • "),
						logoUrl: p.universityLogoUrl,
					}))
			: scholarships
					.filter((s) => !!s.id)
					.map((s) => ({
						kind: "scholarship" as const,
						id: s.id ?? "",
						name: s.name || "",
						subtitle:
							[s.sourceName, s.universityCountry].filter(Boolean).join(" • ") ||
							s.sourceName ||
							"",
						logoUrl: s.universityLogoUrl,
					}));

	if (items.length === 0)
		return (
			<div className="text-xs text-muted-foreground px-1 py-3">{emptyMsg}</div>
		);

	return (
		<ScrollArea className="max-h-56 rounded-md border">
			<div className="p-1">
				{items.map((item) => (
					<button
						type="button"
						key={`${item.kind}-${item.id}`}
						onClick={() => onSelect(item)}
						className="w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-accent text-left transition-colors"
					>
						<div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center shrink-0 overflow-hidden">
							{item.logoUrl ? (
								// biome-ignore lint/performance/noImgElement: external
								<img
									src={item.logoUrl}
									alt=""
									className="w-full h-full object-contain"
								/>
							) : item.kind === "program" ? (
								<GraduationCap className="w-4 h-4 text-muted-foreground" />
							) : (
								<Award className="w-4 h-4 text-muted-foreground" />
							)}
						</div>
						<div className="min-w-0 flex-1">
							<div className="text-sm font-medium truncate">{item.name}</div>
							<div className="text-xs text-muted-foreground truncate">
								{item.subtitle}
							</div>
						</div>
					</button>
				))}
			</div>
		</ScrollArea>
	);
}
