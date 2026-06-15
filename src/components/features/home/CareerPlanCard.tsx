import { Route } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { FeatureStatusCard } from "./FeatureStatusCard";

interface Task {
  status: string;
  title: string;
  sortOrder: number;
}

interface Plan {
  id: string;
  title: string;
  tasks: Task[];
}

export function CareerPlanCard({ plan }: { plan: Plan | null }) {
  // State A — no plan
  if (!plan) {
    return (
      <FeatureStatusCard
        icon={Route}
        accent="gold"
        title="Monte seu plano de carreira"
        description="Responda algumas perguntas e receba um roadmap personalizado para sua carreira."
        primaryAction={{ label: "Criar meu plano", href: "/career-plan/start" }}
      />
    );
  }

  // State B — has an active plan
  const total = plan.tasks.length;
  const done = plan.tasks.filter((task) => task.status === "completed").length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const nextTask = plan.tasks
    .filter((task) => task.status !== "completed")
    .sort((a, b) => a.sortOrder - b.sortOrder)[0];

  return (
    <FeatureStatusCard
      icon={Route}
      accent="gold"
      title={`Plano: ${plan.title}`}
      description={
        nextTask
          ? `Próxima tarefa: ${nextTask.title}`
          : "Todas as tarefas concluídas! 🎉"
      }
      primaryAction={{ label: "Ver meu roadmap", href: `/career-plan/${plan.id}` }}
    >
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>
            {done} de {total} tarefas
          </span>
          <span>{percent}%</span>
        </div>
        <Progress value={percent} className="h-2" />
      </div>
    </FeatureStatusCard>
  );
}
