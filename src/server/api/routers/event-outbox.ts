/**
 * OCMBR Wave 9 — D13-S01 IU-API
 * Event Outbox tRPC router
 * Intelligence & Automation Hooks — Domain Events
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/event-outbox.service";

export const eventOutboxRouter = createTRPCRouter({
  publishEvent: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        domain: z.string().min(1).max(50),
        aggregateType: z.string().min(1).max(100),
        aggregateId: z.string().min(1).max(255),
        eventType: z.string().min(1).max(150),
        payload: z.record(z.string(), z.unknown()),
        targetConsumer: z.string().max(100).optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.publishEvent(
        input.domain,
        input.aggregateType,
        input.aggregateId,
        input.eventType,
        input.payload,
        input.targetConsumer,
      ),
    ),

  listPending: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(z.object({ limit: z.number().int().positive().default(50) }))
    .query(({ input }) => svc.listPendingEvents(input.limit)),

  listByDomain: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(z.object({ domain: z.string().min(1) }))
    .query(({ input }) => svc.listEventsByDomain(input.domain)),

  markDelivered: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.markDelivered(input.id)),

  markFailed: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        error: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.markFailed(input.id, input.error)),

  enqueueJob: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        jobType: z.string().min(1).max(150),
        domain: z.string().max(50).optional(),
        payload: z.record(z.string(), z.unknown()).optional(),
        priority: z.number().int().min(1).max(10).default(5),
        scheduledAt: z.string().datetime().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.enqueueJobSimple(
        input.jobType,
        input.domain,
        input.payload,
        input.priority,
        input.scheduledAt ? new Date(input.scheduledAt) : undefined,
      ),
    ),

  listJobs: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(
      z.object({
        status: z.string().optional(),
        limit: z.number().int().positive().default(50),
      }),
    )
    .query(({ input }) => svc.listJobs(input.status, input.limit)),
});
