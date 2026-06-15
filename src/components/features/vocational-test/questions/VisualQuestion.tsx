"use client";

import {
  ClipboardList, FlaskConical, Palette, Presentation, Users, Wrench,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AnswerValue, Question } from "@/lib/vocational-test/types";

interface Props {
  question: Question;
  value?: AnswerValue;
  onChange: (v: AnswerValue) => void;
}

// Icon-based environment cards (no photos needed — Yan's choice).
const ICON_MAP: Record<string, LucideIcon> = {
  Wrench, FlaskConical, Palette, Users, Presentation, ClipboardList,
};

export function VisualQuestion({ question, value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {question.options?.map((opt) => {
        const Icon = ICON_MAP[opt.icon ?? ""] ?? ClipboardList;
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all",
              active
                ? "border-sky bg-sky/10 text-ocean shadow-md"
                : "border-border bg-white text-muted-foreground hover:border-sky/40 hover:bg-sky/5"
            )}
          >
            <span
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                active ? "bg-ocean-gradient text-white" : "bg-sand text-ocean"
              )}
            >
              <Icon className="h-7 w-7" />
            </span>
            <span className="text-sm font-medium text-ocean">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
