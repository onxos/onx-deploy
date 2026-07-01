/**
 * OCMBR Wave 1 — D06-S01 API Layer
 * Insurance Router: Insurance Company Master
 * IU-ID: D06-S01-IU-API
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/insurance.service";

export const insuranceRouter = createTRPCRouter({
  listCompanies: protectedProcedure
    .use(requirePermission("insurance:read"))
    .input(
      z.object({
        status: z.string().optional(),
        branchId: z.number().int().positive().optional(),
        search: z.string().optional(),
      }),
    )
    .query(({ input }) => svc.listInsuranceCompanies(input)),

  getCompany: protectedProcedure
    .use(requirePermission("insurance:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getInsuranceCompanyById(input.id)),

  createCompany: protectedProcedure
    .use(requirePermission("insurance:write"))
    .input(
      z.object({
        code: z.string().min(2).max(30),
        name: z.string().min(1).max(200),
        licenseNumber: z.string().max(80).optional(),
        contactName: z.string().max(150).optional(),
        phone: z.string().max(30).optional(),
        email: z.string().email().optional(),
        portalUrl: z.string().url().optional(),
        submissionEmail: z.string().email().optional(),
        contractStartDate: z.string().optional(),
        contractEndDate: z.string().optional(),
        creditDays: z.number().int().nonnegative().default(30),
        branchId: z.number().int().positive().optional(),
      }),
    )
    .mutation(({ input }) => svc.createInsuranceCompany(input)),

  updateCompany: protectedProcedure
    .use(requirePermission("insurance:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(200).optional(),
        status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
        contactName: z.string().max(150).nullable().optional(),
        phone: z.string().max(30).nullable().optional(),
        email: z.string().email().nullable().optional(),
        portalUrl: z.string().url().nullable().optional(),
        contractEndDate: z.string().nullable().optional(),
        creditDays: z.number().int().nonnegative().optional(),
      }),
    )
    .mutation(({ input: { id, ...rest } }) =>
      svc.updateInsuranceCompany(id, rest),
    ),
});
