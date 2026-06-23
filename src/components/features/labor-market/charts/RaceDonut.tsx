"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { Distribution } from "@/lib/labor-market/types";

// Display order requested: branco → pardo → negro → indígena → amarela,
// with "Não identificada" kept last.
const ORDER = ["Branca", "Parda", "Negra", "Indígena", "Amarela", "Não identificada"];

// Palette requested by Yan — cyan, dark blue, yellow, pink, green, and gray
// reserved for "Não identificada".
const COLORS: Record<string, string> = {
  Branca: "#00B4D8", // ciano
  Parda: "#0A2342", // azul escuro
  Negra: "#FACC15", // amarelo
  Indígena: "#F472B6", // rosa
  Amarela: "#22C55E", // verde
  "Não identificada": "#94A3B8", // cinza
};
const FALLBACK = ["#00B4D8", "#0A2342", "#FACC15", "#F472B6", "#22C55E", "#94A3B8"];

const rank = (label: string) => {
  const i = ORDER.indexOf(label);
  return i < 0 ? ORDER.length : i;
};

export function RaceDonut({ race }: { race: Distribution[] }) {
  const data = race.filter((d) => d.value > 0).sort((a, b) => rank(a.label) - rank(b.label));
  const total = data.reduce((a, d) => a + d.value, 0) || 1;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {data.map((d, i) => (
            <Cell key={i} fill={COLORS[d.label] ?? FALLBACK[i % FALLBACK.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => `${Number(v).toLocaleString("pt-BR")} (${Math.round((Number(v) / total) * 100)}%)`} />
        {/* Colored squares from the slice color, but white legend text. */}
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          formatter={(value) => <span style={{ color: "#FFFFFF" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
