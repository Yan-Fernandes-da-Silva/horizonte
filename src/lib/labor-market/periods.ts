// CAGED periods (monthly movement data) available in the database, newest last.
// To add a new month: extract its files into data/caged/<YYYYMM>/, run
// `npm run etl:caged`, and add one entry here. DEFAULT_PERIOD tracks the latest.

export interface PeriodOption {
  value: string; // YYYYMM
  label: string; // "Abril/2026"
}

export const CAGED_PERIODS: PeriodOption[] = [
  { value: "202601", label: "Janeiro/2026" },
  { value: "202602", label: "Fevereiro/2026" },
  { value: "202603", label: "Março/2026" },
  { value: "202604", label: "Abril/2026" },
];

/** Most recent period — the default view. */
export const DEFAULT_PERIOD = CAGED_PERIODS[CAGED_PERIODS.length - 1].value;

const PERIOD_VALUES = new Set(CAGED_PERIODS.map((p) => p.value));

/** Validate a raw query-string value, falling back to the latest period. */
export function resolvePeriod(raw: string | undefined): string {
  return raw && PERIOD_VALUES.has(raw) ? raw : DEFAULT_PERIOD;
}

export function periodLabel(value: string): string {
  return CAGED_PERIODS.find((p) => p.value === value)?.label ?? value;
}
