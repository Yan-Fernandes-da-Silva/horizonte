# 008 — June 2026 — Phase 05: Static-Data ETL (CBO, CNAE, QBQ, Courses)

> Recorded during Phase 05. Documents how the messy government CSVs were inspected,
> the decisions Yan approved, and the non-obvious parsing required to load them.

---

## Inspection findings (what the source files actually are)

| Dataset | Separator | Encoding | Notes |
|---|---|---|---|
| CBO (5 files) | comma | UTF-8 | children link to parent by autoincrement **id**, not code |
| CNAE 1/2/3/5 | comma | UTF-8 | same id-based linking |
| CNAE 4_class | comma | **Latin-1** | malformed: each line quoted + trailing `;;`; multiline labels split across lines |
| QBQ 3/4/5 | comma | UTF-8 | link to occupation by **occupation_id** (CSV id), not the 6-digit code |
| Curso Superior (graduate) | comma | UTF-8 | ~902k offering rows |
| cnct (technical) | **semicolon** | **Latin-1** | multiline quoted fields |
| cncst (technological) | **semicolon** | **Latin-1** | multiline quoted fields |
| ppg (postgraduate) | comma | UTF-8 + BOM | first line is a `#` comment, header on line 2 |

## Decisions approved by Yan

1. **Graduate courses are deduplicated** by `name + degree + area` (campus/institution
   repetition dropped). ~902k offerings → **2,558** distinct courses. Keeps the table
   useful for career suggestions instead of a 900k-row dump.
2. **Runner = `tsx`** (not `ts-node`). The phase doc suggested ts-node, but it fights
   Next's ESM tsconfig on Windows; `tsx` runs the TS scripts with zero extra config.
   Added as a dev dependency alongside `csv-parse`.
3. **QBQ keeps only the description** (per the phase schema) — the proficiency/
   importance/recurrence scores are dropped. Can be revisited if ranking is needed.

## Non-obvious parsing required

- **id→code resolution:** CBO and CNAE child files reference the parent's autoincrement
  `id`. Each loader builds an `id → code` map per level and resolves the parent code.
- **QBQ occupation mapping:** QBQ files reference `occupation_id` (the CBO occupations
  CSV id), so `03-load-qbq.ts` reads `5_occupations.csv` to map `occupation_id → 6-digit
  code`. Result: **0 orphan rows**.
- **CNAE 4_class.csv:** Latin-1; every physical line is its own quoted, `;;`-terminated
  fragment, and labels with internal line breaks are split across two such fragments.
  Detection is semantic: a real record starts with `<id>,<class-code>` (e.g. `121,16.29-3`);
  any other fragment is a continuation of the previous label. Recovered all **673** classes.
- **cnct/cncst:** read as Latin-1 with `;` delimiter; `csv-parse` handles the multiline
  quoted fields.
- **ppg.csv:** read with `comment: "#"` so the export-date comment line is skipped.

## Idempotency strategy

- CBO/CNAE: `upsert` by `code` (the `@id`) via `upsertByCode` in `_lib.ts` — re-running
  updates in place, no duplicates.
- QBQ + Course: no natural key → **clear-and-reinsert** (`deleteMany` then batched
  `createMany`). Verified: running `etl:static` twice leaves identical counts.

## Schema change to existing models

`CboOccupation` declares the reverse relations `favoritedBy` and `careerPlans`, so the
forward relation was added to `FavoriteProfession` (`occupation`, required) and
`CareerPlan` (`occupation`, optional). Additive only; both tables were empty.
Migration: `20260615140330_phase05_static_data`.

## CNAE code format (note for Phase 06)

Codes are stored as they appear in the files (e.g. class `10.69-4`, subclass `0111-3/01`).
If Phase 06 (RAIS/CAGED) needs digit-only codes to join, normalize at that point.

## Final loaded counts

- CboOccupation: **2,725** · CnaeSubclass: **1,331**
- QbqKnowledge: **146,607** · QbqSkill: **104,311** · QbqAttitude: **7,189**
- Course: **7,659** total → graduate 2,558 · postgraduate 4,733 · technical 215 · technological 153

### Files added
- `scripts/etl/_lib.ts`, `01-load-cbo.ts`, `02-load-cnae.ts`, `03-load-qbq.ts`,
  `04-load-courses.ts`, `run-all-static.ts`

### Files changed
- `prisma/schema.prisma` (15 new models + 2 relations), `package.json` (etl scripts),
  `package-lock.json` (tsx, csv-parse)
