"use client";

import { fmtBRL, fmtBRL2 } from "@/lib/labor-market/format";
import type { SalaryView } from "@/lib/labor-market/types";
import { MetricCard } from "../MetricCard";
import { BrazilMap } from "../BrazilMap";
import { SalaryTable } from "../SalaryTable";

interface Props {
  salary: SalaryView;
  selectedRegion: string;
  selectedUf: string;
  onSelectUf: (uf: string) => void;
  onSelectRegion: (region: string) => void;
}

const STRONG = "text-white";

export function SalaryTab({ salary, selectedRegion, selectedUf, onSelectUf, onSelectRegion }: Props) {
  // Hide the per-state table when a single state is already in focus.
  const showByState = !selectedUf;

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <MetricCard>
          <BrazilMap
            values={salary.byState.map((s) => ({ uf: s.uf, value: s.avgSalary }))}
            scheme="salary"
            selectedRegion={selectedRegion}
            selectedUf={selectedUf}
            onSelectUf={onSelectUf}
            onSelectRegion={onSelectRegion}
          />
        </MetricCard>
      </div>

      <div className="space-y-4 lg:col-span-3">
        <div className="grid grid-cols-3 gap-3">
          <MetricCard title="Salário médio" titleClassName={STRONG}>
            <p className="text-2xl font-bold text-white">{fmtBRL(salary.avgSalary)}</p>
            <p className="text-xs text-white/70">{fmtBRL2(salary.hourlyRate)}/hora</p>
          </MetricCard>
          <MetricCard title="Horas contratuais" titleClassName={STRONG}>
            <p className="text-2xl font-bold text-white">{salary.avgWeeklyHours ?? "—"}h</p>
            <p className="text-xs text-white/70">Horas por semana</p>
          </MetricCard>
          <MetricCard title="Duração contratual média" titleClassName={STRONG}>
            <p className="text-2xl font-bold text-white">{salary.avgTenureMonths ?? "—"}</p>
            <p className="text-xs text-white/70">meses</p>
          </MetricCard>
        </div>
        {showByState && (
          <MetricCard>
            <SalaryTable rows={salary.byState} weeklyHours={salary.avgWeeklyHours} />
          </MetricCard>
        )}
      </div>
    </div>
  );
}
