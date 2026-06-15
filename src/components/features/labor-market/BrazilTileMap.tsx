"use client";

import { cn } from "@/lib/utils";
import { REGIONS, UF_BY_REGION } from "@/lib/labor-market/geo";
import type { StateMetric } from "@/lib/labor-market/types";

interface Props {
  byState: StateMetric[];
  selectedUf: string;
  metric?: "balance" | "salary";
  onSelectUf: (uf: string) => void;
  onSelectRegion: (region: string) => void;
}

// Color a tile by the chosen metric: green (positive balance) → red (negative).
function tileColor(value: number | null, metric: "balance" | "salary"): string {
  if (value == null) return "#E2E8F0";
  if (metric === "balance") {
    if (value > 0) return "#10B981";
    if (value < 0) return "#E76F51";
    return "#94A3B8";
  }
  return "#00B4D8"; // salary tiles use a single hue; intensity via opacity handled inline
}

export function BrazilTileMap({ byState, selectedUf, metric = "balance", onSelectUf, onSelectRegion }: Props) {
  const map = new Map(byState.map((s) => [s.uf, s]));

  return (
    <div className="space-y-3">
      {REGIONS.map((r) => {
        const ufs = UF_BY_REGION[r.code].filter((u) => map.has(u));
        if (ufs.length === 0) return null;
        return (
          <div key={r.code}>
            <button
              type="button"
              onClick={() => onSelectRegion(r.code)}
              className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-sky"
            >
              {r.label}
            </button>
            <div className="flex flex-wrap gap-1.5">
              {ufs.map((u) => {
                const s = map.get(u)!;
                const value = metric === "balance" ? s.balance : s.avgSalary;
                const active = selectedUf === u;
                return (
                  <button
                    key={u}
                    type="button"
                    title={`${u}: ${metric === "balance" ? `saldo ${s.balance.toLocaleString("pt-BR")}` : `R$ ${s.avgSalary?.toLocaleString("pt-BR") ?? "—"}`}`}
                    onClick={() => onSelectUf(u)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-md text-xs font-bold text-white shadow-sm transition-transform hover:scale-110",
                      active && "ring-2 ring-ocean ring-offset-1"
                    )}
                    style={{ backgroundColor: tileColor(value, metric) }}
                  >
                    {u}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><i className="h-3 w-3 rounded" style={{ background: "#10B981" }} /> Saldo positivo</span>
        <span className="flex items-center gap-1"><i className="h-3 w-3 rounded" style={{ background: "#E76F51" }} /> Saldo negativo</span>
      </div>
    </div>
  );
}
