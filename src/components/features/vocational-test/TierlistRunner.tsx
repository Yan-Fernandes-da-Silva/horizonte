"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Meh, Target, ThumbsDown, ThumbsUp, X, type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TIER_LEVELS } from "@/lib/vocational-test/questions";
import type { AnswerValue, Question, Responses } from "@/lib/vocational-test/types";
import { QuestionRenderer } from "./questions/QuestionRenderer";

interface Props {
  questions: Question[]; // riasec section: 18 tier + 1 visual (RV)
  responses: Responses;
  onAnswer: (id: string, value: AnswerValue) => void;
  onComplete: () => void;
}

const TIER_ICON: Record<string, LucideIcon> = { X, ThumbsDown, Meh, ThumbsUp, Target };
// Neutral bands (no tiermaker-style background colors).
const TIER_BAND = "border-white/15 bg-white/5 text-white/80";

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function TierlistRunner({ questions, responses, onAnswer, onComplete }: Props) {
  const tierQuestions = React.useMemo(() => questions.filter((q) => q.type === "tier"), [questions]);
  const rv = React.useMemo(() => questions.find((q) => q.type === "visual"), [questions]);
  const textOf = React.useMemo(
    () => new Map(tierQuestions.map((q) => [q.id, q.text])),
    [tierQuestions]
  );

  // Deterministic order for SSR, then shuffled once on the client (avoids a
  // hydration mismatch while still randomizing per attempt).
  const [order, setOrder] = React.useState<string[]>(() => tierQuestions.map((q) => q.id));
  React.useEffect(() => setOrder((o) => shuffle(o)), []);
  const [phase, setPhase] = React.useState<"tier" | "rv">("tier");
  // The placed chip the user expanded (also the one a band-tap will move).
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [dragId, setDragId] = React.useState<string | null>(null);

  const placedValue = (id: string) => {
    const v = responses[id];
    return typeof v === "number" ? v : undefined;
  };
  const unplaced = order.filter((id) => placedValue(id) === undefined);
  const nextUnplaced = unplaced[0] ?? null;
  // The card a band-tap will act on: an expanded placed chip, else the next new card.
  const activeId = expandedId && placedValue(expandedId) !== undefined ? expandedId : nextUnplaced;
  const placedCount = order.length - unplaced.length;
  const allPlaced = unplaced.length === 0;

  const place = (id: string | null, value: number) => {
    if (!id) return;
    onAnswer(id, value);
    setExpandedId(null);
  };

  const rvAnswered = rv ? responses[rv.id] != null : true;

  // ── RV sub-phase ────────────────────────────────────────────────────────────
  if (phase === "rv" && rv) {
    return (
      <div>
        <h2 className="text-xl font-bold leading-snug text-white">{rv.text}</h2>
        {rv.helpText && <p className="mt-1.5 text-sm text-white/70">{rv.helpText}</p>}
        <div className="mt-6">
          <QuestionRenderer question={rv} value={responses[rv.id]} onChange={(v) => onAnswer(rv.id, v)} />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPhase("tier")}
            className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            Voltar
          </Button>
          <Button
            type="button"
            onClick={onComplete}
            disabled={!rvAnswered}
            className="bg-gold text-ocean hover:bg-gold-dark hover:text-white"
          >
            Concluir seção <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ── Tier sub-phase ──────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold leading-snug text-white">
          Classifique cada afirmação para a faixa que faz sentido para você
        </h2>
        <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white">
          {placedCount}/{order.length}
        </span>
      </div>

      {/* Current card to place */}
      <div className="mt-4 min-h-[5.5rem]">
        <AnimatePresence mode="wait">
          {nextUnplaced ? (
            <motion.div
              key={nextUnplaced}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.18 }}
              draggable
              onDragStart={() => setDragId(nextUnplaced)}
              onDragEnd={() => setDragId(null)}
              className={cn(
                "cursor-grab select-none rounded-2xl bg-gold p-4 text-center text-base font-semibold text-ocean shadow-sm active:cursor-grabbing",
                expandedId == null && "ring-2 ring-white/60"
              )}
            >
              {textOf.get(nextUnplaced)}
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-emerald-300/40 bg-emerald-400/10 p-4 text-center text-sm font-medium text-emerald-200">
              Tudo classificado! Você pode mover os cards entre as faixas ou toque em continuar.
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Tier bands */}
      <div className="mt-4 space-y-2">
        {TIER_LEVELS.map((tier) => {
          const Icon = TIER_ICON[tier.icon] ?? Meh;
          const chips = order.filter((id) => placedValue(id) === tier.value);
          return (
            <div
              key={tier.value}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                place(dragId ?? activeId, tier.value);
                setDragId(null);
              }}
              onClick={() => place(activeId, tier.value)}
              className={cn(
                "flex min-h-[3.5rem] cursor-pointer gap-3 rounded-xl border p-2 transition-colors",
                TIER_BAND
              )}
            >
              <div className="flex w-28 shrink-0 flex-col items-center justify-center gap-1 text-center">
                <Icon className="h-5 w-5" />
                <span className="text-[11px] font-semibold leading-tight">{tier.label}</span>
              </div>
              <div className="flex flex-1 flex-wrap content-start gap-1.5">
                {chips.map((id) => {
                  const expanded = expandedId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      draggable
                      onDragStart={(e) => { e.stopPropagation(); setDragId(id); }}
                      onDragEnd={() => setDragId(null)}
                      onClick={(e) => { e.stopPropagation(); setExpandedId(expanded ? null : id); }}
                      className={cn(
                        "cursor-grab rounded-lg border border-white/20 bg-ocean/50 px-2 py-1 text-left text-[11px] font-medium leading-tight text-white active:cursor-grabbing",
                        expanded ? "w-full ring-2 ring-gold/70" : "max-w-[10rem] line-clamp-2"
                      )}
                      title={textOf.get(id)}
                    >
                      {textOf.get(id)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          onClick={() => (rv ? setPhase("rv") : onComplete())}
          disabled={!allPlaced}
          className="bg-gold text-ocean hover:bg-gold-dark hover:text-white"
        >
          Continuar <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
