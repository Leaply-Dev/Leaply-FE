# Leaply User Flow Analysis

## Overview

This document maps the complete user journey through the Leaply application and identifies potential problems.

---

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PUBLIC ROUTES                                      │
│  / (Landing) → /features → /about → /resources → /privacy → /tos            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION FLOW                                  │
│                                                                              │
│  ┌──────────┐     ┌────────────┐     ┌─────────────────┐                   │
│  │ /login   │────▶│ Validate   │────▶│ Store tokens    │                   │
│  │          │     │ credentials│     │ in Zustand +    │                   │
│  └──────────┘     └────────────┘     │ set cookie      │                   │
│        │                              └────────┬────────┘                   │
│        │                                       │                            │
│  ┌──────────┐     ┌────────────┐              │                            │
│  │/register │────▶│ Create     │──────────────┤                            │
│  │          │     │ account    │              │                            │
│  └──────────┘     └────────────┘              │                            │
│        │                                       ▼                            │
│        │          ┌────────────────────────────────────────┐               │
│        └─────────▶│ /verify-email (can skip)               │               │
│                   └────────────────────────────────────────┘               │
│                                       │                                     │
│  ┌──────────────────┐                 │                                     │
│  │ /forgot-password │────▶ /reset-password                                 │
│  └──────────────────┘                 │                                     │
│                                       │                                     │
│  ┌──────────────────┐                 │                                     │
│  │ /oauth/success   │─────────────────┤                                     │
│  │ (Google OAuth)   │                 │                                     │
│  └──────────────────┘                 │                                     │
└───────────────────────────────────────┼─────────────────────────────────────┘
                                        │
                          ┌─────────────┴─────────────┐
                          │ onboardingComplete?       │
                          └─────────────┬─────────────┘
                                 NO     │     YES
                          ┌─────────────┴─────────────┐
                          ▼                           ▼
┌─────────────────────────────────────┐  ┌────────────────────────────────────┐
│           ONBOARDING FLOW           │  │         PROTECTED ROUTES           │
│                                     │  │                                    │
│  Step 1: Education Level & Target   │  │  /dashboard                        │
│  Step 2: Fields & Regions           │  │    ├── /dashboard/profile          │
│  Step 3: Timeline & Budget          │  │    └── /dashboard/applications/[id]│
│  Step 4: Journey Type               │  │           └── /tasks               │
│    ├── "Exploring" → /persona-lab   │  │                                    │
│    └── "Targeted"  → /explore       │  │  /explore                          │
│  Step 5: Complete                   │  │    └── /explore/[id]               │
│                                     │  │                                    │
└─────────────────────────────────────┘  │  /persona-lab                      │
                          │              │    ├── ChatSidebar (AI chat)       │
                          │              │    └── Canvas/ListView             │
                          └──────────────┴────────────────────────────────────┘
```

---

## Route Protection Logic

**File:** `proxy.ts`

| Route Type | Auth Required | Onboarding Required | Redirect If Fail |
|------------|---------------|---------------------|------------------|
| Public (/, /features) | No | No | - |
| Auth (/login, /register) | No* | No | → /dashboard or /onboarding |
| Onboarding | Yes | No* | → /login or /dashboard |
| Protected (/dashboard, /explore, /persona-lab) | Yes | Yes | → /login or /onboarding |

*Redirects away if already authenticated/completed

---

## State Management

**Auth State (Zustand + Cookie):**
```
lib/store/userStore.ts
├── profile: UserProfile
├── accessToken: string (localStorage)
├── refreshToken: string
├── tokenExpiresAt: number
├── isOnboardingComplete: boolean
├── isAuthenticated: boolean
└── _hasHydrated: boolean

