"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
	AlertCircle,
	BookOpen,
	GraduationCap,
	Lightbulb,
	ListTodo,
	Loader2,
	Sparkles,
	Target,
	TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { ProgramDetailDrawer } from "@/components/explore/ProgramDetailDrawer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { analytics } from "@/lib/analytics/analytics";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	appsMatchingApiGetStrategy,
	getAppsCatalogApiGetSavedProgramsQueryKey,
	getAppsMatchingApiGetStrategyQueryKey,
	useAppsCatalogApiGetSavedPrograms,
	useAppsCatalogApiSaveProgram,
	useAppsCatalogApiUnsaveProgram,
	useAppsMatchingApiGetStrategy,
} from "@/lib/generated/api/endpoints/explore/explore";
import type { ProgramListResponse } from "@/lib/generated/api/models";
import type { ActionStepResponse } from "@/lib/generated/api/models/actionStepResponse";
import type { StrategyOptionResponse } from "@/lib/generated/api/models/strategyOptionResponse";
import type { StrategyProgramResponse } from "@/lib/generated/api/models/strategyProgramResponse";
import type { StrategyResponse } from "@/lib/generated/api/models/strategyResponse";
import type { StrategyScholarshipResponse } from "@/lib/generated/api/models/strategyScholarshipResponse";
import { useCompareStore } from "@/lib/store/compareStore";
import {
	formatCurrencyAmount,
	formatDegreeType,
} from "@/lib/utils/displayFormatters";

function StrategySkeleton() {
	const t = useTranslations("strategy");
	return (
		<div className="space-y-8">
			<div className="flex flex-col items-center gap-2 py-6 text-center">
				<Loader2 className="h-6 w-6 animate-spin text-primary" />
				<p className="font-medium text-foreground">{t("analyzing")}</p>
				<p className="text-sm text-muted-foreground">
					{t("analyzingDescription")}
				</p>
			</div>
			<Skeleton className="h-8 w-3/4 max-w-xl" />
			<Skeleton className="h-4 w-full max-w-2xl" />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
			</div>
			<Skeleton className="h-32 w-full" />
			<Skeleton className="h-48 w-full" />
		</div>
	);
}

function StrategyError({ onRetry }: { onRetry: () => void }) {
	const t = useTranslations("strategy");

	return (
		<Alert variant="destructive">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>{t("error.title")}</AlertTitle>
			<AlertDescription className="flex flex-col gap-3">
				<span>{t("error.description")}</span>
				<Button variant="outline" size="sm" onClick={onRetry} className="w-fit">
					{t("error.retry")}
				</Button>
			</AlertDescription>
		</Alert>
	);
}

