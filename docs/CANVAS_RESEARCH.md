# Building a graph canvas for React with automatic layout

**React Flow with ELK.js is the optimal stack for your Persona Lab canvas.** This combination provides native React components, first-class shadcn/Tailwind support, and ELK's layered algorithm handles 3-layer hierarchies with cross-links exceptionally well. For 50-100 nodes, the DOM/SVG hybrid approach achieves smooth 60 FPS without requiring Canvas or WebGL—your scale sits comfortably in React Flow's sweet spot.

## React Flow dominates the React ecosystem

Among the four major options—React Flow, Cytoscape.js, vis.js, and D3.js—React Flow stands out for modern React development. With **34,000+ GitHub stars** and ~550k weekly npm downloads, it's the only library offering native React components rather than wrapper-based integration. The xyflow team released official **shadcn UI components** in November 2024, providing pre-built `BaseNode`, `LabeledHandle`, and `StatusIndicator` components installable via `npx shadcn@latest add https://ui.reactflow.dev/base-node`.

| Library | React Integration | shadcn/Tailwind | Hierarchical Layout | Bundle Size |
|---------|------------------|-----------------|---------------------|-------------|
| **React Flow** | Native components | ✅ Official UI | Dagre/ELK | ~50-60kb |
| Cytoscape.js | Wrapper required | ❌ JSON styling | Best algorithm ecosystem | ~112kb |
| vis.js | Wrapper required | ❌ Canvas-based | Built-in hierarchical | ~150kb+ |
| D3.js | Manual integration | ⚠️ Manual | d3-hierarchy/force | Modular |

Cytoscape.js has the most extensive layout algorithm ecosystem (15+ options), making it superior for graph analysis tasks. However, its React wrapper and proprietary styling system create friction in modern React/Tailwind projects. D3.js is too low-level for node-graph canvases—React Flow already uses D3 internally for zoom handling.

## ELK.js handles complex hierarchies with cross-layer links

For your 3-layer structure (Summary → Evidence → Insights) with cross-links between tracks, **ELK.js's layered algorithm** is the clear winner over Dagre, d3-hierarchy, or force-directed approaches. ELK's distinguishing features include explicit **layer partitioning**, native **cross-hierarchy edge support**, and sophisticated **edge crossing minimization**.

The configuration for your Persona Lab structure maps directly to ELK's options:

```javascript
const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.partitioning.activate': 'true',
  'elk.hierarchyHandling': 'INCLUDE_CHILDREN', // Critical for cross-links
  'elk.layered.spacing.nodeNodeBetweenLayers': '80',
  'elk.spacing.nodeNode': '60',
  'elk.edgeRouting': 'ORTHOGONAL'
};
```

Each node receives a partition assignment (`elk.partitioning.partition: '0'` for Summary, `'1'` for Evidence, `'2'` for Insights), and ELK automatically places nodes in correct layers while routing cross-layer edges cleanly.

