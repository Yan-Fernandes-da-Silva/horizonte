// Vocational test — RIASEC ↔ CBO mapping (static, easy to tune).
// Each RIASEC type maps to a list of CBO code prefixes (grande grupo / subgrupo)
// most associated with it. Occupation compatibility is scored by how strongly an
// occupation's 6-digit code matches the user's top RIASEC types (weighted by rank).
import type { RiasecType } from "./types";

/** CBO code prefixes associated with each RIASEC type. */
export const RIASEC_CBO_PREFIXES: Record<RiasecType, string[]> = {
  // Realista — hands-on, industrial, agro, maintenance, security.
  R: ["6", "7", "8", "9", "0"],
  // Investigativo — sciences, research, engineering, technical analysis.
  I: ["20", "21", "30", "31", "39", "2011", "2012"],
  // Artístico — arts, design, communication, culture.
  A: ["26", "37"],
  // Social — teaching, health care, social and personal services.
  S: ["22", "23", "24", "32", "51"],
  // Empreendedor — leadership, management, sales, business.
  E: ["1", "35", "52"],
  // Convencional — administrative, finance, records, systems.
  C: ["4", "41", "42"],
};

/** GOPC interest areas (G8 values) → CBO code prefixes, used as a soft boost. */
export const INTEREST_CBO_PREFIXES: Record<string, string[]> = {
  tecnologia: ["212", "317", "21"],
  saude: ["22", "32", "5151", "5152"],
  educacao: ["23", "24", "331", "332"],
  negocios: ["1", "35", "2521", "2522"],
  artes: ["26", "37"],
  industria: ["6", "7", "8", "9"],
  meio_ambiente: ["6", "221", "2211"],
  servico_publico: ["1", "11", "0", "41"],
};

const RANK_WEIGHTS = [3, 2, 1]; // weight for the 1st, 2nd, 3rd dominant type

function matchesAnyPrefix(code: string, prefixes: string[]): boolean {
  return prefixes.some((p) => code.startsWith(p));
}

/**
 * Score how compatible an occupation code is with the user's profile.
 * `topCodes` are the top-3 RIASEC types (most → least dominant);
 * `interests` are the selected G8 interest-area values (optional soft boost).
 */
export function occupationCompatibility(
  code: string,
  topCodes: RiasecType[],
  interests: string[] = []
): number {
  let score = 0;
  topCodes.forEach((type, i) => {
    if (matchesAnyPrefix(code, RIASEC_CBO_PREFIXES[type])) {
      score += RANK_WEIGHTS[i] ?? 1;
    }
  });
  // Soft boost when the occupation falls in an area the user said interests them.
  for (const interest of interests) {
    const prefixes = INTEREST_CBO_PREFIXES[interest];
    if (prefixes && matchesAnyPrefix(code, prefixes)) {
      score += 1;
      break; // at most one interest boost per occupation
    }
  }
  return score;
}
