/**
 * OCMBR Wave 4 — D11-S02 IU-API
 * TeleVet Medical Record Integration tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/televet-medical-note.service";

export const telvetMedicalNoteRouter = createTRPCRouter({
  listBySession: protectedProcedure
    .use(requirePermission("televet:read"))
    .input(z.object({ sessionId: z.number().int().positive() }))
    .query(({ input }) => svc.listNotesBySession(input.sessionId)),

  listByPet: protectedProcedure
    .use(requirePermission("televet:read"))
    .input(z.object({ petId: z.number().int().positive() }))
    .query(({ input }) => svc.listNotesByPet(input.petId)),

  getById: protectedProcedure
    .use(requirePermission("televet:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getNoteById(input.id)),

  create: protectedProcedure
    .use(requirePermission("televet:write"))
    .input(
      z.object({
        sessionId: z.number().int().positive(),
        petId: z.number().int().positive(),
        subjective: z.string().optional(),
        objective: z.string().optional(),
        assessment: z.string().optional(),
        plan: z.string().optional(),
        prescriptions: z.string().optional(),
        followUpRecommendation: z.string().optional(),
        followUpDays: z.number().int().positive().optional(),
        referralRequired: z.enum(["YES", "NO"]).default("NO"),
        recordedById: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createMedicalNote(input)),

  update: protectedProcedure
    .use(requirePermission("televet:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        subjective: z.string().optional(),
        objective: z.string().optional(),
        assessment: z.string().optional(),
        plan: z.string().optional(),
        prescriptions: z.string().optional(),
        followUpRecommendation: z.string().optional(),
        followUpDays: z.number().int().positive().optional(),
        referralRequired: z.enum(["YES", "NO"]).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...updates } = input;
      return svc.updateMedicalNote(id, updates);
    }),
});
