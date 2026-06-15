"use client";

import { fmtBRL, fmtBRL2 } from "@/lib/labor-market/format";
import type { SalaryView } from "@/lib/labor-market/types";
import { MetricCard } from "../MetricCard";
import { BrazilTileMap } from "../BrazilTileMap";
import { SalaryTable } from "../SalaryTable";

interface Props {
  salary: SalaryView;
  selectedUf: string;
  onSelectUf: (uf: string) => void;
  onSelectRegion: (region: string) => void;
}

export function SalaryTab({ salary, selectedUf, onSelectUf, onSelectRegion }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <MetricCard title="Mapa do Brasil — salário por estado">
          <BrazilTileMap
            byState={salary.byState.map((s) => ({
              uf: s.uf, region: "", admissions: 0, dismissals: 0, balance: 0,
              avgSalary: s.avgSalary, stockTotal: 0,
            }))}
            selectedUf={selectedUf}
            metric="salary"
            onSelectUf={onSelectUf}
            onSelectRegion={onSelectRegion}
          />
        </MetricCard>
      </div>

      <div className="space-y-4 lg:col-span-3">
        <div className="grid grid-cols-3 gap-3">
          <MetricCard title="Salário médio">
            <p className="text-2xl font-bold text-ocean">{fmtBRL(salary.avgSalary)}</p>
            <p className="text-xs text-muted-foreground">{fmtBRL2(salary.hourlyRate)}/hora</p>
          </MetricCard>
          <MetricCard title="Horas/semana">
            <p className="text-2xl font-bold text-ocean">{salary.avgWeeklyHours ?? "—"}h</p>
          </MetricCard>
          <MetricCard title="Duração média">
            <p className="text-2xl font-bold text-ocean">{salary.avgTenureMonths ?? "—"}</p>
            <p className="text-xs text-muted-foreground">meses</p>
          </MetricCard>
        </div>
        <MetricCard title="Salário por estado">
          <SalaryTable rows={salary.byState} weeklyHours={salary.avgWeeklyHours} />
        </MetricCard>
      </div>
    </div>
  );
}
