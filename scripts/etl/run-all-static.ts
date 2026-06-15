// ETL master — runs the static-data loaders in dependency order: CBO → CNAE → QBQ → Courses.
// QBQ depends on CBO (occupation codes); the others are independent.
import { spawnSync } from "node:child_process";

const scripts = [
  "01-load-cbo.ts",
  "02-load-cnae.ts",
  "03-load-qbq.ts",
  "04-load-courses.ts",
];

for (const script of scripts) {
  console.log(`\n▶ ${script}`);
  // shell:true so "npx" resolves to npx.cmd on Windows.
  const res = spawnSync(`npx tsx scripts/etl/${script}`, { stdio: "inherit", shell: true });
  if (res.status !== 0) {
    console.error(`✗ ${script} falhou — interrompendo.`);
    process.exit(res.status ?? 1);
  }
}

console.log("\n✅ ETL estático concluído.");
