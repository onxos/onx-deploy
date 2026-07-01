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

// D01-S01 Executive Command Dashboard KPIs
export const execDashboardKpi = createTable(
  "exec_dashboard_kpi",
  {
    id: serial("id").primaryKey(),
    periodLabel: varchar("period_label", { length: 50 }).notNull(),
    branchId: varchar("branch_id", { length: 100 }),
    totalRevenue: numeric("total_revenue", { precision: 18, scale: 2 }),
    totalHeadcount: numeric("total_headcount", { precision: 10, scale: 0 }),
    totalPatients: numeric("total_patients", { precision: 12, scale: 0 }),
    openDecisions: numeric("open_decisions", { precision: 8, scale: 0 }),
    escalationCount: numeric("escalation_count", { precision: 8, scale: 0 }),
    okrProgress: numeric("okr_progress", { precision: 6, scale: 2 }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_exec_kpi_period_idx").on(table.periodLabel)],
);

// D01-S02 Approval Authority Matrix
export const approvalMatrix = createTable(
  "approval_matrix",
  {
    id: serial("id").primaryKey(),
    entityType: varchar("entity_type", { length: 100 }).notNull(),
    minAmount: numeric("min_amount", { precision: 18, scale: 2 }),
    maxAmount: numeric("max_amount", { precision: 18, scale: 2 }),
    requiredRole: varchar("required_role", { length: 100 }).notNull(),
    approverUserId: varchar("approver_user_id", { length: 255 }),
    quorum: numeric("quorum", { precision: 4, scale: 0 })
      .default("1")
      .notNull(),
    isActive: text("is_active").default("true").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_approval_matrix_entity_idx").on(table.entityType),
    index("onx_approval_matrix_role_idx").on(table.requiredRole),
  ],
);

// D01-S03 Board Resolution Register
export const boardResolution = createTable(
  "board_resolution",
  {
    id: serial("id").primaryKey(),
    resolutionNo: varchar("resolution_no", { length: 50 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    category: varchar("category", { length: 100 }).default("GENERAL").notNull(),
    summary: text("summary").notNull(),
    fullText: text("full_text"),
    adoptedBy: varchar("adopted_by", { length: 255 }).notNull(),
    adoptedAt: timestamp("adopted_at", { withTimezone: true }).notNull(),
    effectiveDate: timestamp("effective_date", { withTimezone: true }),
    expiryDate: timestamp("expiry_date", { withTimezone: true }),
    attachments: jsonb("attachments"),
    status: varchar("status", { length: 30 }).default("ACTIVE").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_board_resolution_no_idx").on(table.resolutionNo),
    index("onx_board_resolution_category_idx").on(table.category),
    index("onx_board_resolution_status_idx").on(table.status),
    index("onx_board_resolution_adopted_idx").on(table.adoptedAt),
  ],
);

// D15-S09 Multi-language Flags
export const languageConfig = createTable(
  "language_config",
  {
    id: serial("id").primaryKey(),
    tenantId: varchar("tenant_id", { length: 100 }),
    languageCode: varchar("language_code", { length: 10 }).notNull(),
    displayName: varchar("display_name", { length: 100 }).notNull(),
    isDefault: text("is_default").default("false").notNull(),
    isEnabled: text("is_enabled").default("true").notNull(),
    rtl: text("rtl").default("false").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_lang_config_tenant_idx").on(table.tenantId),
    index("onx_lang_config_code_idx").on(table.languageCode),
  ],
);

// D15-S10 Tenant Onboarding
export const tenantOnboarding = createTable(
  "tenant_onboarding",
  {
    id: serial("id").primaryKey(),
    tenantId: varchar("tenant_id", { length: 100 }).notNull(),
    step: varchar("step", { length: 100 }).notNull(),
    status: varchar("status", { length: 30 }).default("PENDING").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    metadata: jsonb("metadata"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("onx_tenant_onboarding_tenant_idx").on(table.tenantId),
    index("onx_tenant_onboarding_step_idx").on(table.step),
    index("onx_tenant_onboarding_status_idx").on(table.status),
  ],
);

export type ExecDashboardKpi = typeof execDashboardKpi.$inferSelect;
export type NewExecDashboardKpi = typeof execDashboardKpi.$inferInsert;
export type ApprovalMatrix = typeof approvalMatrix.$inferSelect;
export type NewApprovalMatrix = typeof approvalMatrix.$inferInsert;
export type BoardResolution = typeof boardResolution.$inferSelect;
export type NewBoardResolution = typeof boardResolution.$inferInsert;
export type LanguageConfig = typeof languageConfig.$inferSelect;
export type NewLanguageConfig = typeof languageConfig.$inferInsert;
export type TenantOnboarding = typeof tenantOnboarding.$inferSelect;
export type NewTenantOnboarding = typeof tenantOnboarding.$inferInsert;
