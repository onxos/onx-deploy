/**
 * OCMBR Wave 9 — D14-S02/S03 IU-API
 * Operations & Finance Dashboard tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/reporting.service";

const numericStr = z.number().transform((v) => String(v));

export const reportingRouter = createTRPCRouter({
  // ── Report Schedules ────────────────────────────────────────────────────────
  listSchedules: protectedProcedure
    .use(requirePermission("reporting:read"))
    .query(() => svc.listReportSchedules()),

  createSchedule: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(
      z.object({
        reportType: z.string().min(1).max(100),
        recipientIds: z.array(z.string()),
        cronExpression: z.string().min(1).max(100),
        format: z.enum(["PDF", "CSV", "EXCEL"]).default("PDF"),
        isActive: z.boolean().default(true),
        nextRunAt: z.string().datetime().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createReportSchedule({
        ...input,
        isActive: String(input.isActive),
        nextRunAt: input.nextRunAt ? new Date(input.nextRunAt) : undefined,
      }),
    ),

  // ── Report Snapshots ────────────────────────────────────────────────────────
  listSnapshots: protectedProcedure
    .use(requirePermission("reporting:read"))
    .input(z.object({ reportType: z.string().min(1) }))
    .query(({ input }) => svc.listSnapshotsByType(input.reportType)),

  createSnapshot: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(
      z.object({
        reportType: z.string().min(1).max(100),
        periodLabel: z.string().min(1).max(50),
        data: z.record(z.string(), z.unknown()),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createSnapshot(input)),

  // ── Operations KPIs (D14-S02) ───────────────────────────────────────────────
  listOpsKpis: protectedProcedure
    .use(requirePermission("reporting:read"))
    .input(z.object({ branchId: z.string().optional() }))
    .query(({ input }) => svc.listOpsKpis(input.branchId)),

  upsertOpsKpi: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(
      z.object({
        branchId: z.string().optional(),
        periodLabel: z.string().min(1).max(50),
        totalAppointments: numericStr.optional(),
        completedAppointments: numericStr.optional(),
        emergencyCases: numericStr.optional(),
        avgWaitMinutes: numericStr.optional(),
        stockAlerts: numericStr.optional(),
        openPurchaseOrders: numericStr.optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ input }) => svc.upsertOpsKpi(input)),

  // ── Finance KPIs (D14-S03) ──────────────────────────────────────────────────
  listFinanceKpis: protectedProcedure
    .use(requirePermission("reporting:read"))
    .input(z.object({ branchId: z.string().optional() }))
    .query(({ input }) => svc.listFinanceKpis(input.branchId)),

  upsertFinanceKpi: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(
      z.object({
        branchId: z.string().optional(),
        periodLabel: z.string().min(1).max(50),
        totalRevenue: numericStr.optional(),
        totalExpenses: numericStr.optional(),
        netProfit: numericStr.optional(),
        accountsReceivable: numericStr.optional(),
        accountsPayable: numericStr.optional(),
        cashBalance: numericStr.optional(),
        overdueInvoices: numericStr.optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ input }) => svc.upsertFinanceKpi(input)),

  // ── HR KPIs (D14-S04) ────────────────────────────────────────────────────
  listHrKpis: protectedProcedure
    .use(requirePermission("reporting:read"))
    .input(z.object({ branchId: z.string().optional() }))
    .query(({ input }) => svc.listHrKpis(input.branchId)),

  upsertHrKpi: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(
      z.object({
        branchId: z.string().optional(),
        periodLabel: z.string().min(1).max(50),
        totalHeadcount: numericStr.optional(),
        absenteeismRate: numericStr.optional(),
        overtimeHours: numericStr.optional(),
        openVacancies: numericStr.optional(),
        trainingHours: numericStr.optional(),
        pendingLeaveRequests: numericStr.optional(),
        payrollTotal: numericStr.optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ input }) => svc.upsertHrKpi(input)),

  // ── Clinical Director KPIs (D14-S05) ─────────────────────────────────────
  listClinicalDirectorKpis: protectedProcedure
    .use(requirePermission("reporting:read"))
    .input(z.object({ branchId: z.string().optional() }))
    .query(({ input }) => svc.listClinicalDirectorKpis(input.branchId)),

  upsertClinicalDirectorKpi: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(
      z.object({
        branchId: z.string().optional(),
        periodLabel: z.string().min(1).max(50),
        totalConsultations: numericStr.optional(),
        totalSurgeries: numericStr.optional(),
        avgConsultationMinutes: numericStr.optional(),
        readmissionRate: numericStr.optional(),
        labTurnaroundHours: numericStr.optional(),
        vaccinationCount: numericStr.optional(),
        prescriptionCount: numericStr.optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ input }) => svc.upsertClinicalDirectorKpi(input)),

  // ── Inventory/Procurement KPIs (D14-S06) ─────────────────────────────────
  listInventoryKpis: protectedProcedure
    .use(requirePermission("reporting:read"))
    .input(z.object({ branchId: z.string().optional() }))
    .query(({ input }) => svc.listInventoryKpis(input.branchId)),

  upsertInventoryKpi: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(
      z.object({
        branchId: z.string().optional(),
        periodLabel: z.string().min(1).max(50),
        totalSkus: numericStr.optional(),
        stockoutItems: numericStr.optional(),
        expiringItems: numericStr.optional(),
        pendingPOs: numericStr.optional(),
        inventoryValue: numericStr.optional(),
        avgLeadDays: numericStr.optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ input }) => svc.upsertInventoryKpi(input)),

  // ── Loyalty/Customer KPIs (D14-S07) ──────────────────────────────────────
  listLoyaltyKpis: protectedProcedure
    .use(requirePermission("reporting:read"))
    .input(z.object({ branchId: z.string().optional() }))
    .query(({ input }) => svc.listLoyaltyKpis(input.branchId)),

  upsertLoyaltyKpi: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(
      z.object({
        branchId: z.string().optional(),
        periodLabel: z.string().min(1).max(50),
        activeMembers: numericStr.optional(),
        newRegistrations: numericStr.optional(),
        pointsIssued: numericStr.optional(),
        pointsRedeemed: numericStr.optional(),
        npsScore: numericStr.optional(),
        churnRate: numericStr.optional(),
        avgLifetimeValue: numericStr.optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ input }) => svc.upsertLoyaltyKpi(input)),

  // ── Compliance KPIs (D14-S08) ──────────────────────────────────────────────
  listComplianceKpis: protectedProcedure
    .use(requirePermission("reporting:read"))
    .input(z.object({ branchId: z.string().optional() }))
    .query(({ input }) => svc.listComplianceKpis(input.branchId)),

  upsertComplianceKpi: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(
      z.object({
        branchId: z.string().optional(),
        periodLabel: z.string().min(1).max(50),
        openAuditFindings: numericStr.optional(),
        overdueCapas: numericStr.optional(),
        expiringLicences: numericStr.optional(),
        openIncidents: numericStr.optional(),
        highRiskItems: numericStr.optional(),
        policyAcknowledgementRate: numericStr.optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ input }) => svc.upsertComplianceKpi(input)),

  // ── Custom Report Builder (D14-S09) ────────────────────────────────────────
  listCustomReports: protectedProcedure
    .use(requirePermission("reporting:read"))
    .input(z.object({ createdBy: z.string().optional() }))
    .query(({ input }) => svc.listCustomReports(input.createdBy)),

  createCustomReport: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(
      z.object({
        name: z.string().min(1).max(150),
        description: z.string().optional(),
        queryConfig: z.record(z.string(), z.unknown()),
        columns: z.array(z.string()),
        filters: z.record(z.string(), z.unknown()).optional(),
        createdBy: z.string().min(1),
        isShared: z.boolean().default(false),
      }),
    )
    .mutation(({ input }) =>
      svc.createCustomReport({ ...input, isShared: String(input.isShared) }),
    ),

  updateCustomReport: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(150).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...patch } = input;
      return svc.updateCustomReport(id, patch);
    }),

  deleteCustomReport: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.deleteCustomReport(input.id)),

  // ── Consolidated Report Config (D15-S05) ───────────────────────────────────
  listConsolidatedConfigs: protectedProcedure
    .use(requirePermission("reporting:read"))
    .input(z.object({ tenantId: z.string().optional() }))
    .query(({ input }) => svc.listConsolidatedConfigs(input.tenantId)),

  createConsolidatedConfig: protectedProcedure
    .use(requirePermission("reporting:write"))
    .input(
      z.object({
        tenantId: z.string().optional(),
        reportType: z.string().min(1).max(100),
        consolidationMode: z
          .enum(["CONSOLIDATED", "BRANCH", "BRAND"])
          .default("CONSOLIDATED"),
        includedBranchIds: z.array(z.string()).optional(),
        excludedBranchIds: z.array(z.string()).optional(),
        currencyCode: z.string().max(10).default("USD"),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(({ input }) =>
      svc.createConsolidatedConfig({
        ...input,
        isActive: String(input.isActive),
        includedBranchIds: input.includedBranchIds,
        excludedBranchIds: input.excludedBranchIds,
      }),
    ),
});
