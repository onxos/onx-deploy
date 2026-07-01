/**
 * OCMBR Wave 2d — D09-S04 IU-SVC
 * Treatment Plan service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewTreatmentPlan,
  type NewTreatmentPlanItem,
  treatmentPlan,
  treatmentPlanItem,
} from "@/server/db/schema";

export function listPlans(branchId: number) {
  return db
    .select()
    .from(treatmentPlan)
    .where(eq(treatmentPlan.branchId, branchId))
    .orderBy(treatmentPlan.createdAt);
}

export function getPlanById(id: number) {
  return db.select().from(treatmentPlan).where(eq(treatmentPlan.id, id));
}

export async function createPlan(
  input: NewTreatmentPlan,
  items: Omit<NewTreatmentPlanItem, "planId">[],
) {
  return db.transaction(async (tx) => {
    const [plan] = await tx.insert(treatmentPlan).values(input).returning();
    if (items.length > 0) {
      await tx
        .insert(treatmentPlanItem)
        .values(items.map((i) => ({ ...i, planId: plan.id })));
    }
    return plan;
  });
}

export function getPlanItems(planId: number) {
  return db
    .select()
    .from(treatmentPlanItem)
    .where(eq(treatmentPlanItem.planId, planId));
}

export async function completePlan(id: number) {
  const [result] = await db
    .update(treatmentPlan)
    .set({ status: "COMPLETED", updatedAt: new Date() })
    .where(eq(treatmentPlan.id, id))
    .returning();
  return result;
}

export async function cancelPlan(id: number) {
  const [result] = await db
    .update(treatmentPlan)
    .set({ status: "CANCELLED", updatedAt: new Date() })
    .where(eq(treatmentPlan.id, id))
    .returning();
  return result;
}
