# Persona Lab - Feature Specification

## Overview

Persona Lab is a guided self-discovery tool that helps users uncover their personal narrative for study abroad applications. Unlike a free-form chatbot, it uses structured questioning across 4 thematic tracks to extract stories, identify personality patterns, and generate essay angles.

**Core Principle**: AI acts as a mentor who asks probing questions, not a chatbot that answers them.

**Layout**: Split-screen with Chat Sidebar (left) + Persona Canvas (right). The chat drives the conversation; the canvas visualizes insights in real-time.

---

## 1. User View

### 1.1 Screen Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Leaply    Home    Explore    Applications    [Persona Lab]         🌐 JD │
├──────────────────────┬─────────────────────────────────────────────────────┤
│                      │                                                     │
│  Discovery Chat      │  Persona Canvas                    [Canvas] [List]  │
│  ━━━━━━━━━━━ 2/4     │  Your unique story visualized                       │
│                      │                                                     │
│  ┌────────────────┐  │  ┌─────────────────────────────────────────────┐   │
│  │ ✓ Track done!  │  │  │                                             │   │
│  │ Amazing! You   │  │  │    ┌─────────┐        ┌─────────┐          │   │
│  │ completed      │  │  │    │ Story 1 │        │ Story 2 │          │   │
│  │ Academic       │  │  │    └─────────┘        └─────────┘          │   │
│  │ Journey.       │  │  │                                             │   │
│  └────────────────┘  │  │         ┌───────────────────┐               │   │
│                      │  │         │   ? ? ?           │               │   │
│  Which track would   │  │         │   Archetype       │               │   │
│  you like to explore │  │         │   (Complete all   │               │   │
│  next?               │  │         │   tracks to       │               │   │
│                      │  │         │   reveal)         │               │   │
│  ┌────────────────┐  │  │         └───────────────────┘               │   │
│  │ 🌟 Activities  │  │  │                                             │   │
│  │ & Impact       │  │  │    ┌─────────┐        ┌─────────┐          │   │
│  └────────────────┘  │  │    │ Insight │        │Evidence │          │   │
│  ┌────────────────┐  │  │    └─────────┘        └─────────┘          │   │
│  │ 💎 Values &    │  │  │                                             │   │
│  │ Turning Points │  │  │                                 [+][-][⛶]  │   │
│  └────────────────┘  │  └─────────────────────────────────────────────┘   │
│                      │                                                     │
│  [← Back to tracks]  │                                                     │
│                      │                                                     │
│  ┌────────────────────────────────────┐                                   │
│  │ Type your message...        [Send] │                                   │
│  └────────────────────────────────────┘                                   │
└──────────────────────┬─────────────────────────────────────────────────────┘
```

### 1.2 What the User Sees

**Left Panel - Chat Sidebar:**
- Progress indicator (X/4 tracks completed)
- Conversation with AI mentor
- Track selection cards (appear as action buttons)
- "Back to tracks" button during conversation
- Message input

**Right Panel - Persona Canvas:**
- Toggle: Canvas view / List view
- Layers dropdown (filter node types)
- Central Archetype card (hidden until all 4 tracks complete)
- Story/Evidence/Insight nodes orbiting
- Zoom controls (+/-/fullscreen)

### 1.3 User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│  ENTRY                                                          │
│  User clicks "Persona Lab" from top nav                         │
│  → Chat shows welcome + 4 track cards as action buttons         │
│  → Canvas shows empty state with locked Archetype center        │
└─────────────────┬───────────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  TRACK SELECTION                                                │
│  Chat displays 4 clickable track cards:                         │
│  • 🎯 Future Vision - "Khám phá mục tiêu và động lực"           │
│  • 📚 Academic Journey - "Hành trình học thuật của bạn"         │
│  • 🌟 Activities & Impact - "Hoạt động và ảnh hưởng"            │
│  • 💎 Values & Turning Points - "Giá trị và bước ngoặt"         │
│  User clicks one to start                                       │
└─────────────────┬───────────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  QUESTION FLOW (per core question)                              │
│                                                                 │
│  AI: [Core Question]                                            │
│  User: [Answer]                                                 │
│       ↓                                                         │
│  AI: [Follow-up 1: Ask for specific details/examples]           │
│  User: [Answer with details]                                    │
│       ↓                                                         │
│  AI: [Follow-up 2: Probe emotion/motivation/insight]            │
│  User: [Answer with reflection]                                 │
│       ↓                                                         │
│  → Canvas: New node(s) appear if LLM extracts insight           │
│       ↓                                                         │
│  AI: [Next Core Question] or [Track Complete]                   │
│                                                                 │
│  [← Back to tracks] button always visible                       │
└─────────────────┬───────────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  TRACK COMPLETE                                                 │
│  AI: "Amazing! You've completed [Track Name]."                  │
│  AI: "Which track would you like to explore next?"              │
│  → Remaining track cards appear as action buttons               │
│  → Canvas progress updates (X/4)                                │
└─────────────────┬───────────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  ALL 4 TRACKS COMPLETE                                          │
│  AI: "Congratulations! You've completed all discovery tracks."  │
│  → Canvas: Archetype card revealed with animation               │
│  → AI explains the archetype and how it connects to stories     │
│  → User can still redo any track if desired                     │
└─────────────────┬───────────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  ONGOING USE                                                    │
│  User can:                                                      │
│  - View canvas, zoom around, click nodes for details            │
│  - Redo any track (clears that track's nodes, re-discovers)     │
│  - Use Persona data in Application Dashboard essay writing      │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Question Flow Detail (Fixed 2 Follow-ups)

Each track has 4 core questions. Each core question follows this exact pattern:

```
┌──────────────────────────────────────────────────────────────────┐
│  CORE QUESTION                                                   │
│  AI: "5-10 năm sau, một ngày làm việc điển hình của bạn         │
│       như thế nào?"                                              │
│                                                                  │
│  User types answer...                                            │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  FOLLOW-UP 1: DETAILS & SPECIFICS                                │
│  Purpose: Get concrete examples, specifics, context              │
│                                                                  │
│  AI: "Cụ thể bạn hình dung mình đang làm gì? Ở công ty          │
│       lớn hay startup? Làm việc với ai?"                         │
│                                                                  │
│  User types answer...                                            │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  FOLLOW-UP 2: EMOTION & INSIGHT                                  │
│  Purpose: Uncover motivation, feelings, deeper meaning           │
│                                                                  │
│  AI: "Điều gì khiến bạn quan tâm đến lĩnh vực này?              │
│       Có kỷ niệm hay người nào ảnh hưởng đến định hướng này?"    │
│                                                                  │
│  User types answer...                                            │
│                                                                  │
│  → LLM evaluates: Is there an extractable insight/story?         │
│  → If yes: Canvas action returned, new node appears              │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  TRANSITION                                                      │
│  AI acknowledges insight, then moves to Core Question 2          │
│  (or Track Complete if last question)                            │
└──────────────────────────────────────────────────────────────────┘
```

**Example Full Flow:**

```
AI: "Môn học hoặc dự án nào khiến bạn hứng thú nhất trong 
     quá trình học? Tại sao?"

