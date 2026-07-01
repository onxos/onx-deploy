/**
 * OCMBR Wave 4 — D10-S04 IU-SVC
 * Lab Result History & Trends service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  labReferenceRange,
  labResultAnnotation,
  type NewLabReferenceRange,
  type NewLabResultAnnotation,
} from "@/server/db/schema";

export function listReferenceRanges(testCode?: string) {
  if (testCode) {
    return db
      .select()
      .from(labReferenceRange)
      .where(eq(labReferenceRange.testCode, testCode))
      .orderBy(labReferenceRange.species);
  }
  return db
    .select()
    .from(labReferenceRange)
    .orderBy(labReferenceRange.testCode);
}

export function getReferenceRangeById(id: number) {
  return db
    .select()
    .from(labReferenceRange)
    .where(eq(labReferenceRange.id, id));
}

export async function createReferenceRange(
  input: Omit<NewLabReferenceRange, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(labReferenceRange).values(input).returning();
  return row;
}

export function listAnnotationsByRequest(labTestRequestId: number) {
  return db
    .select()
    .from(labResultAnnotation)
    .where(eq(labResultAnnotation.labTestRequestId, labTestRequestId))
    .orderBy(labResultAnnotation.annotatedAt);
}

export async function createAnnotation(
  input: Omit<NewLabResultAnnotation, "id" | "createdAt">,
) {
  const [row] = await db.insert(labResultAnnotation).values(input).returning();
  return row;
}
