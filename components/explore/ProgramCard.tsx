"use client";

import {
	AlertTriangle,
	ArrowRight,
	Award,
	Building2,
	Calendar,
	Check,
	Clock,
	DollarSign,
	GraduationCap,
	Laptop,
	MapPin,
	Plus,
	Settings2,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
	ProgramListItemResponse,
	UserContextResponse,
} from "@/lib/generated/api/models";
import {
	formatCountryName,
	formatDate,
	formatDegreeType,
	formatDeliveryMode,
	formatDuration,
	formatIeltsRequirement,
	formatTuitionPerYear,
	isDeadlinePast,
} from "@/lib/utils/displayFormatters";

interface ProgramCardProps {
	program: ProgramListItemResponse;
	userProfile?: UserContextResponse | null;
	onSaveToggle?: (id: string) => void;
	onClick?: (program: ProgramListItemResponse) => void;
	isSelected?: boolean;
	onToggleSelection?: (id: string) => void;
	isMaxReached?: boolean;
	onAddToDashboard?: (id: string) => void;
	isInDashboard?: boolean;
	onManage?: (id: string) => void;
}

export function ProgramCard({
	program,
	onClick,
	isSelected,
	onToggleSelection,
	isMaxReached,
	onAddToDashboard,
	isInDashboard,
	onManage,
}: ProgramCardProps) {
	// Check if deadline exists and is not past
	const hasValidDeadline =
		program.nextDeadline && !isDeadlinePast(program.nextDeadline);

	return (
		// biome-ignore lint/a11y/useSemanticElements: Cannot use <button> because it contains nested buttons
		<div
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.(program);
				}
			}}
			className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			onClick={() => onClick?.(program)}
		>
			{/* Header */}
			<div className="p-4">
				{/* University Info */}
				<div className="flex items-center gap-3 mb-3">
					<div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border">
						{program.universityLogoUrl ? (
							<Image
								src={program.universityLogoUrl}
								alt={program.universityName || "University"}
								width={64}
								height={64}
								className="object-contain"
							/>
						) : (
							<Building2 className="w-5 h-5 text-muted-foreground" />
						)}
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-bold text-base text-foreground line-clamp-2 leading-snug">
							{program.displayName || program.programName || "N/A"}
						</h3>
						<p className="font-medium text-sm text-foreground truncate">
							{program.universityName || "N/A"}
						</p>
						<div className="flex items-center gap-1 mt-0.5">
							<MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
							<span className="text-xs text-muted-foreground truncate">
								{program.universityCity || "N/A"},{" "}
								{formatCountryName(program.universityCountry)}
							</span>
						</div>
					</div>
				</div>

				{/* Badges Row */}
				<div className="flex flex-wrap gap-1.5 mb-3">
					{program.rankingQsDisplay && (
						<Badge className="bg-primary/10 text-primary border-0 text-xs gap-1">
							<Award className="w-3 h-3" />
							QS #{program.rankingQsDisplay}
						</Badge>
					)}

					{program.fitScore && (
						<Badge className="bg-primary/10 text-primary border-0 text-xs">
							{program.fitScore}% Match
						</Badge>
					)}

					{program.degreeType && (
						<Badge
							variant="outline"
							className="text-xs gap-1 border-muted-foreground/30"
						>
							<GraduationCap className="w-3 h-3" />
							{formatDegreeType(program.degreeType)}
						</Badge>
					)}

					{program.scholarshipAvailable && (
						<Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs">
							Scholarship
						</Badge>
					)}
				</div>

				{/* Quick Info Grid */}
				<div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mb-3">
					{/* Tuition */}
					{program.tuitionAnnualUsd && (
						<div className="flex items-center gap-1.5 text-muted-foreground">
							<DollarSign className="w-3.5 h-3.5 shrink-0" />
							<span className="truncate">
								{formatTuitionPerYear(program.tuitionAnnualUsd)}
							</span>
						</div>
					)}

					{/* Duration */}
					{program.durationMonths && (
						<div className="flex items-center gap-1.5 text-muted-foreground">
							<Clock className="w-3.5 h-3.5 shrink-0" />
							<span className="truncate">
								{formatDuration(program.durationMonths)}
							</span>
						</div>
					)}

					{/* Delivery Mode */}
					{program.deliveryMode && (
						<div className="flex items-center gap-1.5 text-muted-foreground">
							<Laptop className="w-3.5 h-3.5 shrink-0" />
							<span className="truncate">
								{formatDeliveryMode(program.deliveryMode)}
							</span>
						</div>
					)}

					{/* IELTS Requirement */}
					{program.ieltsMinimum && (
						<div className="flex items-center gap-1.5 text-muted-foreground">
							<span className="w-3.5 h-3.5 shrink-0 text-[10px] font-bold text-center leading-[14px]">
								IE
							</span>
							<span className="truncate">
								{formatIeltsRequirement(program.ieltsMinimum)}
							</span>
						</div>
					)}

					{/* Next Deadline */}
					{hasValidDeadline && (
						<div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
							<Calendar className="w-3.5 h-3.5 shrink-0" />
							<span className="truncate">
								Deadline: {formatDate(program.nextDeadline, { short: true })}
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Fit Gaps */}
			{program.fitGaps && program.fitGaps.length > 0 && (
				<div className="px-4 pb-3">
					<div className="bg-destructive/5 rounded-lg p-3 border border-destructive/20">
						<div className="flex items-center gap-2 mb-2">
							<AlertTriangle className="w-4 h-4 text-destructive" />
							<span className="text-xs font-semibold text-foreground uppercase tracking-wide">
								To improve
							</span>
						</div>
						<ul className="space-y-1">
							{program.fitGaps.slice(0, 2).map((gap) => (
								<li
									key={gap}
									className="flex items-start gap-2 text-xs text-muted-foreground"
								>
									<AlertTriangle className="w-3 h-3 text-destructive mt-0.5 shrink-0" />
									<span className="line-clamp-1">{gap}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}

			{/* Footer Actions */}
			<div className="px-4 pb-4 flex gap-2">
				<Button
					variant={isSelected ? "secondary" : "outline"}
					size="sm"
					className={`flex-1 font-medium text-sm gap-2 ${
						isSelected
							? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
							: ""
					}`}
					disabled={!isSelected && isMaxReached}
					onClick={(e) => {
						e.stopPropagation();
						program.id && onToggleSelection?.(program.id);
					}}
				>
					{isSelected ? (
						<>
							<Check className="w-4 h-4" />
							Added
						</>
					) : (
						<>
							<Plus className="w-4 h-4" />
							Compare
						</>
					)}
				</Button>
				<Button
					size="sm"
					className="flex-1 font-medium gap-2 bg-primary hover:bg-primary/90 text-sm"
					onClick={(e) => {
						e.stopPropagation();
						if (isInDashboard && onManage) {
							program.id && onManage(program.id);
						} else {
							program.id && onAddToDashboard?.(program.id);
						}
					}}
				>
					{isInDashboard ? (
						<>
							<Settings2 className="w-4 h-4" />
							Manage
						</>
					) : (
						<>
							Apply
							<ArrowRight className="w-4 h-4" />
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
