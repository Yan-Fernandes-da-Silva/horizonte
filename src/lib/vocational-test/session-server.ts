// Server-side helpers shared by the vocational-test API routes.
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { QUESTIONS, TOTAL_QUESTIONS, sectionMeta } from "./questions";
import type { Responses, SessionAnswers } from "./types";

/** Current authenticated user id, or null. */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

const SECTION_OF = new Map(QUESTIONS.map((q) => [q.id, q.section]));

/** Build the answers JSON (responses + progress/section meta) from a response map. */
export function buildAnswers(responses: Responses, lastQuestionId?: string): SessionAnswers {
  const answeredCount = Object.keys(responses).length;
  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
  const currentSection = (lastQuestionId && SECTION_OF.get(lastQuestionId)) || "riasec";
  return {
    responses,
    currentSection,
    currentSectionLabel: sectionMeta(currentSection)?.label ?? "RIASEC",
    progress,
  };
}

/** Load a session and confirm it belongs to the given user. */
export async function loadOwnedSession(sessionId: string, userId: string) {
  const session = await db.vocationalTestSession.findUnique({ where: { id: sessionId } });
  if (!session || session.userId !== userId) return null;
  return session;
}

/** Safely read the responses map out of a session's answers JSON. */
export function readResponses(answers: unknown): Responses {
  const a = (answers ?? {}) as Partial<SessionAnswers>;
  return (a.responses ?? {}) as Responses;
}
