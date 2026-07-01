/**
 * OCMBR Wave 4 — D11-S01 IU-SVC
 * TeleVet Booking & Video Session service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { type NewTelvetSession, televet_session } from "@/server/db/schema";

export function listSessionsByPet(petId: number) {
  return db
    .select()
    .from(televet_session)
    .where(eq(televet_session.petId, petId))
    .orderBy(televet_session.scheduledAt);
}

export function listSessionsByBranch(branchId: number) {
  return db
    .select()
    .from(televet_session)
    .where(eq(televet_session.branchId, branchId))
    .orderBy(televet_session.scheduledAt);
}

export function getSessionById(id: number) {
  return db.select().from(televet_session).where(eq(televet_session.id, id));
}

export async function createSession(
  input: Omit<NewTelvetSession, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(televet_session).values(input).returning();
  return row;
}

export async function updateSessionStatus(id: number, status: string) {
  const [row] = await db
    .update(televet_session)
    .set({ status, updatedAt: new Date() })
    .where(eq(televet_session.id, id))
    .returning();
  return row;
}

export async function completeSession(id: number, recordingUrl?: string) {
  const [row] = await db
    .update(televet_session)
    .set({
      status: "COMPLETED",
      recordingUrl: recordingUrl ?? null,
      updatedAt: new Date(),
    })
    .where(eq(televet_session.id, id))
    .returning();
  return row;
}
