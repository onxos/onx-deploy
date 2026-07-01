/**
 * OCMBR Wave 2f — D09-S08 IU-SVC
 * Hospitalisation / In-patient service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  inpatientAdmission,
  inpatientObservation,
  type NewInpatientAdmission,
  type NewInpatientObservation,
} from "@/server/db/schema";

export function listAdmissions(branchId: number) {
  return db
    .select()
    .from(inpatientAdmission)
    .where(eq(inpatientAdmission.branchId, branchId))
    .orderBy(inpatientAdmission.admissionDate);
}

export function getAdmissionById(id: number) {
  return db
    .select()
    .from(inpatientAdmission)
    .where(eq(inpatientAdmission.id, id));
}

export async function createAdmission(input: NewInpatientAdmission) {
  const [result] = await db
    .insert(inpatientAdmission)
    .values(input)
    .returning();
  return result;
}

export async function dischargeAdmission(
  id: number,
  dischargeDate: string,
  dischargeNotes: string,
  dischargedBy: string,
) {
  const [result] = await db
    .update(inpatientAdmission)
    .set({
      status: "DISCHARGED",
      dischargeDate,
      dischargeNotes,
      dischargedBy,
      updatedAt: new Date(),
    })
    .where(eq(inpatientAdmission.id, id))
    .returning();
  return result;
}

export function getObservations(admissionId: number) {
  return db
    .select()
    .from(inpatientObservation)
    .where(eq(inpatientObservation.admissionId, admissionId))
    .orderBy(inpatientObservation.observationDate);
}

export async function addObservation(
  input: Omit<NewInpatientObservation, "id">,
) {
  const [result] = await db
    .insert(inpatientObservation)
    .values(input)
    .returning();
  return result;
}