function StrategyEmpty() {
	const t = useTranslations("strategy");

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Lightbulb className="h-5 w-5 text-primary" />
					{t("empty.title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-muted-foreground">{t("empty.description")}</p>
				<Button disabled>{t("generateButton")}</Button>
			</CardContent>
		</Card>
	);
}

function ProgramCard({
	program,
	isSaved,
	isSaving,
	onSelect,
	onToggleSave,
}: {
	program: StrategyProgramResponse;
	isSaved: boolean;
	isSaving: boolean;
	onSelect: (program: StrategyProgramResponse) => void;
	onToggleSave: (program: StrategyProgramResponse) => void;
}) {
	const t = useTranslations("strategy");

	return (
		<Card
			className="h-full cursor-pointer hover:border-primary/50 transition-colors"
			onClick={() => onSelect(program)}
			tabIndex={0}
			role="button"
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect(program);
				}
			}}
		>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0">
						<CardTitle className="text-base leading-snug">
							{program.name}
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							{program.institution_name}
						</p>
					</div>
					<div className="flex flex-col items-end gap-2 shrink-0">
						<Badge variant="secondary" className="shrink-0">
							{program.fit_score}%
						</Badge>
						<Button
							variant={isSaved ? "default" : "outline"}
							size="sm"
							disabled={isSaving}
							className="h-7 px-2 text-xs"
							onClick={(e) => {
								e.stopPropagation();
								onToggleSave(program);
							}}
						>
							{isSaving ? (
								<>
									<Loader2 className="mr-1 h-3 w-3 animate-spin" />
									{t("saving")}
								</>
							) : isSaved ? (
								t("unsave")
							) : (
								t("save")
							)}
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex flex-wrap items-center gap-2 text-sm">
					<Badge variant="outline">
						{formatDegreeType(program.degree_level)}
					</Badge>
					{program.tuition_usd != null ? (
						<span className="text-muted-foreground">
							{formatCurrencyAmount(program.tuition_usd, "USD")}
						</span>
					) : (
						<span className="text-muted-foreground">{t("tuition")}: —</span>
					)}
				</div>
				{program.why && (
					<div>
						<p className="text-xs font-medium text-foreground mb-1">
							{t("why")}
						</p>
						<p className="text-sm text-muted-foreground">{program.why}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function ProgramBucket({
	title,
	icon: Icon,
	programs,
	savedIds,
	savingIds,
	onSelectProgram,
	onToggleSave,
}: {
	title: string;
	icon: React.ElementType;
	programs: StrategyProgramResponse[];
	savedIds: Set<string>;
	savingIds: Set<string>;
	onSelectProgram: (program: StrategyProgramResponse) => void;
	onToggleSave: (program: StrategyProgramResponse) => void;
}) {
	const t = useTranslations("strategy");

	return (
		<section className="space-y-3">
			<h3 className="flex items-center gap-2 text-base font-semibold">
				<Icon className="h-4 w-4 text-primary" />
				{title}
				<Badge variant="outline" className="ml-1">
					{programs.length}
				</Badge>
			</h3>
			{programs.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{programs.map((program) => (
						<ProgramCard
							key={program.ref}
							program={program}
							isSaved={program.id ? savedIds.has(program.id) : false}
							isSaving={program.id ? savingIds.has(program.id) : false}
							onSelect={onSelectProgram}
							onToggleSave={onToggleSave}
						/>
					))}
				</div>
			) : (
				<p className="text-sm text-muted-foreground">{t("noPrograms")}</p>
			)}
		</section>
	);
}

function ScholarshipCard({
	scholarship,
}: {
	scholarship: StrategyScholarshipResponse;
}) {
	const t = useTranslations("strategy");

	return (
		<Card className="h-full">
			<CardHeader className="pb-3">
				<CardTitle className="text-base leading-snug">
					{scholarship.name}
				</CardTitle>
				<p className="text-sm text-muted-foreground">
					{t("provider")}: {scholarship.provider_name}
				</p>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex flex-wrap gap-2">
					<Badge variant={scholarship.eligible ? "success" : "secondary"}>
						{scholarship.eligible ? t("eligible") : t("notEligible")}
					</Badge>
					<Badge variant="outline">{scholarship.coverage_summary}</Badge>
				</div>
				{scholarship.why && (
					<div>
						<p className="text-xs font-medium text-foreground mb-1">
							{t("why")}
						</p>
						<p className="text-sm text-muted-foreground">{scholarship.why}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function StrategyOptionCard({ option }: { option: StrategyOptionResponse }) {
	const t = useTranslations("strategy");

	return (
		<Card className="h-full">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-3">
					<CardTitle className="text-base leading-snug">
						{option.title}
					</CardTitle>
					<Badge variant="warning" className="shrink-0">
						{option.risk_level}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				<p className="text-sm text-muted-foreground">{option.summary}</p>
				<div>
					<p className="text-xs font-medium text-foreground mb-1">
						{t("fundingPlan")}
					</p>
					<p className="text-sm text-muted-foreground">{option.funding_plan}</p>
				</div>
			</CardContent>
		</Card>
	);
}

function ActionPlanTimeline({ steps }: { steps: ActionStepResponse[] }) {
	const t = useTranslations("strategy");

	return (
		<ol className="space-y-4">
			{steps.map((step) => (
				<li key={step.order} className="flex gap-4">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
						{step.order}
					</div>
					<div className="space-y-1">
						<p className="text-sm font-medium text-foreground">{step.title}</p>
						<p className="text-sm text-muted-foreground">{step.detail}</p>
						<p className="text-xs text-muted-foreground">
							{t("timeframe")}: {step.timeframe}
						</p>
					</div>
				</li>
			))}
		</ol>
	);
}

function StrategyView({
	strategy,
	onRegenerate,
	isRegenerating,
}: {
	strategy: StrategyResponse;
	onRegenerate: () => void;
	isRegenerating: boolean;
}) {
	const t = useTranslations("strategy");
	const queryClient = useQueryClient();
	const toggleCompare = useCompareStore((state) => state.toggle);

	const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
		null,
	);
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
	const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

	const { data: savedProgramsResponse } = useAppsCatalogApiGetSavedPrograms();
	const savedPrograms = useMemo(
		() =>
			unwrapResponse<ProgramListResponse>(savedProgramsResponse)?.data ?? [],
		[savedProgramsResponse],
	);
	const savedIds = useMemo(
		() => new Set(savedPrograms.map((p) => p.id).filter(Boolean)),
		[savedPrograms],
	);

	const saveProgram = useAppsCatalogApiSaveProgram({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getAppsCatalogApiGetSavedProgramsQueryKey(),
				});
			},
		},
	});

	const unsaveProgram = useAppsCatalogApiUnsaveProgram({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getAppsCatalogApiGetSavedProgramsQueryKey(),
				});
			},
		},
	});

	const handleSelectProgram = (program: StrategyProgramResponse) => {
		if (!program.id) return;
		setSelectedProgramId(program.id);
		setIsDetailDrawerOpen(true);
	};

	const handleToggleSave = (program: StrategyProgramResponse) => {
		if (!program.id) return;

		const isSaved = savedIds.has(program.id);
		setSavingIds((prev) => new Set(prev).add(program.id));

		const finish = () => {
			setSavingIds((prev) => {
				const next = new Set(prev);
				next.delete(program.id);
				return next;
			});
		};

		if (isSaved) {
			analytics.track("program_unsaved", { program_id: program.id });
			unsaveProgram.mutate({ programId: program.id }, { onSettled: finish });
		} else {
			analytics.track("program_saved", {
				program_id: program.id,
				source: "strategy",
			});
			saveProgram.mutate({ programId: program.id }, { onSettled: finish });
		}
	};

	const handleCompare = (id: string) => {
		if (!id) return;
		toggleCompare(id);
		setIsDetailDrawerOpen(false);
	};

	const handleAddToDashboard = (id: string) => {
		if (!id) return;
		analytics.track("program_apply_clicked", { program_id: id });
		setIsDetailDrawerOpen(false);
	};

	return (
		<div className="space-y-10">
			<div className="flex justify-end">
				<Button
					variant="outline"
					size="sm"
					disabled={isRegenerating}
					onClick={onRegenerate}
					className="gap-2"
				>
					{isRegenerating ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							{t("regenerating")}
						</>
					) : (
						<>
							<Sparkles className="h-4 w-4" />
							{t("regenerate")}
						</>
					)}
				</Button>
			</div>

			{strategy.overall_summary && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Sparkles className="h-5 w-5 text-primary" />
							{t("summaryTitle")}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground leading-relaxed">
							{strategy.overall_summary}
						</p>
					</CardContent>
				</Card>
			)}

			<section className="space-y-6">
				<h2 className="flex items-center gap-2 text-lg font-semibold">
					<GraduationCap className="h-5 w-5 text-primary" />
					{t("programsTitle")}
				</h2>
				<ProgramBucket
					title={t("safetyTitle")}
					icon={Target}
					programs={strategy.safety}
					savedIds={savedIds}
					savingIds={savingIds}
					onSelectProgram={handleSelectProgram}
					onToggleSave={handleToggleSave}
				/>
				<ProgramBucket
					title={t("targetTitle")}
					icon={TrendingUp}
					programs={strategy.target}
					savedIds={savedIds}
					savingIds={savingIds}
					onSelectProgram={handleSelectProgram}
					onToggleSave={handleToggleSave}
				/>
				<ProgramBucket
					title={t("reachTitle")}
					icon={BookOpen}
					programs={strategy.reach}
					savedIds={savedIds}
					savingIds={savingIds}
					onSelectProgram={handleSelectProgram}
					onToggleSave={handleToggleSave}
				/>
			</section>

			<Separator />

			<section className="space-y-4">
				<h2 className="flex items-center gap-2 text-lg font-semibold">
					<Sparkles className="h-5 w-5 text-primary" />
					{t("scholarshipsTitle")}
				</h2>
				{strategy.scholarships.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{strategy.scholarships.map((scholarship) => (
							<ScholarshipCard
								key={scholarship.ref}
								scholarship={scholarship}
							/>
						))}
					</div>
				) : (
					<p className="text-sm text-muted-foreground">{t("noScholarships")}</p>
				)}
			</section>

			<Separator />

			<section className="space-y-4">
				<h2 className="flex items-center gap-2 text-lg font-semibold">
					<Lightbulb className="h-5 w-5 text-primary" />
					{t("optionsTitle")}
				</h2>
				{strategy.options.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{strategy.options.map((option, index) => (
							<StrategyOptionCard
								key={`${option.title}-${index}`}
								option={option}
							/>
						))}
					</div>
				) : (
					<p className="text-sm text-muted-foreground">{t("noOptions")}</p>
				)}
			</section>

			<Separator />

			<section className="space-y-4">
				<h2 className="flex items-center gap-2 text-lg font-semibold">
					<ListTodo className="h-5 w-5 text-primary" />
					{t("actionPlanTitle")}
				</h2>
				{strategy.action_plan.length > 0 ? (
					<ActionPlanTimeline steps={strategy.action_plan} />
				) : (
					<p className="text-sm text-muted-foreground">{t("noActionPlan")}</p>
				)}
			</section>

			<ProgramDetailDrawer
				programId={selectedProgramId}
				open={isDetailDrawerOpen}
				onOpenChange={setIsDetailDrawerOpen}
				onCompare={handleCompare}
				onAddToDashboard={handleAddToDashboard}
			/>
		</div>
	);
}

