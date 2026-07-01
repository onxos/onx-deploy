/**
 * OCMBR Wave 7 — D13-S01 IU-API
 * Continuing Education & Training Records tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/training.service";

export const trainingRouter = createTRPCRouter({
  listCourses: protectedProcedure
    .use(requirePermission("training:read"))
    .query(() => svc.listCourses()),

  createCourse: protectedProcedure
    .use(requirePermission("training:write"))
    .input(
      z.object({
        courseCode: z.string().min(1).max(50),
        title: z.string().min(1),
        provider: z.string().optional(),
        deliveryMode: z
          .enum(["IN_PERSON", "ONLINE", "BLENDED", "CONFERENCE"])
          .default("IN_PERSON"),
        cpdHours: z.number().int().min(0).default(0),
        category: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.createCourse(input)),

  listRecordsByStaff: protectedProcedure
    .use(requirePermission("training:read"))
    .input(z.object({ staffId: z.string().min(1) }))
    .query(({ input }) => svc.listRecordsByStaff(input.staffId)),

  listRecordsByCourse: protectedProcedure
    .use(requirePermission("training:read"))
    .input(z.object({ courseId: z.number().int().positive() }))
    .query(({ input }) => svc.listRecordsByCourse(input.courseId)),

  enroll: protectedProcedure
    .use(requirePermission("training:write"))
    .input(
      z.object({
        courseId: z.number().int().positive(),
        staffId: z.string().min(1),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.enrollStaff(input)),

  complete: protectedProcedure
    .use(requirePermission("training:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        completedDate: z.string().min(1),
        score: z.number().int().min(0).max(100).optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.completeTraining(input.id, input.completedDate, input.score),
    ),
});