**Dagre** works well for simpler DAGs and offers faster execution (synchronous vs. ELK's async), but struggles with subflows and provides less control over cross-hierarchy edges. **D3-hierarchy** strictly requires tree structures with single parents—disqualifying it for cross-linked graphs. **Force-directed layouts** produce organic-looking graphs but lack deterministic positioning, making them unsuitable for consistent layer-based structures.

## Dynamic node positioning requires careful state orchestration

When synthesizing new story elements from chat conversations, the key challenge is animating nodes to their new positions while preserving manual adjustments. The recommended pattern separates node addition from layout calculation:

```javascript
const addNode = async (nodeData, parentId) => {
  // 1. Add node with opacity: 0 (hidden until positioned)
  const newNode = {
    id: `${nodeData.type}-${Date.now()}`,
    data: { ...nodeData, layer: LAYER_MAP[nodeData.type] },
    position: { x: 0, y: 0 },
    style: { opacity: 0 }
  };
  setNodes(prev => [...prev, newNode]);
  
  // 2. ELK calculates new positions asynchronously
  const { nodes: layoutedNodes } = await elk.layout(buildGraph(nodes, edges));
  
  // 3. Animate to new positions with Framer Motion's layout prop
  setNodes(layoutedNodes.map(n => ({ ...n, style: { opacity: 1 } })));
};
```

**Framer Motion** integrates seamlessly for animations—the `layout` prop automatically animates position changes when React Flow updates node positions, while `AnimatePresence` handles enter/exit animations. Spring physics (`stiffness: 300, damping: 30`) produce natural-feeling motion.

## Semantic zoom reveals progressive detail

Production canvas apps like FigJam and Obsidian Canvas use **semantic zoom** to manage visual complexity. Rather than simply scaling, content changes based on zoom level. React Flow exposes the zoom transform via `useStore`:

```jsx
const ZoomAwareNode = ({ data }) => {
  const zoom = useStore((s) => s.transform[2]);
  
  const showDetails = zoom > 0.75;
  const showLabels = zoom > 0.5;
  
  return (
    <div className="rounded-lg border bg-card p-4">
      {showLabels && <Badge>{data.type}</Badge>}
      <h3 className="font-semibold">{data.title}</h3>
      {showDetails && <p className="text-muted-foreground">{data.description}</p>}
    </div>
  );
};
```

For your four tracks, consider collapsing entire track sections at low zoom, showing only track headers with node counts, then expanding to full detail as users zoom into specific areas.

## Expand/collapse patterns for grouped tracks

React Flow's **parent-child node relationships** enable track grouping. Each track becomes a group node containing its Summary, Evidence, and Insight children:

```javascript
const nodes = [
  { id: 'track-future-vision', type: 'group', style: { width: 400, height: 600 } },
  { id: 'summary-1', parentId: 'track-future-vision', extent: 'parent', 
    position: { x: 20, y: 60 } }, // Relative positioning
  // ... child nodes
];
```

Collapse behavior uses the `hidden` property—toggling visibility on all children and their edges maintains layout stability while reducing visual complexity. The **useExpandCollapse** hook pattern tracks expanded state in a Set, filtering visible nodes reactively.

## Performance scales comfortably to your requirements

For **50-100 styled nodes**, React Flow's DOM/SVG hybrid approach delivers **60 FPS** without optimization concerns. Nodes render as HTML `<div>` elements (enabling full Tailwind/shadcn styling), while edges render as SVG paths (scaling perfectly during zoom).

| Node Count | Expected Performance | Approach |
|------------|---------------------|----------|
| <100 | 60 FPS, full styling freedom | Default React Flow |
| 100-500 | 60 FPS with memoization | Add `React.memo`, `useCallback` |
| 500-2,000 | Varies, virtualization helps | `onlyRenderVisibleElements` |
| 2,000+ | Consider Canvas-based libraries | vis.js, Sigma.js |

Critical optimizations for your use case:
- **Memoize custom nodes** with `React.memo()` to prevent cascade re-renders during drag
- **Use CSS for selection states** (`.react-flow__node.selected`) instead of React state
- **Avoid shadows/gradients** on nodes if performance becomes concerning
- **Batch layout calculations** when multiple nodes are added from a single chat interaction

Mobile performance at your scale remains strong—modern iPads and phones handle 100 DOM-based nodes smoothly, though keeping touch targets at **44px minimum** improves usability.

## Conclusion

Your Persona Lab implementation should use **React Flow + ELK.js** as the foundation, with **Framer Motion** for animations and **shadcn components** for node styling. The 4-track × 3-layer structure maps directly to ELK's partition system, and cross-links between tracks work natively with the `INCLUDE_CHILDREN` hierarchy handling.

Start with the official React Flow shadcn example as your template, then add the ELK layout hook for automatic positioning. Build semantic zoom into your custom nodes from the beginning—retrofitting it later creates significant refactoring overhead. For node addition from chat, implement optimistic UI (add node hidden, calculate layout, animate reveal) to maintain responsiveness during async layout calculation.

The primary risk is ELK.js's **~7.8MB bundle size**—consider lazy-loading it or using a Web Worker for layout calculations if initial load time becomes problematic. For simpler prototyping, Dagre at ~50KB provides 80% of the functionality with much smaller footprint.