import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getCurrentUserId, loadOwnedTask } from "@/lib/career-plan/server";

// PUT /api/career-plan/[planId]/task/[taskId] — update status, title or description.
export async function PUT(req: Request, { params }: { params: { taskId: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const task = await loadOwnedTask(params.taskId, userId);
    if (!task) return NextResponse.json({ error: "Tarefa não encontrada." }, { status: 404 });

    const body = (await req.json()) as { status?: string; title?: string; description?: string };
    const data: { status?: string; title?: string; description?: string | null } = {};
    if (body.status && ["pending", "in_progress", "completed"].includes(body.status)) {
      data.status = body.status;
    }
    if (typeof body.title === "string" && body.title.trim()) data.title = body.title.trim();
    if (typeof body.description === "string") data.description = body.description.trim() || null;

    const updated = await db.careerTask.update({ where: { id: task.id }, data });
    return NextResponse.json({ task: updated });
  } catch (error) {
    console.error("[career-plan/task PUT]", error);
    return NextResponse.json({ error: "Erro ao atualizar tarefa." }, { status: 500 });
  }
}

// DELETE /api/career-plan/[planId]/task/[taskId]
export async function DELETE(_req: Request, { params }: { params: { taskId: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const task = await loadOwnedTask(params.taskId, userId);
    if (!task) return NextResponse.json({ error: "Tarefa não encontrada." }, { status: 404 });

    await db.careerTask.delete({ where: { id: task.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[career-plan/task DELETE]", error);
    return NextResponse.json({ error: "Erro ao excluir tarefa." }, { status: 500 });
  }
}
