/**
 * OCMBR Wave 2d — D09-S06 IU-API
 * Prescription tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/prescription.service";

export const prescriptionRouter = createTRPCRouter({
  listPrescriptions: protectedProcedure
    .use(requirePermission("prescription:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listPrescriptions(input.branchId)),

  getPrescription: protectedProcedure
    .use(requirePermission("prescription:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getPrescriptionById(input.id)),

  getPrescriptionLines: protectedProcedure
    .use(requirePermission("prescription:read"))
    .input(z.object({ prescriptionId: z.number().int().positive() }))
    .query(({ input }) => svc.getPrescriptionLines(input.prescriptionId)),

  createPrescription: protectedProcedure
    .use(requirePermission("prescription:write"))
    .input(
      z.object({
        prescription: z.object({
          prescriptionNumber: z.string().min(1),
          treatmentPlanId: z.number().int().positive().optional(),
          petId: z.number().int().positive(),
          clientId: z.number().int().positive(),
          branchId: z.number().int().positive(),
          prescribedBy: z.string().optional(),
          prescriptionDate: z.string().length(10),
          validUntil: z.string().length(10).optional(),
          notes: z.string().optional(),
        }),
        lines: z
          .array(
            z.object({
              itemId: z.number().int().positive(),
              batchId: z.number().int().positive().optional(),
              quantity: z
                .number()
                .positive()
                .transform((v) => String(v)),
              unitOfMeasure: z.string().optional(),
              dosage: z.string().optional(),
              frequency: z.string().optional(),
              duration: z.string().optional(),
              instructions: z.string().optional(),
            }),
          )
          .min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.createPrescription(input.prescription, input.lines),
    ),

  dispensePrescription: protectedProcedure
    .use(requirePermission("prescription:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        dispensedBy: z.string().min(1),
      }),
    )
    .mutation(({ input }) =>
      svc.dispensePrescription(input.id, input.dispensedBy),
    ),

  cancelPrescription: protectedProcedure
    .use(requirePermission("prescription:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.cancelPrescription(input.id)),
});
