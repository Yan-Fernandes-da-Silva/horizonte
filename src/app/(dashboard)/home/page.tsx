import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageContainer } from "@/components/shared/PageContainer";
import { Reveal } from "@/components/shared/Reveal";
import { WelcomeBanner } from "@/components/features/home/WelcomeBanner";
import { VocationalCard } from "@/components/features/home/VocationalCard";
import { LaborMarketCard } from "@/components/features/home/LaborMarketCard";
import { CareerPlanCard } from "@/components/features/home/CareerPlanCard";
import { DailyTip } from "@/components/features/home/DailyTip";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  // Belt-and-suspenders: the dashboard layout + middleware already guard this.
  if (!session?.user || !userId) {
    redirect("/login");
  }

  // Fetch everything the dashboard needs in parallel.
  const [vocationalSession, favoriteProfessions, careerPlan] = await Promise.all([
    db.vocationalTestSession.findFirst({
      where: { userId },
      orderBy: { startedAt: "desc" },
    }),
    db.favoriteProfession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    db.careerPlan.findFirst({
      where: { userId, status: "active" },
      orderBy: { updatedAt: "desc" },
      include: { tasks: true },
    }),
  ]);

  return (
    <PageContainer className="space-y-8">
      <Reveal>
        <WelcomeBanner name={session.user.name ?? "Usuário"} />
      </Reveal>

      <div className="grid items-stretch gap-6 md:grid-cols-3">
        <Reveal className="h-full" delay={0}>
          <VocationalCard session={vocationalSession} />
        </Reveal>
        <Reveal className="h-full" delay={0.1}>
          <LaborMarketCard favorites={favoriteProfessions} />
        </Reveal>
        <Reveal className="h-full" delay={0.2}>
          <CareerPlanCard plan={careerPlan} />
        </Reveal>
      </div>

      <Reveal>
        <DailyTip />
      </Reveal>
    </PageContainer>
  );
}
