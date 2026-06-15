import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Route, Sparkles } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/shared/PageContainer";
import { Reveal } from "@/components/shared/Reveal";

export default async function CareerPlanListPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const plans = await db.careerPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      tasks: { select: { status: true } },
    },
  });

  if (plans.length === 0) {
    return (
      <PageContainer className="max-w-2xl">
        <Reveal>
          <div className="rounded-2xl bg-ocean-gradient px-6 py-12 text-center text-white shadow-md sm:px-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <Route className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">Plano de Carreira</h1>
            <p className="mx-auto mt-3 max-w-md text-white/80">
              Responda 6 perguntas rápidas e receba um roadmap personalizado, com tarefas,
              trilhas de aprendizado e recomendações para a sua carreira.
            </p>
            <Button asChild className="mt-6 bg-gold text-ocean hover:bg-gold-dark hover:text-white">
              <Link href="/career-plan/start"><Sparkles className="h-4 w-4" /> Criar meu plano</Link>
            </Button>
          </div>
        </Reveal>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ocean">Meus planos de carreira</h1>
        <Button asChild className="bg-gold text-ocean hover:bg-gold-dark hover:text-white">
          <Link href="/career-plan/start"><Plus className="h-4 w-4" /> Novo plano</Link>
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {plans.map((plan) => {
          const total = plan.tasks.length;
          const done = plan.tasks.filter((t) => t.status === "completed").length;
          const percent = total > 0 ? Math.round((done / total) * 100) : 0;
          return (
            <Link
              key={plan.id}
              href={`/career-plan/${plan.id}`}
              className="block rounded-2xl border border-border bg-white/70 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold text-ocean">{plan.title}</h2>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(plan.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={percent} className="h-2" />
                <span className="shrink-0 text-xs font-medium text-muted-foreground">{done}/{total} · {percent}%</span>
              </div>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
}
