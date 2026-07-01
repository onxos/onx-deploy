import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `onx_${name}`);

export const webhookEndpoint = createTable(
  "webhook_endpoint",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    url: text("url").notNull(),
    secret: varchar("secret", { length: 255 }),
    events: jsonb("events").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_webhook_endpoint_active_idx").on(table.isActive)],
);

export const webhookDelivery = createTable(
  "webhook_delivery",
  {
    id: serial("id").primaryKey(),
    endpointId: integer("endpoint_id").notNull(),
    eventType: varchar("event_type", { length: 150 }).notNull(),
    payload: jsonb("payload").notNull(),
    status: varchar("status", { length: 30 }).default("PENDING").notNull(),
    attempts: integer("attempts").default(0).notNull(),
    responseCode: integer("response_code"),
    responseBody: text("response_body"),
    lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_webhook_delivery_status_idx").on(table.status),
    index("onx_webhook_delivery_endpoint_idx").on(table.endpointId),
    index("onx_webhook_delivery_event_idx").on(table.eventType),
  ],
);

export type WebhookEndpoint = typeof webhookEndpoint.$inferSelect;
export type NewWebhookEndpoint = typeof webhookEndpoint.$inferInsert;
export type WebhookDelivery = typeof webhookDelivery.$inferSelect;
export type NewWebhookDelivery = typeof webhookDelivery.$inferInsert;
