import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/vocational-test/session-server";
import type { SessionAnswers, TestResults } from "@/lib/vocational-test/types";

// GET /api/vocational-test/status — latest session summary for the current user.
// Lets the entry page revalidate its progress on the client (e.g. after the user
// answers a few questions and navigates back) without a full page reload.
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const test = await db.vocationalTestSession.findFirst({
    where: { userId },
    orderBy: { startedAt: "desc" },
  });

  if (!test) {
    return NextResponse.json({
      status: "not_started",
      progress: 0,
      currentSectionLabel: "",
      dominantTypes: [],
    });
  }

  const answers = (test.answers ?? null) as SessionAnswers | null;
  const results = (test.results ?? null) as TestResults | null;

  return NextResponse.json({
    status: test.status,
    progress: answers?.progress ?? 0,
    currentSectionLabel: answers?.currentSectionLabel ?? "",
    dominantTypes: results?.dominantTypes ?? [],
  });
}
