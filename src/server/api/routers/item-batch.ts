/**
 * OCMBR Wave 2b — D05-S03 IU-API (Router)
 * Item Batch / Lot Tracking tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/item-batch.service";

export const itemBatchRouter = createTRPCRouter({
  listBatches: protectedProcedure
    .use(requirePermission("item-batch:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        itemId: z.number().int().positive().optional(),
        status: z.string().optional(),
      }),
    )
    .query(({ input }) =>
      svc.listItemBatches(input.branchId, {
        itemId: input.itemId,
        status: input.status,
      }),
    ),

  getBatch: protectedProcedure
    .use(requirePermission("item-batch:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getItemBatchById(input.id)),

  createBatch: protectedProcedure
    .use(requirePermission("item-batch:write"))
    .input(
      z.object({
        batchNumber: z.string().min(1).max(80),
        itemId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        locationId: z.number().int().positive().optional(),
        manufacturedDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        expiryDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        receivedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        initialQty: z
          .number()
          .positive()
          .transform((v) => String(v)),
        currentQty: z
          .number()
          .nonnegative()
          .transform((v) => String(v)),
        unitCost: z
          .number()
          .nonnegative()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        supplierLotNumber: z.string().max(80).optional(),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(({ input }) => svc.createItemBatch(input)),

  updateBatch: protectedProcedure
    .use(requirePermission("item-batch:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z
          .enum(["ACTIVE", "QUARANTINE", "EXPIRED", "DEPLETED", "RECALLED"])
          .optional(),
        currentQty: z
          .number()
          .nonnegative()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        locationId: z.number().int().positive().optional(),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...rest } = input;
      return svc.updateItemBatch(id, rest);
    }),

  quarantine: protectedProcedure
    .use(requirePermission("item-batch:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.quarantineBatch(input.id)),

  listExpiring: protectedProcedure
    .use(requirePermission("item-batch:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        beforeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }),
    )
    .query(({ input }) =>
      svc.listExpiringBatches(input.branchId, input.beforeDate),
    ),
});
