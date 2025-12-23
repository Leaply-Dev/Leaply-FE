# Persona Lab - Frontend Implementation Plan

## Overview

This document outlines the implementation plan to refactor the existing Persona Lab feature to match the new specification. The current implementation uses a form-based Q&A approach, while the new spec requires a conversational AI mentor experience with real-time canvas visualization.

**Key Changes:**
- Form-based Q&A → Conversational chat with AI mentor
- Static questions → Dynamic follow-ups (Core Q + 2 follow-ups pattern)
- Local mock data → Backend API integration
- Simple archetype → 8 archetypes with LLM selection

---

## Phase 1: Data Model & Types Refactor

### 1.1 Update Type Definitions

**File:** `lib/types/persona.ts` (new file)

```typescript
// Track Types
export type TrackId =
  | "future_vision"
  | "academic_journey"
  | "activities_impact"
  | "values_turning_points";

export type TrackStatus = "not_started" | "in_progress" | "completed";

export interface Track {
  id: TrackId;
  displayName: string;
  description: string;
  icon: string;
  status: TrackStatus;
  completedAt: string | null;
}

// Message Types
export type MessageRole = "assistant" | "user";
export type MessageType = "text" | "track_selection" | "track_complete";

export interface TrackAction {
  trackId: TrackId;
  displayName: string;
  icon: string;
  status: TrackStatus;
}

export interface CanvasAction {
  action: "add" | "remove" | "reveal_archetype";
  node?: CanvasNode;
  nodeId?: string;
  archetype?: {
    type: ArchetypeType;
    personalizedSummary: string;
  };
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  timestamp: string;
  actions?: TrackAction[];
  canvasActions?: CanvasAction[];
}

// Canvas Node Types
export type NodeType = "story" | "evidence" | "insight" | "archetype";

export interface CanvasNode {
  id: string;
  type: NodeType;
  title: string;
  content: string;
  sourceTrackId: TrackId | null;
  createdAt: string;
  archetypeType?: ArchetypeType;
  personalizedSummary?: string;
}

// Archetype Types
export type ArchetypeType =
  | "innovator"
  | "bridge_builder"
  | "scholar"
  | "advocate"
  | "pioneer"
  | "craftsman"
  | "resilient"
  | "catalyst";

export interface ArchetypeDefinition {
  type: ArchetypeType;
  title: string;
  tagline: string;
  description: string;
  essayStrengths: string[];
  color: string;
}

// Full Persona State
export interface PersonaState {
  userId: string;
  tracks: Record<TrackId, Track>;
  nodes: CanvasNode[];
  archetype: {
    type: ArchetypeType;
    personalizedSummary: string;
    revealedAt: string;
  } | null;
  conversationHistory: ChatMessage[];
  currentTrackId: TrackId | null;
  createdAt: string | null;
  updatedAt: string | null;
}
```

### 1.2 Create Constants File

**File:** `lib/constants/archetypes.ts` (new file)

Define the 8 archetypes with colors matching the spec (Section 8 Appendix).

### 1.3 Update Track Constants

**File:** `lib/constants/tracks.ts` (new file)

```typescript
export const TRACKS = {
  future_vision: {
    id: "future_vision",
    displayName: "Future Vision",
    description: "Khám phá mục tiêu và động lực",
    icon: "target",
    order: 1
  },
  // ... other tracks
} as const;
```

### Tasks:
- [ ] Create `lib/types/persona.ts` with all TypeScript interfaces
- [ ] Create `lib/constants/archetypes.ts` with 8 archetype definitions
- [ ] Create `lib/constants/tracks.ts` with track definitions
- [ ] Update `lib/constants/personaColors.ts` to use new track IDs
- [ ] Add migration mapping from old track IDs to new ones

---

## Phase 2: API Layer

### 2.1 Create API Client

**File:** `lib/api/personaApi.ts` (refactor)

