"use client";

import { Handle, Position } from "@xyflow/react";
import { Target } from "lucide-react";
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
				"relative rounded-2xl border-2 shadow-lg transition-all duration-200",
				"min-w-[180px] px-5 py-4",
				isLocked
					? "bg-muted border-border"
					: "bg-gradient-to-br from-primary/10 to-primary/5 border-primary",
				selected && "ring-2 ring-primary ring-offset-2",
			)}
		>
			{/* Glow effect for unlocked state */}
			{!isLocked && (
				<div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl -z-10" />
			)}

			<div className="flex flex-col items-center gap-2 text-center">
				<div
					className={cn(
						"flex items-center justify-center w-10 h-10 rounded-full",
						isLocked ? "bg-muted-foreground/20" : "bg-primary/20",
					)}
				>
					<Target
						className={cn(
							"w-5 h-5",
							isLocked ? "text-muted-foreground" : "text-primary",
						)}
					/>
				</div>

				{isLocked ? (
					<>
						<span className="text-sm font-medium text-muted-foreground">
							Your Archetype
						</span>
						<span className="text-xs text-muted-foreground/70">
							{data.unlockHint || "Complete all tracks to unlock"}
						</span>
					</>
				) : (
					<>
						<span className="text-base font-bold text-foreground">
							{data.archetype || "The Innovator"}
						</span>
						<span className="text-xs text-muted-foreground">
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
