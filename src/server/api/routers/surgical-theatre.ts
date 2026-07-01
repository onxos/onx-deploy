/**
 * OCMBR Wave 2f — D09-S07 IU-API
 * Surgical Theatre tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/surgical-theatre.service";

export const surgicalTheatreRouter = createTRPCRouter({
  listCases: protectedProcedure
    .use(requirePermission("surgical:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listCases(input.branchId)),

  getCase: protectedProcedure
    .use(requirePermission("surgical:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getCaseById(input.id)),

  getTeamMembers: protectedProcedure
    .use(requirePermission("surgical:read"))
    .input(z.object({ caseId: z.number().int().positive() }))
    .query(({ input }) => svc.getTeamMembers(input.caseId)),

  createCase: protectedProcedure
    .use(requirePermission("surgical:write"))
    .input(
      z.object({
        surgicalCase: z.object({
          caseNumber: z.string().min(1),
          treatmentPlanId: z.number().int().positive().optional(),
          petId: z.number().int().positive(),
          clientId: z.number().int().positive(),
          branchId: z.number().int().positive(),
          surgeonId: z.string().optional(),
          theatreDate: z.string().length(10),
          scheduledStart: z.string().length(5).optional(),
          scheduledEnd: z.string().length(5).optional(),
          procedureName: z.string().min(1),
          procedureType: z
            .enum(["ELECTIVE", "EMERGENCY", "DAY_PROCEDURE"])
            .optional(),
          anaesthesiaType: z.string().optional(),
          notes: z.string().optional(),
        }),
        teamMembers: z
          .array(
            z.object({
              staffId: z.string().min(1),
              role: z.string().min(1),
            }),
          )
          .default([]),
      }),
    )
    .mutation(({ input }) =>
      svc.createCase(input.surgicalCase, input.teamMembers),
    ),

  startCase: protectedProcedure
    .use(requirePermission("surgical:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.startCase(input.id)),

  completeCase: protectedProcedure
    .use(requirePermission("surgical:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        postOpNotes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.completeCase(input.id, input.postOpNotes)),

  cancelCase: protectedProcedure
    .use(requirePermission("surgical:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.cancelCase(input.id)),
});
