"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/shared/PageContainer";
import { SECTIONS, TOTAL_QUESTIONS, questionsForSection } from "@/lib/vocational-test/questions";
import type { AnswerValue, Responses, SectionId } from "@/lib/vocational-test/types";
import { QuestionRenderer, isAnswered } from "./questions/QuestionRenderer";

interface Props {
  sessionId: string;
  section: SectionId;
  initialResponses: Responses;
}

export function TestRunner({ sessionId, section, initialResponses }: Props) {
  const router = useRouter();
  const questions = React.useMemo(() => questionsForSection(section), [section]);
  const sectionIndex = SECTIONS.findIndex((s) => s.id === section);
  const isLastSection = sectionIndex === SECTIONS.length - 1;

  const [responses, setResponses] = React.useState<Responses>(initialResponses);
  const [index, setIndex] = React.useState(() => {
    const firstUnanswered = questions.findIndex((q) => !isAnswered(initialResponses[q.id]));
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });
  const [submitting, setSubmitting] = React.useState(false);

  const question = questions[index];
  const answeredCount = Object.keys(responses).filter((id) => isAnswered(responses[id])).length;
  const overallProgress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  // Persist a single answer (fire-and-forget, with an error toast).
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

  const handleChange = (value: AnswerValue) => {
    setResponses((prev) => ({ ...prev, [question.id]: value }));
    void save(question.id, value);
  };

  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
    else if (sectionIndex > 0) router.push(`/vocational-test/${SECTIONS[sectionIndex - 1].id}`);
  };

  const goNext = async () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }
    // End of section.
    if (!isLastSection) {
      router.push(`/vocational-test/${SECTIONS[sectionIndex + 1].id}`);
      return;
    }
    // Last section → finalize.
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

  const answered = isAnswered(responses[question.id]);
  const isLastQuestion = index === questions.length - 1;
  const nextLabel = !isLastQuestion
    ? "Próxima"
    : isLastSection
      ? "Ver resultados"
      : "Próxima seção";

  return (
    <PageContainer className="max-w-2xl py-4">
      {/* Progress header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-ocean">
            Seção {sectionIndex + 1}/{SECTIONS.length}: {SECTIONS[sectionIndex].label}
          </span>
          <span className="text-muted-foreground">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* Question card */}
      <div className="rounded-2xl border border-border bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <p className="text-sm font-medium text-sky">
          Questão {index + 1} de {questions.length}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="mt-2 text-xl font-bold leading-snug text-ocean">{question.text}</h2>
            {question.helpText && (
              <p className="mt-1.5 text-sm text-muted-foreground">{question.helpText}</p>
            )}
            <div className="mt-6">
              <QuestionRenderer
                question={question}
                value={responses[question.id]}
                onChange={handleChange}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={goPrev}
          disabled={index === 0 && sectionIndex === 0}
          className="border-ocean/30 text-ocean hover:bg-ocean/5"
        >
          <ArrowLeft className="h-4 w-4" /> Anterior
        </Button>
        <Button
          type="button"
          onClick={goNext}
          disabled={!answered || submitting}
          className="bg-gold text-ocean hover:bg-gold-dark hover:text-white"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {nextLabel} {!submitting && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </PageContainer>
  );
}
