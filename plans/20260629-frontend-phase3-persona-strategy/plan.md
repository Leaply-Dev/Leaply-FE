---
title: "Frontend Phase 3: Persona Labs, Strategy Tab & API Rewire"
description: "Rewire frontend to Python backend: remove dashboard/tour, add Khám phá / Persona Labs / Chiến lược tabs, fixed-question Persona Labs, and strategy suggestions."
status: pending
priority: P1
effort: "3-4d"
branch: "main"
tags: [frontend, refactor, api, persona, strategy]
blockedBy: []
blocks: []
created: "2026-06-29T10:15:34.740Z"
createdBy: "ck:plan"
source: skill
---

# Frontend Phase 3: Persona Labs, Strategy Tab & API Rewire

## Overview

This plan finishes the frontend migration to the Python backend started in `leaply-pythonic/plans/20260629-frontend-plug-and-strip`.

It removes the leftover dashboard and tour-guide surfaces, replaces them with a simplified three-tab app shell (**Khám phá**, **Persona Labs**, **Chiến lược**), wires all API calls directly to the generated Orval hooks against Django Ninja, and adds a reversible fixed-question Persona Labs flow.

Scope is limited to the frontend repo (`../frontend`) and reads the backend only for contract alignment.

**Scope choice:** HOLD — execute exactly the three-tab shell, fixed-question Persona Labs, and strategy suggestion tab. Dashboard, tour, and Java-era stubs are removed; applications/essays/chat remain out of scope.

## Cross-Plan Dependencies

| Relationship | Plan | Status |
|-------------|------|--------|
| Depends on (backend endpoints must be present) | `leaply-pythonic/plans/20260629-frontend-plug-and-strip` | completed |

Verify the backend actually exposes `/explore/strategy`, `/onboarding/persona/questions`, and `/onboarding/persona` before starting Phase 2. The backend roadmap still lists matching/strategy agents as TODO; if the endpoints are missing, this plan is blocked.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Cleanup](./phase-01-cleanup.md) | Pending |
| 2 | [API Contract](./phase-02-api-contract.md) | Pending |
| 3 | [Navigation](./phase-03-navigation.md) | Pending |
| 4 | [Catalog Compare](./phase-04-catalog-compare.md) | Pending |
| 5 | [Persona Labs](./phase-05-persona-labs.md) | Pending |
| 6 | [Strategy Suggestion](./phase-06-strategy-suggestion.md) | Pending |
| 7 | [Verification](./phase-07-verification.md) | Pending |

## Dependencies

- Python backend running locally for Orval generation.
- `bun` / Node toolchain.
- Existing `proxy.ts` route guard (there is no `middleware.ts` in this repo).