User: "Môn Machine Learning, vì nó rất thú vị"

AI: "Machine Learning thú vị ở điểm nào với bạn? Bạn đã làm 
     project gì trong môn này? Kết quả ra sao?"

User: "Em làm project dự đoán giá nhà, được điểm cao nhất lớp. 
       Em thích việc dữ liệu có thể cho ra insight bất ngờ."

AI: "Cảm giác của bạn thế nào khi khám phá những insight bất ngờ đó? 
     Có moment nào trong project khiến bạn thực sự excited không?"

User: "Có, lúc em phát hiện ra biến số 'khoảng cách đến trường học' 
       ảnh hưởng đến giá nhà nhiều hơn em nghĩ. Em realize là 
       data science có thể thay đổi cách người ta ra quyết định."

→ [Canvas: New node appears - "Data reveals hidden truths"]

AI: "Đó là một insight rất hay về sức mạnh của data! 
     Câu tiếp theo: Thử thách học thuật lớn nhất bạn đã 
     vượt qua là gì?"
```

### 1.5 Canvas Node Types & Colors

Nodes are color-coded by type, not by source track:

| Node Type | Color | Description | When Created |
|-----------|-------|-------------|--------------|
| **Story** | Accent color (green/teal) | Key narrative that can be used in essays | LLM extracts from emotional/meaningful answers |
| **Evidence** | Muted color (grey/beige) | Supporting facts, achievements, data points | LLM extracts from detail follow-ups |
| **Insight** | Highlight color (yellow/amber) | Personal realizations, growth moments | LLM extracts from reflection answers |
| **Archetype** | Primary color (brand green) | Central identity card | After all 4 tracks complete |

**Node Size:**
- Archetype: Large, centered
- Story: Medium
- Evidence/Insight: Small, orbiting related stories

### 1.6 Canvas Interactions (MVP)

| Action | Supported | Behavior |
|--------|-----------|----------|
| Click node | ✅ | Opens modal with full content |
| Zoom in/out | ✅ | +/- buttons or scroll wheel |
| Pan/drag canvas | ✅ | Click and drag background |
| Fullscreen | ✅ | Expand canvas to full view |
| Edit node | ❌ | Not in MVP |
| Delete node | ❌ | Not in MVP |
| Drag node position | ❌ | Not in MVP |
| Add custom node | ❌ | Not in MVP |

---

## 2. Data Model (Shared Contract)

This section defines the exact data structures that both Frontend and Backend must agree on.

### 2.1 Archetype (Fixed List)

There are exactly 8 archetypes. LLM must pick from this list based on completed tracks.

```typescript
type ArchetypeType = 
  | "innovator"
  | "bridge_builder" 
  | "scholar"
  | "advocate"
  | "pioneer"
  | "craftsman"
  | "resilient"
  | "catalyst";

const ARCHETYPES: Record<ArchetypeType, ArchetypeDefinition> = {
  innovator: {
    type: "innovator",
    title: "The Innovator",
    tagline: "Creating novel solutions to complex problems",
    description: "You see possibilities where others see obstacles. Your mind naturally gravitates toward improvement and invention, whether in technology, processes, or ideas.",
    essayStrengths: ["Problem-solving narratives", "Technical creativity", "Future-oriented vision"],
    illustrationKey: "innovator_illustration" // For AI-generated art
  },
  bridge_builder: {
    type: "bridge_builder",
    title: "The Bridge Builder", 
    tagline: "Connecting disparate worlds and people",
    description: "You thrive at intersections—between cultures, disciplines, or communities. Your strength lies in translation and synthesis, making connections others miss.",
    essayStrengths: ["Cross-cultural narratives", "Interdisciplinary thinking", "Collaboration stories"],
    illustrationKey: "bridge_builder_illustration"
  },
  scholar: {
    type: "scholar",
    title: "The Scholar",
    tagline: "Driven by intellectual curiosity and depth",
    description: "Knowledge isn't just useful to you—it's exciting. You pursue understanding for its own sake and find joy in mastering complex subjects.",
    essayStrengths: ["Research motivation", "Intellectual journey", "Deep expertise"],
    illustrationKey: "scholar_illustration"
  },
  advocate: {
    type: "advocate",
    title: "The Advocate",
    tagline: "Fighting for causes and communities",
    description: "You're driven by purpose beyond personal gain. Whether for social justice, environmental causes, or underserved communities, you channel your energy toward meaningful impact.",
    essayStrengths: ["Social impact narratives", "Community leadership", "Values-driven decisions"],
    illustrationKey: "advocate_illustration"
  },
  pioneer: {
    type: "pioneer",
    title: "The Pioneer",
    tagline: "Venturing into uncharted territory",
    description: "You're drawn to firsts—first in your family, first to try something new, first to take a risk. Uncertainty doesn't deter you; it motivates you.",
    essayStrengths: ["First-generation narratives", "Risk-taking stories", "Trailblazing moments"],
    illustrationKey: "pioneer_illustration"
  },
  craftsman: {
    type: "craftsman",
    title: "The Craftsman",
    tagline: "Mastering skills through deliberate practice",
    description: "You believe in excellence through dedication. Whether in art, engineering, or any discipline, you pursue mastery with patience and precision.",
    essayStrengths: ["Skill development journey", "Attention to detail", "Long-term commitment"],
    illustrationKey: "craftsman_illustration"
  },
  resilient: {
    type: "resilient",
    title: "The Resilient",
    tagline: "Transforming challenges into growth",
    description: "Your story is defined not by what happened to you, but by how you responded. Setbacks become setups for comebacks in your narrative.",
    essayStrengths: ["Overcoming adversity", "Growth from failure", "Perseverance stories"],
    illustrationKey: "resilient_illustration"
  },
  catalyst: {
    type: "catalyst",
    title: "The Catalyst",
    tagline: "Sparking change in systems and people",
    description: "You don't just participate—you transform. Whether leading organizations, changing processes, or inspiring others, you leave things different than you found them.",
    essayStrengths: ["Leadership transformation", "Change management", "Influence stories"],
    illustrationKey: "catalyst_illustration"
  }
};
```

### 2.2 Track

```typescript
type TrackId = "future_vision" | "academic_journey" | "activities_impact" | "values_turning_points";

type TrackStatus = "not_started" | "in_progress" | "completed";

interface Track {
  id: TrackId;
  displayName: string;           // "Future Vision"
  description: string;           // "Khám phá mục tiêu và động lực"
  icon: string;                  // "🎯"
  status: TrackStatus;
  completedAt: string | null;    // ISO timestamp
}
```

### 2.3 Conversation Message

```typescript
type MessageRole = "assistant" | "user";
type MessageType = "text" | "track_selection" | "track_complete";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  timestamp: string;
  
  // For assistant messages with actions
  actions?: TrackAction[];        // Track cards to display
  canvasActions?: CanvasAction[]; // Nodes to add to canvas
}

