/**
 * OCMBR Wave 3 — D09-S10 IU-SVC
 * Clinical Outcome Tracking service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { clinicalOutcome, type NewClinicalOutcome } from "@/server/db/schema";

export function listOutcomesByPet(petId: number) {
  return db
    .select()
    .from(clinicalOutcome)
    .where(eq(clinicalOutcome.petId, petId))
    .orderBy(clinicalOutcome.outcomeDate);
}

export function listOutcomesByBranch(branchId: number) {
  return db
    .select()
    .from(clinicalOutcome)
    .where(eq(clinicalOutcome.branchId, branchId))
    .orderBy(clinicalOutcome.outcomeDate);
}

export function getOutcomeById(id: number) {
  return db.select().from(clinicalOutcome).where(eq(clinicalOutcome.id, id));
}

export async function createOutcome(
  input: Omit<NewClinicalOutcome, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(clinicalOutcome).values(input).returning();
  return row;
}

export async function updateOutcomeStatus(
  id: number,
  status: string,
  clinicianNotes?: string,
) {
  const [row] = await db
    .update(clinicalOutcome)
    .set({
      status,
      clinicianNotes: clinicianNotes ?? null,
      updatedAt: new Date(),
    })
    .where(eq(clinicalOutcome.id, id))
    .returning();
  return row;
}
