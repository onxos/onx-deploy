-- OCMBR Wave 13 Migration
-- D01-S01 Executive Command Dashboard KPIs
-- D01-S02 Approval Authority Matrix
-- D01-S03 Board Resolution Register
-- D15-S09 Language Configuration
-- D15-S10 Tenant Onboarding

CREATE TABLE IF NOT EXISTS "onx_exec_dashboard_kpi" (
  "id" serial PRIMARY KEY NOT NULL,
  "period_label" varchar(50) NOT NULL,
  "branch_id" varchar(100),
  "total_revenue" numeric(18,2),
  "total_headcount" numeric(10,0),
  "total_patients" numeric(12,0),
  "open_decisions" numeric(8,0),
  "escalation_count" numeric(8,0),
  "okr_progress" numeric(6,2),
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_approval_matrix" (
  "id" serial PRIMARY KEY NOT NULL,
  "entity_type" varchar(100) NOT NULL,
  "min_amount" numeric(18,2),
  "max_amount" numeric(18,2),
  "required_role" varchar(100) NOT NULL,
  "approver_user_id" varchar(255),
  "quorum" numeric(4,0) DEFAULT 1 NOT NULL,
  "is_active" text DEFAULT 'true' NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_board_resolution" (
  "id" serial PRIMARY KEY NOT NULL,
  "resolution_no" varchar(50) NOT NULL UNIQUE,
  "title" varchar(200) NOT NULL,
  "category" varchar(100) DEFAULT 'GENERAL' NOT NULL,
  "summary" text NOT NULL,
  "full_text" text,
  "adopted_by" varchar(255) NOT NULL,
  "adopted_at" timestamp with time zone NOT NULL,
  "effective_date" timestamp with time zone,
  "expiry_date" timestamp with time zone,
  "attachments" jsonb,
  "status" varchar(30) DEFAULT 'ACTIVE' NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_language_config" (
  "id" serial PRIMARY KEY NOT NULL,
  "tenant_id" varchar(100),
  "language_code" varchar(10) NOT NULL,
  "display_name" varchar(100) NOT NULL,
  "is_default" text DEFAULT 'false' NOT NULL,
  "is_enabled" text DEFAULT 'true' NOT NULL,
  "rtl" text DEFAULT 'false' NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_tenant_onboarding" (
  "id" serial PRIMARY KEY NOT NULL,
  "tenant_id" varchar(100) NOT NULL,
  "step" varchar(100) NOT NULL,
  "status" varchar(30) DEFAULT 'PENDING' NOT NULL,
  "completed_at" timestamp with time zone,
  "metadata" jsonb,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS "onx_exec_kpi_period_idx" ON "onx_exec_dashboard_kpi" ("period_label");
CREATE INDEX IF NOT EXISTS "onx_approval_matrix_entity_idx" ON "onx_approval_matrix" ("entity_type");
CREATE INDEX IF NOT EXISTS "onx_approval_matrix_role_idx" ON "onx_approval_matrix" ("required_role");
CREATE INDEX IF NOT EXISTS "onx_board_resolution_no_idx" ON "onx_board_resolution" ("resolution_no");
CREATE INDEX IF NOT EXISTS "onx_board_resolution_category_idx" ON "onx_board_resolution" ("category");
CREATE INDEX IF NOT EXISTS "onx_board_resolution_status_idx" ON "onx_board_resolution" ("status");
CREATE INDEX IF NOT EXISTS "onx_board_resolution_adopted_idx" ON "onx_board_resolution" ("adopted_at");
CREATE INDEX IF NOT EXISTS "onx_lang_config_tenant_idx" ON "onx_language_config" ("tenant_id");
CREATE INDEX IF NOT EXISTS "onx_lang_config_code_idx" ON "onx_language_config" ("language_code");
CREATE INDEX IF NOT EXISTS "onx_tenant_onboarding_tenant_idx" ON "onx_tenant_onboarding" ("tenant_id");
CREATE INDEX IF NOT EXISTS "onx_tenant_onboarding_step_idx" ON "onx_tenant_onboarding" ("step");
CREATE INDEX IF NOT EXISTS "onx_tenant_onboarding_status_idx" ON "onx_tenant_onboarding" ("status");
