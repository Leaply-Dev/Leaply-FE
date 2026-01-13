# Persona Lab Implementation Report

> Technical documentation for the Leaply Persona Lab feature - Frontend implementation details

**Last Updated:** 2026-01-13

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [API Reference Summary](#2-api-reference-summary)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Components Deep Dive](#4-components-deep-dive)
5. [State Management](#5-state-management)
6. [Graph Visualization System](#6-graph-visualization-system)
7. [Generated API Integration](#7-generated-api-integration)
8. [Configuration](#8-configuration)
9. [Key Files Reference](#9-key-files-reference)

---

## 1. Executive Summary

### 1.1 Feature Overview

Persona Lab is an AI-powered conversational feature that helps users discover and articulate their unique personal narrative for college applications. Through guided conversations, it builds a visual "persona graph" representing the user's experiences, values, and stories.

### 1.2 Key Technologies

| Technology | Purpose |
|------------|---------|
| **Next.js 16 (App Router)** | React framework with client components |
| **React 19** | UI library |
| **TypeScript 5.9** | Type safety |
| **TanStack Query v5** | Server state management (API caching) |
| **Zustand** | Client state management (persisted) |
| **react-force-graph-2d** | Force-directed graph visualization |
| **d3-force** | Physics simulation for graph layout |
| **Orval** | API client code generation |
| **Framer Motion** | Animations |

### 1.3 Architecture Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                        Page Component                            │
│                   (app/(app)/persona-lab/page.tsx)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐         ┌───────────────────────────────┐ │
│  │   ChatSidebar    │         │      Canvas/List View          │ │
│  │ (Conversation)   │         │   (Graph Visualization)        │ │
│  │                  │         │                                 │ │
│  │ ┌──────────────┐ │         │ ┌─────────────────────────────┐│ │
│  │ │ ChatHeader   │ │         │ │ ConcentricGraphCanvas       ││ │
│  │ │ (Coverage)   │ │         │ │ (Desktop force-graph)       ││ │
│  │ └──────────────┘ │         │ └─────────────────────────────┘│ │
│  │ ┌──────────────┐ │   OR    │ ┌─────────────────────────────┐│ │
│  │ │ ChatMessage  │ │         │ │ GraphListView               ││ │
│  │ │ (Messages)   │ │         │ │ (Mobile list fallback)      ││ │
│  │ └──────────────┘ │         │ └─────────────────────────────┘│ │
│  │ ┌──────────────┐ │         │                                 │ │
│  │ │ MessageInput │ │         │                                 │ │
│  │ │ (User input) │ │         │                                 │ │
│  │ └──────────────┘ │         │                                 │ │
│  └──────────────────┘         └───────────────────────────────┘ │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                        State Layer                               │
│  ┌────────────────────┐    ┌──────────────────────────────────┐ │
│  │  Zustand Store     │    │  TanStack Query                  │ │
│  │  (personaStore)    │    │  (Orval-generated hooks)         │ │
│  │  - viewMode        │    │  - useSendGraphMessage           │ │
│  │  - apiGraphNodes   │    │  - useGetCoverage                │ │
│  │  - apiGraphEdges   │    │  - useStartConversation          │ │
│  │  - coverage        │    │  - useExpandNode                 │ │
│  │  - graphMessages   │    │  - etc.                          │ │
│  └────────────────────┘    └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. API Reference Summary

The backend API is documented in `PERSONA_LAB_API.md`. Here's a summary:

### 2.1 Core Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/persona` | GET | Get full persona state |
| `/api/v1/persona/conversation` | GET | Start/continue conversation |
| `/api/v1/persona/conversation/message` | POST | Send message |
| `/api/v1/persona/conversation/reset` | POST | Reset conversation |
| `/api/v1/persona/node/{nodeId}/expand` | POST | Expand node details |
| `/api/v1/persona/coverage` | GET | Get coverage metrics |
| `/api/v1/persona/graph` | GET | Get full graph data |
| `/api/v1/persona/profile/synthesize` | POST | Generate profile summary |
| `/api/v1/persona/voice-profile` | GET | Get voice profile |

### 2.2 Daily Questions Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/persona/daily-questions` | POST | Generate daily questions |
| `/api/v1/persona/daily-questions` | GET | Get today's questions |
| `/api/v1/persona/daily-questions/unanswered` | GET | Get pending questions |
| `/api/v1/persona/daily-questions/{id}/answer` | POST | Submit answer |

### 2.3 Key Data Types

```typescript
// Graph Node (from API)
interface PersonaNodeDto {
  id: string;
  type: "profile_summary" | "essay_angle" | "key_story" | "detail";
  layer: 0 | 1 | 2 | 3;
  title: string;
  content: string;
  tags: string[];
  structuredContent?: {  // STAR+ framework
    situation?: string;
    task?: string;
    action?: string;
    result?: string;
    emotion?: string;
    insight?: string;
  };
  confidence: number;
}

// Graph Edge (from API)
interface PersonaEdgeDto {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  strength: number;
  edgeType: "connection" | "tension";
  label: string;
}

// Coverage Metrics
interface CoverageMetrics {
  goals: number;      // 0-100
  evidence: number;   // 0-100
  skills: number;     // 0-100
  values: number;     // 0-100
  tensions: number;   // 0-100
}
```

### 2.4 Integration Flow

```
1. Page Load
   └── GET /api/v1/persona → Full state

2. Start/Continue Chat
   └── GET /api/v1/persona/conversation → Opening question

3. Chat Loop
   ├── POST /api/v1/persona/conversation/message
   ├── Update canvas with nodesCreated
   ├── Update coverage display
   └── Check completionReady

4. Profile Synthesis (when ready)
   └── POST /api/v1/persona/profile/synthesize

5. Graph Visualization
   └── GET /api/v1/persona/graph → Full graph data
```

---

## 3. Frontend Architecture

### 3.1 File Structure

```
app/
└── (app)/
    └── persona-lab/
        └── page.tsx              # Main page (client component)

components/
└── persona-lab/
    ├── ChatSidebar/
    │   ├── index.tsx             # Chat orchestrator
    │   ├── ChatHeader.tsx        # Coverage progress bar
    │   ├── ChatMessage.tsx       # Message rendering
    │   └── MessageInput.tsx      # Input form
    └── canvas/
        ├── ConcentricGraphCanvas.tsx  # Force-directed graph
        └── GraphListView.tsx          # Mobile list view

lib/
├── config/
│   └── graphConfig.ts            # Node/edge styling
├── hooks/
│   ├── persona/
│   │   ├── index.ts              # Hook exports
│   │   ├── conversation.ts       # Conversation hooks
│   │   ├── graph.ts              # Graph data hooks
│   │   ├── daily-questions.ts    # Daily questions hooks
│   │   └── profile.ts            # Profile synthesis hooks
│   ├── useGraphRenderers.ts      # Canvas painting
│   ├── useGraphInteraction.ts    # User input handling
│   ├── useGraphForces.ts         # D3-force simulation
│   ├── useGraphControls.ts       # Zoom/pan controls
│   └── useContainerDimensions.ts # Responsive sizing
├── store/
│   └── personaStore.ts           # Zustand store
├── types/
│   └── persona.ts                # Frontend types
├── utils/
│   └── graphTransform.ts         # API → ForceGraph transform
└── generated/
    └── api/
        ├── endpoints/persona-lab/  # Orval-generated hooks
        ├── models/                 # TypeScript types
        └── zod/persona-lab/        # Zod schemas
```

### 3.2 Component Hierarchy

```
PersonaLabPage
├── ChatSidebar (collapsible, desktop only)
│   ├── ChatHeader (coverage progress)
│   ├── MessageList
│   │   └── ChatMessage[] (user/assistant messages)
│   └── MessageInput (text input form)
│
├── SidebarToggleButton
│
└── MainContent
    ├── ViewModeToggle (canvas/list buttons)
    └── ContentArea
        ├── ConcentricGraphCanvas (desktop, viewMode=canvas)
        │   ├── ForceGraph2D (react-force-graph-2d)
        │   ├── NodeDetailPanel (selected node info)
        │   ├── ZoomControls
        │   ├── Legend (node type visibility)
        │   └── StatsBar (node/edge counts)
        │
        └── GraphListView (mobile, or viewMode=list)
            └── LayerAccordion[]
                └── NodeListItem[]
```

### 3.3 Dynamic Imports

The page uses Next.js dynamic imports with SSR disabled for canvas components:

```typescript
const ConcentricGraphCanvas = dynamic(
  () => import("@/components/persona-lab/canvas/ConcentricGraphCanvas")
    .then((mod) => mod.ConcentricGraphCanvas),
  { ssr: false, loading: () => <Skeleton /> }
);

const GraphListView = dynamic(
  () => import("@/components/persona-lab/canvas/GraphListView")
    .then((mod) => mod.GraphListView),
  { ssr: false, loading: () => <Skeleton /> }
);
```

---

## 4. Components Deep Dive

### 4.1 ChatSidebar (`components/persona-lab/ChatSidebar/index.tsx`)

The main orchestrator for the chat interface.

**Key Features:**
- Manages API hooks for conversation (TanStack Query)
- Handles message flow: user input → API → store → graph visualization
- Reset conversation with confirmation dialog
- Coverage progress tracking
- Auto-scroll to latest messages
- Completion state detection

**Hooks Used:**
- `useStartConversation()` - Fetch opening message
- `useSendGraphMessage()` - Send user message
- `useResetConversation()` - Reset all data
- `usePersonaStore()` - Access/update local state

**Data Flow:**
```
User types message
    ↓
MessageInput validates (10-5000 chars)
    ↓
useSendGraphMessage.mutate({ content })
    ↓
API returns GraphMessageResponse
    ↓
onSuccess callback:
├── Add user message to store
├── Add assistant response to store
├── processGraphUpdate() → update nodes/edges/coverage
└── Check completionReady flag
    ↓
Graph canvas re-renders with new data
```

### 4.2 ChatHeader (`components/persona-lab/ChatSidebar/ChatHeader.tsx`)

Displays coverage progress across 5 categories.

**Features:**
- 5-segment progress bar (Goals, Evidence, Skills, Values, Tensions)
- Color-coded segments matching `COVERAGE_COLORS`
- Overall progress percentage
- Completion indicator when ready

### 4.3 ChatMessage (`components/persona-lab/ChatSidebar/ChatMessage.tsx`)

Renders individual chat messages.

**Features:**
- User vs. assistant message styling
- Completion celebration messages
- Typing indicator animation
- Basic markdown support (bold text)

### 4.4 MessageInput (`components/persona-lab/ChatSidebar/MessageInput.tsx`)

User input form for sending messages.

**Features:**
- Auto-expanding textarea
- Character validation (10-5000 characters)
- Character counter with color feedback
- Enter-to-send (Shift+Enter for multiline)
- Disabled state during API calls

### 4.5 ConcentricGraphCanvas (`components/persona-lab/canvas/ConcentricGraphCanvas.tsx`)

Main force-directed graph visualization.

**Library:** `react-force-graph-2d` (WebGL canvas rendering)

**Features:**
- 4-layer concentric visualization
- Interactive node selection with detail panel
- STAR structure display for key_story nodes
- Connection and tension edge rendering
- Zoom/pan controls with fit-to-view
- Legend with node type visibility filtering
- Stats badge (node/connection counts)
- Empty state messaging

**Hooks Used:**
- `useGraphForces` - Physics simulation & layout
- `useGraphInteraction` - Click/hover selection
- `useGraphControls` - Camera controls
- `useGraphRenderers` - Canvas painting
- `useExpandNode` - Request follow-up questions

### 4.6 GraphListView (`components/persona-lab/canvas/GraphListView.tsx`)

Mobile-responsive list fallback.

**Features:**
- Accordion-style layer expansion (0-3)
- Nodes grouped by layer
- Color-coded layer headers with counts
- Node detail cards
- Desktop prompt banner on mobile

---

## 5. State Management

### 5.1 Zustand Store (`lib/store/personaStore.ts`)

Persisted client-side store for UI state and graph data.

**Store Name:** `leaply-persona-store-v4`

**State Structure:**
```typescript
interface PersonaStoreState {
  // UI State
  viewMode: "list" | "canvas";

  // Graph Data (from API mutations)
  apiGraphNodes: PersonaNodeDto[];
  apiGraphEdges: PersonaEdgeDto[];
  coverage: CoverageMetrics;
  completionReady: boolean;
  totalNodeCount: number;
  starGapsMap: Record<string, StarStructureKey[]>;

  // Persisted Chat Messages
  graphMessages: ConversationMessage[];

  // Actions
  setViewMode: (mode: ViewMode) => void;
  processGraphUpdate: (response: GraphMessageResponse) => void;
  setCoverage: (coverage: CoverageMetrics) => void;
  setCompletionReady: (ready: boolean) => void;
  addStarGaps: (nodeId: string, gaps: StarStructureKey[]) => void;
  clearApiGraph: () => void;
  getStarGapsForNode: (nodeId: string) => StarStructureKey[];
  addGraphMessage: (message: ConversationMessage) => void;
  clearGraphMessages: () => void;
  resetPersona: () => void;
}
```

**Key Action: `processGraphUpdate()`**

Called after each API mutation to update graph state:
```typescript
processGraphUpdate: (response: GraphMessageResponse) => {
  // Add new nodes (avoid duplicates)
  const newNodes = response.nodesCreated.filter(n => !existingIds.has(n.id));

  // Add new edges (avoid duplicates)
  const newEdges = response.edgesCreated.filter(e => !existingIds.has(e.id));

  // Update STAR gaps for last story
  if (response.starGapsForLastStory?.length > 0) {
    const lastStory = newNodes.reverse().find(n => n.type === "key_story");
    if (lastStory) starGapsMap[lastStory.id] = response.starGapsForLastStory;
  }

  return {
    apiGraphNodes: [...state.apiGraphNodes, ...newNodes],
    apiGraphEdges: [...state.apiGraphEdges, ...newEdges],
    coverage: response.coverage ?? state.coverage,
    completionReady: response.completionReady ?? state.completionReady,
    totalNodeCount: response.totalNodeCount ?? state.totalNodeCount,
  };
}
```

**Selectors:**
```typescript
export const selectViewMode = (state) => state.viewMode;
export const selectApiGraphNodes = (state) => state.apiGraphNodes;
export const selectApiGraphEdges = (state) => state.apiGraphEdges;
export const selectCoverage = (state) => state.coverage;
export const selectCompletionReady = (state) => state.completionReady;
export const selectGraphMessages = (state) => state.graphMessages;
```

### 5.2 TanStack Query Integration

Server state is managed by TanStack Query via Orval-generated hooks.

**Query Key Factory:**
```typescript
export const personaQueryKeys = {
  all: ["persona"] as const,
  conversation: () => [...personaQueryKeys.all, "conversation"] as const,
  graph: () => [...personaQueryKeys.all, "graph"] as const,
  coverage: () => [...personaQueryKeys.all, "coverage"] as const,
  dailyQuestions: () => [...personaQueryKeys.all, "dailyQuestions"] as const,
  profile: () => [...personaQueryKeys.all, "profile"] as const,
};
```

### 5.3 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Input                               │
│                    (MessageInput Component)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   useSendGraphMessage()                          │
│                    (TanStack Query Mutation)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API Response                          │
│                   (GraphMessageResponse)                         │
│  {                                                               │
│    message: { content, type, actions },                          │
│    nodesCreated: [...],                                          │
│    edgesCreated: [...],                                          │
│    coverage: { goals, evidence, skills, values, tensions },      │
│    completionReady: boolean,                                     │
│    starGapsForLastStory: [...]                                   │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ChatSidebar.onSuccess()                         │
│                                                                  │
│  1. addGraphMessage(userMessage)                                 │
│  2. addGraphMessage(assistantMessage)                            │
│  3. processGraphUpdate(response)                                 │
│     - Append new nodes to apiGraphNodes                          │
│     - Append new edges to apiGraphEdges                          │
│     - Update coverage metrics                                    │
│     - Track STAR gaps                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Zustand Store Update                          │
│                   (usePersonaStore)                              │
│                                                                  │
│  State changes trigger React re-renders                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 ConcentricGraphCanvas                            │
│                                                                  │
│  1. usePersonaStore() → apiGraphNodes, apiGraphEdges             │
│  2. useGraphForces() → transform to ForceGraph format            │
│  3. D3-force simulation positions nodes                          │
│  4. Canvas re-renders with new layout                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Graph Visualization System

### 6.1 Force-Directed Layout

The graph uses `react-force-graph-2d` with D3-force simulation.

**Force Configuration (`useGraphForces.ts`):**
```typescript
// Charge force - nodes repel each other
forceCharge: d3.forceManyBody().strength(-600)

// Collision force - prevent overlap
forceCollide: d3.forceCollide()
  .radius(node => Math.max(size * 3 + 50, 70))

// Radial force - layer-based positioning
forceRadial: d3.forceRadial(radius, 0, 0).strength(0.8)
  // Layer 0: radius 0 (center)
  // Layer 1: radius 150
  // Layer 2: radius 280
  // Layer 3: radius 420 + jitter

// Link force - edge distance
forceLink: d3.forceLink().distance(180).strength(0.3)
```

### 6.2 Layer System

4 concentric layers from center to edge:

| Layer | Type | Radius | Color | Size | Description |
|-------|------|--------|-------|------|-------------|
| 0 | `profile_summary` | 0 (center) | Amber | 24px | Overall identity |
| 1 | `essay_angle` | 150px | Violet | 16px | Narrative themes |
| 2 | `key_story` | 280px | Emerald | 12px | Concrete experiences |
| 3 | `detail` | 420px | Blue | 8px | Supporting evidence |

### 6.3 Node Rendering (`useGraphRenderers.ts`)

Custom canvas painting for nodes:

```typescript
paintNode: (node, ctx, globalScale) => {
  const config = getNodeConfig(node.type);

  // Fill circle
  ctx.beginPath();
  ctx.arc(node.x, node.y, config.size, 0, 2 * Math.PI);
  ctx.fillStyle = config.color;
  ctx.fill();

  // Selection ring
  if (isSelected) {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Label (when visible)
  if (showLabels && globalScale > 0.5) {
    ctx.fillStyle = "#ffffff";
    ctx.font = `${10 / globalScale}px sans-serif`;
    ctx.fillText(node.label, node.x, node.y + config.size + 10);
  }
}
```

### 6.4 Edge Rendering

Two edge types with distinct styling:

**Connection Edges:**
- Normal colored lines
- Opacity based on strength
- Types: `enables`, `builds_on`, `supports`, `complements`

**Tension Edges:**
- Animated orange pulse effect
- Dashed line style
- Types: `contradicts`, `evolved_from`, `challenged_by`, `transformed`

```typescript
paintLink: (link, ctx) => {
  ctx.beginPath();
  ctx.moveTo(source.x, source.y);
  ctx.lineTo(target.x, target.y);

  if (isTension) {
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "rgba(249, 115, 22, 0.6)"; // orange
  } else {
    ctx.setLineDash([]);
    ctx.strokeStyle = config.color;
  }

  ctx.lineWidth = config.width * link.strength;
  ctx.stroke();
}
```

### 6.5 Interaction Handling (`useGraphInteraction.ts`)

```typescript
// Node selection
handleNodeClick: (node) => {
  if (selectedNode?.id === node.id) {
    setSelectedNode(null);  // Deselect
  } else {
    setSelectedNode(node);
    highlightConnectedNodes(node);
    zoomToNode(node);
  }
}

// Hover effects
handleNodeHover: (node) => {
  setHoveredNode(node);
}

// Background click
handleBackgroundClick: () => {
  setSelectedNode(null);
  clearHighlights();
}

// Layer visibility toggle
toggleNodeTypeVisibility: (type) => {
  if (hiddenTypes.has(type)) {
    hiddenTypes.delete(type);
  } else {
    hiddenTypes.add(type);
  }
}
```

### 6.6 Data Transformation (`lib/utils/graphTransform.ts`)

Transforms API data to ForceGraph format:

```typescript
function transformApiGraphData(
  nodes: PersonaNodeDto[],
  edges: PersonaEdgeDto[]
): { nodes: ForceGraphNode[], links: ForceGraphLink[] } {

  const forceNodes = nodes.map(node => ({
    id: node.id,
    type: node.type,
    label: node.title,
    layer: node.layer,
    size: getNodeConfig(node.type).size,
    color: getNodeConfig(node.type).color,
    data: node,  // Original API data
  }));

  const forceLinks = edges.map(edge => ({
    source: edge.sourceNodeId,
    target: edge.targetNodeId,
    type: edge.edgeType,
    strength: edge.strength,
    label: edge.label,
    animated: isTensionEdge(edge.label),
  }));

  return { nodes: forceNodes, links: forceLinks };
}
```

---

## 7. Generated API Integration

### 7.1 Orval Configuration

API hooks are auto-generated from OpenAPI spec at `https://api.leaply.ai.vn/api/api-docs`.

**Generated Location:** `lib/generated/api/endpoints/persona-lab/persona-lab.ts`

### 7.2 Query Hooks (GET endpoints)

| Hook | Endpoint | Purpose |
|------|----------|---------|
| `useGetGraph` | `GET /v1/persona/graph` | Full graph data |
| `useGetPersona` | `GET /v1/persona` | Persona response |
| `useGetCoverage` | `GET /v1/persona/coverage` | Coverage metrics |
| `useGetPersonaState` | `GET /v1/persona/state` | Current state |
| `useGetVoiceProfile` | `GET /v1/persona/voice-profile` | Voice profile |
| `useGetCanvas` | `GET /v1/persona/canvas` | Canvas data |
| `useGetCompactContext` | `GET /v1/persona/context/compact` | LLM context |
| `useStartConversation` | `GET /v1/persona/conversation` | Start chat |
| `useGetTodaysQuestions` | `GET /v1/persona/daily-questions/today` | Today's questions |
| `useGetUnansweredQuestions` | `GET /v1/persona/daily-questions/unanswered` | Pending questions |
| `useGetQuestion` | `GET /v1/persona/daily-questions/{id}` | Specific question |
| `useGetDailyQuestions` | `GET /v1/persona/daily-questions` | Question list |

### 7.3 Mutation Hooks (POST endpoints)

| Hook | Endpoint | Purpose |
|------|----------|---------|
| `useSendGraphMessage` | `POST /v1/persona/message` | Send message |
| `useExpandNode` | `POST /v1/persona/nodes/{id}/expand` | Expand node |
| `useResetConversation` | `POST /v1/persona/conversation/reset` | Reset |
| `useSynthesizeProfile` | `POST /v1/persona/synthesize` | Synthesize profile |
| `useSynthesizeTrack` | `POST /v1/persona/track/{id}/synthesize` | Synthesize track |
| `useGenerateArchetype` | `POST /v1/persona/archetype/generate` | Generate archetype |
| `useExtractKeywords` | `POST /v1/persona/keywords/extract` | Extract keywords |
| `useAnswerDailyQuestion` | `POST /v1/persona/daily-questions/answer` | Submit answer |

### 7.4 Hook Organization (`lib/hooks/persona/`)

Hooks are re-exported with organized categories:

```typescript
// lib/hooks/persona/index.ts

// Query keys for cache management
export const personaQueryKeys = {
  all: ["persona"],
  conversation: () => [...personaQueryKeys.all, "conversation"],
  graph: () => [...personaQueryKeys.all, "graph"],
  coverage: () => [...personaQueryKeys.all, "coverage"],
  dailyQuestions: () => [...personaQueryKeys.all, "dailyQuestions"],
  profile: () => [...personaQueryKeys.all, "profile"],
};

// Re-exports by category
export * from "./conversation";  // useSendGraphMessage, useStartConversation, etc.
export * from "./graph";         // useGetGraph, useGetCoverage, etc.
export * from "./daily-questions"; // useGetTodaysQuestions, useAnswerDailyQuestion, etc.
export * from "./profile";       // useSynthesizeProfile, useGenerateArchetype, etc.
```

### 7.5 Zod Validation Schemas

Generated schemas for request/response validation:

**Location:** `lib/generated/api/zod/persona-lab/persona-lab.zod.ts`

```typescript
// Example schemas
export const sendMessageBody = z.object({
  content: z.string().min(10).max(5000),
});

export const expandNodeParams = z.object({
  nodeId: z.string().uuid(),
});

export const extractKeywordsBody = z.object({
  content: z.string().min(5).max(5000),
  trackId: z.string(),
});
```

---

## 8. Configuration

### 8.1 Graph Node Configuration (`lib/config/graphConfig.ts`)

```typescript
export const GRAPH_NODE_CONFIG = {
  profile_summary: {
    color: "#f59e0b",      // amber-500
    hoverColor: "#d97706", // amber-600
    size: 24,
    layer: 0,
    label: "Profile",
    description: "Overall profile with archetype",
  },
  essay_angle: {
    color: "#8b5cf6",      // violet-500
    hoverColor: "#7c3aed", // violet-600
    size: 16,
    layer: 1,
    label: "Essay Angle",
    description: "Patterns and themes for essays",
  },
  key_story: {
    color: "#10b981",      // emerald-500
    hoverColor: "#059669", // emerald-600
    size: 12,
    layer: 2,
    label: "Story",
    description: "Complete narratives with STAR structure",
  },
  detail: {
    color: "#3b82f6",      // blue-500
    hoverColor: "#2563eb", // blue-600
    size: 8,
    layer: 3,
    label: "Detail",
    description: "Specific achievements and evidence",
  },
};
```

### 8.2 Graph Edge Configuration

```typescript
export const GRAPH_EDGE_CONFIG = {
  // Connection types (normal styling)
  enables: { color: "rgba(59, 130, 246, 0.4)", width: 2, animated: false },
  builds_on: { color: "rgba(16, 185, 129, 0.4)", width: 2, animated: false },
  supports: { color: "rgba(139, 92, 246, 0.3)", width: 2, animated: false },
  complements: { color: "rgba(148, 163, 184, 0.3)", width: 1.5, animated: false },

  // Tension types (animated orange pulse)
  contradicts: { color: "rgba(249, 115, 22, 0.6)", width: 2.5, animated: true },
  evolved_from: { color: "rgba(251, 146, 60, 0.5)", width: 2, animated: true },
  challenged_by: { color: "rgba(234, 88, 12, 0.6)", width: 2.5, animated: true },
  transformed: { color: "rgba(253, 186, 116, 0.5)", width: 2, animated: true },
};
```

### 8.3 Coverage Colors

```typescript
export const COVERAGE_COLORS = {
  goals: "#8b5cf6",     // violet-500
  evidence: "#3b82f6",  // blue-500
  skills: "#10b981",    // emerald-500
  values: "#f59e0b",    // amber-500
  tensions: "#f97316",  // orange-500
};

export const COVERAGE_LABELS = {
  goals: "Goals",
  evidence: "Evidence",
  skills: "Skills",
  values: "Values",
  tensions: "Tensions",
};
```

### 8.4 Helper Functions

```typescript
// Get node config by type
export function getNodeConfig(nodeType: string) {
  return ALL_NODE_CONFIG[nodeType] || {
    color: "#94a3b8",
    hoverColor: "#64748b",
    size: 10,
    layer: 2,
    label: nodeType,
  };
}

// Check if edge is a tension type
export function isTensionEdge(edgeType: string): boolean {
  return ["contradicts", "evolved_from", "challenged_by", "transformed"].includes(edgeType);
}
```

---

## 9. Key Files Reference

| File Path | Purpose |
|-----------|---------|
| `app/(app)/persona-lab/page.tsx` | Main page - client component with dynamic imports, sidebar toggle, view mode toggle |
| `components/persona-lab/ChatSidebar/index.tsx` | Chat orchestrator - manages API hooks, message flow, reset functionality |
| `components/persona-lab/ChatSidebar/ChatHeader.tsx` | Coverage progress bar with 5-segment display |
| `components/persona-lab/ChatSidebar/ChatMessage.tsx` | Message rendering with user/assistant styling |
| `components/persona-lab/ChatSidebar/MessageInput.tsx` | Input form with character validation (10-5000) |
| `components/persona-lab/canvas/ConcentricGraphCanvas.tsx` | Force-directed graph visualization using react-force-graph-2d |
| `components/persona-lab/canvas/GraphListView.tsx` | Mobile-friendly list view with accordion layers |
| `lib/store/personaStore.ts` | Zustand store - UI state, graph data, chat messages (persisted) |
| `lib/config/graphConfig.ts` | Node/edge styling, coverage colors, helper functions |
| `lib/types/persona.ts` | Frontend-specific type definitions |
| `lib/hooks/persona/index.ts` | Hook exports and query key factory |
| `lib/hooks/persona/conversation.ts` | Conversation hook re-exports |
| `lib/hooks/persona/graph.ts` | Graph data hook re-exports |
| `lib/hooks/persona/daily-questions.ts` | Daily questions hook re-exports |
| `lib/hooks/persona/profile.ts` | Profile synthesis hook re-exports |
| `lib/hooks/useGraphRenderers.ts` | Canvas painting logic (nodes, edges, tooltips) |
| `lib/hooks/useGraphInteraction.ts` | User input handling (click, hover, selection) |
| `lib/hooks/useGraphForces.ts` | D3-force simulation configuration |
| `lib/hooks/useGraphControls.ts` | Zoom/pan/fit controls |
| `lib/hooks/useContainerDimensions.ts` | ResizeObserver for responsive sizing |
| `lib/utils/graphTransform.ts` | API data to ForceGraph format transformation |
| `lib/generated/api/endpoints/persona-lab/persona-lab.ts` | Orval-generated React Query hooks |
| `lib/generated/api/models/` | TypeScript types from OpenAPI |
| `lib/generated/api/zod/persona-lab/persona-lab.zod.ts` | Zod validation schemas |

---

## Appendix: STAR+ Framework

The Persona Lab uses the STAR+ framework for story nodes:

| Element | Description |
|---------|-------------|
| **S**ituation | Context and setting |
| **T**ask | Challenge or goal faced |
| **A**ction | What the user did |
| **R**esult | Outcome achieved |
| **E**motion | How the user felt |
| **I**nsight | What the user learned |

Stories with missing STAR elements are tracked via `starGapsMap` in the store, allowing the UI to prompt users to expand incomplete narratives.

---

*Report generated from codebase analysis on 2026-01-13*
