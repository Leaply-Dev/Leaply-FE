# Persona Lab Enhancement Brief

## Context
Persona Lab guides users through 4 discovery tracks (Future Vision, Academic Journey, Activities & Impact, Values & Turning Points). Each track has 4 core questions with 2 follow-ups each (12 interactions per track). After completing all tracks, user receives their archetype.

---

## Problems to Solve

### 1. Progress feels invisible
User answers 11 questions, still sees "0/4 tracks completed". No sense of advancement until entire track is done.

### 2. Canvas is disconnected from conversation
User types answers but canvas stays static. No visual acknowledgment that their input matters until a full question cycle completes.

### 3. Archetype reveal comes too late
Must complete all 4 tracks (48+ interactions) before seeing ANY personality insight. No progressive discovery.

---

## Decisions Made

| Decision | Choice |
|----------|--------|
| Keyword extraction | New dedicated endpoint `POST /v1/persona/extract-keywords` |
| Archetype hint timing | After every ~6 questions answered across any track |
| Archetype probability | Real LLM analysis (accurate, personalized) |
| Keyword persistence | Accumulate as dots/tags around track node (builds word cloud) |
| Implementation order | Progressive: 1) Progress → 2) Archetype hints → 3) Canvas keywords |
| Mobile canvas | Separate tab/view (user switches between Chat and Canvas) |

---

## Phase 1: Percentage-Based Progress

**Frontend only - no backend changes needed**

### Current State
"0/4 tracks completed" - binary, no granularity

### New State
- Overall progress: percentage (0-100%)
- Current track: question count
- Example: "35% Complete | Future Vision: 3/4 questions"

### Calculation
```typescript
// Per track (each track has 4 core questions × 3 interactions = 12 total)
const trackProgress = ((coreQuestionIndex * 3) + followupIndex) / 12 * 100

// Overall (average of all 4 tracks)
const overallProgress = tracks.reduce((sum, t) => sum + getTrackProgress(t), 0) / 4
```

### UI Changes
- ChatHeader: Replace "X/4" with percentage bar + current track indicator
- Summary nodes: Show "3/4" question count prominently
- Smooth animation on progress updates

---

## Phase 2: Progressive Archetype Hints

**Requires backend changes**

### Trigger
After every ~6 questions answered (across any tracks, not per-track)

### Display States

| Total Questions | Confidence | Archetype Node Shows |
|-----------------|------------|---------------------|
| 0-5 | None | Locked: "Answer more questions to see patterns" |
| 6-11 | Early Signal | Top 3 archetypes: ~38% / 33% / 29% |
| 12-17 | Emerging Pattern | More differentiated: ~45% / 32% / 23% |
| 18-23 | Strong Signal | Clear leader: ~55% / 28% / 17% |
| 24+ | Final | Full archetype reveal with description |

### Visual Elements
- Horizontal probability bars for top 3 archetypes
- Confidence badge: "Early Signal" / "Emerging Pattern" / "Strong Signal"
- Evidence snippet per archetype:
  ```
  The Innovator - 45%
    ↳ "Your approach to solving the water access problem"
  ```
- Subtext: "Continue to sharpen the pattern"

### Animation
- Smooth bar width transitions (300ms easing)
- When probabilities shift significantly, add micro-copy explaining why

### Backend Response
Add to `MessageResponse`:
```typescript
archetypeHints?: {
  totalQuestionsAnswered: number
  confidence: "none" | "early" | "emerging" | "strong" | "final"
  candidates: Array<{
    type: ArchetypeType
    probability: number      // 0-100
    evidence?: string        // One-line quote from user's answers
  }>
}
```

---

## Phase 3: Instant Canvas Feedback

**Requires new backend endpoint**

### Two-Tier Response

**Tier 1 - Immediate (frontend only):**
- Current track's summary node pulses/glows
- Shows processing state

**Tier 2 - Fast (~500ms):**
- Call `POST /v1/persona/extract-keywords`
- Display 1-2 keywords as floating bubbles

### Keyword Behavior
- Bubbles appear near the track's summary node
- **Accumulate over time** - build visible "word cloud"
- Keywords stay visible, don't fade
- Manage density: limit to ~10 keywords per track, oldest fade when limit reached

### Backend Endpoint
```typescript
// POST /v1/persona/extract-keywords
interface KeywordRequest {
  content: string
  trackId: string
}

interface KeywordResponse {
  keywords: string[]  // 1-2 keywords, extracted with fast model
}
```

### Visual Placement
- Keywords float in arc around summary node
- Slight random offset for organic feel
- Click keyword → highlight related nodes (future enhancement)

---

## Phase 4: Mobile Tab View

### Approach
Separate tab/view - user explicitly switches between Chat and Canvas

### Implementation
- Bottom navigation or top toggle: **Chat** | **Canvas**
- Chat view: Full conversation UI, progress in header
- Canvas view: Full-screen canvas with nodes, keywords, archetype

### State Sync
- Both views read from same store
- Updates in chat reflect immediately if user switches to canvas
- Archetype hints visible in both (inline card in chat, node in canvas)

### Touch Optimization
- Larger tap targets on canvas nodes
- Pinch-to-zoom with reasonable limits
- Double-tap to center on archetype

---

## Implementation Phases Summary

| Phase | Scope | Effort |
|-------|-------|--------|
| **Phase 1** | Percentage progress | FE only, ~2-3 days |
| **Phase 2** | Archetype hints | FE + BE, ~1 week |
| **Phase 3** | Canvas keywords | FE + BE, ~1 week |
| **Phase 4** | Mobile tabs | FE only, ~3-4 days |

---

## Files to Modify

### Frontend
- `components/persona-lab/ChatHeader.tsx` - Progress display
- `components/persona-lab/ChatSidebar.tsx` - Message handling, keyword calls
- `components/persona-lab/canvas/ArchetypeNode.tsx` - Probability display
- `components/persona-lab/canvas/SummaryNode.tsx` - Question count, keywords
- `components/persona-lab/canvas/KeywordBubble.tsx` - New component
- `lib/store/personaStore.ts` - Add keywords state, archetype hints
- `lib/api/personaApi.ts` - New endpoint call
- `app/(app)/persona-lab/page.tsx` - Mobile tab structure

### Backend
- `PersonaController.java` - New `/extract-keywords` endpoint
- `PersonaConversationService.java` - Calculate and return archetype hints
- `ArchetypeService.java` - Partial analysis method
- `NodeExtractionService.java` - Lightweight keyword extraction
- DTOs for new response fields

---

## Open Items

1. **Keyword extraction model**: Which fast model to use? (GPT-4o-mini, Claude Haiku, etc.)
2. **Question count threshold**: Exactly 6 questions, or make it configurable?
3. **Archetype evidence**: Pull from raw answers or from extracted nodes?
4. **Keyword limit per track**: 10? 15? What's visually clean?
