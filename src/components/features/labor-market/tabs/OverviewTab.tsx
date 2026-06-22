import { Activity, RefreshCw, Users, TrendingUp, Wallet, UserRound } from "lucide-react";

import { UF_NAMES } from "@/lib/labor-market/geo";
import {
  CONCORRENCIA_HINT, LEVEL_COLOR, ROTATIVIDADE_HINT, SITUATION_COLOR,
  fmtBRL, fmtNum,
} from "@/lib/labor-market/format";
import type { DashboardData } from "@/lib/labor-market/types";
import { MetricCard } from "../MetricCard";
import { MarketGauge } from "../charts/MarketGauge";

const STRONG_TITLE = "text-white";

/** Colored status pill shown to the right of a card title. */
function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

/** Two-line description block, vertically aligned across the top three cards. */
function Hint({ children }: { children: React.ReactNode }) {
  return <p className="flex min-h-[2.5rem] items-start text-sm text-white/80">{children}</p>;
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span className="text-sm text-white/70">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

export function OverviewTab({ data }: { data: DashboardData }) {
  const { overview, market } = data;

  // State with the most dismissals (replaces the old "Menos admissões").
  const topDismissalState =
    [...market.byState].sort((a, b) => b.dismissals - a.dismissals)[0]?.uf ?? null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard
        title="Situação"
        icon={Activity}
        titleClassName={STRONG_TITLE}
        action={<Tag label={overview.situation} color={SITUATION_COLOR[overview.situation]} />}
        bodyClassName="flex flex-1 items-center"
      >
        <div className="w-full">
          <MarketGauge situation={overview.situation} showLabel={false} />
        </div>
      </MetricCard>

      <MetricCard
        title="Rotatividade"
        icon={RefreshCw}
        titleClassName={STRONG_TITLE}
        action={<Tag label={overview.rotatividade} color={LEVEL_COLOR[overview.rotatividade]} />}
      >
        <Hint>{ROTATIVIDADE_HINT[overview.rotatividade]}</Hint>
      </MetricCard>

      <MetricCard
        title="Concorrência"
        icon={Users}
        titleClassName={STRONG_TITLE}
        action={<Tag label={overview.concorrencia} color={LEVEL_COLOR[overview.concorrencia]} />}
      >
        <Hint>{CONCORRENCIA_HINT[overview.concorrencia]}</Hint>
      </MetricCard>

      <MetricCard title="Mercado" icon={TrendingUp} titleClassName={STRONG_TITLE}>
        <Line label="Saldo do período" value={fmtNum(market.balance)} />
        <Line label="Mais admissões" value={overview.topAdmissionState ? UF_NAMES[overview.topAdmissionState] : "—"} />
        <Line label="Mais desligamentos" value={topDismissalState ? UF_NAMES[topDismissalState] : "—"} />
      </MetricCard>
      <MetricCard title="Remuneração" icon={Wallet} titleClassName={STRONG_TITLE}>
        <Line label="Salário médio" value={fmtBRL(overview.avgSalary)} />
        <Line label="Horas contratuais" value={overview.avgWeeklyHours ? `${overview.avgWeeklyHours}h/sem` : "—"} />
        <Line label="Duração contratual média" value={overview.avgTenureMonths ? `${overview.avgTenureMonths} meses` : "—"} />
      </MetricCard>
      <MetricCard title="Perfil" icon={UserRound} titleClassName={STRONG_TITLE}>
        <Line label="Sexo predominante" value={overview.predominantSex ?? "—"} />
        <Line label="Escolaridade modal" value={overview.predominantEducation ?? "—"} />
        <Line label="Faixa etária modal" value={overview.modalAgeRange ?? "—"} />
      </MetricCard>
    </div>
  );
}
