import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/vocational-test/session-server";

// POST /api/favorites — toggle a favorited occupation for the current user.
export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const { occupationCode } = (await req.json()) as { occupationCode?: string };
    if (!occupationCode) {
      return NextResponse.json({ error: "Código inválido." }, { status: 400 });
    }

    // Guard the FK: only real CBO codes can be favorited.
    const occupation = await db.cboOccupation.findUnique({ where: { code: occupationCode } });
    if (!occupation) return NextResponse.json({ error: "Profissão inexistente." }, { status: 404 });

    const existing = await db.favoriteProfession.findUnique({
      where: { userId_occupationCode: { userId, occupationCode } },
    });

    if (existing) {
      await db.favoriteProfession.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    }

    await db.favoriteProfession.create({ data: { userId, occupationCode } });
    return NextResponse.json({ favorited: true });
  } catch (error) {
    console.error("[favorites]", error);
    return NextResponse.json({ error: "Erro ao favoritar." }, { status: 500 });
  }
}
