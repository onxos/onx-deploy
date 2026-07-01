/**
 * OCMBR Wave 2f — D09-S08 IU-API
 * Hospitalisation / In-patient tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/inpatient.service";

export const inpatientRouter = createTRPCRouter({
  listAdmissions: protectedProcedure
    .use(requirePermission("inpatient:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listAdmissions(input.branchId)),

  getAdmission: protectedProcedure
    .use(requirePermission("inpatient:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getAdmissionById(input.id)),

  createAdmission: protectedProcedure
    .use(requirePermission("inpatient:write"))
    .input(
      z.object({
        admissionNumber: z.string().min(1),
        petId: z.number().int().positive(),
        clientId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        visitId: z.number().int().positive().optional(),
        admittingVetId: z.string().optional(),
        admissionDate: z.string().length(10),
        admissionReason: z.string().min(1),
        wardLocation: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createAdmission(input)),

  dischargeAdmission: protectedProcedure
    .use(requirePermission("inpatient:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        dischargeDate: z.string().length(10),
        dischargeNotes: z.string().optional().default(""),
        dischargedBy: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.dischargeAdmission(
        input.id,
        input.dischargeDate,
        input.dischargeNotes,
        input.dischargedBy,
      ),
    ),

  getObservations: protectedProcedure
    .use(requirePermission("inpatient:read"))
    .input(z.object({ admissionId: z.number().int().positive() }))
    .query(({ input }) => svc.getObservations(input.admissionId)),

  addObservation: protectedProcedure
    .use(requirePermission("inpatient:write"))
    .input(
      z.object({
        admissionId: z.number().int().positive(),
        observationDate: z.string().length(10),
        observationTime: z.string().length(5).optional(),
        temperature: z.string().optional(),
        heartRate: z.string().optional(),
        respiratoryRate: z.string().optional(),
        bloodPressure: z.string().optional(),
        weight: z.string().optional(),
        generalCondition: z.string().optional(),
        recordedBy: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.addObservation(input)),
});
