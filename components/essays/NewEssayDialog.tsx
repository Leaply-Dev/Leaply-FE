"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
	Award,
	Building2,
	Check,
	GraduationCap,
	Loader2,
	PenSquare,
	Search,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSaveScholarshipEssayPrompt } from "@/lib/api/scholarship-essay";
import { useSavePrompt } from "@/lib/api/sop-workspace";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getGetApplications1QueryKey,
	useCreateApplication1,
} from "@/lib/generated/api/endpoints/applications/applications";
import { useListPrograms } from "@/lib/generated/api/endpoints/explore/explore";
import {
	getGetApplicationsQueryKey,
	useCreateApplication,
} from "@/lib/generated/api/endpoints/scholarship-applications/scholarship-applications";
import { useListScholarships } from "@/lib/generated/api/endpoints/scholarship-explore/scholarship-explore";
import type {
	ProgramListItemResponse,
	ScholarshipListItemResponse,
} from "@/lib/generated/api/models";

type TargetKind = "program" | "scholarship";

interface SelectedTarget {
	kind: TargetKind;
	id: string;
	name: string;
	subtitle: string;
	logoUrl?: string;
}

interface NewEssayDialogProps {
	onCreated?: (args: { applicationId: string; kind: TargetKind }) => void;
	trigger?: React.ReactNode;
}

const MIN_SEARCH_CHARS = 2;
const SEARCH_DEBOUNCE_MS = 300;
const PAGE_SIZE = 8;

