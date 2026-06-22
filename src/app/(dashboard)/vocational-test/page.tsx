import { redirect } from "next/navigation";
import { Compass } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageContainer } from "@/components/shared/PageContainer";
import {
  VocationalEntryState,
  type EntryStatus,
} from "@/components/features/vocational-test/VocationalEntryState";
import type { SessionAnswers, TestResults } from "@/lib/vocational-test/types";

export default async function VocationalTestEntryPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const test = await db.vocationalTestSession.findFirst({
    where: { userId },
    orderBy: { startedAt: "desc" },
  });

  const answers = (test?.answers ?? null) as SessionAnswers | null;
  const results = (test?.results ?? null) as TestResults | null;

  // Server-rendered initial state; the client component re-validates it so the
  // progress stays current after navigating away and back.
  const initial: EntryStatus = {
    status: (test?.status as EntryStatus["status"]) ?? "not_started",
    progress: answers?.progress ?? 0,
    currentSectionLabel: answers?.currentSectionLabel ?? "",
    dominantTypes: results?.dominantTypes ?? [],
  };

  return (
    // Same look as the post-login home: full-bleed sea background with
    // translucent boxes floating on it.
    <div className="-my-8 flex-1 bg-sea-top py-8">
      <PageContainer className="max-w-3xl">
        <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-6 text-white shadow-sm backdrop-blur-sm sm:px-10">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 shrink-0 text-gold" />
            <h1 className="text-2xl font-bold sm:text-3xl">Teste vocacional</h1>
          </div>
          <p className="mt-2 max-w-xl text-white/80">
            Descubra seu perfil profissional, objetivos e interesses combinando diferentes
            testes psicométricos: RIASEC, Inteligências Múltiplas e GOPC.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-6 text-white shadow-sm backdrop-blur-sm sm:p-8">
          <VocationalEntryState initial={initial} />
        </div>
      </PageContainer>
    </div>
  );
}
