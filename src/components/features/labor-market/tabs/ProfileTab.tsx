"use client";

import { fmtNum } from "@/lib/labor-market/format";
import type { ProfileView } from "@/lib/labor-market/types";
import { MetricCard } from "../MetricCard";
import { AgeSexPyramid } from "../charts/AgeSexPyramid";
import { EducationBars } from "../charts/EducationBars";
import { RaceDonut } from "../charts/RaceDonut";

const STRONG = "text-white";

export function ProfileTab({ profile }: { profile: ProfileView }) {
  const withDisability = profile.disabilityCount;
  const withoutDisability = Math.max(0, profile.totalStock - withDisability);
  const pcdPct = profile.totalStock ? Math.round((withDisability / profile.totalStock) * 1000) / 10 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <MetricCard title="Pirâmide etária por sexo" titleClassName={STRONG} className="md:col-span-2">
        <AgeSexPyramid age={profile.age} sex={profile.sex} />
      </MetricCard>

      <MetricCard title="Escolaridade" titleClassName={STRONG}>
        <EducationBars education={profile.education} />
      </MetricCard>

      <MetricCard title="Raça / cor" titleClassName={STRONG}>
        <RaceDonut race={profile.race} />
      </MetricCard>

      <MetricCard title="Pessoas com deficiência (PCD)" titleClassName={STRONG} className="md:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Left: percentage + phrase (phrase to the right of the number) */}
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-white">{pcdPct}%</p>
            <p className="max-w-[9rem] text-sm text-white/70">dos vínculos são de PCD</p>
          </div>
          {/* Right: counts */}
          <div className="text-sm text-white/70">
            <p>Com deficiência: <strong className="text-white">{fmtNum(withDisability)}</strong></p>
            <p>Sem deficiência: <strong className="text-white">{fmtNum(withoutDisability)}</strong></p>
          </div>
        </div>
      </MetricCard>
    </div>
  );
}
