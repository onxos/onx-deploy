/**
 * OCMBR Foundation P0 — FOUND-IU-03
 * Branch-level RBAC extension
 *
 * Extends the existing platform auth (operator/admin/founder) with
 * branch-scoped role assignments. A user may hold different roles in
 * different branches (e.g. HR Manager at Branch A, Staff at Branch B).
 *
 * OCMBR Reference: FOUND-IU-03 (D15-S04)
 * Phase: Foundation P0
 * Blocks: Branch-scoped permission queries for HR, Clinical, Finance roles
 */

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { branch } from "./org-foundation";
import { tenant } from "./tenant-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_user_branch_role — scoped role for a user within a specific branch
// ---------------------------------------------------------------------------
export const userBranchRole = createTable(
  "user_branch_role",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    branchId: serial("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50 }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    grantedBy: text("granted_by").references(() => user.id, {
      onDelete: "set null",
    }),
    grantedAt: timestamp("granted_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (table) => [
    index("onx_user_branch_role_user_idx").on(table.userId),
    index("onx_user_branch_role_branch_idx").on(table.branchId),
    index("onx_user_branch_role_role_idx").on(table.role),
    index("onx_user_branch_role_active_idx").on(table.isActive),
  ],
);

// ---------------------------------------------------------------------------
// onx_user_tenant_membership — associates a user with a tenant
// ---------------------------------------------------------------------------
export const userTenantMembership = createTable(
  "user_tenant_membership",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    tenantId: serial("tenant_id")
      .notNull()
      .references(() => tenant.id, { onDelete: "cascade" }),
    platformRole: varchar("platform_role", { length: 50 })
      .default("operator")
      .notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_user_tenant_user_idx").on(table.userId),
    index("onx_user_tenant_tenant_idx").on(table.tenantId),
  ],
);

// ---------------------------------------------------------------------------
// onx_branch_role_permission — defines what a branch-scoped role can do
// Maps branch roles to resource/action pairs for fine-grained checks
// ---------------------------------------------------------------------------
export const branchRolePermission = createTable(
  "branch_role_permission",
  {
    id: serial("id").primaryKey(),
    role: varchar("role", { length: 50 }).notNull(),
    resource: varchar("resource", { length: 100 }).notNull(),
    action: varchar("action", { length: 50 }).notNull(),
    isAllowed: boolean("is_allowed").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_branch_role_perm_role_idx").on(table.role),
    index("onx_branch_role_perm_resource_idx").on(table.resource),
  ],
);

export type UserBranchRole = typeof userBranchRole.$inferSelect;
export type NewUserBranchRole = typeof userBranchRole.$inferInsert;
export type UserTenantMembership = typeof userTenantMembership.$inferSelect;
export type BranchRolePermission = typeof branchRolePermission.$inferSelect;
