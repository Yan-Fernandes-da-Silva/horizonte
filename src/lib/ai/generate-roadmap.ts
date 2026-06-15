// Career plan — AI roadmap generation via the official Anthropic SDK (server-only).
// Model: claude-haiku-4-5 (Yan's choice — cheapest, enough for this structured task).
// Structured outputs (output_config.format = json_schema) guarantee valid JSON in the
// shape below, so we JSON.parse the single text block and validate defensively.
import Anthropic from "@anthropic-ai/sdk";

import { SMART_QUESTIONS, answerLabels, type SmartAnswers } from "@/lib/career-plan/questions";

export interface RoadmapTask {
  title: string;
  description: string;
  durationLabel: string;
}

export interface Roadmap {
  summary: string;
  startingPoint: string;
  destination: string;
  shortTerm: RoadmapTask[];
  mediumTerm: RoadmapTask[];
  longTerm: RoadmapTask[];
  learningTrails: {
    courses: string[];
    books: string[];
    projects: string[];
    certifications: string[];
  };
  recommendations: {
    networking: string;
    languages: string;
    portfolio: string;
    habits: string;
  };
  futureCareers: string[];
}

export interface RoadmapContext {
  answers: SmartAnswers;
  dominantTypes?: string[];
  occupationTitle?: string;
}

const MODEL = "claude-haiku-4-5";

const SYSTEM_PROMPT = `Você é um especialista em orientação profissional e planeamento de carreira no Brasil. Crie um roadmap personalizado, específico, realista e motivador, considerando o mercado de trabalho brasileiro.
Diretrizes:
- Português do Brasil, tom claro e encorajador.
- Tarefas acionáveis, com prazos realistas e compatíveis com o tempo semanal do usuário.
- Considere o perfil vocacional (RIASEC) e a profissão-alvo, quando fornecidos.
- Curto prazo = 0 a 12 meses; Médio prazo = 1 a 3 anos; Longo prazo = 3+ anos.
- Sugira cursos, livros, projetos práticos e certificações reais e acessíveis (inclua opções gratuitas quando possível).
- As recomendações de networking, idiomas, portfólio e hábitos devem ser práticas.`;

// Raw JSON Schema (no min/max constraints; additionalProperties:false everywhere).
const taskSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    durationLabel: { type: "string" },
  },
  required: ["title", "description", "durationLabel"],
};
const stringArray = { type: "array", items: { type: "string" } };

const ROADMAP_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    startingPoint: { type: "string" },
    destination: { type: "string" },
    shortTerm: { type: "array", items: taskSchema },
    mediumTerm: { type: "array", items: taskSchema },
    longTerm: { type: "array", items: taskSchema },
    learningTrails: {
      type: "object",
      additionalProperties: false,
      properties: {
        courses: stringArray,
        books: stringArray,
        projects: stringArray,
        certifications: stringArray,
      },
      required: ["courses", "books", "projects", "certifications"],
    },
    recommendations: {
      type: "object",
      additionalProperties: false,
      properties: {
        networking: { type: "string" },
        languages: { type: "string" },
        portfolio: { type: "string" },
        habits: { type: "string" },
      },
      required: ["networking", "languages", "portfolio", "habits"],
    },
    futureCareers: stringArray,
  },
  required: [
    "summary", "startingPoint", "destination", "shortTerm", "mediumTerm", "longTerm",
    "learningTrails", "recommendations", "futureCareers",
  ],
} as const;

function buildUserMessage(ctx: RoadmapContext): string {
  const a = ctx.answers;
  const lines = SMART_QUESTIONS.map((q) => `- ${q.promptLabel}: ${answerLabels(q.id, a[q.id])}`);
  lines.push(`- Perfil vocacional (RIASEC): ${ctx.dominantTypes?.length ? ctx.dominantTypes.join(", ") : "não informado"}`);
  lines.push(`- Profissão-alvo: ${ctx.occupationTitle ?? "não definida"}`);
  lines.push(`- Data atual: ${new Date().toLocaleDateString("pt-BR")}`);
  return `Crie um roadmap de carreira para o seguinte perfil:\n${lines.join("\n")}\n\nGere de 3 a 5 tarefas para cada horizonte (curto, médio e longo prazo), trilhas de aprendizado, recomendações estratégicas e possíveis cargos futuros.`;
}

/** Calls Claude with structured output. Throws on refusal / invalid output. */
export async function generateCareerRoadmap(ctx: RoadmapContext): Promise<Roadmap> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserMessage(ctx) }],
    output_config: { format: { type: "json_schema", name: "roadmap", schema: ROADMAP_SCHEMA } },
  } as Anthropic.MessageCreateParamsNonStreaming);

  if (response.stop_reason === "refusal") {
    throw new Error("A geração foi recusada pelo modelo.");
  }
  const text = response.content.find((b): b is Anthropic.TextBlock => b.type === "text")?.text;
  if (!text) throw new Error("Resposta vazia do modelo.");

  const parsed = JSON.parse(text) as Roadmap;
  if (!parsed.shortTerm || !parsed.destination) throw new Error("Roadmap inválido.");
  return parsed;
}

/** Deterministic template used when the API key is missing or the call fails. */
export function buildFallbackRoadmap(ctx: RoadmapContext): Roadmap {
  const goal = answerLabels("goal", ctx.answers.goal);
  const time = answerLabels("time_per_week", ctx.answers.time_per_week);
  const target = ctx.occupationTitle ?? "a carreira que você deseja";

  return {
    summary: `Plano inicial focado em ${goal.toLowerCase()}, com dedicação de ${time.toLowerCase()} por semana.`,
    startingPoint: "Seu momento atual, conforme as respostas do questionário.",
    destination: target,
    shortTerm: [
      { title: "Mapear competências necessárias", description: `Liste o que ${target} exige e compare com o que você já tem.`, durationLabel: "Semanas 1–4" },
      { title: "Concluir um curso introdutório", description: "Escolha um curso (de preferência gratuito) na área de interesse e conclua.", durationLabel: "Meses 1–3" },
      { title: "Criar um plano de estudos semanal", description: `Organize seu tempo disponível (${time}) em uma rotina fixa.`, durationLabel: "Mês 1" },
    ],
    mediumTerm: [
      { title: "Construir um portfólio inicial", description: "Reúna 2–3 projetos ou experiências que demonstrem suas competências.", durationLabel: "Ano 1" },
      { title: "Ampliar sua rede de contatos", description: "Participe de comunidades e eventos da área.", durationLabel: "Ano 1–2" },
    ],
    longTerm: [
      { title: "Consolidar a transição", description: `Buscar uma posição efetiva em ${target}.`, durationLabel: "3+ anos" },
    ],
    learningTrails: {
      courses: ["Cursos gratuitos online na sua área de interesse"],
      books: ["Um livro introdutório recomendado na área"],
      projects: ["Um projeto prático aplicando o que aprendeu"],
      certifications: ["Uma certificação reconhecida no mercado"],
    },
    recommendations: {
      networking: "Participe de grupos e eventos da área para criar conexões.",
      languages: "Inglês básico ajuda a acessar mais conteúdo e oportunidades.",
      portfolio: "Mantenha um portfólio simples e atualizado.",
      habits: "Reserve um horário fixo por semana para estudar e evoluir.",
    },
    futureCareers: ["Posição júnior", "Posição plena", "Especialista na área"],
  };
}
