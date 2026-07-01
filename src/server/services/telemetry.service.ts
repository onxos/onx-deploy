import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewTelemetryAggregation,
  NewTelemetryEvent,
} from "@/server/db/schema/telemetry-foundation";
import {
  telemetryAggregation,
  telemetryEvent,
} from "@/server/db/schema/telemetry-foundation";

export async function recordMetric(
  input: Omit<NewTelemetryEvent, "id" | "recordedAt">,
) {
  const [row] = await db.insert(telemetryEvent).values(input).returning();
  return row;
}

export async function listMetricsByModule(module: string, limit = 100) {
  return db
    .select()
    .from(telemetryEvent)
    .where(eq(telemetryEvent.module, module))
    .orderBy(telemetryEvent.recordedAt)
    .limit(limit);
}

export async function listMetricsByName(metricName: string, limit = 100) {
  return db
    .select()
    .from(telemetryEvent)
    .where(eq(telemetryEvent.metricName, metricName))
    .limit(limit);
}

export async function listMetricsInRange(
  module: string,
  from: Date,
  to: Date,
  limit = 500,
) {
  return db
    .select()
    .from(telemetryEvent)
    .where(
      and(
        eq(telemetryEvent.module, module),
        gte(telemetryEvent.recordedAt, from),
        lte(telemetryEvent.recordedAt, to),
      ),
    )
    .limit(limit);
}

export async function createAggregation(
  input: Omit<NewTelemetryAggregation, "id" | "createdAt">,
) {
  const [row] = await db.insert(telemetryAggregation).values(input).returning();
  return row;
}

export async function listAggregationsByModule(module: string) {
  return db
    .select()
    .from(telemetryAggregation)
    .where(eq(telemetryAggregation.module, module));
}
