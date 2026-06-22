import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/vocational-test/session-server";

// A user can favorite at most this many occupations.
const FAVORITES_LIMIT = 3;

// GET /api/favorites — current user's favorites (lets the list refresh live).
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const favorites = await db.favoriteProfession.findMany({
    where: { userId },
    select: { occupationCode: true, occupation: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    favorites: favorites.map((f) => ({
      occupationCode: f.occupationCode,
      title: f.occupation?.title ?? null,
    })),
  });
}

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

    // Enforce the cap before adding a new one.
    const count = await db.favoriteProfession.count({ where: { userId } });
    if (count >= FAVORITES_LIMIT) {
      return NextResponse.json(
        {
          error: `Você pode favoritar no máximo ${FAVORITES_LIMIT} profissões. Remova uma para adicionar outra.`,
          limitReached: true,
        },
        { status: 409 }
      );
    }

    await db.favoriteProfession.create({ data: { userId, occupationCode } });
    return NextResponse.json({ favorited: true });
  } catch (error) {
    console.error("[favorites]", error);
    return NextResponse.json({ error: "Erro ao favoritar." }, { status: 500 });
  }
}
