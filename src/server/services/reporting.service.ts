import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewFinanceDashboardKpi,
  NewOperationsDashboardKpi,
  NewReportSchedule,
  NewReportSnapshot,
} from "@/server/db/schema/reporting-foundation";
import {
  financeDashboardKpi,
  operationsDashboardKpi,
  reportSchedule,
  reportSnapshot,
} from "@/server/db/schema/reporting-foundation";

// ── Report Schedules ─────────────────────────────────────────────────────────

export async function listReportSchedules() {
  return db.select().from(reportSchedule);
}

export async function createReportSchedule(
  input: Omit<NewReportSchedule, "id" | "createdAt">,
) {
  const [row] = await db.insert(reportSchedule).values(input).returning();
  return row;
}

export async function updateReportSchedule(
  id: number,
  patch: Partial<Omit<NewReportSchedule, "id" | "createdAt">>,
) {
  const [row] = await db
    .update(reportSchedule)
    .set(patch)
    .where(eq(reportSchedule.id, id))
    .returning();
  return row;
}

// ── Report Snapshots ─────────────────────────────────────────────────────────

export async function listSnapshotsByType(reportType: string) {
  return db
    .select()
    .from(reportSnapshot)
    .where(eq(reportSnapshot.reportType, reportType));
}

export async function createSnapshot(
  input: Omit<NewReportSnapshot, "id" | "generatedAt">,
) {
  const [row] = await db.insert(reportSnapshot).values(input).returning();
  return row;
}

// ── Operations KPIs ──────────────────────────────────────────────────────────

export async function listOpsKpis(branchId?: string) {
  if (branchId) {
    return db
      .select()
      .from(operationsDashboardKpi)
      .where(eq(operationsDashboardKpi.branchId, branchId));
  }
  return db.select().from(operationsDashboardKpi);
}

export async function upsertOpsKpi(
  input: Omit<NewOperationsDashboardKpi, "id" | "createdAt">,
) {
  const [row] = await db
    .insert(operationsDashboardKpi)
    .values(input)
    .returning();
  return row;
}

// ── Finance KPIs ─────────────────────────────────────────────────────────────

export async function listFinanceKpis(branchId?: string) {
  if (branchId) {
    return db
      .select()
      .from(financeDashboardKpi)
      .where(eq(financeDashboardKpi.branchId, branchId));
  }
  return db.select().from(financeDashboardKpi);
}

export async function upsertFinanceKpi(
  input: Omit<NewFinanceDashboardKpi, "id" | "createdAt">,
) {
  const [row] = await db.insert(financeDashboardKpi).values(input).returning();
  return row;
}
