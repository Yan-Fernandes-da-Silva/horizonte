"use client";

import { MapPin, CalendarDays } from "lucide-react";

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { REGIONS, UF_BY_REGION, ALL_UFS, UF_NAMES } from "@/lib/labor-market/geo";
import { CAGED_PERIODS } from "@/lib/labor-market/periods";

interface Props {
  region: string; // "" = Brasil
  uf: string; // "" = Todos
  period: string; // YYYYMM (always set)
  onRegionChange: (region: string) => void;
  onUfChange: (uf: string) => void;
  onPeriodChange: (period: string) => void;
}

const ALL_REGION = "BR";
const ALL_UF = "ALL";

export function FilterBar({ region, uf, period, onRegionChange, onUfChange, onPeriodChange }: Props) {
  const ufOptions = region ? UF_BY_REGION[region] ?? [] : ALL_UFS;

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2">
      {/* Período (left — CAGED month) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/70">
          <CalendarDays className="h-4 w-4 text-gold" /> Período
        </span>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="h-10 w-48 bg-white text-ocean">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {CAGED_PERIODS.map((p) => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Localidade (right — active) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/70">
          <MapPin className="h-4 w-4 text-gold" /> Localidade
        </span>
        <Select value={region || ALL_REGION} onValueChange={(v) => onRegionChange(v === ALL_REGION ? "" : v)}>
          <SelectTrigger className="h-10 w-40 bg-white text-ocean">
            <SelectValue placeholder="Região" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_REGION}>Brasil</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r.code} value={r.code}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={uf || ALL_UF} onValueChange={(v) => onUfChange(v === ALL_UF ? "" : v)}>
          <SelectTrigger className="h-10 w-48 bg-white text-ocean">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_UF}>Todos os estados</SelectItem>
            {ufOptions.map((u) => (
              <SelectItem key={u} value={u}>{UF_NAMES[u]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
