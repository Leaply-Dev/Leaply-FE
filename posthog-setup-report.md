# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Leaply frontend. The integration covers client-side initialization via `instrumentation-client.ts` (Next.js 16 App Router pattern), a reverse proxy via Next.js rewrites to reduce ad-blocker interference, user identification at login/signup/OAuth, 14 custom business events across the core conversion funnel, and automatic exception capture on critical error paths.

## Changes summary

| File | Change |
|------|--------|
| `instrumentation-client.ts` | **Created** — initializes PostHog with reverse proxy, exception capture, and debug mode in dev |
| `next.config.ts` | **Edited** — added `/ingest` reverse proxy rewrites and `skipTrailingSlashRedirect` |
| `.env.local` | **Edited** — added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account via email/password | `components/signup-form.tsx` |
| `user_logged_in` | User successfully logged in via email/password | `components/login-form.tsx` |
| `google_oauth_initiated` | User clicked the Google sign-in/sign-up button | `components/GoogleLoginButton.tsx` |
| `google_oauth_completed` | User successfully authenticated via Google OAuth | `app/oauth/success/page.tsx` |
| `onboarding_step_completed` | User completed a step in the onboarding flow (step + step_name properties) | `components/onboarding/OnboardingClient.tsx` |
| `onboarding_completed` | User finished the full onboarding flow and selected their journey type | `components/onboarding/OnboardingClient.tsx` |
| `program_viewed` | User opened the detail drawer for a specific program | `components/explore/ExploreClient.tsx` |
| `program_added_to_dashboard` | User added a program to their application dashboard | `components/explore/ExploreClient.tsx` |
| `explore_mode_switched` | User switched between AI Suggest and Manual explore modes | `components/explore/ExploreClient.tsx` |
| `program_compare_opened` | User opened the compare dialog for multiple programs | `components/explore/ExploreClient.tsx` |
| `persona_lab_message_sent` | User sent a message in the Persona Lab guided conversation | `components/persona-lab/ChatSidebar/index.tsx` |
| `archetype_revealed` | User's archetype was generated and revealed at conversation completion | `components/persona-lab/ChatSidebar/index.tsx` |
| `sop_started` | User started writing their Statement of Purpose for an application | `components/applications/sop/SopWorkspace.tsx` |
| `sop_completed` | User marked their SOP as completed | `components/applications/sop/SopWorkspace.tsx` |

User identification (`posthog.identify`) is called at:
- Email login (`components/login-form.tsx`) — using `userId` as distinct ID with `email` property
- Email signup (`components/signup-form.tsx`) — using `userId` as distinct ID with `email` and `name` properties
- Google OAuth success (`app/oauth/success/page.tsx`) — using `userId` as distinct ID with `email` and `name` properties

Exception capture (`posthog.captureException`) is added to:
- `components/login-form.tsx` — login failure catch block
- `components/signup-form.tsx` — registration failure catch block
- `app/oauth/success/page.tsx` — OAuth verification failure catch block

## Next steps

To start seeing data, install the `posthog-js` package by running:

```bash
bun add posthog-js
```

Then visit your PostHog project to build insights based on the events above. Suggested insights:

1. **Signup conversion funnel** — `user_signed_up` → `onboarding_completed` → `program_added_to_dashboard`
2. **Login methods breakdown** — trend of `user_logged_in` vs `google_oauth_completed` over time
3. **Onboarding drop-off** — funnel across `onboarding_step_completed` step 1 → 2 → 3 → `onboarding_completed`
4. **Explore engagement** — trend of `program_viewed`, `program_added_to_dashboard`, and `program_compare_opened`
5. **Persona Lab completion** — funnel from `persona_lab_message_sent` (first) → `archetype_revealed`
6. **SOP completion rate** — funnel of `sop_started` → `sop_completed`

You can build these at: https://us.posthog.com/project/387189/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
