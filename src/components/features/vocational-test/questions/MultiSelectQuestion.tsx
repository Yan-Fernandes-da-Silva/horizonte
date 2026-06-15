"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AnswerValue, Question } from "@/lib/vocational-test/types";

interface Props {
  question: Question;
  value?: AnswerValue;
  onChange: (v: AnswerValue) => void;
}

/** Multiple-choice toggle list, honoring `maxSelections`. */
export function MultiSelectQuestion({ question, value, onChange }: Props) {
  const selected = Array.isArray(value) ? value : [];
  const max = question.maxSelections;
  const atLimit = max != null && selected.length >= max;

  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else if (!atLimit) {
      onChange([...selected, val]);
    }
  };

  return (
    <div className="space-y-2.5">
      {max != null && (
        <p className="text-xs text-muted-foreground">
          Selecione até {max} ({selected.length} selecionada{selected.length === 1 ? "" : "s"})
        </p>
      )}
      {question.options?.map((opt) => {
        const active = selected.includes(opt.value);
        const disabled = !active && atLimit;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            disabled={disabled}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
              active
                ? "border-sky bg-sky/10 text-ocean shadow-sm"
                : "border-border bg-white hover:border-sky/50 hover:bg-sky/5",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2",
                active ? "border-sky bg-sky text-white" : "border-muted-foreground/40"
              )}
            >
              {active && <Check className="h-3.5 w-3.5" />}
            </span>
            <span className="text-sm font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
