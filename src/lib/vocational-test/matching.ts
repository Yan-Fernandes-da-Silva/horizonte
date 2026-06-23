// Vocational test — server-side matching of a result profile to CBO occupations
// and Courses. Pure scoring lives in riasec-cbo-map.ts; here we query the DB.
import { db } from "@/lib/db";
import { topRiasecCodes } from "./scoring";
import { occupationCompatibility } from "./riasec-cbo-map";
import type { RiasecType, TestResults } from "./types";

export interface ScoredOccupation {
  code: string;
  title: string;
  description: string | null;
  score: number;
}

/**
 * Interest areas picked by the user. G8 is now a `rank` question (full ordered
 * list), so we take the top N as the "selected" interests for matching/results.
 */
export function selectedInterests(results: TestResults, n = 4): string[] {
  const arr = results.gopc?.["G8"];
  return Array.isArray(arr) ? arr.slice(0, n) : [];
}

/** Top compatible occupations for a result profile (based on top-3 RIASEC + interests). */
export async function getCompatibleOccupations(
  results: TestResults,
  limit = 24
): Promise<ScoredOccupation[]> {
  const topCodes = topRiasecCodes(results.riasec);
  const interests = selectedInterests(results);

  const occupations = await db.cboOccupation.findMany({
    select: { code: true, title: true, description: true },
  });

  return occupations
    .map((o) => ({ ...o, score: occupationCompatibility(o.code, topCodes, interests) }))
    .filter((o) => o.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "pt-BR"))
    .slice(0, limit);
}

// Interest area (G8) → course-matching keywords (name/area contains, case-insensitive).
const INTEREST_KEYWORDS: Record<string, string[]> = {
  tecnologia: ["Tecnologia", "Informação", "Computação", "Sistemas", "Software", "Dados", "Redes", "Digital"],
  saude: ["Saúde", "Enfermagem", "Medicina", "Farmácia", "Fisioterapia", "Odonto", "Nutrição", "Biomedicina"],
  educacao: ["Educação", "Pedagogia", "Licenciatura", "Formação de professor", "Ensino"],
  negocios: ["Administração", "Gestão", "Negócios", "Economia", "Contábeis", "Marketing", "Finanças", "Recursos Humanos"],
  artes: ["Artes", "Design", "Música", "Comunicação", "Audiovisual", "Publicidade", "Moda", "Cinema"],
  industria: ["Engenharia", "Produção", "Indústria", "Mecânica", "Elétr", "Automação", "Logística", "Construção"],
  meio_ambiente: ["Ambiente", "Agro", "Agronomia", "Ambiental", "Florestal", "Recursos Naturais", "Zootecnia"],
  servico_publico: ["Pública", "Segurança", "Direito", "Serviço Social", "Gestão Pública"],
};

// Fallback keywords per dominant RIASEC type, when the user picked no interests.
const RIASEC_KEYWORDS: Record<RiasecType, string[]> = {
  R: INTEREST_KEYWORDS.industria,
  I: [...INTEREST_KEYWORDS.tecnologia, ...INTEREST_KEYWORDS.saude],
  A: INTEREST_KEYWORDS.artes,
  S: [...INTEREST_KEYWORDS.educacao, ...INTEREST_KEYWORDS.saude],
  E: INTEREST_KEYWORDS.negocios,
  C: INTEREST_KEYWORDS.negocios,
};

export interface CourseLite {
  id: number;
  name: string;
  area: string | null;
  degree: string | null;
}

export interface CompatibleCourses {
  graduate: CourseLite[];
  technological: CourseLite[];
  technical: CourseLite[];
}

/** Compatible courses grouped by type, matched by interest/RIASEC keywords. */
export async function getCompatibleCourses(
  results: TestResults,
  perType = 8
): Promise<CompatibleCourses> {
  const interests = selectedInterests(results);
  let keywords = interests.flatMap((i) => INTEREST_KEYWORDS[i] ?? []);
  if (keywords.length === 0) {
    keywords = topRiasecCodes(results.riasec, 2).flatMap((t) => RIASEC_KEYWORDS[t]);
  }
  keywords = Array.from(new Set(keywords));

  const fetchByType = async (type: string): Promise<CourseLite[]> => {
    const rows = await db.course.findMany({
      where: {
        type,
        OR: keywords.flatMap((kw) => [
          { name: { contains: kw, mode: "insensitive" as const } },
          { area: { contains: kw, mode: "insensitive" as const } },
        ]),
      },
      select: { id: true, name: true, area: true, degree: true },
      distinct: ["name"],
      take: perType,
      orderBy: { name: "asc" },
    });
    return rows;
  };

  const [graduate, technological, technical] = await Promise.all([
    fetchByType("graduate"),
    fetchByType("technological"),
    fetchByType("technical"),
  ]);
  return { graduate, technological, technical };
}
