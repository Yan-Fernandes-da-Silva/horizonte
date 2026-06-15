"use client";

import { fmtNum } from "@/lib/labor-market/format";
import type { ProfileView } from "@/lib/labor-market/types";
import { MetricCard } from "../MetricCard";
import { AgeSexPyramid } from "../charts/AgeSexPyramid";
import { EducationBars } from "../charts/EducationBars";
import { RaceDonut } from "../charts/RaceDonut";

export function ProfileTab({ profile }: { profile: ProfileView }) {
  const withDisability = profile.disabilityCount;
  const withoutDisability = Math.max(0, profile.totalStock - withDisability);
  const pcdPct = profile.totalStock ? Math.round((withDisability / profile.totalStock) * 1000) / 10 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <MetricCard title="Pirâmide etária por sexo" className="md:col-span-2">
        <AgeSexPyramid age={profile.age} sex={profile.sex} />
        <p className="mt-2 text-xs text-muted-foreground">
          * Estimativa: a RAIS fornece idade e sexo separadamente, então cada faixa é dividida
          pela proporção geral de homens e mulheres.
        </p>
      </MetricCard>

      <MetricCard title="Escolaridade">
        <EducationBars education={profile.education} />
      </MetricCard>

      <MetricCard title="Raça / cor">
        <RaceDonut race={profile.race} />
      </MetricCard>

      <MetricCard title="Pessoas com deficiência (PCD)" className="md:col-span-2">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-3xl font-bold text-ocean">{pcdPct}%</p>
            <p className="text-sm text-muted-foreground">dos vínculos são de PCD</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Com deficiência: <strong className="text-ocean">{fmtNum(withDisability)}</strong></p>
            <p>Sem deficiência: <strong className="text-ocean">{fmtNum(withoutDisability)}</strong></p>
          </div>
        </div>
      </MetricCard>
    </div>
  );
}
