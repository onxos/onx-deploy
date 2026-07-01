/**
 * OCMBR Wave 2b — D09-S03 IU-API (Router)
 * SOAP Consultation Note tRPC router
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/soap-note.service";

export const soapNoteRouter = createTRPCRouter({
  listNotes: protectedProcedure
    .use(requirePermission("soap-note:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        petId: z.number().int().positive().optional(),
        vetId: z.string().optional(),
        status: z.string().optional(),
      }),
    )
    .query(({ input }) =>
      svc.listSoapNotes(input.branchId, {
        petId: input.petId,
        vetId: input.vetId,
        status: input.status,
      }),
    ),

  getNote: protectedProcedure
    .use(requirePermission("soap-note:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getSoapNoteById(input.id)),

  createNote: protectedProcedure
    .use(requirePermission("soap-note:write"))
    .input(
      z.object({
        noteNumber: z.string().min(1).max(50),
        appointmentId: z.number().int().positive().optional(),
        visitId: z.number().int().positive().optional(),
        petId: z.number().int().positive(),
        clientId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        attendingVetId: z.string().optional(),
        consultationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        subjective: z.string().max(5000).optional(),
        objective: z.string().max(5000).optional(),
        assessment: z.string().max(5000).optional(),
        plan: z.string().max(5000).optional(),
        weightKg: z
          .number()
          .positive()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        temperatureCelsius: z
          .number()
          .positive()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        heartRate: z.number().int().positive().optional(),
        respiratoryRate: z.number().int().positive().optional(),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(({ input }) => svc.createSoapNote(input)),

  updateNote: protectedProcedure
    .use(requirePermission("soap-note:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        subjective: z.string().max(5000).optional(),
        objective: z.string().max(5000).optional(),
        assessment: z.string().max(5000).optional(),
        plan: z.string().max(5000).optional(),
        weightKg: z
          .number()
          .positive()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        temperatureCelsius: z
          .number()
          .positive()
          .optional()
          .transform((v) => (v !== undefined ? String(v) : undefined)),
        heartRate: z.number().int().positive().optional(),
        respiratoryRate: z.number().int().positive().optional(),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...rest } = input;
      return svc.updateSoapNote(id, rest);
    }),

  complete: protectedProcedure
    .use(requirePermission("soap-note:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.completeSoapNote(input.id)),

  sign: protectedProcedure
    .use(requirePermission("soap-note:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.signSoapNote(input.id)),
});
