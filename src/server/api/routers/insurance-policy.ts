/**
 * OCMBR Wave 2 — D06-S02 IU-API (Router)
 * Insurance Policy & Coverage Register tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/insurance-policy.service";

export const insurancePolicyRouter = createTRPCRouter({
  listPolicies: protectedProcedure
    .use(requirePermission("insurance:read"))
    .input(
      z
        .object({
          branchId: z.number().int().positive().optional(),
          clientId: z.number().int().positive().optional(),
          petId: z.number().int().positive().optional(),
          status: z.string().optional(),
        })
        .optional(),
    )
    .query(({ input }) =>
      svc.listInsurancePolicies({
        branchId: input?.branchId,
        clientId: input?.clientId,
        petId: input?.petId,
        status: input?.status,
      }),
    ),

  getPolicy: protectedProcedure
    .use(requirePermission("insurance:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getInsurancePolicyById(input.id)),

  createPolicy: protectedProcedure
    .use(requirePermission("insurance:write"))
    .input(
      z.object({
        policyNumber: z.string().min(1).max(100),
        insuranceCompanyId: z.number().int().positive(),
        clientId: z.number().int().positive(),
        petId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        planName: z.string().max(200).optional(),
        coverageType: z
          .enum(["COMPREHENSIVE", "BASIC", "EMERGENCY", "WELLNESS"])
          .default("BASIC"),
        annualLimit: z
          .number()
          .positive()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        deductibleAmount: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        copayPercentage: z
          .number()
          .min(0)
          .max(100)
          .default(0)
          .transform((v) => String(v)),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        premiumAmount: z
          .number()
          .positive()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        premiumFrequency: z
          .enum(["MONTHLY", "QUARTERLY", "ANNUAL"])
          .default("MONTHLY"),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(({ input }) => svc.createInsurancePolicy(input)),

  updatePolicy: protectedProcedure
    .use(requirePermission("insurance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        planName: z.string().max(200).optional(),
        status: z.string().optional(),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...rest } = input;
      return svc.updateInsurancePolicy(id, rest);
    }),

  cancelPolicy: protectedProcedure
    .use(requirePermission("insurance:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.cancelInsurancePolicy(input.id)),
});
