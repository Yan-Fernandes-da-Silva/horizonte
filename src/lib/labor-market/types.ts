// Labor market — shared view types. The dashboard renders entirely from a
// DashboardData object so 8B (mock) and 8C (real queries) share the same shape.

export type MarketSituation = "Queda" | "Retração" | "Equilibrado" | "Crescendo" | "Aquecido";
export type Level = "Alta" | "Moderada" | "Baixa";

export interface Distribution {
  label: string;
  value: number;
}

export interface StateMetric {
  uf: string;
  region: string;
  admissions: number;
  dismissals: number;
  balance: number;
  avgSalary: number | null;
  stockTotal: number;
}

export interface OverviewMetrics {
  situation: MarketSituation;
  rotatividade: Level;
  concorrencia: Level;
  topAdmissionState: string | null;
  bottomAdmissionState: string | null;
  avgSalary: number | null;
  avgWeeklyHours: number | null;
  avgTenureMonths: number | null;
  predominantSex: string | null;
  predominantEducation: string | null;
  modalAgeRange: string | null;
}

export interface MarketView {
  admissions: number;
  dismissals: number;
  balance: number;
  disputa: string; // "Bastante disputado" | "Levemente disputado" | "Equilibrado"
  byState: StateMetric[];
}

export interface SalaryView {
  avgSalary: number | null;
  hourlyRate: number | null;
  avgWeeklyHours: number | null;
  avgTenureMonths: number | null;
  byState: { uf: string; avgSalary: number | null }[];
}

export interface ProfileView {
  age: Distribution[];
  sex: Distribution[];
  education: Distribution[];
  race: Distribution[];
  disabilityCount: number;
  totalStock: number;
}

export interface DashboardData {
  code: string;
  title: string;
  hasData: boolean;
  scopeLabel: string; // "Brasil" | "Sudeste" | "São Paulo"
  overview: OverviewMetrics;
  market: MarketView;
  salary: SalaryView;
  profile: ProfileView;
}

/** Resolved filter scope from the URL (?region=&uf=&period=). */
export interface Scope {
  region?: string;
  uf?: string;
  period?: string; // YYYYMM — selects which CAGED month to show (RAIS is annual, unaffected)
}
