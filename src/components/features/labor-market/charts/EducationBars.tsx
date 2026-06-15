"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 34)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <XAxis type="number" tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => v.toLocaleString("pt-BR")} />
        <YAxis type="category" dataKey="label" width={140} tick={{ fill: "#0A2342", fontSize: 11 }} />
        <Tooltip formatter={(v) => Number(v).toLocaleString("pt-BR")} />
        <Bar dataKey="value" fill="#00B4D8" radius={[0, 6, 6, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
