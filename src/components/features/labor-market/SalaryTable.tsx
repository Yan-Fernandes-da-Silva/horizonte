"use client";

import * as React from "react";
import { ArrowDownUp, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UF_NAMES } from "@/lib/labor-market/geo";
import { fmtBRL, fmtBRL2, hourlyRate } from "@/lib/labor-market/format";

interface Row {
  uf: string;
  avgSalary: number | null;
}

const PAGE = 5;

export function SalaryTable({ rows, weeklyHours }: { rows: Row[]; weeklyHours: number | null }) {
  const [desc, setDesc] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);

  const sorted = React.useMemo(
    () =>
      [...rows]
        .filter((r) => r.avgSalary != null)
        .sort((a, b) => (desc ? b.avgSalary! - a.avgSalary! : a.avgSalary! - b.avgSalary!)),
    [rows, desc]
  );

  const canExpand = sorted.length > PAGE;
  const visible = expanded ? sorted : sorted.slice(0, PAGE);

  return (
    <div>
      {/* Title + controls on one line */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Salário por estado</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDesc((d) => !d)}
            className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <ArrowDownUp className="h-4 w-4" /> {desc ? "Mais pagos" : "Menos pagos"}
          </Button>
          {canExpand && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded((e) => !e)}
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              {expanded ? (
                <><ChevronUp className="h-4 w-4" /> Ver menos</>
              ) : (
                <><ChevronDown className="h-4 w-4" /> Ver todos ({sorted.length})</>
              )}
            </Button>
          )}
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-white/70">Sem dados de salário por estado.</p>
      ) : (
        <div className="mt-3 overflow-hidden rounded-xl border border-white/15">
          <table className="w-full text-sm">
            <thead className="bg-white/10 text-left text-xs uppercase text-white/70">
              <tr>
                <th className="px-3 py-2 font-semibold">#</th>
                <th className="px-3 py-2 font-semibold">Estado</th>
                <th className="px-3 py-2 text-right font-semibold">Salário médio</th>
                <th className="px-3 py-2 text-right font-semibold">Valor/hora</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r, i) => (
                <tr key={r.uf} className="border-t border-white/10">
                  <td className="px-3 py-2 text-white/70">{i + 1}º</td>
                  <td className="px-3 py-2 font-medium text-white">{UF_NAMES[r.uf] ?? r.uf}</td>
                  <td className="px-3 py-2 text-right text-white">{fmtBRL(r.avgSalary)}</td>
                  <td className="px-3 py-2 text-right text-white/70">{fmtBRL2(hourlyRate(r.avgSalary, weeklyHours))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
