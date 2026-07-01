/**
 * OCMBR Wave 6 — D11-S08 IU-SCH
 * 24/7 Availability Dashboard schema
 *
 * OCMBR Reference: D11-S08-IU-SCH
 * Depends on: D04-S01 (HR), org-foundation (Branch)
 */

import {
  boolean,
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
// onx_availability_window — per-branch service window definition
// ---------------------------------------------------------------------------
export const availabilityWindow = createTable("availability_window", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  dayOfWeek: integer("day_of_week").notNull(),
  // 0 = Sunday … 6 = Saturday
  openHour: integer("open_hour").notNull(),
  closeHour: integer("close_hour").notNull(),
  serviceType: varchar("service_type", { length: 50 })
    .default("GENERAL")
    .notNull(),
  // GENERAL | EMERGENCY | SURGERY | TELEVET
  isActive: boolean("is_active").default(true).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_availability_override — holiday / special-day override
// ---------------------------------------------------------------------------
export const availabilityOverride = createTable("availability_override", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  overrideDate: timestamp("override_date", { withTimezone: true }).notNull(),
  isClosed: boolean("is_closed").default(false).notNull(),
  openHour: integer("open_hour"),
  closeHour: integer("close_hour"),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type AvailabilityWindow = typeof availabilityWindow.$inferSelect;
export type NewAvailabilityWindow = typeof availabilityWindow.$inferInsert;
export type AvailabilityOverride = typeof availabilityOverride.$inferSelect;
export type NewAvailabilityOverride = typeof availabilityOverride.$inferInsert;
