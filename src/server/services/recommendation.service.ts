import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewRecommendationOutput,
  NewRecommendationRule,
} from "@/server/db/schema/recommendation-foundation";
import {
  recommendationOutput,
  recommendationRule,
} from "@/server/db/schema/recommendation-foundation";

export async function listRules(domain?: string) {
  if (domain) {
    return db
      .select()
      .from(recommendationRule)
      .where(eq(recommendationRule.domain, domain));
  }
  return db.select().from(recommendationRule);
}

export async function createRule(
  input: Omit<NewRecommendationRule, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(recommendationRule).values(input).returning();
  return row;
}

export async function updateRule(
  id: number,
  patch: Partial<Omit<NewRecommendationRule, "id" | "createdAt">>,
) {
  const [row] = await db
    .update(recommendationRule)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(recommendationRule.id, id))
    .returning();
  return row;
}

export async function generateRecommendation(
  input: Omit<NewRecommendationOutput, "id" | "generatedAt">,
) {
  const [row] = await db.insert(recommendationOutput).values(input).returning();
  return row;
}

export async function listOutputsByEntity(
  entityType: string,
  entityId: string,
) {
  return db
    .select()
    .from(recommendationOutput)
    .where(eq(recommendationOutput.entityType, entityType));
}

export async function acknowledgeRecommendation(id: number) {
  const [row] = await db
    .update(recommendationOutput)
    .set({ status: "ACKNOWLEDGED", acknowledgedAt: new Date() })
    .where(eq(recommendationOutput.id, id))
    .returning();
  return row;
}

export async function listPendingOutputs(limit = 50) {
  return db
    .select()
    .from(recommendationOutput)
    .where(eq(recommendationOutput.status, "PENDING"))
    .limit(limit);
}
