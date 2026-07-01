/**
 * OCMBR Wave 2b — D05-S02 IU-API (Router)
 * Inventory Location tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/inventory-location.service";

export const inventoryLocationRouter = createTRPCRouter({
  listLocations: protectedProcedure
    .use(requirePermission("inventory-location:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        activeOnly: z.boolean().default(true),
      }),
    )
    .query(({ input }) =>
      svc.listInventoryLocations(input.branchId, {
        activeOnly: input.activeOnly,
      }),
    ),

  getLocation: protectedProcedure
    .use(requirePermission("inventory-location:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getInventoryLocationById(input.id)),

  createLocation: protectedProcedure
    .use(requirePermission("inventory-location:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        code: z.string().min(1).max(30).toUpperCase(),
        name: z.string().min(1).max(100),
        locationType: z
          .enum(["SHELF", "COLD", "CONTROLLED", "QUARANTINE", "RETURNS"])
          .default("SHELF"),
        notes: z.string().max(500).optional(),
      }),
    )
    .mutation(({ input }) => svc.createInventoryLocation(input)),

  updateLocation: protectedProcedure
    .use(requirePermission("inventory-location:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(100).optional(),
        locationType: z.string().optional(),
        isActive: z.boolean().optional(),
        notes: z.string().max(500).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...rest } = input;
      return svc.updateInventoryLocation(id, rest);
    }),

  deactivate: protectedProcedure
    .use(requirePermission("inventory-location:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.deactivateInventoryLocation(input.id)),
});
