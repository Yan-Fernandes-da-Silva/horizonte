// Vocational test — shared types. The whole feature is data-driven from the
// question bank (questions.ts); adding/editing a question here flows into the UI
// and the scoring engine automatically.

export type SectionId = "riasec" | "mi" | "gopc" | "personal";

export type QuestionType =
  | "likert"
  | "like_dislike"
  | "single_select"
  | "multi_select"
  | "rank"
  | "visual"
  | "tier";

export type RiasecType = "R" | "I" | "A" | "S" | "E" | "C";

export type MiType =
  | "linguistica"
  | "logica"
  | "espacial"
  | "musical"
  | "corporal"
  | "naturalista"
  | "interpessoal"
  | "intrapessoal";

export interface Option {
  value: string;
  label: string;
  /** Lucide icon name — used by the `visual` question cards. */
  icon?: string;
  /** For the `visual` RIASEC question: which type this option maps to. */
  riasecType?: RiasecType;
}

export interface Question {
  id: string;
  section: SectionId;
  type: QuestionType;
  text: string;
  helpText?: string;
  options?: Option[];
  /** RIASEC dimension this question scores (riasec section). */
  riasecType?: RiasecType;
  /** Multiple-intelligence dimension this question scores (mi section). */
  miType?: MiType;
  /** Max selectable options for `multi_select`. */
  maxSelections?: number;
  /** Scoring weight (default 1). */
  weight?: number;
}

export interface SectionMeta {
  id: SectionId;
  label: string;
  description: string;
}

/** A single answer value, shape depends on the question type:
 * likert → 1..5 | like_dislike → "like"|"neutral"|"dislike"
 * single_select/visual → option value | multi_select/rank → option values[] */
export type AnswerValue = number | string | string[];

export type Responses = Record<string, AnswerValue>;

/** Shape persisted in VocationalTestSession.answers (JSON). */
export interface SessionAnswers {
  responses: Responses;
  currentSection: SectionId;
  currentSectionLabel: string;
  progress: number; // 0..100, answered / total
}

/** Shape persisted in VocationalTestSession.results (JSON). */
export interface TestResults {
  riasec: Record<RiasecType, number>; // 0..100 each
  mi: Record<MiType, number>; // 0..100 each
  dominantTypes: string[]; // top-3 RIASEC names in PT (used by the home card)
  dominantMi: string[]; // top-3 intelligence names in PT
  gopc: Record<string, string | string[]>; // categorical labels
  personal: Record<string, string | string[]>;
  completedAt: string;
}
