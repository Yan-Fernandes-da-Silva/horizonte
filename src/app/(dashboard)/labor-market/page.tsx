import Link from "next/link";
import { redirect } from "next/navigation";
import { ChartColumnIncreasing, Heart, Search } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageContainer } from "@/components/shared/PageContainer";
import { Reveal } from "@/components/shared/Reveal";
import { OccupationSearch } from "@/components/features/labor-market/OccupationSearch";

export default async function LaborMarketSearchPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const favorites = await db.favoriteProfession.findMany({
    where: { userId },
    select: { occupationCode: true, occupation: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageContainer className="max-w-4xl">
      <Reveal>
        <div className="rounded-2xl bg-ocean-gradient px-6 py-10 text-white shadow-md sm:px-10">
          <div className="flex items-center gap-2">
            <ChartColumnIncreasing className="h-6 w-6" />
            <h1 className="text-2xl font-bold sm:text-3xl">Mercado de Trabalho</h1>
          </div>
          <p className="mt-2 max-w-xl text-white/80">
            Pesquise uma profissão e explore salários, demanda e perfil dos profissionais
            com dados reais do CAGED e da RAIS.
          </p>
          <div className="mt-6">
            <OccupationSearch />
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ocean">
            <Heart className="h-5 w-5 text-sun" /> Suas profissões favoritas
          </h2>
          {favorites.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-border bg-white/60 p-6 text-center text-sm text-muted-foreground">
              <Search className="mx-auto mb-2 h-6 w-6 text-muted-foreground/60" />
              Você ainda não favoritou profissões. Pesquise acima e salve as que mais te interessam.
            </div>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((f) => (
                <Link
                  key={f.occupationCode}
                  href={`/labor-market/${f.occupationCode}`}
                  className="group rounded-xl border border-border bg-white/70 p-4 transition-all hover:-translate-y-0.5 hover:border-sky/50 hover:shadow-md"
                >
                  <p className="font-semibold text-ocean group-hover:text-sky">
                    {f.occupation?.title ?? "Profissão"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">CBO {f.occupationCode}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </Reveal>
    </PageContainer>
  );
}
