/**
 * OCMBR Wave 7 — D12-S05 IU-SVC
 * Risk Register service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { type NewRiskEntry, riskEntry } from "@/server/db/schema";

export function listRisks(branchId?: number) {
  if (branchId !== undefined) {
    return db.select().from(riskEntry).where(eq(riskEntry.branchId, branchId));
  }
  return db.select().from(riskEntry);
}

export async function createRisk(
  input: Omit<NewRiskEntry, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(riskEntry).values(input).returning();
  return row;
}

export async function updateRiskStatus(id: number, status: string) {
  const [row] = await db
    .update(riskEntry)
    .set({ status, updatedAt: new Date() })
    .where(eq(riskEntry.id, id))
    .returning();
  return row;
}

export async function updateMitigationPlan(id: number, mitigationPlan: string) {
  const [row] = await db
    .update(riskEntry)
    .set({ mitigationPlan, updatedAt: new Date() })
    .where(eq(riskEntry.id, id))
    .returning();
  return row;
}
