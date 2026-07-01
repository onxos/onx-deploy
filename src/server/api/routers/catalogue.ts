/**
 * OCMBR Wave 2e — D08-S02 IU-API
 * Service & Product Catalogue tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/catalogue.service";

export const catalogueRouter = createTRPCRouter({
  listCategories: protectedProcedure
    .use(requirePermission("catalogue:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listCategories(input.branchId)),

  createCategory: protectedProcedure
    .use(requirePermission("catalogue:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        name: z.string().min(1),
        description: z.string().optional(),
        parentCategoryId: z.number().int().positive().optional(),
        sortOrder: z.number().int().optional(),
      }),
    )
    .mutation(({ input }) => svc.createCategory(input)),

  listEntries: protectedProcedure
    .use(requirePermission("catalogue:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listEntries(input.branchId)),

  getEntry: protectedProcedure
    .use(requirePermission("catalogue:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getEntryById(input.id)),

  createEntry: protectedProcedure
    .use(requirePermission("catalogue:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        categoryId: z.number().int().positive().optional(),
        itemId: z.number().int().positive().optional(),
        sku: z.string().optional(),
        name: z.string().min(1),
        description: z.string().optional(),
        type: z.enum(["SERVICE", "PRODUCT", "BUNDLE"]).optional(),
        basePrice: z
          .number()
          .nonnegative()
          .transform((v) => String(v)),
        taxRate: z
          .number()
          .nonnegative()
          .transform((v) => String(v))
          .optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createEntry(input)),

  deactivateEntry: protectedProcedure
    .use(requirePermission("catalogue:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.deactivateEntry(input.id)),
});
