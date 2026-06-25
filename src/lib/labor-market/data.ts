// Labor market — data access (Phase 8C: real queries against MarketMetrics).
// getDashboardData aggregates per-UF caged + rais rows for an occupation into the
// scope (Brasil / region / UF) the user selected, and derives the indicators using
// percentiles computed across ALL occupations (cached once per request).
import { cache } from "react";

import { db } from "@/lib/db";
import { REGION_OF_UF, UF_NAMES, regionLabel } from "./geo";
import { disputaLabel, levelFromPercentile, situationFromBalance } from "./indicators";
import { DEFAULT_PERIOD } from "./periods";
import type { DashboardData, Distribution, Scope, StateMetric } from "./types";

// ── Real DB lookups (search + title) ───────────────────────────────────────────

export interface OccupationHit {
  code: string;
  title: string;
}

export async function searchOccupations(query: string, limit = 12): Promise<OccupationHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const digits = q.replace(/\D/g, "");
  const rows = await db.cboOccupation.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        ...(digits ? [{ code: { startsWith: digits } }] : []),
      ],
    },
    select: { code: true, title: true },
    take: limit,
    orderBy: { title: "asc" },
  });
  return rows;
}

export async function getOccupationTitle(code: string): Promise<string | null> {
  const occ = await db.cboOccupation.findUnique({ where: { code }, select: { title: true } });
  return occ?.title ?? null;
}

// ── Reference distributions across all occupations (for percentile indicators) ──

const getReference = cache(async (period: string) => {
  const [rais, caged] = await Promise.all([
    db.marketMetrics.groupBy({
      by: ["occupationCode"],
      where: { source: "rais" },
      _sum: { stockTotal: true },
      _avg: { avgTenureMonths: true },
    }),
    db.marketMetrics.groupBy({
      by: ["occupationCode"],
      where: { source: "caged", period },
      _sum: { admissions: true },
    }),
  ]);

  const admByOcc = new Map(caged.map((c) => [c.occupationCode, c._sum.admissions ?? 0]));
  const tenures: number[] = [];
  const ratios: number[] = [];
  for (const r of rais) {
    const tenure = r._avg.avgTenureMonths ?? 0;
    if (tenure > 0) tenures.push(tenure);
    const stock = r._sum.stockTotal ?? 0;
    const adm = admByOcc.get(r.occupationCode) ?? 0;
    if (stock > 0 && adm > 0) ratios.push(stock / adm);
  }
  tenures.sort((a, b) => a - b);
  ratios.sort((a, b) => a - b);
  return { tenures, ratios };
});

/** Fraction of values ≤ `value` (0..1). Neutral 0.5 when unknown. */
function percentileRank(sortedAsc: number[], value: number | null): number {
  if (value == null || sortedAsc.length === 0) return 0.5;
  let count = 0;
  for (const v of sortedAsc) {
    if (v <= value) count++;
    else break;
  }
  return count / sortedAsc.length;
}

// ── Helpers ─────────────────────────────────────────────────────────────────--

function addDistribution(acc: Map<string, number>, json: unknown) {
  if (json && typeof json === "object") {
    for (const [k, v] of Object.entries(json as Record<string, number>)) {
      acc.set(k, (acc.get(k) ?? 0) + (Number(v) || 0));
    }
  }
}
const toArray = (m: Map<string, number>): Distribution[] =>
  Array.from(m, ([label, value]) => ({ label, value }));
const topLabel = (m: Map<string, number>): string | null =>
  Array.from(m).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

function inScope(uf: string, scope: Scope): boolean {
  if (scope.uf) return uf === scope.uf;
  if (scope.region) return REGION_OF_UF[uf] === scope.region;
  return true;
}

function scopeLabel(scope: Scope): string {
  if (scope.uf) return UF_NAMES[scope.uf] ?? scope.uf;
  if (scope.region) return regionLabel(scope.region);
  return "Brasil";
}

// ── Main ────────────────────────────────────────────────────────────────────--

