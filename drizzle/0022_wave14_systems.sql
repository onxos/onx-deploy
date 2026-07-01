-- OCMBR Wave 14 Migration
-- D01-S05 Strategic Objectives (OKR/KPI)
-- D01-S06 Escalation & Decision Log
-- D01-S07 Founder Seal / Ratification Engine
-- D02-S08 Disciplinary & Grievance
-- D02-S09 Employee Self-Service Portal

CREATE TABLE IF NOT EXISTS "onx_strategic_objective" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar(200) NOT NULL,
  "description" text,
  "objective_type" varchar(30) DEFAULT 'OKR' NOT NULL,
  "owner" varchar(255) NOT NULL,
  "period" varchar(50) NOT NULL,
  "target_value" numeric(18,4),
  "current_value" numeric(18,4),
  "unit" varchar(50),
  "progress" numeric(6,2),
  "status" varchar(30) DEFAULT 'ON_TRACK' NOT NULL,
  "parent_id" numeric(10,0),
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_escalation_log" (
  "id" serial PRIMARY KEY NOT NULL,
  "subject" varchar(200) NOT NULL,
  "description" text NOT NULL,
  "raised_by" varchar(255) NOT NULL,
  "assigned_to" varchar(255),
  "priority" varchar(20) DEFAULT 'MEDIUM' NOT NULL,
  "category" varchar(100) DEFAULT 'OPERATIONAL' NOT NULL,
  "status" varchar(30) DEFAULT 'OPEN' NOT NULL,
  "resolution" text,
  "resolved_at" timestamp with time zone,
  "due_at" timestamp with time zone,
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_founder_seal" (
  "id" serial PRIMARY KEY NOT NULL,
  "document_type" varchar(100) NOT NULL,
  "document_ref" varchar(200) NOT NULL,
  "document_title" varchar(300) NOT NULL,
  "sealed_by" varchar(255) NOT NULL,
  "sealed_at" timestamp with time zone NOT NULL,
  "seal_hash" varchar(255),
  "status" varchar(30) DEFAULT 'SEALED' NOT NULL,
  "notes" text,
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_disciplinary_case" (
  "id" serial PRIMARY KEY NOT NULL,
  "case_no" varchar(50) NOT NULL UNIQUE,
  "employee_id" varchar(255) NOT NULL,
  "case_type" varchar(30) DEFAULT 'DISCIPLINARY' NOT NULL,
  "severity" varchar(20) DEFAULT 'MINOR' NOT NULL,
  "description" text NOT NULL,
  "raised_by" varchar(255) NOT NULL,
  "investigator_id" varchar(255),
  "outcome" text,
  "status" varchar(30) DEFAULT 'OPEN' NOT NULL,
  "hearing_date" timestamp with time zone,
  "resolved_at" timestamp with time zone,
  "attachments" jsonb,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_employee_self_service_request" (
  "id" serial PRIMARY KEY NOT NULL,
  "employee_id" varchar(255) NOT NULL,
  "request_type" varchar(100) NOT NULL,
  "request_data" jsonb NOT NULL,
  "status" varchar(30) DEFAULT 'PENDING' NOT NULL,
  "approved_by" varchar(255),
  "rejection_reason" text,
  "processed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS "onx_strategic_obj_period_idx" ON "onx_strategic_objective" ("period");
CREATE INDEX IF NOT EXISTS "onx_strategic_obj_owner_idx" ON "onx_strategic_objective" ("owner");
CREATE INDEX IF NOT EXISTS "onx_strategic_obj_status_idx" ON "onx_strategic_objective" ("status");
CREATE INDEX IF NOT EXISTS "onx_escalation_status_idx" ON "onx_escalation_log" ("status");
CREATE INDEX IF NOT EXISTS "onx_escalation_priority_idx" ON "onx_escalation_log" ("priority");
CREATE INDEX IF NOT EXISTS "onx_escalation_raised_idx" ON "onx_escalation_log" ("raised_by");
CREATE INDEX IF NOT EXISTS "onx_founder_seal_doc_type_idx" ON "onx_founder_seal" ("document_type");
CREATE INDEX IF NOT EXISTS "onx_founder_seal_sealed_by_idx" ON "onx_founder_seal" ("sealed_by");
CREATE INDEX IF NOT EXISTS "onx_founder_seal_status_idx" ON "onx_founder_seal" ("status");
CREATE INDEX IF NOT EXISTS "onx_disciplinary_employee_idx" ON "onx_disciplinary_case" ("employee_id");
CREATE INDEX IF NOT EXISTS "onx_disciplinary_status_idx" ON "onx_disciplinary_case" ("status");
CREATE INDEX IF NOT EXISTS "onx_disciplinary_type_idx" ON "onx_disciplinary_case" ("case_type");
CREATE INDEX IF NOT EXISTS "onx_ess_employee_idx" ON "onx_employee_self_service_request" ("employee_id");
CREATE INDEX IF NOT EXISTS "onx_ess_type_idx" ON "onx_employee_self_service_request" ("request_type");
CREATE INDEX IF NOT EXISTS "onx_ess_status_idx" ON "onx_employee_self_service_request" ("status");
