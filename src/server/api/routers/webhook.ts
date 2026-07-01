/**
 * OCMBR Wave 9 — D13-S07 IU-API
 * Webhook Dispatch Layer tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/webhook.service";

export const webhookRouter = createTRPCRouter({
  listEndpoints: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .query(() => svc.listEndpoints()),

  createEndpoint: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        name: z.string().min(1).max(150),
        url: z.string().url(),
        secret: z.string().max(255).optional(),
        events: z.array(z.string()),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(({ input }) =>
      svc.createEndpoint({ ...input, events: input.events }),
    ),

  updateEndpoint: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(150).optional(),
        url: z.string().url().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...patch } = input;
      return svc.updateEndpoint(id, patch);
    }),

  deactivateEndpoint: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.deactivateEndpoint(input.id)),

  listDeliveriesByEndpoint: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(z.object({ endpointId: z.number().int().positive() }))
    .query(({ input }) => svc.listDeliveriesByEndpoint(input.endpointId)),

  listDeliveriesByStatus: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(
      z.object({
        status: z.string().min(1),
        limit: z.number().int().positive().default(50),
      }),
    )
    .query(({ input }) =>
      svc.listDeliveriesByStatus(input.status, input.limit),
    ),
});
