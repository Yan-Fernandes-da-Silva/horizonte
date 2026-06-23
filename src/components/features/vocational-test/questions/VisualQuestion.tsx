"use client";

import {
  ClipboardList, Hammer, HeartHandshake, Megaphone, Microscope, Palette,
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
  Hammer, Microscope, Palette, HeartHandshake, Megaphone, ClipboardList,
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
                ? "border-sky bg-sky/15 text-white shadow-md"
                : "border-white/20 bg-white/5 text-white/90 hover:border-sky/40 hover:bg-white/10"
            )}
          >
            <span
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl text-gold transition-colors",
                active ? "bg-gold/20" : "bg-white/10"
              )}
            >
              <Icon className="h-7 w-7" />
            </span>
            <span className="text-sm font-medium text-white">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
