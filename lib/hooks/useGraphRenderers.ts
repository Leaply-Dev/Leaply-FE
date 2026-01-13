import { useCallback } from "react";
import type { LinkObject, NodeObject } from "react-force-graph-2d";
import { EDGE_CONFIG, getNodeConfig } from "@/lib/config/graphConfig";
import type {
	ApiForceGraphNode,
	ForceGraphLink,
} from "@/lib/utils/graphTransform";

// Node types in the graph (matching API)
type NodeType = "profile_summary" | "essay_angle" | "key_story" | "detail";

// Alias for backwards compatibility
type ForceGraphNode = ApiForceGraphNode;

// Helper function to draw rounded rectangles on canvas
const roundRect = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
) => {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
};

// Get label background color based on node type
const getLabelBg = (type: string): string => {
	switch (type) {
		case "profile_summary":
			return "rgba(245, 158, 11, 0.9)"; // amber
		case "essay_angle":
			return "rgba(139, 92, 246, 0.9)"; // violet
		case "key_story":
			return "rgba(16, 185, 129, 0.9)"; // emerald
		case "detail":
			return "rgba(59, 130, 246, 0.85)"; // blue
		default:
			return "rgba(15, 23, 42, 0.9)"; // slate
	}
};

interface UseGraphRenderersProps {
	selectedNode: ForceGraphNode | null;
	hoveredNode: ForceGraphNode | null;
	showLabels: boolean;
	highlightNodes: Set<string>;
	highlightLinks: Set<string>;
	hiddenNodeTypes: Set<NodeType>;
}

