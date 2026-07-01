/**
 * OCMBR Wave 6 — D11-S08 IU-API
 * 24/7 Availability Dashboard tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/availability.service";

export const availabilityRouter = createTRPCRouter({
  listWindowsByBranch: protectedProcedure
    .use(requirePermission("availability:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listWindowsByBranch(input.branchId)),

  upsertWindow: protectedProcedure
    .use(requirePermission("availability:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        dayOfWeek: z.number().int().min(0).max(6),
        openHour: z.number().int().min(0).max(23),
        closeHour: z.number().int().min(1).max(24),
        serviceType: z
          .enum(["GENERAL", "EMERGENCY", "SURGERY", "TELEVET"])
          .default("GENERAL"),
        isActive: z.boolean().default(true),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.upsertWindow(input)),

  updateWindowStatus: protectedProcedure
    .use(requirePermission("availability:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        isActive: z.boolean(),
      }),
    )
    .mutation(({ input }) => svc.updateWindowStatus(input.id, input.isActive)),

  listOverridesByBranch: protectedProcedure
    .use(requirePermission("availability:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listOverridesByBranch(input.branchId)),

  createOverride: protectedProcedure
    .use(requirePermission("availability:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        overrideDate: z.string().datetime(),
        isClosed: z.boolean().default(false),
        openHour: z.number().int().min(0).max(23).optional(),
        closeHour: z.number().int().min(1).max(24).optional(),
        reason: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createOverride({
        ...input,
        overrideDate: new Date(input.overrideDate),
      }),
    ),
});
