// Vocational test — scoring engine (pure, no I/O).
// Driven entirely by the question metadata in questions.ts: RIASEC/MI scores are
// summed from each question's `riasecType`/`miType`, so adding a question is picked
// up automatically. GOPC/personal answers are kept as raw values (the results page
// maps them to labels; the matching engine uses them as filters).
import { QUESTIONS, RIASEC_NAMES, MI_NAMES } from "./questions";
import type {
  AnswerValue, MiType, Responses, RiasecType, TestResults,
} from "./types";

const RIASEC_TYPES: RiasecType[] = ["R", "I", "A", "S", "E", "C"];
const MI_TYPES: MiType[] = [
  "linguistica", "logica", "espacial", "musical", "corporal", "naturalista", "interpessoal", "intrapessoal",
];

const VISUAL_BONUS = 10; // points added to the RIASEC type picked in the visual question

// Scored question types and their max points (the denominator per question).
//   tier (RIASEC)     → 0..4
//   like_dislike (MI) → dislike 0 / neutral 1 / like 3
//   likert (legacy)   → 1..5
const MAX_POINTS: Record<string, number> = { tier: 4, like_dislike: 3, likert: 5 };
const SCORED_TYPES = new Set(Object.keys(MAX_POINTS));

/** Convert a stored answer into points, given the question type. */
function pointValue(value: AnswerValue | undefined, type: string): number | null {
  if (value == null) return null;
  if (type === "like_dislike") {
    if (value === "like") return 3;
    if (value === "neutral") return 1;
    if (value === "dislike") return 0;
    return null;
  }
  // tier / likert are numeric.
  if (typeof value === "number") return value;
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? n : null;
}

function scoreDimension(
  responses: Responses,
  keyOf: (qId: string) => string | undefined
): Record<string, number> {
  const raw: Record<string, number> = {};
  const max: Record<string, number> = {};
  for (const q of QUESTIONS) {
    const dim = keyOf(q.id);
    if (!dim) continue;
    if (!SCORED_TYPES.has(q.type)) continue;
    const weight = q.weight ?? 1;
    max[dim] = (max[dim] ?? 0) + MAX_POINTS[q.type] * weight;
    const v = pointValue(responses[q.id], q.type);
    if (v != null) raw[dim] = (raw[dim] ?? 0) + v * weight;
  }
  const out: Record<string, number> = {};
  for (const dim of Object.keys(max)) {
    out[dim] = max[dim] > 0 ? Math.round((raw[dim] ?? 0) / max[dim] * 100) : 0;
  }
  return out;
}

const byMetadata =
  (field: "riasecType" | "miType") =>
  (qId: string): string | undefined =>
    QUESTIONS.find((q) => q.id === qId)?.[field];

function topThree(scores: Record<string, number>, names: Record<string, string>): string[] {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => names[key] ?? key);
}

/** Collect raw answer values for a section (used by GOPC/personal). */
function rawAnswersForSection(responses: Responses, section: string): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const q of QUESTIONS) {
    if (q.section !== section) continue;
    const v = responses[q.id];
    if (v == null) continue;
    out[q.id] = Array.isArray(v) ? v : String(v);
  }
  return out;
}

export function calculateResults(responses: Responses): TestResults {
  // RIASEC
  const riasec = scoreDimension(responses, byMetadata("riasecType")) as Record<RiasecType, number>;
  for (const t of RIASEC_TYPES) if (riasec[t] == null) riasec[t] = 0;
  // Visual question bonus (one RIASEC type).
  const visual = responses["RV"];
  if (typeof visual === "string" && RIASEC_TYPES.includes(visual as RiasecType)) {
    const t = visual as RiasecType;
    riasec[t] = Math.min(100, riasec[t] + VISUAL_BONUS);
  }

  // Multiple intelligences
  const mi = scoreDimension(responses, byMetadata("miType")) as Record<MiType, number>;
  for (const t of MI_TYPES) if (mi[t] == null) mi[t] = 0;

  return {
    riasec,
    mi,
    dominantTypes: topThree(riasec, RIASEC_NAMES),
    dominantMi: topThree(mi, MI_NAMES),
    gopc: rawAnswersForSection(responses, "gopc"),
    personal: rawAnswersForSection(responses, "personal"),
    completedAt: new Date().toISOString(),
  };
}

/** Top RIASEC codes (e.g. ["I","A","S"]) — used by the occupation matcher. */
export function topRiasecCodes(riasec: Record<RiasecType, number>, n = 3): RiasecType[] {
  return (Object.entries(riasec) as [RiasecType, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([k]) => k);
}
