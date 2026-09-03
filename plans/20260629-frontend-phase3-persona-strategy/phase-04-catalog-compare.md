---
phase: 4
title: "Catalog Compare"
status: pending
priority: P1
effort: "4h"
dependencies: [2, 3]
---

# Phase 4: Catalog & Compare

## Overview

Harden the program catalog and compare drawer against the Python backend schema, and remove the stubbed scholarship explore tab from `/explore`.

## Requirements
- Functional: Program list, search, filters, detail drawer, save/unsave, and compare work end-to-end.
- Non-functional: No stub data; compare drawer handles detail-only fields gracefully.

## Architecture

Catalog already uses generated hooks from the previous phase. This phase is verification and cleanup:
- `ExploreClient` → `useAppsCatalogApiListPrograms` + `useAppsCatalogApiGetMatchedPrograms`.
- `ProgramDetailDrawer` → `useAppsCatalogApiGetProgramDetail`.
- Save/Unsave → `useAppsCatalogApiSaveProgram` / `useAppsCatalogApiUnsaveProgram` with query invalidation.
- Compare → `CompareTray` stores selected program IDs. Design it as a generic compare store (program IDs) so Phase 6 can add strategy option refs without changing the store shape. `CompareDrawer` fetches detail for each selected ID or reuses list data.

Schema note: `ProgramListResponse.data` is the list array (not `.items`), and `ProgramDetailResponse` exposes `requirements`, `costs`, `deadlines`, `funding`, `provenance`, `completenessScore` (not `funding_options` / `completeness`). Map accordingly.

Scholarships are not exposed as standalone catalog endpoints, so drop the scholarships tab in `/explore`. Scholarships will appear inside the **Chiến lược** tab (Phase 6).

## Related Code Files

| Action | Path | Note |
|--------|------|------|
| Modify | `app/(app)/explore/page.tsx` | Remove `ScholarshipExploreClient` tab and related skeleton |
| Modify | `components/explore/ExploreClient.tsx` | Verify list/filter wiring |
| Modify | `components/explore/ProgramCard.tsx` | Map `institution{}`, ranking, tuition fields |
| Modify | `components/explore/ProgramDetailDrawer.tsx` | Render requirements/costs/funding/deadlines/provenance |
| Modify | `components/explore/CompareDrawer.tsx` | Handle detail-only fields, use generated detail hook |
| Modify | `components/explore/CompareTray.tsx` | Design as a generic program-ID selection store so Phase 6 can reuse it |
| Delete | `components/explore/scholarship/*` | Scholarship explore removed from this surface |

## Implementation Steps

1. In `app/(app)/explore/page.tsx`:
   - Remove `ScholarshipExploreClient` dynamic import and `tabs.scholarships` trigger.
   - Remove scholarship skeleton branch if dedicated.
2. Delete `components/explore/scholarship/` directory.
3. Verify `ExploreClient` maps `ApiResponseProgramListResponse.data.data` correctly (the list is under the inner `data`, not `.items`).
4. Verify filter chips use `/explore/filters` options via the generated filter hook.
5. Verify `ProgramDetailDrawer` renders `requirements`, `costs`, `deadlines`, `funding`, `provenance`, `completenessScore`.
6. Verify save mutation `onSuccess` invalidates the exact query keys exported by the generated hooks (list programs, saved programs, detail).
7. Design `CompareTray` as a generic selection store keyed by program ID. Phase 6 will reuse it for strategy option program refs.
8. Verify compare drawer:
   - fetches detail for each selected ID if not already loaded;
   - shows "—" for detail-only fields when comparing from list cards.
9. Handle unknown `tab` query param in `/explore`: if `tab=scholarships`, redirect/reset to `tab=programs`.
10. Run `bun tsc` and fix any field-name drift.

## File Inventory

| File | Action | Why |
|------|--------|-----|
| `app/(app)/explore/page.tsx` | Modify | Remove scholarships tab |
| `components/explore/ExploreClient.tsx` | Modify | Program list/filters |
| `components/explore/ProgramCard.tsx` | Modify | Python schema fields |
| `components/explore/ProgramDetailDrawer.tsx` | Modify | Rich detail |
| `components/explore/CompareDrawer.tsx` | Modify | Compare logic |
| `components/explore/CompareTray.tsx` | Modify | Selection state |
| `components/explore/scholarship/*` | Delete | No standalone scholarship catalog |

## Test Scenario Matrix

| Scenario | Steps | Expected |
|----------|-------|----------|
| List programs | Open `/explore` | Program cards load from `/api/v1/explore/programs` |
| Filter | Select a region filter | Query refetches with params |
| Detail drawer | Click a card | Drawer opens with requirements/costs |
| Save program | Click save star | Card state updates; `/explore/programs/saved` reflects change |
| Compare | Select 2 programs; open compare | Drawer shows both with detail fields |
| Scholarships tab gone | Visit `/explore?tab=scholarships` | Redirects/resets to `tab=programs` |
| Compare store reusable | Inspect `CompareTray` API | Accepts program IDs without assuming explore-only context |

## Success Criteria

- [ ] `/explore` shows only the Programs tab.
- [ ] Program list/detail/save/compare all use generated hooks.
- [ ] No references to deleted scholarship explore components.
- [ ] `bun tsc --noEmit` and `bun check` pass.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Schema field rename (e.g. `institution` vs `university`) | Medium | Inspect `lib/generated/api/models` after `bun generate:api` |
| Compare drawer over-fetches details | Low | Reuse list data when possible; detail fields show "—" |
| Compare store not generic enough for Phase 6 | Medium | Keep store as `Set<programId>` with add/remove/toggle/clear actions |

## Security Considerations

- Save endpoints are protected by session auth; mutator already sends credentials.
- No exposed user IDs in compare URLs beyond program UUIDs.
