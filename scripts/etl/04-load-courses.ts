// ETL 04 — Courses (technical, technological, graduate, postgraduate).
// Four very different source files are normalized into one `Course` model.
// Course has no natural key → clear the whole table, then reinsert (re-runnable).
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { prisma, DATA_DIR, clean, readRecords, createInChunks } from "./_lib";

const qual = path.join(DATA_DIR, "qualification", "course");

interface CourseRow {
  name: string;
  type: string;
  area: string | null;
  subarea: string | null;
  institution: string | null;
  duration: string | null;
  degree: string | null;
}

const nn = (v: string | undefined): string | null => clean(v) || null;

/** "800" → "800h"; leaves things like "4 anos" untouched. */
function fmtDuration(v: string | undefined): string | null {
  const c = clean(v);
  if (!c) return null;
  return /^\d+$/.test(c) ? `${c}h` : c;
}

function dedupe(rows: CourseRow[], keyOf: (r: CourseRow) => string): CourseRow[] {
  const map = new Map<string, CourseRow>();
  for (const r of rows) if (!map.has(keyOf(r))) map.set(keyOf(r), r);
  return Array.from(map.values());
}

/** Graduate file is ~900k offering rows → stream it and dedupe by name+degree+area. */
async function loadGraduate(): Promise<CourseRow[]> {
  const file = path.join(qual, "superior", "graduate", "Curso Superior.csv");
  const parser = fs.createReadStream(file).pipe(
    parse({
      columns: (h: string[]) => h.map((x) => x.trim()),
      bom: true,
      relax_column_count: true,
      skip_empty_lines: true,
      trim: true,
    })
  );
  const map = new Map<string, CourseRow>();
  for await (const r of parser as AsyncIterable<Record<string, string>>) {
    const name = clean(r.NOME_CURSO);
    if (!name) continue;
    const degree = nn(r.GRAU);
    const area = nn(r.AREA_OCDE_CINE) ?? nn(r.AREA_OCDE);
    const key = `${name}|${degree}|${area}`;
    if (!map.has(key)) {
      map.set(key, { name, type: "graduate", area, subarea: null, institution: null, duration: null, degree });
    }
  }
  return Array.from(map.values());
}

function loadTechnical(): CourseRow[] {
  const file = path.join(qual, "technical", "cnct.csv");
  const rows = readRecords(file, { encoding: "latin1", delimiter: ";" }).map((r) => ({
    name: clean(r["Denominação do Curso"]),
    type: "technical",
    area: nn(r["Eixo Tecnológico"]),
    subarea: nn(r["Área Tecnológica"]),
    institution: null,
    duration: fmtDuration(r["Carga Horária Mínima"]),
    degree: "Técnico",
  }));
  return dedupe(rows.filter((r) => r.name), (r) => r.name);
}

function loadTechnological(): CourseRow[] {
  const file = path.join(qual, "superior", "technological", "cncst.csv");
  const rows = readRecords(file, { encoding: "latin1", delimiter: ";" }).map((r) => ({
    name: clean(r["Denominação do Curso"]),
    type: "technological",
    area: nn(r["Eixo Tecnológico"]),
    subarea: nn(r["Área Tecnológica"]),
    institution: null,
    duration: fmtDuration(r["Carga Horária Mínima"]),
    degree: "Tecnólogo",
  }));
  return dedupe(rows.filter((r) => r.name), (r) => r.name);
}

function loadPostgraduate(): CourseRow[] {
  const file = path.join(qual, "superior", "postgraduate", "ppg.csv");
  const rows = readRecords(file, { comment: "#" }).map((r) => ({
    name: clean(r["Nome do programa"]),
    type: "postgraduate",
    area: nn(r["Grande área de conhecimento"]),
    subarea: nn(r["Área de Avaliação"]),
    institution: nn(r["Nome IES"]),
    duration: null,
    degree: nn(r["Grau acadêmico Atual do PPG"]),
  }));
  return dedupe(rows.filter((r) => r.name), (r) => `${r.name}|${r.degree}|${r.institution}`);
}

async function main() {
  await prisma.course.deleteMany();

  const graduate = await loadGraduate();
  console.log(`Cursos graduação: ${await createInChunks(prisma.course, graduate)} (distintos)`);

  const technical = loadTechnical();
  console.log(`Cursos técnicos: ${await createInChunks(prisma.course, technical)}`);

  const technological = loadTechnological();
  console.log(`Cursos tecnológicos: ${await createInChunks(prisma.course, technological)}`);

  const postgraduate = loadPostgraduate();
  console.log(`Cursos pós-graduação: ${await createInChunks(prisma.course, postgraduate)} ✓`);
}

main()
  .catch((e) => {
    console.error("Courses ETL falhou:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
