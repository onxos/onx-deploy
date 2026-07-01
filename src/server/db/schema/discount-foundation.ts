/**
 * OCMBR Wave 2f — D08-S03 IU-SCH
 * Discount & Coupon Engine schema
 *
 * OCMBR Reference: D08-S03-IU-SCH
 * Depends on: D08-S02 (Service & Product Catalogue)
 */

import {
  boolean,
  integer,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { branch } from "./org-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_discount_rule — configurable discount/promo rule
// ---------------------------------------------------------------------------
export const discountRule = createTable("discount_rule", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  discountType: varchar("discount_type", { length: 20 }).notNull(),
  // PERCENTAGE | FIXED_AMOUNT | BUY_X_GET_Y
  discountValue: numeric("discount_value", {
    precision: 10,
    scale: 2,
  }).notNull(),
  minOrderValue: numeric("min_order_value", {
    precision: 12,
    scale: 2,
  }).default("0"),
  maxDiscountCap: numeric("max_discount_cap", { precision: 12, scale: 2 }),
  applicableTo: varchar("applicable_to", { length: 20 }).default("ALL"),
  // ALL | CATEGORY | ITEM
  applicableEntityId: integer("applicable_entity_id"),
  startDate: varchar("start_date", { length: 10 }), // YYYY-MM-DD
  endDate: varchar("end_date", { length: 10 }),
  isActive: boolean("is_active").default(true).notNull(),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------------------------------------------------------------------------
// onx_coupon — unique coupon codes redeemable at POS
// ---------------------------------------------------------------------------
export const coupon = createTable("coupon", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  discountRuleId: integer("discount_rule_id")
    .notNull()
    .references(() => discountRule.id, { onDelete: "restrict" }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branch.id, { onDelete: "restrict" }),
  singleUse: boolean("single_use").default(true).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type DiscountRule = typeof discountRule.$inferSelect;
export type NewDiscountRule = typeof discountRule.$inferInsert;
export type Coupon = typeof coupon.$inferSelect;
export type NewCoupon = typeof coupon.$inferInsert;
