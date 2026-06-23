"use client";

import * as React from "react";

import { fmtNum } from "@/lib/labor-market/format";
import type { MarketView } from "@/lib/labor-market/types";
import { MetricCard } from "../MetricCard";
import { BrazilMap } from "../BrazilMap";
import { DemandTable, type DemandMetric } from "../DemandTable";

interface Props {
  market: MarketView;
  selectedRegion: string;
  selectedUf: string;
  onSelectUf: (uf: string) => void;
  onSelectRegion: (region: string) => void;
}

const STRONG = "text-white";

export function MarketTab({ market, selectedRegion, selectedUf, onSelectUf, onSelectRegion }: Props) {
  // The metric drives both the map coloring and the ranking table below.
  const [metric, setMetric] = React.useState<DemandMetric>("admissions");
  const showByState = !selectedUf;

  const values = market.byState.map((s) => ({ uf: s.uf, value: s[metric] }));

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <MetricCard>
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
          <MetricCard title="Saldo" titleClassName={STRONG}>
            <p className="text-2xl font-bold text-white">{market.balance >= 0 ? "Positivo" : "Negativo"}</p>
          </MetricCard>
          <MetricCard title="Admissões" titleClassName={STRONG}>
            <p className="text-2xl font-bold text-white">{fmtNum(market.admissions)}</p>
          </MetricCard>
          <MetricCard title="Desligamentos" titleClassName={STRONG}>
            <p className="text-2xl font-bold text-white">{fmtNum(market.dismissals)}</p>
          </MetricCard>
        </div>

        {showByState && (
          <MetricCard>
            <DemandTable rows={market.byState} metric={metric} onMetricChange={setMetric} />
          </MetricCard>
        )}
      </div>
    </div>
  );
}
