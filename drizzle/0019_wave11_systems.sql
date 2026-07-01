-- OCMBR Wave 11 Migration
-- D14-S08 Compliance Dashboard KPIs
-- D14-S09 Custom Report Builder
-- D14-S10 Scheduled Distribution (uses existing onx_report_schedule)
-- D15-S05 Consolidated Reporting Config
-- D13-S05 Recommendation Engine Stub

CREATE TABLE IF NOT EXISTS "onx_compliance_dashboard_kpi" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" varchar(100),
  "period_label" varchar(50) NOT NULL,
  "open_audit_findings" numeric(8,0),
  "overdue_capas" numeric(8,0),
  "expiring_licences" numeric(8,0),
  "open_incidents" numeric(8,0),
  "high_risk_items" numeric(8,0),
  "policy_acknowledgement_rate" numeric(8,4),
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_custom_report" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(150) NOT NULL,
  "description" text,
  "query_config" jsonb NOT NULL,
  "columns" jsonb NOT NULL,
  "filters" jsonb,
  "created_by" varchar(255) NOT NULL,
  "is_shared" text DEFAULT 'false' NOT NULL,
  "last_run_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_consolidated_report_config" (
  "id" serial PRIMARY KEY NOT NULL,
  "tenant_id" varchar(100),
  "report_type" varchar(100) NOT NULL,
  "consolidation_mode" varchar(30) DEFAULT 'CONSOLIDATED' NOT NULL,
  "included_branch_ids" jsonb,
  "excluded_branch_ids" jsonb,
  "currency_code" varchar(10) DEFAULT 'USD' NOT NULL,
  "is_active" text DEFAULT 'true' NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_recommendation_rule" (
  "id" serial PRIMARY KEY NOT NULL,
  "rule_key" varchar(100) NOT NULL UNIQUE,
  "domain" varchar(50) NOT NULL,
  "name" varchar(150) NOT NULL,
  "description" text,
  "trigger_condition" jsonb NOT NULL,
  "recommendation_template" text NOT NULL,
  "priority" varchar(20) DEFAULT 'MEDIUM' NOT NULL,
  "is_active" text DEFAULT 'true' NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_recommendation_output" (
  "id" serial PRIMARY KEY NOT NULL,
  "rule_id" serial NOT NULL,
  "entity_type" varchar(100) NOT NULL,
  "entity_id" varchar(255) NOT NULL,
  "recommendation_text" text NOT NULL,
  "confidence_level" varchar(20) DEFAULT 'LOW' NOT NULL,
  "status" varchar(30) DEFAULT 'PENDING' NOT NULL,
  "generated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "acknowledged_at" timestamp with time zone,
  "metadata" jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS "onx_compliance_kpi_period_idx" ON "onx_compliance_dashboard_kpi" ("period_label");
CREATE INDEX IF NOT EXISTS "onx_compliance_kpi_branch_idx" ON "onx_compliance_dashboard_kpi" ("branch_id");
CREATE INDEX IF NOT EXISTS "onx_custom_report_creator_idx" ON "onx_custom_report" ("created_by");
CREATE INDEX IF NOT EXISTS "onx_custom_report_shared_idx" ON "onx_custom_report" ("is_shared");
CREATE INDEX IF NOT EXISTS "onx_consol_config_tenant_idx" ON "onx_consolidated_report_config" ("tenant_id");
CREATE INDEX IF NOT EXISTS "onx_consol_config_type_idx" ON "onx_consolidated_report_config" ("report_type");
CREATE INDEX IF NOT EXISTS "onx_rec_rule_domain_idx" ON "onx_recommendation_rule" ("domain");
CREATE INDEX IF NOT EXISTS "onx_rec_rule_active_idx" ON "onx_recommendation_rule" ("is_active");
CREATE INDEX IF NOT EXISTS "onx_rec_output_entity_idx" ON "onx_recommendation_output" ("entity_type", "entity_id");
CREATE INDEX IF NOT EXISTS "onx_rec_output_status_idx" ON "onx_recommendation_output" ("status");
CREATE INDEX IF NOT EXISTS "onx_rec_output_rule_idx" ON "onx_recommendation_output" ("rule_id");
