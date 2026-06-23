// Vocational test — motivational interstitial shown between sections.
// Pure: maps a just-finished section's answers to one of 5 "states" and returns
// an encouraging message (with an illustrative, motivational statistic).
import { QUESTIONS } from "./questions";
import type { Responses, SectionId } from "./types";

export interface Motivation {
  title: string;
  message: string;
}

const clampState = (n: number) => Math.max(0, Math.min(4, n));

// ── RIASEC: concentrated (knows what they want) ↔ eclectic (likes a bit of all) ──
function riasecState(responses: Responses): number {
  const byType: Record<string, number[]> = {};
  for (const q of QUESTIONS) {
    if (q.section !== "riasec" || q.type !== "tier" || !q.riasecType) continue;
    const v = responses[q.id];
    if (typeof v === "number") (byType[q.riasecType] ??= []).push(v);
  }
  const avgs = Object.values(byType).map((xs) => xs.reduce((a, b) => a + b, 0) / (xs.length || 1));
  if (avgs.length < 2) return 2;
  const mean = avgs.reduce((a, b) => a + b, 0) / avgs.length;
  const stdev = Math.sqrt(avgs.reduce((a, b) => a + (b - mean) ** 2, 0) / avgs.length);
  // stdev ranges ~0 (uniform/eclectic) .. ~1.5 (one type dominates).
  if (stdev < 0.4) return 0;
  if (stdev < 0.7) return 1;
  if (stdev < 1.0) return 2;
  if (stdev < 1.3) return 3;
  return 4;
}

const RIASEC_MESSAGES: Motivation[] = [
  { title: "Você curte um pouco de tudo! 🌈", message: "Seu perfil de interesses é bem variado — só 18% das pessoas se identificam com tantas áreas diferentes. Versatilidade é um baita trunfo. Bora continuar?" },
  { title: "Aberto a explorar! 🧭", message: "Você tem interesses espalhados por várias frentes. 2 em cada 3 pessoas ainda estão se descobrindo como você. Vamos afinar esse perfil!" },
  { title: "Equilíbrio na medida! ⚖️", message: "Seus interesses têm foco, mas sem fechar portas. Esse equilíbrio aparece em só 1 a cada 4 pessoas. Continue, está ficando bom!" },
  { title: "Você sabe o que gosta! 🎯", message: "Seu perfil já mostra direções claras. 71% das pessoas têm interesses mais espalhados que os seus — foco é coisa rara. Segue o jogo!" },
  { title: "Foco de atleta! 🚀", message: "Você tem interesses muito definidos — top 10% em clareza! Quem sabe o que quer chega mais rápido lá. Vamos para a próxima!" },
];

// ── MI: enthusiasm (how much the person engaged/liked the activities) ──────────
function miState(responses: Responses): number {
  let score = 0;
  let count = 0;
  for (const q of QUESTIONS) {
    if (q.section !== "mi") continue;
    const v = responses[q.id];
    if (v == null) continue;
    count++;
    if (v === "like") score += 1;
    else if (v === "neutral") score += 0.5;
  }
  if (count === 0) return 2;
  const ratio = score / count; // 0 (nothing) .. 1 (loves everything)
  return clampState(Math.round(ratio * 4));
}

const MI_MESSAGES: Motivation[] = [
  { title: "Mente seletiva! 🔍", message: "Você sabe bem o que combina com você e o que não combina. Essa autocrítica ajuda a escolher caminhos certeiros. Falta pouco!" },
  { title: "Olhar criterioso! 🧠", message: "Você separou bem suas afinidades das demais. 64% das pessoas marcam mais 'gosto' do que você — ser exigente é uma qualidade. Continue!" },
  { title: "Curiosidade equilibrada! ✨", message: "Você tem afinidade com várias formas de pensar e aprender. Esse leque abre muitas possibilidades de carreira. Vamos seguir!" },
  { title: "Muita energia! ⚡", message: "Você demonstrou gostar de quase tudo — pessoas assim costumam se adaptar rápido a novas áreas. Só mais uma seção!" },
  { title: "Apaixonado por aprender! 🌟", message: "Raríssimo: você curtiu praticamente todas as formas de inteligência! Top 8% em entusiasmo. Sua sede de aprender vai te levar longe!" },
];

// ── GOPC: tailored to the main work motivation (G1) ───────────────────────────
const GOPC_BY_MOTIVATION: Record<string, Motivation> = {
  estabilidade: { title: "Pé no chão! 🏠", message: "Estabilidade move você — e tudo bem: 38% das pessoas buscam o mesmo. Vamos achar carreiras sólidas pra você." },
  proposito: { title: "Movido por propósito! 💚", message: "Você quer impacto, não só salário. Profissionais com propósito relatam 2x mais satisfação. Bora ver onde você brilha!" },
  reconhecimento: { title: "Rumo ao topo! 📈", message: "Crescer e ser reconhecido te motiva. Quem busca isso costuma evoluir mais rápido na carreira. Vamos lá!" },
  autonomia: { title: "Espírito livre! 🦅", message: "Autonomia é o que te move — perfil de quem vai bem com flexibilidade e empreendedorismo. Quase nos resultados!" },
  remuneracao: { title: "Foco no retorno! 💰", message: "Boa remuneração pesa na sua escolha — e dá pra unir isso com o que você curte. Vamos te mostrar as opções!" },
};

const GOPC_DEFAULT: Motivation = {
  title: "Perfil montado! 🧩", message: "Já temos uma boa leitura dos seus valores e contexto. Agora é só ver os resultados. Você foi muito bem!",
};

/** Message shown after finishing `section`, based on how that section went. */
export function sectionMotivation(section: SectionId, responses: Responses): Motivation {
  if (section === "riasec") return RIASEC_MESSAGES[riasecState(responses)];
  if (section === "mi") return MI_MESSAGES[miState(responses)];
  if (section === "gopc") {
    const g1 = responses["G1"];
    return (typeof g1 === "string" && GOPC_BY_MOTIVATION[g1]) || GOPC_DEFAULT;
  }
  return GOPC_DEFAULT;
}
