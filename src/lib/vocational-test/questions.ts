// ─────────────────────────────────────────────────────────────────────────────
// Vocational test — QUESTION BANK (single source of truth).
//
// To change the test, edit this file: add/remove a Question object, tweak text,
// options or weights. Scoring (scoring.ts) and the UI read everything from here,
// so changes flow through automatically. Keep `riasecType`/`miType` accurate —
// that's what the scoring engine sums.
// ─────────────────────────────────────────────────────────────────────────────
import type { Option, Question, RiasecType, MiType, SectionMeta } from "./types";

export const SECTIONS: SectionMeta[] = [
  { id: "riasec", label: "Interesses (RIASEC)", description: "Como você gosta de trabalhar e com o quê." },
  { id: "mi", label: "Inteligências", description: "Suas formas de pensar e aprender mais fortes." },
  { id: "gopc", label: "Valores & Contexto", description: "O que te motiva e o seu momento de carreira." },
  { id: "personal", label: "Análise Pessoal", description: "Suas metas, obstáculos e disponibilidade." },
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

// Reusable option sets.
export const LIKERT_OPTIONS: Option[] = [
  { value: "1", label: "Discordo totalmente" },
  { value: "2", label: "Discordo" },
  { value: "3", label: "Neutro" },
  { value: "4", label: "Concordo" },
  { value: "5", label: "Concordo totalmente" },
];

export const LIKE_DISLIKE_OPTIONS: Option[] = [
  { value: "dislike", label: "Não gosto", icon: "ThumbsDown" },
  { value: "neutral", label: "Indiferente", icon: "Minus" },
  { value: "like", label: "Gosto", icon: "Heart" },
];

// Helper builders to keep the bank compact.
const likert = (id: string, section: Question["section"], text: string, extra: Partial<Question> = {}): Question =>
  ({ id, section, type: "likert", text, options: LIKERT_OPTIONS, ...extra });
const likeDislike = (id: string, section: Question["section"], text: string, extra: Partial<Question> = {}): Question =>
  ({ id, section, type: "like_dislike", text, options: LIKE_DISLIKE_OPTIONS, ...extra });

// ─── Section 1 — RIASEC (19) ──────────────────────────────────────────────────
const RIASEC: Question[] = [
  likert("R1", "riasec", "Gosto de trabalhar com ferramentas, máquinas ou equipamentos.", { riasecType: "R" }),
  likeDislike("R2", "riasec", "Consertar ou montar coisas com as próprias mãos.", { riasecType: "R" }),
  likert("R3", "riasec", "Prefiro atividades práticas e ao ar livre a tarefas teóricas.", { riasecType: "R" }),
  likert("I1", "riasec", "Gosto de investigar problemas e entender por que as coisas funcionam.", { riasecType: "I" }),
  likeDislike("I2", "riasec", "Analisar dados e fazer experimentos.", { riasecType: "I" }),
  likert("I3", "riasec", "Sinto prazer em aprender assuntos científicos ou complexos.", { riasecType: "I" }),
  likert("A1", "riasec", "Gosto de me expressar de forma criativa (arte, música, escrita, design).", { riasecType: "A" }),
  likeDislike("A2", "riasec", "Criar algo original — um desenho, um texto ou uma melodia.", { riasecType: "A" }),
  likert("A3", "riasec", "Valorizo ambientes que me dão liberdade para inovar.", { riasecType: "A" }),
  likert("S1", "riasec", "Gosto de ajudar, ensinar ou cuidar de outras pessoas.", { riasecType: "S" }),
  likeDislike("S2", "riasec", "Orientar ou apoiar alguém que está com uma dificuldade.", { riasecType: "S" }),
  likert("S3", "riasec", "Me realizo quando contribuo para o bem-estar dos outros.", { riasecType: "S" }),
  likert("E1", "riasec", "Gosto de liderar, convencer e assumir a frente de projetos.", { riasecType: "E" }),
  likeDislike("E2", "riasec", "Negociar, vender ou apresentar ideias para um grupo.", { riasecType: "E" }),
  likert("E3", "riasec", "Tenho facilidade em motivar pessoas rumo a um objetivo.", { riasecType: "E" }),
  likert("C1", "riasec", "Gosto de organizar informações, planilhas e seguir procedimentos.", { riasecType: "C" }),
  likeDislike("C2", "riasec", "Organizar arquivos, dados ou rotinas com precisão.", { riasecType: "C" }),
  likert("C3", "riasec", "Me sinto bem quando tudo está planejado e em ordem.", { riasecType: "C" }),
  {
    id: "RV",
    section: "riasec",
    type: "visual",
    text: "Qual ambiente de trabalho mais combina com você?",
    helpText: "Escolha o que mais te atrai à primeira vista.",
    options: [
      { value: "R", label: "Oficina / campo", icon: "Wrench", riasecType: "R" },
      { value: "I", label: "Laboratório", icon: "FlaskConical", riasecType: "I" },
      { value: "A", label: "Ateliê / estúdio", icon: "Palette", riasecType: "A" },
      { value: "S", label: "Sala de aula / atendimento", icon: "Users", riasecType: "S" },
      { value: "E", label: "Palco / reunião", icon: "Presentation", riasecType: "E" },
      { value: "C", label: "Escritório organizado", icon: "ClipboardList", riasecType: "C" },
    ],
  },
];

// ─── Section 2 — Inteligências Múltiplas (16) ─────────────────────────────────
const MI: Question[] = [
  likert("L1", "mi", "Tenho facilidade para me expressar com palavras, falando ou escrevendo.", { miType: "linguistica" }),
  likeDislike("L2", "mi", "Ler, escrever ou debater ideias.", { miType: "linguistica" }),
  likert("M1", "mi", "Resolvo problemas com números e lógica com facilidade.", { miType: "logica" }),
  likeDislike("M2", "mi", "Trabalhar com cálculos, padrões e raciocínio lógico.", { miType: "logica" }),
  likert("E1m", "mi", "Consigo visualizar objetos, mapas ou espaços com clareza na mente.", { miType: "espacial" }),
  likeDislike("E2m", "mi", "Desenhar, projetar ou montar coisas no espaço.", { miType: "espacial" }),
  likert("Mu1", "mi", "Percebo ritmos, melodias e sons com facilidade.", { miType: "musical" }),
  likeDislike("Mu2", "mi", "Tocar, cantar ou criar música.", { miType: "musical" }),
  likert("Co1", "mi", "Aprendo melhor fazendo, usando o corpo e o movimento.", { miType: "corporal" }),
  likeDislike("Co2", "mi", "Praticar esportes, dança ou atividades manuais.", { miType: "corporal" }),
  likert("N1", "mi", "Tenho interesse por natureza, plantas, animais e meio ambiente.", { miType: "naturalista" }),
  likeDislike("N2", "mi", "Cuidar de plantas e animais ou observar a natureza.", { miType: "naturalista" }),
  likert("Ip1", "mi", "Entendo facilmente as emoções e intenções das pessoas.", { miType: "interpessoal" }),
  likeDislike("Ip2", "mi", "Trabalhar em equipe e ajudar a resolver conflitos.", { miType: "interpessoal" }),
  likert("Ia1", "mi", "Conheço bem minhas próprias emoções, forças e limites.", { miType: "intrapessoal" }),
  likeDislike("Ia2", "mi", "Refletir e planejar sozinho antes de agir.", { miType: "intrapessoal" }),
];

// ─── Section 3 — GOPC (11) ────────────────────────────────────────────────────
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
    id: "G2", section: "gopc", type: "rank", text: "Ordene por importância para você (arraste do mais ao menos importante).",
    options: [
      { value: "salario", label: "Salário" },
      { value: "equilibrio", label: "Equilíbrio vida-trabalho" },
      { value: "proposito", label: "Propósito" },
      { value: "crescimento", label: "Crescimento" },
      { value: "estabilidade", label: "Estabilidade" },
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
    id: "G4", section: "gopc", type: "multi_select", maxSelections: 3, text: "O que você mais valoriza num emprego? (até 3)",
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
    id: "G7", section: "gopc", type: "single_select", text: "Você prefere rotina previsível ou desafios variados?",
    options: [
      { value: "rotina", label: "Rotina previsível" },
      { value: "equilibrio", label: "Um equilíbrio dos dois" },
      { value: "variedade", label: "Desafios variados" },
    ],
  },
  {
    id: "G8", section: "gopc", type: "multi_select", maxSelections: 4, text: "Quais áreas despertam seu interesse? (até 4)",
    helpText: "Usamos isso para filtrar profissões e cursos compatíveis.",
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
    id: "G9", section: "gopc", type: "single_select", text: "O quanto você está disposto a estudar / se qualificar?",
    options: [
      { value: "curso_rapido", label: "Cursos rápidos / livres" },
      { value: "tecnico", label: "Curso técnico" },
      { value: "graduacao", label: "Graduação" },
      { value: "pos", label: "Pós-graduação" },
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

// ─── Section 4 — Análise Pessoal (8) ──────────────────────────────────────────
const PERSONAL: Question[] = [
  likert("P1", "personal", "Sei quais são minhas principais qualidades profissionais."),
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
  likert("P5", "personal", "Estou disposto a sair da minha zona de conforto para crescer."),
  {
    id: "P6", section: "personal", type: "single_select", text: "Como você reage a mudanças?",
    options: [
      { value: "evito", label: "Costumo evitar" },
      { value: "cauteloso", label: "Aceito com cautela" },
      { value: "gosto", label: "Gosto de mudanças" },
      { value: "busco", label: "Busco ativamente" },
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
  likert("P8", "personal", "Tenho clareza sobre o tipo de carreira que quero seguir."),
];

export const QUESTIONS: Question[] = [...RIASEC, ...MI, ...GOPC, ...PERSONAL];

export const TOTAL_QUESTIONS = QUESTIONS.length;

export function questionsForSection(section: string): Question[] {
  return QUESTIONS.filter((q) => q.section === section);
}

export function sectionMeta(section: string): SectionMeta | undefined {
  return SECTIONS.find((s) => s.id === section);
}
