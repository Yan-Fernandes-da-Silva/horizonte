"use client";

import { Heart, Minus, ThumbsDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AnswerValue, Question } from "@/lib/vocational-test/types";

interface Props {
  question: Question;
  value?: AnswerValue;
  onChange: (v: AnswerValue) => void;
}

const ICONS = { dislike: ThumbsDown, neutral: Minus, like: Heart } as const;
const ACTIVE_STYLE: Record<string, string> = {
  dislike: "border-sun bg-sun/10 text-sun",
  neutral: "border-muted-foreground/50 bg-muted text-muted-foreground",
  like: "border-sky bg-sky/10 text-sky",
};

/** Three big icon buttons: Não gosto / Indiferente / Gosto. */
export function LikeDislikeQuestion({ question, value, onChange }: Props) {
  return (
    <div className="flex justify-center gap-3 sm:gap-4">
      {question.options?.map((opt) => {
        const Icon = ICONS[opt.value as keyof typeof ICONS] ?? Minus;
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-1 max-w-[10rem] flex-col items-center gap-2 rounded-2xl border-2 px-4 py-6 transition-all",
              active
                ? ACTIVE_STYLE[opt.value]
                : "border-border bg-white text-muted-foreground hover:border-sky/40 hover:bg-sky/5"
            )}
          >
            <Icon className={cn("h-8 w-8", active && opt.value === "like" && "fill-sky/20")} />
            <span className="text-sm font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
