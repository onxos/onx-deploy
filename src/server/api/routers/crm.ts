/**
 * OCMBR Wave 1 — D07-S01 API Layer
 * CRM Router: Pet Owner (Client) + Pet management
 * IU-ID: D07-S01-IU-API
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/crm.service";

export const crmRouter = createTRPCRouter({
  // ── Clients ────────────────────────────────────────────────────────────────
  listClients: protectedProcedure
    .use(requirePermission("crm:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        search: z.string().optional(),
        activeOnly: z.boolean().default(true),
        limit: z.number().int().max(500).default(100),
      }),
    )
    .query(({ input }) => svc.listClients(input.branchId, input)),

  getClient: protectedProcedure
    .use(requirePermission("crm:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getClientById(input.id)),

  createClient: protectedProcedure
    .use(requirePermission("crm:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        tenantId: z.number().int().positive().optional(),
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
        phone: z.string().min(1).max(30),
        email: z.string().email().optional(),
        gender: z.enum(["M", "F", "OTHER"]).optional(),
        address: z.string().optional(),
        city: z.string().max(100).optional(),
        country: z.string().length(2).default("SA"),
        notes: z.string().optional(),
        referredById: z.number().int().positive().optional(),
      }),
    )
    .mutation(({ input }) => svc.createClient(input)),

  updateClient: protectedProcedure
    .use(requirePermission("crm:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        firstName: z.string().min(1).max(100).optional(),
        lastName: z.string().min(1).max(100).optional(),
        phone: z.string().max(30).optional(),
        email: z.string().email().nullable().optional(),
        address: z.string().nullable().optional(),
        city: z.string().max(100).nullable().optional(),
        notes: z.string().nullable().optional(),
        loyaltyTier: z
          .enum(["STANDARD", "SILVER", "GOLD", "PLATINUM"])
          .optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(({ input: { id, ...rest } }) => svc.updateClient(id, rest)),

  deactivateClient: protectedProcedure
    .use(requirePermission("crm:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.deactivateClient(input.id)),

  // ── Pets ───────────────────────────────────────────────────────────────────
  listPets: protectedProcedure
    .use(requirePermission("crm:read"))
    .input(
      z.object({
        clientId: z.number().int().positive().optional(),
        branchId: z.number().int().positive().optional(),
        activeOnly: z.boolean().default(true),
      }),
    )
    .query(({ input }) => svc.listPets(input)),

  getPet: protectedProcedure
    .use(requirePermission("crm:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getPetById(input.id)),

  createPet: protectedProcedure
    .use(requirePermission("crm:write"))
    .input(
      z.object({
        clientId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        name: z.string().min(1).max(100),
        species: z.string().min(1).max(50),
        breed: z.string().max(100).optional(),
        color: z.string().max(100).optional(),
        gender: z.enum(["M", "F", "UNKNOWN"]).optional(),
        dateOfBirth: z.string().optional(),
        microchipNumber: z.string().max(50).optional(),
        isNeutered: z.boolean().default(false),
        weightKg: z
          .number()
          .positive()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createPet(input)),

  updatePet: protectedProcedure
    .use(requirePermission("crm:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(100).optional(),
        breed: z.string().max(100).nullable().optional(),
        weightKg: z
          .number()
          .positive()
          .nullable()
          .optional()
          .transform((v) => (v !== undefined && v !== null ? String(v) : v)),
        isNeutered: z.boolean().optional(),
        isActive: z.boolean().optional(),
        notes: z.string().nullable().optional(),
      }),
    )
    .mutation(({ input: { id, ...rest } }) => svc.updatePet(id, rest)),
});
