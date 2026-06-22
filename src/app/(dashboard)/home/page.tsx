import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageContainer } from "@/components/shared/PageContainer";
import { WelcomeBanner } from "@/components/features/home/WelcomeBanner";
import { VocationalCard } from "@/components/features/home/VocationalCard";
import { LaborMarketCard } from "@/components/features/home/LaborMarketCard";
import { CareerPlanCard } from "@/components/features/home/CareerPlanCard";

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
      include: { occupation: { select: { title: true } } },
    }),
  ]);

  return (
    // Single sea-tone background that fills the space between the header and
    // footer (full-bleed over the layout's vertical padding). Using flex-1 lets
    // it grow to fill the viewport without pushing the footer off-screen, so the
    // welcome box and cards float on it and the footer stays on the same screen.
    <div className="-my-8 flex-1 bg-sea-top py-8">
      <PageContainer className="space-y-8">
        <WelcomeBanner name={session.user.name ?? "Usuário"} />

        <div className="grid items-stretch gap-6 md:grid-cols-3">
          <VocationalCard session={vocationalSession} />
          <LaborMarketCard favorites={favoriteProfessions} />
          <CareerPlanCard plan={careerPlan} />
        </div>
      </PageContainer>
    </div>
  );
}
