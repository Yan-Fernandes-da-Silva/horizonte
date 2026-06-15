import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Questionnaire } from "@/components/features/career-plan/Questionnaire";

export default async function CareerPlanStartPage() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as { id?: string } | undefined)?.id) redirect("/login");

  return <Questionnaire />;
}
