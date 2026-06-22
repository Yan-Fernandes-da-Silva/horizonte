import Link from "next/link";
import { redirect } from "next/navigation";
import { Route } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/PageContainer";

export default async function CareerPlanEntryPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  // Single-plan model: if the user already has a plan, go straight to it.
  const plan = await db.careerPlan.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });
  if (plan) redirect(`/career-plan/${plan.id}`);

  // No plan yet → presentation screen with the call to create one. Same look as
  // the other feature entry pages (sea background + translucent boxes), with the
  // icon/title/phrase laid out like the vocational test entry.
  return (
    <div className="-my-8 flex-1 bg-sea-top py-8">
      <PageContainer className="max-w-3xl">
        <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-6 text-white shadow-sm backdrop-blur-sm sm:px-10">
          <div className="flex items-center gap-2">
            <Route className="h-6 w-6 shrink-0 text-gold" />
            <h1 className="text-2xl font-bold sm:text-3xl">Plano de Carreira</h1>
          </div>
          <p className="mt-2 max-w-xl text-white/80">
            Responda 6 perguntas rápidas e receba um roadmap personalizado, com tarefas,
            trilhas de aprendizado e recomendações para a sua carreira.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-6 text-white shadow-sm backdrop-blur-sm sm:p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">Pronto para montar seu plano?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
              Leva poucos minutos. Você pode revisar e ajustar tudo depois.
            </p>
            <div className="mt-6">
              <Button asChild className="bg-gold text-ocean hover:bg-gold-dark hover:text-white">
                <Link href="/career-plan/start">Criar meu plano</Link>
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
