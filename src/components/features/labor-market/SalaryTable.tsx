"use client";

import * as React from "react";
import { ArrowDownUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UF_NAMES } from "@/lib/labor-market/geo";
import { fmtBRL, fmtBRL2, hourlyRate } from "@/lib/labor-market/format";

interface Row {
  uf: string;
  avgSalary: number | null;
}

export function SalaryTable({ rows, weeklyHours }: { rows: Row[]; weeklyHours: number | null }) {
  const [desc, setDesc] = React.useState(true);

  const sorted = React.useMemo(
    () =>
      [...rows]
        .filter((r) => r.avgSalary != null)
        .sort((a, b) => (desc ? b.avgSalary! - a.avgSalary! : a.avgSalary! - b.avgSalary!)),
    [rows, desc]
  );

  if (sorted.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Sem dados de salário por estado.</p>;
  }

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setDesc((d) => !d)} className="border-ocean/30 text-ocean hover:bg-ocean/5">
          <ArrowDownUp className="h-4 w-4" /> {desc ? "Mais pagos" : "Menos pagos"}
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-sand text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-semibold">#</th>
              <th className="px-3 py-2 font-semibold">Estado</th>
              <th className="px-3 py-2 text-right font-semibold">Salário médio</th>
              <th className="px-3 py-2 text-right font-semibold">Valor/hora</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={r.uf} className="border-t border-border">
                <td className="px-3 py-2 text-muted-foreground">{i + 1}º</td>
                <td className="px-3 py-2 font-medium text-ocean">{UF_NAMES[r.uf] ?? r.uf}</td>
                <td className="px-3 py-2 text-right">{fmtBRL(r.avgSalary)}</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{fmtBRL2(hourlyRate(r.avgSalary, weeklyHours))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
