"use client";

import {
	AlertTriangle,
	Building2,
	Calendar,
	Check,
	Clock,
	DollarSign,
	ExternalLink,
	GraduationCap,
	MapPin,
	Plus,
	Scale,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetTitle,
} from "@/components/ui/sheet";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import { useAppsCatalogApiGetProgramDetail } from "@/lib/generated/api/endpoints/explore/explore";
import type {
	CostResponse,
	DeadlineResponse,
	FundingOptionResponse,
	ProgramDetailResponse,
	ProgramListItemResponse,
	ProvenanceResponse,
	RequirementResponse,
} from "@/lib/generated/api/models";

interface ProgramDetailDrawerProps {
	programId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCompare?: (
		id: string,
		program?: ProgramListItemResponse | ProgramDetailResponse,
	) => void;
	onAddToDashboard?: (id: string) => void;
}

/** Compact, readable rendering of a requirement's JSON value. */
function formatReqValue(value: unknown): string {
	if (value == null) return "";
	if (typeof value === "object") {
		const v = value as Record<string, unknown>;
		if (v.overall != null) return `${v.overall}`;
		if (v.min != null)
			return v.scale != null ? `${v.min} / ${v.scale}` : `${v.min}`;
		return Object.values(v).join(", ");
	}
	return String(value);
}

