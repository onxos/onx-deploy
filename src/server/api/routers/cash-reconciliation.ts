/**
 * OCMBR Wave 2e — D08-S05 IU-API
 * Daily Cash Reconciliation tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/cash-reconciliation.service";

export const cashReconciliationRouter = createTRPCRouter({
  listReconciliations: protectedProcedure
    .use(requirePermission("cash-recon:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listReconciliations(input.branchId)),

  getReconciliation: protectedProcedure
    .use(requirePermission("cash-recon:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getReconciliationById(input.id)),

  getDenominations: protectedProcedure
    .use(requirePermission("cash-recon:read"))
    .input(z.object({ reconciliationId: z.number().int().positive() }))
    .query(({ input }) => svc.getDenominations(input.reconciliationId)),

  createReconciliation: protectedProcedure
    .use(requirePermission("cash-recon:write"))
    .input(
      z.object({
        reconciliation: z.object({
          reconciliationNumber: z.string().min(1),
          shiftId: z.number().int().positive(),
          branchId: z.number().int().positive(),
          reconciliationDate: z.string().length(10),
          openingFloat: z
            .number()
            .nonnegative()
            .transform((v) => String(v))
            .optional(),
          systemExpected: z
            .number()
            .nonnegative()
            .transform((v) => String(v)),
          physicalCount: z
            .number()
            .nonnegative()
            .transform((v) => String(v)),
          variance: z
            .number()
            .transform((v) => String(v))
            .optional(),
          reconciledBy: z.string().optional(),
          notes: z.string().optional(),
        }),
        denominations: z
          .array(
            z.object({
              denomination: z
                .number()
                .positive()
                .transform((v) => String(v)),
              quantity: z.number().int().nonnegative(),
              subtotal: z
                .number()
                .nonnegative()
                .transform((v) => String(v)),
            }),
          )
          .default([]),
      }),
    )
    .mutation(({ input }) =>
      svc.createReconciliation(input.reconciliation, input.denominations),
    ),

  submitReconciliation: protectedProcedure
    .use(requirePermission("cash-recon:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.submitReconciliation(input.id)),

  approveReconciliation: protectedProcedure
    .use(requirePermission("cash-recon:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        approvedBy: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.approveReconciliation(input.id, input.approvedBy),
    ),
});
