/**
 * OCMBR Wave 11 — D13-S05 IU-API
 * Recommendation Engine Stub tRPC router
 * Stub for future ONX Intelligence (Atlas V6+) consumption
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/recommendation.service";

export const recommendationRouter = createTRPCRouter({
  listRules: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(z.object({ domain: z.string().optional() }))
    .query(({ input }) => svc.listRules(input.domain)),

  createRule: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        ruleKey: z.string().min(1).max(100),
        domain: z.string().min(1).max(50),
        name: z.string().min(1).max(150),
        description: z.string().optional(),
        triggerCondition: z.record(z.string(), z.unknown()),
        recommendationTemplate: z.string().min(1),
        priority: z
          .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
          .default("MEDIUM"),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(({ input }) =>
      svc.createRule({ ...input, isActive: String(input.isActive) }),
    ),

  updateRule: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(150).optional(),
        isActive: z.boolean().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, isActive, ...rest } = input;
      return svc.updateRule(id, {
        ...rest,
        ...(isActive !== undefined ? { isActive: String(isActive) } : {}),
      });
    }),

  generate: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        ruleId: z.number().int().positive(),
        entityType: z.string().min(1).max(100),
        entityId: z.string().min(1).max(255),
        recommendationText: z.string().min(1),
        confidenceLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).default("LOW"),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.generateRecommendation({ ...input, status: "PENDING" }),
    ),

  listPending: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(z.object({ limit: z.number().int().positive().default(50) }))
    .query(({ input }) => svc.listPendingOutputs(input.limit)),

  acknowledge: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.acknowledgeRecommendation(input.id)),
});
