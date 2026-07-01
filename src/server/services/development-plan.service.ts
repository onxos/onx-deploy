/**
 * OCMBR Wave 8 — D13-S04 IU-SVC
 * Staff Development Plan service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { developmentPlan, type NewDevelopmentPlan } from "@/server/db/schema";

export function listPlansByStaff(staffId: string) {
  return db
    .select()
    .from(developmentPlan)
    .where(eq(developmentPlan.staffId, staffId))
    .orderBy(developmentPlan.planYear);
}

export async function createPlan(
  input: Omit<NewDevelopmentPlan, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(developmentPlan).values(input).returning();
  return row;
}

export async function updatePlanStatus(id: number, status: string) {
  const [row] = await db
    .update(developmentPlan)
    .set({ status, updatedAt: new Date() })
    .where(eq(developmentPlan.id, id))
    .returning();
  return row;
}

export async function addReviewNotes(id: number, reviewNotes: string) {
  const [row] = await db
    .update(developmentPlan)
    .set({ reviewNotes, updatedAt: new Date() })
    .where(eq(developmentPlan.id, id))
    .returning();
  return row;
}
