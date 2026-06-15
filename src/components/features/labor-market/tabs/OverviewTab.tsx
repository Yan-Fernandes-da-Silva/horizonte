import { UF_NAMES } from "@/lib/labor-market/geo";
import {
  CONCORRENCIA_HINT, LEVEL_COLOR, ROTATIVIDADE_HINT, fmtBRL, fmtNum,
} from "@/lib/labor-market/format";
import type { DashboardData, Level } from "@/lib/labor-market/types";
import { MetricCard } from "../MetricCard";
import { MarketGauge } from "../charts/MarketGauge";

function LevelBadge({ level, hint }: { level: Level; hint: string }) {
  return (
    <div>
      <span
        className="inline-flex rounded-full px-3 py-1 text-sm font-bold text-white"
        style={{ backgroundColor: LEVEL_COLOR[level] }}
      >
        {level}
      </span>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-ocean">{value}</span>
    </div>
  );
}

export function OverviewTab({ data }: { data: DashboardData }) {
  const { overview, market } = data;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard title="Situação do mercado">
        <MarketGauge situation={overview.situation} />
      </MetricCard>
      <MetricCard title="Rotatividade">
        <LevelBadge level={overview.rotatividade} hint={ROTATIVIDADE_HINT[overview.rotatividade]} />
      </MetricCard>
      <MetricCard title="Concorrência">
        <LevelBadge level={overview.concorrencia} hint={CONCORRENCIA_HINT[overview.concorrencia]} />
      </MetricCard>

      <MetricCard title="Mercado">
        <Line label="Saldo do período" value={fmtNum(market.balance)} />
        <Line label="Mais admissões" value={overview.topAdmissionState ? UF_NAMES[overview.topAdmissionState] : "—"} />
        <Line label="Menos admissões" value={overview.bottomAdmissionState ? UF_NAMES[overview.bottomAdmissionState] : "—"} />
      </MetricCard>
      <MetricCard title="Remuneração">
        <Line label="Salário médio" value={fmtBRL(overview.avgSalary)} />
        <Line label="Horas contratuais" value={overview.avgWeeklyHours ? `${overview.avgWeeklyHours}h/sem` : "—"} />
        <Line label="Duração média" value={overview.avgTenureMonths ? `${overview.avgTenureMonths} meses` : "—"} />
      </MetricCard>
      <MetricCard title="Perfil">
        <Line label="Sexo predominante" value={overview.predominantSex ?? "—"} />
        <Line label="Escolaridade modal" value={overview.predominantEducation ?? "—"} />
        <Line label="Faixa etária modal" value={overview.modalAgeRange ?? "—"} />
      </MetricCard>
    </div>
  );
}
