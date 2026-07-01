/**
 * OCMBR Wave 5 — D11-S04 IU-SVC
 * Field Visit Record service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { fieldVisit, type NewFieldVisit } from "@/server/db/schema";

export function listFieldVisitsByPet(petId: number) {
  return db
    .select()
    .from(fieldVisit)
    .where(eq(fieldVisit.petId, petId))
    .orderBy(fieldVisit.visitDate);
}

export function listFieldVisitsByBranch(branchId: number) {
  return db
    .select()
    .from(fieldVisit)
    .where(eq(fieldVisit.branchId, branchId))
    .orderBy(fieldVisit.visitDate);
}

export function getFieldVisitById(id: number) {
  return db.select().from(fieldVisit).where(eq(fieldVisit.id, id));
}

export async function createFieldVisit(
  input: Omit<NewFieldVisit, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(fieldVisit).values(input).returning();
  return row;
}

export async function updateFieldVisitStatus(id: number, status: string) {
  const [row] = await db
    .update(fieldVisit)
    .set({ status, updatedAt: new Date() })
    .where(eq(fieldVisit.id, id))
    .returning();
  return row;
}
