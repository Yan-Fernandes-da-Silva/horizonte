"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, ArrowLeft, ArrowRight, ChartColumnIncreasing, Check, ClipboardList,
  Compass, Loader2, Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/shared/PageContainer";
import { SMART_QUESTIONS, type SmartAnswers } from "@/lib/career-plan/questions";
import { NavigationGuard } from "./NavigationGuard";

export interface FavoriteOption {
  code: string;
  title: string;
}

interface Props {
  favorites: FavoriteOption[];
  hasVocationalResults: boolean;
}

type Phase = "form" | "generating" | "error";

const PRE_STEPS = 2; // step 0 = vocational confirm, step 1 = favorite choice
const TOTAL = PRE_STEPS + SMART_QUESTIONS.length;

const outline = "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white";

/** Glass selectable option (radio or checkbox look). */
function OptionButton({
  active, multi, label, onClick,
}: { active: boolean; multi?: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
        active ? "border-sky bg-sky/20 text-white shadow-sm" : "border-white/20 bg-white/5 text-white/90 hover:border-sky/50 hover:bg-white/10"
      )}
    >
      <span className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center border-2",
        multi ? "rounded-md" : "rounded-full",
        active ? "border-sky bg-sky text-white" : "border-white/40"
      )}>
        {active && (multi ? <Check className="h-3.5 w-3.5" /> : <span className="h-2.5 w-2.5 rounded-full bg-white" />)}
      </span>
      <span className="text-sm font-medium text-white">{label}</span>
    </button>
  );
}

