# Persona Lab Canvas — Implementation Context
## 1. Current State Analysis

### 1.1 Existing Components

```
components/persona-lab/
├── ChatInterface.tsx        # Chat với AI (Navigator/Persona mode switch)
├── DiscoveryTab.tsx         # Questionnaire theo 4 tracks
├── EssaysTab.tsx            # Essay writing với AI support
├── InsightBoard.tsx         # Right panel - Core Values & Essay Angles
├── MyPersonaTab.tsx         # Summary view - Tags, Stories, Angles
├── PersonaLabLayout.tsx     # 3-column layout (sidebar|chat|insights)
└── ProfileContextSidebar.tsx # User profile summary
```

### 1.2 Existing Store (`lib/store/personaStore.ts`)

```typescript
// Tracks (Discovery)
type TrackId = "academic" | "activities" | "values" | "future";
type TrackStatus = "not_started" | "in_progress" | "completed";

interface DiscoveryTrack {
  id: TrackId;
  title: string;
  questions: TrackQuestion[];
  answers: TrackAnswer[];
  status: TrackStatus;
}

// Persona Outputs
interface PersonalityTag { id, label, source: TrackId, isEditable }
interface KeyStory { id, title, summary, sourceTrack, isPinned }
interface EssayAngle { id, title, description, relevantTracks[], isPinned }
```

### 1.3 Current Page Structure

```
app/[lang]/(app)/persona-lab/page.tsx
└── Tabs: "persona" | "essays"
    ├── persona → DiscoveryTab (if !completed) | MyPersonaTab (if completed)
    └── essays → EssaysTab
```

---

## 2. Canvas Feature Architecture (To Implement)

### 2.1 New Components to Create

```
components/persona-lab/
├── canvas/
│   ├── PersonaCanvas.tsx       # React Flow wrapper
│   ├── CanvasControls.tsx      # Layer filters + zoom controls
│   └── nodes/
│       ├── CoreNode.tsx        # Central archetype node
│       ├── SummaryNode.tsx     # L1 nodes
│       ├── EvidenceNode.tsx    # L2 nodes
│       └── InsightNode.tsx     # L3 nodes
└── NodeDetailPanel.tsx         # Expanded view on node click
```

### 2.2 Type Definitions (Add to `lib/store/personaStore.ts`)

```typescript
// === CANVAS TYPES ===

export type NodeLayer = 'core' | 'summary' | 'evidence' | 'insight';
export type NodeState = 'locked' | 'unlocked';

export interface CanvasNode {
  id: string;
  type: NodeLayer;
  position: { x: number; y: number };
  data: {
    // Common
    track?: TrackId;
    state: NodeState;
    
    // Core node only
    archetype?: string;      // "The Engineer Mind"
    subtitle?: string;       // "Analytical & Builder Archetype"
    
    // Layer nodes
    layerLabel?: string;     // "L1: SUMMARY"
    title?: string;          // "Growth Mindset"
    content?: string;        // Full text (expanded view)
    themeTag?: string;       // "🎯 Leadership"
    
    // Locked state
    unlockHint?: string;     // "Answer 2 more questions"
  };
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  type: 'hierarchy' | 'crossTrack';
  animated?: boolean;
  style?: {
    stroke: string;
    strokeWidth: number;
    strokeDasharray?: string;
  };
}
```

### 2.3 Store Extensions

```typescript
// Add to PersonaState interface
interface PersonaState {
  // ... existing fields ...
  
  // Canvas State
  canvasNodes: CanvasNode[];
  canvasEdges: CanvasEdge[];
  selectedNodeId: string | null;
  visibleLayers: Record<NodeLayer, boolean>;
  
  // Canvas Actions
  setCanvasNodes: (nodes: CanvasNode[]) => void;
  setCanvasEdges: (edges: CanvasEdge[]) => void;
  unlockNode: (nodeId: string) => void;
  addCanvasNode: (node: CanvasNode) => void;
  addCanvasEdge: (edge: CanvasEdge) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setVisibleLayers: (layers: Record<NodeLayer, boolean>) => void;
}
```

---

## 3. Track Color System

> Aligned với color system trong `docs/colors.md` và existing `DiscoveryTab.tsx`

```typescript
// File: lib/constants/personaColors.ts

export const TRACK_COLORS = {
  future: {
    primary: '#8B5CF6',     // Violet (khớp với DiscoveryTab)
    light: 'oklch(0.93 0.05 295)',   // 10% opacity equiv
    muted: '#C4B5FD',
    bgClass: 'bg-violet-500/10',
    textClass: 'text-violet-600',
    borderClass: 'border-violet-200',
  },
  academic: {
    primary: '#3B82F6',     // Blue (khớp với DiscoveryTab)
    light: 'oklch(0.93 0.05 250)',
    muted: '#93C5FD',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-600',
    borderClass: 'border-blue-200',
  },
  activities: {
    primary: '#F59E0B',     // Amber (khớp với DiscoveryTab)
    light: 'oklch(0.95 0.08 85)',
    muted: '#FCD34D',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-600',
    borderClass: 'border-amber-200',
  },
  values: {
    primary: '#F43F5E',     // Rose (khớp với DiscoveryTab - thay vì teal)
    light: 'oklch(0.93 0.06 15)',
    muted: '#FDA4AF',
    bgClass: 'bg-rose-500/10',
    textClass: 'text-rose-600',
    borderClass: 'border-rose-200',
  },
} as const;

export const NODE_STATES = {
  locked: {
    bg: 'bg-muted',           // Tailwind: oklch(0.967...)
    border: 'border-border',  // Tailwind: oklch(0.871...)
    text: 'text-muted-foreground',
  },
  unlocked: {
    bg: 'bg-background',
    border: 'border-primary', // Dynamic per track
    text: 'text-foreground',
  },
} as const;
```

