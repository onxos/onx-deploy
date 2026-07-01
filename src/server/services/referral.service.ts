/**
 * OCMBR Wave 2f — D09-S09 IU-SVC
 * Referral Management service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { type NewReferral, referral } from "@/server/db/schema";

export function listReferrals(branchId: number) {
  return db
    .select()
    .from(referral)
    .where(eq(referral.branchId, branchId))
    .orderBy(referral.referralDate);
}

export function getReferralById(id: number) {
  return db.select().from(referral).where(eq(referral.id, id));
}

export async function createReferral(input: NewReferral) {
  const [result] = await db.insert(referral).values(input).returning();
  return result;
}

export async function updateReferralStatus(
  id: number,
  status: string,
  outcomeNotes?: string,
) {
  const [result] = await db
    .update(referral)
    .set({ status, outcomeNotes: outcomeNotes ?? null, updatedAt: new Date() })
    .where(eq(referral.id, id))
    .returning();
  return result;
}

export async function cancelReferral(id: number) {
  const [result] = await db
    .update(referral)
    .set({ status: "CANCELLED", updatedAt: new Date() })
    .where(eq(referral.id, id))
    .returning();
  return result;
}
