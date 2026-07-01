/**
 * OCMBR Wave 5 — D12-S01 IU-SVC
 * Regulatory Register service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewRegulatoryRequirement,
  regulatoryRequirement,
} from "@/server/db/schema";

export function listRegulatoryRequirements() {
  return db
    .select()
    .from(regulatoryRequirement)
    .orderBy(regulatoryRequirement.riskLevel, regulatoryRequirement.title);
}

export function getRegulatoryRequirementById(id: number) {
  return db
    .select()
    .from(regulatoryRequirement)
    .where(eq(regulatoryRequirement.id, id));
}

export async function createRegulatoryRequirement(
  input: Omit<NewRegulatoryRequirement, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db
    .insert(regulatoryRequirement)
    .values(input)
    .returning();
  return row;
}

export async function updateRequirementStatus(id: number, status: string) {
  const [row] = await db
    .update(regulatoryRequirement)
    .set({ status, updatedAt: new Date() })
    .where(eq(regulatoryRequirement.id, id))
    .returning();
  return row;
}
