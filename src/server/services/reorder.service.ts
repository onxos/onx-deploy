/**
 * OCMBR Wave 2b — D05-S05 IU-SVC
 * Reorder Point & Alert service
 */

import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  type NewReorderRule,
  reorderAlert,
  reorderRule,
} from "@/server/db/schema";

export async function listReorderRules(
  branchId: number,
  opts?: { activeOnly?: boolean },
) {
  const conditions = [eq(reorderRule.branchId, branchId)];
  if (opts?.activeOnly !== false)
    conditions.push(eq(reorderRule.isActive, true));
  return db
    .select()
    .from(reorderRule)
    .where(and(...conditions));
}

export async function getReorderRuleById(id: number) {
  const rows = await db
    .select()
    .from(reorderRule)
    .where(eq(reorderRule.id, id))
    .limit(1);
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Reorder rule not found",
    });
  return rows[0];
}

export async function upsertReorderRule(
  input: Omit<
    NewReorderRule,
    "id" | "createdAt" | "updatedAt" | "lastTriggeredAt"
  >,
) {
  // Check for existing rule on item+branch
  const existing = await db
    .select()
    .from(reorderRule)
    .where(
      and(
        eq(reorderRule.itemId, input.itemId),
        eq(reorderRule.branchId, input.branchId),
      ),
    )
    .limit(1);
  if (existing.length > 0) {
    const rows = await db
      .update(reorderRule)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(reorderRule.id, existing[0]?.id ?? 0))
      .returning();
    return rows[0];
  }
  const rows = await db.insert(reorderRule).values(input).returning();
  return rows[0];
}

export async function listOpenAlerts(branchId: number) {
  const rules = await db
    .select()
    .from(reorderRule)
    .where(eq(reorderRule.branchId, branchId));
  const ruleIds = rules.map((r) => r.id);
  if (ruleIds.length === 0) return [];
  const alerts = await db
    .select()
    .from(reorderAlert)
    .where(eq(reorderAlert.status, "OPEN"));
  return alerts.filter((a) => ruleIds.includes(a.reorderRuleId));
}

export async function createReorderAlert(
  reorderRuleId: number,
  currentQty: string,
) {
  const rows = await db
    .insert(reorderAlert)
    .values({ reorderRuleId, currentQty, status: "OPEN" })
    .returning();
  // Update lastTriggeredAt on rule
  await db
    .update(reorderRule)
    .set({ lastTriggeredAt: new Date() })
    .where(eq(reorderRule.id, reorderRuleId));
  return rows[0];
}

export async function resolveReorderAlert(
  id: number,
  status: "PR_CREATED" | "RESOLVED" | "DISMISSED",
) {
  const rows = await db
    .update(reorderAlert)
    .set({ status, resolvedAt: new Date() })
    .where(eq(reorderAlert.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Reorder alert not found",
    });
  return rows[0];
}
