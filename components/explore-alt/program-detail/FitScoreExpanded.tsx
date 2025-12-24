"use client";

import type { ProgramDetailResponse } from "@/lib/api/types";

interface FitBreakdown {
	label: string;
	score: number;
	maxScore: number;
}

interface FitScoreExpandedProps {
	program: ProgramDetailResponse;
	breakdown?: FitBreakdown[];
}

/**
 * Expanded Fit Score Analysis Component
 */
export function FitScoreExpanded({
	program,
	breakdown,
}: FitScoreExpandedProps) {
	const fitStyles = {
		reach: {
			badge:
				"bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
			bar: "bg-blue-500",
			label: "REACH SCHOOL",
		},
		target: {
			badge:
				"bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
			bar: "bg-yellow-500",
			label: "TARGET SCHOOL",
		},
		safety: {
			badge:
				"bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
			bar: "bg-green-500",
			label: "SAFETY SCHOOL",
		},
	};

	const category = (program.fitCategory || "target") as keyof typeof fitStyles;
	const style = fitStyles[category] || fitStyles.target;

	// Default breakdown if not provided
	const defaultBreakdown: FitBreakdown[] = breakdown || [
		{ label: "Academic", score: 18, maxScore: 25 },
		{ label: "English", score: 20, maxScore: 25 },
		{ label: "Financial", score: 12, maxScore: 25 },
		{ label: "Field Match", score: 25, maxScore: 25 },
	];

	return (
		<div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
			{/* Header */}
			<div className="p-6 border-b border-border bg-muted/30">
				<h3 className="text-lg font-bold text-foreground mb-4">
					Your Fit Analysis
				</h3>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<span className="text-4xl font-bold text-foreground">
							{program.fitScore || 67}
						</span>
						<span className="text-muted-foreground">/100</span>
					</div>
					<span
						className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border ${style.badge}`}
					>
						{style.label}
					</span>
				</div>
			</div>

			{/* Breakdown Section */}
			<div className="p-6 border-b border-border">
				<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
					📊 Breakdown
				</h4>
				<div className="space-y-4">
					{defaultBreakdown.map((item) => (
						<div key={item.label} className="space-y-1.5">
							<div className="flex items-center justify-between text-sm">
								<span className="text-foreground font-medium">
									{item.label}
								</span>
								<span className="text-muted-foreground">
									{item.score}/{item.maxScore}
								</span>
							</div>
							<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
								<div
									className={`h-full ${style.bar} transition-all duration-500`}
									style={{ width: `${(item.score / item.maxScore) * 100}%` }}
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Strengths */}
			{program.fitReasons && program.fitReasons.length > 0 && (
				<div className="p-6 border-b border-border">
					<h4 className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
						✅ Strengths
					</h4>
					<ul className="space-y-2">
						{program.fitReasons.map((reason, i) => (
							<li
								key={`strength-${i}`}
								className="flex items-start gap-2 text-sm text-foreground"
							>
								<span className="text-green-500 mt-0.5">•</span>
								<span>{reason}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Gaps & Recommendations */}
			{program.fitGaps && program.fitGaps.length > 0 && (
				<div className="p-6">
					<h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
						⚠️ Gaps & Recommendations
					</h4>
					<ul className="space-y-2">
						{program.fitGaps.map((gap, i) => (
							<li
								key={`gap-${i}`}
								className="flex items-start gap-2 text-sm text-foreground"
							>
								<span className="text-amber-500 mt-0.5">•</span>
								<span>{gap}</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