```typescript
export interface PersonaApiResponse {
  // GET /api/v1/persona response
}

export interface TrackSelectResponse {
  message: ChatMessage;
  trackStatus: TrackStatus;
  currentTrackId: TrackId;
}

export interface MessageResponse {
  message: ChatMessage;
  conversationState?: {
    coreQuestionIndex: number;
    followUpIndex: number;
    totalCoreQuestions: number;
  };
  trackStatus?: TrackStatus;
  currentTrackId?: TrackId | null;
  allTracksComplete?: boolean;
}

export const personaApi = {
  // GET /api/v1/persona
  getPersonaState(): Promise<PersonaState>;

  // POST /api/v1/persona/track/select
  selectTrack(trackId: TrackId): Promise<TrackSelectResponse>;

  // POST /api/v1/persona/message
  sendMessage(content: string): Promise<MessageResponse>;

  // POST /api/v1/persona/track/back
  goBackToTrackSelection(): Promise<{ message: ChatMessage; currentTrackId: null }>;

  // POST /api/v1/persona/track/{trackId}/redo
  redoTrack(trackId: TrackId): Promise<MessageResponse>;
};
```

### 2.2 Mock API for Development

Create mock implementations that simulate backend responses until the real API is ready.

### Tasks:
- [ ] Define API response interfaces
- [ ] Implement `personaApi` with all 5 endpoints
- [ ] Create mock API layer for development/demo mode
- [ ] Add error handling and retry logic
- [ ] Add loading states and optimistic updates

---

## Phase 3: Zustand Store Refactor

### 3.1 Refactor PersonaStore

**File:** `lib/store/personaStore.ts` (major refactor)

```typescript
interface PersonaStore {
  // === Data State ===
  tracks: Record<TrackId, Track>;
  nodes: CanvasNode[];
  archetype: { type: ArchetypeType; personalizedSummary: string } | null;
  conversationHistory: ChatMessage[];

  // === UI State ===
  currentTrackId: TrackId | null;
  isLoading: boolean;
  error: string | null;
  viewMode: "canvas" | "list";
  visibleLayers: { story: boolean; evidence: boolean; insight: boolean };
  selectedNodeId: string | null;

  // === Actions ===
  fetchPersonaState: () => Promise<void>;
  selectTrack: (trackId: TrackId) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  goBackToTrackSelection: () => Promise<void>;
  redoTrack: (trackId: TrackId) => Promise<void>;

  // Canvas Actions
  setViewMode: (mode: "canvas" | "list") => void;
  toggleLayer: (layer: "story" | "evidence" | "insight") => void;
  selectNode: (nodeId: string | null) => void;
  processCanvasActions: (actions: CanvasAction[]) => void;

  // Computed
  getCompletedTrackCount: () => number;
  getAvailableTracks: () => Track[];
  isArchetypeRevealed: () => boolean;
}
```

### 3.2 State Flow

```
User Action → API Call → Response → Update State → UI Reacts
                                  ↓
                          Process canvasActions
                                  ↓
                          Animate new nodes
```

### Tasks:
- [ ] Rewrite `personaStore.ts` with new data model
- [ ] Implement async actions with API calls
- [ ] Add `processCanvasActions` for node management
- [ ] Handle conversation history persistence
- [ ] Add optimistic updates for better UX
- [ ] Migrate from old store format (with compatibility layer)

---

## Phase 4: Chat Sidebar Refactor

### 4.1 Component Structure

```
ChatSidebar/
├── ChatSidebar.tsx          # Main container
├── ChatHeader.tsx           # Progress indicator (X/4 tracks)
├── MessageList.tsx          # Scrollable message area
├── ChatMessage.tsx          # Individual message bubble
├── TrackActionCards.tsx     # Track selection buttons
├── BackToTracksButton.tsx   # Navigation during conversation
└── MessageInput.tsx         # Text input + send button
```

### 4.2 ChatMessage Component

Handle different message types:
- `text`: Regular message bubble
- `track_selection`: Message + track cards as action buttons
- `track_complete`: Celebration message + remaining track cards

```typescript
function ChatMessage({ message }: { message: ChatMessage }) {
  if (message.type === "track_selection") {
    return (
      <div>
        <MessageBubble content={message.content} role={message.role} />
        <TrackActionCards tracks={message.actions} />
      </div>
    );
  }
  // ... other types
}
```

