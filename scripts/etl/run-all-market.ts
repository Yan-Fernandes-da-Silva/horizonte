// ETL master (market) — runs CAGED then RAIS. Preflight: CBO must be seeded.
import { spawnSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  const cboCount = await prisma.cboOccupation.count();
  await prisma.$disconnect();
  if (cboCount === 0) {
    console.error("✗ CboOccupation está vazio — rode a Fase 05 (npm run etl:static) antes.");
    process.exit(1);
  }

  for (const script of ["06-load-caged.ts", "08-load-rais.ts"]) {
    console.log(`\n▶ ${script}`);
    const res = spawnSync(`npx tsx scripts/etl/${script}`, { stdio: "inherit", shell: true });
    if (res.status !== 0) {
      console.error(`✗ ${script} falhou — interrompendo.`);
      process.exit(res.status ?? 1);
    }
  }
  console.log("\n✅ ETL de mercado concluído.");
}

main();
