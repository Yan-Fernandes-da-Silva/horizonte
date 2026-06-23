"use client";

import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis,
} from "recharts";

import { MI_NAMES } from "@/lib/vocational-test/questions";
import type { MiType } from "@/lib/vocational-test/types";

export function MiBars({ mi }: { mi: Record<MiType, number> }) {
  const data = (Object.keys(MI_NAMES) as MiType[])
    .map((t) => ({ name: MI_NAMES[t], value: mi[t] ?? 0 }))
    .sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 24 }}>
        <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.15)" />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: "#CBD5E1", fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="name"
          width={130}
          tick={{ fill: "#FFFFFF", fontSize: 12 }}
        />
        <Bar dataKey="value" fill="#F4A261" radius={[0, 6, 6, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
