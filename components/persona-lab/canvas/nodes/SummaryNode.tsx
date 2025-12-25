"use client";

import { Handle, Position } from "@xyflow/react";
import { ChevronRight, FileText, Loader2 } from "lucide-react";
import { TRACK_COLORS, TRACKS } from "@/lib/constants/tracks";
import type { TrackId, TrackStatus } from "@/lib/types/persona";
import { cn } from "@/lib/utils";

export interface SummaryNodeData {
	trackId: TrackId;
	status: TrackStatus;
	completionPercentage?: number;
	summary?: string;
	isLoading?: boolean;
	zoom?: number;
	[key: string]: unknown;
}

interface SummaryNodeProps {
	data: SummaryNodeData;
	selected?: boolean;
}

export function SummaryNode({ data, selected }: SummaryNodeProps) {
	const colors = TRACK_COLORS[data.trackId];
	const trackDef = TRACKS[data.trackId];
	const isLoading = data.isLoading;
	const isCompleted = data.status === "completed";
	const isInProgress = data.status === "in_progress";
	const isNotStarted = data.status === "not_started";

	const isMacroView = data.zoom && data.zoom < 0.5;

	// Get completion percentage (0-100)
	const percentage = data.completionPercentage ?? 0;

	// Macro View (Deep Zoom Out) - Circle with progress ring
	if (isMacroView) {
		return (
			<div className="group relative flex items-center justify-center">
				{/* Progress ring */}
				<svg className="w-14 h-14 -rotate-90">
					{/* Background circle */}
					<circle
						cx="28"
						cy="28"
						r="24"
						fill="none"
						stroke="currentColor"
						strokeWidth="4"
						className="text-muted"
					/>
					{/* Progress circle */}
					<circle
						cx="28"
						cy="28"
						r="24"
						fill="none"
						stroke={colors.primary}
						strokeWidth="4"
						strokeLinecap="round"
						strokeDasharray={`${(percentage / 100) * 150.8} 150.8`}
						className="transition-all duration-500"
					/>
				</svg>
				{/* Center content */}
				<div
					className="absolute inset-0 flex items-center justify-center text-xs font-bold"
					style={{ color: colors.primary }}
				>
					{isLoading ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						`${percentage}%`
					)}
				</div>
				{/* Tooltip on hover */}
				<div className="absolute top-16 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 px-2 py-1 rounded text-[10px] font-bold border border-border z-10">
					{trackDef.displayName}
				</div>
				{/* Handles */}
				<Handle
					type="target"
					position={Position.Top}
					id={Position.Top}
					className="!opacity-0"
				/>
				<Handle
					type="target"
					position={Position.Left}
					id={Position.Left}
					className="!opacity-0"
				/>
				<Handle
					type="target"
					position={Position.Bottom}
					id={Position.Bottom}
					className="!opacity-0"
				/>
				<Handle
					type="target"
					position={Position.Right}
					id={Position.Right}
					className="!opacity-0"
				/>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"relative rounded-xl border-2 shadow-md transition-all duration-500 cursor-pointer overflow-hidden",
				"min-w-[180px] max-w-[200px] px-4 py-3",
				"hover:shadow-xl hover:scale-[1.02]",
				"bg-background",
				selected && "ring-2 ring-offset-2",
			)}
			style={{
				borderColor: isLoading ? "hsl(var(--border))" : colors.primary,
				backgroundColor: isLoading ? "hsl(var(--muted))" : colors.light,
			}}
		>
			{/* Glow effect for completed */}
			{isCompleted && (
				<div
					className="absolute -inset-1 opacity-20 blur-xl transition-all"
					style={{ backgroundColor: colors.primary }}
				/>
			)}

			<div className="relative z-10 flex items-start gap-3">
				{/* Icon with progress indicator */}
				<div className="relative">
					<div
						className={cn(
							"flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
							isLoading && "animate-pulse bg-muted",
						)}
						style={
							!isLoading
								? { backgroundColor: `${colors.primary}20` }
								: undefined
						}
					>
						{isLoading ? (
							<Loader2
								className="w-5 h-5 animate-spin text-muted-foreground"
							/>
						) : (
							<FileText
								className="w-5 h-5"
								style={{ color: colors.primary }}
							/>
						)}
					</div>
					{/* Mini progress ring */}
					{!isLoading && !isNotStarted && (
						<svg className="absolute -bottom-1 -right-1 w-5 h-5 -rotate-90">
							<circle
								cx="10"
								cy="10"
								r="8"
								fill="hsl(var(--background))"
								stroke="hsl(var(--border))"
								strokeWidth="1"
							/>
							<circle
								cx="10"
								cy="10"
								r="6"
								fill="none"
								stroke={colors.primary}
								strokeWidth="2"
								strokeLinecap="round"
								strokeDasharray={`${(percentage / 100) * 37.7} 37.7`}
							/>
						</svg>
					)}
				</div>

				<div className="flex-1 min-w-0">
					{isLoading ? (
						<>
							{/* Loading skeleton */}
							<div className="h-4 w-24 bg-muted-foreground/20 rounded animate-pulse" />
							<div className="h-3 w-16 bg-muted-foreground/10 rounded animate-pulse mt-1.5" />
						</>
					) : (
						<>
							<span className="text-sm font-semibold text-foreground line-clamp-1">
								{trackDef.displayName}
							</span>
							<div className="flex items-center gap-2 mt-1">
								{/* Status badge */}
								<span
									className={cn(
										"inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium",
									)}
									style={{
										backgroundColor: isCompleted
											? `${colors.primary}20`
											: "hsl(var(--muted))",
										color: isCompleted
											? colors.primary
											: "hsl(var(--muted-foreground))",
									}}
								>
									{isCompleted
										? "Completed"
										: isInProgress
											? "In Progress"
											: "Not Started"}
								</span>
								{/* Percentage */}
								{!isNotStarted && (
									<span
										className="text-[10px] font-bold"
										style={{ color: colors.primary }}
									>
										{percentage}%
									</span>
								)}
							</div>
							{/* Summary preview */}
							{data.summary && (
								<p className="text-[11px] text-muted-foreground mt-2 line-clamp-2 leading-tight">
									{data.summary}
								</p>
							)}
						</>
					)}
				</div>

				{!isLoading && (
					<ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
				)}
			</div>

			{/* Progress bar at bottom */}
			{!isLoading && !isNotStarted && (
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
					<div
						className="h-full transition-all duration-500"
						style={{
							width: `${percentage}%`,
							backgroundColor: colors.primary,
						}}
					/>
				</div>
			)}

			{/* Handles - all sides for flexible connections */}
			<Handle
				type="target"
				position={Position.Top}
				id={Position.Top}
				className="w-2 h-2 !opacity-0"
				style={{ backgroundColor: colors.primary }}
			/>
			<Handle
				type="target"
				position={Position.Left}
				id={Position.Left}
				className="w-2 h-2 !opacity-0"
				style={{ backgroundColor: colors.primary }}
			/>
			<Handle
				type="target"
				position={Position.Bottom}
				id={Position.Bottom}
				className="w-2 h-2 !opacity-0"
				style={{ backgroundColor: colors.primary }}
			/>
			<Handle
				type="target"
				position={Position.Right}
				id={Position.Right}
				className="w-2 h-2 !opacity-0"
				style={{ backgroundColor: colors.primary }}
			/>
		</div>
	);
}
