/**
 * OCMBR Wave 2b — D05-S05 IU-API (Router)
 * Reorder Point tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/reorder.service";

export const reorderRouter = createTRPCRouter({
  listRules: protectedProcedure
    .use(requirePermission("reorder:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        activeOnly: z.boolean().default(true),
      }),
    )
    .query(({ input }) =>
      svc.listReorderRules(input.branchId, { activeOnly: input.activeOnly }),
    ),

  getRule: protectedProcedure
    .use(requirePermission("reorder:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getReorderRuleById(input.id)),

  upsertRule: protectedProcedure
    .use(requirePermission("reorder:write"))
    .input(
      z.object({
        itemId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        reorderPoint: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        reorderQty: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        minStock: z
          .number()
          .nonnegative()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        maxStock: z
          .number()
          .positive()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        leadTimeDays: z.number().int().min(0).default(0),
        preferredVendorId: z.number().int().positive().optional(),
        isActive: z.boolean().default(true),
        notes: z.string().max(500).optional(),
      }),
    )
    .mutation(({ input }) => svc.upsertReorderRule(input)),

  listOpenAlerts: protectedProcedure
    .use(requirePermission("reorder:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listOpenAlerts(input.branchId)),

  resolveAlert: protectedProcedure
    .use(requirePermission("reorder:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["PR_CREATED", "RESOLVED", "DISMISSED"]),
      }),
    )
    .mutation(({ input }) => svc.resolveReorderAlert(input.id, input.status)),
});
