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
});
