---
phase: 2
title: "API Contract"
status: pending
priority: P1
effort: "4h"
dependencies: [1]
---

# Phase 2: API Contract

## Overview

Regenerate Orval hooks from the Python OpenAPI spec, remove placeholder stubs for endpoints that now exist, and wire auth/user/profile/onboarding to the generated hooks.

## Requirements
- Functional: All API calls use `@/lib/generated/api/endpoints/*`; no manual `fetch` for business endpoints.
- Non-functional: No `any` type suppression; weakly-typed `ApiResponse[dict]` responses are wrapped with explicit frontend mappers.

## Architecture

`orval.config.mts` already points at `http://localhost:8000/api/v1/openapi.json`. Running `bun generate:api` produces `auth`, `user`, `onboarding`, and `explore` endpoint files. The custom mutator attaches `credentials: "include"` and handles 401 logout.

Because `apps/accounts/api_user.py` and `apps/profiling/api.py` declare responses as `ApiResponse[dict]`, Orval cannot infer inner shapes. Create thin typed mappers in `lib/api/mappers.ts` that call generated hooks and cast/validate the `data` field to the known Pydantic shapes (`UserMeResponse`, `ProfileResponse`, `OnboardingDataResponse`). Prefer Zod parsing over `as` casts so a backend schema drift surfaces as an error, not a runtime mismatch.

Cookie/CSRF notes:
- Backend session auth has `csrf=False` (`apps/accounts/security.py`), so no CSRF token is required today. Document this dependency.
- `SESSION_COOKIE_SAMESITE = 'Lax'`. This is fine for same-site dev (localhost), but a production deployment on separate origins will need `SameSite=None; Secure` or a same-site proxy.

## Related Code Files

| Action | Path | Note |
|--------|------|------|
| Modify | `lib/api/compat.ts` | Remove stubs for endpoints that now exist |
| Create | `lib/api/mappers.ts` | Typed wrappers over generated `dict` responses |
| Modify | `lib/store/userStore.ts` | Replace direct fetch logout with generated `useAppsAccountsApiAuthLogout` if not already done |
| Modify | `app/(auth)/*` | Verify auth pages use generated auth hooks |
| Modify | `app/onboarding/*` | Wire to generated onboarding hooks |
| Modify | `components/explore/*` | Already wired in previous phase; verify save mutation invalidation |

## Implementation Steps

1. Verify the Python backend is on a branch/commit that has the needed endpoints (`/auth/*`, `/user/*`, `/onboarding/*`, `/explore/*`, `/explore/strategy`). If not, stop and resolve the backend dependency first.
2. Start Python backend (`uv run manage.py runserver`).
3. Run `bun generate:api`.
4. Inspect generated files in `lib/generated/api/endpoints/{auth,user,onboarding,explore}`. Record the exact hook names (e.g. `useAppsProfilingApiPersonaQuestions` vs `useAppsProfilingApiGetPersonaQuestions`) and update later phases.
5. From `lib/api/compat.ts`, delete:
   - `useGetHomeData` (dashboard removed)
   - `useGetApplication` (applications removed)
   - `useGetScholarshipDetail` / `listScholarships` (scholarships come from strategy endpoint now)
   - `HomeResponse`, `DiscoveryProgressDto`, `RecentApplicationDto`, `UpcomingDeadlineDto`, `Scholarship*Response`, `EnglishGap`, `GpaGap`
6. Keep `UserMeResponse`, `ProfileResponse`, `PreferencesResponse`, `OnboardingDataResponse`, `OnboardingStatusResponse` as explicit types that mirror backend Pydantic models.
7. In `lib/api/mappers.ts`, create:
   - `useUserMe()` → calls the generated user/me hook, returns typed `UserMeResponse`.
   - `useUserProfile()` → calls the generated user/profile hook, returns typed `ProfileResponse`.
   - `useUpdateUserProfile()` / `useUpdateUserPreferences()` with typed mutation variables.
   - `useOnboardingStatus()` / `useUpdateOnboarding()` with typed `OnboardingDataResponse`.
8. Update `app/onboarding/page.tsx` and `OnboardingClient.tsx` to use the generated onboarding hooks.
9. **Logout**: React components use `useAppsAccountsApiAuthLogout`; `lib/store/userStore.ts` keeps a direct `fetch` to `/api/v1/auth/logout` because stores cannot call hooks. Both paths must clear the `leaply-auth-state` cookie.
10. Verify no `@ts-ignore` or `as any` introduced. Type assertions in mappers must be wrapped by Zod parse, not bare `as`.

## File Inventory

| File | Action | Why |
|------|--------|-----|
| `lib/api/compat.ts` | Modify | Remove obsolete stubs |
| `lib/api/mappers.ts` | Create | Type-safe wrappers for loose dict responses |
| `lib/store/userStore.ts` | Modify | Use generated logout hook |
| `app/onboarding/page.tsx` | Modify | Generated onboarding hooks |
| `app/onboarding/OnboardingClient.tsx` | Modify | Generated onboarding hooks |

## Test Scenario Matrix

| Scenario | Steps | Expected |
|----------|-------|----------|
| Orval regeneration | `bun generate:api` | Succeeds, no deleted endpoints |
| Auth hooks exist | Import from `endpoints/auth/auth` | `useAppsAccountsApiAuthLogin`, `useAppsAccountsApiAuthMe`, `useAppsAccountsApiAuthLogout` available |
| User hooks typed | Use `useUserMe()` mapper | Returns typed profile without `any` |
| Onboarding save | Submit onboarding | Calls `PATCH /api/v1/onboarding` |

## Success Criteria

- [ ] `bun generate:api` runs against Python backend.
- [ ] `lib/api/compat.ts` contains only types for endpoints that truly do not exist.
- [ ] Auth/onboarding/explore calls use generated hooks.
- [ ] `bun tsc --noEmit` passes.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| `ApiResponse[dict]` breaks runtime assumptions | Medium | Use Zod parse in mappers; treat parse failures as errors |
| Generated hook names differ from plan | Medium | Record exact names after `bun generate:api`; update phases 5 and 6 |
| Backend endpoints not yet implemented | High | Verify backend branch before starting this phase |
| Production cross-origin session cookie blocked | Medium | Document `SameSite=None; Secure` requirement for separate origins |

## Security Considerations

- Never store session cookie in JS; keep current cookie-only flow.
- Do not weaken 401 handling in mutator.
- Document dependency on backend `SessionAuth(csrf=False)`. If CSRF is re-enabled, the frontend must fetch and send a CSRF token.
