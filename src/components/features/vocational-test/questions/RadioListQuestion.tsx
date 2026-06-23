"use client";

import { cn } from "@/lib/utils";
import type { AnswerValue, Question } from "@/lib/vocational-test/types";

interface Props {
  question: Question;
  value?: AnswerValue;
  onChange: (v: AnswerValue) => void;
}

/** Single-choice radio list — used for `likert` and `single_select`. */
export function RadioListQuestion({ question, value, onChange }: Props) {
  return (
    <div className="space-y-2.5">
      {question.options?.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
              active
                ? "border-sky bg-sky/20 text-white shadow-sm"
                : "border-white/20 bg-white/5 text-white/90 hover:border-sky/50 hover:bg-white/10"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                active ? "border-sky" : "border-white/40"
              )}
            >
              {active && <span className="h-2.5 w-2.5 rounded-full bg-sky" />}
            </span>
            <span className="text-sm font-medium text-white">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
