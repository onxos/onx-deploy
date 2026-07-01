/**
 * OCMBR Wave 5 — D11-S05 IU-API
 * Emergency Case Intake & Triage tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/emergency-case.service";

export const emergencyCaseRouter = createTRPCRouter({
  listByBranch: protectedProcedure
    .use(requirePermission("emergency:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listEmergencyCasesByBranch(input.branchId)),

  getById: protectedProcedure
    .use(requirePermission("emergency:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getEmergencyCaseById(input.id)),

  create: protectedProcedure
    .use(requirePermission("emergency:write"))
    .input(
      z.object({
        caseNumber: z.string().min(1),
        petId: z.number().int().positive().optional(),
        clientId: z.number().int().positive().optional(),
        branchId: z.number().int().positive(),
        triageLevel: z.enum([
          "CRITICAL",
          "URGENT",
          "SEMI_URGENT",
          "NON_URGENT",
          "DECEASED_ON_ARRIVAL",
        ]),
        presentingProblem: z.string().min(1),
        arrivalMode: z
          .enum(["WALK_IN", "AMBULANCE", "OWNER_VEHICLE", "REFERRAL"])
          .optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createEmergencyCase(input)),

  completeTriage: protectedProcedure
    .use(requirePermission("emergency:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        triageById: z.string().min(1),
        assignedVetId: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.completeTriage(input.id, input.triageById, input.assignedVetId),
    ),

  discharge: protectedProcedure
    .use(requirePermission("emergency:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        disposition: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.dischargeEmergencyCase(input.id, input.disposition),
    ),
});
