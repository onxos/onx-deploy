-- OCMBR Wave 10 Migration
-- D14-S04 HR Manager Dashboard KPIs
-- D14-S05 Clinical Director Dashboard KPIs
-- D14-S06 Inventory/Procurement Dashboard KPIs
-- D14-S07 Customer/Loyalty Dashboard KPIs
-- D13-S04 AI Decision Placeholder Endpoints

CREATE TABLE IF NOT EXISTS "onx_hr_dashboard_kpi" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" varchar(100),
  "period_label" varchar(50) NOT NULL,
  "total_headcount" numeric(8,0),
  "absenteeism_rate" numeric(8,4),
  "overtime_hours" numeric(10,2),
  "open_vacancies" numeric(8,0),
  "training_hours" numeric(10,2),
  "pending_leave_requests" numeric(8,0),
  "payroll_total" numeric(18,2),
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_clinical_director_kpi" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" varchar(100),
  "period_label" varchar(50) NOT NULL,
  "total_consultations" numeric(12,0),
  "total_surgeries" numeric(8,0),
  "avg_consultation_minutes" numeric(8,2),
  "readmission_rate" numeric(8,4),
  "lab_turnaround_hours" numeric(8,2),
  "vaccination_count" numeric(10,0),
  "prescription_count" numeric(10,0),
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_inventory_procurement_kpi" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" varchar(100),
  "period_label" varchar(50) NOT NULL,
  "total_skus" numeric(10,0),
  "stockout_items" numeric(8,0),
  "expiring_items" numeric(8,0),
  "pending_pos" numeric(8,0),
  "inventory_value" numeric(18,2),
  "avg_lead_days" numeric(8,2),
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_loyalty_dashboard_kpi" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" varchar(100),
  "period_label" varchar(50) NOT NULL,
  "active_members" numeric(12,0),
  "new_registrations" numeric(10,0),
  "points_issued" numeric(18,0),
  "points_redeemed" numeric(18,0),
  "nps_score" numeric(6,2),
  "churn_rate" numeric(8,4),
  "avg_lifetime_value" numeric(18,2),
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_ai_decision_request" (
  "id" serial PRIMARY KEY NOT NULL,
  "decision_type" varchar(150) NOT NULL,
  "domain" varchar(50) NOT NULL,
  "input_data" jsonb NOT NULL,
  "output_data" jsonb,
  "status" varchar(30) DEFAULT 'PENDING' NOT NULL,
  "model_version" varchar(50),
  "confidence_score" varchar(20),
  "notes" text,
  "requested_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "resolved_at" timestamp with time zone
);

-- Indexes
CREATE INDEX IF NOT EXISTS "onx_hr_kpi_period_idx" ON "onx_hr_dashboard_kpi" ("period_label");
CREATE INDEX IF NOT EXISTS "onx_hr_kpi_branch_idx" ON "onx_hr_dashboard_kpi" ("branch_id");
CREATE INDEX IF NOT EXISTS "onx_clinical_kpi_period_idx" ON "onx_clinical_director_kpi" ("period_label");
CREATE INDEX IF NOT EXISTS "onx_clinical_kpi_branch_idx" ON "onx_clinical_director_kpi" ("branch_id");
CREATE INDEX IF NOT EXISTS "onx_inv_kpi_period_idx" ON "onx_inventory_procurement_kpi" ("period_label");
CREATE INDEX IF NOT EXISTS "onx_inv_kpi_branch_idx" ON "onx_inventory_procurement_kpi" ("branch_id");
CREATE INDEX IF NOT EXISTS "onx_loyalty_kpi_period_idx" ON "onx_loyalty_dashboard_kpi" ("period_label");
CREATE INDEX IF NOT EXISTS "onx_loyalty_kpi_branch_idx" ON "onx_loyalty_dashboard_kpi" ("branch_id");
CREATE INDEX IF NOT EXISTS "onx_ai_decision_type_idx" ON "onx_ai_decision_request" ("decision_type");
CREATE INDEX IF NOT EXISTS "onx_ai_decision_domain_idx" ON "onx_ai_decision_request" ("domain");
CREATE INDEX IF NOT EXISTS "onx_ai_decision_status_idx" ON "onx_ai_decision_request" ("status");
