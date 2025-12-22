"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
	BookOpen,
	ChevronDown,
	ChevronRight,
	Lightbulb,
	Sparkles,
	Target,
} from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { usePersonaStore, type TrackId } from "@/lib/store/personaStore";
import { TRACK_COLORS } from "@/lib/constants/personaColors";
import { cn } from "@/lib/utils";

const TRACK_ICONS: Record<TrackId, React.ReactNode> = {
	academic: <BookOpen className="w-5 h-5" />,
	activities: <Sparkles className="w-5 h-5" />,
	values: <Target className="w-5 h-5" />,
	future: <Lightbulb className="w-5 h-5" />,
};

// Friendly topic labels
const TOPIC_LABELS: Record<TrackId, string> = {
	academic: "Your Learning Story",
	activities: "What Drives You",
	values: "Your Core Beliefs",
	future: "Where You're Headed",
};

// Track order for display
const TRACK_ORDER: TrackId[] = ["academic", "activities", "values", "future"];

interface TopicSummaryCardProps {
	trackId: TrackId;
	isCompleted: boolean;
	theme?: string;
	topStory?: { title: string; summary: string };
	insight?: string;
	allStories: Array<{ id: string; title: string; summary: string }>;
}

function TopicSummaryCard({
	trackId,
	isCompleted,
	theme,
	topStory,
	insight,
	allStories,
}: TopicSummaryCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const colors = TRACK_COLORS[trackId];
	const label = TOPIC_LABELS[trackId];

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className={cn(
				"rounded-xl border-2 overflow-hidden transition-all",
				isCompleted ? "bg-background" : "bg-muted/20 border-dashed opacity-60",
			)}
			style={
				isCompleted
					? { borderColor: colors.primary, backgroundColor: colors.light }
					: undefined
			}
		>
			{/* Header */}
			<div className="p-4">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-3">
						<div
							className={cn(
								"p-2 rounded-lg",
								isCompleted ? colors.bgClass : "bg-muted",
							)}
							style={isCompleted ? { color: colors.primary } : undefined}
						>
							{TRACK_ICONS[trackId]}
						</div>
						<h3
							className={cn(
								"font-semibold",
								isCompleted ? "text-foreground" : "text-muted-foreground",
							)}
						>
							{label}
						</h3>
					</div>
					{isCompleted && (
						<Badge
							variant="secondary"
							className="text-xs"
							style={{
								backgroundColor: `${colors.primary}15`,
								color: colors.primary,
							}}
						>
							Complete
						</Badge>
					)}
				</div>

				{isCompleted ? (
					<div className="space-y-3">
						{/* Key Theme */}
						{theme && (
							<div className="flex items-start gap-2">
								<span
									className="text-xs font-semibold uppercase tracking-wide shrink-0 pt-0.5"
									style={{ color: colors.primary }}
								>
									Theme
								</span>
								<span className="text-sm text-foreground">{theme}</span>
							</div>
						)}

						{/* Top Story */}
						{topStory && (
							<div className="flex items-start gap-2">
								<span
									className="text-xs font-semibold uppercase tracking-wide shrink-0 pt-0.5"
									style={{ color: colors.primary }}
								>
									Story
								</span>
								<span className="text-sm text-foreground line-clamp-1">
									{topStory.title}
								</span>
							</div>
						)}

						{/* AI Insight */}
						{insight && (
							<div className="flex items-start gap-2 bg-background/50 rounded-lg p-2.5 border border-dashed" style={{ borderColor: `${colors.primary}30` }}>
								<Lightbulb
									className="w-4 h-4 shrink-0 mt-0.5"
									style={{ color: colors.primary }}
								/>
								<span className="text-sm text-foreground/90 line-clamp-2">
									{insight}
								</span>
							</div>
						)}

						{/* Expand toggle */}
						{allStories.length > 1 && (
							<button
								onClick={() => setIsExpanded(!isExpanded)}
								className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors pt-1"
							>
								{isExpanded ? (
									<>
										<ChevronDown className="w-3 h-3" />
										Hide stories
									</>
								) : (
									<>
										<ChevronRight className="w-3 h-3" />
										See {allStories.length - 1} more {allStories.length === 2 ? "story" : "stories"}
									</>
								)}
							</button>
						)}
					</div>
				) : (
					<p className="text-sm text-muted-foreground/70 italic">
						Share your story to see insights
					</p>
				)}
			</div>

			{/* Expanded stories */}
			<AnimatePresence>
				{isExpanded && allStories.length > 1 && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<div className="px-4 pb-4 space-y-2">
							<div className="h-px bg-border" />
							{allStories.slice(1).map((story, idx) => (
								<div
									key={story.id || idx}
									className="p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
								>
									<p className="text-sm font-medium text-foreground">
										{story.title}
									</p>
									<p className="text-xs text-muted-foreground line-clamp-2 mt-1">
										{story.summary}
									</p>
								</div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

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
			<div className="p-6 h-full flex flex-col gap-6 max-w-2xl mx-auto">
				{/* Core Archetype Card */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className={cn(
						"rounded-2xl border-2 p-6 text-center",
						allCompleted
							? "bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary"
							: "bg-muted/30 border-border border-dashed",
					)}
				>
					<div
						className={cn(
							"w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
							allCompleted
								? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg"
								: "bg-muted",
						)}
					>
						{allCompleted ? (
							<Sparkles className="w-8 h-8 animate-pulse" />
						) : (
							<Target className="w-8 h-8 text-muted-foreground" />
						)}
					</div>

					{allCompleted ? (
						<>
							<h2 className="text-xl font-bold text-foreground">The Innovator</h2>
							<p className="text-sm text-muted-foreground mt-1">
								Bridge between tradition & technology
							</p>
						</>
					) : (
						<>
							<h2 className="text-base font-medium text-muted-foreground">
								Your Archetype
							</h2>
							<p className="text-sm text-muted-foreground/70 mt-1">
								{completedCount}/4 topics completed
							</p>
						</>
					)}
				</motion.div>

				{/* Topic Summary Cards */}
				<div className="space-y-4">
					{orderedTracks.map(({ track, stories }, index) => {
						const isCompleted = track.status === "completed";
						const firstStory = stories[0];

						return (
							<motion.div
								key={track.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<TopicSummaryCard
									trackId={track.id}
									isCompleted={isCompleted}
									theme={isCompleted ? getThemeForTrack(track.id) : undefined}
									topStory={
										isCompleted && firstStory
											? { title: firstStory.title, summary: firstStory.summary }
											: undefined
									}
									insight={isCompleted ? getInsightText(track.id) : undefined}
									allStories={stories.map((s) => ({
										id: s.id,
										title: s.title,
										summary: s.summary,
									}))}
								/>
							</motion.div>
						);
					})}
				</div>

				{/* Empty state encouragement */}
				{completedCount === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						className="text-center py-8"
					>
						<p className="text-sm text-muted-foreground">
							<Sparkles className="w-4 h-4 inline mr-1 text-primary" />
							Start sharing your story to see insights appear here
						</p>
					</motion.div>
				)}
			</div>
		</ScrollArea>
	);
}

function getThemeForTrack(trackId: TrackId): string {
	const themes: Record<TrackId, string> = {
		academic: "Hands-on problem solving with real community impact",
		activities: "Building collaborative networks for systemic change",
		values: "Bridging tradition and modern innovation authentically",
		future: "Technology as a tool for community empowerment",
	};
	return themes[trackId];
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
