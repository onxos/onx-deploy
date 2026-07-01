/**
 * OCMBR Wave 1 — D02-S01 API Layer
 * HR Router: Department + Employee management
 * IU-ID: D02-S01-IU-API
 */

import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/hr.service";

export const hrRouter = createTRPCRouter({
  // ── Departments ────────────────────────────────────────────────────────────
  listDepartments: protectedProcedure
    .use(requirePermission("hr:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        activeOnly: z.boolean().default(true),
      }),
    )
    .query(({ input }) =>
      svc.listDepartments(input.branchId, input.activeOnly),
    ),

  getDepartment: protectedProcedure
    .use(requirePermission("hr:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getDepartmentById(input.id)),

  createDepartment: protectedProcedure
    .use(requirePermission("hr:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        code: z
          .string()
          .min(2)
          .max(30)
          .regex(/^[A-Z0-9_-]+$/),
        name: z.string().min(1).max(150),
        parentId: z.number().int().positive().optional(),
      }),
    )
    .mutation(({ input }) => svc.createDepartment(input)),

  updateDepartment: protectedProcedure
    .use(requirePermission("hr:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(150).optional(),
        headEmployeeId: z.number().int().positive().nullable().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(({ input: { id, ...rest } }) => svc.updateDepartment(id, rest)),

  // ── Employees ──────────────────────────────────────────────────────────────
  listEmployees: protectedProcedure
    .use(requirePermission("hr:read"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        search: z.string().optional(),
        status: z.string().optional(),
        departmentId: z.number().int().positive().optional(),
        limit: z.number().int().max(500).default(100),
      }),
    )
    .query(({ input }) => svc.listEmployees(input.branchId, input)),

  getEmployee: protectedProcedure
    .use(requirePermission("hr:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getEmployeeById(input.id)),

  createEmployee: protectedProcedure
    .use(requirePermission("hr:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        employeeNumber: z.string().min(1).max(30),
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
        email: z.string().email(),
        hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        jobTitle: z.string().max(150).optional(),
        departmentId: z.number().int().positive().optional(),
        employmentType: z
          .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"])
          .default("FULL_TIME"),
        phone: z.string().max(30).optional(),
        nationalId: z.string().max(50).optional(),
        userId: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createEmployee(input)),

  updateEmployee: protectedProcedure
    .use(requirePermission("hr:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        jobTitle: z.string().max(150).nullable().optional(),
        departmentId: z.number().int().positive().nullable().optional(),
        status: z
          .enum(["ACTIVE", "INACTIVE", "TERMINATED", "ON_LEAVE"])
          .optional(),
        phone: z.string().max(30).nullable().optional(),
        employmentType: z
          .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"])
          .optional(),
      }),
    )
    .mutation(({ input: { id, ...rest } }) => svc.updateEmployee(id, rest)),

  terminateEmployee: protectedProcedure
    .use(requirePermission("hr:write"))
    .input(
      z.object({
        id: z.number().int().positive(),
        terminationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }),
    )
    .mutation(({ input }) =>
      svc.terminateEmployee(input.id, input.terminationDate),
    ),
});
