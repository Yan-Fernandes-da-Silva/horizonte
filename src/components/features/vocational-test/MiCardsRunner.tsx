"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Meh, ThumbsDown, ThumbsUp, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AnswerValue, Question, Responses } from "@/lib/vocational-test/types";

interface Props {
  questions: Question[]; // 24 like_dislike
  responses: Responses;
  onAnswer: (id: string, value: AnswerValue) => void;
  onComplete: () => void;
}

const GROUP_SIZE = 6;

// Single accent (the gold used by the home icons) for all three states.
const ACTIVE = "border-gold bg-gold/20 text-gold";
const BAR: { value: string; Icon: LucideIcon }[] = [
  { value: "dislike", Icon: ThumbsDown },
  { value: "neutral", Icon: Meh },
  { value: "like", Icon: ThumbsUp },
];

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function MiCardsRunner({ questions, responses, onAnswer, onComplete }: Props) {
  const textOf = React.useMemo(() => new Map(questions.map((q) => [q.id, q.text])), [questions]);
  // Deterministic order for SSR, then shuffled once on the client (avoids a
  // hydration mismatch while still randomizing per attempt).
  const [order, setOrder] = React.useState<string[]>(() => questions.map((q) => q.id));
  React.useEffect(() => setOrder((o) => shuffle(o)), []);

  const groups = React.useMemo(() => {
    const out: string[][] = [];
    for (let i = 0; i < order.length; i += GROUP_SIZE) out.push(order.slice(i, i + GROUP_SIZE));
    return out;
  }, [order]);

  const firstIncomplete = React.useMemo(() => {
    const idx = groups.findIndex((g) => g.some((id) => responses[id] == null));
    return idx === -1 ? groups.length - 1 : idx;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [groupIndex, setGroupIndex] = React.useState(firstIncomplete);

  const group = groups[groupIndex] ?? [];
  const isLastGroup = groupIndex === groups.length - 1;
  const groupComplete = group.length > 0 && group.every((id) => responses[id] != null);

  // Auto-advance once the user completes a group (not on mount/revisit).
  const readyRef = React.useRef(false);
  const advancedRef = React.useRef<Set<number>>(new Set());
  const completedRef = React.useRef(false);

  const advance = React.useCallback(() => {
    if (isLastGroup) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    } else {
      setGroupIndex((i) => i + 1);
    }
  }, [isLastGroup, onComplete]);

  React.useEffect(() => {
    if (!readyRef.current || !groupComplete || advancedRef.current.has(groupIndex)) return;
    advancedRef.current.add(groupIndex);
    const t = setTimeout(advance, 550);
    return () => clearTimeout(t);
  }, [groupComplete, groupIndex, advance]);

  const handlePick = (id: string, value: string) => {
    readyRef.current = true;
    advancedRef.current.delete(groupIndex); // allow re-trigger if they change answers
    onAnswer(id, value);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold leading-snug text-white">
          O quanto você gosta de cada atividade?
        </h2>
        <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white">
          Grupo {groupIndex + 1}/{groups.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={groupIndex}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="mt-5 grid gap-3 sm:grid-cols-2"
        >
          {group.map((id) => {
            const current = responses[id];
            return (
              <div key={id} className="flex flex-col rounded-xl border border-white/15 bg-white/5 p-4">
                <p className="flex-1 text-sm font-medium text-white">{textOf.get(id)}</p>
                <div className="mt-3 flex justify-center gap-2">
                  {BAR.map(({ value, Icon }) => {
                    const on = current === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-label={value}
                        onClick={() => handlePick(id, value)}
                        className={cn(
                          "flex h-11 w-14 items-center justify-center rounded-lg border-2 transition-all",
                          on ? ACTIVE : "border-white/15 bg-white/5 text-white/50 hover:border-white/40 hover:text-white"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setGroupIndex((i) => Math.max(0, i - 1))}
          disabled={groupIndex === 0}
          className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        >
          Grupo anterior
        </Button>
        <Button
          type="button"
          onClick={advance}
          disabled={!groupComplete}
          className="bg-gold text-ocean hover:bg-gold-dark hover:text-white"
        >
          {isLastGroup ? "Concluir seção" : "Próximo grupo"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
