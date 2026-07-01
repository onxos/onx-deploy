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

// ── Compliance KPIs (D14-S08) ─────────────────────────────────────────────────

import type {
  NewComplianceDashboardKpi,
  NewConsolidatedReportConfig,
  NewCustomReport,
} from "@/server/db/schema/reporting-foundation";
import {
  complianceDashboardKpi,
  consolidatedReportConfig,
  customReport,
} from "@/server/db/schema/reporting-foundation";

export async function listComplianceKpis(branchId?: string) {
  if (branchId) {
    return db
      .select()
      .from(complianceDashboardKpi)
      .where(eq(complianceDashboardKpi.branchId, branchId));
  }
  return db.select().from(complianceDashboardKpi);
}

export async function upsertComplianceKpi(
  input: Omit<NewComplianceDashboardKpi, "id" | "createdAt">,
) {
  const [row] = await db
    .insert(complianceDashboardKpi)
    .values(input)
    .returning();
  return row;
}

// ── Custom Reports (D14-S09) ──────────────────────────────────────────────────

export async function listCustomReports(createdBy?: string) {
  if (createdBy) {
    return db
      .select()
      .from(customReport)
      .where(eq(customReport.createdBy, createdBy));
  }
  return db.select().from(customReport);
}

export async function createCustomReport(
  input: Omit<NewCustomReport, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(customReport).values(input).returning();
  return row;
}

export async function updateCustomReport(
  id: number,
  patch: Partial<Omit<NewCustomReport, "id" | "createdAt">>,
) {
  const [row] = await db
    .update(customReport)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(customReport.id, id))
    .returning();
  return row;
}

export async function deleteCustomReport(id: number) {
  return db.delete(customReport).where(eq(customReport.id, id));
}

// ── Consolidated Report Config (D15-S05) ─────────────────────────────────────

export async function listConsolidatedConfigs(tenantId?: string) {
  if (tenantId) {
    return db
      .select()
      .from(consolidatedReportConfig)
      .where(eq(consolidatedReportConfig.tenantId, tenantId));
  }
  return db.select().from(consolidatedReportConfig);
}

export async function createConsolidatedConfig(
  input: Omit<NewConsolidatedReportConfig, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db
    .insert(consolidatedReportConfig)
    .values(input)
    .returning();
  return row;
}

export async function updateConsolidatedConfig(
  id: number,
  patch: Partial<Omit<NewConsolidatedReportConfig, "id" | "createdAt">>,
) {
  const [row] = await db
    .update(consolidatedReportConfig)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(consolidatedReportConfig.id, id))
    .returning();
  return row;
}
