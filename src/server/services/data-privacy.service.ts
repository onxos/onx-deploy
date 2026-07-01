/**
 * OCMBR Wave 7 — D12-S08 IU-SVC
 * Data Protection & Privacy Register service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  dataProcessingActivity,
  type NewDataProcessingActivity,
} from "@/server/db/schema";

export function listActivities() {
  return db
    .select()
    .from(dataProcessingActivity)
    .orderBy(dataProcessingActivity.activityName);
}

export function getActivityById(id: number) {
  return db
    .select()
    .from(dataProcessingActivity)
    .where(eq(dataProcessingActivity.id, id));
}

export async function createActivity(
  input: Omit<NewDataProcessingActivity, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db
    .insert(dataProcessingActivity)
    .values(input)
    .returning();
  return row;
}

export async function updateActivityStatus(id: number, status: string) {
  const [row] = await db
    .update(dataProcessingActivity)
    .set({ status, updatedAt: new Date() })
    .where(eq(dataProcessingActivity.id, id))
    .returning();
  return row;
}
