# 007 — June 2026 — Phase 04: Home Dashboard

> Recorded during Phase 04 (Home Dashboard / post-login landing). Documents the
> architectural choices made while building `/home`.

---

## Decision: Server Component page with parallel data fetching

`src/app/(dashboard)/home/page.tsx` is an async Server Component. It reads the
NextAuth session (`getServerSession`), then fetches the three feature data sets in
parallel with `Promise.all`:

- latest `VocationalTestSession` (by `startedAt desc`),
- all `FavoriteProfession` rows (by `createdAt desc`),
- the most recent **active** `CareerPlan` (with its `tasks`).

Rationale: no client interactivity is required to render the dashboard, so we keep
data on the server, avoid an API round-trip, and pass plain props down. A guard
redirects to `/login` if `session.user.id` is missing (prevents a `where: { userId:
undefined }` query from matching another user's data).

## Decision: One reusable `FeatureStatusCard`, three thin state wrappers

Approved by Yan. Instead of three bespoke cards, a single presentational
`FeatureStatusCard` owns the shared structure (gradient icon tile, accent bar,
title, description, optional badge/children, primary + optional secondary CTA).
Each feature has a thin wrapper (`VocationalCard`, `LaborMarketCard`,
`CareerPlanCard`) that maps the user's data to the correct state and feeds content
into the shared card. Keeps the three cards visually consistent and avoids
duplicated markup.

Accent colors: `sky` (default/explore), `gold` (attention / in-progress / plan),
`success` (completed test).

## Decision: Lucide icons instead of the layout's emojis

The phase sketch used emojis (🧭 📊 🗺️). We used Lucide icons (`Compass`,
`ChartColumnIncreasing`, `Route`, `CheckCircle2`) in a gradient tile to stay
consistent with the landing page (`FeaturesSection`) and the overall design system.

## Decision: Defensive placeholders for not-yet-seeded data

CBO occupation names and market metrics arrive in Phases 05/06/08. Until then:

- The Labor Market "has favorites" state shows the **CBO code** (e.g. "Código CBO
  …") instead of a profession name, plus a small dashed note that salary/demand
  stats are coming in a later phase.
- The Vocational "in progress" / "completed" states read `answers`/`results` JSON
  defensively (optional `progress`, `currentSection`, `dominantTypes`) since the
  test's data shape is defined in Phase 07.

For a brand-new user (no data), all three cards render their "State A" (not
started) variant, satisfying the phase's acceptance criteria.

## Decision: Time- and day-based content uses server time

`WelcomeBanner` greeting (Bom dia/tarde/noite) is computed from the server clock;
`DailyTip` selects one of 7 tips via `Date.getDay()`. This matches the phase
specification and keeps both as Server Components.

---

### Files added

- `src/components/features/home/FeatureStatusCard.tsx`
- `src/components/features/home/WelcomeBanner.tsx`
- `src/components/features/home/VocationalCard.tsx`
- `src/components/features/home/LaborMarketCard.tsx`
- `src/components/features/home/CareerPlanCard.tsx`
- `src/components/features/home/DailyTip.tsx`

### Files changed

- `src/app/(dashboard)/home/page.tsx` — replaced the Placeholder with the real dashboard.
