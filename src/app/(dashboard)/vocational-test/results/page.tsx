import Link from "next/link";
import { redirect } from "next/navigation";
import { ChartColumnIncreasing, Route, Sparkles } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from "@/components/shared/PageContainer";
import { Reveal } from "@/components/shared/Reveal";
import { RiasecRadar } from "@/components/features/vocational-test/results/RiasecRadar";
import { MiBars } from "@/components/features/vocational-test/results/MiBars";
import { FavoriteButton } from "@/components/features/vocational-test/FavoriteButton";
import { QUESTIONS, RIASEC_NAMES, MI_NAMES } from "@/lib/vocational-test/questions";
import { RIASEC_DESCRIPTIONS, MI_DESCRIPTIONS } from "@/lib/vocational-test/descriptions";
import { getCompatibleOccupations, getCompatibleCourses, type CourseLite } from "@/lib/vocational-test/matching";
import type { MiType, RiasecType, TestResults } from "@/lib/vocational-test/types";

// Resolve a stored GOPC/personal value into its human label via the question bank.
function optionLabel(questionId: string, value: string): string {
  const q = QUESTIONS.find((q) => q.id === questionId);
  return q?.options?.find((o) => o.value === value)?.label ?? value;
}

// GOPC questions surfaced as profile cards (curated, easy to change).
const GOPC_CARDS: { id: string; title: string }[] = [
  { id: "G1", title: "Principal motivação" },
  { id: "G3", title: "Ambiente preferido" },
  { id: "G5", title: "Como prefere trabalhar" },
  { id: "G7", title: "Rotina x desafios" },
  { id: "G9", title: "Disposição para estudar" },
  { id: "G11", title: "Foco de trabalho" },
];

