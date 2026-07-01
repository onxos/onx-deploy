/**
 * OCMBR Wave 2 — D04-S02 IU-API (Router)
 * Purchase Requisition tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/procurement-pr.service";

export const procurementPrRouter = createTRPCRouter({
  listPRs: protectedProcedure
    .use(requirePermission("procurement:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        status: z.string().optional(),
        requestedBy: z.string().optional(),
      }),
    )
    .query(({ input }) =>
      svc.listPurchaseRequisitions(input.branchId, {
        status: input.status,
        requestedBy: input.requestedBy,
      }),
    ),

  getPR: protectedProcedure
    .use(requirePermission("procurement:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getPurchaseRequisitionById(input.id)),

  getPRLines: protectedProcedure
    .use(requirePermission("procurement:read"))
    .input(z.object({ prId: z.number().int().positive() }))
    .query(({ input }) => svc.getPrLines(input.prId)),

  createPR: protectedProcedure
    .use(requirePermission("procurement:write"))
    .input(
      z.object({
        prNumber: z.string().min(1).max(50),
        branchId: z.number().int().positive(),
        requestedBy: z.string().min(1),
        departmentId: z.number().int().positive().optional(),
        requiredDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        totalEstimatedCost: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        notes: z.string().max(1000).optional(),
        lines: z
          .array(
            z.object({
              lineNumber: z.number().int().positive(),
              itemId: z.number().int().positive(),
              requestedQty: z
                .number()
                .positive()
                .transform((v) => String(v)),
              estimatedUnitPrice: z
                .number()
                .nonnegative()
                .default(0)
                .transform((v) => String(v)),
              totalEstimated: z
                .number()
                .nonnegative()
                .default(0)
                .transform((v) => String(v)),
              notes: z.string().optional(),
            }),
          )
          .default([]),
      }),
    )
    .mutation(({ input }) => {
      const { lines, ...prData } = input;
      return svc.createPurchaseRequisition(prData, lines);
    }),

  submitPR: protectedProcedure
    .use(requirePermission("procurement:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.submitPurchaseRequisition(input.id)),

  approvePR: protectedProcedure
    .use(requirePermission("approval:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.approvePurchaseRequisition(input.id)),

  rejectPR: protectedProcedure
    .use(requirePermission("approval:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.rejectPurchaseRequisition(input.id)),
});
