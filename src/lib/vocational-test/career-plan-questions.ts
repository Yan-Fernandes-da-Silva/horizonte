// ─────────────────────────────────────────────────────────────────────────────
// PARKED questions — intentionally NOT part of the vocational test bank.
//
// These were moved out of the test (per Yan's feedback) and kept here to be
// wired into the Career Plan later, or re-added to a future "Personal" section.
// They are NOT exported into `QUESTIONS`, so they do not affect scoring or the
// progress bar. Re-home them when the Career Plan / Personal section is built.
// ─────────────────────────────────────────────────────────────────────────────
import type { Question } from "./types";

/** Questions destined for the Career Plan (SMART / availability / context). */
export const CAREER_PLAN_QUESTIONS: Question[] = [
  {
    id: "G6", section: "gopc", type: "single_select", text: "Qual é o seu momento de carreira atual?",
    options: [
      { value: "estudante", label: "Estudante" },
      { value: "primeiro_emprego", label: "Buscando o primeiro emprego" },
      { value: "transicao", label: "Em transição de carreira" },
      { value: "crescer", label: "Empregado, querendo crescer" },
      { value: "recomecando", label: "Recomeçando" },
    ],
  },
  {
    id: "G9", section: "gopc", type: "single_select", text: "O quanto você está disposto a estudar / se qualificar?",
    options: [
      { value: "curso_rapido", label: "Cursos rápidos / livres" },
      { value: "tecnico", label: "Curso técnico" },
      { value: "graduacao", label: "Graduação" },
      { value: "pos", label: "Pós-graduação" },
    ],
  },
  {
    id: "P2", section: "personal", type: "multi_select", text: "Quais obstáculos você sente hoje? (marque os que se aplicam)",
    options: [
      { value: "experiencia", label: "Falta de experiência" },
      { value: "qualificacao", label: "Falta de qualificação" },
      { value: "indecisao", label: "Indecisão sobre o caminho" },
      { value: "mercado", label: "Mercado difícil" },
      { value: "tempo", label: "Falta de tempo" },
      { value: "financeiro", label: "Questões financeiras" },
      { value: "orientacao", label: "Falta de orientação" },
    ],
  },
  {
    id: "P3", section: "personal", type: "single_select", text: "Quanto tempo por semana você pode dedicar à sua qualificação?",
    options: [
      { value: "lt2", label: "Menos de 2h" },
      { value: "2a5", label: "2 a 5h" },
      { value: "5a10", label: "5 a 10h" },
      { value: "gt10", label: "Mais de 10h" },
    ],
  },
  {
    id: "P4", section: "personal", type: "single_select", text: "Em quanto tempo deseja alcançar seu próximo objetivo de carreira?",
    options: [
      { value: "6m", label: "6 meses" },
      { value: "1a", label: "1 ano" },
      { value: "2a3", label: "2 a 3 anos" },
      { value: "5a", label: "5 anos ou mais" },
    ],
  },
  {
    id: "P7", section: "personal", type: "rank", text: "Ordene suas prioridades neste momento.",
    options: [
      { value: "ganhar", label: "Ganhar mais" },
      { value: "aprender", label: "Aprender" },
      { value: "estabilidade", label: "Estabilidade" },
      { value: "mudar", label: "Mudar de área" },
      { value: "equilibrio", label: "Equilíbrio" },
    ],
  },
  {
    id: "P8", section: "personal", type: "likert", text: "Tenho clareza sobre o tipo de carreira que quero seguir.",
  },
];

/** Personality statements parked for a future "Personal" section (Yan will revisit). */
export const PERSONAL_DRAFT_QUESTIONS: Question[] = [
  { id: "P1", section: "personal", type: "likert", text: "Sei quais são minhas principais qualidades profissionais." },
  { id: "P5", section: "personal", type: "likert", text: "Estou disposto a sair da minha zona de conforto para crescer." },
  {
    id: "P6", section: "personal", type: "single_select", text: "Como você reage a mudanças?",
    options: [
      { value: "evito", label: "Costumo evitar" },
      { value: "cauteloso", label: "Aceito com cautela" },
      { value: "gosto", label: "Gosto de mudanças" },
      { value: "busco", label: "Busco ativamente" },
    ],
  },
];
