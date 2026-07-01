/**
 * OCMBR Foundation P0 — FOUND-IU-02
 * Tenant schema
 *
 * Enables multi-tenancy: a tenant is the top-level billing/legal entity
 * that may own one or more brands and branches. Required for SaaS
 * deployments of ONX Civilization.
 *
 * OCMBR Reference: FOUND-IU-02 (D15-S03)
 * Phase: Foundation P0
 * Blocks: Multi-tenant FK on all domain tables
 */

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
import { brand } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_tenant — top-level billing / legal entity (SaaS customer)
// ---------------------------------------------------------------------------
export const tenant = createTable(
  "tenant",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    code: varchar("code", { length: 30 }).notNull().unique(),
    domain: varchar("domain", { length: 253 }).unique(),
    planTier: varchar("plan_tier", { length: 30 })
      .default("standard")
      .notNull(),
    maxBranches: integer("max_branches").default(10),
    isActive: boolean("is_active").default(true).notNull(),
    contactEmail: varchar("contact_email", { length: 256 }),
    contactPhone: varchar("contact_phone", { length: 30 }),
    country: varchar("country", { length: 2 }).default("SA"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index("onx_tenant_code_idx").on(table.code),
    index("onx_tenant_domain_idx").on(table.domain),
  ],
);

// ---------------------------------------------------------------------------
// onx_tenant_brand — link table: a tenant owns one or more brands
// ---------------------------------------------------------------------------
export const tenantBrand = createTable(
  "tenant_brand",
  {
    id: serial("id").primaryKey(),
    tenantId: integer("tenant_id")
      .notNull()
      .references(() => tenant.id, { onDelete: "cascade" }),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brand.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_tenant_brand_tenant_idx").on(table.tenantId),
    index("onx_tenant_brand_brand_idx").on(table.brandId),
  ],
);

// ---------------------------------------------------------------------------
// onx_tenant_config — per-tenant configuration overrides
// ---------------------------------------------------------------------------
export const tenantConfig = createTable(
  "tenant_config",
  {
    id: serial("id").primaryKey(),
    tenantId: integer("tenant_id")
      .notNull()
      .references(() => tenant.id, { onDelete: "cascade" })
      .unique(),
    defaultCurrency: varchar("default_currency", { length: 3 }).default("SAR"),
    defaultLanguage: varchar("default_language", { length: 10 }).default("en"),
    defaultTimezone: varchar("default_timezone", { length: 60 }).default(
      "Asia/Riyadh",
    ),
    enableMultiCurrency: boolean("enable_multi_currency").default(false),
    enableMultiLanguage: boolean("enable_multi_language").default(false),
    features: jsonb("features"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [index("onx_tenant_config_tenant_idx").on(table.tenantId)],
);

// ---------------------------------------------------------------------------
// onx_tenant_invite — invitation tokens for onboarding new tenant users
// ---------------------------------------------------------------------------
export const tenantInvite = createTable(
  "tenant_invite",
  {
    id: text("id").primaryKey(),
    tenantId: integer("tenant_id")
      .notNull()
      .references(() => tenant.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 256 }).notNull(),
    role: varchar("role", { length: 32 }).default("operator").notNull(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_tenant_invite_tenant_idx").on(table.tenantId),
    index("onx_tenant_invite_token_idx").on(table.token),
  ],
);

export type Tenant = typeof tenant.$inferSelect;
export type NewTenant = typeof tenant.$inferInsert;
export type TenantBrand = typeof tenantBrand.$inferSelect;
export type TenantConfig = typeof tenantConfig.$inferSelect;
export type TenantInvite = typeof tenantInvite.$inferSelect;
