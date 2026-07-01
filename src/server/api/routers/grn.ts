/**
 * OCMBR Wave 2c — D04-S05 IU-API (Router)
 * Goods Received Note (GRN) tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/grn.service";

export const grnRouter = createTRPCRouter({
  listGrns: protectedProcedure
    .use(requirePermission("grn:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        poId: z.number().int().positive().optional(),
        status: z.string().optional(),
      }),
    )
    .query(({ input }) =>
      svc.listGrns(input.branchId, {
        poId: input.poId,
        status: input.status,
      }),
    ),

  getGrn: protectedProcedure
    .use(requirePermission("grn:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getGrnById(input.id)),

  getLines: protectedProcedure
    .use(requirePermission("grn:read"))
    .input(z.object({ grnId: z.number().int().positive() }))
    .query(({ input }) => svc.getGrnLines(input.grnId)),

  createGrn: protectedProcedure
    .use(requirePermission("grn:write"))
    .input(
      z.object({
        grnNumber: z.string().min(1).max(50),
        poId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        receivedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        notes: z.string().max(1000).optional(),
        lines: z
          .array(
            z.object({
              poLineId: z.number().int().positive().optional(),
              itemId: z.number().int().positive(),
              orderedQty: z
                .number()
                .positive()
                .transform((v) => String(v)),
              receivedQty: z
                .number()
                .nonnegative()
                .transform((v) => String(v)),
              rejectedQty: z
                .number()
                .nonnegative()
                .default(0)
                .transform((v) => String(v)),
              unitCost: z
                .number()
                .nonnegative()
                .optional()
                .transform((v) => (v !== undefined ? String(v) : undefined)),
              batchNumber: z.string().max(80).optional(),
              expiryDate: z
                .string()
                .regex(/^\d{4}-\d{2}-\d{2}$/)
                .optional(),
              notes: z.string().optional(),
            }),
          )
          .default([]),
      }),
    )
    .mutation(({ input, ctx }) => {
      const { lines, ...grnData } = input;
      return svc.createGrn({ ...grnData, receivedBy: ctx.user.id }, lines);
    }),

  confirmGrn: protectedProcedure
    .use(requirePermission("grn:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.confirmGrn(input.id)),

  cancelGrn: protectedProcedure
    .use(requirePermission("grn:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.cancelGrn(input.id)),
});
