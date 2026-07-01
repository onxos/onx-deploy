/**
 * OCMBR Wave 3 — D09-S11 IU-API
 * Consent Forms & Legal Documents tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/consent-form.service";

export const consentFormRouter = createTRPCRouter({
  listByPet: protectedProcedure
    .use(requirePermission("consent:read"))
    .input(z.object({ petId: z.number().int().positive() }))
    .query(({ input }) => svc.listConsentFormsByPet(input.petId)),

  listByBranch: protectedProcedure
    .use(requirePermission("consent:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listConsentFormsByBranch(input.branchId)),

  getById: protectedProcedure
    .use(requirePermission("consent:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getConsentFormById(input.id)),

  create: protectedProcedure
    .use(requirePermission("consent:write"))
    .input(
      z.object({
        formNumber: z.string().min(1),
        petId: z.number().int().positive(),
        clientId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        formType: z.enum([
          "SURGERY",
          "TREATMENT",
          "VACCINATION",
          "ANAESTHESIA",
          "REFERRAL",
          "GENERAL",
        ]),
        status: z
          .enum(["PENDING", "SIGNED", "DECLINED", "REVOKED"])
          .default("PENDING"),
        consentText: z.string().optional(),
        documentUrl: z.string().optional(),
        notes: z.string().optional(),
        createdById: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createConsentForm(input)),

  sign: protectedProcedure
    .use(requirePermission("consent:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        signedByOwnerId: z.number().int().positive().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.signConsentForm(input.id, input.signedByOwnerId),
    ),

  revoke: protectedProcedure
    .use(requirePermission("consent:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.revokeConsentForm(input.id)),
});
