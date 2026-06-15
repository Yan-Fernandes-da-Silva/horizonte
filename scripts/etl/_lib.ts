// Shared helpers for the static-data ETL (Phase 05).
// Scripts read from data/ (read-only) and write cleaned records to the database.
import fs from "node:fs";
import { parse } from "csv-parse/sync";
import { parse as parseStream } from "csv-parse";
import { Prisma, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const DATA_DIR = "data";

// ─── Reference maps for the market ETL (Phase 06) ─────────────────────────────

/** IBGE 2-digit UF code → abbreviation. */
export const UF_BY_IBGE: Record<string, string> = {
  "11": "RO", "12": "AC", "13": "AM", "14": "RR", "15": "PA", "16": "AP", "17": "TO",
  "21": "MA", "22": "PI", "23": "CE", "24": "RN", "25": "PB", "26": "PE", "27": "AL", "28": "SE", "29": "BA",
  "31": "MG", "32": "ES", "33": "RJ", "35": "SP",
  "41": "PR", "42": "SC", "43": "RS",
  "50": "MS", "51": "MT", "52": "GO", "53": "DF",
};

/** Macro-region derived from the first digit of the IBGE UF code. */
export function regionFromUfCode(ufCode: string): string | null {
  switch (ufCode[0]) {
    case "1": return "N";
    case "2": return "NE";
    case "3": return "SE";
    case "4": return "S";
    case "5": return "CO";
    default: return null;
  }
}

export const RAIS_SEX: Record<string, string> = { "1": "Masculino", "2": "Feminino" };

export const RAIS_RACE: Record<string, string> = {
  "1": "Indígena", "2": "Branca", "4": "Negra", "6": "Amarela", "8": "Parda", "9": "Não identificada",
};

export const RAIS_EDUCATION: Record<string, string> = {
  "1": "Analfabeto", "2": "Até 5ª Incompleto", "3": "5ª Completo", "4": "6ª a 9ª Incompleto",
  "5": "Fundamental Completo", "6": "Médio Incompleto", "7": "Médio Completo", "8": "Superior Incompleto",
  "9": "Superior Completo", "10": "Mestrado", "11": "Doutorado",
};

export const RAIS_AGE_RANGE: Record<string, string> = {
  "1": "10 a 14", "2": "15 a 17", "3": "18 a 24", "4": "25 a 29", "5": "30 a 39",
  "6": "40 a 49", "7": "50 a 64", "8": "65 ou mais",
};

/** Collapse repeated whitespace and trim — government text is full of stray spaces. */
export function clean(value: string | undefined | null): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

interface ReadOptions {
  /** "utf8" (default) or "latin1" for the legacy ISO-8859-1 files. */
  encoding?: BufferEncoding;
  /** Field separator. Defaults to ",". */
  delimiter?: string;
  /** Treat lines starting with this char as comments (e.g. "#" in ppg.csv). */
  comment?: string;
}

/**
 * Read a delimited file into an array of objects keyed by (trimmed) header names.
 * Handles quoted fields, embedded newlines, BOM and mixed encodings.
 */
export function readRecords(
  path: string,
  { encoding = "utf8", delimiter = ",", comment }: ReadOptions = {}
): Record<string, string>[] {
  const content = fs.readFileSync(path, encoding);
  return parse(content, {
    columns: (header: string[]) => header.map((h) => h.trim()),
    delimiter,
    bom: true,
    comment,
    relax_column_count: true,
    skip_empty_lines: true,
    trim: true,
  });
}

/** A model that can be upserted by its string `code` primary key. */
type UpsertByCodeModel<T> = {
  upsert: (args: {
    where: { code: string };
    create: T;
    update: Omit<T, "code">;
  }) => Prisma.PrismaPromise<unknown>;
};

/**
 * Upsert rows keyed by their `code` (the model @id), in chunked transactions.
 * Used for the CBO/CNAE hierarchies so the loaders are safely re-runnable.
 */
export async function upsertByCode<T extends { code: string }>(
  model: UpsertByCodeModel<T>,
  rows: T[],
  chunk = 200
): Promise<void> {
  for (let i = 0; i < rows.length; i += chunk) {
    await prisma.$transaction(
      rows.slice(i, i + chunk).map((row) => {
        const { code, ...rest } = row;
        return model.upsert({ where: { code }, create: row, update: rest as Omit<T, "code"> });
      })
    );
  }
}

/**
 * Stream a (potentially multi-GB) delimited file line by line, calling `onRecord`
 * for each row. Never loads the whole file into memory. Returns the row count.
 */
export async function streamRecords(
  path: string,
  { encoding = "utf8", delimiter = ";" }: ReadOptions,
  onRecord: (row: Record<string, string>, index: number) => void
): Promise<number> {
  const parser = fs.createReadStream(path, { encoding }).pipe(
    parseStream({
      columns: (header: string[]) => header.map((h) => h.trim()),
      delimiter,
      bom: true,
      relax_column_count: true,
      skip_empty_lines: true,
    })
  );
  let i = 0;
  for await (const row of parser as AsyncIterable<Record<string, string>>) {
    onRecord(row, i);
    i++;
  }
  return i;
}

/** Insert rows in chunks via createMany (fast path for large, non-keyed tables). */
export async function createInChunks<T>(
  model: { createMany: (args: { data: T[] }) => Promise<{ count: number }> },
  rows: T[],
  chunkSize = 2000
): Promise<number> {
  let total = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const res = await model.createMany({ data: chunk });
    total += res.count;
  }
  return total;
}
