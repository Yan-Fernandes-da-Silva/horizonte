import { CheckCircle2, Compass } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { FeatureStatusCard } from "./FeatureStatusCard";

// Minimal shape we rely on here. The full vocational test (answers/results
// structure) is built in Phase 07 — we read its JSON fields defensively.
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
    const results = (session.results ?? {}) as { dominantTypes?: string[] };
    const types = results.dominantTypes ?? [];

    return (
      <FeatureStatusCard
        icon={CheckCircle2}
        accent="success"
        title="Teste concluído!"
        description={
          types.length
            ? `Seus tipos dominantes são: ${types.join(", ")}.`
            : "Veja o resumo do seu perfil profissional."
        }
        primaryAction={{ label: "Ver resultados", href: "/vocational-test/results" }}
        secondaryAction={{ label: "Refazer o teste", href: "/vocational-test/start" }}
      />
    );
  }

  // State B — in progress
  if (session?.status === "in_progress") {
    const meta = (session.answers ?? {}) as {
      currentSection?: string;
      currentSectionLabel?: string;
      progress?: number;
    };
    const progress = Math.min(100, Math.max(0, Math.round(meta.progress ?? 0)));
    const sectionLabel = meta.currentSectionLabel ?? "uma seção";
    const continueHref = meta.currentSection
      ? `/vocational-test/${meta.currentSection}`
      : "/vocational-test/start";

    return (
      <FeatureStatusCard
        icon={Compass}
        accent="gold"
        title="Seu teste está incompleto"
        description={`Você parou em ${sectionLabel}. Continue de onde parou!`}
        primaryAction={{ label: "Continuar o teste", href: continueHref }}
      >
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </FeatureStatusCard>
    );
  }

  // State A — not started
  return (
    <FeatureStatusCard
      icon={Compass}
      accent="sky"
      title="Descubra seu perfil profissional"
      description="Responda ao teste vocacional e saiba quais profissões combinam com você."
      primaryAction={{ label: "Fazer o teste", href: "/vocational-test/start" }}
    />
  );
}
