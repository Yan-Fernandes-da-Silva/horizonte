"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { oceanShades } from "@/lib/labor-market/format";
import type { Distribution } from "@/lib/labor-market/types";

export function RaceDonut({ race }: { race: Distribution[] }) {
  const data = race.filter((d) => d.value > 0);
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const colors = oceanShades(data.length);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => `${Number(v).toLocaleString("pt-BR")} (${Math.round((Number(v) / total) * 100)}%)`} />
        <Legend wrapperStyle={{ color: "#FFFFFF", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
