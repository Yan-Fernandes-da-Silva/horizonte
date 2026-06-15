# 011 — June 2026 — Phase 08: Labor Market

> Recorded during Phase 08. Built in the staged way the phase asked: 8A design +
> decisions, 8B dashboard with mock data, 8C real MarketMetrics queries.

---

## Decisions approved by Yan (8A)

1. **Brazil map = tile cartogram** (UF tiles grouped by region, colored by metric,
   clickable). An accurate geographic SVG can't be produced offline reliably, and the
   cartogram is robust, responsive and on-brand. (A real GeoJSON map was offered as the
   alternative if Yan ever wants it.)
2. **Profile "age-sex pyramid" = approximate.** RAIS stores age and sex as *separate*
   distributions (no age×sex cross-tab), so each age band is split by the overall M/F
   ratio. The chart is labeled as an estimate.
3. **Skills (QBQ by CNAE division) = deferred entirely.** There is no occupation↔CNAE
   link in the DB, so the planned word-cloud page isn't feasible without more ETL.

Also deferred (not blocking): the comparison modal (bonus). URLs use the plain 6-digit
CBO code (e.g. `/labor-market/212405`), consistent with links from Phases 04/07.

## Architecture

- The dashboard renders entirely from a `DashboardData` object, so 8B (mock) and 8C
  (real) share the exact same shape — only `getDashboardData`'s body changed.
- **Filters** (Região / Estado) live in the URL (`?region=&uf=`). Changing a filter (or
  clicking a map tile) updates the URL; the server re-runs `getDashboardData` for that
  scope. No client storage. Tab state is client-side (Radix Tabs) and survives the
  soft navigation.
- Indicator logic is shared (`indicators.ts`): situation from balance/stock; rotatividade
  and concorrência from **percentiles across all occupations** (computed once per request
  via React `cache()` over `MarketMetrics.groupBy`).

## Data aggregation (8C)

`getDashboardData(code, scope)`:
- Loads all `MarketMetrics` rows for the occupation; merges caged (admissions/dismissals/
  balance) + rais (salary/hours/tenure/stock + JSON distributions) per UF.
- Filters to the scope (Brasil = all 27 UFs, region = its UFs, uf = one), then aggregates:
  stock-weighted averages for salary/hours/tenure; summed JSON distributions for the
  profile charts.
- Indicators: situation = `situationFromBalance(scopeBalance, scopeStock)`; rotatividade =
  percentile of scope tenure vs national (inverted — low tenure ⇒ high turnover);
  concorrência = percentile of stock/admissions ratio vs national.
- `hasData=false` when the occupation has no MarketMetrics → page shows "Dados não
  disponíveis".

## Files

- Logic: `src/lib/labor-market/{types,geo,format,indicators,data}.ts`
- API: `src/app/api/labor-market/search/route.ts` (favorite reuses the existing `/api/favorites`)
- Pages: `src/app/(dashboard)/labor-market/{page,[code]/page}.tsx`
- Components: `src/components/features/labor-market/` — `OccupationSearch`, `FilterBar`,
  `OccupationDashboard`, `BrazilTileMap`, `SalaryTable`, `MetricCard`, `tabs/*`, `charts/*`.

## Verification

Screenshot-verified end to end (Edge headless): search + favorites, all 4 tabs, real
tab switching, and a UF filter. With real data, *Analista de desenvolvimento de sistemas*
showed avg salary R$ 10.987 (Brasil) → R$ 11.154 when filtered to SP — matching the
Phase 06 SP figure (R$ 11.153,99). `tsc`, `next lint`, `next build` all pass.

## Follow-ups

- Indicator thresholds (situation ratio bands, percentile cutoffs) are heuristic and easy
  to tune in `indicators.ts`.
- National tenure reference uses an unweighted per-occupation average (groupBy `_avg`),
  a reasonable approximation for percentile ranking.
- CNAE-division skills page and the comparison modal remain as future work.
