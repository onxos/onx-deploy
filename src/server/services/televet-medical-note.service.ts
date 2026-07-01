/**
 * OCMBR Wave 4 — D11-S02 IU-SVC
 * TeleVet Medical Record Integration service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewTelvetMedicalNote,
  televet_medical_note,
} from "@/server/db/schema";

export function listNotesBySession(sessionId: number) {
  return db
    .select()
    .from(televet_medical_note)
    .where(eq(televet_medical_note.sessionId, sessionId))
    .orderBy(televet_medical_note.createdAt);
}

export function listNotesByPet(petId: number) {
  return db
    .select()
    .from(televet_medical_note)
    .where(eq(televet_medical_note.petId, petId))
    .orderBy(televet_medical_note.createdAt);
}

export function getNoteById(id: number) {
  return db
    .select()
    .from(televet_medical_note)
    .where(eq(televet_medical_note.id, id));
}

export async function createMedicalNote(
  input: Omit<NewTelvetMedicalNote, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(televet_medical_note).values(input).returning();
  return row;
}

export async function updateMedicalNote(
  id: number,
  updates: Partial<
    Omit<
      NewTelvetMedicalNote,
      "id" | "sessionId" | "petId" | "createdAt" | "updatedAt"
    >
  >,
) {
  const [row] = await db
    .update(televet_medical_note)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(televet_medical_note.id, id))
    .returning();
  return row;
}
