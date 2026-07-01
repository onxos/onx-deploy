/**
 * OCMBR Wave 7 — D12-S06 IU-SVC
 * Incident Reporting service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { incidentReport, type NewIncidentReport } from "@/server/db/schema";

export function listIncidentsByBranch(branchId: number) {
  return db
    .select()
    .from(incidentReport)
    .where(eq(incidentReport.branchId, branchId))
    .orderBy(incidentReport.occurredAt);
}

export async function createIncident(
  input: Omit<NewIncidentReport, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(incidentReport).values(input).returning();
  return row;
}

export async function updateIncidentStatus(id: number, status: string) {
  const [row] = await db
    .update(incidentReport)
    .set({ status, updatedAt: new Date() })
    .where(eq(incidentReport.id, id))
    .returning();
  return row;
}

export async function closeIncident(id: number, resolution: string) {
  const [row] = await db
    .update(incidentReport)
    .set({
      status: "CLOSED",
      resolution,
      closedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(incidentReport.id, id))
    .returning();
  return row;
}
