/**
 * OCMBR Wave 5 — D11-S04 IU-API
 * Field Visit Record tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/field-visit.service";

export const fieldVisitRouter = createTRPCRouter({
  listByPet: protectedProcedure
    .use(requirePermission("field-visit:read"))
    .input(z.object({ petId: z.number().int().positive() }))
    .query(({ input }) => svc.listFieldVisitsByPet(input.petId)),

  listByBranch: protectedProcedure
    .use(requirePermission("field-visit:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listFieldVisitsByBranch(input.branchId)),

  getById: protectedProcedure
    .use(requirePermission("field-visit:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getFieldVisitById(input.id)),

  create: protectedProcedure
    .use(requirePermission("field-visit:write"))
    .input(
      z.object({
        visitCode: z.string().min(1),
        mobileClinicStopId: z.number().int().positive().optional(),
        petId: z.number().int().positive(),
        clientId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        veterinarianId: z.string().optional(),
        visitDate: z.string().length(10),
        visitLocation: z.string().optional(),
        chiefComplaint: z.string().optional(),
        clinicalFindings: z.string().optional(),
        treatmentProvided: z.string().optional(),
        followUpRequired: z.enum(["YES", "NO"]).default("NO"),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createFieldVisit(input)),

  updateStatus: protectedProcedure
    .use(requirePermission("field-visit:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.updateFieldVisitStatus(input.id, input.status),
    ),
});
