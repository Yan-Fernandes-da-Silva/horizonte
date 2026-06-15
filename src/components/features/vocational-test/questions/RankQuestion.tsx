"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AnswerValue, Question } from "@/lib/vocational-test/types";

interface Props {
  question: Question;
  value?: AnswerValue;
  onChange: (v: AnswerValue) => void;
}

/** Preference ordering via up/down controls (accessible, no drag dependency). */
export function RankQuestion({ question, value, onChange }: Props) {
  const options = question.options ?? [];
  const defaultOrder = React.useMemo(
    () => (question.options ?? []).map((o) => o.value),
    [question.options]
  );
  const order = Array.isArray(value) && value.length === defaultOrder.length ? value : defaultOrder;

  // Persist the starting order so the question counts as answered.
  React.useEffect(() => {
    if (!Array.isArray(value) || value.length !== defaultOrder.length) onChange(defaultOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const labelOf = (val: string) => options.find((o) => o.value === val)?.label ?? val;

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <ol className="space-y-2.5">
      {order.map((val, i) => (
        <li
          key={val}
          className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ocean text-sm font-bold text-white">
            {i + 1}
          </span>
          <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />
          <span className="flex-1 text-sm font-medium text-ocean">{labelOf(val)}</span>
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              aria-label="Mover para cima"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className={cn("rounded p-0.5 text-muted-foreground hover:bg-sky/10 hover:text-sky", i === 0 && "opacity-30")}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Mover para baixo"
              onClick={() => move(i, 1)}
              disabled={i === order.length - 1}
              className={cn("rounded p-0.5 text-muted-foreground hover:bg-sky/10 hover:text-sky", i === order.length - 1 && "opacity-30")}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
}
