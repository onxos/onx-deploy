import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import type { NewAiDecisionRequest } from "@/server/db/schema/ai-decision-foundation";
import { aiDecisionRequest } from "@/server/db/schema/ai-decision-foundation";

export async function submitDecisionRequest(
  input: Omit<NewAiDecisionRequest, "id" | "requestedAt">,
) {
  const [row] = await db.insert(aiDecisionRequest).values(input).returning();
  return row;
}

export async function listDecisionRequests(domain?: string, limit = 50) {
  if (domain) {
    return db
      .select()
      .from(aiDecisionRequest)
      .where(eq(aiDecisionRequest.domain, domain))
      .limit(limit);
  }
  return db.select().from(aiDecisionRequest).limit(limit);
}

export async function getDecisionRequest(id: number) {
  const rows = await db
    .select()
    .from(aiDecisionRequest)
    .where(eq(aiDecisionRequest.id, id));
  return rows[0] ?? null;
}

export async function resolveDecisionRequest(
  id: number,
  outputData: Record<string, unknown>,
  confidenceScore?: string,
  notes?: string,
) {
  const [row] = await db
    .update(aiDecisionRequest)
    .set({
      outputData,
      confidenceScore,
      notes,
      status: "RESOLVED",
      resolvedAt: new Date(),
    })
    .where(eq(aiDecisionRequest.id, id))
    .returning();
  return row;
}

export async function listByDecisionType(decisionType: string) {
  return db
    .select()
    .from(aiDecisionRequest)
    .where(eq(aiDecisionRequest.decisionType, decisionType));
}
