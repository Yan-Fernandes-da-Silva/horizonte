// ETL 06 — CAGED movements → admissions / dismissals / balance per occupation × UF,
// per monthly period (YYYYMM). Official saldo = movements (CAGEDMOV) minus
// cancellations (CAGEDEXC), so we add MOV counts and subtract EXC counts. UF and
// region are derived from the IBGE UF code. Streamed line by line.
//
// Multi-month & accumulative: every YYYYMM folder under data/caged/ is loaded as its
// own `period`. Each period is replaced in isolation (deleteMany scoped to that
// period), so re-running never wipes the other months. Pass specific months as args
// to load only those, e.g. `npm run etl:caged -- 202601 202602`.
import fs from "node:fs";
import path from "node:path";
import {
  prisma, DATA_DIR, clean, streamRecords, createInChunks,
  UF_BY_IBGE, regionFromUfCode,
} from "./_lib";

const CAGED_DIR = path.join(DATA_DIR, "caged");

/** Find a file named exactly `name` anywhere under `dir` (the txt may sit directly in
 * the period folder or inside a same-named subfolder, depending on how it was unzipped). */
function findFile(dir: string, name: string): string | null {
  if (!fs.existsSync(dir)) return null;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findFile(full, name);
      if (found) return found;
    } else if (entry.name === name) {
      return full;
    }
  }
  return null;
}

/** All YYYYMM period folders present under data/caged/, sorted ascending. */
function discoverPeriods(): string[] {
  if (!fs.existsSync(CAGED_DIR)) return [];
  return fs
    .readdirSync(CAGED_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d{6}$/.test(e.name))
    .map((e) => e.name)
    .sort();
}

interface Acc {
  admissions: number;
  dismissals: number;
}

async function loadPeriod(period: string, validCbo: Set<string>): Promise<number> {
  const periodDir = path.join(CAGED_DIR, period);
  const MOV = findFile(periodDir, `CAGEDMOV${period}.txt`);
  const EXC = findFile(periodDir, `CAGEDEXC${period}.txt`);
  if (!MOV) {
    console.warn(`CAGED ${period}: CAGEDMOV${period}.txt não encontrado — período ignorado.`);
    return 0;
  }

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
  console.log(`CAGED ${period}: ${movRows.toLocaleString("pt-BR")} movimentações lidas`);
  if (EXC) {
    const excRows = await streamRecords(EXC, { encoding: "utf8", delimiter: ";" }, (row) => tally(row, -1));
    console.log(`CAGED ${period}: ${excRows.toLocaleString("pt-BR")} exclusões subtraídas (${orphans} linhas com CBO/UF inválido ignoradas)`);
  } else {
    console.warn(`CAGED ${period}: CAGEDEXC${period}.txt ausente — saldo sem subtração de exclusões.`);
  }

  // Build rows (clamp negatives that can arise when cancellations exceed movements).
  const rows = Array.from(groups.entries()).map(([key, acc]) => {
    const [occupationCode, ufCode] = key.split("|");
    const admissions = Math.max(0, acc.admissions);
    const dismissals = Math.max(0, acc.dismissals);
    return {
      occupationCode,
      uf: UF_BY_IBGE[ufCode],
      region: regionFromUfCode(ufCode)!,
      period,
      source: "caged",
      admissions,
      dismissals,
      balance: admissions - dismissals,
    };
  });

  // Scoped to this period only → accumulates across months and stays re-runnable.
  await prisma.marketMetrics.deleteMany({ where: { source: "caged", period } });
  const inserted = await createInChunks(prisma.marketMetrics, rows);
  console.log(`CAGED ${period}: ${inserted} grupos (ocupação × UF) gravados ✓`);
  return inserted;
}

async function main() {
  // Preflight: CBO must be seeded (FK target).
  const cboCount = await prisma.cboOccupation.count();
  if (cboCount === 0) throw new Error("CboOccupation está vazio — rode a Fase 05 antes.");
  const validCbo = new Set((await prisma.cboOccupation.findMany({ select: { code: true } })).map((o) => o.code));

  // Periods: explicit YYYYMM args, else every folder found under data/caged/.
  const args = process.argv.slice(2).filter((a) => /^\d{6}$/.test(a));
  const periods = args.length ? args : discoverPeriods();
  if (periods.length === 0) {
    throw new Error("Nenhum período (pasta YYYYMM) encontrado em data/caged/.");
  }

  console.log(`CAGED: períodos a carregar → ${periods.join(", ")}`);
  let total = 0;
  for (const period of periods) total += await loadPeriod(period, validCbo);
  console.log(`CAGED: concluído — ${total} grupos gravados em ${periods.length} período(s).`);
}

main()
  .catch((e) => {
    console.error("CAGED ETL falhou:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
