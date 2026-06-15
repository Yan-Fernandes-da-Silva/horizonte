"use client";

import {
  Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

import type { Distribution } from "@/lib/labor-market/types";

interface Props {
  age: Distribution[];
  sex: Distribution[];
}

/**
 * Age-sex pyramid. NOTE: RAIS gives age and sex separately (not cross-tabulated),
 * so each age band is split by the overall male/female ratio — this is an estimate.
 */
export function AgeSexPyramid({ age, sex }: Props) {
  const male = sex.find((s) => s.label === "Masculino")?.value ?? 0;
  const female = sex.find((s) => s.label === "Feminino")?.value ?? 0;
  const total = male + female || 1;
  const maleRatio = male / total;

  const data = age.map((a) => ({
    age: a.label,
    Masculino: -Math.round(a.value * maleRatio),
    Feminino: Math.round(a.value * (1 - maleRatio)),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" stackOffset="sign" margin={{ left: 8, right: 8 }}>
        <XAxis type="number" tickFormatter={(v) => Math.abs(v).toLocaleString("pt-BR")} tick={{ fill: "#64748B", fontSize: 11 }} />
        <YAxis type="category" dataKey="age" width={70} tick={{ fill: "#0A2342", fontSize: 12 }} />
        <Tooltip formatter={(v) => Math.abs(Number(v)).toLocaleString("pt-BR")} />
        <Legend />
        <Bar dataKey="Masculino" fill="#0A2342" stackId="s" radius={[6, 0, 0, 6]} />
        <Bar dataKey="Feminino" fill="#F4A261" stackId="s" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
