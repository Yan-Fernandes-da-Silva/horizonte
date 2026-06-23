"use client";

import {
  PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer,
} from "recharts";

import { RIASEC_NAMES } from "@/lib/vocational-test/questions";
import type { RiasecType } from "@/lib/vocational-test/types";

export function RiasecRadar({ riasec }: { riasec: Record<RiasecType, number> }) {
  const data = (Object.keys(RIASEC_NAMES) as RiasecType[]).map((t) => ({
    type: RIASEC_NAMES[t],
    value: riasec[t] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} outerRadius="70%">
        <PolarGrid stroke="rgba(255,255,255,0.2)" />
        <PolarAngleAxis dataKey="type" tick={{ fill: "#FFFFFF", fontSize: 12 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }} />
        <Radar dataKey="value" stroke="#00B4D8" fill="#00B4D8" fillOpacity={0.4} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
