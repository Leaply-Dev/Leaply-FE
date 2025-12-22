import { useEffect, useRef } from "react";
import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceX,
    forceY,
    forceCollide,
    forceRadial,
} from "d3-force";
import type { Node, Edge } from "@xyflow/react";

export function useCanvasPhysics(
    nodes: Node[],
    edges: Edge[],
    setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
) {
    const simulationRef = useRef<any>(null);
    const nodesRef = useRef<Node[]>([]);

    useEffect(() => {
        // Detect changes in structure
        const prevIds = new Set(nodesRef.current.map(n => n.id));
        const currentIds = new Set(nodes.map(n => n.id));
        const hasNewNodes = nodes.some(n => !prevIds.has(n.id));
        const hasDeletedNodes = nodesRef.current.some(n => !currentIds.has(n.id));

        if (hasNewNodes || hasDeletedNodes || nodesRef.current.length === 0) {
            if (simulationRef.current) {
                simulationRef.current.stop();
            }

            // Map nodes for simulation, preserving existing positions
            const simNodes = nodes.map((node) => {
                const prev = nodesRef.current.find(n => n.id === node.id);

                if (prev) {
                    return {
                        ...node,
                        x: (prev as any).x ?? prev.position.x,
                        y: (prev as any).y ?? prev.position.y,
                    };
                }

                // If it's a new node, try to spawn near parent
                const parentEdge = edges.find(e => e.target === node.id);
                const parent = parentEdge ? nodesRef.current.find(n => n.id === parentEdge.source) : null;

                if (parent) {
                    return {
                        ...node,
                        x: (parent as any).x ?? parent.position.x,
                        y: (parent as any).y ?? parent.position.y,
                    };
                }

                // Default to center
                return { ...node, x: 400, y: 300 };
            });

            const simEdges = edges.map((e) => ({
                source: e.source,
                target: e.target,
            }));

            // Layer distances should match canvasLayout.ts
            const getTargetRadius = (node: Node) => {
                switch (node.type) {
                    case "summary": return 280;
                    case "evidence": return 480;
                    case "insight": return 620;
                    default: return 0;
                }
            };

            simulationRef.current = forceSimulation(simNodes as any)
                .force("link", forceLink(simEdges).id((d: any) => d.id).distance(150).strength(0.3))
                .force("charge", forceManyBody().strength((d: any) => d.id === 'core' ? -2000 : -800))
                .force("radial", forceRadial((d: any) => getTargetRadius(d), 400, 300).strength(0.8))
                .force("x", forceX().x((d: any) => d.position.x).strength(0.1))
                .force("y", forceY().y((d: any) => d.position.y).strength(0.1))
                .force("collide", forceCollide().radius((d: any) => {
                    if (d.id === 'core') return 180;
                    if (d.type === 'summary') return 130;
                    return 100;
                }).strength(1))
                .alpha(0.5)
                .alphaDecay(0.02) // Slower for more liquid floating
                .on("tick", () => {
                    setNodes((nds) =>
                        nds.map((node) => {
                            const simNode = simNodes.find((sn) => sn.id === node.id);
                            if (simNode) {
                                return {
                                    ...node,
                                    position: { x: (simNode as any).x, y: (simNode as any).y },
                                };
                            }
                            return node;
                        }),
                    );
                })
                .on("end", () => {
                    nodesRef.current = simNodes as any;
                });

            nodesRef.current = simNodes as any;
        }

        return () => {
            if (simulationRef.current) {
                simulationRef.current.stop();
            }
        };
    }, [nodes.length, edges.length]);
}
