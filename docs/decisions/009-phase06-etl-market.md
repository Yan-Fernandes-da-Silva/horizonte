# 009 — June 2026 — Phase 06: Market-Data ETL (CAGED + RAIS)

> Recorded during Phase 06. Documents the inspection findings, Yan's decisions, and
> the aggregate-only strategy used to load market metrics from huge government files.

---

## Inspection findings (files differ from the phase doc)

| File | Separator | Encoding | Size | Notes |
|---|---|---|---|---|
| CAGEDMOV202604.txt | `;` | **UTF-8** (not Latin-1) | 443 MB | already extracted |
| CAGEDEXC202604.txt | `;` | UTF-8 | 1 MB | cancellations (same layout + extra cols) |
| RAIS_VINC_PUB_*.COMT | `,` | **Latin-1** | ~25 GB total | already extracted from .7z |

Key discoveries that changed the implementation:
- **CAGEDMOV has no `indicadordeexclusão` column** — exclusions live in the separate
  CAGEDEXC file.
- **CAGED `região` column is unreliable** (SP came tagged `região=3`). UF and region are
  instead **derived from the IBGE UF code** (1x→N, 2x→NE, 3x→SE, 4x→S, 5x→CO).
- **RAIS has no UF column** — UF is derived from the first 2 digits of `Município - Código`.
- Decimals differ: CAGED uses comma (`1654,62`), RAIS uses dot (`1637.69`).
- 7-Zip was **not** needed — all archives were already extracted.

## Decisions approved by Yan

1. **CAGED saldo = MOV − EXC.** Admissions/dismissals counted from CAGEDMOV, then the
   same counts from CAGEDEXC are subtracted (cancellations). Negatives clamped to 0.
   (CAGEDFOR/late declarations are not included, keeping the 202604 snapshot clean.)
2. **RAIS = active bonds only** (`Ind Vínculo Ativo 31/12 = 1`) for the stock, averages
   and distributions — the standard RAIS "estoque" and more representative salaries.

## Strategy: aggregate-only, streamed

Both loaders stream line by line (`streamRecords` in `_lib.ts`, built on `csv-parse`
streaming) and keep only per-(occupation × UF) aggregates in memory (~tens of thousands
of groups). **No raw rows are stored.** Rows whose CBO isn't in the seeded
`CboOccupation` set, or whose município/UF can't be resolved, are skipped and counted.

- CAGED → admissions, dismissals, balance (`source='caged'`, period `202604`).
- RAIS → avgSalary, avgWeeklyHours, avgTenureMonths, stockTotal, and JSON distributions
  for age/sex/education/race + disabilityCount (`source='rais'`, period `2025`).

Code→label maps for sex/race/education/age-range live in `_lib.ts`.

## Idempotency

`MarketMetrics` has no natural key, so each loader does **delete-by-source then
createMany**. Verified: re-running CAGED keeps the row count at 33,205 (no duplicates).
RAIS uses the identical pattern.

## Results (verified for sanity)

- **MarketMetrics**: 33,205 caged rows (2,473 occupations) + 55,139 rais rows (2,657
  occupations) — far above the 200+ acceptance threshold.
- RAIS processed ~59.6M active bonds across all 7 regional files; ~1.07M rows (~1.2%)
  skipped for invalid CBO/UF (includes the masked NI file).
- Spot checks (RAIS, SP):
  - *Analista de desenvolvimento de sistemas* (212405): avg salary R$ 11,153.99, stock
    147,112, mostly higher-education, male-skewed — realistic.
  - *Faxineiro* (514320): avg salary R$ 1,997.56, stock 659,943 — the salary contrast
    confirms the pipeline maps occupations correctly.

## Site-flow verification

After the schema/data changes, the full public→auth flow was screenshot-verified
(Edge headless via CDP): landing, login, and the home dashboard in both empty (all
"State A") and populated states (favorites now use real CBO codes via the new FK).
Nothing regressed.

## Performance note

Reading ~25 GB of RAIS takes several minutes (run in the background). CAGED is ~30–60s.
Runner is `tsx` (consistent with Phase 05). Scripts: `npm run etl:caged | etl:rais |
etl:market` (+ `etl:inspect-caged` / `etl:inspect-rais` diagnostics).
