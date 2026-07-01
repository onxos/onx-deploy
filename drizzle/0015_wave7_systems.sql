-- Wave 7: D12-S05 Risk Register, D12-S06 Incident Reporting, D12-S07 Policy & Procedure, D12-S08 Data Privacy, D13-S01 Training
-- OCMBR-005

CREATE TABLE IF NOT EXISTS "onx_risk_entry" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "risk_code" varchar(50) UNIQUE NOT NULL,
  "title" varchar(255) NOT NULL,
  "category" varchar(100) NOT NULL,
  "description" text NOT NULL,
  "likelihood" integer NOT NULL,
  "impact" integer NOT NULL,
  "risk_score" integer NOT NULL,
  "status" varchar(30) DEFAULT 'OPEN' NOT NULL,
  "owner_id" text REFERENCES "onx_user"("id") ON DELETE SET NULL,
  "mitigation_plan" text,
  "review_date" date,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_incident_report" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "report_code" varchar(50) UNIQUE NOT NULL,
  "incident_type" varchar(100) NOT NULL,
  "severity" varchar(20) DEFAULT 'LOW' NOT NULL,
  "description" text NOT NULL,
  "occurred_at" timestamp with time zone NOT NULL,
  "reported_by_id" text NOT NULL REFERENCES "onx_user"("id") ON DELETE RESTRICT,
  "status" varchar(30) DEFAULT 'OPEN' NOT NULL,
  "investigation_notes" text,
  "resolution" text,
  "closed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_policy_document" (
  "id" serial PRIMARY KEY NOT NULL,
  "document_code" varchar(50) UNIQUE NOT NULL,
  "title" varchar(255) NOT NULL,
  "category" varchar(100) NOT NULL,
  "version" varchar(20) DEFAULT '1.0' NOT NULL,
  "status" varchar(30) DEFAULT 'DRAFT' NOT NULL,
  "owner_id" text REFERENCES "onx_user"("id") ON DELETE SET NULL,
  "approved_by_id" text REFERENCES "onx_user"("id") ON DELETE SET NULL,
  "effective_date" date,
  "review_date" date,
  "content" text,
  "file_url" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_data_processing_activity" (
  "id" serial PRIMARY KEY NOT NULL,
  "activity_code" varchar(50) UNIQUE NOT NULL,
  "activity_name" varchar(255) NOT NULL,
  "purpose" text NOT NULL,
  "legal_basis" varchar(100) NOT NULL,
  "data_categories" text NOT NULL,
  "retention_period" varchar(50) NOT NULL,
  "third_party_sharing" boolean DEFAULT false NOT NULL,
  "third_party_details" text,
  "owner_id" text REFERENCES "onx_user"("id") ON DELETE SET NULL,
  "risk_level" varchar(20) DEFAULT 'LOW' NOT NULL,
  "dpia_required" boolean DEFAULT false NOT NULL,
  "dpia_completed_date" date,
  "status" varchar(30) DEFAULT 'ACTIVE' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_training_course" (
  "id" serial PRIMARY KEY NOT NULL,
  "course_code" varchar(50) UNIQUE NOT NULL,
  "title" varchar(255) NOT NULL,
  "provider" varchar(255),
  "delivery_mode" varchar(30) DEFAULT 'IN_PERSON' NOT NULL,
  "cpd_hours" integer DEFAULT 0 NOT NULL,
  "category" varchar(100) NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_training_record" (
  "id" serial PRIMARY KEY NOT NULL,
  "course_id" integer NOT NULL REFERENCES "onx_training_course"("id") ON DELETE RESTRICT,
  "staff_id" text NOT NULL REFERENCES "onx_user"("id") ON DELETE RESTRICT,
  "completed_date" date,
  "score" integer,
  "status" varchar(30) DEFAULT 'ENROLLED' NOT NULL,
  "certificate_url" text,
  "expiry_date" date,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
