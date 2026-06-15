// Labor market — formatting + indicator presentation helpers.
import type { Level, MarketSituation } from "./types";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const BRL2 = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const NUM = new Intl.NumberFormat("pt-BR");

export const fmtBRL = (v: number | null | undefined) => (v == null ? "—" : BRL.format(v));
export const fmtBRL2 = (v: number | null | undefined) => (v == null ? "—" : BRL2.format(v));
export const fmtNum = (v: number | null | undefined) => (v == null ? "—" : NUM.format(v));

/** Approx. hourly rate from a monthly salary and weekly hours (4.33 weeks/month). */
export function hourlyRate(monthly: number | null, weeklyHours: number | null): number | null {
  if (!monthly || !weeklyHours) return null;
  return monthly / (weeklyHours * 4.33);
}

// Ordered scales used by the gauge and badges.
export const SITUATION_STEPS: MarketSituation[] = ["Queda", "Retração", "Equilibrado", "Crescendo", "Aquecido"];

export const SITUATION_COLOR: Record<MarketSituation, string> = {
  Queda: "#E76F51",
  Retração: "#F4A261",
  Equilibrado: "#64748B",
  Crescendo: "#00B4D8",
  Aquecido: "#10B981",
};

export const LEVEL_COLOR: Record<Level, string> = {
  Alta: "#E76F51",
  Moderada: "#F4A261",
  Baixa: "#10B981",
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
