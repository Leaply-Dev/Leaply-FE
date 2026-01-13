# Persona Lab API Reference

> API documentation for Leaply Persona Lab - Frontend Integration Guide

**Base URL:** `/api/v1/persona`
**Authentication:** Bearer token required (all endpoints)
**Response Format:** All responses wrapped in `ApiResponse<T>`

---

## Table of Contents

1. [Core Endpoints](#core-endpoints)
2. [Daily Questions Endpoints](#daily-questions-endpoints)
3. [Deprecated Endpoints](#deprecated-endpoints)
4. [Data Types](#data-types)
5. [Enumerations](#enumerations)
6. [Integration Guide](#integration-guide)

---

## Core Endpoints

### 1. Get Full Persona State

Fetch complete persona state on page load.

```
GET /api/v1/persona
```

**Response:** `PersonaStateResponse`

```json
{
  "userId": "uuid",
  "tracks": {
    "future_vision": {
      "displayName": "string",
      "description": "string",
      "icon": "string",
      "status": "NOT_STARTED | IN_PROGRESS | COMPLETED"
    },
    "academic_journey": { /* TrackDto */ },
    "activities_impact": { /* TrackDto */ },
    "values_turning_points": { /* TrackDto */ }
  },
  "nodes": [ /* CanvasNodeDto[] */ ],
  "archetype": {
    "type": "INNOVATOR | BRIDGE_BUILDER | ...",
    "personalizedSummary": "string",
    "revealedAt": "ISO-8601"
  },
  "conversationHistory": [ /* ChatMessageDto[] */ ],
  "currentTrackId": "string | null",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

---

### 2. Start/Continue Graph Conversation

Start or continue graph-based persona conversation without track selection.

```
GET /api/v1/persona/conversation
```

**Response:** `GraphMessageResponse`

Returns opening question based on coverage gaps.

---

### 3. Send Message (Graph Flow)

Send message in graph-based conversation.

```
POST /api/v1/persona/conversation/message
```

**Request:** `MessageRequest`

```json
{
  "content": "string"  // 10-5000 characters
}
```

**Response:** `GraphMessageResponse`

```json
{
  "message": {
    "id": "uuid",
    "role": "USER | ASSISTANT",
    "content": "string",
    "type": "TEXT | TRACK_SELECTION | TRACK_COMPLETE",
    "timestamp": "ISO-8601",
    "actions": [ /* TrackActionDto[] for selection/complete */ ],
    "canvasActions": [ /* CanvasActionDto[] */ ]
  },
  "nodesCreated": [
    {
      "id": "uuid",
      "type": "PROFILE_SUMMARY | ESSAY_ANGLE | KEY_STORY | DETAIL",
      "layer": 0-3,
      "title": "string (3-7 words, Vietnamese)",
      "content": "string (2-3 sentences, Vietnamese)",
      "tags": ["string"],
      "structuredContent": {
        "situation": "string",
        "task": "string",
        "action": "string",
        "result": "string",
        "emotion": "string",
        "insight": "string"
      },
      "essayAngle": "string",
      "bestFor": ["string"],
      "wordCountPotential": "150-200",
      "confidence": 0.0-1.0
    }
  ],
  "edgesCreated": [
    {
      "id": "uuid",
      "sourceNodeId": "uuid",
      "targetNodeId": "uuid",
      "strength": 0.0-1.0,
      "edgeType": "connection | tension",
      "label": "string"
    }
  ],
  "coverage": {
    "goals": 0-100,
    "evidence": 0-100,
    "skills": 0-100,
    "values": 0-100,
    "tensions": 0-100
  },
  "voiceSample": "string | null",
  "completionReady": false,
  "starGapsForLastStory": ["string"],
  "totalNodeCount": 0
}
```

---

### 4. Reset Conversation

Reset graph conversation and start fresh (deletes all nodes/edges/voice).

```
POST /api/v1/persona/conversation/reset
```

**Response:** `GraphMessageResponse` with opening question

---

### 5. Expand Node Details

Request more detail on a specific node.

```
POST /api/v1/persona/node/{nodeId}/expand
```

**Path Parameters:**
- `nodeId` (UUID): The node to expand

**Response:** `GraphMessageResponse` with targeted expansion questions

---

### 6. Get Coverage Metrics

Get current coverage metrics (0-100 for each category).

```
GET /api/v1/persona/coverage
```

**Response:** `CoverageMetrics`

```json
{
  "goals": 0-100,
  "evidence": 0-100,
  "skills": 0-100,
  "values": 0-100,
  "tensions": 0-100
}
```

---

### 7. Get Persona Graph

Returns full persona graph with nodes, edges, and metadata for visualization.

```
GET /api/v1/persona/graph
```

**Response:** `PersonaGraphResponse`

```json
{
  "nodes": [ /* PersonaNodeDto[] */ ],
  "edges": [ /* PersonaEdgeDto[] */ ],
  "meta": {
    "nodeCountByLayer": {
      "0": 1,
      "1": 3,
      "2": 8,
      "3": 15
    },
    "topTags": ["leadership", "innovation", "community"],
    "hasProfileSummary": true,
    "totalNodes": 27,
    "totalEdges": 42
  }
}
```

---

### 8. Get Compact Context

Returns compact persona context (~500 tokens) for LLM prompts.

```
GET /api/v1/persona/context/compact
```

**Response:** `String` (compact context)

---

### 9. Synthesize Profile Summary

Trigger profile summary synthesis (layer 0 node).

```
POST /api/v1/persona/profile/synthesize
```

**Requirements:** 2+ completed tracks OR 10+ story nodes

**Response:** `PersonaNodeDto` (profile summary node)

---

### 10. Get Profile Summary

Returns profile summary node (layer 0) with archetype info.

```
GET /api/v1/persona/profile
```

**Response:** `PersonaNodeDto | null`

---

### 11. Get Voice Profile

Get user's voice profile extracted from conversation for essay generation.

```
GET /api/v1/persona/voice-profile
```

**Response:** `VoiceProfileDto`

```json
{
  "sentenceStyle": "short_punchy | flowing | analytical | mixed",
  "toneMarkers": {
    "formality": "casual | balanced | formal",
    "confidence": "humble | balanced | confident",
    "emotion_level": "reserved | balanced | expressive"
  },
  "vocabularyPatterns": ["string"],
  "sampleExcerpts": ["string"]  // 3-5 verbatim quotes
}
```

---

### 12. Get Canvas Data

Returns all nodes grouped by type and archetype if revealed.

```
GET /api/v1/persona/canvas
```

**Response:** `Map<String, Object>` (nodes grouped by type)

---

### 13. Synthesize Track

Generate synthesis layers from a completed track's conversation.

```
POST /api/v1/persona/track/{trackId}/synthesize
```

**Path Parameters:**
- `trackId`: `future_vision | academic_journey | activities_impact | values_turning_points`

**Response:** `SynthesisResponse`

```json
{
  "track": "string",
  "layers": { /* structured layers */ },
  "success": true,
  "message": "string",
  "nodeCount": 5
}
```

---

### 14. Generate Archetype

Determine and reveal archetype based on completed tracks.

```
POST /api/v1/persona/archetype/generate
```

**Requirements:** 2+ completed tracks

**Response:** `ArchetypeResponse`

```json
{
  "archetype": {
    "type": "INNOVATOR",
    "name": "string",
    "description": "string"
  },
  "success": true,
  "message": "string",
  "completedTracks": 2,
  "isComplete": true
}
```

---

### 15. Extract Keywords

Extract 1-2 keywords from user's answer for instant canvas feedback.

```
POST /api/v1/persona/extract-keywords
```

**Request:** `KeywordRequest`

```json
{
  "content": "string",  // 5-5000 characters
  "trackId": "string"
}
```

**Response:** `KeywordResponse`

```json
{
  "keywords": ["leadership", "innovation"],
  "trackId": "future_vision"
}
```

---

## Daily Questions Endpoints

### 16. Generate Daily Questions

Generate or retrieve today's daily questions.

```
POST /api/v1/persona/daily-questions
```

**Response:** `List<DailyQuestionDto>` (up to 3 questions)

```json
[
  {
    "id": "uuid",
    "type": "DEPTH | GAP_FILL | ELABORATE",
    "questionText": "string",
    "targetNodeId": "uuid | null",
    "targetTag": "string | null",
    "createdAt": "ISO-8601",
    "answeredAt": "ISO-8601 | null"
  }
]
```

---

### 17. Get Today's Questions

Retrieve today's questions without generating new ones.

```
GET /api/v1/persona/daily-questions
```

**Response:** `List<DailyQuestionDto>`

---

### 18. Get Unanswered Questions

Retrieve all pending/unanswered daily questions.

```
GET /api/v1/persona/daily-questions/unanswered
```

**Response:** `List<DailyQuestionDto>`

---

### 19. Answer Daily Question

Submit an answer to a daily question.

```
POST /api/v1/persona/daily-questions/{questionId}/answer
```

**Path Parameters:**
- `questionId` (UUID)

**Request:** `DailyQuestionAnswerRequest`

```json
{
  "content": "string"  // 10-5000 characters
}
```

**Response:** `MessageResponse` (processed answer with extracted nodes)

---

### 20. Get Question by ID

Retrieve details of a specific daily question.

```
GET /api/v1/persona/daily-questions/{questionId}
```

**Response:** `DailyQuestionDto | null`

---

## Deprecated Endpoints

> ⚠️ These endpoints are deprecated and should not be used in new implementations.

| Endpoint | Status | Use Instead |
|----------|--------|-------------|
| `POST /api/v1/persona/track/select` | Deprecated | `GET /conversation` |
| `POST /api/v1/persona/message` | Deprecated | `POST /conversation/message` |
| `POST /api/v1/persona/track/back` | Deprecated | `POST /conversation/reset` |
| `POST /api/v1/persona/track/{trackId}/redo` | Deprecated | `POST /conversation/reset` |

---

## Data Types

### ChatMessageDto

```typescript
interface ChatMessageDto {
  id: string;           // UUID
  role: "USER" | "ASSISTANT";
  content: string;
  type: "TEXT" | "TRACK_SELECTION" | "TRACK_COMPLETE";
  timestamp: string;    // ISO-8601
  actions?: TrackActionDto[];
  canvasActions?: CanvasActionDto[];
}
```

### PersonaNodeDto

```typescript
interface PersonaNodeDto {
  id: string;           // UUID
  type: PersonaNodeType;
  layer: number;        // 0-3
  title: string;        // 3-7 words, Vietnamese
  content: string;      // 2-3 sentences, Vietnamese
  tags: string[];       // max 5, lowercase English
  structuredContent?: {
    situation?: string;
    task?: string;
    action?: string;
    result?: string;
    emotion?: string;
    insight?: string;
  };
  essayAngle?: string;  // thesis statement
  bestFor?: string[];   // essay types
  wordCountPotential?: string;
  primaryArchetype?: ArchetypeType;    // layer 0 only
  secondaryArchetype?: ArchetypeType;  // layer 0 only
  archetypeSummary?: string;           // layer 0 only
  sourceTrackId?: string;
  confidence: number;   // 0.0-1.0
  createdAt: string;
  updatedAt: string;
}
```

### PersonaEdgeDto

```typescript
interface PersonaEdgeDto {
  id: string;           // UUID
  sourceNodeId: string;
  targetNodeId: string;
  strength: number;     // 0.0-1.0
  edgeType: "connection" | "tension";
  label: string;        // relationship description
}
```

### TrackDto

```typescript
interface TrackDto {
  displayName: string;
  description: string;
  icon: string;
  status: TrackStatus;
}
```

### CoverageMetrics

```typescript
interface CoverageMetrics {
  goals: number;      // 0-100
  evidence: number;   // 0-100
  skills: number;     // 0-100
  values: number;     // 0-100
  tensions: number;   // 0-100
}
```

### VoiceProfileDto

```typescript
interface VoiceProfileDto {
  sentenceStyle: "short_punchy" | "flowing" | "analytical" | "mixed";
  toneMarkers: {
    formality: string;
    confidence: string;
    emotion_level: string;
  };
  vocabularyPatterns: string[];
  sampleExcerpts: string[];  // 3-5 verbatim quotes
}
```

### DailyQuestionDto

```typescript
interface DailyQuestionDto {
  id: string;           // UUID
  type: QuestionType;
  questionText: string;
  targetNodeId?: string;
  targetTag?: string;
  createdAt: string;
  answeredAt?: string;
}
```

### TrackActionDto

```typescript
interface TrackActionDto {
  trackId: string;
  displayName: string;
  description: string;
  icon: string;
  status: TrackStatus;
}
```

### CanvasActionDto

```typescript
interface CanvasActionDto {
  action: "add" | "remove";
  nodeType: string;
  content: string;
}
```

---

## Enumerations

### TrackId

| Value | Description |
|-------|-------------|
| `future_vision` | Khám phá mục tiêu và động lực |
| `academic_journey` | Hành trình học thuật |
| `activities_impact` | Hoạt động và ảnh hưởng |
| `values_turning_points` | Giá trị và bước ngoặt |

### PersonaNodeType

| Value | Layer | Description |
|-------|-------|-------------|
| `PROFILE_SUMMARY` | 0 | Central identity and archetype summary |
| `ESSAY_ANGLE` | 1 | Narrative themes for applications |
| `KEY_STORY` | 2 | Concrete experiences with STAR structure |
| `DETAIL` | 3 | Supporting evidence, emotions, facts |

### ArchetypeType

| Value | Description |
|-------|-------------|
| `INNOVATOR` | Creating novel solutions |
| `BRIDGE_BUILDER` | Connecting worlds and people |
| `SCHOLAR` | Driven by intellectual curiosity |
| `ADVOCATE` | Fighting for causes and communities |
| `PIONEER` | Venturing into uncharted territory |
| `CRAFTSMAN` | Mastering skills through deliberate practice |
| `RESILIENT` | Transforming challenges into growth |
| `CATALYST` | Sparking change in systems and people |

### TrackStatus

| Value | Description |
|-------|-------------|
| `NOT_STARTED` | Track not yet started |
| `IN_PROGRESS` | Track currently in progress |
| `COMPLETED` | Track completed |

### MessageRole

| Value |
|-------|
| `USER` |
| `ASSISTANT` |

### MessageType

| Value | Description |
|-------|-------------|
| `TEXT` | Regular text message |
| `TRACK_SELECTION` | Message with track selection actions |
| `TRACK_COMPLETE` | Message indicating track completion |

### QuestionType

| Value | Description |
|-------|-------------|
| `DEPTH` | Ask for more details (target: stories with < 3 detail nodes) |
| `GAP_FILL` | Ask about missing experience areas (target: missing tags) |
| `ELABORATE` | Expand on high-confidence stories |

---

## Integration Guide

### Coverage-Based Conversation Flow

The new graph-based flow uses coverage metrics to guide questions:

1. **Start Conversation:** `GET /conversation`
2. **Send Messages:** `POST /conversation/message`
3. **Check Coverage:** Use `coverage` field in response
4. **Completion Ready:** When `completionReady: true`, user can synthesize

**Completion Threshold:**
- All coverage dimensions ≥ 60%, OR
- Total node count ≥ 15

### Node Hierarchy

```
Layer 0: Profile Summary (1 node)
    └── Layer 1: Essay Angles (3-5 nodes)
            └── Layer 2: Key Stories (8-12 nodes)
                    └── Layer 3: Details (15-25 nodes)
```

### STAR+ Structure

Story nodes use the STAR+ framework:
- **S**ituation: Context and setting
- **T**ask: Challenge or goal
- **A**ction: What you did
- **R**esult: Outcome achieved
- **E**motion: How you felt
- **I**nsight: What you learned

### Typical Integration Flow

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

6. Daily Engagement
   ├── POST /api/v1/persona/daily-questions
   └── POST /api/v1/persona/daily-questions/{id}/answer
```

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "data": null
}
```

Common error codes:
- `401` - Unauthorized (invalid/missing token)
- `404` - Resource not found
- `400` - Validation error (see message for details)
- `500` - Internal server error

---

*Last updated: 2026-01-13*
