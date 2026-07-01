/**
 * OCMBR Wave 3 — D10-S03 IU-SVC
 * External Lab Referral & Import service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  externalLab,
  externalLabSubmission,
  type NewExternalLab,
  type NewExternalLabSubmission,
} from "@/server/db/schema";

export function listExternalLabs() {
  return db.select().from(externalLab).orderBy(externalLab.labName);
}

export function getExternalLabById(id: number) {
  return db.select().from(externalLab).where(eq(externalLab.id, id));
}

export async function createExternalLab(
  input: Omit<NewExternalLab, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(externalLab).values(input).returning();
  return row;
}

export function listSubmissionsByRequest(labTestRequestId: number) {
  return db
    .select()
    .from(externalLabSubmission)
    .where(eq(externalLabSubmission.labTestRequestId, labTestRequestId))
    .orderBy(externalLabSubmission.submittedAt);
}

export async function createSubmission(
  input: Omit<NewExternalLabSubmission, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db
    .insert(externalLabSubmission)
    .values(input)
    .returning();
  return row;
}

export async function markSubmissionReceived(id: number) {
  const [row] = await db
    .update(externalLabSubmission)
    .set({
      status: "RECEIVED",
      resultReceivedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(externalLabSubmission.id, id))
    .returning();
  return row;
}