interface TrackAction {
  trackId: TrackId;
  displayName: string;
  icon: string;
  status: TrackStatus;
}
```

### 2.4 Canvas Node

```typescript
type NodeType = "story" | "evidence" | "insight" | "archetype";

interface CanvasNode {
  id: string;
  type: NodeType;
  title: string;                 // Short label shown on node
  content: string;               // Full content shown on click
  sourceTrackId: TrackId | null; // null for archetype
  createdAt: string;
  
  // For archetype node only
  archetypeType?: ArchetypeType;
  personalizedSummary?: string;  // LLM-generated based on user's stories
}

interface CanvasAction {
  action: "add" | "remove" | "reveal_archetype";
  node?: CanvasNode;             // For "add"
  nodeId?: string;               // For "remove"
  archetype?: {                  // For "reveal_archetype"
    type: ArchetypeType;
    personalizedSummary: string;
  };
}
```

### 2.5 Full Persona State

```typescript
interface PersonaState {
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
  createdAt: string;
  updatedAt: string;
}
```

---

## 3. Frontend Implementation

### 3.1 Views & Components

```
PersonaLab/
├── PersonaLabPage.tsx              # Main container with split layout
├── ChatSidebar/
│   ├── ChatSidebar.tsx             # Left panel container
│   ├── ChatHeader.tsx              # Progress indicator (X/4)
│   ├── MessageList.tsx             # Scrollable message area
│   ├── ChatMessage.tsx             # Individual message bubble
│   ├── TrackActionCards.tsx        # Track selection buttons
│   ├── BackToTracksButton.tsx      # Navigation during conversation
│   └── MessageInput.tsx            # Text input + send button
├── PersonaCanvas/
│   ├── PersonaCanvas.tsx           # Right panel container
│   ├── CanvasHeader.tsx            # Title + view toggle + layers
│   ├── CanvasView.tsx              # Force-directed node visualization
│   ├── CanvasNode.tsx              # Individual node component
│   ├── ArchetypeNode.tsx           # Special center node (locked/revealed)
│   ├── NodeDetailModal.tsx         # Full content on click
│   ├── ZoomControls.tsx            # +/-/fullscreen buttons
│   └── ListView.tsx                # Alternative list view of nodes
└── shared/
    ├── archetypes.ts               # ARCHETYPES constant (must match backend)
    └── types.ts                    # TypeScript interfaces
```

### 3.2 State Management (Zustand)

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
  
  // Initial load
  fetchPersonaState: () => Promise<void>;
  
  // Chat flow
  selectTrack: (trackId: TrackId) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  goBackToTrackSelection: () => void;
  
  // Canvas
  setViewMode: (mode: "canvas" | "list") => void;
  toggleLayer: (layer: "story" | "evidence" | "insight") => void;
  selectNode: (nodeId: string | null) => void;
  
  // Computed
  getCompletedTrackCount: () => number;
  getAvailableTracks: () => Track[];
  isArchetypeRevealed: () => boolean;
}
```

### 3.3 Key UI Behaviors

**Entry State:**
- On mount, call `fetchPersonaState()` to get existing progress
- If no conversation history, show welcome message + 4 track cards
- If conversation exists, restore to last state

**Track Selection:**
- Track cards appear as clickable buttons in chat
- Completed tracks show checkmark but can still be selected (redo)
- Clicking a track calls `selectTrack(trackId)` → API returns first question

**Message Flow:**
```
User types message
    ↓
sendMessage(content)
    ↓
POST /api/v1/persona/message
    ↓
Response includes:
  - assistantMessage (next question or acknowledgment)
  - canvasActions? (nodes to add)
  - trackComplete? (show track selection again)
  - archetypeRevealed? (show archetype)
    ↓
Update local state
    ↓
If canvasActions, animate new nodes appearing
```

**Canvas Updates:**
- When response includes `canvasActions`, process each action:
  - `add`: Animate new node appearing (fade in + position)
  - `remove`: Animate node disappearing (for track redo)
  - `reveal_archetype`: Special animation for center card unlock

