/**
 * OCMBR Wave 2f — D09-S09 IU-API
 * Referral Management tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/referral.service";

export const referralRouter = createTRPCRouter({
  listReferrals: protectedProcedure
    .use(requirePermission("referral:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listReferrals(input.branchId)),

  getReferral: protectedProcedure
    .use(requirePermission("referral:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getReferralById(input.id)),

  createReferral: protectedProcedure
    .use(requirePermission("referral:write"))
    .input(
      z.object({
        referralNumber: z.string().min(1),
        petId: z.number().int().positive(),
        clientId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        referringVetId: z.string().optional(),
        referralType: z.enum(["OUTWARD", "INWARD"]).optional(),
        referralDate: z.string().length(10),
        specialistName: z.string().optional(),
        specialistClinic: z.string().optional(),
        speciality: z.string().optional(),
        reason: z.string().min(1),
        urgency: z.enum(["ROUTINE", "URGENT", "EMERGENCY"]).optional(),
        appointmentDate: z.string().length(10).optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createReferral(input)),

  updateReferralStatus: protectedProcedure
    .use(requirePermission("referral:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.string().min(1),
        outcomeNotes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.updateReferralStatus(input.id, input.status, input.outcomeNotes),
    ),

  cancelReferral: protectedProcedure
    .use(requirePermission("referral:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.cancelReferral(input.id)),
});
