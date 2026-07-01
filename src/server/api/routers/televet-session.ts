/**
 * OCMBR Wave 4 — D11-S01 IU-API
 * TeleVet Booking & Video Session tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/televet-session.service";

export const telvetSessionRouter = createTRPCRouter({
  listByPet: protectedProcedure
    .use(requirePermission("televet:read"))
    .input(z.object({ petId: z.number().int().positive() }))
    .query(({ input }) => svc.listSessionsByPet(input.petId)),

  listByBranch: protectedProcedure
    .use(requirePermission("televet:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listSessionsByBranch(input.branchId)),

  getById: protectedProcedure
    .use(requirePermission("televet:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getSessionById(input.id)),

  create: protectedProcedure
    .use(requirePermission("televet:write"))
    .input(
      z.object({
        sessionCode: z.string().min(1),
        petId: z.number().int().positive(),
        clientId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        veterinarianId: z.string().optional(),
        scheduledAt: z.string().datetime(),
        durationMinutes: z.number().int().positive().default(30),
        sessionType: z.enum(["VIDEO", "PHONE", "CHAT"]).default("VIDEO"),
        sessionUrl: z.string().optional(),
        chiefComplaint: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createSession({
        ...input,
        scheduledAt: new Date(input.scheduledAt),
      }),
    ),

  updateStatus: protectedProcedure
    .use(requirePermission("televet:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.updateSessionStatus(input.id, input.status)),

  complete: protectedProcedure
    .use(requirePermission("televet:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        recordingUrl: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.completeSession(input.id, input.recordingUrl)),
});
