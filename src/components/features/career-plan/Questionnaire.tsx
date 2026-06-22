"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/shared/PageContainer";
import { SMART_QUESTIONS, type SmartAnswers } from "@/lib/career-plan/questions";

type Phase = "form" | "generating" | "error";

export function Questionnaire() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<SmartAnswers>({});
  const [phase, setPhase] = React.useState<Phase>("form");

  const question = SMART_QUESTIONS[step];
  const total = SMART_QUESTIONS.length;
  const value = answers[question.id];
  const answered = Array.isArray(value) ? value.length > 0 : Boolean(value);

  const setSingle = (v: string) => setAnswers((a) => ({ ...a, [question.id]: v }));
  const toggleMulti = (v: string) => {
    const cur = Array.isArray(value) ? value : [];
    if (cur.includes(v)) {
      setAnswers((a) => ({ ...a, [question.id]: cur.filter((x) => x !== v) }));
    } else if (!question.maxSelections || cur.length < question.maxSelections) {
      setAnswers((a) => ({ ...a, [question.id]: [...cur, v] }));
    }
  };

  const create = async (fallback: boolean) => {
    setPhase("generating");
    try {
      const res = await fetch("/api/career-plan/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers, fallback }),
      });
      if (res.status === 502) {
        setPhase("error");
        return;
      }
      if (!res.ok) throw new Error();
      const { planId } = (await res.json()) as { planId: string };
      router.push(`/career-plan/${planId}`);
      router.refresh();
    } catch {
      setPhase("form");
      toast.error("Erro ao criar o plano. Tente novamente.");
    }
  };

  if (phase === "generating") {
    return (
      <PageContainer className="max-w-xl">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white/80 px-6 py-20 text-center shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-sky" />
          <h2 className="mt-5 text-xl font-bold text-ocean">Gerando seu roadmap personalizado…</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Estamos montando um plano sob medida com base nas suas respostas. Isso leva alguns segundos.
          </p>
        </div>
      </PageContainer>
    );
  }

  if (phase === "error") {
    return (
      <PageContainer className="max-w-xl">
        <div className="rounded-2xl border border-sun/30 bg-sun/5 px-6 py-12 text-center shadow-sm">
          <AlertTriangle className="mx-auto h-10 w-10 text-sun" />
          <h2 className="mt-4 text-xl font-bold text-ocean">Houve um problema ao gerar seu roadmap</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Não conseguimos gerar seu plano com a IA agora. Você pode tentar novamente ou criar um
            plano básico (sem IA) para começar e editar depois.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Button onClick={() => create(false)} className="bg-gold text-ocean hover:bg-gold-dark hover:text-white">
              Tentar novamente
            </Button>
            <Button onClick={() => create(true)} variant="outline" className="border-ocean/30 text-ocean hover:bg-ocean/5">
              Gerar plano básico
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const isLast = step === total - 1;

  return (
    <PageContainer className="max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-white">Plano de Carreira</span>
          <span className="text-white/70">Passo {step + 1}/{total}</span>
        </div>
        <Progress value={((step + 1) / total) * 100} className="h-2 bg-white/20" indicatorClassName="bg-gold" />
      </div>

      <div className="rounded-2xl border border-border bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <h2 className="text-xl font-bold leading-snug text-ocean">{question.text}</h2>
        <div className="mt-6 space-y-2.5">
          {question.options.map((opt) => {
            const active = Array.isArray(value) ? value.includes(opt.value) : value === opt.value;
            const onClick = question.type === "multi" ? () => toggleMulti(opt.value) : () => setSingle(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={onClick}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                  active ? "border-sky bg-sky/10 text-ocean shadow-sm" : "border-border bg-white hover:border-sky/50 hover:bg-sky/5"
                )}
              >
                <span className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center border-2",
                  question.type === "multi" ? "rounded-md" : "rounded-full",
                  active ? "border-sky bg-sky text-white" : "border-muted-foreground/40"
                )}>
                  {active && (question.type === "multi" ? <Check className="h-3.5 w-3.5" /> : <span className="h-2.5 w-2.5 rounded-full bg-white" />)}
                </span>
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        {isLast ? (
          <Button onClick={() => create(false)} disabled={!answered} className="bg-gold text-ocean hover:bg-gold-dark hover:text-white">
            <Sparkles className="h-4 w-4" /> Gerar meu plano
          </Button>
        ) : (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!answered} className="bg-gold text-ocean hover:bg-gold-dark hover:text-white">
            Próximo <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </PageContainer>
  );
}
