// Labor market — indicator derivation. Shared by the mock (8B) and the real
// queries (8C) so the UI logic is identical; only the inputs differ.
import type { Level, MarketSituation, StateMetric } from "./types";

/** Market situation from net balance relative to the active stock. */
export function situationFromBalance(balance: number, stock: number): MarketSituation {
  if (!stock) return "Equilibrado";
  const ratio = balance / stock;
  if (ratio <= -0.02) return "Queda";
  if (ratio < -0.005) return "Retração";
  if (ratio <= 0.005) return "Equilibrado";
  if (ratio < 0.02) return "Crescendo";
  return "Aquecido";
}

/** Map a 0..1 percentile to a 3-level label (optionally inverted). */
export function levelFromPercentile(p: number, invert = false): Level {
  const x = invert ? 1 - p : p;
  if (x >= 0.66) return "Alta";
  if (x >= 0.33) return "Moderada";
  return "Baixa";
}

/** Sum a list of StateMetric into national/region/state totals. */
export function aggregateStates(states: StateMetric[]) {
  return states.reduce(
    (acc, s) => {
      acc.admissions += s.admissions;
      acc.dismissals += s.dismissals;
      acc.balance += s.balance;
      acc.stockTotal += s.stockTotal;
      return acc;
    },
    { admissions: 0, dismissals: 0, balance: 0, stockTotal: 0 }
  );
}

/** Stock vs admissions → a rough "competition" pressure used for the disputa label. */
export function disputaLabel(stock: number, admissions: number): string {
  if (!stock || !admissions) return "Sem dados suficientes";
  const ratio = stock / admissions; // incumbents per opening
  if (ratio >= 30) return "Bastante disputado";
  if (ratio >= 10) return "Levemente disputado";
  return "Pouco disputado";
}
