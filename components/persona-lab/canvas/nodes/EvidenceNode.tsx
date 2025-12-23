"use client";

import { Handle, Position } from "@xyflow/react";
import { BookOpen, ChevronRight } from "lucide-react";
import { NODE_TYPE_COLORS, TRACK_COLORS } from "@/lib/constants/tracks";
import type { TrackId } from "@/lib/types/persona";
import { cn } from "@/lib/utils";

export interface EvidenceNodeData {
	id: string;
	title: string;
	content?: string;
	sourceTrackId: TrackId | null;
	zoom?: number;
	[key: string]: unknown;
}

interface EvidenceNodeProps {
	data: EvidenceNodeData;
	selected?: boolean;
}

// Evidence nodes are colored grey/stone (by type)
const evidenceColors = NODE_TYPE_COLORS.evidence;

export function EvidenceNode({ data, selected }: EvidenceNodeProps) {
	const trackColors = data.sourceTrackId
		? TRACK_COLORS[data.sourceTrackId]
		: null;

	const isMacroView = data.zoom && data.zoom < 0.5;
	const isMicroView = !data.zoom || data.zoom > 0.7;

	// Macro view - hidden
	if (isMacroView) {
		return (
			<div className="opacity-0 scale-50 pointer-events-none">
				<Handle
					type="target"
					position={Position.Top}
					id={Position.Top}
					className="!opacity-0"
				/>
				<Handle
					type="source"
					position={Position.Bottom}
					id={Position.Bottom}
					className="!opacity-0"
				/>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"relative rounded-lg border shadow-sm transition-all duration-300 cursor-pointer",
				"min-w-[130px] max-w-[160px] px-3 py-2.5",
				"hover:shadow-md hover:scale-[1.02]",
				"bg-background",
				selected && "ring-2 ring-offset-1 ring-stone-500",
				!isMicroView && "scale-90 opacity-80",
			)}
			style={{
				borderColor: evidenceColors.primary,
				backgroundColor: `${evidenceColors.primary}08`,
			}}
		>
			<div className="flex items-center gap-2">
				{/* Icon */}
				<div
					className={cn(
						"flex items-center justify-center w-6 h-6 rounded shrink-0",
					)}
					style={{ backgroundColor: `${evidenceColors.primary}15` }}
				>
					<BookOpen
						className="w-3 h-3"
						style={{ color: evidenceColors.primary }}
					/>
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0">
					<span className="text-xs font-semibold text-foreground line-clamp-1">
						{data.title || "Evidence"}
					</span>
					{isMicroView && data.content && (
						<p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
							{data.content}
						</p>
					)}
				</div>

				<ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
			</div>

			{/* Type and track badges */}
			{isMicroView && (
				<div className="flex flex-wrap gap-1 mt-1.5">
					{trackColors && data.sourceTrackId && (
						<span
							className="inline-block text-[9px] px-1 py-0.5 rounded font-medium"
							style={{
								backgroundColor: `${trackColors.primary}15`,
								color: trackColors.primary,
							}}
						>
							{data.sourceTrackId.replace(/_/g, " ")}
						</span>
					)}
					<span
						className="inline-block text-[9px] px-1 py-0.5 rounded font-medium"
						style={{
							backgroundColor: `${evidenceColors.primary}15`,
							color: evidenceColors.primary,
						}}
					>
						Evidence
					</span>
				</div>
			)}

			{/* Handles */}
			<Handle
				type="target"
				position={Position.Top}
				id={Position.Top}
				className="w-1.5 h-1.5 !opacity-0"
				style={{ backgroundColor: evidenceColors.primary }}
			/>
			<Handle
				type="target"
				position={Position.Left}
				id={Position.Left}
				className="w-1.5 h-1.5 !opacity-0"
				style={{ backgroundColor: evidenceColors.primary }}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id={Position.Bottom}
				className="w-1.5 h-1.5 !opacity-0"
				style={{ backgroundColor: evidenceColors.primary }}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id={Position.Right}
				className="w-1.5 h-1.5 !opacity-0"
				style={{ backgroundColor: evidenceColors.primary }}
			/>
		</div>
	);
}
