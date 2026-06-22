import { ClipboardList } from "lucide-react";

import { HomeFeatureCard } from "./HomeFeatureCard";

// Minimal shape we rely on here.
interface VocationalSession {
  status: string;
  answers: unknown;
  results: unknown;
}

export function VocationalCard({
  session,
}: {
  session: VocationalSession | null;
}) {
  // State C — completed
  if (session?.status === "completed") {
    return (
      <HomeFeatureCard
        icon={ClipboardList}
        title="Teste Vocacional"
        state="Teste concluído"
        support="Veja os resultados ou refaça o teste"
        href="/vocational-test/results"
      />
    );
  }

  // State B — in progress
  if (session?.status === "in_progress") {
    const meta = (session.answers ?? {}) as { currentSection?: string };
    const continueHref = meta.currentSection
      ? `/vocational-test/${meta.currentSection}`
      : "/vocational-test/start";

    return (
      <HomeFeatureCard
        icon={ClipboardList}
        title="Teste Vocacional"
        state="Teste incompleto"
        support="Continue de onde parou ou recomece do zero"
        href={continueHref}
      />
    );
  }

  // State A — not started
  return (
    <HomeFeatureCard
      icon={ClipboardList}
      title="Teste Vocacional"
      state="Responda algumas perguntas"
      support="Descubra quais profissões combinam com você"
      href="/vocational-test/start"
    />
  );
}
