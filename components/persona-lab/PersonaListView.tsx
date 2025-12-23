"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	BookOpen,
	ChevronDown,
	ChevronRight,
	Gem,
	Lightbulb,
	Sparkles,
	Target,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ARCHETYPES } from "@/lib/constants/archetypes";
import { TRACK_COLORS, TRACK_IDS, TRACKS } from "@/lib/constants/tracks";
import { usePersonaStore } from "@/lib/store/personaStore";
import type { CanvasNode, TrackId } from "@/lib/types/persona";
import { cn } from "@/lib/utils";

const TRACK_ICONS: Record<TrackId, React.ReactNode> = {
	future_vision: <Target className="w-5 h-5" />,
	academic_journey: <BookOpen className="w-5 h-5" />,
	activities_impact: <Sparkles className="w-5 h-5" />,
	values_turning_points: <Gem className="w-5 h-5" />,
};

// Friendly topic labels
const TOPIC_LABELS: Record<TrackId, string> = {
	future_vision: "Your Future Vision",
	academic_journey: "Your Learning Journey",
	activities_impact: "Your Impact & Activities",
	values_turning_points: "Your Values & Growth",
};

interface TopicSummaryCardProps {
	trackId: TrackId;
	isCompleted: boolean;
	nodes: CanvasNode[];
}

function TopicSummaryCard({
	trackId,
	isCompleted,
	nodes,
}: TopicSummaryCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const colors = TRACK_COLORS[trackId];
	const label = TOPIC_LABELS[trackId];

	const stories = nodes.filter((n) => n.type === "story");
	const insights = nodes.filter((n) => n.type === "insight");
	const topStory = stories[0];
	const topInsight = insights[0];

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

				{nodes.length > 0 ? (
					<div className="space-y-3">
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
						{topInsight && (
							<div
								className="flex items-start gap-2 bg-background/50 rounded-lg p-2.5 border border-dashed"
								style={{ borderColor: `${colors.primary}30` }}
							>
								<Lightbulb
									className="w-4 h-4 shrink-0 mt-0.5"
									style={{ color: colors.primary }}
								/>
								<span className="text-sm text-foreground/90 line-clamp-2">
									{topInsight.content || topInsight.title}
								</span>
							</div>
						)}

						{/* Expand toggle */}
						{stories.length > 1 && (
							<button
								type="button"
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
										See {stories.length - 1} more{" "}
										{stories.length === 2 ? "story" : "stories"}
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
				{isExpanded && stories.length > 1 && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<div className="px-4 pb-4 space-y-2">
							<div className="h-px bg-border" />
							{stories.slice(1).map((story) => (
								<div
									key={story.id}
									className="p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
								>
									<p className="text-sm font-medium text-foreground">
										{story.title}
									</p>
									<p className="text-xs text-muted-foreground line-clamp-2 mt-1">
										{story.content}
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
	const { tracks, nodes, archetype, getTrackProgress } = usePersonaStore();
	const { completed: completedCount, total } = getTrackProgress();

	// Check if all tracks completed
	const allCompleted = completedCount === total;

	// Get archetype definition if revealed
	const archetypeDef = archetype
		? ARCHETYPES[archetype.type as keyof typeof ARCHETYPES]
		: null;

	// Group nodes by track
	const nodesByTrack: Record<TrackId, CanvasNode[]> = {
		future_vision: [],
		academic_journey: [],
		activities_impact: [],
		values_turning_points: [],
	};

	for (const node of nodes) {
		if (node.sourceTrackId) {
			nodesByTrack[node.sourceTrackId].push(node);
		}
	}

	return (
		<ScrollArea className="h-full">
			<div className="p-6 h-full flex flex-col gap-6 max-w-2xl mx-auto">
				{/* Core Archetype Card */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className={cn(
						"rounded-2xl border-2 p-6 text-center",
						archetype
							? "bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary"
							: "bg-muted/30 border-border border-dashed",
					)}
				>
					<div
						className={cn(
							"w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
							archetype
								? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg"
								: "bg-muted",
						)}
					>
						{archetype ? (
							<Sparkles className="w-8 h-8 animate-pulse" />
						) : (
							<Target className="w-8 h-8 text-muted-foreground" />
						)}
					</div>

					{archetype && archetypeDef ? (
						<>
							<h2 className="text-xl font-bold text-foreground">
								{archetypeDef.title}
							</h2>
							<p className="text-sm text-muted-foreground mt-1">
								{archetypeDef.tagline}
							</p>
							{archetype.personalizedSummary && (
								<p className="text-sm text-foreground/80 mt-3 max-w-md mx-auto">
									{archetype.personalizedSummary}
								</p>
							)}
						</>
					) : (
						<>
							<h2 className="text-base font-medium text-muted-foreground">
								Your Archetype
							</h2>
							<p className="text-sm text-muted-foreground/70 mt-1">
								{completedCount}/{total} topics completed
							</p>
						</>
					)}
				</motion.div>

				{/* Topic Summary Cards */}
				<div className="space-y-4">
					{TRACK_IDS.map((trackId, index) => {
						const track = tracks[trackId];
						const trackNodes = nodesByTrack[trackId];
						const isCompleted = track.status === "completed";

						return (
							<motion.div
								key={trackId}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<TopicSummaryCard
									trackId={trackId}
									isCompleted={isCompleted}
									nodes={trackNodes}
								/>
							</motion.div>
						);
					})}
				</div>

				{/* Empty state encouragement */}
				{completedCount === 0 && nodes.length === 0 && (
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