export function StrategyClient() {
	const queryClient = useQueryClient();
	const [isRegenerating, setIsRegenerating] = useState(false);

	const {
		data: response,
		isLoading,
		isError,
		refetch,
	} = useAppsMatchingApiGetStrategy();
	const strategy = response?.data?.data ?? null;

	const handleRegenerate = async () => {
		setIsRegenerating(true);
		analytics.track("strategy_regenerate_clicked", {});
		try {
			await appsMatchingApiGetStrategy({ refresh: true });
			await queryClient.invalidateQueries({
				queryKey: getAppsMatchingApiGetStrategyQueryKey(),
			});
		} finally {
			setIsRegenerating(false);
		}
	};

	const hasData = useMemo(() => {
		if (!strategy) return false;
		return (
			Boolean(strategy.overall_summary) ||
			strategy.safety.length > 0 ||
			strategy.target.length > 0 ||
			strategy.reach.length > 0 ||
			strategy.scholarships.length > 0 ||
			strategy.options.length > 0 ||
			strategy.action_plan.length > 0
		);
	}, [strategy]);

	useEffect(() => {
		if (!isLoading && strategy) {
			analytics.track("strategy_viewed", { has_data: hasData });
		}
	}, [isLoading, strategy, hasData]);

	if (isLoading) {
		return <StrategySkeleton />;
	}

	if (isError) {
		return (
			<StrategyError
				onRetry={() => {
					refetch();
				}}
			/>
		);
	}

	if (!strategy || !hasData) {
		return <StrategyEmpty />;
	}

	return (
		<StrategyView
			strategy={strategy}
			onRegenerate={handleRegenerate}
			isRegenerating={isRegenerating}
		/>
	);
}
