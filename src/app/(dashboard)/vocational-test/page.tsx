import Link from "next/link";
import { redirect } from "next/navigation";
import { Compass, Clock, CheckCircle2, Sparkles } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/shared/PageContainer";
import { Reveal } from "@/components/shared/Reveal";
import { StartTestButton } from "@/components/features/vocational-test/StartTestButton";
import { SECTIONS } from "@/lib/vocational-test/questions";
import type { SessionAnswers, TestResults } from "@/lib/vocational-test/types";

export default async function VocationalTestEntryPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const test = await db.vocationalTestSession.findFirst({
    where: { userId },
    orderBy: { startedAt: "desc" },
  });

  const status = test?.status ?? "not_started";
  const answers = (test?.answers ?? null) as SessionAnswers | null;
  const results = (test?.results ?? null) as TestResults | null;

  return (
    <PageContainer className="max-w-3xl">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl bg-ocean-gradient px-6 py-10 text-center text-white shadow-md sm:px-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <Compass className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">Teste Vocacional</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Descubra seu perfil profissional combinando três frameworks: RIASEC (interesses),
            Inteligências Múltiplas e seus valores de carreira.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-6 rounded-2xl border border-border bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          {status === "completed" && results ? (
            <CompletedState dominantTypes={results.dominantTypes} />
          ) : status === "in_progress" && answers ? (
            <InProgressState progress={answers.progress} currentSection={answers.currentSectionLabel} />
          ) : (
            <NotStartedState />
          )}
        </div>
      </Reveal>

      {/* What the test covers */}
      <Reveal delay={0.2}>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {SECTIONS.map((s, i) => (
            <div key={s.id} className="flex items-start gap-3 rounded-xl border border-border bg-white/60 p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky/15 text-sm font-bold text-sky">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-ocean">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </PageContainer>
  );
}

function NotStartedState() {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold text-ocean">Pronto para começar?</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        São 54 perguntas rápidas, divididas em 4 seções. Você pode pausar e continuar
        depois — suas respostas são salvas automaticamente.
      </p>
      <div className="mt-6">
        <StartTestButton className="px-8">
          <Sparkles className="h-4 w-4" /> Começar teste
        </StartTestButton>
      </div>
    </div>
  );
}

function InProgressState({ progress, currentSection }: { progress: number; currentSection: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gold-dark">
        <Clock className="h-5 w-5" />
        <h2 className="text-xl font-bold text-ocean">Continue de onde parou</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Você está na seção <strong className="text-ocean">{currentSection}</strong>.
      </p>
      <div className="mt-4 space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button asChild className="bg-gold text-ocean hover:bg-gold-dark hover:text-white">
          <Link href="/vocational-test/riasec">Continuar o teste</Link>
        </Button>
        <StartTestButton variant="outline">Recomeçar do zero</StartTestButton>
      </div>
    </div>
  );
}

function CompletedState({ dominantTypes }: { dominantTypes: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-emerald-600">
        <CheckCircle2 className="h-5 w-5" />
        <h2 className="text-xl font-bold text-ocean">Teste concluído!</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Seus tipos dominantes são:{" "}
        <strong className="text-ocean">{dominantTypes.join(", ")}</strong>.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button asChild className="bg-gold text-ocean hover:bg-gold-dark hover:text-white">
          <Link href="/vocational-test/results">Ver resultados</Link>
        </Button>
        <StartTestButton variant="outline">Refazer o teste</StartTestButton>
      </div>
    </div>
  );
}
