import { NextResponse } from "next/server";

import { getCurrentUserId, loadOwnedPlan } from "@/lib/career-plan/server";

// GET /api/career-plan/[planId] — the plan with all its tasks.
export async function GET(_req: Request, { params }: { params: { planId: string } }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const plan = await loadOwnedPlan(params.planId, userId);
  if (!plan) return NextResponse.json({ error: "Plano não encontrado." }, { status: 404 });

  return NextResponse.json({ plan });
}
