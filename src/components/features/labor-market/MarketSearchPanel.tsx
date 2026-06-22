import { ChartColumnIncreasing } from "lucide-react";

import { OccupationSearch } from "./OccupationSearch";

/**
 * Top search panel for the labor-market feature. Shown on both the search page
 * and a profession's dashboard, so searching is always available on one screen.
 */
export function MarketSearchPanel() {
  return (
    <div className="relative z-30 rounded-2xl border border-white/15 bg-white/10 px-6 py-10 text-white shadow-sm backdrop-blur-sm sm:px-10">
      <div className="flex items-center gap-2">
        <ChartColumnIncreasing className="h-6 w-6 shrink-0 text-gold" />
        <h1 className="text-2xl font-bold sm:text-3xl">Mercado de Trabalho</h1>
      </div>
      <p className="mt-2 text-justify text-white/80">
        Pesquise profissões de acordo com a Classificação Brasileira de Ocupações (CBO) e
        explore as estatísticas e tendências do mercado de trabalho fundamentadas no Cadastro
        Geral de Empregados e Desempregados (CAGED) e na Relação Anual de Informações Sociais
        (RAIS).
      </p>
      <div className="mt-6">
        <OccupationSearch />
      </div>
    </div>
  );
}
