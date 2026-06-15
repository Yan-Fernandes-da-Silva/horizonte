import { ChartColumnIncreasing } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { FeatureStatusCard } from "./FeatureStatusCard";

interface Favorite {
  occupationCode: string;
}

export function LaborMarketCard({ favorites }: { favorites: Favorite[] }) {
  // State A — no favorites
  if (favorites.length === 0) {
    return (
      <FeatureStatusCard
        icon={ChartColumnIncreasing}
        accent="sky"
        title="Explore o mercado de trabalho"
        description="Pesquise por profissão e veja salários, demanda e tendências no Brasil."
        primaryAction={{ label: "Explorar agora", href: "/labor-market" }}
      />
    );
  }

  // State B — has favorites (page passes them ordered most-recent first).
  const latest = favorites[0];
  const total = favorites.length;
  const savedLabel = total === 1 ? "profissão salva" : "profissões salvas";

  return (
    <FeatureStatusCard
      icon={ChartColumnIncreasing}
      accent="sky"
      title="Profissão favoritada"
      // CBO occupation names are seeded in Phase 05; show the code until then.
      description={`Código CBO ${latest.occupationCode}`}
      badge={
        <Badge className="bg-sky text-ocean hover:bg-sky">
          {total} {savedLabel}
        </Badge>
      }
      primaryAction={{
        label: "Ver dashboard completo",
        href: `/labor-market/${latest.occupationCode}`,
      }}
      secondaryAction={
        total > 1 ? { label: "Comparar profissões", href: "/labor-market" } : undefined
      }
    >
      <div className="rounded-lg border border-dashed border-border bg-sand/60 px-3 py-2 text-xs text-muted-foreground">
        Estatísticas de salário e demanda chegam nas próximas fases.
      </div>
    </FeatureStatusCard>
  );
}
