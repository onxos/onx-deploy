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

// ── HR KPIs (D14-S04) ────────────────────────────────────────────────────────

import type {
  NewClinicalDirectorKpi,
  NewHrDashboardKpi,
  NewInventoryProcurementKpi,
  NewLoyaltyDashboardKpi,
} from "@/server/db/schema/reporting-foundation";
import {
  clinicalDirectorKpi,
  hrDashboardKpi,
  inventoryProcurementKpi,
  loyaltyDashboardKpi,
} from "@/server/db/schema/reporting-foundation";

export async function listHrKpis(branchId?: string) {
  if (branchId) {
    return db
      .select()
      .from(hrDashboardKpi)
      .where(eq(hrDashboardKpi.branchId, branchId));
  }
  return db.select().from(hrDashboardKpi);
}

export async function upsertHrKpi(
  input: Omit<NewHrDashboardKpi, "id" | "createdAt">,
) {
  const [row] = await db.insert(hrDashboardKpi).values(input).returning();
  return row;
}

export async function listClinicalDirectorKpis(branchId?: string) {
  if (branchId) {
    return db
      .select()
      .from(clinicalDirectorKpi)
      .where(eq(clinicalDirectorKpi.branchId, branchId));
  }
  return db.select().from(clinicalDirectorKpi);
}

export async function upsertClinicalDirectorKpi(
  input: Omit<NewClinicalDirectorKpi, "id" | "createdAt">,
) {
  const [row] = await db.insert(clinicalDirectorKpi).values(input).returning();
  return row;
}

export async function listInventoryKpis(branchId?: string) {
  if (branchId) {
    return db
      .select()
      .from(inventoryProcurementKpi)
      .where(eq(inventoryProcurementKpi.branchId, branchId));
  }
  return db.select().from(inventoryProcurementKpi);
}

export async function upsertInventoryKpi(
  input: Omit<NewInventoryProcurementKpi, "id" | "createdAt">,
) {
  const [row] = await db
    .insert(inventoryProcurementKpi)
    .values(input)
    .returning();
  return row;
}

export async function listLoyaltyKpis(branchId?: string) {
  if (branchId) {
    return db
      .select()
      .from(loyaltyDashboardKpi)
      .where(eq(loyaltyDashboardKpi.branchId, branchId));
  }
  return db.select().from(loyaltyDashboardKpi);
}

export async function upsertLoyaltyKpi(
  input: Omit<NewLoyaltyDashboardKpi, "id" | "createdAt">,
) {
  const [row] = await db.insert(loyaltyDashboardKpi).values(input).returning();
  return row;
}
