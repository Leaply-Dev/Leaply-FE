"use client";

import { type Edge, type Node, useViewport } from "@xyflow/react";
import {
	forceLink,
	forceManyBody,
	forceRadial,
	forceSimulation,
	forceX,
	forceY,
	type SimulationNodeDatum,
} from "d3-force";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
	CANVAS_CENTER,
	getNodeDimensions,
	TRACK_DIRECTIONS,
} from "@/lib/utils/canvasLayout";

interface SimNode extends SimulationNodeDatum {
	id: string;
	type: string;
	track?: string;
	width: number;
	height: number;
	data: any;
}

interface UseOrganicLayoutProps {
	nodes: Node[];
	edges: Edge[];
	setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void;
}

export function useOrganicLayout({
	nodes,
	edges,
	setNodes,
}: UseOrganicLayoutProps) {
	const simulationRef = useRef<any>(null);
	const nodesRef = useRef<Node[]>(nodes);
	const { zoom } = useViewport();

	// Rectangular collision force
	const forceCollideRect = useCallback(() => {
		let simNodes: SimNode[];

		function force(alpha: number) {
			const strength = 0.5;
			for (let i = 0, n = simNodes.length; i < n; ++i) {
				const nodeA = simNodes[i];
				const nx = nodeA.x! + nodeA.vx!;
				const ny = nodeA.y! + nodeA.vy!;

				for (let j = i + 1; j < n; ++j) {
					const nodeB = simNodes[j];
					const bx = nodeB.x! + nodeB.vx!;
					const by = nodeB.y! + nodeB.vy!;

					const dx = nx - bx;
					const dy = ny - by;
					const adx = Math.abs(dx);
					const ady = Math.abs(dy);

					const gapX = (nodeA.width + nodeB.width) / 2 + 40; // 40px padding
					const gapY = (nodeA.height + nodeB.height) / 2 + 40;

					if (adx < gapX && ady < gapY) {
						const overlapX = gapX - adx;
						const overlapY = gapY - ady;

						if (overlapX < overlapY) {
							const sx = (dx > 0 ? 1 : -1) * overlapX * alpha * strength;
							nodeA.vx! += sx;
							nodeB.vx! -= sx;
						} else {
							const sy = (dy > 0 ? 1 : -1) * overlapY * alpha * strength;
							nodeA.vy! += sy;
							nodeB.vy! -= sy;
						}
					}
				}
			}
		}

		force.initialize = (n: SimNode[]) => {
			simNodes = n;
		};
		return force;
	}, []);

	useEffect(() => {
		// Detect changes in structure
		const prevIds = new Set(nodesRef.current.map((n) => n.id));
		const currentIds = new Set(nodes.map((n) => n.id));
		const hasNewNodes = nodes.some((n) => !prevIds.has(n.id));
		const hasDeletedNodes = nodesRef.current.some((n) => !currentIds.has(n.id));

		if (hasNewNodes || hasDeletedNodes || !simulationRef.current) {
			if (simulationRef.current) {
				simulationRef.current.stop();
			}

			// Prepare nodes for simulation
			const simNodes = nodes.map((node) => {
				const prev = nodesRef.current.find((n) => n.id === node.id);
				const type = (node.type as any) || "evidence";
				const dims = getNodeDimensions(type);

				// Spawn logic
				let initialX = node.position.x;
				let initialY = node.position.y;

				if (prev) {
					initialX = (prev as any).x ?? prev.position.x;
					initialY = (prev as any).y ?? prev.position.y;
				} else {
					// New node: try to spawn at parent or center surface
					const parentEdge = edges.find((e) => e.target === node.id);
					const parent = parentEdge
						? nodesRef.current.find((n) => n.id === parentEdge.source)
						: null;

					if (parent) {
						initialX = (parent as any).x ?? parent.position.x;
						initialY = (parent as any).y ?? parent.position.y;
					} else {
						initialX = CANVAS_CENTER.x;
						initialY = CANVAS_CENTER.y;
					}
				}

				return {
					...node,
					type,
					x: initialX,
					y: initialY,
					width: dims.width,
					height: dims.height,
					track: node.data.track,
					fx: node.id === "core" ? CANVAS_CENTER.x : undefined,
					fy: node.id === "core" ? CANVAS_CENTER.y : undefined,
				};
			});

			const simEdges = edges.map((e) => ({
				source: e.source,
				target: e.target,
			}));

			// Create simulation
			simulationRef.current = forceSimulation(simNodes as SimNode[])
				.force(
					"link",
					forceLink(simEdges)
						.id((d: any) => d.id)
						.distance(180)
						.strength(0.2),
				)
				.force(
					"charge",
					forceManyBody().strength((d: any) => {
						if (d.id === "core") return -3000;
						if (d.type === "summary") return -1200;
						return -600;
					}),
				)
				// Radial layers
				.force(
					"radial",
					forceRadial(
						(d: any) => {
							if (d.type === "summary") return 250;
							if (d.type === "evidence") return 450;
							if (d.type === "insight") return 600;
							return 0;
						},
						CANVAS_CENTER.x,
						CANVAS_CENTER.y,
					).strength(0.6),
				)
				// Theme Attractors (Gravity Wells)
				.force(
					"x",
					forceX()
						.x((d: any) => {
							if (d.id === "core") return CANVAS_CENTER.x;
							const track = d.track;
							if (
								track &&
								TRACK_DIRECTIONS[track as keyof typeof TRACK_DIRECTIONS]
							) {
								const angle =
									TRACK_DIRECTIONS[track as keyof typeof TRACK_DIRECTIONS]
										.angle;
								const dist = d.type === "summary" ? 250 : 450;
								return (
									CANVAS_CENTER.x + Math.cos((angle * Math.PI) / 180) * dist
								);
							}
							return CANVAS_CENTER.x;
						})
						.strength(0.15),
				)
				.force(
					"y",
					forceY()
						.y((d: any) => {
							if (d.id === "core") return CANVAS_CENTER.y;
							const track = d.track;
							if (
								track &&
								TRACK_DIRECTIONS[track as keyof typeof TRACK_DIRECTIONS]
							) {
								const angle =
									TRACK_DIRECTIONS[track as keyof typeof TRACK_DIRECTIONS]
										.angle;
								const dist = d.type === "summary" ? 250 : 450;
								return (
									CANVAS_CENTER.y + Math.sin((angle * Math.PI) / 180) * dist
								);
							}
							return CANVAS_CENTER.y;
						})
						.strength(0.15),
				)
				.force("collide", forceCollideRect())
				.alpha(0.8)
				.alphaDecay(0.01) // Slower decay for "liquid" feel
				.alphaTarget(0.05) // Maintain a "breathing" state
				.on("tick", () => {
					// Update nodes with "breathing" drift
					const time = Date.now() * 0.001;
					setNodes((nds) =>
						nds.map((node) => {
							const simNode = simNodes.find((sn) => sn.id === node.id);
							if (simNode) {
								// Add a tiny "breathing" oscillation
								const driftX = Math.sin(time + simNode.x! * 0.01) * 0.5;
								const driftY = Math.cos(time + simNode.y! * 0.01) * 0.5;

								return {
									...node,
									position: {
										x: simNode.x! + driftX - simNode.width / 2,
										y: simNode.y! + driftY - simNode.height / 2,
									},
								};
							}
							return node;
						}),
					);
				});

			nodesRef.current = nodes;
		}

		return () => {
			// We don't stop it immediately to allow momentum,
			// but we stop it on unmount
		};
	}, [nodes.length, edges.length, setNodes, forceCollideRect]);

	// Update nodesRef to keep track of latest positions for spawning
	useEffect(() => {
		nodesRef.current = nodes;
	}, [nodes]);

	return {
		isMacroView: zoom < 0.5,
		isMicroView: zoom > 0.8,
	};
}
