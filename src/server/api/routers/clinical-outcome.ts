/**
 * OCMBR Wave 3 — D09-S10 IU-API
 * Clinical Outcome Tracking tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/clinical-outcome.service";

export const clinicalOutcomeRouter = createTRPCRouter({
  listByPet: protectedProcedure
    .use(requirePermission("clinical-outcome:read"))
    .input(z.object({ petId: z.number().int().positive() }))
    .query(({ input }) => svc.listOutcomesByPet(input.petId)),

  listByBranch: protectedProcedure
    .use(requirePermission("clinical-outcome:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listOutcomesByBranch(input.branchId)),

  getById: protectedProcedure
    .use(requirePermission("clinical-outcome:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getOutcomeById(input.id)),

  create: protectedProcedure
    .use(requirePermission("clinical-outcome:write"))
    .input(
      z.object({
        petId: z.number().int().positive(),
        clientId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        treatmentPlanId: z.number().int().positive().optional(),
        outcomeDate: z.string().length(10),
        status: z
          .enum([
            "RECOVERED",
            "IMPROVING",
            "STABLE",
            "DETERIORATED",
            "DECEASED",
            "REFERRED",
          ])
          .default("STABLE"),
        clinicalScore: z.number().int().min(0).max(10).optional(),
        ownerFeedback: z.string().optional(),
        clinicianNotes: z.string().optional(),
        followUpDate: z.string().length(10).optional(),
        followUpRequired: z.enum(["YES", "NO"]).default("NO"),
        recordedById: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createOutcome(input)),

  updateStatus: protectedProcedure
    .use(requirePermission("clinical-outcome:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.string().min(1),
        clinicianNotes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.updateOutcomeStatus(input.id, input.status, input.clinicianNotes),
    ),
});
