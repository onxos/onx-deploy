/**
 * OCMBR Wave 5 — D11-S05 IU-SVC
 * Emergency Case Intake & Triage service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { emergencyCase, type NewEmergencyCase } from "@/server/db/schema";

export function listEmergencyCasesByBranch(branchId: number) {
  return db
    .select()
    .from(emergencyCase)
    .where(eq(emergencyCase.branchId, branchId))
    .orderBy(emergencyCase.arrivalAt);
}

export function getEmergencyCaseById(id: number) {
  return db.select().from(emergencyCase).where(eq(emergencyCase.id, id));
}

export async function createEmergencyCase(
  input: Omit<NewEmergencyCase, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(emergencyCase).values(input).returning();
  return row;
}

export async function completeTriage(
  id: number,
  triageById: string,
  assignedVetId?: string,
) {
  const [row] = await db
    .update(emergencyCase)
    .set({
      status: "WAITING",
      triageCompletedAt: new Date(),
      triageById,
      assignedVetId: assignedVetId ?? null,
      updatedAt: new Date(),
    })
    .where(eq(emergencyCase.id, id))
    .returning();
  return row;
}

export async function dischargeEmergencyCase(id: number, disposition: string) {
  const [row] = await db
    .update(emergencyCase)
    .set({
      status: "DISCHARGED",
      disposition,
      dischargedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(emergencyCase.id, id))
    .returning();
  return row;
}
