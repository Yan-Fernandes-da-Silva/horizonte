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
        <PolarGrid stroke="#E2E8F0" />
        <PolarAngleAxis dataKey="type" tick={{ fill: "#0A2342", fontSize: 12 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 10 }} />
        <Radar dataKey="value" stroke="#00B4D8" fill="#00B4D8" fillOpacity={0.35} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
