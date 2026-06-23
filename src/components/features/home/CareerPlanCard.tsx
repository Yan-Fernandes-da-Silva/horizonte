import { Target } from "lucide-react";

import { HomeFeatureCard } from "./HomeFeatureCard";

interface Plan {
  id: string;
  title: string;
  occupation?: { title: string } | null;
}

export function CareerPlanCard({ plan }: { plan: Plan | null }) {
  // State A — no plan
  if (!plan) {
    return (
      <HomeFeatureCard
        icon={Target}
        title="Plano de Carreira"
        state="Monte seu plano"
        support="Com base nos resultados e profissões favoritas."
        href="/career-plan"
      />
    );
  }

  // State B — has an active plan (state shows the plan's profession).
  const profession = plan.occupation?.title ?? plan.title;

  return (
    <HomeFeatureCard
      icon={Target}
      title="Plano de Carreira"
      state={profession}
      support="Acompanhe seu progresso e revise objetivos e metas."
      href={`/career-plan/${plan.id}`}
    />
  );
}
