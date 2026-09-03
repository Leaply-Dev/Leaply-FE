---
phase: 5
title: "Persona Labs"
status: pending
priority: P1
effort: "6h"
dependencies: [2, 3]
---

# Phase 5: Persona Labs

## Overview

Build a simplified **Persona Labs** page that asks a fixed set of questions from the backend, lets the user move back and forth, saves answers, and shows a summary after submission.

## Requirements
- Functional: Load questions from `GET /onboarding/persona/questions`; submit answers with `PUT /onboarding/persona`; every step reversible.
- Non-functional: Answers autosave (or save on step navigation); loading/error states handled; keyboard accessible.

## Architecture

Reuse the onboarding stepper UI (`StepContainer`, `StepNavigation`).

State:
- `answers: PersonaQuestionnaireRequest` — mirror the backend request schema exactly (named fields such as `career_intent`, `top_values`, etc.). Do **not** use a generic `Record<questionId, AnswerValue>`.
- `currentStep: number` — 0-based step index.

Data flow:
1. Mount → fetch `PersonaOptionsResponse` via `useAppsProfilingApiPersonaQuestions` (generated hook name; verify in Phase 2).
2. For each step, render the question defined by `PersonaOptionsResponse`. Supported types: `single`, `multi`, `text` (backend does not define `number`).
3. On **Continue**, validate the current step with Zod, then call `useAppsProfilingApiSavePersona` (PUT) with the full `answers` payload.
4. On **Back**, move back without validation; do not block the user.
5. On final step, submit and show a summary built from `PersonaSavedResponse`.

Autosave: debounce PUT after each answer change. Add a `beforeunload` listener to flush any pending save immediately. Track in-flight requests and abort/cancel stale responses to avoid race conditions.

Limitation: there is no `GET /onboarding/persona` endpoint to load previously saved answers, so returning users start from empty. Document this gap or add a backend endpoint before launch.

## Related Code Files

| Action | Path | Note |
|--------|------|------|
| Create | `components/persona-labs/PersonaLabsClient.tsx` | Stepper + state management |
| Create | `components/persona-labs/QuestionStep.tsx` | Renders one question |
| Create | `components/persona-labs/PersonaResult.tsx` | Summary after submit |
| Create | `lib/validations/persona.ts` | Zod schema per backend request field |
| Create | `lib/api/persona.ts` | Typed wrappers over generated persona hooks |
| Modify | `app/(app)/persona-labs/page.tsx` | **Owned by Phase 3** — add dynamic import of `PersonaLabsClient` here |
| Modify | `components/app/NavTabs.tsx` | Already links to `/persona-labs` from Phase 3 |
| Modify | `messages/vi.json`, `messages/en.json` | Persona Labs labels |

## Implementation Steps

1. Inspect `PersonaOptionsResponse` and `PersonaQuestionnaireRequest` in `lib/generated/api/models`. Map each question to the exact named field in `PersonaQuestionnaireRequest`.
2. Create `lib/api/persona.ts`:
   - `usePersonaQuestions()` → generated questions hook, returns typed options.
   - `useSavePersona()` → generated save mutation wrapper.
3. Create `lib/validations/persona.ts` that validates each named field, not a generic question map.
4. Create `components/persona-labs/QuestionStep.tsx`:
   - Accepts question metadata + current answer + onChange.
   - Supports `single`, `multi`, `text`. No `number` unless backend adds it.
5. Create `components/persona-labs/PersonaLabsClient.tsx`:
   - Holds `answers` as `PersonaQuestionnaireRequest` and `currentStep`.
   - Renders progress indicator (reuse onboarding pattern).
   - Validates only on **Continue/Final submit**.
   - Calls save mutation on step navigation and debounces on answer change.
   - Adds `beforeunload` handler to flush pending save.
   - Aborts stale in-flight saves to prevent race conditions.
   - On final step, submit and render `PersonaResult`.
6. Wire `PersonaLabsClient` into the existing `app/(app)/persona-labs/page.tsx` shell from Phase 3.
7. Add i18n keys under `personaLabs.*`.
8. Run `bun tsc` and `bun check`.

## File Inventory

| File | Action | Why |
|------|--------|-----|
| `app/(app)/persona-labs/page.tsx` | Modify | Add `PersonaLabsClient` dynamic import to the Phase 3 shell |
| `components/persona-labs/PersonaLabsClient.tsx` | Create | Main component |
| `components/persona-labs/QuestionStep.tsx` | Create | Question renderer |
| `components/persona-labs/PersonaResult.tsx` | Create | Result summary |
| `lib/validations/persona.ts` | Create | Validation |
| `lib/api/persona.ts` | Create | Typed hooks |

## Test Scenario Matrix

| Scenario | Steps | Expected |
|----------|-------|----------|
| Load questions | Open `/persona-labs` | Fetches `GET /onboarding/persona/questions` |
| Step forward | Answer Q1, click Continue | Advances to Q2; calls PUT with full answers |
| Step backward | Click Back | Returns to Q1 with previous answer intact; no validation blocking |
| Autosave | Change answer, wait 500ms | PUT called with full payload |
| Flush on close | Change answer and close tab | `beforeunload` triggers pending PUT before unload |
| Submit final | Answer last Q, click Continue | Calls PUT, shows `PersonaResult` |
| Error state | Backend returns 422 | Shows inline error, stays on step |

## Success Criteria

- [ ] `/persona-labs` loads questions from backend.
- [ ] User can move forward and backward through steps.
- [ ] Answers are saved via `PUT /onboarding/persona`.
- [ ] Final submission shows a result summary.
- [ ] `bun check` and `bun tsc` pass.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| PUT payload shape mismatch | High | Map answers to `PersonaQuestionnaireRequest` fields exactly; never send a generic record |
| Question metadata shape unknown | Medium | Read generated model first; build renderer defensively |
| Autosave race / data loss on close | Medium | Debounce 500ms, flush on `beforeunload`, abort stale requests |
| Returning user sees empty form | Medium | Document backend gap (no GET saved answers) or add endpoint |
| Autosave spam | Low | Disable Continue while saving |

## Security Considerations

- Persona answers may contain PII; sent over HTTPS with session cookie.
- No client-side storage of raw answers beyond React state; rely on backend persistence.
- Because there is no GET saved-answers endpoint, a refresh before autosave flushes will lose progress — make the flush-on-close behavior explicit in UX.