**Back Button:**
- Always visible during active track conversation
- Clicking pauses current track (doesn't lose progress)
- Shows remaining track cards

**Track Redo:**
- After all 4 complete, user can click any track to redo
- Redo clears that track's nodes from canvas
- Archetype may change after redo completes

**Node Click:**
- Opens modal with full content
- Modal shows: title, full content, source track badge
- Close button only (no actions in MVP)

### 3.4 Chat Message Rendering

```typescript
function renderMessage(message: ChatMessage) {
  if (message.type === "track_selection") {
    return (
      <div>
        <p>{message.content}</p>
        <TrackActionCards 
          tracks={message.actions} 
          onSelect={selectTrack}
        />
      </div>
    );
  }
  
  if (message.type === "track_complete") {
    return (
      <div className="celebration">
        <p>{message.content}</p>
        {message.actions && (
          <TrackActionCards 
            tracks={message.actions}
            onSelect={selectTrack}
          />
        )}
      </div>
    );
  }
  
  return <p>{message.content}</p>;
}
```

### 3.5 Archetype Sync

The `ARCHETYPES` constant must be identical on frontend and backend:

```typescript
// src/shared/archetypes.ts
export const ARCHETYPES = {
  innovator: {
    type: "innovator",
    title: "The Innovator",
    tagline: "Creating novel solutions to complex problems",
    // ... full definition
  },
  // ... all 8 archetypes
} as const;

export type ArchetypeType = keyof typeof ARCHETYPES;
```

Backend returns only `{ type: "innovator", personalizedSummary: "..." }`.
Frontend looks up the full definition from the constant.

---

## 4. Backend API Specification

### 4.1 Technology Choice: Spring AI

**Why Spring AI over LangChain4j:**

| Aspect | LangChain4j | Spring AI |
|--------|-------------|-----------|
| Spring Integration | Manual wiring | Native, auto-config |
| Memory Management | Custom implementation | Built-in `ChatMemory` |
| Structured Output | Via prompt engineering | Native `@JsonSchema` support |
| Observability | Manual | Micrometer/actuator built-in |
| Community | Growing | Spring ecosystem backing |
| Learning Curve | Steeper | Familiar for Spring devs |

**Decision**: Use Spring AI for cleaner integration and future RAG needs (essay ideation accessing persona graph).

### 4.2 Endpoints Overview

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/persona` | Fetch full persona state |
| POST | `/api/v1/persona/track/select` | Select a track to start/continue |
| POST | `/api/v1/persona/message` | Send message in current track conversation |
| POST | `/api/v1/persona/track/back` | Go back to track selection |
| POST | `/api/v1/persona/track/{trackId}/redo` | Reset and redo a completed track |

### 4.3 Endpoint Details

#### GET `/api/v1/persona`

Returns full persona state for authenticated user. Called on page load.

**Response 200:**
```json
{
  "userId": "user_123",
  "tracks": {
    "future_vision": {
      "id": "future_vision",
      "displayName": "Future Vision",
      "description": "Khám phá mục tiêu và động lực",
      "icon": "🎯",
      "status": "completed",
      "completedAt": "2025-01-15T10:30:00Z"
    },
    "academic_journey": {
      "id": "academic_journey",
      "displayName": "Academic Journey",
      "description": "Hành trình học thuật của bạn",
      "icon": "📚",
      "status": "in_progress",
      "completedAt": null
    },
    "activities_impact": {
      "id": "activities_impact",
      "displayName": "Activities & Impact",
      "description": "Hoạt động và ảnh hưởng",
      "icon": "🌟",
      "status": "not_started",
      "completedAt": null
    },
    "values_turning_points": {
      "id": "values_turning_points",
      "displayName": "Values & Turning Points",
      "description": "Giá trị và bước ngoặt",
      "icon": "💎",
      "status": "not_started",
      "completedAt": null
    }
  },
  "nodes": [
    {
      "id": "node_abc123",
      "type": "story",
      "title": "Agricultural roots",
      "content": "Growing up watching grandparents farm shaped a deep connection to agricultural problems...",
      "sourceTrackId": "future_vision",
      "createdAt": "2025-01-15T10:25:00Z"
    },
    {
      "id": "node_def456",
      "type": "evidence",
      "title": "ML project success",
      "content": "Top score in class for house price prediction project",
      "sourceTrackId": "academic_journey",
      "createdAt": "2025-01-15T11:00:00Z"
    }
  ],
  "archetype": null,
  "conversationHistory": [
    {
      "id": "msg_001",
      "role": "assistant",
      "content": "Chào bạn! Tôi là mentor AI của Leaply...",
      "type": "track_selection",
      "timestamp": "2025-01-15T09:00:00Z",
      "actions": [
        { "trackId": "future_vision", "displayName": "Future Vision", "icon": "🎯", "status": "not_started" },
        { "trackId": "academic_journey", "displayName": "Academic Journey", "icon": "📚", "status": "not_started" },
        { "trackId": "activities_impact", "displayName": "Activities & Impact", "icon": "🌟", "status": "not_started" },
        { "trackId": "values_turning_points", "displayName": "Values & Turning Points", "icon": "💎", "status": "not_started" }
      ]
    }
  ],
  "currentTrackId": "academic_journey",
  "createdAt": "2025-01-15T09:00:00Z",
  "updatedAt": "2025-01-15T11:00:00Z"
}
```

**Response 200 (New user, no persona yet):**
```json
{
  "userId": "user_123",
  "tracks": {
    "future_vision": { "id": "future_vision", "status": "not_started", ... },
    "academic_journey": { "id": "academic_journey", "status": "not_started", ... },
    "activities_impact": { "id": "activities_impact", "status": "not_started", ... },
    "values_turning_points": { "id": "values_turning_points", "status": "not_started", ... }
  },
  "nodes": [],
  "archetype": null,
  "conversationHistory": [],
  "currentTrackId": null,
  "createdAt": null,
  "updatedAt": null
}
```

---

#### POST `/api/v1/persona/track/select`

Select a track to begin or continue. Returns initial AI message with first question.

**Request Body:**
```json
{
  "trackId": "future_vision"
}
```

**Response 200:**
```json
{
  "message": {
    "id": "msg_002",
    "role": "assistant",
    "content": "Tuyệt vời! Hãy bắt đầu khám phá Future Vision của bạn.\n\n5-10 năm sau, một ngày làm việc điển hình của bạn như thế nào? Hãy mô tả chi tiết: bạn làm gì, ở đâu, với ai?",
    "type": "text",
    "timestamp": "2025-01-15T10:00:00Z"
  },
  "trackStatus": "in_progress",
  "currentTrackId": "future_vision"
}
```

**Response 200 (Continuing in-progress track):**
```json
{
  "message": {
    "id": "msg_015",
    "role": "assistant",
    "content": "Chào mừng bạn quay lại! Chúng ta đang ở câu hỏi về thử thách học thuật. Thử thách học thuật lớn nhất bạn đã vượt qua là gì?",
    "type": "text",
    "timestamp": "2025-01-15T14:00:00Z"
  },
  "trackStatus": "in_progress",
  "currentTrackId": "academic_journey"
}
```

---

#### POST `/api/v1/persona/message`

Send a message in the current track conversation. This is the main conversation endpoint.

**Request Body:**
```json
{
  "content": "Tôi muốn làm việc trong lĩnh vực AI, giúp giải quyết vấn đề nông nghiệp"
}
```

**Response 200 (Follow-up 1 - Details):**
```json
{
  "message": {
    "id": "msg_003",
    "role": "assistant",
    "content": "AI cho nông nghiệp - đó là hướng đi rất có ý nghĩa! Cụ thể bạn hình dung mình đang làm gì? Ở công ty lớn, startup, hay tổ chức nghiên cứu? Làm việc với những ai?",
    "type": "text",
    "timestamp": "2025-01-15T10:01:00Z"
  },
  "conversationState": {
    "coreQuestionIndex": 0,
    "followUpIndex": 1,
    "totalCoreQuestions": 4
  }
}
```

**Response 200 (Follow-up 2 - Emotion + Canvas Action):**
```json
{
  "message": {
    "id": "msg_005",
    "role": "assistant",
    "content": "Startup của riêng mình để giúp nông dân - tôi thấy được passion rất rõ! Điều gì khiến bạn quan tâm đặc biệt đến nông nghiệp? Có kỷ niệm hay người nào ảnh hưởng đến định hướng này không?",
    "type": "text",
    "timestamp": "2025-01-15T10:03:00Z",
    "canvasActions": [
      {
        "action": "add",
        "node": {
          "id": "node_001",
          "type": "evidence",
          "title": "Startup ambition",
          "content": "Wants to build own startup focused on agricultural AI solutions",
          "sourceTrackId": "future_vision",
          "createdAt": "2025-01-15T10:03:00Z"
        }
      }
    ]
  },
  "conversationState": {
    "coreQuestionIndex": 0,
    "followUpIndex": 2,
    "totalCoreQuestions": 4
  }
}
```

**Response 200 (Moving to next core question + Canvas Action):**
```json
{
  "message": {
    "id": "msg_007",
    "role": "assistant",
    "content": "Câu chuyện về ông bà và mảnh đất quê rất đẹp và có chiều sâu. Tôi có thể thấy nguồn gốc của passion này.\n\nCâu tiếp theo: Vấn đề nào bạn muốn góp phần giải quyết qua công việc của mình?",
    "type": "text",
    "timestamp": "2025-01-15T10:05:00Z",
    "canvasActions": [
      {
        "action": "add",
        "node": {
          "id": "node_002",
          "type": "story",
          "title": "Agricultural roots",
          "content": "Grandparents were farmers. Watching them struggle with unpredictable weather and crop diseases created a deep personal connection to agricultural challenges.",
          "sourceTrackId": "future_vision",
          "createdAt": "2025-01-15T10:05:00Z"
        }
      }
    ]
  },
  "conversationState": {
    "coreQuestionIndex": 1,
    "followUpIndex": 0,
    "totalCoreQuestions": 4
  }
}
```

**Response 200 (Track Complete):**
```json
{
  "message": {
    "id": "msg_020",
    "role": "assistant",
    "content": "Tuyệt vời! Bạn đã hoàn thành Future Vision track! 🎉\n\nTôi đã thu thập được nhiều insight quý giá về định hướng và động lực của bạn.\n\nBạn muốn khám phá track nào tiếp theo?",
    "type": "track_complete",
    "timestamp": "2025-01-15T10:30:00Z",
    "actions": [
      { "trackId": "academic_journey", "displayName": "Academic Journey", "icon": "📚", "status": "not_started" },
      { "trackId": "activities_impact", "displayName": "Activities & Impact", "icon": "🌟", "status": "not_started" },
      { "trackId": "values_turning_points", "displayName": "Values & Turning Points", "icon": "💎", "status": "not_started" }
    ],
    "canvasActions": [
      {
        "action": "add",
        "node": {
          "id": "node_010",
          "type": "insight",
          "title": "Purpose-driven technologist",
          "content": "Technology is not the goal but the means to solve real human problems, particularly for underserved communities.",
          "sourceTrackId": "future_vision",
          "createdAt": "2025-01-15T10:30:00Z"
        }
      }
    ]
  },
  "trackStatus": "completed",
  "currentTrackId": null
}
```

**Response 200 (All 4 Tracks Complete - Archetype Revealed):**
```json
{
  "message": {
    "id": "msg_100",
    "role": "assistant",
    "content": "Chúc mừng! Bạn đã hoàn thành tất cả 4 discovery tracks! 🎊\n\nSau khi phân tích toàn bộ câu chuyện của bạn, tôi nhận ra bạn là...",
    "type": "track_complete",
    "timestamp": "2025-01-15T14:00:00Z",
    "canvasActions": [
      {
        "action": "reveal_archetype",
        "archetype": {
          "type": "innovator",
          "personalizedSummary": "Bạn là người tạo ra giải pháp mới cho những vấn đề phức tạp. Từ việc muốn xây dựng AI cho nông nghiệp, đến cách bạn tiếp cận thử thách học thuật bằng góc nhìn sáng tạo, và đam mê kết nối công nghệ với tác động xã hội - tất cả đều cho thấy một Innovator thực thụ."
        }
      }
    ]
  },
  "trackStatus": "completed",
  "currentTrackId": null,
  "allTracksComplete": true
}
```

---

#### POST `/api/v1/persona/track/back`

Go back to track selection without losing progress.

**Request Body:** None

**Response 200:**
```json
{
  "message": {
    "id": "msg_021",
    "role": "assistant",
    "content": "Không sao! Bạn có thể quay lại track này bất cứ lúc nào. Bạn muốn khám phá track nào?",
    "type": "track_selection",
    "timestamp": "2025-01-15T10:35:00Z",
    "actions": [
      { "trackId": "future_vision", "displayName": "Future Vision", "icon": "🎯", "status": "in_progress" },
      { "trackId": "academic_journey", "displayName": "Academic Journey", "icon": "📚", "status": "not_started" },
      { "trackId": "activities_impact", "displayName": "Activities & Impact", "icon": "🌟", "status": "not_started" },
      { "trackId": "values_turning_points", "displayName": "Values & Turning Points", "icon": "💎", "status": "not_started" }
    ]
  },
  "currentTrackId": null
}
```

---

#### POST `/api/v1/persona/track/{trackId}/redo`

Reset a completed track and start fresh. Removes nodes from that track.

**Response 200:**
```json
{
  "message": {
    "id": "msg_101",
    "role": "assistant",
    "content": "Đã reset Future Vision track. Hãy bắt đầu lại nhé!\n\n5-10 năm sau, một ngày làm việc điển hình của bạn như thế nào?",
    "type": "text",
    "timestamp": "2025-01-15T15:00:00Z",
    "canvasActions": [
      { "action": "remove", "nodeId": "node_001" },
      { "action": "remove", "nodeId": "node_002" },
      { "action": "remove", "nodeId": "node_010" }
    ]
  },
  "trackStatus": "in_progress",
  "currentTrackId": "future_vision",
  "archetypeReset": true
}
```

Note: If archetype was revealed, it becomes hidden again until all 4 tracks are complete.

---

### 4.4 Backend Data Model

```
┌─────────────────────────────────────────────────────────────────┐
│  user_personas                                                  │
├─────────────────────────────────────────────────────────────────┤
│  id: UUID (PK)                                                  │
│  user_id: BIGINT (FK → users.id, UNIQUE)                       │
│  archetype_type: VARCHAR (nullable, one of 8 types)            │
│  archetype_summary: TEXT (nullable, personalized)              │
│  current_track_id: VARCHAR (nullable)                          │
│  created_at: TIMESTAMP                                          │
│  updated_at: TIMESTAMP                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  persona_tracks  │ │  canvas_nodes    │ │persona_messages  │
├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│  id: UUID (PK)   │ │  id: UUID (PK)   │ │  id: UUID (PK)   │
│  persona_id: FK  │ │  persona_id: FK  │ │  persona_id: FK  │
│  track_id: ENUM  │ │  type: ENUM      │ │  role: ENUM      │
│  status: ENUM    │ │  title: VARCHAR  │ │  content: TEXT   │
│  core_q_index:INT│ │  content: TEXT   │ │  type: ENUM      │
│  followup_index  │ │  source_track_id │ │  actions: JSONB  │
│  completed_at    │ │  created_at      │ │  canvas_actions  │
│  created_at      │ └──────────────────┘ │  timestamp       │
└──────────────────┘                       └──────────────────┘
```

**Enums:**

```java
public enum TrackId {
    FUTURE_VISION("future_vision"),
    ACADEMIC_JOURNEY("academic_journey"),
    ACTIVITIES_IMPACT("activities_impact"),
    VALUES_TURNING_POINTS("values_turning_points");
}

public enum TrackStatus {
    NOT_STARTED, IN_PROGRESS, COMPLETED
}

public enum NodeType {
    STORY, EVIDENCE, INSIGHT, ARCHETYPE
}

public enum MessageRole {
    USER, ASSISTANT
}

public enum MessageType {
    TEXT, TRACK_SELECTION, TRACK_COMPLETE
}

public enum ArchetypeType {
    INNOVATOR, BRIDGE_BUILDER, SCHOLAR, ADVOCATE,
    PIONEER, CRAFTSMAN, RESILIENT, CATALYST
}
```

**Key Design Decisions:**

1. **Conversation stored as messages**: Unlike structured Q&A, we store the full conversation. This allows natural chat flow and makes context injection to LLM simple.

2. **Canvas nodes separate from conversation**: Nodes are extracted insights, not tied to specific messages. LLM decides when to create nodes.

3. **Track progress via indices**: `core_q_index` (0-3) and `followup_index` (0-2) track exactly where user is in the flow.

4. **Actions/canvasActions as JSONB**: Flexible storage for track cards and canvas mutations.

### 4.5 Question Configuration (Static)

Questions are hardcoded in the service layer, not stored in database.

```java
@Component
public class TrackQuestionConfig {
    
    public record CoreQuestion(
        int index,
        String question,
        String followUp1Template,  // Detail probe template
        String followUp2Template   // Emotion probe template
    ) {}
    
    private static final Map<TrackId, List<CoreQuestion>> QUESTIONS = Map.of(
        TrackId.FUTURE_VISION, List.of(
            new CoreQuestion(0,
                "5-10 năm sau, một ngày làm việc điển hình của bạn như thế nào? Hãy mô tả chi tiết: bạn làm gì, ở đâu, với ai?",
                "Cụ thể bạn hình dung mình đang làm vai trò gì? Ở công ty lớn, startup, hay tổ chức nào? Làm việc với những ai?",
                "Điều gì khiến bạn hướng đến tương lai này? Có kỷ niệm hay người nào ảnh hưởng đến định hướng này không?"
            ),
            new CoreQuestion(1,
                "Vấn đề nào bạn muốn góp phần giải quyết qua công việc của mình?",
                "Tại sao vấn đề này quan trọng với bạn? Bạn đã thấy hoặc trải nghiệm gì liên quan đến nó?",
                "Nếu giải quyết được vấn đề này, cuộc sống của ai sẽ thay đổi? Bạn cảm thấy thế nào khi nghĩ về điều đó?"
            ),
            new CoreQuestion(2,
                "Tại sao bạn chọn học thạc sĩ ở nước ngoài thay vì trong nước hoặc đi làm ngay?",
                "Bạn kỳ vọng chương trình thạc sĩ sẽ mang lại điều gì mà các lựa chọn khác không có?",
                "Quyết định này có ý nghĩa gì với bạn và gia đình? Có ai ủng hộ hoặc phản đối không?"
            ),
            new CoreQuestion(3,
                "Chương trình hoặc trường nào bạn đang hướng đến? Điều gì thu hút bạn về họ?",
                "Bạn đã tìm hiểu gì về chương trình đó? Có điểm nào khiến bạn đặc biệt excited không?",
                "Nếu được nhận vào chương trình mơ ước, khoảnh khắc đó sẽ như thế nào với bạn?"
            )
        ),
        
        TrackId.ACADEMIC_JOURNEY, List.of(
            new CoreQuestion(0,
                "Môn học hoặc dự án nào khiến bạn hứng thú nhất trong quá trình học? Tại sao?",
                "Bạn đã làm gì cụ thể trong môn/dự án đó? Kết quả ra sao?",
                "Cảm giác của bạn thế nào khi làm việc đó? Có moment nào khiến bạn thực sự excited không?"
            ),
            new CoreQuestion(1,
                "Thử thách học thuật lớn nhất bạn đã vượt qua là gì?",
                "Chuyện gì đã xảy ra cụ thể? Bạn đã làm gì để vượt qua?",
                "Trải nghiệm đó đã thay đổi bạn như thế nào? Bạn học được gì về bản thân?"
            ),
            new CoreQuestion(2,
                "Nếu được nghiên cứu bất kỳ chủ đề nào không giới hạn, đó sẽ là gì?",
                "Tại sao chủ đề này hấp dẫn bạn? Bạn sẽ tiếp cận nó như thế nào?",
                "Điều gì trong cuộc sống hoặc trải nghiệm của bạn đã dẫn đến sự quan tâm này?"
            ),
            new CoreQuestion(3,
                "Có giáo sư hoặc mentor nào ảnh hưởng lớn đến định hướng học thuật của bạn?",
                "Mối quan hệ của bạn với họ như thế nào? Họ đã dạy bạn điều gì?",
                "Nếu họ mô tả bạn cho một giáo sư khác, bạn nghĩ họ sẽ nói gì?"
            )
        ),
        
        TrackId.ACTIVITIES_IMPACT, List.of(
            new CoreQuestion(0,
                "Hoạt động nào bạn dành nhiều thời gian và tâm huyết nhất ngoài việc học?",
                "Vai trò của bạn trong hoạt động đó là gì? Bạn đã đóng góp như thế nào?",
                "Điều gì khiến bạn gắn bó với hoạt động này? Nó mang lại ý nghĩa gì cho bạn?"
            ),
            new CoreQuestion(1,
                "Bạn đã khởi xướng hoặc lãnh đạo điều gì? Kết quả ra sao?",
                "Quá trình từ ý tưởng đến thực hiện như thế nào? Bạn đã đối mặt với khó khăn gì?",
                "Bạn học được gì về bản thân qua trải nghiệm lãnh đạo này?"
            ),
            new CoreQuestion(2,
                "Kể về một lần bạn tạo ra thay đổi tích cực cho người khác hoặc cộng đồng.",
                "Cụ thể bạn đã làm gì? Ai được hưởng lợi và như thế nào?",
                "Khoảnh khắc nào khiến bạn nhận ra mình đã tạo ra impact? Cảm giác đó như thế nào?"
            ),
            new CoreQuestion(3,
                "Kỹ năng hoặc bài học quan trọng nhất bạn học được từ hoạt động ngoại khóa là gì?",
                "Bạn đã học được điều đó trong hoàn cảnh nào? Có thể cho ví dụ cụ thể?",
                "Bạn đã áp dụng kỹ năng/bài học đó vào các lĩnh vực khác trong cuộc sống như thế nào?"
            )
        ),
        
        TrackId.VALUES_TURNING_POINTS, List.of(
            new CoreQuestion(0,
                "3 giá trị quan trọng nhất với bạn là gì? Tại sao những giá trị đó?",
                "Làm thế nào những giá trị này thể hiện trong cuộc sống hàng ngày của bạn?",
                "Có lúc nào bạn phải đấu tranh để giữ vững giá trị của mình không? Chuyện gì đã xảy ra?"
            ),
            new CoreQuestion(1,
                "Trải nghiệm nào đã thay đổi cách bạn nhìn nhận cuộc sống hoặc bản thân?",
                "Chuyện gì đã xảy ra? Cuộc sống của bạn trước và sau khác nhau như thế nào?",
                "Nếu không có trải nghiệm đó, bạn nghĩ mình sẽ là người như thế nào hôm nay?"
            ),
            new CoreQuestion(2,
                "Ai ảnh hưởng lớn nhất đến con người bạn hôm nay? Họ dạy bạn điều gì?",
                "Mối quan hệ của bạn với người đó như thế nào? Kỷ niệm nào về họ bạn nhớ nhất?",
                "Bạn muốn tiếp nối hoặc làm khác đi điều gì từ những gì họ dạy bạn?"
            ),
            new CoreQuestion(3,
                "Điều gì khiến bạn khác biệt so với những người có background tương tự?",
                "Góc nhìn hoặc trải nghiệm độc đáo nào bạn có mà người khác có thể không?",
                "Sự khác biệt này đã giúp bạn hoặc thách thức bạn như thế nào trong cuộc sống?"
            )
        )
    );
    
    public List<CoreQuestion> getQuestions(TrackId trackId) {
        return QUESTIONS.get(trackId);
    }
    
    public CoreQuestion getCurrentQuestion(TrackId trackId, int coreQuestionIndex) {
        return QUESTIONS.get(trackId).get(coreQuestionIndex);
    }
}
```

### 4.6 LLM Integration (Spring AI)

**Spring AI Configuration:**

```java
@Configuration
public class SpringAIConfig {
    
    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder
            .defaultSystem("""
                You are a mentor helping Vietnamese students discover their personal narrative 
                for study abroad applications. You ask thoughtful follow-up questions, 
                extract meaningful insights, and help students articulate their stories.
                
                Always respond in Vietnamese unless the student writes in English.
                Be warm, encouraging, and genuinely curious about their experiences.
                """)
            .build();
    }
    
    @Bean
    public ChatMemory chatMemory() {
        return new InMemoryChatMemory(); // Or Redis-backed for production
    }
}
```

**LLM Tasks:**

| Task | Input | Output | When |
|------|-------|--------|------|
| Generate Follow-up | Core question + User answer + Template | Personalized follow-up question | After each user message |
| Extract Node | Conversation context + User's emotional answer | `CanvasNode` or null | After follow-up 2 (emotion probe) |
| Transition Message | Previous answer acknowledgment | Natural transition to next core Q | After extracting node |
| Determine Archetype | All nodes + conversation summaries | `ArchetypeType` + personalized summary | After 4th track complete |

**Node Extraction Prompt:**

```java
@Component
public class NodeExtractionService {
    
