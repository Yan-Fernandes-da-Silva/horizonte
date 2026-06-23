"use client";

import {
  Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

import type { Distribution } from "@/lib/labor-market/types";

interface Props {
  age: Distribution[];
  sex: Distribution[];
}

// Map cyan (sky) + header/footer dark blue (ocean) — same hues used elsewhere.
const MALE = "#0A2342"; // ocean — header/footer dark blue
const FEMALE = "#00B4D8"; // sky — map cyan

/**
 * Age-sex pyramid. RAIS gives age and sex separately, so each age band is split
 * by the overall male/female ratio. The X domain is forced symmetric so the
 * center line stays aligned with the legend regardless of the values.
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

  const max = Math.max(1, ...data.map((d) => Math.max(Math.abs(d.Masculino), d.Feminino)));

  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* left:0 + YAxis width 64 balanced by right:64 keeps the center centered */}
      <BarChart data={data} layout="vertical" stackOffset="sign" margin={{ left: 0, right: 64 }}>
        <XAxis
          type="number"
          domain={[-max, max]}
          tickFormatter={(v) => Math.abs(v).toLocaleString("pt-BR")}
          tick={{ fill: "#CBD5E1", fontSize: 11 }}
        />
        <YAxis type="category" dataKey="age" width={64} tick={{ fill: "#FFFFFF", fontSize: 12 }} />
        <Tooltip formatter={(v) => Math.abs(Number(v)).toLocaleString("pt-BR")} />
        <Legend wrapperStyle={{ color: "#FFFFFF", fontSize: 12 }} />
        <Bar dataKey="Masculino" fill={MALE} stackId="s" radius={[6, 0, 0, 6]} />
        <Bar dataKey="Feminino" fill={FEMALE} stackId="s" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
