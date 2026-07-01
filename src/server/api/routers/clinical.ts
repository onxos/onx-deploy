/**
 * OCMBR Wave 1 — D09-S01 API Layer
 * Clinical Router: Patient Visit & Registration
 * IU-ID: D09-S01-IU-API
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/clinical.service";

export const clinicalRouter = createTRPCRouter({
  listVisits: protectedProcedure
    .use(requirePermission("clinical:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        status: z.string().optional(),
        petId: z.number().int().positive().optional(),
        limit: z.number().int().max(500).default(50),
      }),
    )
    .query(({ input }) => svc.listVisits(input.branchId, input)),

  getVisit: protectedProcedure
    .use(requirePermission("clinical:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getVisitById(input.id)),

  registerVisit: protectedProcedure
    .use(requirePermission("clinical:write"))
    .input(
      z.object({
        petId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        visitType: z
          .enum([
            "OUTPATIENT",
            "INPATIENT",
            "EMERGENCY",
            "TELEMEDICINE",
            "MOBILE",
          ])
          .default("OUTPATIENT"),
        status: z
          .enum([
            "PENDING",
            "CHECKED_IN",
            "IN_CONSULTATION",
            "COMPLETED",
            "CANCELLED",
            "NO_SHOW",
          ])
          .default("PENDING"),
        scheduledAt: z.date().optional(),
        assignedVetId: z.string().optional(),
        chiefComplaint: z.string().optional(),
        notes: z.string().optional(),
        weightKg: z
          .number()
          .positive()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
      }),
    )
    .mutation(({ input }) => svc.registerVisit(input)),

  updateVisitStatus: protectedProcedure
    .use(requirePermission("clinical:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum([
          "PENDING",
          "CHECKED_IN",
          "IN_CONSULTATION",
          "COMPLETED",
          "CANCELLED",
          "NO_SHOW",
        ]),
        assignedVetId: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.updateVisitStatus(input.id, input.status, {
        assignedVetId: input.assignedVetId,
        checkInAt: input.status === "CHECKED_IN" ? new Date() : undefined,
        checkOutAt: input.status === "COMPLETED" ? new Date() : undefined,
      }),
    ),

  updateVisit: protectedProcedure
    .use(requirePermission("clinical:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        chiefComplaint: z.string().nullable().optional(),
        notes: z.string().nullable().optional(),
        weightKg: z
          .number()
          .positive()
          .nullable()
          .optional()
          .transform((v) => (v !== undefined && v !== null ? String(v) : v)),
        scheduledAt: z.date().nullable().optional(),
      }),
    )
    .mutation(({ input: { id, ...rest } }) => svc.updateVisit(id, rest)),
});
