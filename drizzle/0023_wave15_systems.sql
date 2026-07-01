-- OCMBR Wave 15 Migration
-- D02-S10 Offboarding & Exit
-- D03-S07 Budget Planning & Variance
-- D03-S08 Cash Flow Forecasting
-- D03-S09 Financial Period Close
-- D03-S10 Tax & VAT Computation

CREATE TABLE IF NOT EXISTS "onx_offboarding_record" (
  "id" serial PRIMARY KEY NOT NULL, "employee_id" varchar(255) NOT NULL,
  "exit_type" varchar(50) DEFAULT 'RESIGNATION' NOT NULL,
  "notice_date" timestamp with time zone, "last_working_day" timestamp with time zone,
  "exit_interview_date" timestamp with time zone, "exit_interview_notes" text,
  "clearance_status" varchar(30) DEFAULT 'PENDING' NOT NULL,
  "final_settlement_amount" numeric(18,2), "rehire_eligible" boolean,
  "checklist" jsonb, "status" varchar(30) DEFAULT 'IN_PROGRESS' NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_budget_line" (
  "id" serial PRIMARY KEY NOT NULL, "budget_year" numeric(4,0) NOT NULL,
  "period" varchar(20) NOT NULL, "account_code" varchar(50) NOT NULL,
  "branch_id" varchar(100), "budget_amount" numeric(18,2) NOT NULL,
  "actual_amount" numeric(18,2), "variance" numeric(18,2), "notes" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_cash_flow_forecast" (
  "id" serial PRIMARY KEY NOT NULL, "forecast_date" timestamp with time zone NOT NULL,
  "period" varchar(20) NOT NULL, "branch_id" varchar(100),
  "opening_balance" numeric(18,2) NOT NULL, "projected_inflows" numeric(18,2),
  "projected_outflows" numeric(18,2), "closing_balance" numeric(18,2),
  "currency_code" varchar(10) DEFAULT 'USD' NOT NULL, "notes" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_financial_period_close" (
  "id" serial PRIMARY KEY NOT NULL, "year" numeric(4,0) NOT NULL,
  "month" numeric(2,0) NOT NULL, "status" varchar(30) DEFAULT 'OPEN' NOT NULL,
  "closed_by" varchar(255), "closed_at" timestamp with time zone,
  "reopened_by" varchar(255), "reopened_at" timestamp with time zone, "notes" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_tax_rule" (
  "id" serial PRIMARY KEY NOT NULL, "rule_name" varchar(100) NOT NULL,
  "tax_type" varchar(50) DEFAULT 'VAT' NOT NULL, "rate" numeric(8,4) NOT NULL,
  "applicable_to" varchar(100) NOT NULL, "country_code" varchar(10) NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "effective_from" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "effective_to" timestamp with time zone, "notes" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "onx_offboarding_employee_idx" ON "onx_offboarding_record" ("employee_id");
CREATE INDEX IF NOT EXISTS "onx_offboarding_status_idx" ON "onx_offboarding_record" ("status");
CREATE INDEX IF NOT EXISTS "onx_budget_line_year_idx" ON "onx_budget_line" ("budget_year");
CREATE INDEX IF NOT EXISTS "onx_budget_line_account_idx" ON "onx_budget_line" ("account_code");
CREATE INDEX IF NOT EXISTS "onx_budget_line_branch_idx" ON "onx_budget_line" ("branch_id");
CREATE INDEX IF NOT EXISTS "onx_cashflow_period_idx" ON "onx_cash_flow_forecast" ("period");
CREATE INDEX IF NOT EXISTS "onx_cashflow_date_idx" ON "onx_cash_flow_forecast" ("forecast_date");
CREATE INDEX IF NOT EXISTS "onx_period_close_year_month_idx" ON "onx_financial_period_close" ("year", "month");
CREATE INDEX IF NOT EXISTS "onx_period_close_status_idx" ON "onx_financial_period_close" ("status");
CREATE INDEX IF NOT EXISTS "onx_tax_rule_type_idx" ON "onx_tax_rule" ("tax_type");
CREATE INDEX IF NOT EXISTS "onx_tax_rule_country_idx" ON "onx_tax_rule" ("country_code");
CREATE INDEX IF NOT EXISTS "onx_tax_rule_active_idx" ON "onx_tax_rule" ("is_active");
