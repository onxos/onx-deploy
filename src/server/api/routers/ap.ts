/**
 * OCMBR Wave 2c — D03-S04 IU-API (Router)
 * Accounts Payable tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/ap.service";

export const apRouter = createTRPCRouter({
  listBills: protectedProcedure
    .use(requirePermission("ap:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        vendorId: z.number().int().positive().optional(),
        status: z.string().optional(),
      }),
    )
    .query(({ input }) =>
      svc.listBills(input.branchId, {
        vendorId: input.vendorId,
        status: input.status,
      }),
    ),

  getBill: protectedProcedure
    .use(requirePermission("ap:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getBillById(input.id)),

  createBill: protectedProcedure
    .use(requirePermission("ap:write"))
    .input(
      z.object({
        billNumber: z.string().min(1).max(50),
        vendorId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        poId: z.number().int().positive().optional(),
        accountId: z.number().int().positive().optional(),
        billDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        subtotal: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        taxAmount: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        totalAmount: z
          .number()
          .nonnegative()
          .transform((v) => String(v)),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(({ input }) => svc.createBill(input)),

  approveBill: protectedProcedure
    .use(requirePermission("ap:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.approveBill(input.id)),

  cancelBill: protectedProcedure
    .use(requirePermission("ap:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.cancelBill(input.id)),

  getPayments: protectedProcedure
    .use(requirePermission("ap:read"))
    .input(z.object({ billId: z.number().int().positive() }))
    .query(({ input }) => svc.getPaymentsForBill(input.billId)),

  recordPayment: protectedProcedure
    .use(requirePermission("ap:write"))
    .input(
      z.object({
        billId: z.number().int().positive(),
        paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        amount: z
          .number()
          .positive()
          .transform((v) => String(v)),
        paymentMethod: z
          .enum(["CASH", "BANK_TRANSFER", "CHEQUE", "OTHER"])
          .default("BANK_TRANSFER"),
        reference: z.string().max(100).optional(),
        notes: z.string().max(500).optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      svc.recordPayment({ ...input, paidBy: ctx.user.id }),
    ),
});
