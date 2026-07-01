/**
 * OCMBR Wave 2e — D07-S02 IU-SVC
 * Pet Profile & Medical Summary service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewPetDocument,
  type NewPetMedicalAlert,
  type NewPetWeightRecord,
  petDocument,
  petMedicalAlert,
  petWeightRecord,
} from "@/server/db/schema";

export function listAlerts(petId: number) {
  return db
    .select()
    .from(petMedicalAlert)
    .where(eq(petMedicalAlert.petId, petId))
    .orderBy(petMedicalAlert.createdAt);
}

export async function createAlert(input: NewPetMedicalAlert) {
  const [result] = await db.insert(petMedicalAlert).values(input).returning();
  return result;
}

export async function resolveAlert(id: number) {
  const [result] = await db
    .update(petMedicalAlert)
    .set({ isActive: 0, resolvedAt: new Date(), updatedAt: new Date() })
    .where(eq(petMedicalAlert.id, id))
    .returning();
  return result;
}

export function listWeightRecords(petId: number) {
  return db
    .select()
    .from(petWeightRecord)
    .where(eq(petWeightRecord.petId, petId))
    .orderBy(petWeightRecord.recordDate);
}

export async function recordWeight(input: NewPetWeightRecord) {
  const [result] = await db.insert(petWeightRecord).values(input).returning();
  return result;
}

export function listDocuments(petId: number) {
  return db
    .select()
    .from(petDocument)
    .where(eq(petDocument.petId, petId))
    .orderBy(petDocument.createdAt);
}

export async function addDocument(input: NewPetDocument) {
  const [result] = await db.insert(petDocument).values(input).returning();
  return result;
}
