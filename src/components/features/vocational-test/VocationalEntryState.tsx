"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StartTestButton } from "./StartTestButton";

export interface EntryStatus {
  status: "not_started" | "in_progress" | "completed";
  progress: number;
  currentSectionLabel: string;
  dominantTypes: string[];
}

/**
 * Renders the test's current state (not started / in progress / completed) and
 * re-validates it on mount and whenever the window regains focus. This keeps the
 * progress bar fresh when the user answers a few questions, leaves to another
 * page and comes back — without needing a full page reload.
 */
export function VocationalEntryState({ initial }: { initial: EntryStatus }) {
  const [data, setData] = React.useState<EntryStatus>(initial);

  React.useEffect(() => {
    let active = true;
    const refetch = async () => {
      try {
        const res = await fetch("/api/vocational-test/status", { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as EntryStatus;
        if (active) setData(next);
      } catch {
        /* keep the last known state on a network hiccup */
      }
    };

    refetch();
    const onFocus = () => refetch();
    window.addEventListener("focus", onFocus);
    return () => {
      active = false;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  if (data.status === "completed") {
    return <CompletedState dominantTypes={data.dominantTypes} />;
  }
  if (data.status === "in_progress") {
    return <InProgressState progress={data.progress} currentSection={data.currentSectionLabel} />;
  }
  return <NotStartedState />;
}

const outlineOnDark =
  "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white";

function NotStartedState() {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold text-white">Pronto para começar?</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
        São 3 seções rápidas e interativas. Você pode pausar e continuar depois —
        suas respostas são salvas automaticamente.
      </p>
      <div className="mt-6">
        <StartTestButton className="px-8">Começar teste</StartTestButton>
      </div>
    </div>
  );
}

function InProgressState({ progress, currentSection }: { progress: number; currentSection: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gold">
        <Clock className="h-5 w-5" />
        <h2 className="text-xl font-bold text-white">Continue de onde parou</h2>
      </div>
      <p className="mt-2 text-sm text-white/80">
        Você está na seção <strong className="text-white">{currentSection}</strong>.
      </p>
      <div className="mt-4 space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-white/70">
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-white/20" indicatorClassName="bg-gold" />
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button asChild className="bg-gold text-ocean hover:bg-gold-dark hover:text-white">
          <Link href="/vocational-test/riasec">Continuar o teste</Link>
        </Button>
        <StartTestButton variant="outline" className={outlineOnDark}>
          Recomeçar do zero
        </StartTestButton>
      </div>
    </div>
  );
}

function CompletedState({ dominantTypes }: { dominantTypes: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-emerald-300">
        <CheckCircle2 className="h-5 w-5" />
        <h2 className="text-xl font-bold text-white">Teste concluído!</h2>
      </div>
      <p className="mt-2 text-sm text-white/80">
        Seus tipos dominantes são:{" "}
        <strong className="text-white">{dominantTypes.join(", ")}</strong>.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button asChild className="bg-gold text-ocean hover:bg-gold-dark hover:text-white">
          <Link href="/vocational-test/results">Ver resultados</Link>
        </Button>
        <StartTestButton variant="outline" className={outlineOnDark}>
          Refazer o teste
        </StartTestButton>
      </div>
    </div>
  );
}
