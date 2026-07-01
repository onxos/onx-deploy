/**
 * OCMBR Wave 6 — D11-S07 IU-SVC
 * On-call Staff Management service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewOncallCallout,
  type NewOncallSchedule,
  oncallCallout,
  oncallSchedule,
} from "@/server/db/schema";

export function listSchedulesByBranch(branchId: number) {
  return db
    .select()
    .from(oncallSchedule)
    .where(eq(oncallSchedule.branchId, branchId))
    .orderBy(oncallSchedule.scheduleDate);
}

export function listSchedulesByStaff(staffId: string) {
  return db
    .select()
    .from(oncallSchedule)
    .where(eq(oncallSchedule.staffId, staffId))
    .orderBy(oncallSchedule.scheduleDate);
}

export async function createSchedule(
  input: Omit<NewOncallSchedule, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(oncallSchedule).values(input).returning();
  return row;
}

export async function recordCallout(
  input: Omit<NewOncallCallout, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(oncallCallout).values(input).returning();
  return row;
}

export async function updateCalloutOutcome(id: number, outcome: string) {
  const [row] = await db
    .update(oncallCallout)
    .set({ outcome, respondedAt: new Date(), updatedAt: new Date() })
    .where(eq(oncallCallout.id, id))
    .returning();
  return row;
}

export function listCalloutsByStaff(staffId: string) {
  return db
    .select()
    .from(oncallCallout)
    .where(eq(oncallCallout.staffId, staffId))
    .orderBy(oncallCallout.calledAt);
}
