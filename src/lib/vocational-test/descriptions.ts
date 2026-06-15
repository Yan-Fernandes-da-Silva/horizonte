// Human-readable descriptions for RIASEC types and intelligences.
// Edit freely — used only by the results page.
import type { MiType, RiasecType } from "./types";

export const RIASEC_DESCRIPTIONS: Record<RiasecType, string> = {
  R: "Perfil prático: você gosta de atividades concretas, de trabalhar com as mãos, ferramentas, máquinas ou ao ar livre.",
  I: "Perfil analítico: você gosta de investigar, pesquisar e resolver problemas complexos usando o raciocínio.",
  A: "Perfil criativo: você valoriza expressão, originalidade e ambientes que dão liberdade para inovar.",
  S: "Perfil social: você gosta de ajudar, ensinar e cuidar das pessoas, contribuindo para o bem-estar dos outros.",
  E: "Perfil empreendedor: você gosta de liderar, persuadir e assumir a frente de projetos e negócios.",
  C: "Perfil organizador: você gosta de estruturar informações, seguir processos e manter tudo em ordem.",
};

export const MI_DESCRIPTIONS: Record<MiType, string> = {
  linguistica: "Facilidade com palavras, leitura, escrita e comunicação.",
  logica: "Raciocínio lógico, números e resolução de problemas.",
  espacial: "Visualização de formas, espaços e imagens mentais.",
  musical: "Sensibilidade a ritmos, sons e melodias.",
  corporal: "Aprendizado pelo corpo, movimento e habilidades manuais.",
  naturalista: "Conexão com a natureza, plantas e animais.",
  interpessoal: "Habilidade de entender e se relacionar com pessoas.",
  intrapessoal: "Autoconhecimento e reflexão sobre si mesmo.",
};
