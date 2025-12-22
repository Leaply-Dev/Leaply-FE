"use client";

import { Book, Gem, Lightbulb, Lock, Rocket, Star, Target } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePersonaStore, type TrackId } from "@/lib/store/personaStore";
import { TRACK_COLORS } from "@/lib/constants/personaColors";
import { cn } from "@/lib/utils";

const TRACK_ICONS: Record<TrackId, React.ReactNode> = {
	academic: <Book className="w-5 h-5" />,
	activities: <Star className="w-5 h-5" />,
	values: <Gem className="w-5 h-5" />,
	future: <Rocket className="w-5 h-5" />,
};

const TRACK_LABELS: Record<TrackId, string> = {
	academic: "Academic",
	activities: "Activities",
	values: "Values",
	future: "Future",
};

// Track order for 2x2 grid (clockwise from top-left)
const TRACK_ORDER: TrackId[] = ["future", "academic", "values", "activities"];

export function PersonaListView() {
	const { tracks, keyStories } = usePersonaStore();

	// Check if all tracks completed
	const allCompleted = tracks.every((t) => t.status === "completed");
	const completedCount = tracks.filter((t) => t.status === "completed").length;

	// Get track data in display order
	const orderedTracks = TRACK_ORDER.map((id) => {
		const track = tracks.find((t) => t.id === id)!;
		const stories = keyStories.filter((s) => s.sourceTrack === id);
		return { track, stories };
	});

	return (
		<ScrollArea className="h-full">
			<div className="p-6 h-full flex flex-col">
				{/* Core Archetype - Centered at top */}
				<div className="flex justify-center mb-6">
					<div
						className={cn(
							"rounded-2xl border-2 px-8 py-5 text-center max-w-sm",
							allCompleted
								? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary"
								: "bg-muted/30 border-border",
						)}
					>
						<div
							className={cn(
								"w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3",
								allCompleted ? "bg-primary/20" : "bg-muted",
							)}
						>
							<Target
								className={cn(
									"w-7 h-7",
									allCompleted ? "text-primary" : "text-muted-foreground",
								)}
							/>
						</div>
						{allCompleted ? (
							<>
								<h2 className="text-xl font-bold">The Innovator</h2>
								<p className="text-sm text-muted-foreground mt-1">
									Bridge between tradition & technology
								</p>
							</>
						) : (
							<>
								<h2 className="text-base font-medium text-muted-foreground">
									Your Archetype
								</h2>
								<p className="text-xs text-muted-foreground/70 mt-1">
									{completedCount}/4 tracks completed
								</p>
							</>
						)}
					</div>
				</div>

				{/* 2x2 Grid of Tracks */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 max-w-4xl mx-auto w-full">
					{orderedTracks.map(({ track, stories }) => {
						const colors = TRACK_COLORS[track.id];
						const isCompleted = track.status === "completed";
						const firstStory = stories[0];

						return (
							<div
								key={track.id}
								className={cn(
									"rounded-xl border-2 p-4 transition-all",
									isCompleted
										? "bg-background"
										: "bg-muted/20 border-dashed opacity-60",
								)}
								style={
									isCompleted
										? {
												borderColor: colors.primary,
												backgroundColor: colors.light,
											}
										: {}
								}
							>
								{/* Track Header */}
								<div className="flex items-center gap-3 mb-3">
									<div
										className={cn(
											"p-2 rounded-lg",
											isCompleted ? colors.bgClass : "bg-muted",
										)}
										style={isCompleted ? { color: colors.primary } : {}}
									>
										{TRACK_ICONS[track.id]}
									</div>
									<div className="flex-1">
										<h3
											className={cn(
												"font-semibold",
												isCompleted ? "text-foreground" : "text-muted-foreground",
											)}
										>
											{TRACK_LABELS[track.id]}
										</h3>
										{!isCompleted && (
											<span className="text-xs text-muted-foreground/70 flex items-center gap-1">
												<Lock className="w-3 h-3" />
												Complete to unlock
											</span>
										)}
									</div>
								</div>

								{isCompleted && firstStory ? (
									<>
										{/* Summary */}
										<div className="mb-3">
											<div
												className="text-[10px] font-semibold uppercase tracking-wider mb-1"
												style={{ color: colors.primary }}
											>
												Summary
											</div>
											<p className="text-sm font-medium line-clamp-2">
												{firstStory.title}
											</p>
										</div>

										{/* AI Insight */}
										<div
											className="rounded-lg border border-dashed p-2.5 bg-background/50"
											style={{ borderColor: `${colors.primary}50` }}
										>
											<div className="flex items-center gap-1.5 mb-1">
												<Lightbulb
													className="w-3.5 h-3.5"
													style={{ color: colors.primary }}
												/>
												<span
													className="text-[10px] font-semibold uppercase tracking-wider"
													style={{ color: colors.primary }}
												>
													Insight
												</span>
											</div>
											<p className="text-xs text-foreground/80 line-clamp-2">
												{getInsightText(track.id)}
											</p>
										</div>
									</>
								) : (
									<div className="flex-1 flex items-center justify-center py-6">
										<p className="text-sm text-muted-foreground/60 italic text-center">
											Answer questions to discover your{" "}
											{TRACK_LABELS[track.id].toLowerCase()} insights
										</p>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</ScrollArea>
	);
}

function getInsightText(trackId: TrackId): string {
	const insights: Record<TrackId, string> = {
		academic: "Connects theory to real-world impact through hands-on research",
		activities: "Builds networks for systemic change with collaborative approach",
		values: "Bridges tradition and innovation with authentic values",
		future: "Uses technology for community empowerment and social good",
	};
	return insights[trackId];
}
