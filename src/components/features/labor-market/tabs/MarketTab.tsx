"use client";

import { UF_NAMES } from "@/lib/labor-market/geo";
import { fmtNum } from "@/lib/labor-market/format";
import type { MarketView, StateMetric } from "@/lib/labor-market/types";
import { MetricCard } from "../MetricCard";
import { BrazilTileMap } from "../BrazilTileMap";

interface Props {
  market: MarketView;
  selectedUf: string;
  onSelectUf: (uf: string) => void;
  onSelectRegion: (region: string) => void;
}

function StateRanking({ title, states, metricKey }: { title: string; states: StateMetric[]; metricKey: "admissions" | "dismissals" }) {
  const top = [...states].sort((a, b) => b[metricKey] - a[metricKey]).slice(0, 5);
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <ul className="space-y-1">
        {top.map((s) => (
          <li key={s.uf} className="flex justify-between text-sm">
            <span className="text-ocean">{UF_NAMES[s.uf] ?? s.uf}</span>
            <span className="font-medium text-muted-foreground">{fmtNum(s[metricKey])}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketTab({ market, selectedUf, onSelectUf, onSelectRegion }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <MetricCard title="Mapa do Brasil — saldo por estado">
          <BrazilTileMap
            byState={market.byState}
            selectedUf={selectedUf}
            metric="balance"
            onSelectUf={onSelectUf}
            onSelectRegion={onSelectRegion}
          />
        </MetricCard>
      </div>

      <div className="space-y-4 lg:col-span-3">
        <div className="grid grid-cols-3 gap-3">
          <MetricCard title="Saldo">
            <p className={`text-2xl font-bold ${market.balance >= 0 ? "text-emerald-600" : "text-sun"}`}>
              {market.balance >= 0 ? "+" : ""}{fmtNum(market.balance)}
            </p>
          </MetricCard>
          <MetricCard title="Admissões">
            <p className="text-2xl font-bold text-ocean">{fmtNum(market.admissions)}</p>
          </MetricCard>
          <MetricCard title="Desligamentos">
            <p className="text-2xl font-bold text-ocean">{fmtNum(market.dismissals)}</p>
          </MetricCard>
        </div>

        <MetricCard title="Por estado">
          <div className="grid grid-cols-2 gap-6">
            <StateRanking title="Mais admissões" states={market.byState} metricKey="admissions" />
            <StateRanking title="Mais desligamentos" states={market.byState} metricKey="dismissals" />
          </div>
        </MetricCard>

        <MetricCard title="Disputa">
          <p className="text-lg font-bold text-ocean">{market.disputa}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Estimativa baseada no estoque de profissionais frente às vagas abertas no período.
          </p>
        </MetricCard>
      </div>
    </div>
  );
}