### 4.3 TrackActionCards Component

Display clickable track selection cards with:
- Track icon and name
- Status indicator (not started / in progress / completed)
- Completion checkmark for completed tracks
- Click handler to `selectTrack()`

### 4.4 BackToTracksButton

- Always visible during active track conversation
- Calls `goBackToTrackSelection()` without losing progress

### Tasks:
- [ ] Create `ChatHeader.tsx` with progress indicator
- [ ] Create `MessageList.tsx` with auto-scroll
- [ ] Refactor `ChatMessage.tsx` for different message types
- [ ] Create `TrackActionCards.tsx` component
- [ ] Create `BackToTracksButton.tsx` component
- [ ] Refactor `MessageInput.tsx` with loading state
- [ ] Update `ChatSidebar.tsx` to compose new components
- [ ] Add typing indicator animation
- [ ] Handle keyboard shortcuts (Enter to send)

---

## Phase 5: Canvas Refactor

### 5.1 Node Type Changes

| Old Type | New Type | Notes |
|----------|----------|-------|
| core | archetype | Center node, hidden until all tracks complete |
| summary | story | Key narratives from user answers |
| evidence | evidence | Facts, achievements, data points |
| insight | insight | Personal realizations, growth moments |

### 5.2 Color Scheme Update

Nodes colored by type (not by track):

| Node Type | Color | Tailwind |
|-----------|-------|----------|
| Story | Emerald/Teal | `emerald-500` |
| Evidence | Gray/Beige | `stone-400` |
| Insight | Amber/Yellow | `amber-500` |
| Archetype | Brand Green | `primary` |

### 5.3 Node Size

- Archetype: Large (160x160), centered
- Story: Medium (120x80)
- Evidence/Insight: Small (100x60), orbiting related stories

### 5.4 Component Updates

**Files to update:**
- `canvas/nodes/CoreNode.tsx` → Rename to `ArchetypeNode.tsx`
- `canvas/nodes/SummaryNode.tsx` → Rename to `StoryNode.tsx`
- Keep `EvidenceNode.tsx` and `InsightNode.tsx`
- Update `PersonaCanvas.tsx` for new node generation logic

### 5.5 Node Generation from API

```typescript
// Process canvasActions from API response
function processCanvasActions(actions: CanvasAction[]) {
  for (const action of actions) {
    if (action.action === "add" && action.node) {
      // Add new node with animation
      addNodeWithAnimation(action.node);
    }
    if (action.action === "remove" && action.nodeId) {
      // Remove node with animation
      removeNodeWithAnimation(action.nodeId);
    }
    if (action.action === "reveal_archetype" && action.archetype) {
      // Special reveal animation for archetype
      revealArchetypeWithAnimation(action.archetype);
    }
  }
}
```

### Tasks:
- [ ] Rename `CoreNode.tsx` to `ArchetypeNode.tsx` with locked/revealed states
- [ ] Rename `SummaryNode.tsx` to `StoryNode.tsx`
- [ ] Update node colors to be type-based (not track-based)
- [ ] Update node sizes per spec
- [ ] Refactor `PersonaCanvas.tsx` to use API-driven nodes
- [ ] Implement `processCanvasActions` for node CRUD
- [ ] Add node appear/disappear animations (Framer Motion)
- [ ] Add archetype reveal animation
- [ ] Update `NodeDetailModal.tsx` for new node types
- [ ] Update `CanvasControls.tsx` layer filters

---

## Phase 6: List View Update

### 6.1 PersonaListView Refactor

Update to display:
- Nodes grouped by type (Story, Evidence, Insight)
- Source track badge for each node
- Archetype card at top if revealed
- Click to open detail modal

### Tasks:
- [ ] Update `PersonaListView.tsx` for new node structure
- [ ] Add type-based grouping
- [ ] Add source track badges
- [ ] Ensure modal integration works

---

## Phase 7: Animations & Polish

### 7.1 Node Animations

Use Framer Motion for:
- New node fade-in + position animation
- Node removal fade-out
- Archetype reveal (special unlock animation)
- Connection line animations

### 7.2 Chat Animations

