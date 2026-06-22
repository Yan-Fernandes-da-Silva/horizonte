import { notFound, redirect } from "next/navigation";
import {
  Award, BriefcaseBusiness, Flag, Globe, Lightbulb, MapPin, Trophy, Users,
} from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadOwnedPlan } from "@/lib/career-plan/server";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from "@/components/shared/PageContainer";
import { TaskItem } from "@/components/features/career-plan/TaskItem";
import { AddTaskForm } from "@/components/features/career-plan/AddTaskForm";
import type { Roadmap } from "@/lib/ai/generate-roadmap";

const SECTIONS = [
  { key: "short_term", label: "Curto Prazo", hint: "0–12 meses" },
  { key: "medium_term", label: "Médio Prazo", hint: "1–3 anos" },
  { key: "long_term", label: "Longo Prazo", hint: "3+ anos" },
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

  const achievements = [
    { label: "Primeiros passos", earned: done >= 1, icon: Flag },
    { label: "Meio caminho", earned: percent >= 50, icon: Award },
    { label: "Destino alcançado", earned: percent === 100 && total > 0, icon: Trophy },
  ];

  return (
    <div className="-my-8 flex-1 bg-sea-top py-8">
    <PageContainer className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{plan.title}</h1>
      </div>

      {roadmap && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white/70 p-5">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-sky"><MapPin className="h-4 w-4" /> Onde você está</p>
            <p className="mt-1.5 text-sm text-ocean">{roadmap.startingPoint}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white/70 p-5">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-dark"><Flag className="h-4 w-4" /> Onde quer chegar</p>
            <p className="mt-1.5 text-sm text-ocean">{roadmap.destination}</p>
          </div>
        </div>
      )}

      {/* Progress + gamification */}
      <div className="rounded-2xl border border-border bg-white/80 p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm font-medium text-ocean">
          <span>Progresso geral</span>
          <span>{done}/{total} tarefas · {percent}%</span>
        </div>
        <Progress value={percent} className="mt-2 h-2.5" />
        <div className="mt-4 flex flex-wrap gap-2">
          {achievements.map((a) => (
            <span
              key={a.label}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${a.earned ? "bg-gold/20 text-gold-dark" : "bg-muted text-muted-foreground/60"}`}
            >
              <a.icon className="h-3.5 w-3.5" /> {a.label}
            </span>
          ))}
        </div>
      </div>

      {/* Task sections */}
      {SECTIONS.map((section) => {
        const sectionTasks = tasks.filter((t) => t.category === section.key);
        return (
          <section key={section.key}>
            <h2 className="mb-3 flex items-baseline gap-2 text-lg font-bold text-white">
              {section.label} <span className="text-xs font-normal text-white/70">{section.hint}</span>
            </h2>
            <div className="space-y-2">
              {sectionTasks.map((t) => (
                <TaskItem key={t.id} planId={plan.id} task={t} />
              ))}
              <AddTaskForm planId={plan.id} category={section.key} />
            </div>
          </section>
        );
      })}

      {roadmap && (
        <>
          {/* Learning trails */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-white">Trilhas de Aprendizado</h2>
            <Tabs defaultValue="courses" className="rounded-2xl border border-border bg-white/70 p-4">
              <TabsList className="flex-wrap">
                <TabsTrigger value="courses">Cursos</TabsTrigger>
                <TabsTrigger value="books">Livros</TabsTrigger>
                <TabsTrigger value="projects">Projetos</TabsTrigger>
                <TabsTrigger value="certifications">Certificações</TabsTrigger>
              </TabsList>
              {(["courses", "books", "projects", "certifications"] as const).map((key) => (
                <TabsContent key={key} value={key} className="mt-3">
                  <ul className="space-y-1.5">
                    {roadmap.learningTrails[key].map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-ocean">
                        <span className="text-sky">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          {/* Strategic recommendations */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-white">Recomendações Estratégicas</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Users, title: "Networking", text: roadmap.recommendations.networking },
                { icon: Globe, title: "Idiomas", text: roadmap.recommendations.languages },
                { icon: BriefcaseBusiness, title: "Portfólio", text: roadmap.recommendations.portfolio },
                { icon: Lightbulb, title: "Hábitos", text: roadmap.recommendations.habits },
              ].map((r) => (
                <div key={r.title} className="rounded-xl border border-border bg-white/70 p-4">
                  <p className="flex items-center gap-1.5 font-semibold text-ocean"><r.icon className="h-4 w-4 text-sky" /> {r.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Future careers */}
          {roadmap.futureCareers.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold text-white">Cargos Futuros Possíveis</h2>
              <div className="flex flex-wrap gap-2">
                {roadmap.futureCareers.map((c) => (
                  <Badge key={c} className="bg-white/15 text-white hover:bg-white/15">{c}</Badge>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </PageContainer>
    </div>
  );
}
