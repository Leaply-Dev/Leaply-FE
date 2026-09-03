---
phase: 1
title: "Cleanup"
status: pending
priority: P1
effort: "3h"
dependencies: []
---

# Phase 1: Cleanup

## Overview

Delete the dashboard page/components, the tour-guide overlay, and the tour store. Remove all dead references so the app still compiles after the cuts.

## Requirements
- Functional: No `/dashboard` route, no tour UI, no tour restart button.
- Non-functional: `bun tsc` and `bun check` pass after deletions.

## Architecture

Straight deletions plus import-cleanup. No new abstractions. Update `proxy.ts` (the only route-guard file; there is no `middleware.ts`) so `/dashboard` redirects to `/explore` and auth/onboarding completion redirects no longer target the deleted dashboard.

## Related Code Files

| Action | Path | Note |
|--------|------|------|
| Delete | `app/(app)/dashboard/` | Whole route directory |
| Delete | `components/dashboard/DashboardClient.tsx` | 566-line client component |
| Delete | `components/tour/` | `TourProvider.tsx`, `TourTooltip.tsx`, `TourSpotlight.tsx`, `useTour.ts` |
| Delete | `lib/store/tourStore.ts` | Zustand tour state |
| Modify | `app/(app)/layout.tsx` | Remove `<TourProvider>` wrapper |
| Modify | `components/Navbar.tsx` | Remove dashboard link, tour restart button, `useTourStore` import; do **not** restructure tabs here — Phase 3 owns nav |
| Modify | `proxy.ts` | Update `PROTECTED_ROUTES` (remove `/dashboard`, fix `/persona-lab` typo, add `/persona-labs` and `/strategy` later in Phase 3), redirect `/dashboard` → `/explore`, change auth/onboarding completion redirects from `/dashboard` → `/explore` |
| Modify | `messages/vi.json`, `messages/en.json` | Remove `nav.home`, `nav.restartTour`, dashboard-specific keys |

## Implementation Steps

1. Remove `<TourProvider>` from `app/(app)/layout.tsx`.
2. Delete `components/tour/` and `lib/store/tourStore.ts`.
3. Delete `app/(app)/dashboard/` and `components/dashboard/DashboardClient.tsx`.
4. In `components/Navbar.tsx`:
   - Remove the `/dashboard` entry from `authNavLinks` (do **not** add Persona Labs / Strategy here; Phase 3 replaces the whole authenticated nav with tabs).
   - Remove `HelpCircle`, `restartTour`, and `useTourStore` usage.
   - Update logo redirect from `/dashboard` to `/explore`.
   - Keep profile access in the avatar dropdown only (do **not** link to `/profile`; no such route exists).
5. In `proxy.ts`:
   - Update `PROTECTED_ROUTES` to remove `/dashboard`.
   - Add a redirect from `/dashboard` and `/dashboard/*` to `/explore` **before** the auth guard.
   - Change the post-login and post-onboarding redirects from `/dashboard` to `/explore`.
6. Remove unused i18n keys and run `bun knip` to catch straggler imports.
7. Run `bun check` and fix lint errors.

## File Inventory

| File | Action | Why |
|------|--------|-----|
| `app/(app)/dashboard/page.tsx` | Delete | Dashboard removed |
| `app/(app)/dashboard/profile/` | Delete | No standalone profile route is planned; profile stays in dropdown |
| `components/dashboard/DashboardClient.tsx` | Delete | Only dashboard consumer |
| `components/tour/*` | Delete | Tour guide removed |
| `lib/store/tourStore.ts` | Delete | No tour state needed |
| `app/(app)/layout.tsx` | Modify | Remove TourProvider |
| `components/Navbar.tsx` | Modify | Update nav + remove tour |
| `proxy.ts` | Modify | Redirect old dashboard URLs |

## Test Scenario Matrix

| Scenario | Steps | Expected |
|----------|-------|----------|
| Dashboard removed | Visit `/dashboard` | Redirects to `/explore` |
| Tour removed | Log in and open mobile menu | No "Restart tour" button |
| Compile clean | `bun check` | No errors |
| No dead imports | `bun knip` | No references to deleted files |

## Success Criteria

- [ ] `app/(app)/dashboard/` does not exist.
- [ ] `components/tour/` does not exist.
- [ ] `bun check` passes.
- [ ] `/dashboard` redirects to `/explore`.
- [ ] No remaining `useTourStore` or `TourProvider` imports.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hidden imports to dashboard/tour | Build break | Grep for `DashboardClient`, `TourProvider`, `useTourStore`, `tourStore` before declaring done |
| Redirect loops from deleted dashboard | High | Update all `/dashboard` redirects in `proxy.ts` (auth, onboarding, direct) before testing |

## Security Considerations

- No auth changes; route protection remains cookie-based.
- Ensure `/dashboard/profile` redirect does not expose profile to unauthenticated users (middleware still checks auth cookie).