export function useGraphRenderers({
	selectedNode,
	hoveredNode,
	showLabels,
	highlightNodes,
	highlightLinks,
	hiddenNodeTypes,
}: UseGraphRenderersProps) {
	// Paint node on canvas
	const paintNode = useCallback(
		(node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
			const graphNode = node as unknown as ForceGraphNode;
			const isSelected = selectedNode?.id === graphNode.id;
			const isHovered = hoveredNode?.id === graphNode.id;
			const isHighlighted = highlightNodes.has(graphNode.id);
			const isHidden = hiddenNodeTypes.has(graphNode.type as NodeType);
			const isFaded = (selectedNode && !isHighlighted) || isHidden;
			const config = getNodeConfig(graphNode.type as NodeType);
			const isSkeleton = (graphNode.data as { isSkeleton?: boolean })
				?.isSkeleton;

			// Apply fading effect
			if (isFaded) {
				ctx.globalAlpha = 0.15;
			} else {
				ctx.globalAlpha = 1.0;
			}

			// Node circle
			ctx.beginPath();
			ctx.arc(node.x || 0, node.y || 0, graphNode.size, 0, 2 * Math.PI);

			// Skeleton node: dashed border, no fill
			if (isSkeleton) {
				ctx.setLineDash([5 / globalScale, 3 / globalScale]);
				ctx.strokeStyle = graphNode.color;
				ctx.lineWidth = 2 / globalScale;
				ctx.stroke();
				ctx.setLineDash([]);
			} else {
				// Regular node: filled circle
				ctx.fillStyle =
					isSelected || isHovered ? config.hoverColor : graphNode.color;
				ctx.fill();

				// Selection ring
				if (isSelected) {
					ctx.strokeStyle = config.hoverColor;
					ctx.lineWidth = 3 / globalScale;
					ctx.stroke();
				}

				// Highlight ring for connected nodes
				if (isHighlighted && !isSelected) {
					ctx.strokeStyle = config.color;
					ctx.lineWidth = 2 / globalScale;
					ctx.stroke();
				}
			}

			// Reset alpha
			ctx.globalAlpha = 1.0;

			// Label - show all labels when enabled, or on hover/select
			const shouldShowLabel = showLabels || isHovered || isSelected;

			if (shouldShowLabel) {
				// Truncate long labels
				const maxLength = 20;
				const label =
					graphNode.label.length > maxLength
						? `${graphNode.label.slice(0, maxLength)}...`
						: graphNode.label;

				const fontSize = 12 / globalScale;
				ctx.font = `${fontSize}px Inter, sans-serif`;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";

				// Apply same fading to label
				if (isFaded) {
					ctx.globalAlpha = 0.15;
				}

				// Background with rounded corners
				const textWidth = ctx.measureText(label).width;
				const padding = 5 / globalScale;
				const radius = 4 / globalScale;
				const labelX = (node.x || 0) - textWidth / 2 - padding;
				const labelY = (node.y || 0) + graphNode.size + padding;
				const labelW = textWidth + padding * 2;
				const labelH = fontSize + padding * 2;

				// Use node-type colored background
				roundRect(ctx, labelX, labelY, labelW, labelH, radius);
				ctx.fillStyle = getLabelBg(graphNode.type);
				ctx.fill();

				// Text - white for colored backgrounds, dark for amber
				ctx.fillStyle =
					graphNode.type === "profile_summary" ? "#1f2937" : "#ffffff";
				ctx.fillText(
					label,
					node.x || 0,
					(node.y || 0) + graphNode.size + fontSize / 2 + padding * 2,
				);

				// Reset alpha
				ctx.globalAlpha = 1.0;
			}
		},
		[selectedNode, hoveredNode, showLabels, highlightNodes, hiddenNodeTypes],
	);

	// Paint link on canvas
	const paintLink = useCallback(
		(link: LinkObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
			const graphLink = link as unknown as ForceGraphLink;
			const config = EDGE_CONFIG[graphLink.type as keyof typeof EDGE_CONFIG];

			if (!link.source || !link.target) return;

			const start =
				typeof link.source === "object" ? link.source : { x: 0, y: 0 };
			const end =
				typeof link.target === "object" ? link.target : { x: 0, y: 0 };

			// Check if this link is highlighted
			const sourceId =
				typeof link.source === "object"
					? (link.source as ForceGraphNode).id
					: link.source;
			const targetId =
				typeof link.target === "object"
					? (link.target as ForceGraphNode).id
					: link.target;
			const linkId = `${sourceId}-${targetId}`;
			const isHighlighted = highlightLinks.has(linkId);

			// Check if either connected node type is hidden
			const sourceNode =
				typeof link.source === "object"
					? (link.source as ForceGraphNode)
					: null;
			const targetNode =
				typeof link.target === "object"
					? (link.target as ForceGraphNode)
					: null;
			const isConnectedToHidden =
				(sourceNode && hiddenNodeTypes.has(sourceNode.type as NodeType)) ||
				(targetNode && hiddenNodeTypes.has(targetNode.type as NodeType));

			const isFaded = (selectedNode && !isHighlighted) || isConnectedToHidden;

			// Apply fading effect
			if (isFaded) {
				ctx.globalAlpha = 0.05;
			} else {
				ctx.globalAlpha = 1.0;
			}

			// Calculate opacity based on strength
			const baseOpacity = isHighlighted ? 0.6 : 0.3;
			const strengthBonus = (graphLink.strength / 100) * 0.3;
			const opacity = Math.min(baseOpacity + strengthBonus, 0.8);

			ctx.strokeStyle = graphLink.color.replace(/[\d.]+\)$/, `${opacity})`);
			ctx.lineWidth = isHighlighted
				? ((config?.width || 1) * 1.5) / globalScale
				: (config?.width || 1) / globalScale;

			// Dashed line for conflicts
			if (config && "dashed" in config) {
				ctx.setLineDash([5 / globalScale, 3 / globalScale]);
			}

			ctx.beginPath();
			ctx.moveTo(start.x || 0, start.y || 0);
			ctx.lineTo(end.x || 0, end.y || 0);
			ctx.stroke();

			ctx.setLineDash([]); // Reset
			ctx.globalAlpha = 1.0; // Reset alpha
		},
		[selectedNode, highlightLinks, hiddenNodeTypes],
	);

	// Paint node pointer area - larger clickable area with minimum size
	// Scale parameter ensures minimum clickable area in SCREEN space, not canvas space
	const paintNodePointerArea = useCallback(
		(
			node: NodeObject,
			color: string,
			ctx: CanvasRenderingContext2D,
			scale: number,
		) => {
			const graphNode = node as unknown as ForceGraphNode;
			// Fallback scale to 1 if not provided (older react-force-graph versions)
			const effectiveScale = scale || 1;
			// Minimum 25px in screen space for better clickability
			const minScreenRadius = 25;
			const clickRadius = Math.max(
				graphNode.size * 2,
				minScreenRadius / effectiveScale,
			);
			ctx.beginPath();
			ctx.arc(node.x || 0, node.y || 0, clickRadius, 0, 2 * Math.PI);
			ctx.fillStyle = color;
			ctx.fill();
		},
		[],
	);

	// Node tooltip
	const nodeTooltip = useCallback((node: NodeObject) => {
		const graphNode = node as unknown as ForceGraphNode;
		const config = getNodeConfig(graphNode.type);
		return `<div style="background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px;">
			<strong>${graphNode.label}</strong><br/>
			<span style="color: ${graphNode.color};">● ${config.label}</span>
		</div>`;
	}, []);

	return {
		paintNode,
		paintLink,
		paintNodePointerArea,
		nodeTooltip,
	};
}
