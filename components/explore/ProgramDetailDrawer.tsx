"use client";

import {
	AlertTriangle,
	Award,
	BookOpen,
	Calendar,
	Check,
	CheckCircle2,
	ChevronDown,
	Circle,
	Clock,
	DollarSign,
	Globe,
	GraduationCap,
	MapPin,
	Plus,
	Scale,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetTitle,
} from "@/components/ui/sheet";
import type {
	ProgramDetailResponse,
	ProgramIntakeResponse,
	UserContextResponse,
} from "@/lib/generated/api/models";

interface ProgramDetailDrawerProps {
	program: ProgramDetailResponse | null;
	userProfile?: UserContextResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCompare?: (id: string) => void;
	onAddToDashboard?: (id: string) => void;
}

// Requirement check item component
function RequirementCheckItem({
	label,
	required,
	userValue,
}: {
	label: string;
	required?: number;
	userValue?: number;
}) {
	const hasRequired = required !== undefined && required > 0;
	const hasUserValue = userValue !== undefined && userValue > 0;
	const isMet = hasRequired && hasUserValue && userValue >= required;

	return (
		<div
			className={`flex items-center justify-between p-3 rounded-lg border ${
				isMet
					? "border-primary/30 bg-primary/10"
					: hasRequired && hasUserValue
						? "border-destructive/30 bg-destructive/10"
						: "border-border bg-muted/50"
			}`}
		>
			<div className="flex items-center gap-3">
				{isMet ? (
					<div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
						<Check className="w-3 h-3 text-primary-foreground" />
					</div>
				) : hasRequired && hasUserValue ? (
					<div className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
						<AlertTriangle className="w-3 h-3 text-destructive-foreground" />
					</div>
				) : (
					<Circle className="w-5 h-5 text-muted-foreground" />
				)}
				<div>
					<p className="font-medium text-foreground text-sm">{label}</p>
					{hasUserValue && (
						<p className="text-xs text-muted-foreground">
							Your score: {userValue}
						</p>
					)}
				</div>
			</div>
			<span className="text-sm font-medium text-foreground">
				{hasRequired ? `${required}+` : "N/A"}
			</span>
		</div>
	);
}

function formatCurrency(value?: number): string {
	if (!value) return "N/A";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(value);
}

function formatDuration(months?: number): string {
	if (!months) return "N/A";
	const years = Math.floor(months / 12);
	const remainingMonths = months % 12;
	if (years === 0) return `${remainingMonths} months`;
	if (remainingMonths === 0) return `${years} year${years > 1 ? "s" : ""}`;
	return `${years}y ${remainingMonths}m`;
}

