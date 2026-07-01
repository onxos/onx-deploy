/**
 * OCMBR Wave 2e — D02-S02 IU-API
 * Recruitment & Onboarding tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/recruitment.service";

export const recruitmentRouter = createTRPCRouter({
  listPostings: protectedProcedure
    .use(requirePermission("recruitment:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listPostings(input.branchId)),

  getPosting: protectedProcedure
    .use(requirePermission("recruitment:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getPostingById(input.id)),

  createPosting: protectedProcedure
    .use(requirePermission("recruitment:write"))
    .input(
      z.object({
        postingNumber: z.string().min(1),
        branchId: z.number().int().positive(),
        departmentId: z.number().int().positive().optional(),
        title: z.string().min(1),
        jobDescription: z.string().optional(),
        requirements: z.string().optional(),
        vacancyCount: z.number().int().positive().optional(),
        closingDate: z.string().length(10).optional(),
        postedBy: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createPosting(input)),

  closePosting: protectedProcedure
    .use(requirePermission("recruitment:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.closePosting(input.id)),

  listApplications: protectedProcedure
    .use(requirePermission("recruitment:read"))
    .input(z.object({ postingId: z.number().int().positive() }))
    .query(({ input }) => svc.listApplications(input.postingId)),

  createApplication: protectedProcedure
    .use(requirePermission("recruitment:write"))
    .input(
      z.object({
        applicationNumber: z.string().min(1),
        postingId: z.number().int().positive(),
        candidateName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        resumeUrl: z.string().optional(),
        coverLetter: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createApplication(input)),

  updateApplicationStatus: protectedProcedure
    .use(requirePermission("recruitment:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.string().min(1),
        notes: z.string().optional().default(""),
      }),
    )
    .mutation(({ input }) =>
      svc.updateApplicationStatus(input.id, input.status, input.notes),
    ),

  listOnboardingTasks: protectedProcedure
    .use(requirePermission("recruitment:read"))
    .input(z.object({ employeeId: z.number().int().positive() }))
    .query(({ input }) => svc.listOnboardingTasks(input.employeeId)),

  createOnboardingTask: protectedProcedure
    .use(requirePermission("recruitment:write"))
    .input(
      z.object({
        employeeId: z.number().int().positive(),
        taskName: z.string().min(1),
        description: z.string().optional(),
        dueDate: z.string().length(10).optional(),
        assignedTo: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createOnboardingTask(input)),

  completeOnboardingTask: protectedProcedure
    .use(requirePermission("recruitment:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.completeOnboardingTask(input.id)),
});
