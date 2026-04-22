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
import { Button } from "@/components/ui/button";
import {
	Card,
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

const MOTIF_COLORS: Record<string, string> = {
	NARRATIVE_DRIVEN: "#F59E0B",
	REFLECTIVE: "#6366F1",
	METAPHORICAL: "#14B8A6",
	GROWTH: "#10B981",
	CULTURAL_IDENTITY: "#F43F5E",
	DEEP_SPECIALIST: "#3B82F6",
	CAREER_CHANGER: "#F97316",
	VISIONARY_BUILDER: "#8B5CF6",
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

	// Shared step layout classes
	const stepContainer = "flex flex-col items-center min-h-[60vh] max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300 py-4";
	const stepHeading = (
		title: string,
		subtitle: string,
	) => (
		<div className="text-center space-y-2 w-full">
			<h2 className="text-3xl font-bold tracking-tight">{title}</h2>
			<p className="text-muted-foreground">{subtitle}</p>
		</div>
	);

	return (
		<div className="flex-1 overflow-y-auto bg-muted/30 p-6 lg:p-8 h-full">
			{/* ── Step 1: Target & word limit ── */}
			{step === 1 && (
				<div className={stepContainer}>
					{stepHeading(tDialog("step1Title"), tDialog("step1Subtitle"))}

					<Card className="w-full p-6">
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
						</div>
					</Card>

					<StepFooter
						onBack={onCancel}
						backLabel={tDialog("cancel")}
						onNext={handleNext}
						nextLabel={tDialog("next")}
						nextDisabled={!canProceedToStep2 || isSubmitting}
						isSubmitting={isSubmitting}
					/>
				</div>
			)}

			{/* ── Step 2: Essay type ── */}
			{step === 2 && (
				<div className={stepContainer}>
					{stepHeading(tSetup("step1Title"), tSetup("step1Desc"))}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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

					<StepFooter
						onBack={() => setStep(1)}
						backLabel={tSetup("back")}
					/>
				</div>
			)}

			{/* ── Step 3: Narrative motif ── */}
			{step === 3 && (
				<div className="flex flex-col items-center min-h-[60vh] max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300 py-4">
					{stepHeading(tSetup("step2Title"), tSetup("step2Desc"))}

					<div
						className={cn(
							"grid grid-cols-1 gap-4 w-full items-stretch",
							selectedEssayType === "sop"
								? "md:grid-cols-3"
								: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
						)}
					>
						{(MOTIFS_BY_ESSAY_TYPE[selectedEssayType ?? "ps"] ?? []).map(
							(motif) => (
								<MotifCard
									key={motif}
									motif={motif}
									isSelected={selectedMotif === motif}
									onSelect={() => setSelectedMotif(motif)}
									tSetup={tSetup}
								/>
							),
						)}
					</div>

					<StepFooter
						onBack={() => setStep(2)}
						backLabel={tSetup("back")}
						onNext={handleSubmit}
						nextLabel={tSetup("startWriting")}
						nextDisabled={!selectedMotif || isSubmitting}
						isSubmitting={isSubmitting}
					/>
				</div>
			)}

			{/* ── Step 4: Generating ── */}
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
							{tSetup("settingUpTitle")}
						</h3>
						<p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
							<Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
							{tSetup("settingUpDesc")}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}

function StepFooter({
	onBack,
	backLabel,
	onNext,
	nextLabel,
	nextDisabled,
	isSubmitting,
}: {
	onBack?: () => void;
	backLabel: string;
	onNext?: () => void;
	nextLabel?: string;
	nextDisabled?: boolean;
	isSubmitting?: boolean;
}) {
	return (
		<div className="flex items-center gap-3 w-full pt-2">
			{onBack && (
				<Button size="lg" variant="outline" onClick={onBack} disabled={isSubmitting}>
					{backLabel}
				</Button>
			)}
			{onNext && nextLabel && (
				<Button
					size="lg"
					className="ml-auto min-w-[140px]"
					onClick={onNext}
					disabled={nextDisabled || isSubmitting}
				>
					{isSubmitting ? (
						<Loader2 className="w-4 h-4 animate-spin mr-2" />
					) : (
						nextLabel
					)}
				</Button>
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

function MotifCard({
	motif,
	isSelected,
	onSelect,
	tSetup,
}: {
	motif: string;
	isSelected: boolean;
	onSelect: () => void;
	tSetup: ReturnType<typeof useTranslations<"sop.setup">>;
}) {
	const color = MOTIF_COLORS[motif] ?? "#6B7280";

	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				"group relative flex flex-col text-left rounded-xl border-2 transition-all duration-200 overflow-hidden w-full",
				"hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
				isSelected
					? "border-transparent shadow-lg scale-[1.01]"
					: "border-border bg-card hover:border-border/80",
			)}
			style={
				isSelected
					? {
							borderColor: color,
							boxShadow: `0 0 0 3px ${color}25, 0 4px 16px ${color}20`,
						}
					: undefined
			}
		>
			{/* Accent top bar */}
			<div
				className="h-1 w-full shrink-0 transition-all duration-200"
				style={{ backgroundColor: color }}
			/>

			{/* Header */}
			<div className="px-4 pt-4 pb-3">
				<div className="flex items-start gap-2.5 mb-2">
					<div
						className="w-2 h-2 rounded-full mt-1.5 shrink-0"
						style={{ backgroundColor: color }}
					/>
					<h3 className="font-semibold text-sm leading-snug text-foreground">
						{tSetup(`motif.${motif}` as Parameters<typeof tSetup>[0])}
					</h3>
					{isSelected && (
						<div
							className="ml-auto w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
							style={{ backgroundColor: color }}
						>
						<svg
							viewBox="0 0 12 12"
							className="w-2.5 h-2.5 text-white"
							fill="none"
							stroke="currentColor"
							strokeWidth={2.5}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<polyline points="2,6 5,9 10,3" />
						</svg>
						</div>
					)}
				</div>
				<p className="text-xs text-muted-foreground leading-relaxed pl-4">
					{tSetup(`motif.${motif}_desc` as Parameters<typeof tSetup>[0])}
				</p>
			</div>

			{/* Divider */}
			<div className="mx-4 h-px bg-border" />

			{/* Good fit */}
			<div className="px-4 py-3 space-y-1">
				<div className="flex items-center gap-1.5 mb-1">
				<svg
					viewBox="0 0 12 12"
					className="w-3 h-3 shrink-0"
					fill="none"
					stroke="#16A34A"
					strokeWidth={2.5}
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<polyline points="2,6 5,9 10,3" />
				</svg>
					<span className="text-[10px] font-semibold uppercase tracking-wide text-green-700">
						{tSetup("motifGoodFit")}
					</span>
				</div>
				<p className="text-xs text-muted-foreground leading-relaxed pl-4">
					{tSetup(`motif.${motif}_for` as Parameters<typeof tSetup>[0])}
				</p>
			</div>

			{/* Divider */}
			<div className="mx-4 h-px bg-border" />

			{/* Not for */}
			<div className="px-4 py-3 mt-auto space-y-1">
				<div className="flex items-center gap-1.5 mb-1">
				<svg
					viewBox="0 0 12 12"
					className="w-3 h-3 shrink-0"
					fill="none"
					stroke="#DC2626"
					strokeWidth={2.5}
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<line x1="2" y1="2" x2="10" y2="10" />
					<line x1="10" y1="2" x2="2" y2="10" />
				</svg>
					<span className="text-[10px] font-semibold uppercase tracking-wide text-red-600">
						{tSetup("motifSkipIf")}
					</span>
				</div>
				<p className="text-xs text-muted-foreground leading-relaxed pl-4">
					{tSetup(`motif.${motif}_not_for` as Parameters<typeof tSetup>[0])}
				</p>
			</div>
		</button>
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
