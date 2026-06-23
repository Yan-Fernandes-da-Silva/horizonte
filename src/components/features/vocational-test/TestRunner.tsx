"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/shared/PageContainer";
import { SECTIONS, TOTAL_QUESTIONS, questionsForSection } from "@/lib/vocational-test/questions";
import { sectionMotivation } from "@/lib/vocational-test/motivation";
import type { AnswerValue, Question, Responses, SectionId } from "@/lib/vocational-test/types";
import { QuestionRenderer, isAnswered } from "./questions/QuestionRenderer";
import { TierlistRunner } from "./TierlistRunner";
import { MiCardsRunner } from "./MiCardsRunner";
import { SectionTransition } from "./SectionTransition";

interface Props {
  sessionId: string;
  section: SectionId;
  initialResponses: Responses;
}

interface RunnerProps {
  questions: Question[];
  responses: Responses;
  onAnswer: (id: string, value: AnswerValue) => void;
  onComplete: () => void;
}

export function TestRunner({ sessionId, section, initialResponses }: Props) {
  const router = useRouter();
  const questions = React.useMemo(() => questionsForSection(section), [section]);
  const sectionIndex = SECTIONS.findIndex((s) => s.id === section);
  const isLastSection = sectionIndex === SECTIONS.length - 1;

  const [responses, setResponses] = React.useState<Responses>(initialResponses);
  const [phase, setPhase] = React.useState<"answering" | "transition">("answering");
  const [submitting, setSubmitting] = React.useState(false);

  const answeredCount = Object.keys(responses).filter((id) => isAnswered(responses[id])).length;
  const overallProgress = Math.min(100, Math.round((answeredCount / TOTAL_QUESTIONS) * 100));

  const save = React.useCallback(
    async (questionId: string, value: AnswerValue) => {
      try {
        const res = await fetch(`/api/vocational-test/${sessionId}/answer`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ questionId, value }),
        });
        if (!res.ok) throw new Error();
      } catch {
        toast.error("Não conseguimos salvar sua resposta. Verifique a conexão.");
      }
    },
    [sessionId]
  );

  const onAnswer = React.useCallback(
    (id: string, value: AnswerValue) => {
      setResponses((prev) => ({ ...prev, [id]: value }));
      void save(id, value);
    },
    [save]
  );

  const onSectionComplete = () => setPhase("transition");

  const continueFromTransition = async () => {
    if (!isLastSection) {
      router.push(`/vocational-test/${SECTIONS[sectionIndex + 1].id}`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/vocational-test/${sessionId}/complete`, { method: "POST" });
      if (!res.ok) throw new Error();
      router.push("/vocational-test/results");
      router.refresh();
    } catch {
      setSubmitting(false);
      toast.error("Erro ao finalizar o teste. Tente novamente.");
    }
  };

  const runnerProps: RunnerProps = { questions, responses, onAnswer, onComplete: onSectionComplete };

  return (
    <div className="-my-8 flex-1 bg-sea-top py-8">
      <PageContainer className="max-w-3xl py-4">
        {/* Progress header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-white">
              Seção {sectionIndex + 1}/{SECTIONS.length}: {SECTIONS[sectionIndex].label}
            </span>
            <span className="text-white/70">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2 bg-white/20" indicatorClassName="bg-gold" />
        </div>

        {phase === "transition" ? (
          <SectionTransition
            motivation={sectionMotivation(section, responses)}
            isLast={isLastSection}
            loading={submitting}
            onContinue={continueFromTransition}
          />
        ) : (
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-white shadow-sm backdrop-blur-sm sm:p-8">
            {section === "riasec" ? (
              <TierlistRunner {...runnerProps} />
            ) : section === "mi" ? (
              <MiCardsRunner {...runnerProps} />
            ) : (
              <GenericRunner {...runnerProps} />
            )}
          </div>
        )}
      </PageContainer>
    </div>
  );
}

/** One-by-one runner for GOPC (single_select + rank). */
function GenericRunner({ questions, responses, onAnswer, onComplete }: RunnerProps) {
  const [index, setIndex] = React.useState(() => {
    const first = questions.findIndex((q) => !isAnswered(responses[q.id]));
    return first === -1 ? 0 : first;
  });

  const question = questions[index];
  const answered = isAnswered(responses[question.id]);
  const isLast = index === questions.length - 1;

  const goNext = () => {
    if (index < questions.length - 1) setIndex(index + 1);
    else onComplete();
  };

  // Single-choice questions advance to the next one automatically after a tap.
  const advanceTimer = React.useRef<ReturnType<typeof setTimeout>>();
  React.useEffect(() => () => clearTimeout(advanceTimer.current), []);
  const handleChange = (v: AnswerValue) => {
    onAnswer(question.id, v);
    if (question.type === "single_select") {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(goNext, 280);
    }
  };

  return (
    <div>
      <p className="text-sm font-medium text-sky-light">Questão {index + 1} de {questions.length}</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="mt-2 text-xl font-bold leading-snug text-white">{question.text}</h2>
          {question.helpText && <p className="mt-1.5 text-sm text-white/70">{question.helpText}</p>}
          <div className="mt-6">
            <QuestionRenderer
              question={question}
              value={responses[question.id]}
              onChange={handleChange}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Anterior
        </Button>
        <Button
          type="button"
          onClick={goNext}
          disabled={!answered}
          className="bg-gold text-ocean hover:bg-gold-dark hover:text-white"
        >
          {isLast ? "Concluir seção" : "Próxima"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