Cookie: leaply-auth-state
├── isLoggedIn: boolean
└── isOnboardingComplete: boolean
```

---

## Potential Problems Identified

### 1. **State Synchronization Issues** (HIGH)
**Location:** `lib/store/userStore.ts`, `proxy.ts`

**Problem:** Auth state is duplicated between:
- Zustand store (persisted to localStorage)
- Cookie (`leaply-auth-state`)

**Risk:** If localStorage is cleared but cookie remains (or vice versa), the app enters an inconsistent state:
- Proxy allows access based on cookie
- App shows logged-out UI based on empty store

**Recommendation:** Single source of truth - either use cookie-only auth or implement sync mechanism on hydration.

---

### 2. **Email Verification Skip** (MEDIUM)
**Location:** `app/(auth)/verify-email/page.tsx`

**Problem:** Users can skip email verification and proceed to onboarding.

**Risk:** Unverified accounts can access the full application, potentially leading to:
- Spam accounts
- Inability to recover account (forgot password won't work)
- No guarantee email belongs to user

**Recommendation:** Either enforce verification or limit functionality for unverified users.

---

### 3. **Hydration Mismatch Potential** (MEDIUM)
**Location:** `lib/store/userStore.ts`

**Problem:** The `_hasHydrated` flag is used to handle SSR/client mismatch, but:
- Components may render with server state before hydration
- Flash of incorrect content (FOUC) possible

**Current mitigation:** `useIsHydrated()` hook exists but may not be used consistently.

**Recommendation:** Audit all auth-dependent UI for hydration-safe rendering.

---

### 4. **Token Refresh Race Condition** (MEDIUM)
**Location:** `components/providers/AuthProvider.tsx`

**Problem:** Token refresh logic runs on interval, but:
- Multiple tabs could trigger simultaneous refreshes
- Failed refresh may not properly logout user
- `tokenExpiresAt` could be stale if set incorrectly

**Recommendation:** Implement token refresh with mutex/lock and proper error handling.

---

### 5. **Onboarding State Persistence** (LOW)
**Location:** `components/onboarding/OnboardingClient.tsx`

**Problem:** If user closes browser mid-onboarding:
- Partial selections stored in Zustand (persisted)
- User returns and may see inconsistent state
- No "resume from step X" logic

**Recommendation:** Either save progress server-side or implement step resumption.

---

### 6. **OAuth Logout Inconsistency** (LOW)
**Location:** `lib/auth/logout.ts`, `components/Navbar.tsx`

**Problem:** OAuth logout calls separate endpoint (`/oauth/logout`) before local cleanup:
- Network failure leaves user in partial logout state
- Regular logout doesn't call this endpoint

**Recommendation:** Unify logout logic and handle network failures gracefully.

---

### 7. **Session Expired Query Param** (LOW)
**Location:** Marketing pages check `?expired=true`

**Problem:** Session expiry redirects to landing with query param:
- User sees alert once
- Refreshing page shows alert again
- No cleanup of query param after display

**Recommendation:** Remove query param after displaying alert or use sessionStorage.

---

### 8. **Missing Loading States** (LOW)
**Location:** Various protected routes

**Problem:** Some routes show content before auth check completes:
- Brief flash of protected content
- Inconsistent loading patterns across routes

**Recommendation:** Standardize loading skeleton pattern across all protected routes.

---

## Key Files Reference

| Category | Files |
|----------|-------|
| Route Protection | `proxy.ts` |
| Auth Store | `lib/store/userStore.ts` |
| Login/Register | `components/login-form.tsx`, `components/signup-form.tsx` |
| Onboarding | `components/onboarding/OnboardingClient.tsx` |
| Auth Hooks | `lib/hooks/useLogin.ts`, `lib/hooks/useRegister.ts` |
| Logout | `lib/auth/logout.ts` |
| Protected Layout | `app/(app)/layout.tsx` |
| Auth Layout | `app/(auth)/layout.tsx` |

---

## Verification Steps

To validate this analysis:
1. Test login → logout → login cycle
2. Clear localStorage, keep cookie, refresh page
3. Open multiple tabs and let session expire
4. Start onboarding, close browser, reopen
5. Register with fake email, skip verification, use app
