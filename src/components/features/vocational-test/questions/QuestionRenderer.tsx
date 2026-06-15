"use client";

import type { AnswerValue, Question } from "@/lib/vocational-test/types";
import { RadioListQuestion } from "./RadioListQuestion";
import { MultiSelectQuestion } from "./MultiSelectQuestion";
import { LikeDislikeQuestion } from "./LikeDislikeQuestion";
import { VisualQuestion } from "./VisualQuestion";
import { RankQuestion } from "./RankQuestion";

interface Props {
  question: Question;
  value?: AnswerValue;
  onChange: (v: AnswerValue) => void;
}

// Registry: question type → component. Add a new type here once.
const REGISTRY = {
  likert: RadioListQuestion,
  single_select: RadioListQuestion,
  multi_select: MultiSelectQuestion,
  like_dislike: LikeDislikeQuestion,
  visual: VisualQuestion,
  rank: RankQuestion,
} as const;

export function QuestionRenderer({ question, value, onChange }: Props) {
  const Component = REGISTRY[question.type];
  return <Component question={question} value={value} onChange={onChange} />;
}

/** Whether a given answer counts as "answered" (controls the Next button). */
export function isAnswered(value: AnswerValue | undefined): boolean {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  return String(value).length > 0;
}
