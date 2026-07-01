import { sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `onx_${name}`);

export const telemetryEvent = createTable(
  "telemetry_event",
  {
    id: serial("id").primaryKey(),
    module: varchar("module", { length: 100 }).notNull(),
    metricName: varchar("metric_name", { length: 150 }).notNull(),
    metricValue: numeric("metric_value", { precision: 18, scale: 6 }).notNull(),
    unit: varchar("unit", { length: 50 }).default("count").notNull(),
    dimensions: jsonb("dimensions"),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_telemetry_module_idx").on(table.module),
    index("onx_telemetry_metric_idx").on(table.metricName),
    index("onx_telemetry_recorded_idx").on(table.recordedAt),
  ],
);

export const telemetryAggregation = createTable(
  "telemetry_aggregation",
  {
    id: serial("id").primaryKey(),
    module: varchar("module", { length: 100 }).notNull(),
    metricName: varchar("metric_name", { length: 150 }).notNull(),
    periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
    periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
    sumValue: numeric("sum_value", { precision: 18, scale: 6 }),
    avgValue: numeric("avg_value", { precision: 18, scale: 6 }),
    minValue: numeric("min_value", { precision: 18, scale: 6 }),
    maxValue: numeric("max_value", { precision: 18, scale: 6 }),
    sampleCount: integer("sample_count").default(0).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_telemetry_agg_module_idx").on(table.module),
    index("onx_telemetry_agg_period_idx").on(
      table.periodStart,
      table.periodEnd,
    ),
  ],
);

export type TelemetryEvent = typeof telemetryEvent.$inferSelect;
export type NewTelemetryEvent = typeof telemetryEvent.$inferInsert;
export type TelemetryAggregation = typeof telemetryAggregation.$inferSelect;
export type NewTelemetryAggregation = typeof telemetryAggregation.$inferInsert;
