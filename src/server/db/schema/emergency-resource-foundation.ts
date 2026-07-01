/**
 * OCMBR Wave 6 — D11-S06 IU-SCH
 * Emergency Resource Dispatch schema
 *
 * OCMBR Reference: D11-S06-IU-SCH
 * Depends on: D11-S05 (Emergency Case)
 */

import {
  integer,
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
// onx_emergency_resource — ambulance / mobile unit resource
// ---------------------------------------------------------------------------
export const emergencyResource = createTable("emergency_resource", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  resourceType: varchar("resource_type", { length: 50 }).notNull(),
  // AMBULANCE | MOBILE_UNIT | RAPID_RESPONSE_VAN | DRONE
  resourceCode: varchar("resource_code", { length: 50 }).unique().notNull(),
  status: varchar("status", { length: 30 }).default("AVAILABLE").notNull(),
  // AVAILABLE | DISPATCHED | RETURNING | MAINTENANCE | OUT_OF_SERVICE
  currentLocation: text("current_location"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_dispatch_event — a dispatch event linking a resource to an emergency
// ---------------------------------------------------------------------------
export const dispatchEvent = createTable("dispatch_event", {
  id: serial("id").primaryKey(),
  resourceId: integer("resource_id")
    .notNull()
    .references(() => emergencyResource.id, { onDelete: "restrict" }),
  emergencyCaseId: integer("emergency_case_id"),
  dispatchedAt: timestamp("dispatched_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  returnedAt: timestamp("returned_at", { withTimezone: true }),
  dispatchedById: text("dispatched_by_id").references(() => user.id, {
    onDelete: "set null",
  }),
  destination: text("destination").notNull(),
  outcome: text("outcome"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type EmergencyResource = typeof emergencyResource.$inferSelect;
export type NewEmergencyResource = typeof emergencyResource.$inferInsert;
export type DispatchEvent = typeof dispatchEvent.$inferSelect;
export type NewDispatchEvent = typeof dispatchEvent.$inferInsert;
