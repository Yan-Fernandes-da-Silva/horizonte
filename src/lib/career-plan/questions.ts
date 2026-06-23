// Career plan — the 6 SMART questions (data-driven, like the vocational test).
// Edit here to change the questionnaire; the form and the AI prompt read from this.

export type SmartQuestionType = "single" | "multi";

export interface SmartOption {
  value: string;
  label: string;
}

export interface SmartQuestion {
  id: string;
  type: SmartQuestionType;
  text: string;
  /** Short label used when building the AI prompt. */
  promptLabel: string;
  options: SmartOption[];
  maxSelections?: number;
}

// Order matters — this is exactly the order shown in the questionnaire (P1..P7).
export const SMART_QUESTIONS: SmartQuestion[] = [
  {
    id: "moment",
    type: "single",
    promptLabel: "Momento profissional",
    text: "Em que momento da sua trajetória profissional você está?",
    options: [
      { value: "estudante", label: "Estudante" },
      { value: "primeiro_emprego", label: "Buscando o primeiro emprego" },
      { value: "empregado_crescer", label: "Empregado, querendo crescer" },
      { value: "transicao", label: "Em transição de carreira" },
      { value: "recomecando", label: "Recomeçando" },
      { value: "empreendendo", label: "Empreendendo" },
    ],
  },
  {
    id: "goal",
    type: "single",
    promptLabel: "Principal objetivo",
    text: "O que você mais busca em uma nova carreira?",
    options: [
      { value: "proposito", label: "Mais satisfação / propósito" },
      { value: "dinheiro", label: "Mais dinheiro" },
      { value: "estabilidade", label: "Mais estabilidade" },
      { value: "flexibilidade", label: "Mais flexibilidade (horário / remoto)" },
      { value: "crescimento", label: "Crescimento rápido" },
      { value: "autonomia", label: "Mais autonomia" },
    ],
  },
  {
    id: "qualification",
    type: "single",
    promptLabel: "Disposição para qualificação",
    text: "O quanto você está disposto a estudar / se qualificar?",
    options: [
      { value: "curso_rapido", label: "Cursos rápidos / livres" },
      { value: "tecnico", label: "Curso técnico" },
      { value: "graduacao", label: "Graduação" },
      { value: "pos", label: "Pós-graduação" },
    ],
  },
  {
    id: "time_per_week",
    type: "single",
    promptLabel: "Tempo disponível por semana",
    text: "Quanto tempo você tem disponível por semana para se dedicar?",
    options: [
      { value: "lt2", label: "Menos de 2h" },
      { value: "2a5", label: "2 a 5h" },
      { value: "5a10", label: "5 a 10h" },
      { value: "gt10", label: "Mais de 10h" },
    ],
  },
  {
    id: "objective_deadline",
    type: "single",
    promptLabel: "Prazo do objetivo",
    text: "Em quanto tempo deseja alcançar seu próximo objetivo de carreira?",
    options: [
      { value: "6m", label: "6 meses" },
      { value: "1a", label: "1 ano" },
      { value: "1a3", label: "1 a 3 anos" },
      { value: "3a5", label: "3 a 5 anos" },
      { value: "5a", label: "5 anos ou mais" },
    ],
  },
  {
    id: "obstacles",
    type: "multi",
    maxSelections: 2,
    promptLabel: "Principais obstáculos",
    text: "Quais são os principais obstáculos que você enfrenta? (até 2)",
    options: [
      { value: "experiencia", label: "Falta de experiência" },
      { value: "qualificacao", label: "Falta de qualificação" },
      { value: "indecisao", label: "Indecisão sobre o caminho" },
      { value: "mercado", label: "Mercado difícil" },
      { value: "tempo", label: "Falta de tempo" },
      { value: "financeiro", label: "Questões financeiras" },
      { value: "rede", label: "Falta de rede de contatos" },
    ],
  },
  {
    id: "situation",
    type: "single",
    promptLabel: "Situação atual",
    text: "Qual frase descreve melhor sua situação atual?",
    options: [
      { value: "sei_preciso_plano", label: "Sei o que quero, preciso de um plano" },
      { value: "ideias_indeciso", label: "Tenho algumas ideias, mas estou indeciso" },
      { value: "nao_sei_comecar", label: "Não sei por onde começar" },
      { value: "mudar_area", label: "Quero mudar de área completamente" },
      { value: "crescer_onde_estou", label: "Quero crescer onde já estou" },
    ],
  },
];

export type SmartAnswers = Record<string, string | string[]>;

/** Resolve a stored answer value (or values) to human label(s) for prompt/display. */
export function answerLabels(questionId: string, value: string | string[] | undefined): string {
  const q = SMART_QUESTIONS.find((x) => x.id === questionId);
  if (!q || value == null) return "—";
  const values = Array.isArray(value) ? value : [value];
  return values.map((v) => q.options.find((o) => o.value === v)?.label ?? v).join(", ") || "—";
}
