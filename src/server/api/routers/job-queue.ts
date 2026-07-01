/**
 * OCMBR Wave 12 — D13-S08 IU-API
 * Background Job Queue tRPC router
 * Uses existing intelligence-foundation schema (jobQueue table)
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/event-outbox.service";

export const jobQueueRouter = createTRPCRouter({
  enqueue: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        jobType: z.string().min(1).max(150),
        payload: z.record(z.string(), z.unknown()).optional(),
        domain: z.string().max(50).optional(),
        priority: z.number().int().min(1).max(10).default(5),
        scheduledAt: z.string().datetime().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.enqueueJob(input.jobType, input.payload ?? {}, {
        domain: input.domain,
        priority: input.priority,
        scheduledAt: input.scheduledAt
          ? new Date(input.scheduledAt)
          : undefined,
      }),
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

  getNext: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .query(() => svc.getNextReadyJob()),

  complete: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        result: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ input }) => svc.markJobComplete(input.id, input.result)),

  fail: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        error: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.markJobFailed(input.id, input.error)),
});
