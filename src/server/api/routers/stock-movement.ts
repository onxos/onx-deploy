/**
 * OCMBR Wave 2 — D05-S04 IU-API (Router)
 * Stock Movement tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/stock-movement.service";

export const stockMovementRouter = createTRPCRouter({
  listMovements: protectedProcedure
    .use(requirePermission("stock:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        itemId: z.number().int().positive().optional(),
        movementType: z.string().optional(),
        limit: z.number().int().positive().max(500).optional(),
      }),
    )
    .query(({ input }) =>
      svc.listStockMovements(input.branchId, {
        itemId: input.itemId,
        movementType: input.movementType,
        limit: input.limit,
      }),
    ),

  getMovement: protectedProcedure
    .use(requirePermission("stock:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getStockMovementById(input.id)),

  recordMovement: protectedProcedure
    .use(requirePermission("stock:write"))
    .input(
      z.object({
        movementNumber: z.string().min(1).max(50),
        itemId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        movementType: z.enum([
          "IN",
          "OUT",
          "TRANSFER",
          "ADJUSTMENT",
          "OPENING",
        ]),
        quantity: z
          .number()
          .positive()
          .transform((v) => String(v)),
        unitCost: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        referenceType: z.string().max(50).optional(),
        referenceId: z.number().int().positive().optional(),
        fromBranchId: z.number().int().positive().optional(),
        toBranchId: z.number().int().positive().optional(),
        notes: z.string().max(500).optional(),
        createdBy: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.recordStockMovement(input)),

  getBalance: protectedProcedure
    .use(requirePermission("stock:read"))
    .input(
      z.object({
        itemId: z.number().int().positive(),
        branchId: z.number().int().positive(),
      }),
    )
    .query(({ input }) => svc.getStockBalance(input.itemId, input.branchId)),

  listBalances: protectedProcedure
    .use(requirePermission("stock:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listStockBalances(input.branchId)),
});