---

## 4. Layout Algorithm

### 4.1 Canvas Positioning Constants

```typescript
// File: lib/utils/canvasLayout.ts

// Canvas center (React Flow coordinates)
const CENTER = { x: 600, y: 400 };

// Cluster positions relative to center
const CLUSTER_ANCHORS: Record<TrackId, { x: number; y: number }> = {
  future: { x: 0, y: -200 },      // Top
  academic: { x: 250, y: 0 },     // Right
  activities: { x: -250, y: 0 },  // Left
  values: { x: 0, y: 200 },       // Bottom
};

// Node offsets within cluster
const LAYER_OFFSETS: Record<'summary' | 'evidence' | 'insight', { x: number; y: number }> = {
  summary: { x: 0, y: 0 },        // Closest to center
  evidence: { x: 60, y: 80 },     // Mid distance
  insight: { x: -60, y: 120 },    // Furthest
};

export function calculateNodePosition(
  track: TrackId,
  layer: 'summary' | 'evidence' | 'insight',
  index: number = 0
): { x: number; y: number } {
  const clusterAnchor = CLUSTER_ANCHORS[track];
  const layerOffset = LAYER_OFFSETS[layer];
  
  return {
    x: CENTER.x + clusterAnchor.x + layerOffset.x + (index * 30),
    y: CENTER.y + clusterAnchor.y + layerOffset.y + (index * 40),
  };
}
```

---

## 5. Interaction Specifications

### 5.1 Layer Filter (Dim, don't hide)

```typescript
// In PersonaCanvas.tsx
const [visibleLayers, setVisibleLayers] = useState<Record<NodeLayer, boolean>>({
  core: true,
  summary: true,
  evidence: true,
  insight: true,
});

const getNodeStyle = (node: CanvasNode): React.CSSProperties => {
  if (node.type !== 'core' && !visibleLayers[node.type]) {
    return { opacity: 0.4, pointerEvents: 'none' };
  }
  return { opacity: 1, pointerEvents: 'auto' };
};
```

### 5.2 Track Selection (Highlight/Dim)

```typescript
// Synced với ChatInterface mode selection
const [selectedTrack, setSelectedTrack] = useState<TrackId | null>(null);

const getTrackStyle = (nodeTrack?: TrackId): React.CSSProperties => {
  if (!selectedTrack || !nodeTrack) return {};
  return nodeTrack === selectedTrack 
    ? { filter: 'none' } 
    : { opacity: 0.5 };
};
```

### 5.3 Node Click Handler

```typescript
const onNodeClick = (event: React.MouseEvent, node: CanvasNode) => {
  if (node.data.state === 'locked') {
    // Switch chat to track's discovery questions
    setActiveTrack(node.data.track);
    return;
  }
  // Show detail panel
  setSelectedNode(node.id);
};
```

---

## 6. Integration with Existing Flow

### 6.1 Page Layout Update

```tsx
// app/[lang]/(app)/persona-lab/page.tsx

// Option A: Replace MyPersonaTab with Canvas view
<TabsContent value="persona">
  {showDiscovery ? (
    <DiscoveryTab />
  ) : (
    <div className="flex h-full">
      <PersonaCanvas className="flex-1" />
      <NodeDetailPanel /> {/* Slide-in panel */}
    </div>
  )}
</TabsContent>

// Option B: Add Canvas as third tab
<TabsList>
  <TabsTrigger value="discovery">Discovery</TabsTrigger>
  <TabsTrigger value="canvas">Canvas</TabsTrigger>
  <TabsTrigger value="essays">Essays</TabsTrigger>
</TabsList>
```

### 6.2 Data Flow: Discovery → Canvas

```
User completes DiscoveryTab question
        ↓
personaStore.answerQuestion() called
        ↓
(New) personaStore.updateCanvasFromAnswer()
        ↓
Generate CanvasNode from answer
        ↓
Canvas re-renders with new node
```

### 6.3 Mapping Discovery Answers to Canvas Nodes

