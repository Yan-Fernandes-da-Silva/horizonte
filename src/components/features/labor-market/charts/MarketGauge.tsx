import { SITUATION_COLOR, SITUATION_STEPS } from "@/lib/labor-market/format";
import type { MarketSituation } from "@/lib/labor-market/types";

/** 5-step linear gauge highlighting the current market situation. */
export function MarketGauge({ situation }: { situation: MarketSituation }) {
  const activeIndex = SITUATION_STEPS.indexOf(situation);
  const color = SITUATION_COLOR[situation];
  return (
    <div>
      <div className="flex gap-1">
        {SITUATION_STEPS.map((step, i) => (
          <div
            key={step}
            className="h-2.5 flex-1 rounded-full transition-colors"
            style={{ background: i <= activeIndex ? color : "#E2E8F0" }}
          />
        ))}
      </div>
      <p className="mt-2 text-2xl font-bold" style={{ color }}>
        {situation}
      </p>
    </div>
  );
}
