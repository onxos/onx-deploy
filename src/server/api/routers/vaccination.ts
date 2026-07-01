/**
 * OCMBR Wave 2 — D09-S05 IU-API (Router)
 * Vaccination Record & Reminders tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/vaccination.service";

export const vaccinationRouter = createTRPCRouter({
  listVaccinations: protectedProcedure
    .use(requirePermission("vaccination:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        petId: z.number().int().positive().optional(),
        status: z.string().optional(),
      }),
    )
    .query(({ input }) =>
      svc.listVaccinations(input.branchId, {
        petId: input.petId,
        status: input.status,
      }),
    ),

  getVaccination: protectedProcedure
    .use(requirePermission("vaccination:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getVaccinationById(input.id)),

  recordVaccination: protectedProcedure
    .use(requirePermission("vaccination:write"))
    .input(
      z.object({
        petId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        vaccineName: z.string().min(1).max(150),
        vaccineType: z
          .enum(["CORE", "NON_CORE", "REQUIRED", "LIFESTYLE"])
          .default("CORE"),
        batchNumber: z.string().max(50).optional(),
        administeredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        expiryDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        nextDueDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        administeredBy: z.string().optional(),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(({ input }) => svc.recordVaccination(input)),

  updateVaccination: protectedProcedure
    .use(requirePermission("vaccination:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z
          .enum(["CURRENT", "DUE_SOON", "OVERDUE", "EXPIRED"])
          .optional(),
        nextDueDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...rest } = input;
      return svc.updateVaccination(id, rest);
    }),

  listOverdue: protectedProcedure
    .use(requirePermission("vaccination:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listOverdueVaccinations(input.branchId)),
});
