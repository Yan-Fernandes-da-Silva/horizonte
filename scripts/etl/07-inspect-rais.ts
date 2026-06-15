// ETL 07 — diagnostic: verify RAIS files are extracted and show columns + first rows.
import fs from "node:fs";
import path from "node:path";
import { DATA_DIR } from "./_lib";

const raisDir = path.join(DATA_DIR, "rais", "2025");

const regions = [
  "RAIS_VINC_PUB_NORTE", "RAIS_VINC_PUB_NORDESTE", "RAIS_VINC_PUB_CENTRO_OESTE",
  "RAIS_VINC_PUB_MG_ES_RJ", "RAIS_VINC_PUB_SP", "RAIS_VINC_PUB_SUL", "RAIS_VINC_PUB_NI",
];

console.log("Status de extração dos arquivos RAIS:");
let firstExtracted: string | null = null;
for (const r of regions) {
  const comt = path.join(raisDir, r, `${r}.COMT`);
  const ok = fs.existsSync(comt);
  if (ok) {
    const mb = (fs.statSync(comt).size / 1024 / 1024).toFixed(0);
    console.log(`  ✓ ${r} (${mb} MB)`);
    if (!firstExtracted) firstExtracted = comt;
  } else {
    console.log(`  ✗ ${r} — NÃO extraído (.7z precisa ser descompactado)`);
  }
}

if (!firstExtracted) {
  console.log("\nNenhum arquivo extraído. Descompacte os .7z com o 7-Zip antes de rodar o ETL.");
  process.exit(0);
}

// Show header + first rows of the first extracted file (Latin-1).
const reader = fs.createReadStream(firstExtracted, { encoding: "latin1" });
let buffer = "";
reader.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split(/\r?\n/);
  if (lines.length > 4) {
    reader.destroy();
    const header = lines[0].split(",");
    console.log(`\nColunas (${header.length}) de ${path.basename(firstExtracted)}:`);
    header.forEach((c, i) => console.log(`  [${i}] ${c.replace(/"/g, "")}`));
    console.log("\nPrimeiras linhas:");
    lines.slice(1, 3).forEach((l) => console.log("  " + l.slice(0, 200) + "..."));
  }
});