- Message appear animation
- Typing indicator
- Track card selection feedback
- Progress bar updates

### Tasks:
- [ ] Add Framer Motion wrapper for canvas nodes
- [ ] Implement node appear animation
- [ ] Implement archetype reveal animation
- [ ] Add message animations in chat
- [ ] Add loading skeletons

---

## Phase 8: Error Handling & Edge Cases

### 8.1 Error States

- Network failure → Retry button
- LLM timeout → "Try again" message
- Session expired → Redirect to login

### 8.2 Empty States

- New user → Welcome message + track cards
- No nodes yet → Empty canvas with "Start your journey" prompt

### 8.3 Edge Cases

- Track redo → Clear track's nodes, keep others
- Back button during track → Preserve progress
- Browser refresh → Restore from API

### Tasks:
- [ ] Add error boundary for canvas
- [ ] Implement retry logic for failed messages
- [ ] Add empty state components
- [ ] Handle session restoration
- [ ] Add toast notifications for errors

---

## Phase 9: Integration & Testing

### 9.1 Integration Points

- Connect chat to real API
- Connect canvas to real-time node updates
- Sync state across components

### 9.2 Testing

- Unit tests for store actions
- Component tests for message rendering
- Integration tests for full conversation flow

### Tasks:
- [ ] Write unit tests for personaStore
- [ ] Write component tests for ChatMessage types
- [ ] Test API error scenarios
- [ ] Test track completion flow
- [ ] Test archetype reveal flow

---

## File Changes Summary

### New Files
```
lib/types/persona.ts
lib/constants/archetypes.ts
lib/constants/tracks.ts
components/persona-lab/ChatSidebar/ChatHeader.tsx
components/persona-lab/ChatSidebar/MessageList.tsx
components/persona-lab/ChatSidebar/TrackActionCards.tsx
components/persona-lab/ChatSidebar/BackToTracksButton.tsx
components/persona-lab/canvas/nodes/ArchetypeNode.tsx
components/persona-lab/canvas/nodes/StoryNode.tsx
```

### Major Refactors
```
lib/store/personaStore.ts (major rewrite)
lib/api/personaApi.ts (major rewrite)
lib/constants/personaColors.ts (update track IDs)
components/persona-lab/ChatSidebar.tsx (major refactor)
components/persona-lab/canvas/PersonaCanvas.tsx (refactor node generation)
components/persona-lab/canvas/NodeDetailModal.tsx (update for new types)
components/persona-lab/PersonaListView.tsx (update for new structure)
```

### Files to Delete/Rename
```
canvas/nodes/CoreNode.tsx → ArchetypeNode.tsx
canvas/nodes/SummaryNode.tsx → StoryNode.tsx
```

---

## Implementation Order

### Sprint 1: Foundation (Phase 1-2)
1. Create new type definitions
2. Create constants (archetypes, tracks)
3. Implement API client with mock layer

### Sprint 2: State & Chat (Phase 3-4)
4. Refactor Zustand store
5. Refactor chat sidebar components
6. Implement conversation flow

### Sprint 3: Canvas (Phase 5-6)
7. Update node components
8. Refactor canvas node generation
9. Update list view

### Sprint 4: Polish (Phase 7-9)
10. Add animations
11. Implement error handling
12. Testing and bug fixes

---

## Demo Mode Considerations

Since this is a demo app, maintain mock data capability:
- Keep mock conversation responses
- Simulate LLM node extraction
- Demo archetype reveal after 4 tracks
- Preserve existing demo stories for showcase

---

## Dependencies

No new dependencies required. Use existing:
- `@xyflow/react` for canvas
- `framer-motion` for animations
- `zustand` for state
- `lucide-react` for icons

---

## Notes

1. **Backward Compatibility**: The old track IDs (`academic`, `activities`, `values`, `future`) should be mappable to new IDs during migration.

2. **Real-time Updates**: Canvas should react immediately to `canvasActions` from API responses.

3. **Conversation Persistence**: Chat history is stored on backend and restored on page load.

4. **Archetype Sync**: Frontend `ARCHETYPES` constant must match backend exactly.
