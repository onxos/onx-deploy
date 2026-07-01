/**
 * OCMBR Wave 5 — D11-S03 IU-SCH
 * Mobile Clinic Schedule & Route schema
 *
 * OCMBR Reference: D11-S03-IU-SCH
 * Depends on: D09-S01 (Clinical), D15-S01 (Branch)
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
// onx_mobile_clinic_route — planned route for a mobile clinic visit
// ---------------------------------------------------------------------------
export const mobileClinicRoute = createTable("mobile_clinic_route", {
  id: serial("id").primaryKey(),
  routeCode: varchar("route_code", { length: 50 }).unique().notNull(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  driverId: text("driver_id").references(() => user.id, {
    onDelete: "set null",
  }),
  scheduledDate: varchar("scheduled_date", { length: 10 }).notNull(),
  // YYYY-MM-DD
  startTime: varchar("start_time", { length: 5 }),
  endTime: varchar("end_time", { length: 5 }),
  vehicleDetails: varchar("vehicle_details", { length: 200 }),
  startLocation: varchar("start_location", { length: 300 }),
  endLocation: varchar("end_location", { length: 300 }),
  status: varchar("status", { length: 20 }).default("PLANNED").notNull(),
  // PLANNED | ACTIVE | COMPLETED | CANCELLED
  stopCount: integer("stop_count").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_mobile_clinic_stop — individual stop on a mobile clinic route
// ---------------------------------------------------------------------------
export const mobileClinicStop = createTable("mobile_clinic_stop", {
  id: serial("id").primaryKey(),
  routeId: integer("route_id")
    .notNull()
    .references(() => mobileClinicRoute.id, { onDelete: "cascade" }),
  stopOrder: integer("stop_order").notNull(),
  location: varchar("location", { length: 300 }).notNull(),
  contactName: varchar("contact_name", { length: 200 }),
  contactPhone: varchar("contact_phone", { length: 30 }),
  estimatedArrival: varchar("estimated_arrival", { length: 5 }),
  actualArrival: varchar("actual_arrival", { length: 5 }),
  status: varchar("status", { length: 20 }).default("PENDING").notNull(),
  // PENDING | ARRIVED | COMPLETED | SKIPPED
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type MobileClinicRoute = typeof mobileClinicRoute.$inferSelect;
export type NewMobileClinicRoute = typeof mobileClinicRoute.$inferInsert;
export type MobileClinicStop = typeof mobileClinicStop.$inferSelect;
export type NewMobileClinicStop = typeof mobileClinicStop.$inferInsert;
