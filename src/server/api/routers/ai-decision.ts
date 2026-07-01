/**
 * OCMBR Wave 10 — D13-S04 IU-API
 * AI Decision Placeholder Endpoints tRPC router
 * Stub endpoints for future ONX Intelligence consumption (Atlas V6+)
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/ai-decision.service";

export const aiDecisionRouter = createTRPCRouter({
  submit: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        decisionType: z.string().min(1).max(150),
        domain: z.string().min(1).max(50),
        inputData: z.record(z.string(), z.unknown()),
        modelVersion: z.string().max(50).optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.submitDecisionRequest({ ...input, status: "PENDING" }),
    ),

  list: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(
      z.object({
        domain: z.string().optional(),
        limit: z.number().int().positive().default(50),
      }),
    )
    .query(({ input }) => svc.listDecisionRequests(input.domain, input.limit)),

  get: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getDecisionRequest(input.id)),

  resolve: protectedProcedure
    .use(requirePermission("intelligence:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        outputData: z.record(z.string(), z.unknown()),
        confidenceScore: z.string().max(20).optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.resolveDecisionRequest(
        input.id,
        input.outputData,
        input.confidenceScore,
        input.notes,
      ),
    ),

  listByType: protectedProcedure
    .use(requirePermission("intelligence:read"))
    .input(z.object({ decisionType: z.string().min(1) }))
    .query(({ input }) => svc.listByDecisionType(input.decisionType)),
});
