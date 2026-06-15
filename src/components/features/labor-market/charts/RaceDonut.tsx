"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { Distribution } from "@/lib/labor-market/types";

const COLORS = ["#0A2342", "#00B4D8", "#F4A261", "#90E0EF", "#E76F51", "#64748B"];

export function RaceDonut({ race }: { race: Distribution[] }) {
  const data = race.filter((d) => d.value > 0);
  const total = data.reduce((a, d) => a + d.value, 0) || 1;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => `${Number(v).toLocaleString("pt-BR")} (${Math.round((Number(v) / total) * 100)}%)`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
