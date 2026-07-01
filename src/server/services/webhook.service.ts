import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewWebhookDelivery,
  NewWebhookEndpoint,
} from "@/server/db/schema/webhook-foundation";
import {
  webhookDelivery,
  webhookEndpoint,
} from "@/server/db/schema/webhook-foundation";

export async function listEndpoints() {
  return db.select().from(webhookEndpoint);
}

export async function createEndpoint(
  input: Omit<NewWebhookEndpoint, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(webhookEndpoint).values(input).returning();
  return row;
}

export async function updateEndpoint(
  id: number,
  patch: Partial<Omit<NewWebhookEndpoint, "id" | "createdAt">>,
) {
  const [row] = await db
    .update(webhookEndpoint)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(webhookEndpoint.id, id))
    .returning();
  return row;
}

export async function deactivateEndpoint(id: number) {
  const [row] = await db
    .update(webhookEndpoint)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(webhookEndpoint.id, id))
    .returning();
  return row;
}

export async function createDelivery(
  input: Omit<NewWebhookDelivery, "id" | "createdAt">,
) {
  const [row] = await db.insert(webhookDelivery).values(input).returning();
  return row;
}

export async function listDeliveriesByEndpoint(endpointId: number) {
  return db
    .select()
    .from(webhookDelivery)
    .where(eq(webhookDelivery.endpointId, endpointId));
}

export async function listDeliveriesByStatus(status: string, limit = 50) {
  return db
    .select()
    .from(webhookDelivery)
    .where(eq(webhookDelivery.status, status))
    .limit(limit);
}

export async function markDeliverySuccess(
  id: number,
  responseCode: number,
  responseBody: string,
) {
  const [row] = await db
    .update(webhookDelivery)
    .set({
      status: "DELIVERED",
      responseCode,
      responseBody,
      deliveredAt: new Date(),
      lastAttemptAt: new Date(),
    })
    .where(eq(webhookDelivery.id, id))
    .returning();
  return row;
}

export async function markDeliveryFailed(
  id: number,
  responseCode: number,
  responseBody: string,
) {
  const [row] = await db
    .update(webhookDelivery)
    .set({
      status: "FAILED",
      responseCode,
      responseBody,
      lastAttemptAt: new Date(),
    })
    .where(eq(webhookDelivery.id, id))
    .returning();
  return row;
}
