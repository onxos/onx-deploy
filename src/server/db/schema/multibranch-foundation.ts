import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `onx_${name}`);

// D15-S06 Inter-branch Transfer
export const interBranchTransfer = createTable(
  "inter_branch_transfer",
  {
    id: serial("id").primaryKey(),
    fromBranchId: varchar("from_branch_id", { length: 100 }).notNull(),
    toBranchId: varchar("to_branch_id", { length: 100 }).notNull(),
    transferType: varchar("transfer_type", { length: 50 })
      .default("STOCK")
      .notNull(),
    status: varchar("status", { length: 30 }).default("PENDING").notNull(),
    referenceNo: varchar("reference_no", { length: 50 }).notNull(),
    items: jsonb("items").notNull(),
    requestedBy: varchar("requested_by", { length: 255 }).notNull(),
    approvedBy: varchar("approved_by", { length: 255 }),
    notes: text("notes"),
    requestedAt: timestamp("requested_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("onx_ibt_from_idx").on(table.fromBranchId),
    index("onx_ibt_to_idx").on(table.toBranchId),
    index("onx_ibt_status_idx").on(table.status),
    index("onx_ibt_ref_idx").on(table.referenceNo),
  ],
);

// D15-S07 Branch Configuration Override
export const branchConfig = createTable(
  "branch_config",
  {
    id: serial("id").primaryKey(),
    branchId: varchar("branch_id", { length: 100 }).notNull(),
    configKey: varchar("config_key", { length: 100 }).notNull(),
    configValue: text("config_value").notNull(),
    isOverride: boolean("is_override").default(true).notNull(),
    effectiveFrom: timestamp("effective_from", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    effectiveTo: timestamp("effective_to", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_branch_config_branch_idx").on(table.branchId),
    index("onx_branch_config_key_idx").on(table.configKey),
  ],
);

// D15-S08 Multi-currency Support
export const currencyRate = createTable(
  "currency_rate",
  {
    id: serial("id").primaryKey(),
    fromCurrency: varchar("from_currency", { length: 10 }).notNull(),
    toCurrency: varchar("to_currency", { length: 10 }).notNull(),
    rate: numeric("rate", { precision: 20, scale: 8 }).notNull(),
    rateDate: timestamp("rate_date", { withTimezone: true }).notNull(),
    source: varchar("source", { length: 50 }).default("MANUAL").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_currency_pair_idx").on(table.fromCurrency, table.toCurrency),
    index("onx_currency_date_idx").on(table.rateDate),
    index("onx_currency_active_idx").on(table.isActive),
  ],
);

export type InterBranchTransfer = typeof interBranchTransfer.$inferSelect;
export type NewInterBranchTransfer = typeof interBranchTransfer.$inferInsert;
export type BranchConfig = typeof branchConfig.$inferSelect;
export type NewBranchConfig = typeof branchConfig.$inferInsert;
export type CurrencyRate = typeof currencyRate.$inferSelect;
export type NewCurrencyRate = typeof currencyRate.$inferInsert;
