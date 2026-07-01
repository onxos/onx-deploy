/**
 * OCMBR Wave 9 — D13-S03 IU-API
 * Module Telemetry Collector tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/telemetry.service";

export const telemetryRouter = createTRPCRouter({
  recordMetric: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        module: z.string().min(1).max(100),
        metricName: z.string().min(1).max(150),
        metricValue: z.number().transform((v) => String(v)),
        unit: z.string().max(50).default("count"),
        dimensions: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ input }) => svc.recordMetric(input)),

  listByModule: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(
      z.object({
        module: z.string().min(1),
        limit: z.number().int().positive().default(100),
      }),
    )
    .query(({ input }) => svc.listMetricsByModule(input.module, input.limit)),

  listByMetricName: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(
      z.object({
        metricName: z.string().min(1),
        limit: z.number().int().positive().default(100),
      }),
    )
    .query(({ input }) => svc.listMetricsByName(input.metricName, input.limit)),

  listInRange: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(
      z.object({
        module: z.string().min(1),
        from: z.string().datetime(),
        to: z.string().datetime(),
        limit: z.number().int().positive().default(500),
      }),
    )
    .query(({ input }) =>
      svc.listMetricsInRange(
        input.module,
        new Date(input.from),
        new Date(input.to),
        input.limit,
      ),
    ),

  createAggregation: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        module: z.string().min(1).max(100),
        metricName: z.string().min(1).max(150),
        periodStart: z.string().datetime(),
        periodEnd: z.string().datetime(),
        sumValue: z
          .number()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        avgValue: z
          .number()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        minValue: z
          .number()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        maxValue: z
          .number()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        sampleCount: z.number().int().default(0),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createAggregation({
        ...input,
        periodStart: new Date(input.periodStart),
        periodEnd: new Date(input.periodEnd),
      }),
    ),

  listAggregationsByModule: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(z.object({ module: z.string().min(1) }))
    .query(({ input }) => svc.listAggregationsByModule(input.module)),
});
