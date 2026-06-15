import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getCurrentUserId, buildAnswers } from "@/lib/vocational-test/session-server";

// POST /api/vocational-test/start — start a fresh session (drops any unfinished one).
export async function POST() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    // Remove previous unfinished sessions so there is a single active one.
    await db.vocationalTestSession.deleteMany({
      where: { userId, status: { not: "completed" } },
    });

    const session = await db.vocationalTestSession.create({
      data: {
        userId,
        status: "in_progress",
        answers: buildAnswers({}) as object,
      },
      select: { id: true },
    });

    return NextResponse.json({ sessionId: session.id }, { status: 201 });
  } catch (error) {
    console.error("[vocational-test/start]", error);
    return NextResponse.json({ error: "Erro ao iniciar o teste." }, { status: 500 });
  }
}
