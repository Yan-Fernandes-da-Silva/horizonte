import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Questionnaire, type FavoriteOption } from "@/components/features/career-plan/Questionnaire";

export default async function CareerPlanStartPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const [favorites, completed] = await Promise.all([
    db.favoriteProfession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { occupationCode: true, occupation: { select: { title: true } } },
    }),
    db.vocationalTestSession.findFirst({
      where: { userId, status: "completed" },
      select: { id: true },
    }),
  ]);

  const favoriteOptions: FavoriteOption[] = favorites.map((f) => ({
    code: f.occupationCode,
    title: f.occupation?.title ?? f.occupationCode,
  }));

  return (
    <div className="-my-8 flex-1 bg-sea-top py-8">
      <Questionnaire favorites={favoriteOptions} hasVocationalResults={Boolean(completed)} />
    </div>
  );
}
