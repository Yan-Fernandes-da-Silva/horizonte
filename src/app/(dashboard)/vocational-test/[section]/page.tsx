import { notFound, redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { TestRunner } from "@/components/features/vocational-test/TestRunner";
import { SECTIONS } from "@/lib/vocational-test/questions";
import type { Responses, SectionId, SessionAnswers } from "@/lib/vocational-test/types";

export default async function VocationalTestSectionPage({
  params,
}: {
  params: { section: string };
}) {
  const section = params.section as SectionId;
  if (!SECTIONS.some((s) => s.id === section)) notFound();

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  // Need an active (unfinished) session; otherwise send the user to the entry page.
  const test = await db.vocationalTestSession.findFirst({
    where: { userId, status: { not: "completed" } },
    orderBy: { startedAt: "desc" },
  });
  if (!test) redirect("/vocational-test");

  const answers = (test.answers ?? {}) as Partial<SessionAnswers>;
  const responses = (answers.responses ?? {}) as Responses;

  return <TestRunner sessionId={test.id} section={section} initialResponses={responses} />;
}
