/**
 * OCMBR Wave 6 — D12-S04 IU-SVC
 * Audit Finding & CAPA service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  auditFinding,
  capa,
  type NewAuditFinding,
  type NewCapa,
} from "@/server/db/schema";

export function listFindingsByInstance(auditInstanceId: number) {
  return db
    .select()
    .from(auditFinding)
    .where(eq(auditFinding.auditInstanceId, auditInstanceId));
}

export async function createFinding(
  input: Omit<NewAuditFinding, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(auditFinding).values(input).returning();
  return row;
}

export async function closeFinding(id: number) {
  const [row] = await db
    .update(auditFinding)
    .set({ status: "CLOSED", closedAt: new Date(), updatedAt: new Date() })
    .where(eq(auditFinding.id, id))
    .returning();
  return row;
}

export function listCapaByFinding(findingId: number) {
  return db.select().from(capa).where(eq(capa.findingId, findingId));
}

export async function createCapa(
  input: Omit<NewCapa, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(capa).values(input).returning();
  return row;
}

export async function completeCapaItem(id: number) {
  const [row] = await db
    .update(capa)
    .set({
      status: "COMPLETED",
      completedDate: new Date().toISOString().slice(0, 10),
      updatedAt: new Date(),
    })
    .where(eq(capa.id, id))
    .returning();
  return row;
}
