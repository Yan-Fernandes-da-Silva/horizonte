// ETL 06 — CAGED movements → admissions / dismissals / balance per occupation × UF.
// Official saldo = movements (CAGEDMOV) minus cancellations (CAGEDEXC), so we add
// MOV counts and subtract EXC counts. UF and region are derived from the IBGE UF
// code (the file's "região" column uses an unreliable coding). Streamed line by line.
import path from "node:path";
import {
  prisma, DATA_DIR, clean, streamRecords, createInChunks,
  UF_BY_IBGE, regionFromUfCode,
} from "./_lib";

const PERIOD = "202604";
const cagedDir = path.join(DATA_DIR, "caged", PERIOD);
const MOV = path.join(cagedDir, "CAGEDMOV202604", "CAGEDMOV202604.txt");
const EXC = path.join(cagedDir, "CAGEDEXC202604", "CAGEDEXC202604.txt");

interface Acc {
  admissions: number;
  dismissals: number;
}

async function main() {
  // Preflight: CBO must be seeded (FK target).
  const cboCount = await prisma.cboOccupation.count();
  if (cboCount === 0) throw new Error("CboOccupation está vazio — rode a Fase 05 antes.");
  const validCbo = new Set((await prisma.cboOccupation.findMany({ select: { code: true } })).map((o) => o.code));

  const groups = new Map<string, Acc>();
  let orphans = 0;

  // sign = +1 for movements, -1 for cancellations.
  const tally = (row: Record<string, string>, sign: number) => {
    const cbo = clean(row["cbo2002ocupação"]);
    const ufCode = clean(row["uf"]);
    if (!UF_BY_IBGE[ufCode]) return;
    if (!validCbo.has(cbo)) {
      orphans++;
      return;
    }
    const key = `${cbo}|${ufCode}`;
    const acc = groups.get(key) ?? { admissions: 0, dismissals: 0 };
    const saldo = clean(row["saldomovimentação"]);
    if (saldo === "1") acc.admissions += sign;
    else if (saldo === "-1") acc.dismissals += sign;
    groups.set(key, acc);
  };

  const movRows = await streamRecords(MOV, { encoding: "utf8", delimiter: ";" }, (row) => tally(row, +1));
  console.log(`CAGED: ${movRows.toLocaleString("pt-BR")} movimentações lidas`);
  const excRows = await streamRecords(EXC, { encoding: "utf8", delimiter: ";" }, (row) => tally(row, -1));
  console.log(`CAGED: ${excRows.toLocaleString("pt-BR")} exclusões subtraídas (${orphans} linhas com CBO/UF inválido ignoradas)`);

  // Build rows (clamp negatives that can arise when cancellations exceed movements).
  const rows = Array.from(groups.entries()).map(([key, acc]) => {
    const [occupationCode, ufCode] = key.split("|");
    const admissions = Math.max(0, acc.admissions);
    const dismissals = Math.max(0, acc.dismissals);
    return {
      occupationCode,
      uf: UF_BY_IBGE[ufCode],
      region: regionFromUfCode(ufCode)!,
      period: PERIOD,
      source: "caged",
      admissions,
      dismissals,
      balance: admissions - dismissals,
    };
  });

  await prisma.marketMetrics.deleteMany({ where: { source: "caged" } });
  const inserted = await createInChunks(prisma.marketMetrics, rows);
  console.log(`CAGED: ${inserted} grupos (ocupação × UF) gravados ✓`);
}

main()
  .catch((e) => {
    console.error("CAGED ETL falhou:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
