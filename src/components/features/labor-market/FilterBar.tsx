"use client";

import { MapPin, Briefcase } from "lucide-react";

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { REGIONS, UF_BY_REGION, ALL_UFS, UF_NAMES } from "@/lib/labor-market/geo";

interface Props {
  region: string; // "" = Brasil
  uf: string; // "" = Todos
  onRegionChange: (region: string) => void;
  onUfChange: (uf: string) => void;
}

const ALL_REGION = "BR";
const ALL_UF = "ALL";

/** Placeholder for filters that aren't wired up yet (economic activity). */
function ComingSoon({ label }: { label: string }) {
  return (
    <div
      title="Em breve"
      className="flex h-10 min-w-[10rem] items-center justify-between gap-2 rounded-md border border-dashed border-white/25 bg-white/5 px-3 text-sm text-white/50"
    >
      <span className="truncate">{label}</span>
      <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
        Em breve
      </span>
    </div>
  );
}

export function FilterBar({ region, uf, onRegionChange, onUfChange }: Props) {
  const ufOptions = region ? UF_BY_REGION[region] ?? [] : ALL_UFS;

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2">
      {/* Atividade econômica (left — coming soon, reserved space) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/70">
          <Briefcase className="h-4 w-4 text-gold" /> Atividade
        </span>
        <ComingSoon label="Subsetor (IBGE)" />
        <ComingSoon label="Divisão (CNAE 2.0)" />
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
