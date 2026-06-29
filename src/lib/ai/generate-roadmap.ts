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

export interface RoadmapStep {
  title: string;
  description: string;
}

export interface RoadmapChallenge {
  obstacle: string;
  howToOvercome: string;
}

export interface Roadmap {
  summary: string;
  /** Why this path fits the person (ties RIASEC profile + chosen profession). */
  whyThisPath: string;
  startingPoint: string;
  destination: string;
  /** Strategic milestones between starting point and destination. */
  steps: RoadmapStep[];
  /** What to build along the way. */
  develop: {
    competencias: string[];
    experiencias: string[];
    resultados: string[];
  };
  /** One concrete action to start this week. */
  firstStep: string;
  /** Challenges (from the SMART obstacles) + how to overcome them. */
  challenges: RoadmapChallenge[];
  shortTerm: RoadmapTask[]; // até 6 meses
  mediumTerm: RoadmapTask[]; // 6 meses a 3 anos
  longTerm: RoadmapTask[]; // 3 anos +
  learningTrails: {
    content: string[];
    courses: string[];
    books: string[];
    projects: string[];
  };
  recommendations: {
    networking: string;
    languages: string;
    portfolio: string;
    habits: string;
  };
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
- O roadmap é uma DIREÇÃO ESTRATÉGICA, não um roteiro fixo — não precisa ser 100% preciso.
- Personalize: conecte o perfil vocacional (RIASEC) e a profissão-alvo ao plano. O campo "whyThisPath" deve explicar, em 2–4 frases, por que esse caminho combina com a pessoa.
- "steps" são as etapas estratégicas entre o ponto de partida e o destino (3 a 6 etapas).
- "develop" lista o que desenvolver ao longo do caminho: competências (habilidades/conhecimentos), experiências (práticas/vivências) e resultados (entregas/conquistas observáveis).
- "firstStep" é UMA ação concreta e pequena para a pessoa começar JÁ esta semana.
- "challenges" parte dos obstáculos informados pela pessoa e diz como superá-los.
- Prazos do cronograma: shortTerm = até 6 meses; mediumTerm = 6 meses a 3 anos; longTerm = 3 anos ou mais. Use "durationLabel" coerente com cada horizonte e com o tempo semanal disponível.
- Trilhas: "content" = conteúdos gratuitos (artigos, vídeos, canais, podcasts); além de cursos, livros e projetos práticos reais e acessíveis (inclua opções gratuitas quando possível).
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
const stepSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    description: { type: "string" },
  },
  required: ["title", "description"],
};
const challengeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    obstacle: { type: "string" },
    howToOvercome: { type: "string" },
  },
  required: ["obstacle", "howToOvercome"],
};
const stringArray = { type: "array", items: { type: "string" } };

const ROADMAP_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    whyThisPath: { type: "string" },
    startingPoint: { type: "string" },
    destination: { type: "string" },
    steps: { type: "array", items: stepSchema },
    develop: {
      type: "object",
      additionalProperties: false,
      properties: {
        competencias: stringArray,
        experiencias: stringArray,
        resultados: stringArray,
      },
      required: ["competencias", "experiencias", "resultados"],
    },
    firstStep: { type: "string" },
    challenges: { type: "array", items: challengeSchema },
    shortTerm: { type: "array", items: taskSchema },
    mediumTerm: { type: "array", items: taskSchema },
    longTerm: { type: "array", items: taskSchema },
    learningTrails: {
      type: "object",
      additionalProperties: false,
      properties: {
        content: stringArray,
        courses: stringArray,
        books: stringArray,
        projects: stringArray,
      },
      required: ["content", "courses", "books", "projects"],
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
  },
  required: [
    "summary", "whyThisPath", "startingPoint", "destination", "steps", "develop", "firstStep",
    "challenges", "shortTerm", "mediumTerm", "longTerm", "learningTrails", "recommendations",
  ],
} as const;

