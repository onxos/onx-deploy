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

// D14-S04 HR Manager Dashboard KPIs
export const hrDashboardKpi = createTable(
  "hr_dashboard_kpi",
  {
    id: serial("id").primaryKey(),
    branchId: varchar("branch_id", { length: 100 }),
    periodLabel: varchar("period_label", { length: 50 }).notNull(),
    totalHeadcount: numeric("total_headcount", { precision: 8, scale: 0 }),
    absenteeismRate: numeric("absenteeism_rate", { precision: 8, scale: 4 }),
    overtimeHours: numeric("overtime_hours", { precision: 10, scale: 2 }),
    openVacancies: numeric("open_vacancies", { precision: 8, scale: 0 }),
    trainingHours: numeric("training_hours", { precision: 10, scale: 2 }),
    pendingLeaveRequests: numeric("pending_leave_requests", {
      precision: 8,
      scale: 0,
    }),
    payrollTotal: numeric("payroll_total", { precision: 18, scale: 2 }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_hr_kpi_period_idx").on(table.periodLabel),
    index("onx_hr_kpi_branch_idx").on(table.branchId),
  ],
);

// D14-S05 Clinical Director Dashboard KPIs
export const clinicalDirectorKpi = createTable(
  "clinical_director_kpi",
  {
    id: serial("id").primaryKey(),
    branchId: varchar("branch_id", { length: 100 }),
    periodLabel: varchar("period_label", { length: 50 }).notNull(),
    totalConsultations: numeric("total_consultations", {
      precision: 12,
      scale: 0,
    }),
    totalSurgeries: numeric("total_surgeries", { precision: 8, scale: 0 }),
    avgConsultationMinutes: numeric("avg_consultation_minutes", {
      precision: 8,
      scale: 2,
    }),
    readmissionRate: numeric("readmission_rate", { precision: 8, scale: 4 }),
    labTurnaroundHours: numeric("lab_turnaround_hours", {
      precision: 8,
      scale: 2,
    }),
    vaccinationCount: numeric("vaccination_count", { precision: 10, scale: 0 }),
    prescriptionCount: numeric("prescription_count", {
      precision: 10,
      scale: 0,
    }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_clinical_kpi_period_idx").on(table.periodLabel),
    index("onx_clinical_kpi_branch_idx").on(table.branchId),
  ],
);

// D14-S06 Inventory/Procurement Dashboard KPIs
export const inventoryProcurementKpi = createTable(
  "inventory_procurement_kpi",
  {
    id: serial("id").primaryKey(),
    branchId: varchar("branch_id", { length: 100 }),
    periodLabel: varchar("period_label", { length: 50 }).notNull(),
    totalSkus: numeric("total_skus", { precision: 10, scale: 0 }),
    stockoutItems: numeric("stockout_items", { precision: 8, scale: 0 }),
    expiringItems: numeric("expiring_items", { precision: 8, scale: 0 }),
    pendingPOs: numeric("pending_pos", { precision: 8, scale: 0 }),
    inventoryValue: numeric("inventory_value", { precision: 18, scale: 2 }),
    avgLeadDays: numeric("avg_lead_days", { precision: 8, scale: 2 }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_inv_kpi_period_idx").on(table.periodLabel),
    index("onx_inv_kpi_branch_idx").on(table.branchId),
  ],
);

// D14-S07 Customer/Loyalty Dashboard KPIs
export const loyaltyDashboardKpi = createTable(
  "loyalty_dashboard_kpi",
  {
    id: serial("id").primaryKey(),
    branchId: varchar("branch_id", { length: 100 }),
    periodLabel: varchar("period_label", { length: 50 }).notNull(),
    activeMembers: numeric("active_members", { precision: 12, scale: 0 }),
    newRegistrations: numeric("new_registrations", { precision: 10, scale: 0 }),
    pointsIssued: numeric("points_issued", { precision: 18, scale: 0 }),
    pointsRedeemed: numeric("points_redeemed", { precision: 18, scale: 0 }),
    npsScore: numeric("nps_score", { precision: 6, scale: 2 }),
    churnRate: numeric("churn_rate", { precision: 8, scale: 4 }),
    avgLifetimeValue: numeric("avg_lifetime_value", {
      precision: 18,
      scale: 2,
    }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_loyalty_kpi_period_idx").on(table.periodLabel),
    index("onx_loyalty_kpi_branch_idx").on(table.branchId),
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
export type HrDashboardKpi = typeof hrDashboardKpi.$inferSelect;
export type NewHrDashboardKpi = typeof hrDashboardKpi.$inferInsert;
export type ClinicalDirectorKpi = typeof clinicalDirectorKpi.$inferSelect;
export type NewClinicalDirectorKpi = typeof clinicalDirectorKpi.$inferInsert;
export type InventoryProcurementKpi =
  typeof inventoryProcurementKpi.$inferSelect;
export type NewInventoryProcurementKpi =
  typeof inventoryProcurementKpi.$inferInsert;
export type LoyaltyDashboardKpi = typeof loyaltyDashboardKpi.$inferSelect;
export type NewLoyaltyDashboardKpi = typeof loyaltyDashboardKpi.$inferInsert;
