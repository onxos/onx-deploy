import { sql } from "drizzle-orm";
import {
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

export const reportSchedule = createTable(
  "report_schedule",
  {
    id: serial("id").primaryKey(),
    reportType: varchar("report_type", { length: 100 }).notNull(),
    recipientIds: jsonb("recipient_ids").notNull(),
    cronExpression: varchar("cron_expression", { length: 100 }).notNull(),
    format: varchar("format", { length: 20 }).default("PDF").notNull(),
    isActive: text("is_active").default("true").notNull(),
    lastRunAt: timestamp("last_run_at", { withTimezone: true }),
    nextRunAt: timestamp("next_run_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_report_schedule_type_idx").on(table.reportType),
    index("onx_report_schedule_next_idx").on(table.nextRunAt),
  ],
);

export const reportSnapshot = createTable(
  "report_snapshot",
  {
    id: serial("id").primaryKey(),
    reportType: varchar("report_type", { length: 100 }).notNull(),
    periodLabel: varchar("period_label", { length: 50 }).notNull(),
    data: jsonb("data").notNull(),
    generatedAt: timestamp("generated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    notes: text("notes"),
  },
  (table) => [
    index("onx_report_snapshot_type_idx").on(table.reportType),
    index("onx_report_snapshot_period_idx").on(table.periodLabel),
    index("onx_report_snapshot_generated_idx").on(table.generatedAt),
  ],
);

export const operationsDashboardKpi = createTable(
  "operations_dashboard_kpi",
  {
    id: serial("id").primaryKey(),
    branchId: varchar("branch_id", { length: 100 }),
    periodLabel: varchar("period_label", { length: 50 }).notNull(),
    totalAppointments: numeric("total_appointments", {
      precision: 12,
      scale: 0,
    }),
    completedAppointments: numeric("completed_appointments", {
      precision: 12,
      scale: 0,
    }),
    emergencyCases: numeric("emergency_cases", { precision: 12, scale: 0 }),
    avgWaitMinutes: numeric("avg_wait_minutes", { precision: 8, scale: 2 }),
    stockAlerts: numeric("stock_alerts", { precision: 8, scale: 0 }),
    openPurchaseOrders: numeric("open_purchase_orders", {
      precision: 8,
      scale: 0,
    }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_ops_kpi_period_idx").on(table.periodLabel),
    index("onx_ops_kpi_branch_idx").on(table.branchId),
  ],
);

export const financeDashboardKpi = createTable(
  "finance_dashboard_kpi",
  {
    id: serial("id").primaryKey(),
    branchId: varchar("branch_id", { length: 100 }),
    periodLabel: varchar("period_label", { length: 50 }).notNull(),
    totalRevenue: numeric("total_revenue", { precision: 18, scale: 2 }),
    totalExpenses: numeric("total_expenses", { precision: 18, scale: 2 }),
    netProfit: numeric("net_profit", { precision: 18, scale: 2 }),
    accountsReceivable: numeric("accounts_receivable", {
      precision: 18,
      scale: 2,
    }),
    accountsPayable: numeric("accounts_payable", { precision: 18, scale: 2 }),
    cashBalance: numeric("cash_balance", { precision: 18, scale: 2 }),
    overdueInvoices: numeric("overdue_invoices", { precision: 8, scale: 0 }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_finance_kpi_period_idx").on(table.periodLabel),
    index("onx_finance_kpi_branch_idx").on(table.branchId),
  ],
);

export type ReportSchedule = typeof reportSchedule.$inferSelect;
export type NewReportSchedule = typeof reportSchedule.$inferInsert;
export type ReportSnapshot = typeof reportSnapshot.$inferSelect;
export type NewReportSnapshot = typeof reportSnapshot.$inferInsert;
export type OperationsDashboardKpi = typeof operationsDashboardKpi.$inferSelect;
export type NewOperationsDashboardKpi =
  typeof operationsDashboardKpi.$inferInsert;
export type FinanceDashboardKpi = typeof financeDashboardKpi.$inferSelect;
export type NewFinanceDashboardKpi = typeof financeDashboardKpi.$inferInsert;
