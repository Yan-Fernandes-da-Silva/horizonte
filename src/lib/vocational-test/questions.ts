// ─────────────────────────────────────────────────────────────────────────────
// Vocational test — QUESTION BANK (single source of truth).
//
// To change the test, edit this file: add/remove a Question object, tweak text,
// options or weights. Scoring (scoring.ts) and the UI read everything from here,
// so changes flow through automatically. Keep `riasecType`/`miType` accurate —
// that's what the scoring engine sums.
//
// IMPORTANT: `QUESTIONS` must contain ONLY what is actually asked — it is the
// denominator of the progress bar. Questions "parked" for the Career Plan or for
// a future Personal section live in `career-plan-questions.ts`, NOT here.
// ─────────────────────────────────────────────────────────────────────────────
import type { Option, Question, RiasecType, MiType, SectionMeta } from "./types";

export const SECTIONS: SectionMeta[] = [
  { id: "riasec", label: "Interesses (RIASEC)", description: "Como você gosta de trabalhar e com o quê." },
  { id: "mi", label: "Inteligências", description: "Suas formas de pensar e aprender mais fortes." },
  { id: "gopc", label: "Valores & Contexto", description: "O que te motiva e o seu momento de carreira." },
];

// Human-readable names used in the results page and the home dashboard card.
export const RIASEC_NAMES: Record<RiasecType, string> = {
  R: "Realista",
  I: "Investigativo",
  A: "Artístico",
  S: "Social",
  E: "Empreendedor",
  C: "Convencional",
};

export const MI_NAMES: Record<MiType, string> = {
  linguistica: "Linguística",
  logica: "Lógico-Matemática",
  espacial: "Espacial",
  musical: "Musical",
  corporal: "Corporal-Cinestésica",
  naturalista: "Naturalista",
  interpessoal: "Interpessoal",
  intrapessoal: "Intrapessoal",
};

// ── Reusable option sets ──────────────────────────────────────────────────────

/** Tier list (RIASEC) — 5 fixed bands, scored 0..4. Icons are Lucide names. */
export interface TierLevel {
  /** Stored answer value AND score for this band. */
  value: number;
  label: string;
  icon: string;
}
export const TIER_LEVELS: TierLevel[] = [
  { value: 0, label: "Não tem nada a ver comigo", icon: "X" },
  { value: 1, label: "Não me identifico muito", icon: "ThumbsDown" },
  { value: 2, label: "Mais ou menos, talvez", icon: "Meh" },
  { value: 3, label: "Tem a ver comigo", icon: "ThumbsUp" },
  { value: 4, label: "Sou exatamente assim!", icon: "Target" },
];

/** Like/dislike (Inteligências) — icon-only bar, scored dislike 0 / neutral 1 / like 3. */
export const LIKE_DISLIKE_OPTIONS: Option[] = [
  { value: "dislike", label: "Não gosto", icon: "ThumbsDown" },
  { value: "neutral", label: "Mais ou menos", icon: "Meh" },
  { value: "like", label: "Gosto", icon: "ThumbsUp" },
];

// Helper builders to keep the bank compact.
const tier = (id: string, text: string, riasecType: RiasecType): Question =>
  ({ id, section: "riasec", type: "tier", text, riasecType });
const mi = (id: string, text: string, miType: MiType): Question =>
  ({ id, section: "mi", type: "like_dislike", text, options: LIKE_DISLIKE_OPTIONS, miType });

