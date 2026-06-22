"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { oceanColor } from "@/lib/labor-market/format";
import type { Distribution } from "@/lib/labor-market/types";

// Education levels from lowest to highest (controls bar order).
const ORDER = [
  "Analfabeto", "Até 5ª Incompleto", "5ª Completo", "6ª a 9ª Incompleto", "Fundamental Completo",
  "Médio Incompleto", "Médio Completo", "Superior Incompleto", "Superior Completo", "Mestrado", "Doutorado",
];

export function EducationBars({ education }: { education: Distribution[] }) {
  const data = [...education]
    .filter((d) => d.value > 0)
    .sort((a, b) => ORDER.indexOf(a.label) - ORDER.indexOf(b.label));

  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 70 }}>
        <XAxis
          dataKey="label"
          interval={0}
          angle={-35}
          textAnchor="end"
          height={80}
          tick={{ fill: "#FFFFFF", fontSize: 10 }}
        />
        <YAxis tick={{ fill: "#CBD5E1", fontSize: 11 }} tickFormatter={(v) => v.toLocaleString("pt-BR")} />
        <Tooltip formatter={(v) => Number(v).toLocaleString("pt-BR")} cursor={{ fill: "rgba(255,255,255,0.08)" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={oceanColor(d.value / max)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
