"use client";

import { Calendar, Circle } from "lucide-react";
import type {
	ProgramDetailResponse,
	ProgramIntakeResponse,
} from "@/lib/generated/api/models";

interface ApplicationSidebarProps {
	program: ProgramDetailResponse;
}

function getDaysUntil(dateString?: string): number | null {
	if (!dateString) return null;
	const now = new Date();
	const target = new Date(dateString);
	const diff = target.getTime() - now.getTime();
	return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Application Sidebar - Checklist and Deadlines
 */
export function ApplicationSidebar({ program }: ApplicationSidebarProps) {
	// Default checklist items based on requirements
	const checklistItems = program.requirements?.documents || [
		"Official Transcripts",
		"Test Scores (IELTS/TOEFL)",
		"2 Letters of Recommendation",
		"Statement of Purpose",
		"Resume/CV",
	];

	// Get upcoming deadlines from intakes
	const upcomingDeadlines = (program.intakes || [])
		.filter(
			(intake: ProgramIntakeResponse) =>
				intake.applicationDeadline || intake.earlyDeadline,
		)
		.slice(0, 3);

	return (
		<div className="space-y-6">
			{/* Application Checklist */}
			<div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
				<div className="p-4 border-b border-border bg-muted/30">
					<h3 className="font-bold text-foreground">Application Checklist</h3>
				</div>
				<div className="p-4">
					<ul className="space-y-3">
						{checklistItems.map((item: string) => (
							<li key={item} className="flex items-center gap-3 text-sm">
								<Circle className="w-4 h-4 text-muted-foreground" />
								<span className="text-foreground">{item}</span>
							</li>
						))}
					</ul>
					{program.requirements?.notes && (
						<p className="mt-4 text-xs text-muted-foreground border-t border-border pt-3">
							Note: {program.requirements.notes}
						</p>
					)}
				</div>
			</div>

			{/* Upcoming Deadlines */}
			<div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
				<div className="p-4 border-b border-border bg-muted/30">
					<h3 className="font-bold text-foreground">Upcoming Deadlines</h3>
				</div>
				<div className="p-4">
					{upcomingDeadlines.length > 0 ? (
						<ul className="space-y-4">
							{upcomingDeadlines.map((intake: ProgramIntakeResponse) => (
								<DeadlineItem key={intake.id} intake={intake} />
							))}
						</ul>
					) : program.nextDeadline ? (
						<div className="flex items-start gap-3">
							<Calendar className="w-5 h-5 text-primary mt-0.5" />
							<div>
								<p className="text-sm font-medium text-foreground">
									Next Deadline
								</p>
								<p className="text-sm text-muted-foreground">
									{new Date(program.nextDeadline).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</p>
								{(() => {
									const daysLeft = getDaysUntil(program.nextDeadline);
									if (daysLeft === null) return null;
									return (
										<span
											className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
												daysLeft <= 30
													? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
													: daysLeft <= 60
														? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
														: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
											}`}
										>
											{daysLeft} days left
										</span>
									);
								})()}
							</div>
						</div>
					) : (
						<p className="text-sm text-muted-foreground">
							No deadline information available.
						</p>
					)}
				</div>
			</div>

			{/* Application Fee */}
			{program.applicationFeeUsd && (
				<div className="bg-card border border-border rounded-xl p-4 shadow-sm">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">
							Application Fee
						</span>
						<span className="text-lg font-bold text-foreground">
							${program.applicationFeeUsd}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}

function DeadlineItem({ intake }: { intake: ProgramIntakeResponse }) {
	const earlyDays = getDaysUntil(intake.earlyDeadline);
	const regularDays = getDaysUntil(intake.applicationDeadline);

	return (
		<li className="space-y-2">
			<p className="text-sm font-semibold text-foreground">
				{intake.seasonDisplay} {intake.season}
			</p>
			{intake.earlyDeadline && (
				<div className="flex items-center gap-2 text-sm">
					<Calendar className="w-4 h-4 text-blue-500" />
					<span className="text-muted-foreground">Early:</span>
					<span className="text-foreground">
						{new Date(intake.earlyDeadline).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						})}
					</span>
					{earlyDays !== null && (
						<span className="text-xs text-muted-foreground">
							({earlyDays} days)
						</span>
					)}
				</div>
			)}
			{intake.applicationDeadline && (
				<div className="flex items-center gap-2 text-sm">
					<Calendar className="w-4 h-4 text-primary" />
					<span className="text-muted-foreground">Regular:</span>
					<span className="text-foreground">
						{new Date(intake.applicationDeadline).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						})}
					</span>
					{regularDays !== null && (
						<span className="text-xs text-muted-foreground">
							({regularDays} days)
						</span>
					)}
				</div>
			)}
		</li>
	);
}
