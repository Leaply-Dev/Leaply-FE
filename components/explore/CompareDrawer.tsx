"use client";

import { useQueries } from "@tanstack/react-query";
import {
	BookOpen,
	Calendar,
	Clock,
	DollarSign,
	GraduationCap,
	Languages,
	MapPin,
	Plus,
	Trophy,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import { getAppsCatalogApiGetProgramDetailQueryOptions } from "@/lib/generated/api/endpoints/explore/explore";
import type {
	ProgramDetailResponse,
	ProgramListItemResponse,
} from "@/lib/generated/api/models";
import {
	formatCountryName,
	getDeadlineInfo,
	formatTuitionRange,
	type Locale,
} from "@/lib/utils/displayFormatters";

// ============================================================================
// Types
// ============================================================================

interface CompareDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedProgramsList: ProgramListItemResponse[];
	onRemoveProgram: (id: string) => void;
	onAddToDashboard?: (id: string) => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

// ============================================================================
// Sub-Components
// ============================================================================

const NA = (
	<td className="p-4 border-l border-border align-top">
		<span className="text-muted-foreground">—</span>
	</td>
);

const LOADING = (
	<td className="p-4 border-l border-border align-top">
		<span className="text-muted-foreground text-sm animate-pulse">…</span>
	</td>
);

/** Compact, readable rendering of a requirement's JSON value (mirrors ProgramDetailDrawer). */
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

function findRequirement(
	detail: ProgramDetailResponse | undefined,
	typeSubstrings: string[],
) {
	return detail?.requirements?.find((r) =>
		typeSubstrings.some((s) => r.type?.toLowerCase().includes(s)),
	);
}

function ProgramHeaderCell({ program }: { program: ProgramListItemResponse }) {
	const inst = program.institution;
	return (
		<th className="p-4 text-left border-l border-border min-w-64">
			<div className="space-y-3">
				<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
					{inst?.logoUrl ? (
						<Image
							src={inst.logoUrl}
							alt={inst.name}
							width={40}
							height={40}
							className="object-contain"
						/>
					) : (
						<span className="text-sm font-bold text-primary">
							{(inst?.name ?? "").charAt(0).toUpperCase()}
						</span>
					)}
				</div>

				<div>
					<h3 className="font-semibold text-foreground">{program.name}</h3>
					<p className="text-sm text-muted-foreground">{inst?.name}</p>
				</div>

				<div className="flex items-center gap-1 text-sm text-muted-foreground">
					<MapPin className="w-3.5 h-3.5" />
					{formatCountryName(inst?.countryCode)}
				</div>
			</div>
		</th>
	);
}

// Tuition / gpa / english / deadline need the full program detail (not on the
// lean list item) — fetched per selected program, see detailsById below.
function TuitionCell({
	detail,
	isLoading,
}: {
	detail?: ProgramDetailResponse;
	isLoading: boolean;
}) {
	if (isLoading) return LOADING;
	const tuition = detail?.costs?.find((c) => c.costType === "tuition");
	if (!tuition) return NA;
	const value =
		tuition.amountUsdMin != null || tuition.amountUsdMax != null
			? formatTuitionRange(tuition.amountUsdMin, tuition.amountUsdMax, "USD")
			: formatTuitionRange(
					tuition.amountMin,
					tuition.amountMax,
					tuition.currency ?? "USD",
				);
	return (
		<td className="p-4 border-l border-border align-top">
			<span className="text-foreground">{value}</span>
		</td>
	);
}

// No ranking field is exposed on the program detail API yet — stays NA until
// the backend surfaces institution ranking data on this endpoint.
function RankingCell(_: { program: ProgramListItemResponse }) {
	return NA;
}

function DegreeDeliveryCell({ program }: { program: ProgramListItemResponse }) {
	return (
		<td className="p-4 border-l border-border align-top">
			<span className="text-sm text-muted-foreground">
				{program.degreeLevel?.replace(/_/g, " ")}
			</span>
		</td>
	);
}

function DurationCell({ program }: { program: ProgramListItemResponse }) {
	const months = program.durationMonthsMin ?? program.durationMonthsMax;
	return (
		<td className="p-4 border-l border-border align-top">
			<span className="text-foreground">
				{months != null ? `${months} mo` : "—"}
			</span>
		</td>
	);
}

function DeadlineCell({
	detail,
	isLoading,
	locale,
}: {
	detail?: ProgramDetailResponse;
	isLoading: boolean;
	locale: Locale;
}) {
	if (isLoading) return LOADING;
	const deadline =
		detail?.deadlines?.find((d) => d.deadlineType === "admission") ??
		detail?.deadlines?.[0];
	if (!deadline?.date) return NA;
	const info = getDeadlineInfo(deadline.date, locale);
	return (
		<td className="p-4 border-l border-border align-top">
			<span className="text-foreground">{info.text}</span>
		</td>
	);
}

function GpaCell({
	detail,
	isLoading,
}: {
	detail?: ProgramDetailResponse;
	isLoading: boolean;
}) {
	if (isLoading) return LOADING;
	const req = findRequirement(detail, ["gpa", "cgpa"]);
	if (!req) return NA;
	return (
		<td className="p-4 border-l border-border align-top">
			<span className="text-foreground">
				{formatReqValue(req.value)}
				{req.unit ? ` ${req.unit}` : ""}
			</span>
		</td>
	);
}

function EnglishCell({
	detail,
	isLoading,
}: {
	detail?: ProgramDetailResponse;
	isLoading: boolean;
}) {
	if (isLoading) return LOADING;
	const req = findRequirement(detail, ["ielts", "toefl", "teps", "toeic"]);
	if (!req) return NA;
	return (
		<td className="p-4 border-l border-border align-top">
			<span className="text-foreground">
				{req.label || req.type}: {formatReqValue(req.value)}
			</span>
		</td>
	);
}

function ActionsCell({
	program,
	onAddToDashboard,
	onRemoveProgram,
}: {
	program: ProgramListItemResponse;
	onAddToDashboard?: (id: string) => void;
	onRemoveProgram: (id: string) => void;
}) {
	const t = useTranslations("compare");
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-3">
				{onAddToDashboard && (
					<Button
						className="w-full"
						onClick={(e) => {
							e.stopPropagation();
							program.id && onAddToDashboard(program.id);
						}}
					>
						{t("applyScholarship")}
					</Button>
				)}
				<button
					type="button"
					onClick={() => onRemoveProgram(program.id ?? "")}
					className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors text-center"
				>
					{t("removeFromCompare")}
				</button>
			</div>
		</td>
	);
}