function buildUserMessage(ctx: RoadmapContext): string {
  const a = ctx.answers;
  const lines = SMART_QUESTIONS.map((q) => `- ${q.promptLabel}: ${answerLabels(q.id, a[q.id])}`);
  lines.push(`- Perfil vocacional (RIASEC): ${ctx.dominantTypes?.length ? ctx.dominantTypes.join(", ") : "não informado"}`);
  lines.push(`- Profissão-alvo: ${ctx.occupationTitle ?? "não definida"}`);
  lines.push(`- Data atual: ${new Date().toLocaleDateString("pt-BR")}`);
  return `Crie um roadmap de carreira para o seguinte perfil:\n${lines.join("\n")}\n\nGere:
1) Um resumo curto e por que esse caminho combina com a pessoa (whyThisPath), ligando o perfil RIASEC e a profissão-alvo.
2) Onde a pessoa está hoje (startingPoint), onde quer chegar (destination) e as etapas estratégicas entre os dois (steps).
3) O que desenvolver: competências, experiências e resultados (develop).
4) Um primeiro passo para esta semana (firstStep).
5) Desafios com base nos obstáculos informados e como superá-los (challenges).
6) De 3 a 5 tarefas para cada horizonte: curto (até 6 meses), médio (6 meses a 3 anos) e longo (3 anos ou mais).
7) Trilhas de aprendizado (conteúdos gratuitos, cursos, livros, projetos).
8) Recomendações (networking, idiomas, portfólio, hábitos).`;
}

/** Calls Claude with structured output. Throws on refusal / invalid output. */
export async function generateCareerRoadmap(ctx: RoadmapContext): Promise<Roadmap> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserMessage(ctx) }],
    output_config: { format: { type: "json_schema", schema: ROADMAP_SCHEMA } },
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
  const obstacles = answerLabels("obstacles", ctx.answers.obstacles);
  const target = ctx.occupationTitle ?? "a carreira que você deseja";
  const riasec = ctx.dominantTypes?.length ? ctx.dominantTypes.join(", ") : "seu perfil";

  return {
    summary: `Plano inicial focado em ${goal.toLowerCase()}, com dedicação de ${time.toLowerCase()} por semana.`,
    whyThisPath: `Seu perfil vocacional (${riasec}) e o interesse em ${target} indicam um caminho com bom encaixe entre o que você gosta e o mercado. Use este plano como direção estratégica, não como roteiro fixo.`,
    startingPoint: "Seu momento atual, conforme as respostas do questionário.",
    destination: target,
    steps: [
      { title: "Entender o destino", description: `Pesquise o que ${target} exige e como é o dia a dia da profissão.` },
      { title: "Fechar lacunas", description: "Compare suas competências atuais com as necessárias e priorize o que falta." },
      { title: "Ganhar experiência", description: "Aplique o aprendizado em projetos práticos e construa um portfólio." },
      { title: "Entrar e evoluir", description: `Busque as primeiras oportunidades em ${target} e continue se desenvolvendo.` },
    ],
    develop: {
      competencias: ["Competências técnicas essenciais da área", "Comunicação e trabalho em equipe"],
      experiencias: ["Projetos práticos na área", "Participação em comunidades ou eventos"],
      resultados: ["Um portfólio inicial", "Primeira oportunidade na área-alvo"],
    },
    firstStep: "Reserve 1 hora esta semana para pesquisar a fundo a profissão-alvo e anotar 3 competências que você precisa desenvolver.",
    challenges: [
      {
        obstacle: obstacles !== "—" ? obstacles : "Falta de clareza sobre por onde começar",
        howToOvercome: "Divida o objetivo em metas pequenas e comece pelo primeiro passo desta semana.",
      },
      {
        obstacle: "Manter a consistência",
        howToOvercome: `Reserve seu tempo disponível (${time}) num horário fixo na semana.`,
      },
    ],
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
      content: ["Canais, podcasts e artigos gratuitos sobre a área de interesse"],
      courses: ["Cursos gratuitos online na sua área de interesse"],
      books: ["Um livro introdutório recomendado na área"],
      projects: ["Um projeto prático aplicando o que aprendeu"],
    },
    recommendations: {
      networking: "Participe de grupos e eventos da área para criar conexões.",
      languages: "Inglês básico ajuda a acessar mais conteúdo e oportunidades.",
      portfolio: "Mantenha um portfólio simples e atualizado.",
      habits: "Reserve um horário fixo por semana para estudar e evoluir.",
    },
  };
}
