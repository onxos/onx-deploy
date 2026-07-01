/**
 * OCMBR Wave 2b — D04-S04 IU-API (Router)
 * Purchase Order tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/purchase-order.service";

export const purchaseOrderRouter = createTRPCRouter({
  listOrders: protectedProcedure
    .use(requirePermission("purchase-order:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        status: z.string().optional(),
        vendorId: z.number().int().positive().optional(),
      }),
    )
    .query(({ input }) =>
      svc.listPurchaseOrders(input.branchId, {
        status: input.status,
        vendorId: input.vendorId,
      }),
    ),

  getOrder: protectedProcedure
    .use(requirePermission("purchase-order:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getPurchaseOrderById(input.id)),

  getLines: protectedProcedure
    .use(requirePermission("purchase-order:read"))
    .input(z.object({ poId: z.number().int().positive() }))
    .query(({ input }) => svc.getPoLines(input.poId)),

  createOrder: protectedProcedure
    .use(requirePermission("purchase-order:write"))
    .input(
      z.object({
        poNumber: z.string().min(1).max(50),
        branchId: z.number().int().positive(),
        vendorId: z.number().int().positive(),
        prId: z.number().int().positive().optional(),
        orderDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        expectedDeliveryDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
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
          .default(0)
          .transform((v) => String(v)),
        notes: z.string().max(1000).optional(),
        lines: z
          .array(
            z.object({
              lineNumber: z.number().int().positive(),
              itemId: z.number().int().positive(),
              orderedQty: z
                .number()
                .positive()
                .transform((v) => String(v)),
              unitPrice: z
                .number()
                .nonnegative()
                .default(0)
                .transform((v) => String(v)),
              totalPrice: z
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
    .mutation(({ input, ctx }) => {
      const { lines, ...poData } = input;
      return svc.createPurchaseOrder(
        { ...poData, issuedBy: ctx.user.id },
        lines,
      );
    }),

  sendOrder: protectedProcedure
    .use(requirePermission("purchase-order:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.sendPurchaseOrder(input.id)),

  cancelOrder: protectedProcedure
    .use(requirePermission("purchase-order:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.cancelPurchaseOrder(input.id)),
});
