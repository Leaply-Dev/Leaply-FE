"use client";

import { useState } from "react";
import {
	Target,
	FileText,
	List,
	Lightbulb,
	Eye,
	EyeOff,
	ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type NodeLayer } from "@/lib/utils/canvasLayout";

interface LayerConfig {
	id: NodeLayer;
	label: string;
	icon: React.ReactNode;
}

const LAYERS: LayerConfig[] = [
	{ id: "core", label: "Core", icon: <Target className="w-3.5 h-3.5" /> },
	{
		id: "summary",
		label: "Summary",
		icon: <FileText className="w-3.5 h-3.5" />,
	},
	{ id: "evidence", label: "Evidence", icon: <List className="w-3.5 h-3.5" /> },
	{
		id: "insight",
		label: "Insights",
		icon: <Lightbulb className="w-3.5 h-3.5" />,
	},
];

interface CanvasControlsProps {
	className?: string;
}

export function CanvasControls({ className }: CanvasControlsProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [visibleLayers, setVisibleLayers] = useState<Record<NodeLayer, boolean>>(
		{
			core: true,
			summary: true,
			evidence: true,
			insight: true,
		},
	);

	const toggleLayer = (layerId: NodeLayer) => {
		setVisibleLayers((prev) => ({
			...prev,
			[layerId]: !prev[layerId],
		}));
	};

	const allVisible = Object.values(visibleLayers).every(Boolean);
	const noneVisible = Object.values(visibleLayers).every((v) => !v);

	const toggleAll = () => {
		const newState = !allVisible;
		setVisibleLayers({
			core: newState,
			summary: newState,
			evidence: newState,
			insight: newState,
		});
	};

	return (
		<div
			className={cn(
				"bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-md",
				"transition-all duration-200",
				className,
			)}
		>
			{/* Header - always visible */}
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className={cn(
					"flex items-center justify-between w-full px-3 py-2",
					"hover:bg-muted/50 transition-colors",
					isExpanded && "border-b border-border",
				)}
			>
				<div className="flex items-center gap-2">
					{allVisible ? (
						<Eye className="w-4 h-4 text-muted-foreground" />
					) : (
						<EyeOff className="w-4 h-4 text-muted-foreground" />
					)}
					<span className="text-sm font-medium">Layers</span>
				</div>
				<ChevronDown
					className={cn(
						"w-4 h-4 text-muted-foreground transition-transform",
						isExpanded && "rotate-180",
					)}
				/>
			</button>

			{/* Expanded content */}
			{isExpanded && (
				<div className="p-2 space-y-1">
					{/* Toggle all button */}
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleAll}
						className="w-full justify-start text-xs h-7"
					>
						{allVisible ? (
							<>
								<EyeOff className="w-3 h-3 mr-2" />
								Hide All
							</>
						) : (
							<>
								<Eye className="w-3 h-3 mr-2" />
								Show All
							</>
						)}
					</Button>

					<div className="h-px bg-border my-1" />

					{/* Layer toggles */}
					{LAYERS.map((layer) => (
						<button
							key={layer.id}
							type="button"
							onClick={() => toggleLayer(layer.id)}
							className={cn(
								"flex items-center gap-2 w-full px-2 py-1.5 rounded-md",
								"text-sm transition-colors",
								visibleLayers[layer.id]
									? "bg-primary/10 text-foreground"
									: "text-muted-foreground hover:bg-muted/50",
							)}
						>
							<div
								className={cn(
									"flex items-center justify-center w-5 h-5 rounded",
									visibleLayers[layer.id] ? "bg-primary/20" : "bg-muted",
								)}
							>
								{layer.icon}
							</div>
							<span>{layer.label}</span>
							{visibleLayers[layer.id] && (
								<Eye className="w-3 h-3 ml-auto opacity-50" />
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
