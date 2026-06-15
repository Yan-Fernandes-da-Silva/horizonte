// Shared helpers for the static-data ETL (Phase 05).
// Scripts read from data/ (read-only) and write cleaned records to the database.
import fs from "node:fs";
import { parse } from "csv-parse/sync";
import { Prisma, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const DATA_DIR = "data";

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
