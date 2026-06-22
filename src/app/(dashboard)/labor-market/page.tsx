import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageContainer } from "@/components/shared/PageContainer";
import { MarketSearchPanel } from "@/components/features/labor-market/MarketSearchPanel";
import { FavoritesList } from "@/components/features/labor-market/FavoritesList";

export default async function LaborMarketSearchPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const favorites = await db.favoriteProfession.findMany({
    where: { userId },
    select: { occupationCode: true, occupation: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  const initial = favorites.map((f) => ({
    occupationCode: f.occupationCode,
    title: f.occupation?.title ?? null,
  }));

  return (
    // Same look as the post-login home: full-bleed sea background with
    // translucent boxes floating on it.
    <div className="-my-8 flex-1 bg-sea-top py-8">
      <PageContainer className="max-w-4xl">
        <MarketSearchPanel />
        <FavoritesList initial={initial} />
      </PageContainer>
    </div>
  );
}
