import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { QUESTIONS } from "@/lib/vocational-test/questions";
import {
  getCurrentUserId, loadOwnedSession, readResponses, buildAnswers,
} from "@/lib/vocational-test/session-server";
import type { AnswerValue } from "@/lib/vocational-test/types";

// PUT /api/vocational-test/[sessionId]/answer — save (or update) one answer.
export async function PUT(req: Request, { params }: { params: { sessionId: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const { questionId, value } = (await req.json()) as { questionId?: string; value?: AnswerValue };
    if (!questionId || !QUESTIONS.some((q) => q.id === questionId)) {
      return NextResponse.json({ error: "Questão inválida." }, { status: 400 });
    }

    const session = await loadOwnedSession(params.sessionId, userId);
    if (!session) return NextResponse.json({ error: "Sessão não encontrada." }, { status: 404 });
    if (session.status === "completed") {
      return NextResponse.json({ error: "Teste já concluído." }, { status: 409 });
    }

    const responses = readResponses(session.answers);
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
      delete responses[questionId]; // clearing an answer
    } else {
      responses[questionId] = value;
    }

    const answers = buildAnswers(responses, questionId);
    await db.vocationalTestSession.update({
      where: { id: session.id },
      data: { status: "in_progress", answers: answers as object },
    });

    return NextResponse.json({ progress: answers.progress });
  } catch (error) {
    console.error("[vocational-test/answer]", error);
    return NextResponse.json({ error: "Erro ao salvar resposta." }, { status: 500 });
  }
}
