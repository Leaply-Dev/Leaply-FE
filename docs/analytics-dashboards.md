# Analytics Dashboards — PostHog Configuration

**Project:** Leaply (PostHog project ID: 387189, org: Leaply)  
**Timezone:** Asia/Bangkok  
**Last updated:** 2026-04-25

This document is the reproducible recipe for every Product Health dashboard metric. Build these once in PostHog UI after Phase 01–03 events are flowing. Anyone with PostHog admin access can rebuild from this doc.

---

## Dashboard: Product Health

Create at **Insights → Dashboard → New → "Product Health"**.

### Active Users

| Metric | Insight type | Config |
|---|---|---|
| DAU | Trends | Event: `$pageview` · Aggregation: Unique users · Period: Day · Rolling 30d |
| WAU | Trends | Event: `$pageview` · Aggregation: Unique users · Period: Week · Rolling 12 weeks |
| MAU | Trends | Event: `$pageview` · Aggregation: Unique users · Period: Month · Rolling 6 months |

> Pin all three to the same card using the "Compare" option on one Trend insight with intervals 1d / 7d / 30d.

---

### Retention

| Metric | Insight type | Config |
|---|---|---|
| D1 retention | Retention | Cohort event: `user_signed_up` · Return event: `$pageview` · Period: Day · Target: day 1 |
| D7 retention | Retention | Same · Period: Week · Target: week 1 |
| D30 retention | Retention | Same · Period: Month · Target: month 1 |

> Set date range to **last 90 days** for meaningful cohort sizes.

---

### Churn Rate

**Type:** Cohort  
**Navigate:** Cohorts → New cohort → name "Churned (30d)"

| Criterion | Value |
|---|---|
| Match users who | Did `$pageview` in the **last 60d** AND did **not** do `$pageview` in the **last 30d** |

**Insight:** Trends → Cohort: "Churned (30d)" ÷ Cohort: "Active in previous 30d" → formula mode.

---

### Days Since Last Login

**Type:** Person property — no custom insight needed.  
PostHog sets `$last_seen` automatically on every event. Access via:
- **People → Filters → `$last_seen` is before N days ago** to build a cohort
- Or use `last_active_at` person property set explicitly during `analytics.identify()` (already set in Phase 01)

---

### Essays Completed per MAU

**Type:** Formula Trend  
**Insight → Formula mode:**
```
A / B
```
- **A:** Event `essay_completed_server` · Aggregation: Unique users · Period: Month
- **B:** Event `$pageview` · Aggregation: Unique users · Period: Month (= MAU)

---

## Dashboard: Funnel Health

Create at **Insights → Dashboard → New → "Funnel Health"**.

### Onboarding Completion Funnel

**Type:** Funnel  
**Steps:**
1. `onboarding_started`
2. `onboarding_step_completed` (filter: `step_number = 1`)
3. `onboarding_step_completed` (filter: `step_number = 2`)
4. `onboarding_step_completed` (filter: `step_number = 3`)
5. `onboarding_completed`

**Conversion window:** 7 days  
**Metric to watch:** Drop-off rate after step 1 (= `onboarding_started_not_completed` proxy)

---

### Program Search → Save Funnel

**Type:** Funnel  
**Steps:**
1. `program_search_performed`
2. `program_saved`

**Conversion window:** 7 days  
**Metric to watch:** % who search but never save (`university_search_no_save` = 1 − conversion)

---

### Scholarship View → Bookmark Funnel

**Type:** Funnel  
**Steps:**
1. `scholarship_viewed`
2. `scholarship_bookmarked`

**Conversion window:** 7 days  
**Metric to watch:** Drop-off rate (`scholarship_viewed_not_bookmarked`)

---

### Persona Lab Completion Funnel

**Type:** Funnel  
**Steps:**
1. `persona_lab_intake_step_completed` (filter: `step = "track_selection"`)
2. `persona_lab_intake_step_completed` (filter: `step = "questions"`)
3. `persona_lab_intake_completed`
4. `archetype_revealed`

**Conversion window:** 30 days  
**Metric to watch:** Each step drop-off = `feature_abandoned_rate` per Persona Lab stage

---

### SOP Writing Funnel

**Type:** Funnel  
**Steps:**
1. `onboarding_completed` (where `journey = "sop"` or `"full"`)
2. `sop_completed` (FE intent event) or `essay_completed_server` (BE authoritative)

**Conversion window:** 60 days  
**Metric to watch:** Users who start but never write an essay

---

## Trend: Zero-Result Searches

**Type:** Trends  
**Event:** `program_search_performed`  
**Filter:** `results_count = 0`  
**Denominator series:** `program_search_performed` (all)  
**Formula:** `A / B * 100` = `search_performed_zero_results` %

---

## Alerts

Configure under **Settings → Subscriptions**:

| Alert | Trigger | Channel |
|---|---|---|
| Weekly digest | Every Monday 9am | Email team |
| DAU drop >30% | Anomaly on DAU trend | Email on-call |
| Essay completion drop | `essay_completed_server` drops >40% week-over-week | Email |

---

## Optional: `last_login_at` person property

If exact login timestamp (vs last-activity) is needed, add 2 lines to `login-form.tsx` and `app/oauth/success/page.tsx` after the `analytics.identify()` call:

```typescript
import posthog from "posthog-js";
posthog.people.set({ last_login_at: new Date().toISOString() });
```

Decision: defer until retention reports show the distinction matters.

---

## Rebuilding From Scratch

1. Log into PostHog → switch to project **Leaply** (ID 387189)
2. Verify events are flowing: **Events → Live** → perform a login → confirm `user_logged_in` appears
3. Create dashboards top-to-bottom following this doc
4. After each insight is saved, pin it to the appropriate dashboard
5. Set all time ranges to **Last 30 days** default, retention to **Last 90 days**
6. Configure alerts last (needs insight URLs)