```typescript
// In personaStore.ts - new function
function generateNodesFromAnswers(track: DiscoveryTrack): CanvasNode[] {
  const nodes: CanvasNode[] = [];
  
  track.answers.forEach((answer, idx) => {
    // L1: Summary - first answer becomes summary
    if (idx === 0) {
      nodes.push({
        id: `${track.id}-summary-${idx}`,
        type: 'summary',
        position: calculateNodePosition(track.id, 'summary'),
        data: {
          track: track.id,
          state: 'unlocked',
          layerLabel: 'L1: SUMMARY',
          title: extractKeyPhrase(answer.answer), // AI helper
          content: answer.answer,
        },
      });
    }
    
    // L2: Evidence - subsequent answers
    if (idx >= 1 && idx <= 3) {
      nodes.push({
        id: `${track.id}-evidence-${idx}`,
        type: 'evidence',
        position: calculateNodePosition(track.id, 'evidence', idx - 1),
        data: {
          track: track.id,
          state: 'unlocked',
          layerLabel: 'L2: EVIDENCE',
          title: extractKeyPhrase(answer.answer),
          content: answer.answer,
        },
      });
    }
    
    // L3: Insight - AI-synthesized from multiple answers
    // Generated when track is complete
  });
  
  return nodes;
}
```

---

## 7. Dependencies to Add

```bash
# React Flow for canvas
npm install @xyflow/react

# Already installed (no action needed):
# - framer-motion (animations)
# - zustand (state)
# - lucide-react (icons)
# - @radix-ui/* (UI primitives)
```

---

## 8. Implementation Phases

### Phase 1: Static Canvas (MVP)
- [ ] Install `@xyflow/react`
- [ ] Create `lib/constants/personaColors.ts`
- [ ] Create `lib/utils/canvasLayout.ts`
- [ ] Create custom node components (Core, Summary, Evidence, Insight)
- [ ] Create `PersonaCanvas.tsx` with mock data
- [ ] Add layer filter controls
- [ ] Integrate into page layout

### Phase 2: Data Integration
- [ ] Extend `personaStore.ts` with canvas state
- [ ] Implement `generateNodesFromAnswers()`
- [ ] Connect Discovery completion → Canvas update
- [ ] Create edges between related nodes

### Phase 3: Interactions
- [ ] Node click → detail panel
- [ ] Track selection → highlight cluster
- [ ] Locked node click → trigger Discovery tab
- [ ] Smooth transitions (200ms fade via Framer Motion)

### Phase 4: AI Enhancement (Future)
- [ ] AI-generated Insight nodes (L3)
- [ ] Cross-track connection detection
- [ ] Archetype synthesis for Core node
- [ ] Chat → Canvas real-time sync

---

## 9. File Checklist

### New Files to Create
```
lib/
├── constants/
│   └── personaColors.ts          # Track colors & node states
└── utils/
    └── canvasLayout.ts           # Position calculation

components/persona-lab/
├── canvas/
│   ├── PersonaCanvas.tsx         # Main React Flow wrapper
│   ├── CanvasControls.tsx        # Layer toggles, zoom
│   └── nodes/
│       ├── CoreNode.tsx
│       ├── SummaryNode.tsx
│       ├── EvidenceNode.tsx
│       └── InsightNode.tsx
└── NodeDetailPanel.tsx           # Slide-out detail view
```

### Files to Modify
```
lib/store/personaStore.ts         # Add canvas state & actions
app/[lang]/(app)/persona-lab/page.tsx  # Integrate Canvas view
```

---

## 10. Notes on Existing Code Patterns

### Styling Convention
- Use Tailwind utilities với `cn()` helper từ `lib/utils.ts`
- Prefer semantic color classes: `text-foreground`, `bg-background`, `border-border`
- Animation: Framer Motion với `animate-in`, `fade-in`, `slide-in-from-*`

### State Pattern
```typescript
// Zustand pattern in this project
const usePersonaStore = create<PersonaState>()(
  persist(
    (set, get) => ({
      // state...
      action: () => set((state) => ({ ...newState })),
    }),
    { name: 'leaply-persona' }
  )
);
```

### Component Pattern
```typescript
// Functional component với explicit interface
interface ComponentProps {
  prop: Type;
}

export function Component({ prop }: ComponentProps) {
  const { t } = useTranslation();
  // ...
}
```

---

## 11. Demo Data for Testing

```typescript
// Mock canvas nodes for development
export const MOCK_CANVAS_NODES: CanvasNode[] = [
  // Core node (center)
  {
    id: 'core',
    type: 'core',
    position: { x: 600, y: 400 },
    data: {
      state: 'unlocked',
      archetype: 'The Engineer Mind',
      subtitle: 'Analytical & Builder Archetype',
    },
  },
  
  // Future track - Summary
  {
    id: 'future-summary-1',
    type: 'summary',
    position: { x: 600, y: 200 },
    data: {
      track: 'future',
      state: 'unlocked',
      layerLabel: 'L1: SUMMARY',
      title: 'Environmental Tech Vision',
      content: 'Aspires to build scalable AI systems for climate monitoring...',
      themeTag: '🚀 Vision',
    },
  },
  
  // Academic track - Locked example
  {
    id: 'academic-summary-1',
    type: 'summary',
    position: { x: 850, y: 400 },
    data: {
      track: 'academic',
      state: 'locked',
      layerLabel: 'L1: SUMMARY',
      unlockHint: 'Complete Academic track',
    },
  },
  
  // ... more nodes
];
```
