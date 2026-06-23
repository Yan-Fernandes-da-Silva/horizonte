import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getCurrentUserId, CATEGORY_BY_TERM } from "@/lib/career-plan/server";
import {
  generateCareerRoadmap, buildFallbackRoadmap, type Roadmap, type RoadmapContext,
} from "@/lib/ai/generate-roadmap";
import type { SmartAnswers } from "@/lib/career-plan/questions";
import type { TestResults } from "@/lib/vocational-test/types";

// POST /api/career-plan/create — save answers, generate the roadmap (AI or fallback),
// persist the plan and its tasks. Body: { answers, fallback?: boolean }.
export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const { answers, fallback, occupationCode } = (await req.json()) as {
      answers?: SmartAnswers;
      fallback?: boolean;
      occupationCode?: string;
    };
    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Respostas inválidas." }, { status: 400 });
    }

    // Vocational profile (RIASEC) for the AI context.
    const completed = await db.vocationalTestSession.findFirst({
      where: { userId, status: "completed" },
      orderBy: { completedAt: "desc" },
      select: { results: true },
    });

    // Target occupation: the favorite the user chose in the questionnaire;
    // fall back to the most-recently favorited one when none was sent.
    let occCode: string | null = null;
    let occTitle: string | undefined;
    if (occupationCode) {
      const occ = await db.cboOccupation.findUnique({
        where: { code: occupationCode },
        select: { code: true, title: true },
      });
      occCode = occ?.code ?? null;
      occTitle = occ?.title ?? undefined;
    } else {
      const fav = await db.favoriteProfession.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { occupationCode: true, occupation: { select: { title: true } } },
      });
      occCode = fav?.occupationCode ?? null;
      occTitle = fav?.occupation?.title ?? undefined;
    }

    const dominantTypes = (completed?.results as TestResults | null)?.dominantTypes;
    const ctx: RoadmapContext = {
      answers,
      dominantTypes: dominantTypes ?? undefined,
      occupationTitle: occTitle,
    };

    // Generate the roadmap (fallback template if requested or if the AI call fails).
    let roadmap: Roadmap;
    if (fallback) {
      roadmap = buildFallbackRoadmap(ctx);
    } else {
      try {
        roadmap = await generateCareerRoadmap(ctx);
      } catch (e) {
        console.error("[career-plan/create] AI generation failed:", e);
        return NextResponse.json({ error: "ai_failed" }, { status: 502 });
      }
    }

    const title = ctx.occupationTitle
      ? `Rumo a ${ctx.occupationTitle}`
      : roadmap.destination.slice(0, 80) || "Meu plano de carreira";

    const plan = await db.careerPlan.create({
      data: {
        userId,
        title,
        occupationCode: occCode,
        questionnaire: answers as object,
        roadmap: roadmap as object,
        status: "active",
        tasks: {
          create: (["shortTerm", "mediumTerm", "longTerm"] as const).flatMap((term) =>
            roadmap[term].map((t, i) => ({
              title: t.title,
              description: t.description,
              category: CATEGORY_BY_TERM[term],
              status: "pending",
              sortOrder: i,
            }))
          ),
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ planId: plan.id }, { status: 201 });
  } catch (error) {
    console.error("[career-plan/create]", error);
    return NextResponse.json({ error: "Erro ao criar o plano." }, { status: 500 });
  }
}
