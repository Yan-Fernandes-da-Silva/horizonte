# 010 — June 2026 — Phase 07: Vocational Test

> Recorded during Phase 07. Yan approved the question bank and asked that questions
> and results stay easy to change later — so the whole feature is data-driven.

---

## Approved design (Stage 7A)

- **54 questions** in 4 sections: RIASEC (19), Inteligências Múltiplas (16), GOPC (11),
  Análise Pessoal (8). All 6 question types are used: likert, like_dislike,
  single_select, multi_select, rank, visual.
- **Scoring:** RIASEC & MI normalized 0–100 per dimension from question metadata;
  the visual question adds a +10 bonus to the chosen RIASEC type. Top-3 of each are
  the "dominant" profile. GOPC/personal answers are kept as raw values (labels resolved
  for display; values used as match filters).
- **RIASEC → CBO mapping:** static prefix table (`riasec-cbo-map.ts`) tying each type to
  CBO code prefixes; occupation compatibility = weighted match of the user's top-3
  (×3/×2/×1) plus a soft boost for selected interest areas (G8).

## Key decisions

1. **Data-driven & modular** (Yan's request): the question bank is one declarative file
   (`questions.ts`); scoring reads question metadata so adding a question is auto-counted;
   each question *type* is an isolated component picked via a registry (`QuestionRenderer`);
   each results block (radar, MI bars, GOPC cards, occupations, courses) is its own
   component. Section order/labels/type descriptions live in data, not JSX.
2. **Visual question = icon cards** (no photos): each work environment is a Lucide icon +
   color, mapped to a RIASEC type. Zero asset dependency, matches the design system.
3. **Rank question = up/down controls** instead of drag-and-drop — accessible and avoids a
   fragile DnD dependency. Easy to swap for real DnD later.
4. **Runner unchanged stack:** no new deps; uses existing Recharts (charts), framer-motion
   (transitions), sonner (toasts — `Toaster` mounted in the dashboard layout).

## Persistence

- `VocationalTestSession.answers` (JSON) = `{ responses, currentSection,
  currentSectionLabel, progress }`. Each answer auto-saves via `PUT .../answer`, which is
  what powers "pause & resume" and the home dashboard "in progress" card.
- `VocationalTestSession.results` (JSON) = `{ riasec, mi, dominantTypes, dominantMi, gopc,
  personal, completedAt }`, written by `POST .../complete` running the scoring engine.
- Idempotent restart: `POST .../start` deletes any unfinished session, keeps completed
  ones as history.

## Files

- Logic: `src/lib/vocational-test/{types,questions,scoring,riasec-cbo-map,matching,descriptions,session-server}.ts`
- API: `src/app/api/vocational-test/{start, [sessionId]/answer, [sessionId]/complete}` + `src/app/api/favorites`
- UI: `src/app/(dashboard)/vocational-test/{page, [section]/page, results/page}.tsx`;
  components in `src/components/features/vocational-test/` (TestRunner, StartTestButton,
  FavoriteButton, `questions/*`, `results/*`).
- `(dashboard)/layout.tsx` now mounts `<Toaster />`.

## Verification

End-to-end test (script answering all 54 via the API, then screenshots): scoring produced
the expected biased profile (RIASEC I/A/S = 100, R/E/C = 33; dominant Investigativo,
Artístico, Social). Results page rendered the radar (6 axes), MI bars (8), GOPC cards,
**24 compatible occupations** (favoritar + Ver no Mercado), and course tabs. `tsc`, `next
lint` and `next build` all pass.

## Known follow-ups (for later tuning)

- Occupation matching is prefix-based; for an A-heavy profile it can surface sports/culture
  occupations (CBO 3x/37x). Fine for v1; can be refined with QBQ skills later.
- CBO occupations have no `description` seeded, so cards show title + code only.
- `Ver no Mercado` points to `/labor-market/[code]` (built in Phase 08 — placeholder today).