    private final ChatClient chatClient;
    
    public Optional<CanvasNode> extractNode(String conversationContext, TrackId trackId) {
        String prompt = """
            Based on this conversation excerpt, determine if there's a meaningful insight worth capturing.
            
            Conversation:
            %s
            
            If there IS a meaningful insight, respond with JSON:
            {
                "shouldCreate": true,
                "type": "story" | "evidence" | "insight",
                "title": "Short 3-5 word title",
                "content": "2-3 sentence summary of the insight"
            }
            
            Guidelines:
            - "story": A narrative that could be used in an essay (personal, emotional, transformative)
            - "evidence": A concrete achievement, fact, or data point
            - "insight": A realization or self-awareness moment
            
            If the response is too shallow or generic, respond with:
            { "shouldCreate": false }
            """.formatted(conversationContext);
        
        // Use Spring AI structured output
        return chatClient.prompt(prompt)
            .call()
            .entity(NodeExtractionResult.class)
            .filter(r -> r.shouldCreate())
            .map(r -> createNode(r, trackId));
    }
}
```

**Archetype Selection Prompt:**

```java
@Component  
public class ArchetypeService {
    
    private static final String ARCHETYPE_PROMPT = """
        Based on the user's complete discovery journey, select the most fitting archetype.
        
        Available archetypes:
        - INNOVATOR: Creates novel solutions, tech-forward, problem-solver
        - BRIDGE_BUILDER: Connects cultures/disciplines/people, translator
        - SCHOLAR: Intellectual curiosity, research-driven, depth-seeker
        - ADVOCATE: Purpose-driven, social impact, community-focused
        - PIONEER: Risk-taker, first-mover, ventures into unknown
        - CRAFTSMAN: Mastery-focused, deliberate practice, excellence
        - RESILIENT: Overcomes adversity, grit, transforms challenges
        - CATALYST: Change agent, transforms systems, influential
        
        User's stories and insights:
        %s
        
        Respond with JSON:
        {
            "archetype": "ARCHETYPE_TYPE",
            "personalizedSummary": "A 2-3 sentence summary explaining why this archetype fits THIS specific user, referencing their actual stories and insights. Write in Vietnamese."
        }
        
        Choose the archetype that best captures their CORE narrative pattern, not just surface traits.
        """;
}
```

### 4.7 Persona Storage Strategy (For Future Essay Ideation)

For the Application Dashboard essay ideation feature, we need the LLM to access the user's persona context. Options:

**Option A: Context Injection (Recommended for MVP)**
- Store nodes and archetype in PostgreSQL
- When essay feature calls LLM, inject persona summary into system prompt
- Simple, no new infrastructure

```java
public String buildEssayContext(Long userId) {
    PersonaState persona = personaRepository.findByUserId(userId);
    return """
        User's Archetype: %s - %s
        
        Key Stories:
        %s
        
        Key Insights:
        %s
        """.formatted(
            persona.getArchetypeType(),
            persona.getArchetypeSummary(),
            formatNodes(persona.getNodes(), NodeType.STORY),
            formatNodes(persona.getNodes(), NodeType.INSIGHT)
        );
}
```

**Option B: Vector Embedding (Future)**
- Embed each node as a vector
- Store in pgvector or dedicated vector DB
- RAG retrieval when writing essays
- Better for: "Find stories related to leadership" queries

**Option C: Knowledge Graph (Future)**
- Neo4j or similar
- Model relationships: Story → supports → EssayAngle
- Better for: Complex relationship queries

**Recommendation**: Start with Option A. Migrate to B when you have 50+ nodes per user and need semantic search.

---

## 5. Error Handling

### 5.1 Error Response Format

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description",
  "details": {}
}
```

