"use client";

import { MapPin } from "lucide-react";

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

export function FilterBar({ region, uf, onRegionChange, onUfChange }: Props) {
  const ufOptions = region ? UF_BY_REGION[region] ?? [] : ALL_UFS;

  return (
    <div className="sticky top-16 z-10 flex flex-wrap items-center gap-3 border-b border-border bg-sand/80 px-1 py-3 backdrop-blur-sm">
      <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <MapPin className="h-4 w-4" /> Localidade:
      </span>

      <Select
        value={region || ALL_REGION}
        onValueChange={(v) => onRegionChange(v === ALL_REGION ? "" : v)}
      >
        <SelectTrigger className="w-44 bg-white">
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
        <SelectTrigger className="w-52 bg-white">
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
  );
}
