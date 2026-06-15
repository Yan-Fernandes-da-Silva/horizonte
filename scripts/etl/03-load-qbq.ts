// ETL 03 — QBQ (knowledges, skills, attitudes) per occupation.
// QBQ files reference the occupation by `occupation_id` (the autoincrement id from
// 5_occupations.csv), NOT the 6-digit CBO code — so we rebuild that id→code map first.
// These tables have no natural key → clear-and-reinsert keeps the script re-runnable.
import path from "node:path";
import { prisma, DATA_DIR, clean, readRecords, createInChunks } from "./_lib";

const cboDir = path.join(DATA_DIR, "cbo");
const qbqDir = path.join(DATA_DIR, "qbq");

interface QbqRow {
  occupationCode: string;
  description: string;
}

/** Map occupation rows → { id → 6-digit code } from the CBO occupations file. */
function buildOccupationIdToCode(): Map<string, string> {
  const occupations = readRecords(path.join(cboDir, "5_occupations.csv"));
  const map = new Map<string, string>();
  for (const r of occupations) map.set(r.id, clean(r.code));
  return map;
}

/** Read a QBQ file, resolve occupation codes, drop orphan rows, return clean rows. */
function buildRows(
  file: string,
  descriptionField: string,
  idToCode: Map<string, string>
): { rows: QbqRow[]; orphans: number } {
  const records = readRecords(path.join(qbqDir, file));
  const rows: QbqRow[] = [];
  let orphans = 0;
  for (const r of records) {
    const code = idToCode.get(r.occupation_id);
    const description = clean(r[descriptionField]);
    if (!code) {
      orphans++;
      continue;
    }
    if (!description) continue;
    rows.push({ occupationCode: code, description });
  }
  return { rows, orphans };
}

async function main() {
  const idToCode = buildOccupationIdToCode();

  // Clear first (children of CboOccupation, nothing references them).
  await prisma.qbqKnowledge.deleteMany();
  await prisma.qbqSkill.deleteMany();
  await prisma.qbqAttitude.deleteMany();

  const knowledge = buildRows("3_knowledges.csv", "subject_label", idToCode);
  const inserted1 = await createInChunks(prisma.qbqKnowledge, knowledge.rows, 5000);
  console.log(`QBQ conhecimentos: ${inserted1} inseridos (${knowledge.orphans} órfãos ignorados)`);

  const skills = buildRows("4_skills.csv", "capacity_label", idToCode);
  const inserted2 = await createInChunks(prisma.qbqSkill, skills.rows, 5000);
  console.log(`QBQ habilidades: ${inserted2} inseridas (${skills.orphans} órfãos ignorados)`);

  const attitudes = buildRows("5_attitudes.csv", "attitude_label", idToCode);
  const inserted3 = await createInChunks(prisma.qbqAttitude, attitudes.rows, 5000);
  console.log(`QBQ atitudes: ${inserted3} inseridas (${attitudes.orphans} órfãos ignorados) ✓`);
}

main()
  .catch((e) => {
    console.error("QBQ ETL falhou:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