// ─── Section 1 — RIASEC ───────────────────────────────────────────────────────
// 18 tier-list statements (dragged into one of the 5 bands) + 1 visual question.
const RIASEC: Question[] = [
  tier("R1", "Trabalhar com ferramentas, máquinas ou equipamentos.", "R"),
  tier("R2", "Consertar ou montar coisas com as próprias mãos.", "R"),
  tier("R3", "Atividades práticas e ao ar livre, mais que tarefas teóricas.", "R"),
  tier("I1", "Investigar problemas e entender por que as coisas funcionam.", "I"),
  tier("I2", "Analisar dados e fazer experimentos.", "I"),
  tier("I3", "Aprender assuntos científicos ou complexos.", "I"),
  tier("A1", "Me expressar de forma criativa (arte, música, escrita, design).", "A"),
  tier("A2", "Criar algo original — um desenho, um texto ou uma melodia.", "A"),
  tier("A3", "Ambientes que me dão liberdade para inovar.", "A"),
  tier("S1", "Ajudar, ensinar ou cuidar de outras pessoas.", "S"),
  tier("S2", "Orientar ou apoiar alguém que está com uma dificuldade.", "S"),
  tier("S3", "Contribuir para o bem-estar dos outros.", "S"),
  tier("E1", "Liderar, convencer e assumir a frente de projetos.", "E"),
  tier("E2", "Negociar, vender ou apresentar ideias para um grupo.", "E"),
  tier("E3", "Motivar pessoas rumo a um objetivo.", "E"),
  tier("C1", "Organizar informações, planilhas e seguir procedimentos.", "C"),
  tier("C2", "Organizar arquivos, dados ou rotinas com precisão.", "C"),
  tier("C3", "Ter tudo planejado e em ordem.", "C"),
  {
    id: "RV",
    section: "riasec",
    type: "visual",
    text: "Qual ambiente de trabalho mais combina com você?",
    helpText: "Escolha o que mais te atrai à primeira vista.",
    options: [
      { value: "R", label: "Oficina, indústria ou campo de obras", icon: "Hammer", riasecType: "R" },
      { value: "I", label: "Laboratório, centro de pesquisa ou instituto de tecnologia", icon: "Microscope", riasecType: "I" },
      { value: "A", label: "Estúdio, ateliê ou consultoria", icon: "Palette", riasecType: "A" },
      { value: "S", label: "Sala de aula, sala médica ou ouvidoria", icon: "HeartHandshake", riasecType: "S" },
      { value: "E", label: "Sala de reunião, palco ou loja/negócio", icon: "Megaphone", riasecType: "E" },
      { value: "C", label: "Escritório, secretaria ou setor de produção", icon: "ClipboardList", riasecType: "C" },
    ],
  },
];

// ─── Section 2 — Inteligências Múltiplas (24 = 3 por inteligência) ─────────────
const MI: Question[] = [
  // Linguística
  mi("L1", "Me expressar com palavras, falando ou escrevendo.", "linguistica"),
  mi("L2", "Ler, escrever ou debater ideias.", "linguistica"),
  mi("L3", "Contar histórias ou explicar algo prendendo a atenção.", "linguistica"),
  // Lógico-Matemática
  mi("M1", "Resolver problemas com números e lógica.", "logica"),
  mi("M2", "Trabalhar com cálculos, padrões e raciocínio lógico.", "logica"),
  mi("M3", "Entender como sistemas funcionam e resolver quebra-cabeças.", "logica"),
  // Espacial
  mi("E1m", "Visualizar objetos, mapas ou espaços na mente.", "espacial"),
  mi("E2m", "Desenhar, projetar ou montar coisas no espaço.", "espacial"),
  mi("E3m", "Montar móveis, ler plantas ou me orientar por mapas.", "espacial"),
  // Musical
  mi("Mu1", "Perceber ritmos, melodias e sons com facilidade.", "musical"),
  mi("Mu2", "Tocar, cantar ou criar música.", "musical"),
  mi("Mu3", "Reparar quando uma nota ou instrumento está desafinado.", "musical"),
  // Corporal-Cinestésica
  mi("Co1", "Aprender fazendo, usando o corpo e o movimento.", "corporal"),
  mi("Co2", "Praticar esportes, dança ou atividades manuais.", "corporal"),
  mi("Co3", "Coordenar movimentos e aprender gestos com facilidade.", "corporal"),
  // Naturalista
  mi("N1", "Me interessar por natureza, plantas, animais e meio ambiente.", "naturalista"),
  mi("N2", "Cuidar de plantas e animais ou observar a natureza.", "naturalista"),
  mi("N3", "Identificar plantas, animais ou fenômenos da natureza.", "naturalista"),
  // Interpessoal
  mi("Ip1", "Entender as emoções e intenções das pessoas.", "interpessoal"),
  mi("Ip2", "Trabalhar em equipe e ajudar a resolver conflitos.", "interpessoal"),
  mi("Ip3", "Ser procurado pelas pessoas para desabafar ou pedir conselho.", "interpessoal"),
  // Intrapessoal
  mi("Ia1", "Conhecer minhas próprias emoções, forças e limites.", "intrapessoal"),
  mi("Ia2", "Refletir e planejar sozinho antes de agir.", "intrapessoal"),
  mi("Ia3", "Reservar um tempo para pensar nos meus objetivos e valores.", "intrapessoal"),
];

