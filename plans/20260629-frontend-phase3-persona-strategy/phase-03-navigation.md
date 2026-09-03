---
phase: 3
title: "Navigation"
status: pending
priority: P1
effort: "3h"
dependencies: [1]
---

# Phase 3: Navigation

## Overview

Replace the dashboard-centric navigation with a tab bar that exposes the three user-facing surfaces: **Khám phá**, **Persona Labs**, and **Chiến lược**.

## Requirements
- Functional: Three tabs visible on desktop and mobile; active tab highlighted; deep links work.
- Non-functional: No layout shift; mobile menu uses same tabs.

## Architecture

Keep each surface as a standalone route under `app/(app)/`:
- `/explore` — catalog + compare
- `/persona-labs` — fixed questionnaire
- `/strategy` — strategy suggestions

The `Navbar` renders a `NavTabs` component for authenticated users. Tabs are labels only (i18n keys); route changes update the active tab via `usePathname`. To avoid hydration mismatch, render the active indicator only after mount or derive `isActive` from the pathname without rendering different server/client markup.

All route-guard changes go in `proxy.ts`; there is no `middleware.ts` in this repo.

## Related Code Files

| Action | Path | Note |
|--------|------|------|
| Create | `app/(app)/persona-labs/page.tsx` | Shell page (client loaded dynamically) |
| Create | `app/(app)/strategy/page.tsx` | Shell page (client loaded dynamically) |
| Create | `components/app/NavTabs.tsx` | Horizontal tab bar |
| Modify | `components/Navbar.tsx` | Replace `authNavLinks` with `NavTabs`; update logo; keep profile dropdown-only |
| Modify | `proxy.ts` | Update `PROTECTED_ROUTES` to `[/explore, /persona-labs, /strategy]`; redirect `/dashboard` → `/explore` is already done in Phase 1, double-check here |
| Modify | `messages/vi.json`, `messages/en.json` | Add `nav.explore`, `nav.personaLabs`, `nav.strategy` |

## Implementation Steps

1. Create `components/app/NavTabs.tsx`:
   - Accept tabs array: `[
       { href: "/explore", labelKey: "nav.explore" },
       { href: "/persona-labs", labelKey: "nav.personaLabs" },
       { href: "/strategy", labelKey: "nav.strategy" }
     ]`.
   - Highlight active tab using `usePathname()`.
2. In `components/Navbar.tsx`:
   - Replace the mapped `authNavLinks` with `<NavTabs />`.
   - Keep public nav links (`/`, `/features`, `/about`) for logged-out users.
   - Update logo `href` to `/explore` when authenticated.
   - Keep profile access in the avatar dropdown only (no `/profile` link).
   - Update the **mobile menu** to render `<NavTabs />` and remove the old dashboard/tour/profile-row buttons.
3. Create shell pages (Phase 3 owns the route shells; Phases 5 and 6 own the client components):
   - `app/(app)/persona-labs/page.tsx` — dynamic import of `PersonaLabsClient`.
   - `app/(app)/strategy/page.tsx` — dynamic import of `StrategyClient`.
4. Update `proxy.ts`:
   - Set `PROTECTED_ROUTES` to `[/explore, /persona-labs, /strategy]`.
   - Fix the existing `/persona-lab` typo if still present.
   - Confirm `/dashboard` → `/explore` redirect is in place from Phase 1.
5. Add i18n keys and verify both locales.
6. Run `bun check`.

## File Inventory

| File | Action | Why |
|------|--------|-----|
| `components/app/NavTabs.tsx` | Create | Shared tab bar |
| `app/(app)/persona-labs/page.tsx` | Create | New route |
| `app/(app)/strategy/page.tsx` | Create | New route |
| `components/Navbar.tsx` | Modify | Use tabs, fix links |
| `proxy.ts` | Modify | Redirect + protection |

## Test Scenario Matrix

| Scenario | Steps | Expected |
|----------|-------|----------|
| Tab navigation | Click each tab | Navigates to `/explore`, `/persona-labs`, `/strategy` |
| Active highlight | Visit `/persona-labs` | Persona Labs tab highlighted |
| Mobile menu | Open mobile menu | Shows same three tabs |
| Old dashboard link | Visit `/dashboard` | Redirects to `/explore` |
| Unauthenticated | Visit `/strategy` while logged out | Redirects to `/login` |

## Success Criteria

- [ ] Three tabs visible and clickable on desktop.
- [ ] Mobile menu shows the three tabs and no dashboard/tour buttons.
- [ ] Active tab matches current route.
- [ ] `/dashboard` redirects to `/explore`.
- [ ] `bun check` passes.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hydration mismatch from `usePathname` | Medium | Render active indicator after mount; keep server/client markup identical |
| `proxy.ts` PROTECTED_ROUTES misses new routes | High | Update the array explicitly; test unauthenticated access to each route |
| Mobile menu not updated | Medium | Include mobile menu rewrite as a checklist item in success criteria |

## Security Considerations

- Tabs do not expose auth state beyond what `proxy.ts` already enforces.
- Profile dropdown link remains protected by the same auth guard.
- No `/profile` route is created, so no new protected surface is introduced.
