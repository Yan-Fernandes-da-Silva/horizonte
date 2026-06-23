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

  // Drag-and-drop reorder (works alongside the up/down arrows).
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const reorder = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <ol className="space-y-2.5">
      {order.map((val, i) => (
        <li
          key={val}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => { if (dragIndex !== null) reorder(dragIndex, i); setDragIndex(null); }}
          onDragEnd={() => setDragIndex(null)}
          className={cn(
            "flex cursor-grab items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-4 py-3 active:cursor-grabbing",
            dragIndex === i && "opacity-50"
          )}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-ocean">
            {i + 1}
          </span>
          <GripVertical className="h-4 w-4 shrink-0 text-white/40" />
          <span className="flex-1 text-sm font-medium text-white">{labelOf(val)}</span>
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              aria-label="Mover para cima"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className={cn("rounded p-0.5 text-white/70 hover:bg-white/10 hover:text-white", i === 0 && "opacity-30")}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Mover para baixo"
              onClick={() => move(i, 1)}
              disabled={i === order.length - 1}
              className={cn("rounded p-0.5 text-white/70 hover:bg-white/10 hover:text-white", i === order.length - 1 && "opacity-30")}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
}
