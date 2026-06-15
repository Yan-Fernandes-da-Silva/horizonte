// ETL 05 — diagnostic: show CAGEDMOV columns and the first few rows.
import fs from "node:fs";
import path from "node:path";
import { DATA_DIR } from "./_lib";

const file = path.join(DATA_DIR, "caged", "202604", "CAGEDMOV202604", "CAGEDMOV202604.txt");

const reader = fs.createReadStream(file, { encoding: "utf8" });
let buffer = "";
let lines: string[] = [];

reader.on("data", (chunk) => {
  buffer += chunk;
  lines = buffer.split(/\r?\n/);
  if (lines.length > 6) reader.destroy(); // we only need the header + 5 rows
});

reader.on("close", () => {
  const header = lines[0].split(";");
  console.log(`Colunas (${header.length}):`);
  header.forEach((c, i) => console.log(`  [${i}] ${c}`));
  console.log("\nPrimeiras linhas:");
  lines.slice(1, 6).forEach((l) => console.log("  " + l));
});
