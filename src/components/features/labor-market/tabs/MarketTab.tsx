"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { UF_NAMES } from "@/lib/labor-market/geo";
import { fmtNum } from "@/lib/labor-market/format";
import type { MarketView, StateMetric } from "@/lib/labor-market/types";
import { MetricCard } from "../MetricCard";
import { BrazilMap } from "../BrazilMap";

interface Props {
  market: MarketView;
  selectedRegion: string;
  selectedUf: string;
  onSelectUf: (uf: string) => void;
  onSelectRegion: (region: string) => void;
}

type MapMetric = "admissions" | "dismissals";

/** On/off switch to color the map by admissions or dismissals. */
function MetricToggle({ value, onChange }: { value: MapMetric; onChange: (v: MapMetric) => void }) {
  const dismiss = value === "dismissals";
  return (
    <div className="inline-flex items-center gap-2 text-xs">
      <span className={cn(!dismiss ? "font-semibold text-white" : "text-white/60")}>Admissões</span>
      <button
        type="button"
        role="switch"
        aria-checked={dismiss}
        aria-label="Alternar entre admissões e desligamentos"
        onClick={() => onChange(dismiss ? "admissions" : "dismissals")}
        className="relative h-5 w-9 shrink-0 rounded-full bg-white/20 transition-colors"
      >
        <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-gold transition-all", dismiss ? "left-[18px]" : "left-0.5")} />
      </button>
      <span className={cn(dismiss ? "font-semibold text-white" : "text-white/60")}>Desligamentos</span>
    </div>
  );
}

function StateRanking({ title, states, metricKey }: { title: string; states: StateMetric[]; metricKey: MapMetric }) {
  const top = [...states].sort((a, b) => b[metricKey] - a[metricKey]).slice(0, 5);
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/70">{title}</p>
      <ul className="space-y-1">
        {top.map((s) => (
          <li key={s.uf} className="flex justify-between text-sm">
            <span className="text-white">{UF_NAMES[s.uf] ?? s.uf}</span>
            <span className="font-medium text-white/70">{fmtNum(s[metricKey])}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketTab({ market, selectedRegion, selectedUf, onSelectUf, onSelectRegion }: Props) {
  const [metric, setMetric] = React.useState<MapMetric>("admissions");
  const showByState = !selectedUf;

  const values = market.byState.map((s) => ({
    uf: s.uf,
    value: metric === "admissions" ? s.admissions : s.dismissals,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <MetricCard>
          <div className="mb-2 flex justify-center">
            <MetricToggle value={metric} onChange={setMetric} />
          </div>
          <BrazilMap
            values={values}
            scheme="ocean"
            spectrumLabels={["Menos", "Mais"]}
            selectedRegion={selectedRegion}
            selectedUf={selectedUf}
            onSelectUf={onSelectUf}
            onSelectRegion={onSelectRegion}
          />
        </MetricCard>
      </div>

      <div className="space-y-4 lg:col-span-3">
        <div className="grid grid-cols-3 gap-3">
          <MetricCard title="Saldo">
            <p className="text-2xl font-bold text-white">{market.balance >= 0 ? "Positivo" : "Negativo"}</p>
          </MetricCard>
          <MetricCard title="Admissões">
            <p className="text-2xl font-bold text-white">{fmtNum(market.admissions)}</p>
          </MetricCard>
          <MetricCard title="Desligamentos">
            <p className="text-2xl font-bold text-white">{fmtNum(market.dismissals)}</p>
          </MetricCard>
        </div>

        {showByState && (
          <MetricCard title="Por estado">
            <div className="grid grid-cols-2 gap-6">
              <StateRanking title="Mais admissões" states={market.byState} metricKey="admissions" />
              <StateRanking title="Mais desligamentos" states={market.byState} metricKey="dismissals" />
            </div>
          </MetricCard>
        )}
      </div>
    </div>
  );
}