// ─── Section 3 — Valores & Contexto (GOPC) ────────────────────────────────────
// Single-choice + ranking only (all multi-selects converted to rank).
const GOPC: Question[] = [
  {
    id: "G1", section: "gopc", type: "single_select", text: "O que mais te motiva no trabalho?",
    options: [
      { value: "estabilidade", label: "Estabilidade e segurança" },
      { value: "proposito", label: "Propósito e impacto" },
      { value: "reconhecimento", label: "Reconhecimento e crescimento" },
      { value: "autonomia", label: "Autonomia e liberdade" },
      { value: "remuneracao", label: "Boa remuneração" },
    ],
  },
  {
    id: "G3", section: "gopc", type: "single_select", text: "Qual ambiente de trabalho você prefere?",
    options: [
      { value: "escritorio", label: "Escritório estruturado" },
      { value: "criativo", label: "Ambiente criativo e flexível" },
      { value: "externo", label: "Campo / trabalho externo" },
      { value: "remoto", label: "Remoto / de casa" },
      { value: "publico", label: "Contato direto com o público" },
    ],
  },
  {
    id: "G4", section: "gopc", type: "rank", text: "Ordene o que você mais valoriza num emprego.",
    helpText: "Arraste/ordene do mais ao menos importante.",
    options: [
      { value: "flexibilidade", label: "Flexibilidade de horário" },
      { value: "equipe", label: "Trabalho em equipe" },
      { value: "lideranca", label: "Liderança" },
      { value: "aprendizado", label: "Aprendizado contínuo" },
      { value: "impacto", label: "Impacto social" },
      { value: "salario", label: "Bom salário" },
      { value: "seguranca", label: "Segurança / estabilidade" },
    ],
  },
  {
    id: "G5", section: "gopc", type: "single_select", text: "Como você prefere trabalhar?",
    options: [
      { value: "sozinho", label: "Sozinho" },
      { value: "equipe_pequena", label: "Em equipe pequena" },
      { value: "equipe_grande", label: "Em equipe grande" },
      { value: "liderando", label: "Liderando pessoas" },
    ],
  },
  {
    id: "G7", section: "gopc", type: "single_select", text: "Você prefere rotina previsível ou desafios variados?",
    options: [
      { value: "rotina", label: "Rotina previsível" },
      { value: "equilibrio", label: "Um equilíbrio dos dois" },
      { value: "variedade", label: "Desafios variados" },
    ],
  },
  {
    id: "G8", section: "gopc", type: "rank", text: "Ordene as áreas que mais despertam seu interesse.",
    helpText: "Usamos o topo do seu ranking para sugerir profissões e cursos.",
    options: [
      { value: "tecnologia", label: "Tecnologia" },
      { value: "saude", label: "Saúde" },
      { value: "educacao", label: "Educação" },
      { value: "negocios", label: "Negócios e gestão" },
      { value: "artes", label: "Artes e comunicação" },
      { value: "industria", label: "Indústria e produção" },
      { value: "meio_ambiente", label: "Meio ambiente e agro" },
      { value: "servico_publico", label: "Serviço público" },
    ],
  },
  {
    id: "G10", section: "gopc", type: "rank", text: "Ordene o que você busca primeiro numa profissão.",
    options: [
      { value: "realizacao", label: "Realização pessoal" },
      { value: "dinheiro", label: "Dinheiro" },
      { value: "estabilidade", label: "Estabilidade" },
      { value: "status", label: "Status" },
      { value: "flexibilidade", label: "Flexibilidade" },
    ],
  },
  {
    id: "G11", section: "gopc", type: "single_select", text: "Você prefere trabalhar mais com:",
    options: [
      { value: "pessoas", label: "Pessoas" },
      { value: "dados", label: "Dados e ideias" },
      { value: "coisas", label: "Coisas e máquinas" },
      { value: "criatividade", label: "Criatividade" },
    ],
  },
];

export const QUESTIONS: Question[] = [...RIASEC, ...MI, ...GOPC];

export const TOTAL_QUESTIONS = QUESTIONS.length;

export function questionsForSection(section: string): Question[] {
  return QUESTIONS.filter((q) => q.section === section);
}

export function sectionMeta(section: string): SectionMeta | undefined {
  return SECTIONS.find((s) => s.id === section);
}
