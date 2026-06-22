import { SITUATION_COLOR, SITUATION_STEPS } from "@/lib/labor-market/format";
import type { MarketSituation } from "@/lib/labor-market/types";

/** 5-step linear gauge highlighting the current market situation. */
export function MarketGauge({
  situation,
  showLabel = true,
}: {
  situation: MarketSituation;
  showLabel?: boolean;
}) {
  const activeIndex = SITUATION_STEPS.indexOf(situation);
  const color = SITUATION_COLOR[situation];
  return (
    <div>
      <div className="flex gap-1">
        {SITUATION_STEPS.map((step, i) => (
          <div
            key={step}
            className="h-2.5 flex-1 rounded-full transition-colors"
            style={{ background: i <= activeIndex ? color : "rgba(255,255,255,0.2)" }}
          />
        ))}
      </div>
      {showLabel && (
        <p className="mt-2 text-2xl font-bold" style={{ color }}>
          {situation}
        </p>
      )}
    </div>
  );
}