export async function getDashboardData(code: string, scope: Scope): Promise<DashboardData> {
  // CAGED is monthly: show only the selected period. RAIS is annual and period-agnostic.
  const period = scope.period ?? DEFAULT_PERIOD;
  const [title, rows, reference] = await Promise.all([
    getOccupationTitle(code),
    db.marketMetrics.findMany({
      where: {
        occupationCode: code,
        OR: [{ source: "rais" }, { source: "caged", period }],
      },
    }),
    getReference(period),
  ]);

  const hasData = rows.length > 0;

  // Merge caged + rais per UF.
  const byUf = new Map<string, StateMetric>();
  const ensure = (uf: string): StateMetric => {
    let s = byUf.get(uf);
    if (!s) {
      s = { uf, region: REGION_OF_UF[uf] ?? "", admissions: 0, dismissals: 0, balance: 0, avgSalary: null, stockTotal: 0 };
      byUf.set(uf, s);
    }
    return s;
  };
  for (const r of rows) {
    const s = ensure(r.uf);
    if (r.source === "caged") {
      s.admissions += r.admissions ?? 0;
      s.dismissals += r.dismissals ?? 0;
      s.balance += r.balance ?? 0;
    } else if (r.source === "rais") {
      s.avgSalary = r.avgSalary ?? s.avgSalary;
      s.stockTotal += r.stockTotal ?? 0;
    }
  }

  const states = Array.from(byUf.values()).filter((s) => inScope(s.uf, scope));
  const scopeUfs = new Set(states.map((s) => s.uf));
  const scopeRais = rows.filter((r) => r.source === "rais" && scopeUfs.has(r.uf));

  // Scope totals.
  const totalAdmissions = states.reduce((a, s) => a + s.admissions, 0);
  const totalDismissals = states.reduce((a, s) => a + s.dismissals, 0);
  const totalBalance = totalAdmissions - totalDismissals;
  const totalStock = states.reduce((a, s) => a + s.stockTotal, 0);

  // Stock-weighted averages over the scope's rais rows.
  let wSum = 0, salSum = 0, hourSum = 0, tenSum = 0;
  const age = new Map<string, number>(), sex = new Map<string, number>(),
    edu = new Map<string, number>(), race = new Map<string, number>();
  let disability = 0;
  for (const r of scopeRais) {
    const w = r.stockTotal ?? 0;
    wSum += w;
    if (r.avgSalary != null) salSum += r.avgSalary * w;
    if (r.avgWeeklyHours != null) hourSum += r.avgWeeklyHours * w;
    if (r.avgTenureMonths != null) tenSum += r.avgTenureMonths * w;
    addDistribution(age, r.ageDistribution);
    addDistribution(sex, r.sexDistribution);
    addDistribution(edu, r.educationDistribution);
    addDistribution(race, r.raceDistribution);
    disability += r.disabilityCount ?? 0;
  }
  const avgSalary = wSum ? Math.round(salSum / wSum) : null;
  const avgWeeklyHours = wSum ? Math.round((hourSum / wSum) * 10) / 10 : null;
  const avgTenureMonths = wSum ? Math.round(tenSum / wSum) : null;

  // Indicators (scope value vs national reference percentile).
  const tenurePct = percentileRank(reference.tenures, avgTenureMonths);
  const ratio = totalStock > 0 && totalAdmissions > 0 ? totalStock / totalAdmissions : null;
  const ratioPct = percentileRank(reference.ratios, ratio);

  const sortedByAdm = [...states].sort((a, b) => b.admissions - a.admissions);

  return {
    code,
    title: title ?? "Profissão",
    hasData,
    scopeLabel: scopeLabel(scope),
    overview: {
      situation: situationFromBalance(totalBalance, totalStock || 1),
      rotatividade: levelFromPercentile(tenurePct, true), // low tenure → high turnover
      concorrencia: levelFromPercentile(ratioPct), // many incumbents per opening → high competition
      topAdmissionState: sortedByAdm[0]?.uf ?? null,
      bottomAdmissionState: sortedByAdm[sortedByAdm.length - 1]?.uf ?? null,
      avgSalary,
      avgWeeklyHours,
      avgTenureMonths,
      predominantSex: topLabel(sex),
      predominantEducation: topLabel(edu),
      modalAgeRange: topLabel(age),
    },
    market: {
      admissions: totalAdmissions,
      dismissals: totalDismissals,
      balance: totalBalance,
      disputa: disputaLabel(totalStock, totalAdmissions),
      byState: states,
    },
    salary: {
      avgSalary,
      hourlyRate: avgSalary && avgWeeklyHours ? avgSalary / (avgWeeklyHours * 4.33) : null,
      avgWeeklyHours,
      avgTenureMonths,
      byState: states.map((s) => ({ uf: s.uf, avgSalary: s.avgSalary })),
    },
    profile: {
      age: toArray(age),
      sex: toArray(sex),
      education: toArray(edu),
      race: toArray(race),
      disabilityCount: disability,
      totalStock,
    },
  };
}
