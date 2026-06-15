import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { calculateResults } from "@/lib/vocational-test/scoring";
import {
  getCurrentUserId, loadOwnedSession, readResponses,
} from "@/lib/vocational-test/session-server";

// POST /api/vocational-test/[sessionId]/complete — score answers and finalize.
export async function POST(_req: Request, { params }: { params: { sessionId: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const session = await loadOwnedSession(params.sessionId, userId);
    if (!session) return NextResponse.json({ error: "Sessão não encontrada." }, { status: 404 });

    const responses = readResponses(session.answers);
    const results = calculateResults(responses);

    await db.vocationalTestSession.update({
      where: { id: session.id },
      data: { status: "completed", results: results as object, completedAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[vocational-test/complete]", error);
    return NextResponse.json({ error: "Erro ao finalizar o teste." }, { status: 500 });
  }
}