function humanize(s: string): string {
	return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Small "where did this come from?" source link. */
function SourceLink({ provenance }: { provenance?: ProvenanceResponse }) {
	if (!provenance?.sourceUrl) return null;
	return (
		<a
			href={provenance.sourceUrl}
			target="_blank"
			rel="noopener noreferrer"
			title={provenance.excerpt || provenance.sourceUrl}
			className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-primary"
		>
			<ExternalLink className="w-2.5 h-2.5" />
			source
		</a>
	);
}

export function ProgramDetailDrawer({
	programId,
	open,
	onOpenChange,
	onCompare,
	onAddToDashboard,
}: ProgramDetailDrawerProps) {
	const t = useTranslations("explore.programDetail");

	const {
		data: programDetail,
		isLoading,
		error,
	} = useAppsCatalogApiGetProgramDetail(programId || "", {
		query: { enabled: !!programId && open, staleTime: 5 * 60 * 1000 },
	});

	const program = unwrapResponse<ProgramDetailResponse>(programDetail);
	const inst = program?.institution;
	const requirements: RequirementResponse[] = program?.requirements ?? [];
	const costs: CostResponse[] = program?.costs ?? [];
	const funding: FundingOptionResponse[] = program?.funding ?? [];
	const deadlines: DeadlineResponse[] = program?.deadlines ?? [];
	const completeness = Math.round((program?.completenessScore ?? 0) * 100);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-lg p-0 flex flex-col h-full"
			>
				<SheetTitle className="sr-only">Program Details</SheetTitle>
				{isLoading ? (
					<div className="flex-1 flex items-center justify-center">
						<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
					</div>
				) : error || !program ? (
					<div className="flex-1 flex items-center justify-center p-6 text-center">
						<div className="space-y-3">
							<div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
								<AlertTriangle className="w-6 h-6 text-destructive" />
							</div>
							<h3 className="text-lg font-semibold">{t("failedToLoad")}</h3>
							<Button onClick={() => onOpenChange(false)} variant="outline">
								{t("close")}
							</Button>
						</div>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1">
							<div className="p-6 space-y-6">
								{/* Header */}
								<header className="space-y-4">
									<div className="flex items-start gap-4">
										<div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border overflow-hidden">
											{inst?.logoUrl ? (
												<Image
													src={inst.logoUrl}
													alt={inst.name}
													width={64}
													height={64}
													className="object-contain"
												/>
											) : (
												<Building2 className="w-6 h-6 text-muted-foreground" />
											)}
										</div>
										<div className="flex-1 min-w-0">
											<h2 className="font-bold text-lg leading-snug">
												{program.name}
											</h2>
											<p className="text-sm font-medium">{inst?.name}</p>
											<div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
												<MapPin className="w-3 h-3 shrink-0" />
												{inst?.city ? `${inst.city}, ` : ""}
												{inst?.countryCode}
											</div>
										</div>
									</div>

									<div className="flex flex-wrap gap-1.5">
										<Badge variant="outline" className="gap-1 text-xs">
											<GraduationCap className="w-3 h-3" />
											{humanize(program.degreeLevel)}
										</Badge>
										{program.durationMonthsMin != null && (
											<Badge variant="outline" className="gap-1 text-xs">
												<Clock className="w-3 h-3" />
												{program.durationMonthsMin} mo
											</Badge>
										)}
										{program.deliveryModes?.map((m) => (
											<Badge key={m} variant="outline" className="text-xs">
												{humanize(m)}
											</Badge>
										))}
										<Badge className="bg-primary/10 text-primary border-0 text-xs">
											{completeness}% complete
										</Badge>
									</div>

									{program.programCategories?.length ? (
										<div className="flex flex-wrap gap-1">
											{program.programCategories.map((c) => (
												<span
													key={c}
													className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
												>
													{c}
												</span>
											))}
										</div>
									) : null}
								</header>

								{program.description && (
									<p className="text-sm text-muted-foreground leading-relaxed">
										{program.description}
									</p>
								)}

								{/* Requirements */}
								{requirements.length > 0 && (
									<section className="space-y-2">
										<h3 className="font-semibold text-sm">
											Entry requirements
										</h3>
										{requirements.map((r) => (
											<div
												key={r.type}
												className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-border text-sm"
											>
												<span className="flex items-center gap-2">
													<Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
													{r.label || humanize(r.type)}
												</span>
												<span className="flex items-center gap-2 text-muted-foreground">
													{formatReqValue(r.value)}
													<SourceLink provenance={r.provenance} />
												</span>
											</div>
										))}
									</section>
								)}

								{/* Costs */}
								{costs.length > 0 && (
									<section className="space-y-2">
										<h3 className="font-semibold text-sm">Tuition & costs</h3>
										{costs.map((c) => (
											<div
												key={c.costType}
												className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-border text-sm"
											>
												<span className="flex items-center gap-2">
													<DollarSign className="w-3.5 h-3.5 shrink-0" />
													{humanize(c.costType)}
												</span>
												<span className="flex items-center gap-2 text-muted-foreground">
													{c.amountUsdMin != null
														? `~$${c.amountUsdMin.toLocaleString()}${c.period ? `/${c.period.replace("per_", "")}` : ""}`
														: `${c.amountMin ?? ""} ${c.currency ?? ""}`}
													<SourceLink provenance={c.provenance} />
												</span>
											</div>
										))}
									</section>
								)}

								{/* Funding */}
								{funding.length > 0 && (
									<section className="space-y-2">
										<h3 className="font-semibold text-sm">Funding</h3>
										{funding.map((f) => (
											<div
												key={f.name}
												className="p-2.5 rounded-lg border border-border text-sm space-y-1"
											>
												<div className="flex items-center justify-between gap-2">
													<span className="font-medium">{f.name}</span>
													<SourceLink provenance={f.provenance} />
												</div>
												<div className="flex flex-wrap gap-1">
													{f.automaticConsideration && (
														<Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">
															Automatic
														</Badge>
													)}
													{f.coversTuition && (
														<Badge variant="outline" className="text-[10px]">
															Tuition
														</Badge>
													)}
													{f.coversLiving && (
														<Badge variant="outline" className="text-[10px]">
															Living
														</Badge>
													)}
												</div>
											</div>
										))}
									</section>
								)}

								{/* Deadlines */}
								{deadlines.length > 0 && (
									<section className="space-y-2">
										<h3 className="font-semibold text-sm">Deadlines</h3>
										{deadlines.map((d) => (
											<div
												key={`${d.deadlineType}-${d.name}`}
												className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-border text-sm"
											>
												<span className="flex items-center gap-2">
													<Calendar className="w-3.5 h-3.5 shrink-0" />
													{d.name || humanize(d.deadlineType)}
												</span>
												<span className="flex items-center gap-2 text-muted-foreground">
													{d.date || "—"}
													<SourceLink provenance={d.provenance} />
												</span>
											</div>
										))}
									</section>
								)}
							</div>
						</ScrollArea>

						<SheetFooter className="flex-row gap-2 p-4 border-t">
							{onCompare && (
								<Button
									variant="outline"
									className="flex-1 gap-1"
									onClick={() => onCompare(program.id, program)}
								>
									<Scale className="w-4 h-4" />
									{t("compare")}
								</Button>
							)}
							{onAddToDashboard && (
								<Button
									className="flex-1 gap-1"
									onClick={() => onAddToDashboard(program.id)}
								>
									<Plus className="w-4 h-4" />
									{t("addToDashboard")}
								</Button>
							)}
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
