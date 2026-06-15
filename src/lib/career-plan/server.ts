// Server helpers for the career-plan API routes.
import { db } from "@/lib/db";

export { getCurrentUserId } from "@/lib/vocational-test/session-server";

export const CATEGORY_BY_TERM = {
  shortTerm: "short_term",
  mediumTerm: "medium_term",
  longTerm: "long_term",
} as const;

/** Load a plan and confirm it belongs to the given user (with its tasks). */
export async function loadOwnedPlan(planId: string, userId: string) {
  const plan = await db.careerPlan.findUnique({
    where: { id: planId },
    include: { tasks: { orderBy: [{ category: "asc" }, { sortOrder: "asc" }] } },
  });
  if (!plan || plan.userId !== userId) return null;
  return plan;
}

/** Confirm a task belongs to a plan owned by the user. */
export async function loadOwnedTask(taskId: string, userId: string) {
  const task = await db.careerTask.findUnique({
    where: { id: taskId },
    include: { plan: { select: { userId: true } } },
  });
  if (!task || task.plan.userId !== userId) return null;
  return task;
}
