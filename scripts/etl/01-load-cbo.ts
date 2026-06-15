// ETL 01 — CBO hierarchy (large group → main subgroup → subgroup → family → occupation).
// Child files link to their parent by the parent's autoincrement `id`, NOT its code,
// so we build an id→code map at each level and resolve the parent code from it.
import path from "node:path";
import { prisma, DATA_DIR, clean, readRecords, upsertByCode } from "./_lib";

const dir = path.join(DATA_DIR, "cbo");

async function main() {
  // 1) Large groups
  const largeGroups = readRecords(path.join(dir, "1_large_groups.csv"));
  const largeGroupIdToCode = new Map<string, string>();
  const lgRows = largeGroups.map((r) => {
    largeGroupIdToCode.set(r.id, r.code);
    return { code: clean(r.code), title: clean(r.label) };
  });
  await upsertByCode(prisma.cboLargeGroup, lgRows);
  console.log(`CBO: ${lgRows.length} grandes grupos`);

  // 2) Main subgroups → largeGroup
  const mainSubgroups = readRecords(path.join(dir, "2_main_subgroups.csv"));
  const mainSubgroupIdToCode = new Map<string, string>();
  const msRows = mainSubgroups.map((r) => {
    mainSubgroupIdToCode.set(r.id, r.code);
    return {
      code: clean(r.code),
      title: clean(r.label),
      largeGroupCode: largeGroupIdToCode.get(r.large_group_id)!,
    };
  });
  await upsertByCode(prisma.cboMainSubgroup, msRows);
  console.log(`CBO: ${msRows.length} subgrupos principais`);

  // 3) Subgroups → mainSubgroup
  const subgroups = readRecords(path.join(dir, "3_subgroups.csv"));
  const subgroupIdToCode = new Map<string, string>();
  const sgRows = subgroups.map((r) => {
    subgroupIdToCode.set(r.id, r.code);
    return {
      code: clean(r.code),
      title: clean(r.label),
      mainSubgroupCode: mainSubgroupIdToCode.get(r.main_subgroup_id)!,
    };
  });
  await upsertByCode(prisma.cboSubgroup, sgRows);
  console.log(`CBO: ${sgRows.length} subgrupos`);

  // 4) Families → subgroup
  const families = readRecords(path.join(dir, "4_families.csv"));
  const familyIdToCode = new Map<string, string>();
  const famRows = families.map((r) => {
    familyIdToCode.set(r.id, r.code);
    return {
      code: clean(r.code),
      title: clean(r.label),
      subgroupCode: subgroupIdToCode.get(r.subgroup_id)!,
    };
  });
  await upsertByCode(prisma.cboFamily, famRows);
  console.log(`CBO: ${famRows.length} famílias`);

  // 5) Occupations → family
  const occupations = readRecords(path.join(dir, "5_occupations.csv"));
  const occRows = occupations.map((r) => ({
    code: clean(r.code),
    title: clean(r.label),
    familyCode: familyIdToCode.get(r.family_id)!,
  }));
  await upsertByCode(prisma.cboOccupation, occRows);
  console.log(`CBO: ${occRows.length} ocupações carregadas ✓`);
}

main()
  .catch((e) => {
    console.error("CBO ETL falhou:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
