/**
 * OCMBR Wave 8 — D13-S04 IU-API
 * Staff Development Plan tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/development-plan.service";

export const developmentPlanRouter = createTRPCRouter({
  listByStaff: protectedProcedure
    .use(requirePermission("appraisal:read"))
    .input(z.object({ staffId: z.string().min(1) }))
    .query(({ input }) => svc.listPlansByStaff(input.staffId)),

  create: protectedProcedure
    .use(requirePermission("appraisal:write"))
    .input(
      z.object({
        staffId: z.string().min(1),
        managerId: z.string().optional(),
        planYear: z.string().min(4).max(10),
        goals: z.string().min(1),
        developmentAreas: z.string().optional(),
        targetCompletionDate: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createPlan(input)),

  updateStatus: protectedProcedure
    .use(requirePermission("appraisal:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"]),
      }),
    )
    .mutation(({ input }) => svc.updatePlanStatus(input.id, input.status)),

  addReviewNotes: protectedProcedure
    .use(requirePermission("appraisal:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        reviewNotes: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.addReviewNotes(input.id, input.reviewNotes)),
});
