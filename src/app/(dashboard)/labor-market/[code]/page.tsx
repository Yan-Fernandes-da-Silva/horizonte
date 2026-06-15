import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageContainer } from "@/components/shared/PageContainer";
import { FavoriteButton } from "@/components/features/vocational-test/FavoriteButton";
import { OccupationDashboard } from "@/components/features/labor-market/OccupationDashboard";
import { getDashboardData, getOccupationTitle } from "@/lib/labor-market/data";

export default async function OccupationDashboardPage({
  params,
  searchParams,
}: {
  params: { code: string };
  searchParams: { region?: string; uf?: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const code = params.code;
  const title = await getOccupationTitle(code);
  if (!title) notFound();

  const region = typeof searchParams.region === "string" ? searchParams.region : "";
  const uf = typeof searchParams.uf === "string" ? searchParams.uf : "";

  const [data, favorite] = await Promise.all([
    getDashboardData(code, { region: region || undefined, uf: uf || undefined }),
    db.favoriteProfession.findUnique({
      where: { userId_occupationCode: { userId, occupationCode: code } },
      select: { id: true },
    }),
  ]);

  return (
    <PageContainer className="max-w-6xl">
      <Link href="/labor-market" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-sky">
        <ArrowLeft className="h-4 w-4" /> Voltar à pesquisa
      </Link>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ocean sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            CBO {code} · Dados de {data.scopeLabel}
          </p>
        </div>
        <FavoriteButton occupationCode={code} initialFavorited={Boolean(favorite)} />
      </div>

      <div className="mt-4">
        {data.hasData ? (
          <OccupationDashboard data={data} region={region} uf={uf} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white/60 p-10 text-center">
            <p className="text-lg font-semibold text-ocean">Dados não disponíveis</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ainda não temos métricas de mercado (CAGED/RAIS) para esta profissão.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
