import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { List } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/PageContainer";
import { FavoriteButton } from "@/components/features/vocational-test/FavoriteButton";
import { MarketSearchPanel } from "@/components/features/labor-market/MarketSearchPanel";
import { OccupationDashboard } from "@/components/features/labor-market/OccupationDashboard";
import { getDashboardData, getOccupationTitle } from "@/lib/labor-market/data";
import { resolvePeriod } from "@/lib/labor-market/periods";

export default async function OccupationDashboardPage({
  params,
  searchParams,
}: {
  params: { code: string };
  searchParams: { region?: string; uf?: string; period?: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const code = params.code;
  const title = await getOccupationTitle(code);
  if (!title) notFound();

  const region = typeof searchParams.region === "string" ? searchParams.region : "";
  const uf = typeof searchParams.uf === "string" ? searchParams.uf : "";
  const period = resolvePeriod(typeof searchParams.period === "string" ? searchParams.period : undefined);

  const [data, favorite] = await Promise.all([
    getDashboardData(code, { region: region || undefined, uf: uf || undefined, period }),
    db.favoriteProfession.findUnique({
      where: { userId_occupationCode: { userId, occupationCode: code } },
      select: { id: true },
    }),
  ]);

  return (
    <div className="-my-8 flex-1 bg-sea-top py-8">
      <PageContainer className="max-w-6xl">
        <MarketSearchPanel />

        <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 px-6 py-6 text-white shadow-sm backdrop-blur-sm sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-white/70">CBO {code}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/labor-market"><List className="h-4 w-4 text-gold" /> Lista de favoritas</Link>
              </Button>
              <FavoriteButton occupationCode={code} initialFavorited={Boolean(favorite)} variant="glass" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          {data.hasData ? (
            <OccupationDashboard data={data} region={region} uf={uf} period={period} />
          ) : (
            <div className="rounded-2xl border border-dashed border-white/25 bg-white/5 p-10 text-center backdrop-blur-sm">
              <p className="text-lg font-semibold text-white">Dados não disponíveis</p>
              <p className="mt-1 text-sm text-white/80">
                Ainda não temos métricas de mercado (CAGED/RAIS) para esta profissão.
              </p>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
