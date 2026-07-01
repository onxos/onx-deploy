/**
 * OCMBR Wave 2d — D09-S04 IU-API
 * Treatment Plan tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/treatment-plan.service";

export const treatmentPlanRouter = createTRPCRouter({
  listPlans: protectedProcedure
    .use(requirePermission("treatment-plan:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listPlans(input.branchId)),

  getPlan: protectedProcedure
    .use(requirePermission("treatment-plan:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getPlanById(input.id)),

  getPlanItems: protectedProcedure
    .use(requirePermission("treatment-plan:read"))
    .input(z.object({ planId: z.number().int().positive() }))
    .query(({ input }) => svc.getPlanItems(input.planId)),

  createPlan: protectedProcedure
    .use(requirePermission("treatment-plan:write"))
    .input(
      z.object({
        plan: z.object({
          planNumber: z.string().min(1),
          soapNoteId: z.number().int().positive().optional(),
          petId: z.number().int().positive(),
          clientId: z.number().int().positive(),
          branchId: z.number().int().positive(),
          vetId: z.string().optional(),
          startDate: z.string().length(10),
          endDate: z.string().length(10).optional(),
          diagnosis: z.string().min(1),
          treatmentGoal: z.string().optional(),
          totalEstimatedCost: z
            .number()
            .nonnegative()
            .transform((v) => String(v))
            .optional(),
          notes: z.string().optional(),
        }),
        items: z
          .array(
            z.object({
              sequence: z.number().int().positive().optional(),
              description: z.string().min(1),
              scheduledDate: z.string().length(10).optional(),
              estimatedCost: z
                .number()
                .nonnegative()
                .transform((v) => String(v))
                .optional(),
              notes: z.string().optional(),
            }),
          )
          .default([]),
      }),
    )
    .mutation(({ input }) => svc.createPlan(input.plan, input.items)),

  completePlan: protectedProcedure
    .use(requirePermission("treatment-plan:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.completePlan(input.id)),

  cancelPlan: protectedProcedure
    .use(requirePermission("treatment-plan:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.cancelPlan(input.id)),
});
