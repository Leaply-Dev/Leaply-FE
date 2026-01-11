# Persona Lab Backend Changes - Frontend Integration Guide

## Overview

The Persona Lab has been redesigned from a **track-based linear flow** to a **graph-oriented dynamic conversation**. This document summarizes backend changes and provides guidance for frontend integration.

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Progress tracking** | Coverage-based (LLM-evaluated) | More flexible than fixed tracks, adapts to user responses |
| **Conversation start** | `GET /conversation` triggers opening question | Simple entry point, no track selection needed |
| **STAR structure** | Hybrid - create partial node, AI asks to fill gaps | Better UX than waiting for complete stories |
| **Response shape** | All-in-one `GraphMessageResponse` | Single response contains everything FE needs |
| **Voice extraction** | Sync in message flow | Captured automatically, no separate step |
| **Completion threshold** | 60% all categories OR 15+ nodes | Flexible completion criteria |

---

## New API Endpoints

### Graph-Based Conversation (NEW - Primary Flow)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/persona/conversation` | Start/continue conversation. Returns opening question based on coverage gaps |
| `POST` | `/v1/persona/conversation/message` | Send message. Returns `GraphMessageResponse` with nodes, edges, coverage |
| `POST` | `/v1/persona/conversation/reset` | Reset all data and start fresh |
| `POST` | `/v1/persona/node/{nodeId}/expand` | Request more detail on a specific node |
| `GET` | `/v1/persona/coverage` | Get current coverage metrics |
| `GET` | `/v1/persona/voice-profile` | Get voice profile for essay generation |

### Existing Endpoints (Still Available)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/persona` | Full persona state |
| `GET` | `/v1/persona/graph` | Full graph with nodes and edges |
| `GET` | `/v1/persona/profile` | Profile summary (layer 0 node) |

### Deprecated Endpoints (Still Functional)

These track-based endpoints still work but are deprecated:
- `POST /v1/persona/track/select`
- `POST /v1/persona/message`
- `POST /v1/persona/track/back`
- `POST /v1/persona/track/{trackId}/redo`

---

## Response Shapes

### GraphMessageResponse (Primary Response)

```json
{
  "message": {
    "id": "uuid",
    "role": "assistant",
    "content": "AI response in Vietnamese",
    "type": "text",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "nodesCreated": [
    {
      "id": "uuid",
      "type": "key_story",
      "layer": 2,
      "title": "Node title",
      "content": "Node content",
      "structuredContent": {
        "situation": "...",
        "task": "...",
        "action": "...",
        "result": "...",
        "emotion": "...",
        "insight": "..."
      },
      "tags": ["leadership", "growth"],
      "bestFor": ["leadership", "failure"],
      "wordCountPotential": "150-200",
      "essayAngle": "Essay usage suggestion"
    }
  ],
  "edgesCreated": [
    {
      "id": "uuid",
      "sourceNodeId": "uuid",
      "targetNodeId": "uuid",
      "edgeType": "connection",
      "label": "enables",
      "strength": 0.7
    }
  ],
  "coverage": {
    "goals": 45,
    "evidence": 30,
    "skills": 25,
    "values": 20,
    "tensions": 10
  },
  "voiceSample": "Notable phrase extracted or null",
  "completionReady": false,
  "starGapsForLastStory": ["action", "result"],
  "totalNodeCount": 8
}
```

### CoverageMetrics

```json
{
  "goals": 45,      // Career vision, motivation (0-100)
  "evidence": 30,   // Achievements, projects (0-100)
  "skills": 25,     // Leadership, abilities (0-100)
  "values": 20,     // Core beliefs (0-100)
  "tensions": 10    // Contradictions, growth (0-100)
}
```

### VoiceProfileDto

```json
{
  "personaId": "uuid",
  "sentenceStyle": "short_punchy",
  "toneMarkers": {
    "formality": "casual",
    "confidence": "high",
    "emotionLevel": "moderate"
  },
  "vocabularyPatterns": ["specific phrase 1", "phrase 2"],
  "sampleExcerpts": ["Notable quote 1", "Quote 2"],
  "sampleCount": 5
}
```

---

## Node Types & Layers

| Layer | Type | Description |
|-------|------|-------------|
| 0 | `profile_summary` | Overall profile with archetype (auto-generated) |
| 1 | `essay_angle` | Patterns/themes (created after 5+ stories) |
| 2 | `key_story` | Complete narratives with STAR structure |
| 3 | `detail` | Specific achievements, numbers, evidence |

---

## Edge Types

| Type | Labels | Description |
|------|--------|-------------|
| `connection` | enables, builds_on, supports, complements | Nodes that support each other |
| `tension` | contradicts, evolved_from, challenged_by, transformed | Contradictions (valuable for essays!) |

---

## STAR Structure

Stories are captured with STAR+ structure:
- **S**ituation - Context, circumstances
- **T**ask - Challenge to solve
- **A**ction - Specific steps taken
- **R**esult - Outcomes, impact
- **E**motion (optional) - Feelings during the experience
- **I**nsight (optional) - Lessons learned

`starGapsForLastStory` in response indicates missing elements the AI will probe for.

---

## Frontend Integration Plan

### Phase 1: Replace Track Selection with Graph Flow

**Before:**
1. User selects a track
2. Fixed questions in sequence
3. Track completion unlocks next track

**After:**
1. Call `GET /conversation` on page load
2. Display AI's opening question
3. User responds via `POST /conversation/message`
4. Display response + any new nodes on canvas
5. Repeat until `completionReady: true`

### Phase 2: Update Canvas Visualization

**New data available:**
- `nodesCreated` - Add to canvas in real-time
- `edgesCreated` - Draw connections between nodes
- `edgeType` - Visual distinction for tension vs connection edges
- `structuredContent` - Show STAR breakdown on node detail view
- `bestFor` - Tag nodes with essay type badges

**Canvas enhancements:**
- Group nodes by layer (0-3)
- Highlight incomplete STAR nodes (use `starGapsForLastStory`)
- Show tension edges differently (dashed? red?)
- Display coverage progress bar

### Phase 3: Coverage Progress UI

**Replace track progress with coverage:**
- 5-segment progress indicator (goals, evidence, skills, values, tensions)
- Each segment fills 0-100%
- Show "Ready to generate essays" when `completionReady: true`

### Phase 4: Node Expansion

**When user clicks a node with incomplete STAR:**
1. Call `POST /node/{nodeId}/expand`
2. AI generates targeted follow-up question
3. User's response fills in missing STAR elements

### Phase 5: Voice Profile Display

**For essay generation prep:**
- Call `GET /voice-profile`
- Display writing style characteristics
- Show sample excerpts that capture user's voice

---

## Migration Notes

- **No data migration needed** - Existing data will be deleted (pre-beta decision)
- Track-based endpoints remain functional for gradual migration
- New users should use graph-based flow only

---

## Testing Checklist

- [ ] `GET /conversation` returns opening question
- [ ] `POST /conversation/message` returns nodes/edges/coverage
- [ ] Canvas displays new nodes in real-time
- [ ] Coverage metrics update after each message
- [ ] `completionReady` triggers completion UI when threshold met
- [ ] `POST /conversation/reset` clears all data
- [ ] `POST /node/{id}/expand` generates targeted questions
- [ ] Tension edges visually distinct from connection edges
- [ ] STAR gaps highlighted on incomplete story nodes
