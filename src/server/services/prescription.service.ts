/**
 * OCMBR Wave 2d — D09-S06 IU-SVC
 * Prescription service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewPrescription,
  type NewPrescriptionLine,
  prescription,
  prescriptionLine,
} from "@/server/db/schema";

export function listPrescriptions(branchId: number) {
  return db
    .select()
    .from(prescription)
    .where(eq(prescription.branchId, branchId))
    .orderBy(prescription.prescriptionDate);
}

export function getPrescriptionById(id: number) {
  return db.select().from(prescription).where(eq(prescription.id, id));
}

export async function createPrescription(
  input: NewPrescription,
  lines: Omit<NewPrescriptionLine, "prescriptionId">[],
) {
  return db.transaction(async (tx) => {
    const [rx] = await tx.insert(prescription).values(input).returning();
    if (lines.length > 0) {
      await tx
        .insert(prescriptionLine)
        .values(lines.map((l) => ({ ...l, prescriptionId: rx.id })));
    }
    return rx;
  });
}

export function getPrescriptionLines(prescriptionId: number) {
  return db
    .select()
    .from(prescriptionLine)
    .where(eq(prescriptionLine.prescriptionId, prescriptionId));
}

export async function dispensePrescription(id: number, dispensedBy: string) {
  const [result] = await db
    .update(prescription)
    .set({
      status: "DISPENSED",
      dispensedBy,
      dispensedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(prescription.id, id))
    .returning();
  return result;
}

export async function cancelPrescription(id: number) {
  const [result] = await db
    .update(prescription)
    .set({ status: "CANCELLED", updatedAt: new Date() })
    .where(eq(prescription.id, id))
    .returning();
  return result;
}
