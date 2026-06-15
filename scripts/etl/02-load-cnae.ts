// ETL 02 — CNAE 2.0 hierarchy (section → division → group → class → subclass).
// Same id→code parent-linking trick as CBO. The 4_class.csv file is Latin-1 and
// malformed (see readClassFile); the other files are clean UTF-8 comma CSVs.
import fs from "node:fs";
import path from "node:path";
import { prisma, DATA_DIR, clean, readRecords, upsertByCode } from "./_lib";

const dir = path.join(DATA_DIR, "cnae");

/**
 * 4_class.csv is malformed: Latin-1, every physical line is its own quoted, ";;"-
 * terminated fragment, and labels with an internal line break are split across two
 * such fragments, e.g.:
 *   "121,16.29-3,Fabricação ... exceto";;
 *   "móveis,46";;
 * The only reliable signal is semantic: a real record starts with "<id>,<class-code>"
 * (e.g. 121,16.29-3); any other fragment is a continuation of the previous label.
 */
function readClassFile(file: string) {
  const raw = fs.readFileSync(file, "latin1");
  const rows: { id: string; code: string; label: string; group_id: string }[] = [];

  const fragments = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/;+\s*$/, "").replace(/^"/, "").replace(/"$/, "").replace(/""/g, '"'));

  const records: string[] = [];
  let cur: string | null = null;
  for (const frag of fragments) {
    if (/^\d+,\d{2}\.\d{2}-\d/.test(frag)) {
      if (cur !== null) records.push(cur);
      cur = frag;
    } else if (cur !== null) {
      cur += " " + frag; // continuation of a wrapped label
    }
  }
  if (cur !== null) records.push(cur);

  for (const record of records) {
    const m = record.match(/^(\d+),([^,]+),(.*),(\d+)$/);
    if (!m) continue;
    rows.push({ id: m[1], code: m[2], label: clean(m[3]), group_id: m[4] });
  }
  return rows;
}

async function main() {
  // 1) Sections
  const sections = readRecords(path.join(dir, "1_section.csv"));
  const sectionIdToCode = new Map<string, string>();
  const secRows = sections.map((r) => {
    sectionIdToCode.set(r.id, r.code);
    return { code: clean(r.code), title: clean(r.label) };
  });
  await upsertByCode(prisma.cnaeSection, secRows);
  console.log(`CNAE: ${secRows.length} seções`);

  // 2) Divisions → section
  const divisions = readRecords(path.join(dir, "2_division.csv"));
  const divisionIdToCode = new Map<string, string>();
  const divRows = divisions.map((r) => {
    divisionIdToCode.set(r.id, r.code);
    return { code: clean(r.code), title: clean(r.label), sectionCode: sectionIdToCode.get(r.section_id)! };
  });
  await upsertByCode(prisma.cnaeDivision, divRows);
  console.log(`CNAE: ${divRows.length} divisões`);

  // 3) Groups → division
  const groups = readRecords(path.join(dir, "3_group.csv"));
  const groupIdToCode = new Map<string, string>();
  const grpRows = groups.map((r) => {
    groupIdToCode.set(r.id, r.code);
    return { code: clean(r.code), title: clean(r.label), divisionCode: divisionIdToCode.get(r.division_id)! };
  });
  await upsertByCode(prisma.cnaeGroup, grpRows);
  console.log(`CNAE: ${grpRows.length} grupos`);

  // 4) Classes → group (special malformed file)
  const classes = readClassFile(path.join(dir, "4_class.csv"));
  const classIdToCode = new Map<string, string>();
  const clsRows = classes.map((r) => {
    classIdToCode.set(r.id, r.code);
    return { code: clean(r.code), title: clean(r.label), groupCode: groupIdToCode.get(r.group_id)! };
  });
  await upsertByCode(prisma.cnaeClass, clsRows);
  console.log(`CNAE: ${clsRows.length} classes`);

  // 5) Subclasses → class
  const subclasses = readRecords(path.join(dir, "5_subclass.csv"));
  const subRows = subclasses.map((r) => ({
    code: clean(r.code),
    title: clean(r.label),
    classCode: classIdToCode.get(r.class_id)!,
  }));
  await upsertByCode(prisma.cnaeSubclass, subRows);
  console.log(`CNAE: ${subRows.length} subclasses carregadas ✓`);
}

main()
  .catch((e) => {
    console.error("CNAE ETL falhou:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
