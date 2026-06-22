import { ChartColumnIncreasing } from "lucide-react";

import { HomeFeatureCard } from "./HomeFeatureCard";

interface Favorite {
  occupationCode: string;
}

export function LaborMarketCard({ favorites }: { favorites: Favorite[] }) {
  // State A — no favorites
  if (favorites.length === 0) {
    return (
      <HomeFeatureCard
        icon={ChartColumnIncreasing}
        title="Mercado de Trabalho"
        state="Pesquise por profissão"
        support="Veja dados e tendências no Brasil"
        href="/labor-market"
      />
    );
  }

  // State B — has favorites (passed ordered most-recent first).
  const latest = favorites[0];
  const total = favorites.length;
  const stateLabel =
    total === 1 ? "1 profissão favorita" : `${total} profissões favoritas`;

  return (
    <HomeFeatureCard
      icon={ChartColumnIncreasing}
      title="Mercado de Trabalho"
      state={stateLabel}
      support="Veja a situação atual ou compare com outras profissões"
      href={`/labor-market/${latest.occupationCode}`}
    />
  );
}
