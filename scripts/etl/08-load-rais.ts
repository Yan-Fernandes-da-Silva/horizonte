// ETL 08 — RAIS vínculos → per occupation × UF × 2025: average salary/hours/tenure,
// active-bond stock, and age/sex/education/race distributions + disability count.
// Only active bonds on 31/12 are counted (Yan's decision). UF is derived from the
// município IBGE code (RAIS has no UF column). Files are Latin-1, comma-separated,
// multi-GB → streamed line by line, aggregates kept in memory (only summaries stored).
import path from "node:path";
import {
  prisma, DATA_DIR, clean, streamRecords, createInChunks,
  UF_BY_IBGE, regionFromUfCode, RAIS_SEX, RAIS_RACE, RAIS_EDUCATION, RAIS_AGE_RANGE,
} from "./_lib";

const PERIOD = "2025";
const raisDir = path.join(DATA_DIR, "rais", "2025");
const REGION_FILES = [
  "RAIS_VINC_PUB_NORTE", "RAIS_VINC_PUB_NORDESTE", "RAIS_VINC_PUB_CENTRO_OESTE",
  "RAIS_VINC_PUB_MG_ES_RJ", "RAIS_VINC_PUB_SP", "RAIS_VINC_PUB_SUL", "RAIS_VINC_PUB_NI",
];

// RAIS column names (Latin-1 header, exact strings after trimming).
const COL = {
  cbo: "CBO 2002 Ocupação - Código",
  municipality: "Município - Código",
  active: "Ind Vínculo Ativo 31/12 - Código",
  salary: "Vl Rem Média Nom",
  hours: "Qtd Hora Contr",
  tenure: "Tempo Emprego",
  ageRange: "Faixa Etária - Código",
  sex: "Sexo - Código",
  education: "Escolaridade Após 2005 - Código",
  race: "Raça Cor - Código",
  disability: "Ind Portador Defic - Código",
};

interface Acc {
  salarySum: number; salaryCount: number;
  hoursSum: number; hoursCount: number;
  tenureSum: number; tenureCount: number;
  stock: number;
  age: Record<string, number>;
  sex: Record<string, number>;
  education: Record<string, number>;
  race: Record<string, number>;
  disability: number;
}

const newAcc = (): Acc => ({
  salarySum: 0, salaryCount: 0, hoursSum: 0, hoursCount: 0, tenureSum: 0, tenureCount: 0,
  stock: 0, age: {}, sex: {}, education: {}, race: {}, disability: 0,
});

const num = (v: string | undefined): number => {
  const n = parseFloat(clean(v));
  return Number.isFinite(n) ? n : NaN;
};
const bump = (dist: Record<string, number>, label: string | undefined) => {
  if (label) dist[label] = (dist[label] ?? 0) + 1;
};

async function main() {
  const cboCount = await prisma.cboOccupation.count();
  if (cboCount === 0) throw new Error("CboOccupation está vazio — rode a Fase 05 antes.");
  const validCbo = new Set((await prisma.cboOccupation.findMany({ select: { code: true } })).map((o) => o.code));

  const groups = new Map<string, Acc>();
  let orphans = 0;

  for (const region of REGION_FILES) {
    const file = path.join(raisDir, region, `${region}.COMT`);
    let kept = 0;
    const total = await streamRecords(file, { encoding: "latin1", delimiter: "," }, (row, i) => {
      if ((i + 1) % 500000 === 0) console.log(`  ${region}: ${(i + 1).toLocaleString("pt-BR")} linhas...`);
      if (clean(row[COL.active]) !== "1") return; // active bonds on 31/12 only
      const cbo = clean(row[COL.cbo]);
      const ufCode = clean(row[COL.municipality]).slice(0, 2);
      if (!UF_BY_IBGE[ufCode]) return;
      if (!validCbo.has(cbo)) {
        orphans++;
        return;
      }
      const key = `${cbo}|${ufCode}`;
      let acc = groups.get(key);
      if (!acc) groups.set(key, (acc = newAcc()));

      const salary = num(row[COL.salary]);
      if (salary > 0) { acc.salarySum += salary; acc.salaryCount++; }
      const hours = num(row[COL.hours]);
      if (hours > 0) { acc.hoursSum += hours; acc.hoursCount++; }
      const tenure = num(row[COL.tenure]);
      if (Number.isFinite(tenure) && tenure >= 0) { acc.tenureSum += tenure; acc.tenureCount++; }

      acc.stock++;
      bump(acc.age, RAIS_AGE_RANGE[clean(row[COL.ageRange])]);
      bump(acc.sex, RAIS_SEX[clean(row[COL.sex])]);
      bump(acc.education, RAIS_EDUCATION[clean(row[COL.education])]);
      bump(acc.race, RAIS_RACE[clean(row[COL.race])]);
      if (clean(row[COL.disability]) === "1") acc.disability++;
      kept++;
    });
    console.log(`RAIS ${region}: ${total.toLocaleString("pt-BR")} linhas, ${kept.toLocaleString("pt-BR")} vínculos ativos`);
  }

  const round2 = (n: number) => Math.round(n * 100) / 100;
  const rows = Array.from(groups.entries()).map(([key, a]) => {
    const [occupationCode, ufCode] = key.split("|");
    return {
      occupationCode,
      uf: UF_BY_IBGE[ufCode],
      region: regionFromUfCode(ufCode)!,
      period: PERIOD,
      source: "rais",
      avgSalary: a.salaryCount ? round2(a.salarySum / a.salaryCount) : null,
      avgWeeklyHours: a.hoursCount ? round2(a.hoursSum / a.hoursCount) : null,
      avgTenureMonths: a.tenureCount ? round2(a.tenureSum / a.tenureCount) : null,
      stockTotal: a.stock,
      ageDistribution: a.age,
      sexDistribution: a.sex,
      educationDistribution: a.education,
      raceDistribution: a.race,
      disabilityCount: a.disability,
    };
  });

  console.log(`RAIS: ${orphans.toLocaleString("pt-BR")} linhas com CBO/UF inválido ignoradas`);
  await prisma.marketMetrics.deleteMany({ where: { source: "rais" } });
  const inserted = await createInChunks(prisma.marketMetrics, rows);
  console.log(`RAIS: ${inserted} grupos (ocupação × UF) gravados ✓`);
}

main()
  .catch((e) => {
    console.error("RAIS ETL falhou:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