### 5.2 Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `PERSONA_NOT_FOUND` | 404 | User has no persona (first visit, handle gracefully) |
| `TRACK_NOT_STARTED` | 400 | Attempting to send message without selecting track |
| `INVALID_TRACK_ID` | 400 | Track ID doesn't exist |
| `TRACK_ALREADY_IN_PROGRESS` | 400 | Cannot select track when another is in progress |
| `MESSAGE_TOO_SHORT` | 400 | Content below minimum (10 chars) |
| `LLM_ERROR` | 500 | AI processing failed |
| `LLM_TIMEOUT` | 504 | AI took too long to respond |
| `RATE_LIMITED` | 429 | Too many requests |

### 5.3 Graceful Degradation

**LLM Failure Handling:**
- If node extraction fails → Continue conversation without adding node
- If follow-up generation fails → Use template follow-up question
- If archetype selection fails → Retry once, then show generic message asking user to try again

**Network Issues:**
- Frontend should show retry button for failed messages
- Messages should be stored locally until confirmed sent

---

## 6. Open Questions / Future Considerations

1. **Conversation persistence**: How long to keep conversation history? Forever or rolling window?

2. **Track order**: Should we recommend a specific order (Future → Academic → Activities → Values)?

3. **Multilingual**: Users may mix Vietnamese and English. LLM should handle gracefully.

