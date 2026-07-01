/**
 * OCMBR Wave 1 — D02-S01 / HR Foundation
 * Department (Org Chart) + Employee Master
 *
 * IU-ID: D02-S01-IU-SCH
 * System: Employee Master & Org Chart
 * Domain: D02 — Human Resources
 * Depends on: FOUND-IU-01 (onx_branch)
 */

import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_department — org chart node / department
// ---------------------------------------------------------------------------
export const department = createTable(
  "department",
  {
    id: serial("id").primaryKey(),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    code: varchar("code", { length: 30 }).notNull().unique(),
    name: varchar("name", { length: 150 }).notNull(),
    parentId: integer("parent_id"),
    // headEmployeeId stored as plain int to avoid circular FK; enforced at service layer
    headEmployeeId: integer("head_employee_id"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_dept_branch_idx").on(table.branchId),
    index("onx_dept_parent_idx").on(table.parentId),
    index("onx_dept_active_idx").on(table.isActive),
  ],
);

// ---------------------------------------------------------------------------
// onx_employee — employee record
// ---------------------------------------------------------------------------
export const employee = createTable(
  "employee",
  {
    id: serial("id").primaryKey(),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    tenantId: integer("tenant_id"),
    employeeNumber: varchar("employee_number", { length: 30 })
      .notNull()
      .unique(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    displayName: varchar("display_name", { length: 200 }),
    email: varchar("email", { length: 256 }).notNull(),
    phone: varchar("phone", { length: 30 }),
    jobTitle: varchar("job_title", { length: 150 }),
    departmentId: integer("department_id").references(() => department.id, {
      onDelete: "set null",
    }),
    employmentType: varchar("employment_type", { length: 20 })
      .default("FULL_TIME")
      .notNull(),
    status: varchar("status", { length: 20 }).default("ACTIVE").notNull(),
    hireDate: date("hire_date").notNull(),
    terminationDate: date("termination_date"),
    managerId: integer("manager_id"),
    nationalId: varchar("national_id", { length: 50 }),
    nationality: varchar("nationality", { length: 3 }).default("SAU"),
    dateOfBirth: date("date_of_birth"),
    gender: varchar("gender", { length: 10 }),
    salary: numeric("salary", { precision: 12, scale: 2 }),
    metadata: text("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_employee_branch_idx").on(table.branchId),
    index("onx_employee_dept_idx").on(table.departmentId),
    index("onx_employee_status_idx").on(table.status),
    index("onx_employee_user_idx").on(table.userId),
    index("onx_employee_number_idx").on(table.employeeNumber),
  ],
);

export type Department = typeof department.$inferSelect;
export type NewDepartment = typeof department.$inferInsert;
export type Employee = typeof employee.$inferSelect;
export type NewEmployee = typeof employee.$inferInsert;
