/**
 * OCMBR Wave 6 — D12-S03 IU-SVC
 * Internal Audit Programme service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  auditInstance,
  auditProgramme,
  type NewAuditInstance,
  type NewAuditProgramme,
} from "@/server/db/schema";

export function listProgrammes(branchId?: number) {
  if (branchId !== undefined) {
    return db
      .select()
      .from(auditProgramme)
      .where(eq(auditProgramme.branchId, branchId));
  }
  return db.select().from(auditProgramme);
}

export async function createProgramme(
  input: Omit<NewAuditProgramme, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(auditProgramme).values(input).returning();
  return row;
}

export function listInstancesByProgramme(programmeId: number) {
  return db
    .select()
    .from(auditInstance)
    .where(eq(auditInstance.programmeId, programmeId))
    .orderBy(auditInstance.plannedDate);
}

export async function createInstance(
  input: Omit<NewAuditInstance, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(auditInstance).values(input).returning();
  return row;
}

export async function updateInstanceStatus(id: number, status: string) {
  const [row] = await db
    .update(auditInstance)
    .set({ status, updatedAt: new Date() })
    .where(eq(auditInstance.id, id))
    .returning();
  return row;
}