export function NewEssayDialog({ onCreated, trigger }: NewEssayDialogProps) {
	const t = useTranslations("applications.newEssayDialog");
	const queryClient = useQueryClient();

	const [open, setOpen] = useState(false);
	const [kind, setKind] = useState<TargetKind>("program");
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [selected, setSelected] = useState<SelectedTarget | null>(null);
	const [prompt, setPrompt] = useState("");
	const [wordLimit, setWordLimit] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Reset dialog state whenever it closes
	useEffect(() => {
		if (!open) {
			setKind("program");
			setSearchQuery("");
			setDebouncedSearch("");
			setSelected(null);
			setPrompt("");
			setWordLimit("");
			setIsSubmitting(false);
		}
	}, [open]);

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
		setSelected(null);
		setSearchQuery("");
		setDebouncedSearch("");
	};

	const searchEnabled = !selected && debouncedSearch.length >= MIN_SEARCH_CHARS;

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
	const { mutateAsync: saveScholarshipPrompt } =
		useSaveScholarshipEssayPrompt();

	const canSubmit = !!selected && !isSubmitting;

	const handleSubmit = async () => {
		if (!selected) return;
		setIsSubmitting(true);
		const trimmedPrompt = prompt.trim();
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

			if (selected.kind === "program") {
				const res = await createProgramApp({
					data: { programId: selected.id },
				});
				applicationId = unwrapResponse<{ id?: string }>(res)?.id;
				if (!applicationId) throw new Error("Missing application id");
				if (trimmedPrompt || limit) {
					await saveProgramPrompt({
						applicationId,
						data: { prompt: trimmedPrompt || undefined, wordLimit: limit },
					});
				}
				queryClient.invalidateQueries({
					queryKey: getGetApplications1QueryKey(),
				});
			} else {
				const res = await createScholarshipApp({
					data: { scholarshipId: selected.id },
				});
				applicationId = unwrapResponse<{ id?: string }>(res)?.id;
				if (!applicationId) throw new Error("Missing application id");
				if (trimmedPrompt || limit) {
					try {
						await saveScholarshipPrompt({
							applicationId,
							data: { prompt: trimmedPrompt || undefined, wordLimit: limit },
						});
					} catch {
						// Backend endpoint may not be deployed yet — don't block essay creation.
					}
				}
				queryClient.invalidateQueries({
					queryKey: getGetApplicationsQueryKey(),
				});
			}

			setOpen(false);
			onCreated?.({ applicationId, kind: selected.kind });
		} catch (err) {
			const message =
				err instanceof Error && /409|exists|duplicate/i.test(err.message)
					? t("errorAlreadyExists")
					: t("errorCreate");
			toast.error(message);
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button size="sm" className="gap-2">
						<PenSquare className="w-4 h-4" />
						{t("trigger")}
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
					<DialogDescription>{t("description")}</DialogDescription>
				</DialogHeader>

				<div className="space-y-5 overflow-y-auto pr-1 -mr-1">
					{/* Target type toggle */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">
							{t("targetTypeLabel")}
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
								{t("targetType.program")}
							</ToggleGroupItem>
							<ToggleGroupItem value="scholarship" className="flex-1 gap-2">
								<Award className="w-4 h-4" />
								{t("targetType.scholarship")}
							</ToggleGroupItem>
						</ToggleGroup>
					</div>

					{/* Target search / selected */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">{t("searchLabel")}</Label>
						{selected ? (
							<SelectedTargetCard
								target={selected}
								onChange={() => setSelected(null)}
								changeLabel={t("change")}
								selectedLabel={t("selected")}
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
												? t("searchProgramPlaceholder")
												: t("searchScholarshipPlaceholder")
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
									onSelect={setSelected}
									hintMsg={t("searchHint")}
									emptyMsg={t("searchEmpty")}
								/>
							</>
						)}
					</div>

					{/* Prompt */}
					<div className="space-y-2">
						<Label htmlFor="essay-prompt" className="text-sm font-medium">
							{t("promptLabel")}
						</Label>
						<Textarea
							id="essay-prompt"
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							placeholder={t("promptPlaceholder")}
							className="min-h-[96px] resize-none text-sm"
						/>
						<p className="text-xs text-muted-foreground">{t("promptHint")}</p>
					</div>

					{/* Word limit */}
					<div className="flex items-center gap-3">
						<Label
							htmlFor="essay-word-limit"
							className="text-sm whitespace-nowrap"
						>
							{t("wordLimitLabel")}
						</Label>
						<Input
							id="essay-word-limit"
							type="number"
							inputMode="numeric"
							min={1}
							value={wordLimit}
							onChange={(e) => setWordLimit(e.target.value)}
							placeholder={t("wordLimitPlaceholder")}
							className="w-28"
						/>
						<span className="text-xs text-muted-foreground">
							{t("wordLimitSuffix")}
						</span>
					</div>
				</div>

				<DialogFooter className="pt-2">
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={isSubmitting}
					>
						{t("cancel")}
					</Button>
					<Button onClick={handleSubmit} disabled={!canSubmit}>
						{isSubmitting ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								{t("submitting")}
							</>
						) : (
							t("submit")
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
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
					// biome-ignore lint/performance/noImgElement: external third-party logos
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
	onSelect: (target: SelectedTarget) => void;
	hintMsg: string;
	emptyMsg: string;
}) {
	if (debouncedSearch.length < MIN_SEARCH_CHARS) {
		return (
			<div className="text-xs text-muted-foreground px-1 py-3">{hintMsg}</div>
		);
	}

	if (isLoading) {
		return (
			<div className="space-y-2">
				{[0, 1, 2].map((i) => (
					<Skeleton key={i} className="h-14 w-full rounded-md" />
				))}
			</div>
		);
	}

	const items =
		kind === "program"
			? programs
					.filter((p) => !!p.id)
					.map<SelectedTarget>((p) => ({
						kind: "program",
						id: p.id ?? "",
						name: p.displayName || p.programName || "",
						subtitle: [p.universityName, p.universityCountry]
							.filter(Boolean)
							.join(" • "),
						logoUrl: p.universityLogoUrl,
					}))
			: scholarships
					.filter((s) => !!s.id)
					.map<SelectedTarget>((s) => ({
						kind: "scholarship",
						id: s.id ?? "",
						name: s.name ?? "",
						subtitle:
							[s.sourceName, s.universityCountry].filter(Boolean).join(" • ") ||
							s.sourceName ||
							"",
						logoUrl: s.universityLogoUrl,
					}));

	if (items.length === 0) {
		return (
			<div className="text-xs text-muted-foreground px-1 py-3">{emptyMsg}</div>
		);
	}

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
								// biome-ignore lint/performance/noImgElement: external third-party logos
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