function IntakeCard({
	intake,
	isExpanded,
	onToggle,
}: {
	intake: ProgramIntakeResponse;
	isExpanded: boolean;
	onToggle: () => void;
}) {
	return (
		<div className="border border-border rounded-xl overflow-hidden">
			<button
				type="button"
				onClick={onToggle}
				className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
			>
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
						<Calendar className="w-5 h-5 text-primary" />
					</div>
					<div className="text-left">
						<p className="font-semibold text-foreground">
							{intake.seasonDisplay || intake.season || "N/A"}
						</p>
						<p className="text-xs text-muted-foreground">
							Deadline: {intake.applicationDeadline || "N/A"}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{intake.isActive && (
						<Badge className="bg-primary/10 text-primary border-0">Open</Badge>
					)}
					<ChevronDown
						className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
					/>
				</div>
			</button>
			{isExpanded && (
				<div className="px-4 pb-4 pt-0 border-t border-border bg-muted/30">
					<div className="pt-3 space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Application Opens</span>
							<span className="font-medium">
								{intake.applicationStartDate || "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Early Deadline</span>
							<span className="font-medium">
								{intake.earlyDeadline || "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">
								Application Deadline
							</span>
							<span className="font-medium">
								{intake.applicationDeadline || "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Classes Begin</span>
							<span className="font-medium">{intake.startDate || "N/A"}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export function ProgramDetailDrawer({
	program,
	userProfile,
	open,
	onOpenChange,
	onCompare,
	onAddToDashboard,
}: ProgramDetailDrawerProps) {
	const [expandedIntake, setExpandedIntake] = useState<string | null>(null);

	if (!program) return null;

	const req = program.requirements;
	const userProfileData = userProfile?.profile;
	const userGpa = userProfileData?.gpa
		? Number.parseFloat(userProfileData.gpa)
		: undefined;
	const testScores = userProfileData?.testScores || {};
	// Helper to safely parse scores that might be strings in the map
	const getScore = (key: string) => {
		const val = testScores[key];
		return val ? Number.parseFloat(val) : undefined;
	};
	const userIelts = getScore("IELTS");
	const userToefl = getScore("TOEFL");
	const userGre = getScore("GRE");
	const userGmat = getScore("GMAT");

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-lg p-0 flex flex-col"
			>
				<SheetTitle className="sr-only">Program Details</SheetTitle>
				<ScrollArea className="flex-1">
					<div className="p-6 space-y-6">
						{/* Header */}
						<header className="space-y-4">
							<div className="flex items-start gap-4">
								<div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border overflow-hidden">
									{program.universityLogoUrl ? (
										<Image
											src={program.universityLogoUrl}
											alt={program.universityName || "University"}
											width={64}
											height={64}
											className="object-contain"
										/>
									) : (
										<GraduationCap className="w-8 h-8 text-primary" />
									)}
								</div>
								<div className="flex-1 min-w-0">
									<h1 className="text-xl font-bold text-foreground leading-tight">
										{program.programName || "N/A"}
									</h1>
									<p className="text-sm font-medium text-muted-foreground mt-1">
										{program.universityName || "N/A"}
									</p>
									<div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
										<MapPin className="w-3.5 h-3.5" />
										<span>
											{program.universityCity || "N/A"},{" "}
											{program.universityCountry || "N/A"}
										</span>
									</div>
								</div>
							</div>

							{/* Ranking Badges */}
							<div className="flex flex-wrap gap-2">
								{program.rankingQsDisplay && (
									<Badge className="bg-primary/10 text-primary border-0 px-2.5 py-0.5 text-xs font-medium">
										<Award className="w-3 h-3 mr-1" />
										QS #{program.rankingQsDisplay}
									</Badge>
								)}
								{program.rankingTimesDisplay && (
									<Badge className="bg-primary/10 text-primary border-0 px-2.5 py-0.5 text-xs font-medium">
										<Award className="w-3 h-3 mr-1" />
										Times #{program.rankingTimesDisplay}
									</Badge>
								)}
								{program.fitScore && (
									<Badge className="bg-primary/10 text-primary border-0 px-2.5 py-0.5 text-xs font-medium">
										{program.fitScore}% Match
									</Badge>
								)}
							</div>
						</header>

						{/* Info Grid */}
						<section className="grid grid-cols-3 gap-3">
							<div className="bg-primary/5 rounded-xl p-3 border border-primary/20 text-center">
								<Clock className="w-5 h-5 text-primary mx-auto mb-2" />
								<p className="text-xs text-muted-foreground">Duration</p>
								<p className="font-semibold text-sm text-foreground mt-0.5">
									{formatDuration(program.durationMonths)}
								</p>
							</div>
							<div className="bg-primary/5 rounded-xl p-3 border border-primary/20 text-center">
								<BookOpen className="w-5 h-5 text-primary mx-auto mb-2" />
								<p className="text-xs text-muted-foreground">Study Mode</p>
								<p className="font-semibold text-sm text-foreground mt-0.5">
									{program.deliveryMode || "N/A"}
								</p>
							</div>
							<div className="bg-primary/5 rounded-xl p-3 border border-primary/20 text-center">
								<Globe className="w-5 h-5 text-primary mx-auto mb-2" />
								<p className="text-xs text-muted-foreground">Language</p>
								<p className="font-semibold text-sm text-foreground mt-0.5">
									{program.language || "N/A"}
								</p>
							</div>
						</section>

						{/* Tuition Fees */}
						<section className="bg-primary/5 rounded-xl p-4 border border-primary/20">
							<div className="flex items-center gap-2 mb-3">
								<DollarSign className="w-5 h-5 text-primary" />
								<h3 className="font-semibold text-foreground">Tuition Fees</h3>
							</div>
							<div className="grid grid-cols-3 gap-4">
								<div>
									<p className="text-xs text-muted-foreground">Per Year</p>
									<p className="text-lg font-bold text-foreground">
										{formatCurrency(program.tuition?.annualUsd)}
									</p>
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Total Program</p>
									<p className="text-lg font-bold text-foreground">
										{formatCurrency(program.tuition?.totalUsd)}
									</p>
								</div>
								<div>
									<p className="text-xs text-muted-foreground">App Fee</p>
									<p className="text-lg font-bold text-foreground">
										{formatCurrency(program.applicationFeeUsd)}
									</p>
								</div>
							</div>
							{program.tuition?.notes && (
								<p className="text-xs text-muted-foreground mt-2">
									{program.tuition.notes}
								</p>
							)}
							{program.scholarshipAvailable && (
								<p className="text-xs text-primary mt-2">
									✓ Scholarship available
								</p>
							)}
						</section>

						{/* Requirements Section */}
						<section>
							<div className="flex items-center gap-2 mb-3">
								<CheckCircle2 className="w-5 h-5 text-primary" />
								<h3 className="font-semibold text-foreground">
									Entry Requirements
								</h3>
							</div>
							<div className="space-y-2">
								{/* GPA */}
								<RequirementCheckItem
									label="GPA"
									required={req?.gpaMinimum}
									userValue={userGpa}
								/>
								{/* IELTS */}
								<RequirementCheckItem
									label="IELTS"
									required={req?.ieltsMinimum}
									userValue={userIelts}
								/>
								{/* TOEFL */}
								<RequirementCheckItem
									label="TOEFL"
									required={req?.toeflMinimum}
									userValue={userToefl}
								/>
								{/* GRE */}
								<RequirementCheckItem
									label="GRE"
									required={req?.greMinimum}
									userValue={userGre}
								/>
								{/* GMAT */}
								<RequirementCheckItem
									label="GMAT"
									required={req?.gmatMinimum}
									userValue={userGmat}
								/>
								{/* Additional Requirements */}
								{req?.documents && req.documents.length > 0 && (
									<div className="p-3 rounded-lg border border-border bg-muted/50">
										<p className="font-medium text-foreground text-sm mb-2">
											Additional Requirements
										</p>
										<ul className="text-xs text-muted-foreground space-y-1">
											{req.documents.map((doc) => (
												<li key={doc}>• {doc}</li>
											))}
										</ul>
									</div>
								)}
								{/* Work Experience */}
								{req?.workExperienceYears && (
									<div className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5">
										<p className="font-medium text-foreground text-sm">
											Work Experience
										</p>
										<Badge className="bg-primary text-primary-foreground border-0">
											{req.workExperienceYears}+ years
										</Badge>
									</div>
								)}
							</div>
							{req?.notes && (
								<p className="text-xs text-muted-foreground mt-3">
									{req.notes}
								</p>
							)}
						</section>
					</div>
				</ScrollArea>

				{/* Sticky Footer */}
				<SheetFooter className="border-t border-border p-4 bg-background">
					<div className="flex gap-3 w-full">
						<Button
							variant="outline"
							className="flex-1 gap-2"
							onClick={() => program?.id && onCompare?.(program.id)}
						>
							<Scale className="w-4 h-4" />
							Compare
						</Button>
						<Button
							className="flex-2 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
							onClick={() => program?.id && onAddToDashboard?.(program.id)}
						>
							<Plus className="w-4 h-4" />
							Apply Now
						</Button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
