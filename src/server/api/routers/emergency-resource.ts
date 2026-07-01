/**
 * OCMBR Wave 6 — D11-S06 IU-API
 * Emergency Resource Dispatch tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/emergency-resource.service";

export const emergencyResourceRouter = createTRPCRouter({
  listByBranch: protectedProcedure
    .use(requirePermission("emergency:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listResourcesByBranch(input.branchId)),

  getById: protectedProcedure
    .use(requirePermission("emergency:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getResourceById(input.id)),

  create: protectedProcedure
    .use(requirePermission("emergency:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        resourceType: z.enum([
          "AMBULANCE",
          "MOBILE_UNIT",
          "RAPID_RESPONSE_VAN",
          "DRONE",
        ]),
        resourceCode: z.string().min(1).max(50),
        currentLocation: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createResource(input)),

  updateStatus: protectedProcedure
    .use(requirePermission("emergency:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum([
          "AVAILABLE",
          "DISPATCHED",
          "RETURNING",
          "MAINTENANCE",
          "OUT_OF_SERVICE",
        ]),
      }),
    )
    .mutation(({ input }) => svc.updateResourceStatus(input.id, input.status)),

  dispatch: protectedProcedure
    .use(requirePermission("emergency:write"))
    .input(
      z.object({
        resourceId: z.number().int().positive(),
        emergencyCaseId: z.number().int().positive().optional(),
        dispatchedById: z.string().min(1),
        destination: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.dispatchResource(input)),

  returnResource: protectedProcedure
    .use(requirePermission("emergency:write"))
    .input(z.object({ dispatchEventId: z.number().int().positive() }))
    .mutation(({ input }) => svc.returnResource(input.dispatchEventId)),

  listDispatchEvents: protectedProcedure
    .use(requirePermission("emergency:read"))
    .input(z.object({ resourceId: z.number().int().positive() }))
    .query(({ input }) => svc.listDispatchEventsByResource(input.resourceId)),
});
