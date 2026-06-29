import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getCurrentUserId, loadOwnedPlan } from "@/lib/career-plan/server";

// GET /api/career-plan/[planId] — the plan with all its tasks.
export async function GET(_req: Request, { params }: { params: { planId: string } }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const plan = await loadOwnedPlan(params.planId, userId);
  if (!plan) return NextResponse.json({ error: "Plano não encontrado." }, { status: 404 });

  return NextResponse.json({ plan });
}

// DELETE /api/career-plan/[planId] — remove the plan (its tasks cascade).
export async function DELETE(_req: Request, { params }: { params: { planId: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const plan = await loadOwnedPlan(params.planId, userId);
    if (!plan) return NextResponse.json({ error: "Plano não encontrado." }, { status: 404 });

    await db.careerPlan.delete({ where: { id: plan.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[career-plan DELETE]", error);
    return NextResponse.json({ error: "Erro ao excluir o plano." }, { status: 500 });
  }
}
