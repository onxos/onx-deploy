/**
 * OCMBR Wave 2b — D02-S05 IU-API (Router)
 * Payroll Run tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/payroll.service";

export const payrollRouter = createTRPCRouter({
  listRuns: protectedProcedure
    .use(requirePermission("payroll:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        status: z.string().optional(),
      }),
    )
    .query(({ input }) =>
      svc.listPayrollRuns(input.branchId, { status: input.status }),
    ),

  getRun: protectedProcedure
    .use(requirePermission("payroll:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getPayrollRunById(input.id)),

  createRun: protectedProcedure
    .use(requirePermission("payroll:write"))
    .input(
      z.object({
        runNumber: z.string().min(1).max(50),
        branchId: z.number().int().positive(),
        payPeriodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        payPeriodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        notes: z.string().max(500).optional(),
      }),
    )
    .mutation(({ input }) => svc.createPayrollRun(input)),

  addLine: protectedProcedure
    .use(requirePermission("payroll:write"))
    .input(
      z.object({
        runId: z.number().int().positive(),
        employeeId: z.number().int().positive(),
        basicSalary: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        overtimePay: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        allowances: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        grossPay: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        taxDeduction: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        socialInsurance: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        otherDeductions: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        netPay: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        notes: z.string().max(500).optional(),
      }),
    )
    .mutation(({ input }) => svc.addPayrollLine(input)),

  getLines: protectedProcedure
    .use(requirePermission("payroll:read"))
    .input(z.object({ runId: z.number().int().positive() }))
    .query(({ input }) => svc.getPayrollLines(input.runId)),

  processRun: protectedProcedure
    .use(requirePermission("payroll:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input, ctx }) => svc.processPayrollRun(input.id, ctx.user.id)),

  approveRun: protectedProcedure
    .use(requirePermission("payroll:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input, ctx }) => svc.approvePayrollRun(input.id, ctx.user.id)),

  markPaid: protectedProcedure
    .use(requirePermission("payroll:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.markPayrollPaid(input.id)),
});
