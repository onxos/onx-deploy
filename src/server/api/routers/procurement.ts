/**
 * OCMBR Wave 1 — D04-S01 API Layer
 * Procurement Router: Vendor Master & Qualification
 * IU-ID: D04-S01-IU-API
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/procurement.service";

export const procurementRouter = createTRPCRouter({
  listVendors: protectedProcedure
    .use(requirePermission("procurement:read"))
    .input(
      z.object({
        search: z.string().optional(),
        status: z.string().optional(),
        qualificationStatus: z.string().optional(),
        vendorType: z.string().optional(),
        branchId: z.number().int().positive().optional(),
        limit: z.number().int().max(500).default(100),
      }),
    )
    .query(({ input }) => svc.listVendors(input)),

  getVendor: protectedProcedure
    .use(requirePermission("procurement:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getVendorById(input.id)),

  createVendor: protectedProcedure
    .use(requirePermission("procurement:write"))
    .input(
      z.object({
        code: z.string().min(2).max(30),
        name: z.string().min(1).max(200),
        vendorType: z
          .enum(["SUPPLIER", "SERVICE_PROVIDER", "DISTRIBUTOR"])
          .default("SUPPLIER"),
        phone: z.string().max(30).optional(),
        email: z.string().email().optional(),
        contactName: z.string().max(150).optional(),
        address: z.string().optional(),
        city: z.string().max(100).optional(),
        country: z.string().length(2).default("SA"),
        paymentTermsDays: z.number().int().nonnegative().default(30),
        creditLimit: z
          .number()
          .nonnegative()
          .default(0)
          .transform((v) => String(v)),
        taxNumber: z.string().max(50).optional(),
        branchId: z.number().int().positive().optional(),
      }),
    )
    .mutation(({ input }) => svc.createVendor(input)),

  updateVendor: protectedProcedure
    .use(requirePermission("procurement:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(200).optional(),
        phone: z.string().max(30).nullable().optional(),
        email: z.string().email().nullable().optional(),
        contactName: z.string().max(150).nullable().optional(),
        status: z.enum(["ACTIVE", "INACTIVE", "BLACKLISTED"]).optional(),
        paymentTermsDays: z.number().int().nonnegative().optional(),
        creditLimit: z
          .number()
          .nonnegative()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
      }),
    )
    .mutation(({ input: { id, ...rest } }) => svc.updateVendor(id, rest)),

  qualifyVendor: protectedProcedure
    .use(requirePermission("procurement:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["APPROVED", "REJECTED"]),
      }),
    )
    .mutation(({ input }) => svc.qualifyVendor(input.id, input.status)),
});
