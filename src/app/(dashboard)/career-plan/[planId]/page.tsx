import { notFound, redirect } from "next/navigation";
import {
  Award, BriefcaseBusiness, Flag, Globe, Info, Lightbulb, MapPin,
  Sparkles, Target, TriangleAlert, Trophy, Users, Zap,
} from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadOwnedPlan } from "@/lib/career-plan/server";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from "@/components/shared/PageContainer";
import { TaskItem } from "@/components/features/career-plan/TaskItem";
import { AddTaskForm } from "@/components/features/career-plan/AddTaskForm";
import { DeletePlanButton } from "@/components/features/career-plan/DeletePlanButton";
import type { Roadmap } from "@/lib/ai/generate-roadmap";

const SECTIONS = [
  { key: "short_term", label: "Curto Prazo", hint: "até 6 meses" },
  { key: "medium_term", label: "Médio Prazo", hint: "6 meses a 3 anos" },
  { key: "long_term", label: "Longo Prazo", hint: "3 anos ou +" },
] as const;

const courseTab =
  "text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-none";

const TRAILS = [
  { key: "content", label: "Conteúdo" },
  { key: "courses", label: "Cursos" },
  { key: "books", label: "Livros" },
  { key: "projects", label: "Projetos" },
] as const;

export default async function CareerPlanRoadmapPage({ params }: { params: { planId: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const plan = await loadOwnedPlan(params.planId, userId);
  if (!plan) notFound();

  const roadmap = plan.roadmap as unknown as Roadmap | null;
  const tasks = plan.tasks;
  const total = plan.tasks.length;
  const done = plan.tasks.filter((t) => t.status === "completed").length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  // Defensive defaults — plans created before this format don't have the new fields.
  const steps = roadmap?.steps ?? [];
  const develop = roadmap?.develop ?? { competencias: [], experiencias: [], resultados: [] };
  const challenges = roadmap?.challenges ?? [];
  const trails = roadmap?.learningTrails ?? { content: [], courses: [], books: [], projects: [] };

  // Recommendations / challenges may be a list (new plans) or a single string (older
  // plans). Normalize to an array so both render as bullet lists.
  const toList = (v: unknown): string[] =>
    Array.isArray(v)
      ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "")
      : typeof v === "string" && v.trim() !== ""
        ? [v]
        : [];

  const achievements = [
    { label: "Primeiros passos", earned: done >= 1, icon: Flag },
    { label: "Meio caminho", earned: percent >= 50, icon: Award },
    { label: "Destino alcançado", earned: percent === 100 && total > 0, icon: Trophy },
  ];

  const developGroups = [
    { title: "Competências", items: develop.competencias ?? [] },
    { title: "Experiências", items: develop.experiencias ?? [] },
    { title: "Resultados", items: develop.resultados ?? [] },
  ];

  return (
    <div className="-my-8 flex-1 bg-sea-top py-8">
    <PageContainer className="max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">{plan.title}</h1>

      {roadmap && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Roadmap da carreira</h2>

          {roadmap.summary && (
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-sm">
              <p className="text-sm leading-relaxed text-white/85">{roadmap.summary}</p>
            </div>
          )}

          {roadmap.whyThisPath && (
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold">
                <Sparkles className="h-4 w-4" /> Por que esse caminho combina
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/85">{roadmap.whyThisPath}</p>
            </div>
          )}

          {/* Onde está → etapas → onde quer chegar */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-sky-light"><MapPin className="h-4 w-4" /> Onde você está</p>
              <p className="mt-1.5 text-sm text-white/85">{roadmap.startingPoint}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold"><Target className="h-4 w-4" /> Onde quer chegar</p>
              <p className="mt-1.5 text-sm text-white/85">{roadmap.destination}</p>
            </div>
          </div>

          {steps.length > 0 && (
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/70">Etapas do caminho</p>
              <ol className="relative space-y-4 border-l border-white/20 pl-6">
                {steps.map((s, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-ocean">{i + 1}</span>
                    <p className="font-semibold text-white">{s.title}</p>
                    <p className="text-sm text-white/70">{s.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* O que desenvolver */}
          {developGroups.some((g) => g.items.length > 0) && (
            <div className="grid gap-3 sm:grid-cols-3">
              {developGroups.map((g) => (
                <div key={g.title} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-light">{g.title}</p>
                  <ul className="mt-2 space-y-1.5">
                    {g.items.map((it, i) => (
                      <li key={i} className="flex gap-2 text-sm text-white/85"><span className="text-gold">•</span> {it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Primeiro passo desta semana */}
          {roadmap.firstStep && (
            <div className="rounded-2xl border border-gold/40 bg-gold/10 p-5 text-white backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold"><Zap className="h-4 w-4" /> Primeiro passo desta semana</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white">{roadmap.firstStep}</p>
            </div>
          )}

          <p className="flex items-start gap-1.5 text-xs text-white/60">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            O roadmap não precisa ser 100% preciso — ele serve mais como direção estratégica do que como roteiro fixo.
          </p>
        </section>
      )}

      {/* Cronograma — progresso + tarefas editáveis */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Cronograma</h2>
        <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Progresso geral</span>
            <span>{done}/{total} tarefas · {percent}%</span>
          </div>
          <Progress value={percent} className="mt-2 h-2.5 bg-white/20" indicatorClassName="bg-gold" />
          <div className="mt-4 flex flex-wrap gap-2">
            {achievements.map((a) => (
              <span
                key={a.label}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${a.earned ? "bg-gold/20 text-gold" : "bg-white/10 text-white/50"}`}
              >
                <a.icon className="h-3.5 w-3.5" /> {a.label}
              </span>
            ))}
          </div>
        </div>

        {SECTIONS.map((section) => {
          const sectionTasks = tasks.filter((t) => t.category === section.key);
          return (
            <div key={section.key}>
              <h3 className="mb-3 flex items-baseline gap-2 text-lg font-bold text-white">
                {section.label} <span className="text-xs font-normal text-white/70">{section.hint}</span>
              </h3>
              <div className="space-y-2">
                {sectionTasks.map((t) => (
                  <TaskItem key={t.id} planId={plan.id} task={t} />
                ))}
                <AddTaskForm planId={plan.id} category={section.key} />
              </div>
            </div>
          );
        })}
      </section>

      {roadmap && (
        <>
          {/* Trilhas de Aprendizado */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-white">Trilhas de Aprendizado</h2>
            <Tabs defaultValue="content" className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <TabsList className="flex-wrap bg-white/10">
                {TRAILS.map((t) => (
                  <TabsTrigger key={t.key} value={t.key} className={courseTab}>{t.label}</TabsTrigger>
                ))}
              </TabsList>
              {TRAILS.map((t) => {
                const items = (trails[t.key] as string[] | undefined) ?? [];
                return (
                  <TabsContent key={t.key} value={t.key} className="mt-3">
                    {items.length === 0 ? (
                      <p className="py-2 text-sm text-white/60">Sem sugestões nesta categoria.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {items.map((item, i) => (
                          <li key={i} className="flex gap-2 text-sm text-white/85"><span className="text-gold">•</span> {item}</li>
                        ))}
                      </ul>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </section>

          {/* Desafios e como superar */}
          {challenges.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-bold text-white">Desafios e como superar</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {challenges.map((c, i) => (
                  <div key={i} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                    <p className="flex items-center gap-1.5 font-semibold text-white"><TriangleAlert className="h-4 w-4 text-sun" /> {c.obstacle}</p>
                    <ul className="mt-2 space-y-1.5">
                      {toList(c.howToOvercome).map((item, j) => (
                        <li key={j} className="flex gap-2 text-sm text-white/80"><span className="text-gold">•</span> {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recomendações Estratégicas */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-white">Recomendações Estratégicas</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Users, title: "Networking", items: toList(roadmap.recommendations?.networking) },
                { icon: Globe, title: "Idiomas", items: toList(roadmap.recommendations?.languages) },
                { icon: BriefcaseBusiness, title: "Portfólio", items: toList(roadmap.recommendations?.portfolio) },
                { icon: Lightbulb, title: "Hábitos", items: toList(roadmap.recommendations?.habits) },
              ].map((r) => (
                <div key={r.title} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                  <p className="flex items-center gap-1.5 font-semibold text-white"><r.icon className="h-4 w-4 text-sky-light" /> {r.title}</p>
                  <ul className="mt-2 space-y-1.5">
                    {r.items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-white/80"><span className="text-gold">•</span> {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <DeletePlanButton planId={plan.id} />
    </PageContainer>
    </div>
  );
}
