-- OCMBR Wave 12 Migration
-- D15-S06 Inter-branch Transfer Management
-- D15-S07 Branch Configuration Override
-- D15-S08 Multi-currency Rates
-- D13-S06 Integration Contract Stubs
-- D13-S08 Background Job Queue (router+UI — schema already in intelligence-foundation)

CREATE TABLE IF NOT EXISTS "onx_inter_branch_transfer" (
  "id" serial PRIMARY KEY NOT NULL,
  "from_branch_id" varchar(100) NOT NULL,
  "to_branch_id" varchar(100) NOT NULL,
  "transfer_type" varchar(50) DEFAULT 'STOCK' NOT NULL,
  "status" varchar(30) DEFAULT 'PENDING' NOT NULL,
  "reference_no" varchar(50) NOT NULL,
  "items" jsonb NOT NULL,
  "requested_by" varchar(255) NOT NULL,
  "approved_by" varchar(255),
  "notes" text,
  "requested_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "completed_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS "onx_branch_config" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" varchar(100) NOT NULL,
  "config_key" varchar(100) NOT NULL,
  "config_value" text NOT NULL,
  "is_override" boolean DEFAULT true NOT NULL,
  "effective_from" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "effective_to" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_currency_rate" (
  "id" serial PRIMARY KEY NOT NULL,
  "from_currency" varchar(10) NOT NULL,
  "to_currency" varchar(10) NOT NULL,
  "rate" numeric(20,8) NOT NULL,
  "rate_date" timestamp with time zone NOT NULL,
  "source" varchar(50) DEFAULT 'MANUAL' NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_integration_contract" (
  "id" serial PRIMARY KEY NOT NULL,
  "contract_key" varchar(100) NOT NULL UNIQUE,
  "source_domain" varchar(50) NOT NULL,
  "target_system" varchar(100) NOT NULL,
  "contract_version" varchar(20) DEFAULT '1.0' NOT NULL,
  "input_schema" jsonb NOT NULL,
  "output_schema" jsonb NOT NULL,
  "status" varchar(30) DEFAULT 'STUB' NOT NULL,
  "description" text,
  "activation_condition" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS "onx_ibt_from_idx" ON "onx_inter_branch_transfer" ("from_branch_id");
CREATE INDEX IF NOT EXISTS "onx_ibt_to_idx" ON "onx_inter_branch_transfer" ("to_branch_id");
CREATE INDEX IF NOT EXISTS "onx_ibt_status_idx" ON "onx_inter_branch_transfer" ("status");
CREATE INDEX IF NOT EXISTS "onx_ibt_ref_idx" ON "onx_inter_branch_transfer" ("reference_no");
CREATE INDEX IF NOT EXISTS "onx_branch_config_branch_idx" ON "onx_branch_config" ("branch_id");
CREATE INDEX IF NOT EXISTS "onx_branch_config_key_idx" ON "onx_branch_config" ("config_key");
CREATE INDEX IF NOT EXISTS "onx_currency_pair_idx" ON "onx_currency_rate" ("from_currency", "to_currency");
CREATE INDEX IF NOT EXISTS "onx_currency_date_idx" ON "onx_currency_rate" ("rate_date");
CREATE INDEX IF NOT EXISTS "onx_currency_active_idx" ON "onx_currency_rate" ("is_active");
CREATE INDEX IF NOT EXISTS "onx_integration_source_idx" ON "onx_integration_contract" ("source_domain");
CREATE INDEX IF NOT EXISTS "onx_integration_target_idx" ON "onx_integration_contract" ("target_system");
CREATE INDEX IF NOT EXISTS "onx_integration_status_idx" ON "onx_integration_contract" ("status");
