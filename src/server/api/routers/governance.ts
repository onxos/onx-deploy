import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/governance.service";

const numStr = z.number().transform((v) => String(v));

export const governanceRouter = createTRPCRouter({
  // D01-S05 OKR
  listObjectives: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ period: z.string().optional() }))
    .query(({ input }) => svc.listObjectives(input.period)),
  createObjective: protectedProcedure
    .use(requirePermission("admin:write"))
    .input(
      z.object({
        title: z.string().min(1).max(200),
        description: z.string().optional(),
        objectiveType: z.enum(["OKR", "KPI", "STRATEGIC"]).default("OKR"),
        owner: z.string().min(1),
        period: z.string().min(1),
        targetValue: numStr.optional(),
        unit: z.string().optional(),
        status: z
          .enum(["ON_TRACK", "AT_RISK", "BEHIND", "COMPLETE"])
          .default("ON_TRACK"),
      }),
    )
    .mutation(({ input }) => svc.createObjective(input)),
  updateObjectiveProgress: protectedProcedure
    .use(requirePermission("admin:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        currentValue: numStr,
        progress: numStr,
        status: z.enum(["ON_TRACK", "AT_RISK", "BEHIND", "COMPLETE"]),
      }),
    )
    .mutation(({ input }) =>
      svc.updateObjectiveProgress(
        input.id,
        input.currentValue,
        input.progress,
        input.status,
      ),
    ),

  // D01-S06 Escalation
  listEscalations: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ status: z.string().optional() }))
    .query(({ input }) => svc.listEscalations(input.status)),
  createEscalation: protectedProcedure
    .use(requirePermission("admin:write"))
    .input(
      z.object({
        subject: z.string().min(1).max(200),
        description: z.string().min(1),
        raisedBy: z.string().min(1),
        assignedTo: z.string().optional(),
        priority: z
          .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
          .default("MEDIUM"),
        category: z.string().max(100).default("OPERATIONAL"),
        dueAt: z.string().datetime().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createEscalation({
        ...input,
        status: "OPEN",
        dueAt: input.dueAt ? new Date(input.dueAt) : undefined,
      }),
    ),
  resolveEscalation: protectedProcedure
    .use(requirePermission("admin:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        resolution: z.string().min(1),
      }),
    )
    .mutation(({ input }) => svc.resolveEscalation(input.id, input.resolution)),

  // D01-S07 Founder Seal
  listSeals: protectedProcedure
    .use(requirePermission("admin:read"))
    .input(z.object({ documentType: z.string().optional() }))
    .query(({ input }) => svc.listSeals(input.documentType)),
  createSeal: protectedProcedure
    .use(requirePermission("admin:write"))
    .input(
      z.object({
        documentType: z.string().min(1).max(100),
        documentRef: z.string().min(1),
        documentTitle: z.string().min(1),
        sealedBy: z.string().min(1),
        sealedAt: z.string().datetime(),
        sealHash: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createSeal({
        ...input,
        sealedAt: new Date(input.sealedAt),
        status: "SEALED",
      }),
    ),

  // D02-S08 Disciplinary
  listDisciplinaryCases: protectedProcedure
    .use(requirePermission("hr:read"))
    .input(z.object({ employeeId: z.string().optional() }))
    .query(({ input }) => svc.listDisciplinaryCases(input.employeeId)),
  createDisciplinaryCase: protectedProcedure
    .use(requirePermission("hr:write"))
    .input(
      z.object({
        caseNo: z.string().min(1).max(50),
        employeeId: z.string().min(1),
        caseType: z.enum(["DISCIPLINARY", "GRIEVANCE"]).default("DISCIPLINARY"),
        severity: z
          .enum(["MINOR", "MODERATE", "SERIOUS", "GROSS_MISCONDUCT"])
          .default("MINOR"),
        description: z.string().min(1),
        raisedBy: z.string().min(1),
        investigatorId: z.string().optional(),
        hearingDate: z.string().datetime().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.createDisciplinaryCase({
        ...input,
        status: "OPEN",
        hearingDate: input.hearingDate
          ? new Date(input.hearingDate)
          : undefined,
      }),
    ),
  resolveDisciplinaryCase: protectedProcedure
    .use(requirePermission("hr:write"))
    .input(
      z.object({ id: z.number().int().positive(), outcome: z.string().min(1) }),
    )
    .mutation(({ input }) =>
      svc.resolveDisciplinaryCase(input.id, input.outcome),
    ),

  // D02-S09 ESS
  listEssRequests: protectedProcedure
    .use(requirePermission("hr:read"))
    .input(z.object({ employeeId: z.string().optional() }))
    .query(({ input }) => svc.listEssRequests(input.employeeId)),
  createEssRequest: protectedProcedure
    .use(requirePermission("hr:read"))
    .input(
      z.object({
        employeeId: z.string().min(1),
        requestType: z.string().min(1).max(100),
        requestData: z.record(z.string(), z.unknown()),
      }),
    )
    .mutation(({ input }) =>
      svc.createEssRequest({ ...input, status: "PENDING" }),
    ),
  processEssRequest: protectedProcedure
    .use(requirePermission("hr:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["APPROVED", "REJECTED"]),
        approvedBy: z.string().optional(),
        rejectionReason: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      svc.processEssRequest(
        input.id,
        input.status,
        input.approvedBy,
        input.rejectionReason,
      ),
    ),
});