export default async function VocationalTestResultsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const test = await db.vocationalTestSession.findFirst({
    where: { userId, status: "completed" },
    orderBy: { completedAt: "desc" },
  });
  if (!test?.results) redirect("/vocational-test");

  const results = test.results as unknown as TestResults;

  const [occupations, courses, favorites] = await Promise.all([
    getCompatibleOccupations(results),
    getCompatibleCourses(results),
    db.favoriteProfession.findMany({ where: { userId }, select: { occupationCode: true } }),
  ]);
  const favoriteSet = new Set(favorites.map((f) => f.occupationCode));

  const topRiasec = (Object.entries(results.riasec) as [RiasecType, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  const topMi = (Object.entries(results.mi) as [MiType, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  const interests = (results.gopc?.["G8"] as string[] | undefined) ?? [];

  return (
    <div className="-my-8 flex-1 bg-sea-top py-8">
    <PageContainer className="max-w-5xl space-y-10">
      {/* Hero */}
      <Reveal>
        <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-10 text-center text-white shadow-sm backdrop-blur-sm">
          <h1 className="text-2xl font-bold sm:text-3xl">Seu perfil profissional está pronto! 🎉</h1>
          <p className="mt-2 text-white/80">
            Veja seus tipos dominantes, inteligências mais fortes e as profissões mais compatíveis com você.
          </p>
        </div>
      </Reveal>

      {/* RIASEC */}
      <Reveal>
        <section>
          <h2 className="text-xl font-bold text-white">Seus interesses (RIASEC)</h2>
          <div className="mt-4 grid items-center gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white/70 p-4 backdrop-blur-sm">
              <RiasecRadar riasec={results.riasec} />
            </div>
            <div className="space-y-3">
              {topRiasec.map(([type, score], i) => (
                <div key={type} className="rounded-xl border border-border bg-white/70 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-ocean">
                      {i + 1}. {RIASEC_NAMES[type]}
                    </h3>
                    <Badge className="bg-sky text-ocean hover:bg-sky">{score}%</Badge>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{RIASEC_DESCRIPTIONS[type]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Multiple intelligences */}
      <Reveal>
        <section>
          <h2 className="text-xl font-bold text-white">Suas inteligências</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white/70 p-4 backdrop-blur-sm">
              <MiBars mi={results.mi} />
            </div>
            <div className="space-y-3">
              {topMi.map(([type, score], i) => (
                <div key={type} className="rounded-xl border border-border bg-white/70 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-ocean">
                      {i + 1}. {MI_NAMES[type]}
                    </h3>
                    <Badge className="bg-gold text-ocean hover:bg-gold">{score}%</Badge>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{MI_DESCRIPTIONS[type]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* GOPC profile */}
      <Reveal>
        <section>
          <h2 className="text-xl font-bold text-white">Seu perfil de carreira</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GOPC_CARDS.map(({ id, title }) => {
              const value = results.gopc?.[id];
              if (value == null || Array.isArray(value)) return null;
              return (
                <div key={id} className="rounded-xl border border-border bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky">{title}</p>
                  <p className="mt-1 font-medium text-ocean">{optionLabel(id, value)}</p>
                </div>
              );
            })}
          </div>
          {interests.length > 0 && (
            <div className="mt-3 rounded-xl border border-border bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky">Áreas de interesse</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {interests.map((v) => (
                  <Badge key={v} variant="secondary">{optionLabel("G8", v)}</Badge>
                ))}
              </div>
            </div>
          )}
        </section>
      </Reveal>

      {/* Compatible occupations */}
      <Reveal>
        <section>
          <h2 className="text-xl font-bold text-white">Profissões mais compatíveis com seu perfil</h2>
          <p className="mt-1 text-sm text-white/80">
            {occupations.length} profissões ordenadas por compatibilidade com seus interesses.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {occupations.map((o) => (
              <div key={o.code} className="flex flex-col rounded-xl border border-border bg-white/70 p-4">
                <h3 className="font-semibold text-ocean">{o.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">CBO {o.code}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <FavoriteButton occupationCode={o.code} initialFavorited={favoriteSet.has(o.code)} />
                  <Button asChild variant="outline" size="sm" className="border-ocean/30 text-ocean hover:bg-ocean/5">
                    <Link href={`/labor-market/${o.code}`}>
                      <ChartColumnIncreasing className="h-4 w-4" /> Ver no Mercado
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Compatible courses */}
      <Reveal>
        <section>
          <h2 className="text-xl font-bold text-white">Qualificações compatíveis</h2>
          <Tabs defaultValue="graduate" className="mt-4">
            <TabsList>
              <TabsTrigger value="graduate">Graduação</TabsTrigger>
              <TabsTrigger value="technological">Tecnólogo</TabsTrigger>
              <TabsTrigger value="technical">Técnico</TabsTrigger>
            </TabsList>
            <TabsContent value="graduate"><CourseList courses={courses.graduate} /></TabsContent>
            <TabsContent value="technological"><CourseList courses={courses.technological} /></TabsContent>
            <TabsContent value="technical"><CourseList courses={courses.technical} /></TabsContent>
          </Tabs>
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center text-white shadow-sm backdrop-blur-sm">
          <Route className="mx-auto h-8 w-8 text-gold" />
          <h2 className="mt-2 text-xl font-bold text-white">Pronto para o próximo passo?</h2>
          <p className="mt-1 text-sm text-white/80">
            Use seu perfil para montar um plano de carreira personalizado.
          </p>
          <Button asChild className="mt-4 bg-gold text-ocean hover:bg-gold-dark hover:text-white">
            <Link href="/career-plan/start">
              <Sparkles className="h-4 w-4" /> Criar meu Plano de Carreira
            </Link>
          </Button>
        </div>
      </Reveal>
    </PageContainer>
    </div>
  );
}

function CourseList({ courses }: { courses: CourseLite[] }) {
  if (courses.length === 0) {
    return <p className="py-6 text-center text-sm text-white/80">Nenhum curso encontrado para este perfil.</p>;
  }
  return (
    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
      {courses.map((c) => (
        <li key={c.id} className="rounded-xl border border-border bg-white/70 p-3">
          <p className="text-sm font-medium text-ocean">{c.name}</p>
          {c.area && <p className="text-xs text-muted-foreground">{c.area}</p>}
        </li>
      ))}
    </ul>
  );
}
