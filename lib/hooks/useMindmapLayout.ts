"use client";

import { useEffect, useCallback, useRef } from "react";
import { type Node, type Edge, useReactFlow, Position } from "@xyflow/react";
import { stratify, tree, type HierarchyNode } from "d3-hierarchy";

// Config for the layout
const LAYOUT_CONFIG = {
  // Radial layout dimensions
  radius: 600, // Max radius
  // Separation between nodes
  separation: (a: HierarchyNode<any>, b: HierarchyNode<any>) => {
    return (a.parent === b.parent ? 1 : 2) / a.depth;
  }
};

interface UseMindmapLayoutProps {
  nodes: Node[];
  edges: Edge[];
  rootId?: string;
  active?: boolean; // Whether the layout engine is active
}

/**
 * A hook that calculates a Mindmap / Radial Tree layout using d3-hierarchy.
 * Best suited for the "Solar System" view where a core node is central
 * and tracks radiate outwards.
 */
export function useMindmapLayout({ 
  nodes, 
  edges, 
  rootId = 'core',
  active = true 
}: UseMindmapLayoutProps) {
  const { setNodes } = useReactFlow();
  
  // Use refs to access latest state without triggering re-runs
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [nodes, edges]);

  const runLayout = useCallback(() => {
    const currentNodes = nodesRef.current;
    const currentEdges = edgesRef.current;
    
    if (!active || currentNodes.length === 0) return;
    
    // Create a map of parent relationships
    const parentMap = new Map<string, string>();
    currentEdges.forEach(edge => {
      // In a mindmap, source is parent, target is child
      parentMap.set(edge.target, edge.source);
    });

    // Helper to find valid data for stratify
    const hierarchyData = currentNodes.map(node => ({
      id: node.id,
      parentId: node.id === rootId ? null : (parentMap.get(node.id) || 'core')
    }));

    // Safety: ensure root exists in data
    const hasRoot = hierarchyData.some(d => d.id === rootId);
    if (!hasRoot) {
      // Silently return if root not found yet (can happen during init)
      return;
    }

    try {
      // 2. Stratify: Convert flat list to hierarchy
      const root = stratify<{ id: string, parentId: string | null }>()
        .id(d => d.id)
        .parentId(d => d.parentId)(hierarchyData);

      // 3. Configure the Tree Layout (Radial)
      // Map x to angle (0 - 2PI) and y to radius (0 - RADIUS)
      const layout = tree<{ id: string, parentId: string | null }>()
        .size([2 * Math.PI, LAYOUT_CONFIG.radius])
        .separation(LAYOUT_CONFIG.separation);

      // Apply layout
      layout(root);

      // 4. Update Node Positions
      const newNodes = currentNodes.map(node => {
        // Find the node in the d3 hierarchy
        const d3Node = root.descendants().find(d => d.data.id === node.id);
        
        if (!d3Node) return node;

        let x, y;
        
        if (node.id === rootId) {
           x = 0;
           y = 0;
        } else {
           // d3.tree (radial) maps x to angle, y to radius
           // We allow x and y to be potentially undefined in types, but layout() populates them.
           // Cast to number to satisfy TS
           const angle = (d3Node as any).x || 0; 
           const radius = (d3Node as any).y || 0;
           
           // Convert Polar -> Cartesian
           // -PI/2 rotates so 0 is Up (standard 12 o'clock start)
           x = radius * Math.cos(angle - Math.PI / 2);
           y = radius * Math.sin(angle - Math.PI / 2);
        }
        
        const CENTER = { x: 400, y: 300 };

        // Check if position is meaningfully different to avoid thrashing
        const newX = CENTER.x + x - (node.measured?.width || 150) / 2;
        const newY = CENTER.y + y - (node.measured?.height || 50) / 2;

        return {
          ...node,
          position: { x: newX, y: newY },
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
        };
      });

      setNodes(newNodes);

    } catch (err) {
      console.error("Layout calculation failed:", err);
    }

  }, [active, rootId, setNodes]); 

  // Automatically run layout when structure changes
  // We use a signature of IDs to detect structure changes without depending on positions
  const structureSig = nodes.map(n => n.id).join(',') + '|' + edges.map(e => e.source + e.target).join(',');

  useEffect(() => {
    runLayout();
  }, [runLayout, structureSig, nodes.length, edges.length]);

  return { runLayout };
}