export function Questionnaire({ favorites, hasVocationalResults }: Props) {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<SmartAnswers>({});
  const [favorite, setFavorite] = React.useState<string | null>(null);
  const [phase, setPhase] = React.useState<Phase>("form");

  // The progress-loss warning is active once the user is past the first question.
  const guardActive = phase === "form" && step >= 1;

  // Single-choice questions advance to the next step automatically after a tap.
  const advanceTimer = React.useRef<ReturnType<typeof setTimeout>>();
  React.useEffect(() => () => clearTimeout(advanceTimer.current), []);
  const scheduleNext = () => {
    if (step >= TOTAL - 1) return; // last step waits for "Gerar meu plano"
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => setStep((s) => s + 1), 280);
  };

  const create = async (fallback: boolean) => {
    setPhase("generating");
    try {
      const res = await fetch("/api/career-plan/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers, occupationCode: favorite, fallback }),
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

  // ── Generating / error phases ───────────────────────────────────────────────
  if (phase === "generating") {
    return (
      <PageContainer className="max-w-xl">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-20 text-center text-white shadow-sm backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-gold" />
          <h2 className="mt-5 text-xl font-bold">Gerando seu roadmap personalizado…</h2>
          <p className="mt-2 text-sm text-white/80">
            Estamos montando um plano sob medida com base nas suas respostas. Leva alguns segundos.
          </p>
        </div>
      </PageContainer>
    );
  }

  if (phase === "error") {
    return (
      <PageContainer className="max-w-xl">
        <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-12 text-center text-white shadow-sm backdrop-blur-sm">
          <AlertTriangle className="mx-auto h-10 w-10 text-sun" />
          <h2 className="mt-4 text-xl font-bold">Houve um problema ao gerar seu roadmap</h2>
          <p className="mt-2 text-sm text-white/80">
            Não conseguimos gerar seu plano com a IA agora. Você pode tentar novamente ou criar
            um plano básico (sem IA) para começar e editar depois.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Button onClick={() => create(false)} className="bg-gold text-ocean hover:bg-gold-dark hover:text-white">
              Tentar novamente
            </Button>
            <Button onClick={() => create(true)} variant="outline" className={outline}>
              Gerar plano básico
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  const smart = step >= PRE_STEPS ? SMART_QUESTIONS[step - PRE_STEPS] : null;
  const smartValue = smart ? answers[smart.id] : undefined;
  const smartAnswered = smart
    ? Array.isArray(smartValue) ? smartValue.length > 0 : Boolean(smartValue)
    : false;
  const isLast = step === TOTAL - 1;

  const setSingle = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v }));
  const toggleMulti = (id: string, v: string, max?: number) =>
    setAnswers((a) => {
      const cur = Array.isArray(a[id]) ? (a[id] as string[]) : [];
      if (cur.includes(v)) return { ...a, [id]: cur.filter((x) => x !== v) };
      if (max && cur.length >= max) return a;
      return { ...a, [id]: [...cur, v] };
    });

  return (
    <>
      <NavigationGuard active={guardActive} />
      <PageContainer className="max-w-2xl">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-white">Plano de Carreira</span>
            <span className="text-white/70">Passo {step + 1}/{TOTAL}</span>
          </div>
          <Progress value={((step + 1) / TOTAL) * 100} className="h-2 bg-white/20" indicatorClassName="bg-gold" />
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-white shadow-sm backdrop-blur-sm sm:p-8">
          {/* STEP 0 — vocational confirmation */}
          {step === 0 && (
            hasVocationalResults ? (
              <div>
                <h2 className="text-xl font-bold leading-snug text-white">
                  Os resultados do teste vocacional refletem seu perfil, interesses e objetivos?
                </h2>
                <p className="mt-1.5 text-sm text-white/70">
                  Vamos usar esses resultados para personalizar seu plano.
                </p>
                <div className="mt-6 space-y-2.5">
                  <OptionButton active={false} label="Sim, refletem meu perfil" onClick={() => setStep(1)} />
                  <button
                    type="button"
                    onClick={() => router.push("/vocational-test")}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white/90 transition-all hover:border-sun/50 hover:bg-white/10"
                  >
                    Não — quero refazer o teste vocacional
                  </button>
                </div>
                <div className="mt-4">
                  <Link href="/vocational-test/results" className="text-sm font-medium text-sky-light underline-offset-2 hover:underline">
                    Revisar resultados do teste
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Compass className="mx-auto h-10 w-10 text-gold" />
                <h2 className="mt-3 text-xl font-bold text-white">Faça o teste vocacional primeiro</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
                  Seu plano de carreira usa os resultados do teste vocacional. Faça o teste para
                  receber um plano mais preciso — depois volte aqui.
                </p>
                <Button asChild className="mt-6 bg-gold text-ocean hover:bg-gold-dark hover:text-white">
                  <Link href="/vocational-test"><ClipboardList className="h-4 w-4" /> Fazer o teste vocacional</Link>
                </Button>
              </div>
            )
          )}

          {/* STEP 1 — favorite profession */}
          {step === 1 && (
            favorites.length === 0 ? (
              <div className="text-center">
                <ChartColumnIncreasing className="mx-auto h-10 w-10 text-gold" />
                <h2 className="mt-3 text-xl font-bold text-white">Você ainda não favoritou nenhuma profissão</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
                  Explore o Mercado de Trabalho e favorite a profissão que você quer seguir.
                  Depois volte aqui para montar seu plano.
                </p>
                <Button asChild className="mt-6 bg-gold text-ocean hover:bg-gold-dark hover:text-white">
                  <Link href="/labor-market" data-allow-nav>
                    <ChartColumnIncreasing className="h-4 w-4" /> Ir para o Mercado de Trabalho
                  </Link>
                </Button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold leading-snug text-white">
                  Qual das suas profissões favoritas você quer seguir?
                </h2>
                <p className="mt-1.5 text-sm text-white/70">
                  Vamos basear seu plano nessa profissão.
                </p>
                <div className="mt-6 space-y-2.5">
                  {favorites.map((f) => (
                    <OptionButton
                      key={f.code}
                      active={favorite === f.code}
                      label={f.title}
                      onClick={() => { setFavorite(f.code); scheduleNext(); }}
                    />
                  ))}
                </div>
              </div>
            )
          )}

          {/* STEPS 2..N — SMART questions */}
          {smart && (
            <div>
              <h2 className="text-xl font-bold leading-snug text-white">{smart.text}</h2>
              <div className="mt-6 space-y-2.5">
                {smart.options.map((opt) => {
                  const active = Array.isArray(smartValue) ? smartValue.includes(opt.value) : smartValue === opt.value;
                  const onClick = smart.type === "multi"
                    ? () => toggleMulti(smart.id, opt.value, smart.maxSelections)
                    : () => { setSingle(smart.id, opt.value); scheduleNext(); };
                  return (
                    <OptionButton key={opt.value} active={active} multi={smart.type === "multi"} label={opt.label} onClick={onClick} />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Navigation — hidden on step 0 (its options ARE the nav) and on the
            "no favorites" dead-end. */}
        {step >= 1 && !(step === 1 && favorites.length === 0) && (
            <div className="mt-6 flex items-center justify-between">
              <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} className={outline}>
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              {isLast ? (
                <Button onClick={() => create(false)} disabled={!smartAnswered} className="bg-gold text-ocean hover:bg-gold-dark hover:text-white">
                  <Sparkles className="h-4 w-4" /> Gerar meu plano
                </Button>
              ) : (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === 1 ? !favorite : !smartAnswered}
                  className="bg-gold text-ocean hover:bg-gold-dark hover:text-white"
                >
                  Próximo <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
      </PageContainer>
    </>
  );
}
