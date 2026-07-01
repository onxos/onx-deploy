/**
 * OCMBR Wave 2 — D09-S05 IU-API (Service)
 * Vaccination Record & Reminders service
 */

import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewVaccinationRecord,
  VaccinationRecord,
} from "@/server/db/schema/vaccination-foundation";
import { vaccinationRecord } from "@/server/db/schema/vaccination-foundation";

export async function listVaccinations(
  branchId: number,
  opts?: { petId?: number; status?: string },
) {
  const conditions = [eq(vaccinationRecord.branchId, branchId)];
  if (opts?.petId) conditions.push(eq(vaccinationRecord.petId, opts.petId));
  if (opts?.status) conditions.push(eq(vaccinationRecord.status, opts.status));
  return db
    .select()
    .from(vaccinationRecord)
    .where(and(...conditions))
    .orderBy(desc(vaccinationRecord.administeredDate));
}

export async function getVaccinationById(id: number) {
  const rows = await db
    .select()
    .from(vaccinationRecord)
    .where(eq(vaccinationRecord.id, id));
  return rows[0] ?? null;
}

export async function recordVaccination(
  input: Omit<NewVaccinationRecord, "id" | "createdAt" | "updatedAt">,
) {
  const [result] = await db.insert(vaccinationRecord).values(input).returning();
  return result;
}

export async function updateVaccination(
  id: number,
  input: Partial<
    Omit<NewVaccinationRecord, "id" | "createdAt" | "petId" | "branchId">
  >,
) {
  const rows = await db
    .update(vaccinationRecord)
    .set(input)
    .where(eq(vaccinationRecord.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Vaccination record not found",
    });
  return rows[0] as VaccinationRecord;
}

export async function listOverdueVaccinations(branchId: number) {
  return db
    .select()
    .from(vaccinationRecord)
    .where(
      and(
        eq(vaccinationRecord.branchId, branchId),
        eq(vaccinationRecord.status, "OVERDUE"),
      ),
    )
    .orderBy(vaccinationRecord.nextDueDate);
}
