/**
 * OCMBR Wave 1 — D03-S01 / Finance Foundation (Chart of Accounts)
 * Chart of Accounts Manager
 *
 * IU-ID: D03-S01-IU-SCH
 * System: Chart of Accounts Manager
 * Domain: D03 — Finance & Accounting
 * Depends on: FOUND-IU-01 (onx_branch), FOUND-IU-02 (onx_tenant)
 *
 * Note: D03-S02 (General Ledger) depends on this schema.
 */

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_account — chart of accounts (hierarchical, up to 5 levels)
// ---------------------------------------------------------------------------
export const coaAccount = createTable(
  "account",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 30 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    accountType: varchar("account_type", { length: 20 }).notNull(),
    subtype: varchar("subtype", { length: 100 }),
    parentId: integer("parent_id"),
    level: integer("level").default(1).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    isSystemAccount: boolean("is_system_account").default(false).notNull(),
    description: text("description"),
    branchId: integer("branch_id").references(() => branch.id, {
      onDelete: "set null",
    }),
    tenantId: integer("tenant_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_account_code_idx").on(table.code),
    index("onx_account_type_idx").on(table.accountType),
    index("onx_account_parent_idx").on(table.parentId),
    index("onx_account_branch_idx").on(table.branchId),
    index("onx_account_active_idx").on(table.isActive),
  ],
);

export type Account = typeof coaAccount.$inferSelect;
export type NewAccount = typeof coaAccount.$inferInsert;
