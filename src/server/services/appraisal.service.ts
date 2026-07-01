/**
 * OCMBR Wave 8 — D13-S02 IU-SVC
 * Performance Appraisal Cycle service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  appraisalCycle,
  appraisalRecord,
  type NewAppraisalCycle,
  type NewAppraisalRecord,
} from "@/server/db/schema";

export function listCycles(branchId?: number) {
  if (branchId !== undefined) {
    return db
      .select()
      .from(appraisalCycle)
      .where(eq(appraisalCycle.branchId, branchId));
  }
  return db.select().from(appraisalCycle);
}

export async function createCycle(
  input: Omit<NewAppraisalCycle, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(appraisalCycle).values(input).returning();
  return row;
}

export function listRecordsByCycle(cycleId: number) {
  return db
    .select()
    .from(appraisalRecord)
    .where(eq(appraisalRecord.cycleId, cycleId));
}

export async function createRecord(
  input: Omit<NewAppraisalRecord, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(appraisalRecord).values(input).returning();
  return row;
}

export async function completeAppraisal(
  id: number,
  overallRating: number,
  reviewerComments: string,
) {
  const [row] = await db
    .update(appraisalRecord)
    .set({
      status: "COMPLETED",
      overallRating,
      reviewerComments,
      completedDate: new Date().toISOString().slice(0, 10),
      updatedAt: new Date(),
    })
    .where(eq(appraisalRecord.id, id))
    .returning();
  return row;
}
