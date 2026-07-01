/**
 * OCMBR Wave 2d — D04-S06 IU-API
 * Supplier Returns tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/supplier-return.service";

export const supplierReturnRouter = createTRPCRouter({
  listReturns: protectedProcedure
    .use(requirePermission("supplier-return:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listReturns(input.branchId)),

  getReturn: protectedProcedure
    .use(requirePermission("supplier-return:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getReturnById(input.id)),

  getReturnLines: protectedProcedure
    .use(requirePermission("supplier-return:read"))
    .input(z.object({ returnId: z.number().int().positive() }))
    .query(({ input }) => svc.getReturnLines(input.returnId)),

  createReturn: protectedProcedure
    .use(requirePermission("supplier-return:write"))
    .input(
      z.object({
        supplierReturn: z.object({
          returnNumber: z.string().min(1),
          grnId: z.number().int().positive(),
          vendorId: z.number().int().positive(),
          branchId: z.number().int().positive(),
          returnDate: z.string().length(10),
          reason: z.string().min(1),
          totalAmount: z
            .number()
            .nonnegative()
            .transform((v) => String(v))
            .optional(),
          debitNoteReference: z.string().optional(),
          notes: z.string().optional(),
        }),
        lines: z
          .array(
            z.object({
              grnLineId: z.number().int().positive().optional(),
              itemId: z.number().int().positive(),
              returnQty: z
                .number()
                .positive()
                .transform((v) => String(v)),
              unitCost: z
                .number()
                .nonnegative()
                .transform((v) => String(v)),
              lineTotal: z
                .number()
                .nonnegative()
                .transform((v) => String(v)),
              notes: z.string().optional(),
            }),
          )
          .min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.createReturn(input.supplierReturn, input.lines),
    ),

  confirmReturn: protectedProcedure
    .use(requirePermission("supplier-return:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.confirmReturn(input.id)),

  cancelReturn: protectedProcedure
    .use(requirePermission("supplier-return:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.cancelReturn(input.id)),
});
