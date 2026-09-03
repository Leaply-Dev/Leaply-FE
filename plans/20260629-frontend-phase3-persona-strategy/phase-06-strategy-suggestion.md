---
phase: 6
title: "Strategy Suggestion"
status: pending
priority: P1
effort: "4h"
dependencies: [2, 3, 4]
---

# Phase 6: Strategy Suggestion

## Overview

Add the **Chiến lược** tab that displays the full strategy returned by `GET /explore/strategy`: matched program options, embedded scholarships, and the action plan.

## Requirements
- Functional: Fetch strategy; show 1–3 options; show scholarships and action plan; allow comparing options with catalog compare store.
- Non-functional: Empty state prompts user to complete Persona Labs if strategy is unavailable.

## Architecture

`StrategyClient` uses the generated strategy hook (record the exact name in Phase 2; likely `useAppsMatchingApiGetStrategy`). The response (`StrategyResponse`) contains:
- `safety[]`, `target[]`, `reach[]` — suggested programs grouped by admission likelihood
- `options[]` — strategy options that summarize choices and reference programs via `target_program_refs`
- `scholarships[]` — scholarships with `applicable_program_ids`
- `action_plan` — list of tasks/deadlines
- `overall_summary` / `error` — metadata

UI:
- Render `safety`, `target`, `reach` program groups as the primary suggestions.
- Render `options[]` as strategy decision cards; their compare toggle adds the referenced program IDs (from `target_program_refs`) to the compare store.
- Render `ScholarshipCard` list and `ActionPlanTimeline`.
- Empty/error state prompts the user to complete Persona Labs.

There is no backend "generate/refresh" endpoint; a refresh button simply refetches the strategy query.

## Related Code Files

| Action | Path | Note |
|--------|------|------|
| Create | `components/strategy/StrategyClient.tsx` | Main strategy component |
| Create | `components/strategy/StrategyOptionCard.tsx` | Strategy option decision card |
| Create | `components/strategy/SuggestionCard.tsx` | Program suggestion card for safety/target/reach groups |
| Create | `components/strategy/ActionPlanTimeline.tsx` | Action plan timeline |
| Create | `components/strategy/ScholarshipCard.tsx` | Embedded scholarship card |
| Modify | `app/(app)/strategy/page.tsx` | **Owned by Phase 3** — add dynamic import of `StrategyClient` here |
| Modify | `components/explore/CompareTray.tsx` | Accept program IDs from strategy option refs (Phase 4 owns the store) |
| Modify | `messages/vi.json`, `messages/en.json` | Strategy labels |

## Implementation Steps

1. Inspect `StrategyResponse` in `lib/generated/api/models` and map nested fields (`safety`, `target`, `reach`, `options`, `scholarships`, `action_plan`).
2. Create `components/strategy/StrategyClient.tsx`:
   - Fetch strategy with the generated hook recorded in Phase 2.
   - Render loading skeleton, error state, empty state (CTA to `/persona-labs`).
3. Create `SuggestionCard` for programs in `safety`/`target`/`reach` groups.
4. Create `StrategyOptionCard` for each strategy option:
   - Show title, summary, and the referenced program names.
   - "Compare" toggle adds the program IDs in `target_program_refs` to the compare store.
5. Create `ScholarshipCard` from embedded scholarship objects.
6. Create `ActionPlanTimeline` rendering action plan items with due dates.
7. Wire the compare store to open `CompareDrawer` from the strategy tab as well. Phase 4 owns the store; this phase only calls its public add/remove API.
8. Wire `StrategyClient` into the existing `app/(app)/strategy/page.tsx` shell from Phase 3.
9. Add i18n keys under `strategy.*`.
10. Run `bun tsc` and `bun check`.

## File Inventory

| File | Action | Why |
|------|--------|-----|
| `components/strategy/StrategyClient.tsx` | Create | Main strategy view |
| `components/strategy/StrategyOptionCard.tsx` | Create | Strategy option card |
| `components/strategy/SuggestionCard.tsx` | Create | Program suggestion card |
| `components/strategy/ActionPlanTimeline.tsx` | Create | Action plan |
| `components/strategy/ScholarshipCard.tsx` | Create | Scholarship display |
| `app/(app)/strategy/page.tsx` | Modify | Add `StrategyClient` dynamic import to the Phase 3 shell |
| `components/explore/CompareTray.tsx` | Modify | Accept program IDs from strategy refs (Phase 4 owns store) |

## Test Scenario Matrix

| Scenario | Steps | Expected |
|----------|-------|----------|
| Load strategy | Open `/strategy` | Fetches `GET /api/v1/explore/strategy` |
| Empty state | No persona submitted | Shows CTA to `/persona-labs` |
| Suggestion groups | Strategy has data | Renders safety/target/reach program cards |
| Strategy options | Strategy has data | Renders decision cards with referenced programs |
| Compare from strategy | Toggle compare on option | Adds referenced program IDs to compare store |
| Scholarships | Scroll below options | Scholarship cards visible |
| Action plan | Scroll below options | Timeline of tasks/deadlines visible |

## Success Criteria

- [ ] `/strategy` fetches and displays strategy data.
- [ ] Empty state links to Persona Labs.
- [ ] Safety/target/reach suggestion groups render.
- [ ] Strategy option compare toggles add the correct program IDs.
- [ ] Scholarships and action plan render.
- [ ] `bun check` and `bun tsc` pass.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| `StrategyResponse` is deeply nested | Medium | Create small typed sub-components; avoid prop drilling |
| Strategy endpoint slow | Low | Show skeleton; generated hook handles loading |
| Strategy option refs do not match catalog program IDs | Medium | Verify `target_program_refs` are valid program UUIDs before adding to compare |
| No generate/refresh endpoint | Low | Refresh button simply refetches; document limitation |

## Security Considerations

- Strategy may contain personalized recommendations; fetched with session cookie.
- No sensitive data leaked in compare state (only program IDs).
