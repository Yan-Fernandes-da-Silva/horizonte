"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { Distribution } from "@/lib/labor-market/types";

// Education levels from lowest to highest (controls bar order, top → bottom).
const ORDER = [
  "Analfabeto", "Até 5ª Incompleto", "5ª Completo", "6ª a 9ª Incompleto", "Fundamental Completo",
  "Médio Incompleto", "Médio Completo", "Superior Incompleto", "Superior Completo", "Mestrado", "Doutorado",
];

// Single hue — the map cyan (sky token).
const BAR_COLOR = "#00B4D8";

export function EducationBars({ education }: { education: Distribution[] }) {
  const data = [...education]
    .filter((d) => d.value > 0)
    .sort((a, b) => ORDER.indexOf(a.label) - ORDER.indexOf(b.label));

  // Horizontal bars: ~34px each (full width, same render pattern as the other charts).
  const height = Math.max(220, data.length * 34 + 24);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <XAxis
          type="number"
          tick={{ fill: "#CBD5E1", fontSize: 11 }}
          tickFormatter={(v) => v.toLocaleString("pt-BR")}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={140}
          tick={{ fill: "#FFFFFF", fontSize: 11 }}
        />
        <Tooltip formatter={(v) => Number(v).toLocaleString("pt-BR")} cursor={{ fill: "rgba(255,255,255,0.08)" }} />
        <Bar dataKey="value" fill={BAR_COLOR} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
