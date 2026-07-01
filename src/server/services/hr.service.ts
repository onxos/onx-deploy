/**
 * OCMBR Wave 1 — D02-S01 Service Layer
 * HR Service: Department + Employee management
 * IU-ID: D02-S01-IU-API (service component)
 */

import { TRPCError } from "@trpc/server";
import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewDepartment,
  NewEmployee,
} from "@/server/db/schema/hr-foundation";
import { department, employee } from "@/server/db/schema/hr-foundation";

// ── Department ────────────────────────────────────────────────────────────────

export async function listDepartments(branchId: number, activeOnly = true) {
  const conditions = [eq(department.branchId, branchId)];
  if (activeOnly) conditions.push(eq(department.isActive, true));
  return db
    .select()
    .from(department)
    .where(and(...conditions));
}

export async function getDepartmentById(id: number) {
  const [row] = await db.select().from(department).where(eq(department.id, id));
  return row ?? null;
}

export async function createDepartment(
  input: Omit<NewDepartment, "id" | "createdAt" | "updatedAt">,
) {
  const [dup] = await db
    .select({ id: department.id })
    .from(department)
    .where(eq(department.code, input.code));
  if (dup)
    throw new TRPCError({
      code: "CONFLICT",
      message: "Department code already exists",
    });
  const [result] = await db.insert(department).values(input).returning();
  return result;
}

export async function updateDepartment(
  id: number,
  input: Partial<Omit<NewDepartment, "id" | "createdAt">>,
) {
  const rows = await db
    .update(department)
    .set(input)
    .where(eq(department.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Department not found" });
  return rows[0];
}

// ── Employee ──────────────────────────────────────────────────────────────────

export async function listEmployees(
  branchId: number,
  opts?: {
    search?: string;
    status?: string;
    departmentId?: number;
    limit?: number;
  },
) {
  const conditions = [eq(employee.branchId, branchId)];
  if (opts?.status) conditions.push(eq(employee.status, opts.status));
  if (opts?.departmentId)
    conditions.push(eq(employee.departmentId, opts.departmentId));
  if (opts?.search) {
    const searchClause = or(
      ilike(employee.firstName, `%${opts.search}%`),
      ilike(employee.lastName, `%${opts.search}%`),
      ilike(employee.employeeNumber, `%${opts.search}%`),
      ilike(employee.email, `%${opts.search}%`),
    );
    if (searchClause) conditions.push(searchClause);
  }
  return db
    .select()
    .from(employee)
    .where(and(...conditions))
    .limit(opts?.limit ?? 100);
}

export async function getEmployeeById(id: number) {
  const [row] = await db.select().from(employee).where(eq(employee.id, id));
  return row ?? null;
}

export async function createEmployee(
  input: Omit<NewEmployee, "id" | "createdAt" | "updatedAt">,
) {
  const [dup] = await db
    .select({ id: employee.id })
    .from(employee)
    .where(eq(employee.employeeNumber, input.employeeNumber));
  if (dup)
    throw new TRPCError({
      code: "CONFLICT",
      message: "Employee number already exists",
    });
  const [result] = await db.insert(employee).values(input).returning();
  return result;
}

export async function updateEmployee(
  id: number,
  input: Partial<Omit<NewEmployee, "id" | "createdAt">>,
) {
  const rows = await db
    .update(employee)
    .set(input)
    .where(eq(employee.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Employee not found" });
  return rows[0];
}

export async function terminateEmployee(id: number, terminationDate: string) {
  const rows = await db
    .update(employee)
    .set({ status: "TERMINATED", terminationDate })
    .where(eq(employee.id, id))
    .returning();
  if (rows.length === 0)
    throw new TRPCError({ code: "NOT_FOUND", message: "Employee not found" });
  return rows[0];
}
