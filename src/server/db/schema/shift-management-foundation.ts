/**
 * OCMBR Wave 2e — D08-S09 IU-SCH
 * Shift Management & Till Close schema
 *
 * OCMBR Reference: D08-S09-IU-SCH
 * Depends on: D08-S01 (POS Terminal)
 *
 * Note: posShift already exists in pos-foundation.ts (Wave 1).
 * This schema adds the till close summary and shift event log.
 */

import {
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
import { posShift, posTerminal } from "./pos-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_till_close — formal close record for a shift (extended from posShift)
// ---------------------------------------------------------------------------
export const tillClose = createTable("till_close", {
  id: serial("id").primaryKey(),
  shiftId: integer("shift_id")
    .notNull()
    .references(() => posShift.id, { onDelete: "restrict" }),
  terminalId: integer("terminal_id")
    .notNull()
    .references(() => posTerminal.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  closedAt: timestamp("closed_at", { withTimezone: true }).notNull(),
  closedBy: text("closed_by")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  totalSales: numeric("total_sales", { precision: 14, scale: 2 }).default("0"),
  totalRefunds: numeric("total_refunds", {
    precision: 14,
    scale: 2,
  }).default("0"),
  netSales: numeric("net_sales", { precision: 14, scale: 2 }).default("0"),
  transactionCount: integer("transaction_count").default(0),
  status: varchar("status", { length: 20 }).default("CLOSED").notNull(),
  // CLOSED | REVIEWED | DISPUTED
  supervisorNotes: text("supervisor_notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_shift_event — notable events logged during a shift (open/close/break)
// ---------------------------------------------------------------------------
export const shiftEvent = createTable("shift_event", {
  id: serial("id").primaryKey(),
  shiftId: integer("shift_id")
    .notNull()
    .references(() => posShift.id, { onDelete: "cascade" }),
  eventType: varchar("event_type", { length: 30 }).notNull(),
  // SHIFT_OPEN | BREAK_START | BREAK_END | SHIFT_CLOSE | MANUAL_NOTE
  eventAt: timestamp("event_at", { withTimezone: true }).defaultNow().notNull(),
  recordedBy: text("recorded_by").references(() => user.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type TillClose = typeof tillClose.$inferSelect;
export type NewTillClose = typeof tillClose.$inferInsert;
export type ShiftEvent = typeof shiftEvent.$inferSelect;
export type NewShiftEvent = typeof shiftEvent.$inferInsert;
