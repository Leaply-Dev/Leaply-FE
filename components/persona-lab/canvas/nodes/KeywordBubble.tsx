"use client";

import { motion } from "framer-motion";
import { TRACK_COLORS } from "@/lib/constants/tracks";
import type { TrackId } from "@/lib/types/persona";
import { cn } from "@/lib/utils";

export interface KeywordBubbleProps {
	keyword: string;
	trackId: TrackId;
	index: number; // For positioning in arc
	totalKeywords: number;
	className?: string;
}

export function KeywordBubble({
	keyword,
	trackId,
	index,
	totalKeywords,
	className,
}: KeywordBubbleProps) {
	const colors = TRACK_COLORS[trackId];

	// Calculate position in arc around the summary node
	// Keywords spread in an arc from -30deg to +30deg
	const angleRange = 60; // degrees
	const startAngle = -angleRange / 2;
	const angleStep = totalKeywords > 1 ? angleRange / (totalKeywords - 1) : 0;
	const angle = startAngle + index * angleStep;

	// Distance from center
	const distance = 60 + (index % 2) * 15; // Stagger for visual interest

	// Convert to x,y offset
	const radians = (angle * Math.PI) / 180;
	const x = Math.sin(radians) * distance;
	const y = -Math.cos(radians) * distance - 40; // Above the node

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.5, y: 10 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{
				duration: 0.3,
				delay: index * 0.1,
				ease: "easeOut",
			}}
			className={cn(
				"absolute pointer-events-none",
				"px-2 py-0.5 rounded-full text-[10px] font-medium",
				"shadow-sm border whitespace-nowrap",
				className,
			)}
			style={{
				left: `calc(50% + ${x}px)`,
				top: `${y}px`,
				transform: "translateX(-50%)",
				backgroundColor: `${colors.primary}15`,
				borderColor: `${colors.primary}40`,
				color: colors.primary,
			}}
		>
			{keyword}
		</motion.div>
	);
}

// Container for multiple keywords around a node
export interface KeywordCloudProps {
	keywords: Array<{ id: string; keyword: string }>;
	trackId: TrackId;
	className?: string;
}

export function KeywordCloud({
	keywords,
	trackId,
	className,
}: KeywordCloudProps) {
	// Limit to most recent 6 keywords for display
	const displayKeywords = keywords.slice(-6);

	if (displayKeywords.length === 0) return null;

	return (
		<div className={cn("absolute inset-0 overflow-visible", className)}>
			{displayKeywords.map((kw, idx) => (
				<KeywordBubble
					key={kw.id}
					keyword={kw.keyword}
					trackId={trackId}
					index={idx}
					totalKeywords={displayKeywords.length}
				/>
			))}
		</div>
	);
}