function RowLabel({
	icon: Icon,
	label,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
}) {
	return (
		<td className="p-4 align-top">
			<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
				<Icon className="w-4 h-4" />
				{label}
			</div>
		</td>
	);
}

// ============================================================================
// Main Component
// ============================================================================

export function CompareDialog({
	open,
	onOpenChange,
	selectedProgramsList,
	onRemoveProgram,
	onAddToDashboard,
}: CompareDialogProps) {
	const t = useTranslations("compare");
	const locale = useLocale() as Locale;

	const detailQueries = useQueries({
		queries: selectedProgramsList.map((program) => ({
			...getAppsCatalogApiGetProgramDetailQueryOptions(program.id ?? ""),
			enabled: open && !!program.id,
		})),
	});

	const detailsById = useMemo(() => {
		const map = new Map<string, ProgramDetailResponse>();
		detailQueries.forEach((query, index) => {
			const id = selectedProgramsList[index]?.id;
			const detail = unwrapResponse<ProgramDetailResponse>(query.data);
			if (id && detail) map.set(id, detail);
		});
		return map;
	}, [detailQueries, selectedProgramsList]);

	const isLoadingDetails = detailQueries.some((query) => query.isLoading);

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className="max-h-[90vh] p-0 gap-0 overflow-hidden">
				<DrawerHeader className="sr-only">
					<DrawerTitle>{t("title")}</DrawerTitle>
					<DrawerDescription>{t("compareDesc")}</DrawerDescription>
				</DrawerHeader>

				<ScrollArea className="max-h-[90vh] overflow-y-auto">
					<div className="p-6">
						<div className="border border-border rounded-lg overflow-hidden">
							<table className="w-full">
								<thead>
									<tr className="border-b border-border bg-muted/30">
										<th className="p-4 text-left font-medium text-sm text-muted-foreground w-40 align-top">
											<span className="uppercase tracking-wide text-xs">
												{t("criteria")}
											</span>
										</th>
										{selectedProgramsList.map((program) => (
											<ProgramHeaderCell key={program.id} program={program} />
										))}
									</tr>
								</thead>
								<tbody>
									<tr className="border-b border-border">
										<RowLabel icon={DollarSign} label={t("tuitionPerYear")} />
										{selectedProgramsList.map((program) => (
											<TuitionCell
												key={program.id}
												detail={detailsById.get(program.id ?? "")}
												isLoading={isLoadingDetails}
											/>
										))}
									</tr>

									<tr className="border-b border-border">
										<RowLabel icon={Trophy} label={t("qsRanking")} />
										{selectedProgramsList.map((program) => (
											<RankingCell key={program.id} program={program} />
										))}
									</tr>

									<tr className="border-b border-border">
										<RowLabel icon={BookOpen} label={t("degreeFormat")} />
										{selectedProgramsList.map((program) => (
											<DegreeDeliveryCell key={program.id} program={program} />
										))}
									</tr>

									<tr className="border-b border-border">
										<RowLabel icon={Clock} label={t("studyDuration")} />
										{selectedProgramsList.map((program) => (
											<DurationCell key={program.id} program={program} />
										))}
									</tr>

									<tr className="border-b border-border">
										<RowLabel
											icon={Calendar}
											label={t("applicationDeadline")}
										/>
										{selectedProgramsList.map((program) => (
											<DeadlineCell
												key={program.id}
												detail={detailsById.get(program.id ?? "")}
												isLoading={isLoadingDetails}
												locale={locale}
											/>
										))}
									</tr>

									<tr className="border-b border-border">
										<RowLabel icon={GraduationCap} label={t("gpaRequired")} />
										{selectedProgramsList.map((program) => (
											<GpaCell
												key={program.id}
												detail={detailsById.get(program.id ?? "")}
												isLoading={isLoadingDetails}
											/>
										))}
									</tr>

									<tr className="border-b border-border">
										<RowLabel icon={Languages} label={t("english")} />
										{selectedProgramsList.map((program) => (
											<EnglishCell
												key={program.id}
												detail={detailsById.get(program.id ?? "")}
												isLoading={isLoadingDetails}
											/>
										))}
									</tr>

									<tr>
										<td className="p-4 align-top" />
										{selectedProgramsList.map((program) => (
											<ActionsCell
												key={program.id}
												program={program}
												onAddToDashboard={onAddToDashboard}
												onRemoveProgram={onRemoveProgram}
											/>
										))}
									</tr>
								</tbody>
							</table>
						</div>

						{selectedProgramsList.length < 4 && (
							<div className="mt-6 flex justify-center">
								<Button
									variant="outline"
									onClick={() => onOpenChange(false)}
									className="gap-2"
								>
									<Plus className="w-4 h-4" />
									{t("addMorePrograms")}
								</Button>
							</div>
						)}
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
}
