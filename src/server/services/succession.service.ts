/**
 * OCMBR Wave 8 — D13-S03 IU-SVC
 * Succession Planning service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewSuccessionCandidate,
  type NewSuccessionPlan,
  successionCandidate,
  successionPlan,
} from "@/server/db/schema";

export function listPlansByBranch(branchId: number) {
  return db
    .select()
    .from(successionPlan)
    .where(eq(successionPlan.branchId, branchId));
}

export async function createPlan(
  input: Omit<NewSuccessionPlan, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(successionPlan).values(input).returning();
  return row;
}

export function listCandidatesByPlan(planId: number) {
  return db
    .select()
    .from(successionCandidate)
    .where(eq(successionCandidate.planId, planId))
    .orderBy(successionCandidate.priority);
}

export async function addCandidate(
  input: Omit<NewSuccessionCandidate, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(successionCandidate).values(input).returning();
  return row;
}

export async function updateCandidateReadiness(id: number, readiness: string) {
  const [row] = await db
    .update(successionCandidate)
    .set({ readiness, updatedAt: new Date() })
    .where(eq(successionCandidate.id, id))
    .returning();
  return row;
}
