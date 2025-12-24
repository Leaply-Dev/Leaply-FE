import { Sparkles, AlertCircle } from "lucide-react";

/**
 * AI Match Summary Component
 */
export function AIMatchSummary({
	recommendation,
	totalMatched,
	profileCompleteness = 0,
	missingFields = [],
}: {
	recommendation?: string;
	totalMatched: number;
	profileCompleteness?: number;
	missingFields?: string[];
}) {
	const isProfileComplete = profileCompleteness === 100;

	return (
		<div className="bg-linear-to-br from-primary/10 via-background to-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm">
			<div className="flex items-start gap-4">
				<div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
					<Sparkles className="w-6 h-6 text-primary" />
				</div>
				<div className="flex-1">
					<h2 className="text-xl font-bold text-foreground mb-2">
						Your AI Match Analysis
					</h2>
					<p className="text-muted-foreground leading-relaxed">
						{recommendation ||
							"Complete your profile to get personalized program recommendations and fit analysis."}
					</p>

					<div className="mt-4 flex flex-wrap gap-3 text-sm">
						{/* Profile Completeness Badge */}
						<div
							className={`px-3 py-1 rounded-full font-medium border flex items-center gap-1.5 ${
								isProfileComplete
									? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
									: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
							}`}
						>
							{isProfileComplete
								? "✓ Profile Complete"
								: `⚡ Profile ${profileCompleteness}% Complete`}
						</div>

						{/* Matched Count Badge */}
						<div className="px-3 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-full font-medium border border-blue-500/20">
							{totalMatched.toLocaleString()} Matches Found
						</div>

						{/* Missing Fields Warning */}
						{!isProfileComplete && missingFields.length > 0 && (
							<div className="px-3 py-1 bg-muted text-muted-foreground rounded-full font-medium border border-border flex items-center gap-1.5">
								<AlertCircle className="w-3.5 h-3.5" />
								Missing: {missingFields.join(", ")}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
