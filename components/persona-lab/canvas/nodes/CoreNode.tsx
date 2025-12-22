"use client";

import { Handle, Position } from "@xyflow/react";
import { Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CoreNodeData {
	state: "locked" | "unlocked";
	archetype?: string;
	subtitle?: string;
	unlockHint?: string;
	[key: string]: unknown;
}

interface CoreNodeProps {
	data: CoreNodeData;
	selected?: boolean;
}

export function CoreNode({ data, selected }: CoreNodeProps) {
	const isLocked = data.state === "locked";

	return (
		<div
			className={cn(
				"relative rounded-2xl border-2 shadow-lg transition-all duration-200 cursor-pointer",
				"min-w-[200px] px-6 py-5",
				"hover:shadow-xl hover:scale-[1.02]",
				isLocked
					? "bg-muted border-border"
					: "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary",
				selected && "ring-2 ring-primary ring-offset-2",
			)}
		>
			{/* Glow effect for unlocked state */}
			{!isLocked && (
				<div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl -z-10 animate-pulse" />
			)}

			<div className="flex flex-col items-center gap-3 text-center">
				<div
					className={cn(
						"flex items-center justify-center w-12 h-12 rounded-full",
						isLocked
							? "bg-muted-foreground/20"
							: "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg",
					)}
				>
					{isLocked ? (
						<Target className="w-6 h-6 text-muted-foreground" />
					) : (
						<Sparkles className="w-6 h-6 animate-pulse" />
					)}
				</div>

				{isLocked ? (
					<>
						<span className="text-sm font-medium text-muted-foreground">
							Your Archetype
						</span>
						<span className="text-xs text-muted-foreground/70 max-w-[160px]">
							{data.unlockHint || "Complete all topics to discover"}
						</span>
					</>
				) : (
					<>
						<span className="text-lg font-bold text-foreground">
							{data.archetype || "The Innovator"}
						</span>
						<span className="text-sm text-muted-foreground max-w-[180px]">
							{data.subtitle || "Your unique identity"}
						</span>
					</>
				)}
			</div>

			{/* Handles for connections - all sides with IDs */}
			<Handle
				type="source"
				position={Position.Top}
				id={Position.Top}
				className="w-2 h-2 !bg-primary !opacity-0 hover:!opacity-100"
			/>
			<Handle
				type="source"
				position={Position.Right}
				id={Position.Right}
				className="w-2 h-2 !bg-primary !opacity-0 hover:!opacity-100"
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id={Position.Bottom}
				className="w-2 h-2 !bg-primary !opacity-0 hover:!opacity-100"
			/>
			<Handle
				type="source"
				position={Position.Left}
				id={Position.Left}
				className="w-2 h-2 !bg-primary !opacity-0 hover:!opacity-100"
			/>
		</div>
	);
}
