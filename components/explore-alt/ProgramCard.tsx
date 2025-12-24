import {
	Bookmark,
	BookmarkCheck,
	Calendar,
	Clock,
	DollarSign,
	MapPin,
} from "lucide-react";
import Link from "next/link";
import type { ProgramListItemResponse } from "@/lib/api/types";
import { formatCurrency, getDaysUntilDeadline } from "./utils";

/**
 * Program Card - Based on IMPLEMENTATION.md design
 */
export function ProgramCard({
	program,
	onSaveToggle,
}: {
	program: ProgramListItemResponse;
	onSaveToggle?: (id: string) => void;
}) {
	const daysUntil = getDaysUntilDeadline(program.nextDeadline);

	const fitStyles = {
		reach: {
			badge: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
			bar: "bg-blue-500",
			icon: "🎯",
			label: "REACH SCHOOL",
		},
		target: {
			badge: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
			bar: "bg-yellow-500",
			icon: "⚡",
			label: "TARGET SCHOOL",
		},
		safety: {
			badge: "bg-green-500/20 text-green-700 dark:text-green-300",
			bar: "bg-green-500",
			icon: "✓",
			label: "SAFETY SCHOOL",
		},
	};

	const category = (program.fitCategory || "target") as keyof typeof fitStyles;
	const style = fitStyles[category] || fitStyles.target;

	return (
		<div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group">
			{/* University Header */}
			<div className="p-4 border-b border-border">
				<div className="flex items-center gap-3">
					{/* University Logo Placeholder */}
					<div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
						{program.universityName.charAt(0)}
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-foreground truncate">
							{program.universityName}
						</h3>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							{program.rankingQs && (
								<span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
									#{program.rankingQs} QS World
								</span>
							)}
							<span className="flex items-center gap-1">
								<MapPin className="w-3 h-3" />
								{program.universityCity}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Program Info */}
			<div className="p-4 space-y-4">
				{/* Program Name */}
				<h4 className="font-bold text-lg text-foreground leading-tight">
					{program.programName}
				</h4>

				{/* Quick Metadata */}
				<div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
					<span className="flex items-center gap-1">
						<Clock className="w-4 h-4" />
						{program.durationMonths} months
					</span>
					<span>•</span>
					<span>{program.deliveryMode}</span>
					<span>•</span>
					<span>{program.nextIntake}</span>
				</div>

				{/* Fit Score Visual Treatment */}
				<div className="bg-muted/30 rounded-lg p-4 space-y-3">
					{/* Score Badge */}
					<div className="flex items-center justify-between">
						<span
							className={`px-3 py-1 rounded-full text-sm font-medium ${style.badge}`}
						>
							{style.icon} {style.label}
						</span>
						<span className="text-lg font-bold text-foreground">
							{program.fitScore}
						</span>
					</div>

					{/* Progress Bar */}
					<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
						<div
							className={`h-full ${style.bar} transition-all duration-500`}
							style={{ width: `${program.fitScore}%` }}
						/>
					</div>

					{/* Score Points */}
					<div className="space-y-1.5 text-sm">
						{program.fitReasons?.slice(0, 2).map((reason, i) => (
							<div
								key={`reason-${program.id}-${i}`}
								className="flex items-start gap-2 text-green-600 dark:text-green-400"
							>
								<span className="mt-0.5">✓</span>
								<span>{reason}</span>
							</div>
						))}
						{program.fitGaps?.slice(0, 1).map((gap, i) => (
							<div
								key={`gap-${program.id}-${i}`}
								className="flex items-start gap-2 text-amber-600 dark:text-amber-400"
							>
								<span className="mt-0.5">⚠</span>
								<span>{gap}</span>
							</div>
						))}
					</div>
				</div>

				{/* Requirements Row */}
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					<span className="flex items-center gap-1">
						<DollarSign className="w-4 h-4" />
						{formatCurrency(program.tuitionAnnualUsd)}/yr
					</span>
					{program.ieltsMinimum && <span>IELTS {program.ieltsMinimum}</span>}
					{program.scholarshipAvailable && (
						<span className="text-green-600 dark:text-green-400">
							💰 Scholarship
						</span>
					)}
				</div>

				{/* Deadline */}
				{daysUntil !== null && (
					<div className="flex items-center gap-2 text-sm">
						<Calendar className="w-4 h-4 text-muted-foreground" />
						<span className="text-muted-foreground">
							Deadline:{" "}
							{new Date(program.nextDeadline!).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</span>
						<span
							className={`px-2 py-0.5 rounded text-xs font-medium ${
								daysUntil <= 30
									? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
									: daysUntil <= 60
										? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
										: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
							}`}
						>
							{daysUntil} days
						</span>
					</div>
				)}
			</div>

			{/* Action Bar */}
			<div className="p-4 border-t border-border flex items-center justify-between">
				<button
					type="button"
					onClick={() => onSaveToggle?.(program.id)}
					className="p-2 rounded-lg hover:bg-muted transition-colors"
					aria-label={program.isSaved ? "Unsave program" : "Save program"}
				>
					{program.isSaved ? (
						<BookmarkCheck className="w-5 h-5 text-primary" />
					) : (
						<Bookmark className="w-5 h-5 text-muted-foreground" />
					)}
				</button>
				<Link
					href={`/explore-alt/${program.id}`}
					className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
				>
					View Details
				</Link>
			</div>
		</div>
	);
}