4. **Export**: Allow users to export their persona as PDF for personal records?

5. **Sharing**: Can users share their canvas view (for mentor review)?

6. **Analytics**: Track which questions get shallow answers most often → improve question design.

7. **Canvas layout persistence**: Should node positions be saved? (Currently using force-directed auto-layout)

---

## 7. Implementation Checklist

### Backend (Spring Boot + Spring AI)

**Setup:**
- [ ] Add Spring AI dependency and configure Claude/OpenAI client
- [ ] Set up ChatMemory (InMemory for dev, Redis for prod)
- [ ] Create database migrations for new schema

**Entities:**
- [ ] `UserPersona` entity with archetype fields
- [ ] `PersonaTrack` entity with progress tracking
- [ ] `CanvasNode` entity
- [ ] `PersonaMessage` entity with JSONB actions

**Enums & Config:**
- [ ] `TrackId`, `TrackStatus`, `NodeType`, `MessageRole`, `MessageType`, `ArchetypeType` enums
- [ ] `TrackQuestionConfig` with all questions and follow-up templates
- [ ] `ArchetypeDefinitions` constant (must match frontend)

**Services:**
- [ ] `PersonaService` - orchestrates conversation flow
- [ ] `ConversationService` - manages message history, context
- [ ] `NodeExtractionService` - LLM call to extract insights
- [ ] `ArchetypeService` - LLM call to determine archetype

