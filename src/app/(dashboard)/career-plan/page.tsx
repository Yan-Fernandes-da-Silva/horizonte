import Link from "next/link";
import { redirect } from "next/navigation";
import { Target } from "lucide-react";

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

  // No plan yet → presentation panel laid out like the post-login home cards
  // (glass surface, gold icon + title, supporting text and a CTA button).
  return (
    <div className="-my-8 flex flex-1 items-center bg-sea-top py-8">
      <PageContainer className="max-w-xl">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-8 text-white shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Target className="h-9 w-9 shrink-0 text-gold" />
            <h1 className="text-xl font-bold sm:text-2xl">Monte seu plano de carreira profissional</h1>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Com base nos resultados do teste vocacional, nas profissões favoritadas e algumas
            perguntas construa seu plano personalizado.
          </p>
          <Button asChild className="mt-6 bg-gold text-ocean hover:bg-gold-dark hover:text-white">
            <Link href="/career-plan/start">Criar plano</Link>
          </Button>
        </div>
      </PageContainer>
    </div>
  );
}
