/**
 * OCMBR Wave 2 — D03-S03 IU-API (Router)
 * Accounts Receivable tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/ar.service";

export const arRouter = createTRPCRouter({
  listInvoices: protectedProcedure
    .use(requirePermission("ar:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        clientId: z.number().int().positive().optional(),
        status: z.string().optional(),
        limit: z.number().int().positive().max(500).optional(),
      }),
    )
    .query(({ input }) =>
      svc.listInvoices(input.branchId, {
        clientId: input.clientId,
        status: input.status,
        limit: input.limit,
      }),
    ),

  getInvoice: protectedProcedure
    .use(requirePermission("ar:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getInvoiceById(input.id)),

  createInvoice: protectedProcedure
    .use(requirePermission("ar:write"))
    .input(
      z.object({
        invoiceNumber: z.string().min(1).max(50),
        clientId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        accountId: z.number().int().positive().optional(),
        issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        subtotal: z
          .number()
          .nonnegative()
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
    .mutation(({ input }) => svc.createInvoice(input)),

  issueInvoice: protectedProcedure
    .use(requirePermission("ar:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.issueInvoice(input.id)),

  cancelInvoice: protectedProcedure
    .use(requirePermission("ar:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.cancelInvoice(input.id)),

  getPayments: protectedProcedure
    .use(requirePermission("ar:read"))
    .input(z.object({ invoiceId: z.number().int().positive() }))
    .query(({ input }) => svc.getPaymentsForInvoice(input.invoiceId)),

  recordPayment: protectedProcedure
    .use(requirePermission("ar:write"))
    .input(
      z.object({
        invoiceId: z.number().int().positive(),
        paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        amount: z
          .number()
          .positive()
          .transform((v) => String(v)),
        paymentMethod: z
          .enum(["CASH", "CARD", "BANK_TRANSFER", "INSURANCE", "OTHER"])
          .default("CASH"),
        reference: z.string().max(100).optional(),
        notes: z.string().max(500).optional(),
      }),
    )
    .mutation(({ input }) => svc.recordPayment(input)),
});
