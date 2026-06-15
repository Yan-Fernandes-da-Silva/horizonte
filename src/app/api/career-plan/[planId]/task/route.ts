import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getCurrentUserId, loadOwnedPlan } from "@/lib/career-plan/server";

const VALID_CATEGORIES = ["short_term", "medium_term", "long_term"];

// POST /api/career-plan/[planId]/task — add a task to a section.
export async function POST(req: Request, { params }: { params: { planId: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const plan = await loadOwnedPlan(params.planId, userId);
    if (!plan) return NextResponse.json({ error: "Plano não encontrado." }, { status: 404 });

    const { category, title, description } = (await req.json()) as {
      category?: string; title?: string; description?: string;
    };
    if (!title?.trim() || !category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const last = await db.careerTask.findFirst({
      where: { planId: plan.id, category },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const task = await db.careerTask.create({
      data: {
        planId: plan.id,
        title: title.trim(),
        description: description?.trim() || null,
        category,
        status: "pending",
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("[career-plan/task POST]", error);
    return NextResponse.json({ error: "Erro ao adicionar tarefa." }, { status: 500 });
  }
}
