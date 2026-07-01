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

// D02-S10 Offboarding & Exit
export const offboardingRecord = createTable(
  "offboarding_record",
  {
    id: serial("id").primaryKey(),
    employeeId: varchar("employee_id", { length: 255 }).notNull(),
    exitType: varchar("exit_type", { length: 50 })
      .default("RESIGNATION")
      .notNull(),
    noticeDate: timestamp("notice_date", { withTimezone: true }),
    lastWorkingDay: timestamp("last_working_day", { withTimezone: true }),
    exitInterviewDate: timestamp("exit_interview_date", { withTimezone: true }),
    exitInterviewNotes: text("exit_interview_notes"),
    clearanceStatus: varchar("clearance_status", { length: 30 })
      .default("PENDING")
      .notNull(),
    finalSettlementAmount: numeric("final_settlement_amount", {
      precision: 18,
      scale: 2,
    }),
    rehireEligible: boolean("rehire_eligible"),
    checklist: jsonb("checklist"),
    status: varchar("status", { length: 30 }).default("IN_PROGRESS").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_offboarding_employee_idx").on(table.employeeId),
    index("onx_offboarding_status_idx").on(table.status),
  ],
);

// D03-S07 Budget Planning
export const budgetLine = createTable(
  "budget_line",
  {
    id: serial("id").primaryKey(),
    budgetYear: numeric("budget_year", { precision: 4, scale: 0 }).notNull(),
    period: varchar("period", { length: 20 }).notNull(),
    accountCode: varchar("account_code", { length: 50 }).notNull(),
    branchId: varchar("branch_id", { length: 100 }),
    budgetAmount: numeric("budget_amount", {
      precision: 18,
      scale: 2,
    }).notNull(),
    actualAmount: numeric("actual_amount", { precision: 18, scale: 2 }),
    variance: numeric("variance", { precision: 18, scale: 2 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_budget_line_year_idx").on(table.budgetYear),
    index("onx_budget_line_account_idx").on(table.accountCode),
    index("onx_budget_line_branch_idx").on(table.branchId),
  ],
);

// D03-S08 Cash Flow Forecast
export const cashFlowForecast = createTable(
  "cash_flow_forecast",
  {
    id: serial("id").primaryKey(),
    forecastDate: timestamp("forecast_date", { withTimezone: true }).notNull(),
    period: varchar("period", { length: 20 }).notNull(),
    branchId: varchar("branch_id", { length: 100 }),
    openingBalance: numeric("opening_balance", {
      precision: 18,
      scale: 2,
    }).notNull(),
    projectedInflows: numeric("projected_inflows", { precision: 18, scale: 2 }),
    projectedOutflows: numeric("projected_outflows", {
      precision: 18,
      scale: 2,
    }),
    closingBalance: numeric("closing_balance", { precision: 18, scale: 2 }),
    currencyCode: varchar("currency_code", { length: 10 })
      .default("USD")
      .notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_cashflow_period_idx").on(table.period),
    index("onx_cashflow_date_idx").on(table.forecastDate),
  ],
);

// D03-S09 Financial Period Close
export const financialPeriodClose = createTable(
  "financial_period_close",
  {
    id: serial("id").primaryKey(),
    year: numeric("year", { precision: 4, scale: 0 }).notNull(),
    month: numeric("month", { precision: 2, scale: 0 }).notNull(),
    status: varchar("status", { length: 30 }).default("OPEN").notNull(),
    closedBy: varchar("closed_by", { length: 255 }),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    reopenedBy: varchar("reopened_by", { length: 255 }),
    reopenedAt: timestamp("reopened_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_period_close_year_month_idx").on(table.year, table.month),
    index("onx_period_close_status_idx").on(table.status),
  ],
);

// D03-S10 Tax & VAT
export const taxRule = createTable(
  "tax_rule",
  {
    id: serial("id").primaryKey(),
    ruleName: varchar("rule_name", { length: 100 }).notNull(),
    taxType: varchar("tax_type", { length: 50 }).default("VAT").notNull(),
    rate: numeric("rate", { precision: 8, scale: 4 }).notNull(),
    applicableTo: varchar("applicable_to", { length: 100 }).notNull(),
    countryCode: varchar("country_code", { length: 10 }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    effectiveFrom: timestamp("effective_from", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    effectiveTo: timestamp("effective_to", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_tax_rule_type_idx").on(table.taxType),
    index("onx_tax_rule_country_idx").on(table.countryCode),
    index("onx_tax_rule_active_idx").on(table.isActive),
  ],
);

export type OffboardingRecord = typeof offboardingRecord.$inferSelect;
export type NewOffboardingRecord = typeof offboardingRecord.$inferInsert;
export type BudgetLine = typeof budgetLine.$inferSelect;
export type NewBudgetLine = typeof budgetLine.$inferInsert;
export type CashFlowForecast = typeof cashFlowForecast.$inferSelect;
export type NewCashFlowForecast = typeof cashFlowForecast.$inferInsert;
export type FinancialPeriodClose = typeof financialPeriodClose.$inferSelect;
export type NewFinancialPeriodClose = typeof financialPeriodClose.$inferInsert;
export type TaxRule = typeof taxRule.$inferSelect;
export type NewTaxRule = typeof taxRule.$inferInsert;
