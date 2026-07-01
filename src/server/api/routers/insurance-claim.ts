/**
 * OCMBR Wave 2c — D06-S04 IU-API (Router)
 * Insurance Claim tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/insurance-claim.service";

export const insuranceClaimRouter = createTRPCRouter({
  listClaims: protectedProcedure
    .use(requirePermission("claim:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        policyId: z.number().int().positive().optional(),
        petId: z.number().int().positive().optional(),
        status: z.string().optional(),
      }),
    )
    .query(({ input }) =>
      svc.listClaims(input.branchId, {
        policyId: input.policyId,
        petId: input.petId,
        status: input.status,
      }),
    ),

  getClaim: protectedProcedure
    .use(requirePermission("claim:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getClaimById(input.id)),

  createClaim: protectedProcedure
    .use(requirePermission("claim:write"))
    .input(
      z.object({
        claimNumber: z.string().min(1).max(50),
        policyId: z.number().int().positive(),
        petId: z.number().int().positive(),
        clientId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        soapNoteId: z.number().int().positive().optional(),
        claimDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        diagnosis: z.string().max(2000).optional(),
        treatmentDescription: z.string().max(5000).optional(),
        totalBilled: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(({ input }) => svc.createClaim(input)),

  reviewClaim: protectedProcedure
    .use(requirePermission("claim:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["APPROVED", "REJECTED"]),
        approvedAmount: z
          .number()
          .nonnegative()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
      }),
    )
    .mutation(({ input, ctx }) =>
      svc.reviewClaim(
        input.id,
        input.status,
        ctx.user.id,
        input.approvedAmount,
      ),
    ),

  updateStatus: protectedProcedure
    .use(requirePermission("claim:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["UNDER_REVIEW", "PARTIALLY_PAID", "PAID", "WITHDRAWN"]),
        paidAmount: z
          .number()
          .nonnegative()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
      }),
    )
    .mutation(({ input }) =>
      svc.updateClaimStatus(input.id, input.status, input.paidAmount),
    ),
});
