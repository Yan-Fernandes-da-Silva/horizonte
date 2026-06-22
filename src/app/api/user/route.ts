import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileUpdateSchema } from "@/lib/validations/profile";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

// PATCH /api/user — update name, email and avatar.
export async function PATCH(req: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = ProfileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const { name, email, avatar } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  // E-mail must be unique across other accounts.
  const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
  if (existing && existing.id !== userId) {
    return NextResponse.json(
      { error: "Este e-mail já está cadastrado." },
      { status: 409 }
    );
  }

  const user = await db.user.update({
    where: { id: userId },
    data: { name, email: normalizedEmail, avatar: avatar ?? null },
    select: { name: true, email: true, avatar: true },
  });

  return NextResponse.json(user);
}

// DELETE /api/user — permanently delete the account (cascades to all data).
export async function DELETE() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  await db.user.delete({ where: { id: userId } });
  return NextResponse.json({ ok: true });
}
