/**
 * OCMBR Wave 1 — D08-S01 / POS Foundation
 * POS Terminal + Shift Management
 *
 * IU-ID: D08-S01-IU-SCH
 * System: POS Terminal
 * Domain: D08 — POS, Retail & E-Commerce
 * Depends on: FOUND-IU-01 (onx_branch), D05-S01 (onx_item)
 */

import { sql } from "drizzle-orm";
import {
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
// onx_pos_terminal — registered POS device per branch
// ---------------------------------------------------------------------------
export const posTerminal = createTable(
  "pos_terminal",
  {
    id: serial("id").primaryKey(),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    terminalCode: varchar("terminal_code", { length: 30 }).notNull().unique(),
    terminalName: varchar("terminal_name", { length: 100 }).notNull(),
    status: varchar("status", { length: 20 }).default("ACTIVE").notNull(),
    ipAddress: varchar("ip_address", { length: 50 }),
    lastHeartbeat: timestamp("last_heartbeat", { withTimezone: true }),
    // currentShiftId stored as plain int to avoid circular FK; managed at service layer
    currentShiftId: integer("current_shift_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_pos_terminal_branch_idx").on(table.branchId),
    index("onx_pos_terminal_status_idx").on(table.status),
  ],
);

// ---------------------------------------------------------------------------
// onx_pos_shift — cashier shift: open/close cycle for a terminal
// ---------------------------------------------------------------------------
export const posShift = createTable(
  "pos_shift",
  {
    id: serial("id").primaryKey(),
    terminalId: integer("terminal_id")
      .notNull()
      .references(() => posTerminal.id, { onDelete: "restrict" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "restrict" }),
    cashierId: text("cashier_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    openedAt: timestamp("opened_at", { withTimezone: true }).notNull(),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    openingBalance: numeric("opening_balance", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    closingBalance: numeric("closing_balance", { precision: 12, scale: 2 }),
    totalSales: numeric("total_sales", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    totalRefunds: numeric("total_refunds", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    status: varchar("status", { length: 20 }).default("OPEN").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_pos_shift_terminal_idx").on(table.terminalId),
    index("onx_pos_shift_branch_idx").on(table.branchId),
    index("onx_pos_shift_cashier_idx").on(table.cashierId),
    index("onx_pos_shift_status_idx").on(table.status),
  ],
);

export type PosTerminal = typeof posTerminal.$inferSelect;
export type NewPosTerminal = typeof posTerminal.$inferInsert;
export type PosShift = typeof posShift.$inferSelect;
export type NewPosShift = typeof posShift.$inferInsert;
