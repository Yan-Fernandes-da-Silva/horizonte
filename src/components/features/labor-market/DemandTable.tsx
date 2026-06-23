"use client";

import * as React from "react";
import { ArrowDownUp, ChevronDown, ChevronUp, Repeat } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UF_NAMES } from "@/lib/labor-market/geo";
import { fmtNum } from "@/lib/labor-market/format";
import type { StateMetric } from "@/lib/labor-market/types";

export type DemandMetric = "admissions" | "dismissals";

const PAGE = 5;
const METRIC_LABEL: Record<DemandMetric, string> = {
  admissions: "Admissões",
  dismissals: "Desligamentos",
};

/**
 * Per-state demand ranking — mirrors SalaryTable's look and controls:
 * - a metric switch (Admissões ↔ Desligamentos) that also recolors the map,
 * - a sort switch (Mais ↔ Menos) in the same "Mais pagos/Menos pagos" style,
 * - a "Ver todos (27) / Ver menos" expander.
 */
export function DemandTable({
  rows,
  metric,
  onMetricChange,
}: {
  rows: StateMetric[];
  metric: DemandMetric;
  onMetricChange: (m: DemandMetric) => void;
}) {
  const [desc, setDesc] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);

  const sorted = React.useMemo(
    () => [...rows].sort((a, b) => (desc ? b[metric] - a[metric] : a[metric] - b[metric])),
    [rows, metric, desc]
  );

  const canExpand = sorted.length > PAGE;
  const visible = expanded ? sorted : sorted.slice(0, PAGE);
  const label = METRIC_LABEL[metric];

  return (
    <div>
      {/* Title + controls on one line (same layout as SalaryTable) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Demanda por estados</h3>
        {/* Pushed to the right even when the controls wrap to their own line. */}
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMetricChange(metric === "admissions" ? "dismissals" : "admissions")}
            className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <Repeat className="h-4 w-4" /> {label}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDesc((d) => !d)}
            className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <ArrowDownUp className="h-4 w-4" /> {desc ? `Mais ${label.toLowerCase()}` : `Menos ${label.toLowerCase()}`}
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
        <p className="py-6 text-center text-sm text-white/70">Sem dados por estado.</p>
      ) : (
        <div className="mt-3 overflow-hidden rounded-xl border border-white/15">
          <table className="w-full text-sm">
            <thead className="bg-white/10 text-left text-xs uppercase text-white/70">
              <tr>
                <th className="px-3 py-2 font-semibold">#</th>
                <th className="px-3 py-2 font-semibold">Estado</th>
                <th className="px-3 py-2 text-right font-semibold">{label}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r, i) => (
                <tr key={r.uf} className="border-t border-white/10">
                  <td className="px-3 py-2 text-white/70">{i + 1}º</td>
                  <td className="px-3 py-2 font-medium text-white">{UF_NAMES[r.uf] ?? r.uf}</td>
                  <td className="px-3 py-2 text-right text-white">{fmtNum(r[metric])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