**Controllers:**
- [ ] `GET /api/v1/persona` - fetch state
- [ ] `POST /api/v1/persona/track/select` - select track
- [ ] `POST /api/v1/persona/message` - send message
- [ ] `POST /api/v1/persona/track/back` - go back
- [ ] `POST /api/v1/persona/track/{trackId}/redo` - redo track

**Testing:**
- [ ] Unit tests for conversation state machine
- [ ] Integration tests for full track completion
- [ ] LLM prompt testing (node extraction, archetype)

### Frontend (React + Zustand)

**Setup:**
- [ ] Create `PersonaLab` route and page component
- [ ] Set up Zustand store with persistence
- [ ] Define TypeScript types matching API contract

**Components - Chat Sidebar:**
- [ ] `ChatSidebar` container
- [ ] `ChatHeader` with progress indicator
- [ ] `MessageList` with scroll management
- [ ] `ChatMessage` with conditional rendering for types
- [ ] `TrackActionCards` clickable track selection
- [ ] `BackToTracksButton`
- [ ] `MessageInput` with loading state

**Components - Canvas:**
- [ ] `PersonaCanvas` container
- [ ] `CanvasView` with force-directed layout (d3-force or react-force-graph)
- [ ] `CanvasNode` with type-based coloring
- [ ] `ArchetypeNode` with locked/revealed states
- [ ] `NodeDetailModal`
- [ ] `ZoomControls`
- [ ] `ListView` alternative view

**Shared:**
- [ ] `archetypes.ts` constant (must match backend)
- [ ] `types.ts` with all interfaces
- [ ] API client functions

**State & Effects:**
- [ ] `fetchPersonaState` on mount
- [ ] `selectTrack` API call
- [ ] `sendMessage` with optimistic update
- [ ] Process `canvasActions` from responses
- [ ] Animate new nodes appearing
- [ ] Handle archetype reveal animation

**Error & Loading:**
- [ ] Loading skeleton for initial fetch
- [ ] Message sending indicator
- [ ] Error toast for failed requests
- [ ] Retry mechanism for failed messages

**Remove:**
- [ ] All hardcoded demo data
- [ ] Mock API calls

---

## 8. Appendix: Archetype Definitions (Sync Required)

This exact structure must exist in both frontend and backend:

```typescript
// Frontend: src/shared/archetypes.ts
// Backend: ArchetypeDefinitions.java

export const ARCHETYPES = {
  innovator: {
    type: "innovator",
    title: "The Innovator",
    tagline: "Creating novel solutions to complex problems",
    description: "You see possibilities where others see obstacles. Your mind naturally gravitates toward improvement and invention, whether in technology, processes, or ideas.",
    essayStrengths: ["Problem-solving narratives", "Technical creativity", "Future-oriented vision"],
    color: "#10B981" // Emerald
  },
  bridge_builder: {
    type: "bridge_builder",
    title: "The Bridge Builder",
    tagline: "Connecting disparate worlds and people",
    description: "You thrive at intersections—between cultures, disciplines, or communities. Your strength lies in translation and synthesis, making connections others miss.",
    essayStrengths: ["Cross-cultural narratives", "Interdisciplinary thinking", "Collaboration stories"],
    color: "#3B82F6" // Blue
  },
  scholar: {
    type: "scholar",
    title: "The Scholar",
    tagline: "Driven by intellectual curiosity and depth",
    description: "Knowledge isn't just useful to you—it's exciting. You pursue understanding for its own sake and find joy in mastering complex subjects.",
    essayStrengths: ["Research motivation", "Intellectual journey", "Deep expertise"],
    color: "#8B5CF6" // Purple
  },
  advocate: {
    type: "advocate",
    title: "The Advocate",
    tagline: "Fighting for causes and communities",
    description: "You're driven by purpose beyond personal gain. Whether for social justice, environmental causes, or underserved communities, you channel your energy toward meaningful impact.",
    essayStrengths: ["Social impact narratives", "Community leadership", "Values-driven decisions"],
    color: "#EC4899" // Pink
  },
  pioneer: {
    type: "pioneer",
    title: "The Pioneer",
    tagline: "Venturing into uncharted territory",
    description: "You're drawn to firsts—first in your family, first to try something new, first to take a risk. Uncertainty doesn't deter you; it motivates you.",
    essayStrengths: ["First-generation narratives", "Risk-taking stories", "Trailblazing moments"],
    color: "#F59E0B" // Amber
  },
  craftsman: {
    type: "craftsman",
    title: "The Craftsman",
    tagline: "Mastering skills through deliberate practice",
    description: "You believe in excellence through dedication. Whether in art, engineering, or any discipline, you pursue mastery with patience and precision.",
    essayStrengths: ["Skill development journey", "Attention to detail", "Long-term commitment"],
    color: "#6366F1" // Indigo
  },
  resilient: {
    type: "resilient",
    title: "The Resilient",
    tagline: "Transforming challenges into growth",
    description: "Your story is defined not by what happened to you, but by how you responded. Setbacks become setups for comebacks in your narrative.",
    essayStrengths: ["Overcoming adversity", "Growth from failure", "Perseverance stories"],
    color: "#EF4444" // Red
  },
  catalyst: {
    type: "catalyst",
    title: "The Catalyst",
    tagline: "Sparking change in systems and people",
    description: "You don't just participate—you transform. Whether leading organizations, changing processes, or inspiring others, you leave things different than you found them.",
    essayStrengths: ["Leadership transformation", "Change management", "Influence stories"],
    color: "#14B8A6" // Teal
  }
} as const;
```

---

## 9. Appendix: Track Definitions (Sync Required)

```typescript
export const TRACKS = {
  future_vision: {
    id: "future_vision",
    displayName: "Future Vision",
    description: "Khám phá mục tiêu và động lực",
    icon: "🎯",
    order: 1
  },
  academic_journey: {
    id: "academic_journey",
    displayName: "Academic Journey",
    description: "Hành trình học thuật của bạn",
    icon: "📚",
    order: 2
  },
  activities_impact: {
    id: "activities_impact",
    displayName: "Activities & Impact",
    description: "Hoạt động và ảnh hưởng",
    icon: "🌟",
    order: 3
  },
  values_turning_points: {
    id: "values_turning_points",
    displayName: "Values & Turning Points",
    description: "Giá trị và bước ngoặt",
    icon: "💎",
    order: 4
  }
} as const;
```