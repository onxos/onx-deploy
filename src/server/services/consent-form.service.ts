/**
 * OCMBR Wave 3 — D09-S11 IU-SVC
 * Consent Forms & Legal Documents service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { consentForm, type NewConsentForm } from "@/server/db/schema";

export function listConsentFormsByPet(petId: number) {
  return db
    .select()
    .from(consentForm)
    .where(eq(consentForm.petId, petId))
    .orderBy(consentForm.createdAt);
}

export function listConsentFormsByBranch(branchId: number) {
  return db
    .select()
    .from(consentForm)
    .where(eq(consentForm.branchId, branchId))
    .orderBy(consentForm.createdAt);
}

export function getConsentFormById(id: number) {
  return db.select().from(consentForm).where(eq(consentForm.id, id));
}

export async function createConsentForm(
  input: Omit<NewConsentForm, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(consentForm).values(input).returning();
  return row;
}

export async function signConsentForm(id: number, signedByOwnerId?: number) {
  const [row] = await db
    .update(consentForm)
    .set({
      status: "SIGNED",
      signedAt: new Date(),
      signedByOwnerId: signedByOwnerId ?? null,
      updatedAt: new Date(),
    })
    .where(eq(consentForm.id, id))
    .returning();
  return row;
}

export async function revokeConsentForm(id: number) {
  const [row] = await db
    .update(consentForm)
    .set({ status: "REVOKED", updatedAt: new Date() })
    .where(eq(consentForm.id, id))
    .returning();
  return row;
}
