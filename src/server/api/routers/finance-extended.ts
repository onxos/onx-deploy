import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/finance-extended.service";

const numStr = z.number().transform((v) => String(v));

export const financeExtendedRouter = createTRPCRouter({
  // D02-S10 Offboarding
  listOffboarding: protectedProcedure
    .use(requirePermission("hr:read"))
    .input(z.object({ status: z.string().optional() }))
    .query(({ input }) => svc.listOffboarding(input.status)),
  createOffboarding: protectedProcedure
    .use(requirePermission("hr:write"))
    .input(
      z.object({
        employeeId: z.string().min(1),
        exitType: z
          .enum(["RESIGNATION", "TERMINATION", "RETIREMENT", "REDUNDANCY"])
          .default("RESIGNATION"),
        lastWorkingDay: z.string().datetime().optional(),
        noticeDate: z.string().datetime().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createOffboarding({
        ...input,
        status: "IN_PROGRESS",
        clearanceStatus: "PENDING",
        lastWorkingDay: input.lastWorkingDay
          ? new Date(input.lastWorkingDay)
          : undefined,
        noticeDate: input.noticeDate ? new Date(input.noticeDate) : undefined,
      }),
    ),
  completeOffboarding: protectedProcedure
    .use(requirePermission("hr:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.completeOffboarding(input.id)),

  // D03-S07 Budget
  listBudgetLines: protectedProcedure
    .use(requirePermission("finance:read"))
    .input(
      z.object({
        year: z.string().optional(),
        branchId: z.string().optional(),
      }),
    )
    .query(({ input }) => svc.listBudgetLines(input.year, input.branchId)),
  createBudgetLine: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(
      z.object({
        budgetYear: numStr,
        period: z.string().min(1).max(20),
        accountCode: z.string().min(1).max(50),
        branchId: z.string().optional(),
        budgetAmount: numStr,
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createBudgetLine(input)),
  updateBudgetActual: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(z.object({ id: z.number().int().positive(), actualAmount: numStr }))
    .mutation(({ input }) =>
      svc.updateBudgetActual(input.id, input.actualAmount),
    ),

  // D03-S08 Cash Flow
  listCashFlowForecasts: protectedProcedure
    .use(requirePermission("finance:read"))
    .input(z.object({ period: z.string().optional() }))
    .query(({ input }) => svc.listCashFlowForecasts(input.period)),
  createCashFlowForecast: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(
      z.object({
        forecastDate: z.string().datetime(),
        period: z.string().min(1).max(20),
        branchId: z.string().optional(),
        openingBalance: numStr,
        projectedInflows: numStr.optional(),
        projectedOutflows: numStr.optional(),
        closingBalance: numStr.optional(),
        currencyCode: z.string().max(10).default("USD"),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createCashFlowForecast({
        ...input,
        forecastDate: new Date(input.forecastDate),
      }),
    ),

  // D03-S09 Period Close
  listPeriodCloses: protectedProcedure
    .use(requirePermission("finance:read"))
    .query(() => svc.listPeriodCloses()),
  closePeriod: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(
      z.object({
        year: z.string().min(4).max(4),
        month: z.string().min(1).max(2),
        closedBy: z.string().min(1),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.closePeriod(input.year, input.month, input.closedBy, input.notes),
    ),
  reopenPeriod: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        reopenedBy: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.reopenPeriod(input.id, input.reopenedBy)),

  // D03-S10 Tax
  listTaxRules: protectedProcedure
    .use(requirePermission("finance:read"))
    .input(z.object({ taxType: z.string().optional() }))
    .query(({ input }) => svc.listTaxRules(input.taxType)),
  createTaxRule: protectedProcedure
    .use(requirePermission("finance:write"))
    .input(
      z.object({
        ruleName: z.string().min(1).max(100),
        taxType: z.enum(["VAT", "GST", "INCOME", "WITHHOLDING"]).default("VAT"),
        rate: numStr,
        applicableTo: z.string().min(1).max(100),
        countryCode: z.string().min(2).max(10),
        effectiveFrom: z.string().datetime().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createTaxRule({
        ...input,
        isActive: true,
        effectiveFrom: input.effectiveFrom
          ? new Date(input.effectiveFrom)
          : new Date(),
      }),
    ),
});
