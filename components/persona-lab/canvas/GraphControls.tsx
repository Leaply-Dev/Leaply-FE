"use client";

import { Eye, EyeOff, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface GraphControlsProps {
	showAllDetails: boolean;
	onToggleDetails: () => void;
	onFitView: () => void;
	className?: string;
}

/**
 * GraphControls - Control buttons for the concentric graph
 *
 * Positioned in top-right corner of the canvas.
 * Provides controls for:
 * - Toggling layer 3 (detail) visibility
 * - Fitting view to center
 */
export function GraphControls({
	showAllDetails,
	onToggleDetails,
	onFitView,
	className,
}: GraphControlsProps) {
	return (
		<TooltipProvider delayDuration={300}>
			<div
				className={cn(
					"absolute top-4 right-4 z-10",
					"flex flex-col gap-2",
					className,
				)}
			>
				{/* Toggle all details visibility */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant={showAllDetails ? "default" : "outline"}
							size="icon"
							onClick={onToggleDetails}
							className={cn(
								"w-9 h-9 shadow-md",
								showAllDetails && "bg-slate-600 hover:bg-slate-700",
							)}
						>
							{showAllDetails ? (
								<Eye className="w-4 h-4" />
							) : (
								<EyeOff className="w-4 h-4" />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent side="left">
						<p className="text-xs">
							{showAllDetails ? "Ẩn chi tiết" : "Hiện tất cả chi tiết"}
						</p>
					</TooltipContent>
				</Tooltip>

				{/* Fit view to center */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={onFitView}
							className="w-9 h-9 shadow-md"
						>
							<Maximize2 className="w-4 h-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="left">
						<p className="text-xs">Căn giữa graph</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	);
}
