/**
 * OCMBR Wave 1 — D05-S01 API Layer
 * Inventory Router: Item Category + Item management
 * IU-ID: D05-S01-IU-API
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/inventory.service";

export const inventoryRouter = createTRPCRouter({
  // ── Categories ─────────────────────────────────────────────────────────────
  listCategories: protectedProcedure
    .use(requirePermission("inventory:read"))
    .input(z.object({ activeOnly: z.boolean().default(true) }))
    .query(({ input }) => svc.listItemCategories(input.activeOnly)),

  createCategory: protectedProcedure
    .use(requirePermission("inventory:write"))
    .input(
      z.object({
        code: z
          .string()
          .min(2)
          .max(30)
          .regex(/^[A-Z0-9_-]+$/),
        name: z.string().min(1).max(150),
        parentId: z.number().int().positive().optional(),
      }),
    )
    .mutation(({ input }) => svc.createItemCategory(input)),

  updateCategory: protectedProcedure
    .use(requirePermission("inventory:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(150).optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(({ input: { id, ...rest } }) => svc.updateItemCategory(id, rest)),

  // ── Items ──────────────────────────────────────────────────────────────────
  listItems: protectedProcedure
    .use(requirePermission("inventory:read"))
    .input(
      z.object({
        search: z.string().optional(),
        categoryId: z.number().int().positive().optional(),
        itemType: z.string().optional(),
        activeOnly: z.boolean().default(true),
        limit: z.number().int().max(500).default(100),
      }),
    )
    .query(({ input }) => svc.listItems(input)),

  getItem: protectedProcedure
    .use(requirePermission("inventory:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getItemById(input.id)),

  createItem: protectedProcedure
    .use(requirePermission("inventory:write"))
    .input(
      z.object({
        sku: z.string().min(1).max(60),
        name: z.string().min(1).max(200),
        barcode: z.string().max(60).optional(),
        categoryId: z.number().int().positive().optional(),
        itemType: z
          .enum(["PRODUCT", "SERVICE", "CONSUMABLE", "MEDICATION"])
          .default("PRODUCT"),
        unit: z
          .enum(["PIECE", "ML", "GM", "TABLET", "VIAL", "BOX", "OTHER"])
          .default("PIECE"),
        unitPrice: z
          .number()
          .nonnegative()
          .transform((v) => String(v)),
        taxRate: z
          .number()
          .min(0)
          .max(1)
          .default(0.15)
          .transform((v) => String(v)),
        requiresPrescription: z.boolean().default(false),
        description: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createItem(input)),

  updateItem: protectedProcedure
    .use(requirePermission("inventory:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(200).optional(),
        unitPrice: z
          .number()
          .nonnegative()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        taxRate: z
          .number()
          .min(0)
          .max(1)
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        isActive: z.boolean().optional(),
        description: z.string().nullable().optional(),
      }),
    )
    .mutation(({ input: { id, ...rest } }) => svc.updateItem(id, rest)),
});
