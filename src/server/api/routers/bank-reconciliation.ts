/**
 * OCMBR Wave 2d — D03-S05 IU-API
 * Bank Reconciliation tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/bank-reconciliation.service";

export const bankReconciliationRouter = createTRPCRouter({
  listReconciliations: protectedProcedure
    .use(requirePermission("bank-recon:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listReconciliations(input.branchId)),

  getReconciliation: protectedProcedure
    .use(requirePermission("bank-recon:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getReconciliationById(input.id)),

  getLines: protectedProcedure
    .use(requirePermission("bank-recon:read"))
    .input(z.object({ reconciliationId: z.number().int().positive() }))
    .query(({ input }) => svc.getLines(input.reconciliationId)),

  createReconciliation: protectedProcedure
    .use(requirePermission("bank-recon:write"))
    .input(
      z.object({
        reconciliation: z.object({
          reconciliationNumber: z.string().min(1),
          accountId: z.number().int().positive(),
          branchId: z.number().int().positive(),
          statementDate: z.string().length(10),
          openingBalance: z.number().transform((v) => String(v)),
          closingBalance: z.number().transform((v) => String(v)),
          notes: z.string().optional(),
        }),
        lines: z
          .array(
            z.object({
              transactionDate: z.string().length(10),
              description: z.string().min(1),
              debit: z
                .number()
                .nonnegative()
                .transform((v) => String(v))
                .optional(),
              credit: z
                .number()
                .nonnegative()
                .transform((v) => String(v))
                .optional(),
              referenceType: z.string().optional(),
              referenceId: z.number().int().positive().optional(),
              notes: z.string().optional(),
            }),
          )
          .default([]),
      }),
    )
    .mutation(({ input }) =>
      svc.createReconciliation(input.reconciliation, input.lines),
    ),

  finalizeReconciliation: protectedProcedure
    .use(requirePermission("bank-recon:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        reconciledBy: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.finalizeReconciliation(input.id, input.reconciledBy),
    ),

  cancelReconciliation: protectedProcedure
    .use(requirePermission("bank-recon:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.cancelReconciliation(input.id)),
});
