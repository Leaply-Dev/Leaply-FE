import { useCallback } from "react";
import type { LinkObject, NodeObject } from "react-force-graph-2d";
import { EDGE_CONFIG, NODE_CONFIG } from "@/lib/config/graphConfig";
import type {
	ForceGraphLink,
	ForceGraphNode,
	NodeType,
} from "@/lib/types/persona-canvas";

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
			const isHidden = hiddenNodeTypes.has(graphNode.type);
			const isFaded = (selectedNode && !isHighlighted) || isHidden;
			const config = NODE_CONFIG[graphNode.type];

			// Node circle
			ctx.beginPath();
			ctx.arc(node.x || 0, node.y || 0, graphNode.size, 0, 2 * Math.PI);

			// Apply fading effect
			if (isFaded) {
				ctx.globalAlpha = 0.15;
			} else {
				ctx.globalAlpha = 1.0;
			}

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

			// Reset alpha
			ctx.globalAlpha = 1.0;

			// Label
			if (showLabels && (isHovered || isSelected || globalScale > 1.5)) {
				const label = graphNode.label;
				const fontSize = 12 / globalScale;
				ctx.font = `${fontSize}px Inter, sans-serif`;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";

				// Apply same fading to label
				if (isFaded) {
					ctx.globalAlpha = 0.15;
				}

				// Background
				const textWidth = ctx.measureText(label).width;
				const padding = 4 / globalScale;
				ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
				ctx.fillRect(
					(node.x || 0) - textWidth / 2 - padding,
					(node.y || 0) + graphNode.size + padding,
					textWidth + padding * 2,
					fontSize + padding * 2,
				);

				// Text
				ctx.fillStyle = "#ffffff";
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
				(sourceNode && hiddenNodeTypes.has(sourceNode.type)) ||
				(targetNode && hiddenNodeTypes.has(targetNode.type));

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

	// Paint node pointer area - larger clickable area
	const paintNodePointerArea = useCallback(
		(node: NodeObject, color: string, ctx: CanvasRenderingContext2D) => {
			const graphNode = node as unknown as ForceGraphNode;
			const clickRadius = graphNode.size * 1.4;
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
		return `<div style="background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px;">
			<strong>${graphNode.label}</strong><br/>
			<span style="color: ${graphNode.color};">● ${NODE_CONFIG[graphNode.type].label}</span>
		</div>`;
	}, []);

	return {
		paintNode,
		paintLink,
		paintNodePointerArea,
		nodeTooltip,
	};
}
