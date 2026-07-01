-- Wave 6 systems: D11-S06 Emergency Resource Dispatch, D11-S07 On-call Staff, D11-S08 Availability, D12-S03 Audit Programme, D12-S04 Audit Finding & CAPA
-- OCMBR-005

CREATE TABLE IF NOT EXISTS "onx_emergency_resource" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "resource_type" varchar(50) NOT NULL,
  "resource_code" varchar(50) UNIQUE NOT NULL,
  "status" varchar(30) DEFAULT 'AVAILABLE' NOT NULL,
  "current_location" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_dispatch_event" (
  "id" serial PRIMARY KEY NOT NULL,
  "resource_id" integer NOT NULL REFERENCES "onx_emergency_resource"("id") ON DELETE RESTRICT,
  "emergency_case_id" integer,
  "dispatched_at" timestamp with time zone DEFAULT now() NOT NULL,
  "returned_at" timestamp with time zone,
  "dispatched_by_id" text REFERENCES "onx_user"("id") ON DELETE SET NULL,
  "destination" text NOT NULL,
  "outcome" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_oncall_schedule" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "staff_id" text NOT NULL REFERENCES "onx_user"("id") ON DELETE RESTRICT,
  "schedule_date" date NOT NULL,
  "start_hour" integer NOT NULL,
  "end_hour" integer NOT NULL,
  "role" varchar(100) NOT NULL,
  "is_primary" boolean DEFAULT true NOT NULL,
  "contact_phone" varchar(30),
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_oncall_callout" (
  "id" serial PRIMARY KEY NOT NULL,
  "schedule_id" integer REFERENCES "onx_oncall_schedule"("id") ON DELETE SET NULL,
  "staff_id" text NOT NULL REFERENCES "onx_user"("id") ON DELETE RESTRICT,
  "called_at" timestamp with time zone DEFAULT now() NOT NULL,
  "responded_at" timestamp with time zone,
  "outcome" varchar(50) DEFAULT 'PENDING' NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_availability_window" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "day_of_week" integer NOT NULL,
  "open_hour" integer NOT NULL,
  "close_hour" integer NOT NULL,
  "service_type" varchar(50) DEFAULT 'GENERAL' NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_availability_override" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "override_date" timestamp with time zone NOT NULL,
  "is_closed" boolean DEFAULT false NOT NULL,
  "open_hour" integer,
  "close_hour" integer,
  "reason" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_audit_programme" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "programme_name" varchar(255) NOT NULL,
  "audit_area" varchar(100) NOT NULL,
  "frequency" varchar(30) DEFAULT 'ANNUAL' NOT NULL,
  "owner_id" text REFERENCES "onx_user"("id") ON DELETE SET NULL,
  "status" varchar(30) DEFAULT 'ACTIVE' NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_audit_instance" (
  "id" serial PRIMARY KEY NOT NULL,
  "programme_id" integer NOT NULL REFERENCES "onx_audit_programme"("id") ON DELETE RESTRICT,
  "planned_date" date NOT NULL,
  "conducted_date" date,
  "auditor_id" text REFERENCES "onx_user"("id") ON DELETE SET NULL,
  "status" varchar(30) DEFAULT 'PLANNED' NOT NULL,
  "summary" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_audit_finding" (
  "id" serial PRIMARY KEY NOT NULL,
  "audit_instance_id" integer NOT NULL REFERENCES "onx_audit_instance"("id") ON DELETE RESTRICT,
  "finding_code" varchar(50) UNIQUE NOT NULL,
  "description" text NOT NULL,
  "severity" varchar(20) DEFAULT 'MINOR' NOT NULL,
  "status" varchar(30) DEFAULT 'OPEN' NOT NULL,
  "due_date" date,
  "closed_at" timestamp with time zone,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_capa" (
  "id" serial PRIMARY KEY NOT NULL,
  "finding_id" integer NOT NULL REFERENCES "onx_audit_finding"("id") ON DELETE RESTRICT,
  "capa_type" varchar(20) DEFAULT 'CORRECTIVE' NOT NULL,
  "description" text NOT NULL,
  "owner_id" text REFERENCES "onx_user"("id") ON DELETE SET NULL,
  "target_date" date NOT NULL,
  "completed_date" date,
  "status" varchar(30) DEFAULT 'OPEN' NOT NULL,
  "verification_evidence" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
