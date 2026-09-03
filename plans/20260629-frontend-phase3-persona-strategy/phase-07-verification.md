---
phase: 7
title: "Verification"
status: pending
priority: P1
effort: "3h"
dependencies: [1, 2, 3, 4, 5, 6]
---

# Phase 7: Verification

## Overview

Run quality gates, remove dead code, and manually smoke-test the new navigation, Persona Labs, and strategy tab.

## Requirements
- Functional: All user flows work without runtime errors.
- Non-functional: `bun check`, `bun knip`, and `bun build` all pass.

## Architecture

No new code. Validation only.

## Related Code Files

| Action | Path | Note |
|--------|------|------|
| Modify | Any leftover dead code | Remove based on `knip` output |
| Modify | `package.json` deps | Remove unused deps flagged by knip if safe |

## Implementation Steps

1. Run `bun tsc --noEmit` and fix all type errors.
2. Run `bun check` (Biome lint + format). Fix or suppress only with justification; never `// @ts-ignore`.
3. Run `bun knip`. Review unused exports/files:
   - Remove exports that are truly dead.
   - Keep exports used by tests or generated code.
4. Run `bun build` and ensure no build errors.
5. Add focused automated tests:
   - Unit tests for `lib/api/mappers.ts` (parse failures, happy path).
   - Component render tests for `PersonaLabsClient` and `StrategyClient` loading/empty/error states.
6. Manual smoke test:
   - Log in → lands on `/explore`.
   - Navigate through all three tabs.
   - Open program detail, save a program, compare two programs.
   - Complete Persona Labs: forward/back, answer change, save, final submit.
   - Open `/strategy`; verify suggestion groups, scholarships, action plan.
   - Log out; verify redirect to `/login` for protected routes.
7. Update `docs/CHANGES.md` in the frontend repo if the project tracks changes.
8. Update `CLAUDE.md` if conventions changed (e.g. removed dashboard route, new tab structure).

## File Inventory

| File | Action | Why |
|------|--------|-----|
| Any dead files from `knip` | Delete | Cleanup |
| `package.json` | Modify | Remove unused deps only after verification |

## Test Scenario Matrix

| Scenario | Steps | Expected |
|----------|-------|----------|
| Type check | `bun tsc --noEmit` | 0 errors |
| Lint/format | `bun check` | 0 errors |
| Dead code | `bun knip` | No false positives left unaddressed |
| Build | `bun build` | Exits 0 |
| Mapper tests | Run mapper unit tests | Pass |
| Component states | Render Persona/Strategy empty/loading/error | Pass |
| E2E smoke | Manual browser walkthrough | Tabs, catalog, persona, strategy work |

## Success Criteria

- [ ] `bun tsc --noEmit` passes.
- [ ] `bun check` passes.
- [ ] `bun knip` has no actionable unused files/exports.
- [ ] `bun build` succeeds.
- [ ] Mapper and component-state tests pass.
- [ ] Manual smoke test of all three tabs passes.
- [ ] Auth redirects (`/dashboard` → `/explore`, protected routes) verified.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hidden runtime error from weak `dict` types | Medium | Manual end-to-end walkthrough; add runtime shape checks if needed |
| Knip false positives | Low | Review each finding before deleting |
| Deleted dashboard redirects not fully removed | Medium | Verify `proxy.ts` has no remaining `/dashboard` redirects except the intended one |

## Security Considerations

- Verify no secrets or dead API keys in deleted dashboard code.
- Confirm auth redirects still protect all `(app)` routes after nav changes.
