// Labor market — formatting + indicator presentation helpers.
import type { Level, MarketSituation } from "./types";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const BRL2 = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const NUM = new Intl.NumberFormat("pt-BR");

export const fmtBRL = (v: number | null | undefined) => (v == null ? "—" : BRL.format(v));
export const fmtBRL2 = (v: number | null | undefined) => (v == null ? "—" : BRL2.format(v));
export const fmtNum = (v: number | null | undefined) => (v == null ? "—" : NUM.format(v));

/**
 * Monochromatic ocean spectrum (light sky → deep ocean/header color), t in [0,1].
 * Used to color maps and profile charts as a single-hue scale.
 */
export function oceanColor(t: number): string {
  const a = [144, 224, 239]; // #90E0EF (light)
  const b = [10, 35, 66]; // #0A2342 (ocean — header/footer)
  const k = Math.max(0, Math.min(1, t));
  const c = a.map((x, i) => Math.round(x + (b[i] - x) * k));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/** N evenly-spaced colors along the ocean spectrum (for categorical charts). */
export function oceanShades(n: number): string[] {
  if (n <= 1) return [oceanColor(0.5)];
  return Array.from({ length: n }, (_, i) => oceanColor(i / (n - 1)));
}

/** Approx. hourly rate from a monthly salary and weekly hours (4.33 weeks/month). */
export function hourlyRate(monthly: number | null, weeklyHours: number | null): number | null {
  if (!monthly || !weeklyHours) return null;
  return monthly / (weeklyHours * 4.33);
}

// Ordered scales used by the gauge and badges.
export const SITUATION_STEPS: MarketSituation[] = ["Queda", "Retração", "Equilibrado", "Crescendo", "Aquecido"];

// Situation scale, left→right: red → orange → yellow → light green → dark green.
export const SITUATION_COLOR: Record<MarketSituation, string> = {
  Queda: "#DC2626",
  Retração: "#F97316",
  Equilibrado: "#EAB308",
  Crescendo: "#4ADE80",
  Aquecido: "#16A34A",
};

// Strong green / yellow / red for the level badges.
export const LEVEL_COLOR: Record<Level, string> = {
  Alta: "#DC2626",
  Moderada: "#EAB308",
  Baixa: "#16A34A",
};

export const SITUATION_HINT: Record<MarketSituation, string> = {
  Queda: "Mais desligamentos do que admissões — mercado encolhendo no período.",
  Retração: "Saldo levemente negativo: contratações abaixo das saídas.",
  Equilibrado: "Admissões e desligamentos praticamente em equilíbrio.",
  Crescendo: "Saldo positivo: mais contratações do que desligamentos.",
  Aquecido: "Forte saldo positivo — mercado em expansão no período.",
};

export const ROTATIVIDADE_HINT: Record<Level, string> = {
  Alta: "Tempo médio de emprego baixo — muita entrada e saída de profissionais.",
  Moderada: "Permanência intermediária no emprego.",
  Baixa: "Profissionais tendem a permanecer mais tempo no emprego.",
};

export const CONCORRENCIA_HINT: Record<Level, string> = {
  Alta: "Muitos profissionais para as vagas abertas — disputa maior.",
  Moderada: "Equilíbrio entre profissionais e vagas.",
  Baixa: "Poucos profissionais frente às vagas — disputa menor.",
};
