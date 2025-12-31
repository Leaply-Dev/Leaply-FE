"use client";

import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { Lock, Sparkles, User } from "lucide-react";
import { memo } from "react";
import { ARCHETYPES } from "@/lib/constants/archetypes";
import type { GraphNodeData } from "@/lib/types/persona-graph";
import { cn } from "@/lib/utils";
import { LAYOUT_CONFIG } from "@/lib/hooks/useConcentricLayout";

// Layer 0 color
const PROFILE_COLOR = LAYOUT_CONFIG.colors[0]; // Indigo

// Animation variants for node appearance
const nodeVariants = {
	initial: {
		scale: 0.5,
		opacity: 0,
	},
	animate: {
		scale: 1,
		opacity: 1,
		transition: {
			type: "spring" as const,
			stiffness: 300,
			damping: 25,
		},
	},
};

interface ProfileSummaryNodeProps {
	data: GraphNodeData;
	selected?: boolean;
}

/**
 * ProfileSummaryNode - Layer 0 (Center)
 *
 * The largest node at the center of the graph.
 * Shows archetype information when revealed.
 */
function ProfileSummaryNodeComponent({ data, selected }: ProfileSummaryNodeProps) {
	const isMacroView = data.zoom && data.zoom < 0.5;
	const hasArchetype = !!data.primaryArchetype;

	const primaryDef = data.primaryArchetype
		? ARCHETYPES[data.primaryArchetype]
		: null;
	const secondaryDef = data.secondaryArchetype
		? ARCHETYPES[data.secondaryArchetype]
		: null;

	// Macro View - Show large colored circle with icon
	if (isMacroView) {
		return (
			<motion.div
				className="group relative flex items-center justify-center"
				variants={nodeVariants}
				initial="initial"
				animate="animate"
			>
				<div
					className={cn(
						"w-24 h-24 rounded-full border-4 flex items-center justify-center",
						"transition-all duration-500 shadow-xl",
						selected && "ring-4 ring-indigo-400 ring-offset-2",
					)}
					style={{
						backgroundColor: hasArchetype
							? primaryDef?.color || PROFILE_COLOR
							: `${PROFILE_COLOR}20`,
						borderColor: hasArchetype
							? `${primaryDef?.color}80` || `${PROFILE_COLOR}80`
							: `${PROFILE_COLOR}40`,
					}}
				>
					{hasArchetype ? (
						<Sparkles className="w-10 h-10 text-white" />
					) : (
						<Lock className="w-10 h-10 text-indigo-400" />
					)}
				</div>
				{/* Handles - all directions for center node */}
				<Handle type="source" position={Position.Top} id="top" className="!opacity-0" />
				<Handle type="source" position={Position.Right} id="right" className="!opacity-0" />
				<Handle type="source" position={Position.Bottom} id="bottom" className="!opacity-0" />
				<Handle type="source" position={Position.Left} id="left" className="!opacity-0" />
			</motion.div>
		);
	}

	// Full View - Show detailed profile card
	return (
		<motion.div
			className={cn(
				"relative rounded-2xl border-3 shadow-xl transition-all duration-300 overflow-hidden",
				"min-w-[150px] max-w-[180px] p-5",
				"bg-background",
				"flex flex-col items-center text-center",
				selected && "ring-4 ring-offset-2 ring-indigo-500",
				data.isHovered && "shadow-2xl scale-[1.02]",
			)}
			style={{
				borderColor: hasArchetype
					? primaryDef?.color || PROFILE_COLOR
					: PROFILE_COLOR,
				backgroundColor: hasArchetype
					? `${primaryDef?.color}08` || `${PROFILE_COLOR}08`
					: `${PROFILE_COLOR}06`,
			}}
			variants={nodeVariants}
			initial="initial"
			animate="animate"
		>
			{/* Glow effect */}
			<div
				className="absolute -inset-2 opacity-20 blur-xl rounded-full"
				style={{
					backgroundColor: hasArchetype
						? primaryDef?.color || PROFILE_COLOR
						: PROFILE_COLOR,
				}}
			/>

			{/* Content */}
			<div className="relative z-10 flex flex-col items-center gap-3">
				{/* Icon/Avatar */}
				<div
					className={cn(
						"w-14 h-14 rounded-full flex items-center justify-center",
						"border-2 shadow-md",
					)}
					style={{
						backgroundColor: hasArchetype
							? primaryDef?.color || PROFILE_COLOR
							: `${PROFILE_COLOR}15`,
						borderColor: hasArchetype
							? `${primaryDef?.color}60` || `${PROFILE_COLOR}60`
							: `${PROFILE_COLOR}30`,
					}}
				>
					{hasArchetype ? (
						<Sparkles className="w-7 h-7 text-white" />
					) : (
						<User className="w-7 h-7" style={{ color: PROFILE_COLOR }} />
					)}
				</div>

				{/* Title */}
				<div>
					{hasArchetype && primaryDef ? (
						<>
							<h3
								className="text-base font-bold"
								style={{ color: primaryDef.color }}
							>
								{primaryDef.title}
							</h3>
							{secondaryDef && (
								<p className="text-xs text-muted-foreground mt-0.5">
									+ {secondaryDef.title}
								</p>
							)}
						</>
					) : (
						<>
							<h3 className="text-sm font-semibold text-foreground">
								{data.title || "Hồ sơ cá nhân"}
							</h3>
							<p className="text-xs text-muted-foreground mt-1">
								Hoàn thành thêm tracks để khám phá
							</p>
						</>
					)}
				</div>

				{/* Tags */}
				{data.tags && data.tags.length > 0 && (
					<div className="flex flex-wrap justify-center gap-1 mt-1">
						{data.tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
								style={{
									backgroundColor: `${PROFILE_COLOR}15`,
									color: PROFILE_COLOR,
								}}
							>
								{tag}
							</span>
						))}
					</div>
				)}

				{/* Confidence indicator */}
				{hasArchetype && data.confidence > 0 && (
					<div className="w-full mt-2">
						<div className="h-1 bg-muted rounded-full overflow-hidden">
							<div
								className="h-full rounded-full transition-all"
								style={{
									width: `${data.confidence * 100}%`,
									backgroundColor: primaryDef?.color || PROFILE_COLOR,
								}}
							/>
						</div>
						<p className="text-[9px] text-muted-foreground mt-0.5">
							{Math.round(data.confidence * 100)}% confidence
						</p>
					</div>
				)}
			</div>

			{/* Handles - source from all directions */}
			<Handle type="source" position={Position.Top} id="top" className="w-2 h-2 !opacity-0" />
			<Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !opacity-0" />
			<Handle type="source" position={Position.Bottom} id="bottom" className="w-2 h-2 !opacity-0" />
			<Handle type="source" position={Position.Left} id="left" className="w-2 h-2 !opacity-0" />
		</motion.div>
	);
}

export const ProfileSummaryNode = memo(ProfileSummaryNodeComponent);
