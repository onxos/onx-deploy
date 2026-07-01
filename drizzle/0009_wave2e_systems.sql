-- OCMBR Wave 2e migration
-- D08-S02 Catalogue, D08-S05 Cash Reconciliation, D08-S09 Shift Management, D02-S02 Recruitment, D07-S02 Pet Profile

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_catalogue_category" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer NOT NULL,
  "name" varchar(100) NOT NULL,
  "description" text,
  "parent_category_id" integer,
  "sort_order" integer DEFAULT 0,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_catalogue_entry" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer NOT NULL,
  "category_id" integer,
  "item_id" integer,
  "sku" varchar(80) UNIQUE,
  "name" varchar(150) NOT NULL,
  "description" text,
  "type" varchar(20) DEFAULT 'SERVICE' NOT NULL,
  "base_price" numeric(12,2) NOT NULL,
  "tax_rate" numeric(5,2) DEFAULT '0',
  "is_active" boolean DEFAULT true NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_cash_reconciliation" (
  "id" serial PRIMARY KEY NOT NULL,
  "reconciliation_number" varchar(50) UNIQUE NOT NULL,
  "shift_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "reconciliation_date" varchar(10) NOT NULL,
  "opening_float" numeric(12,2) DEFAULT '0',
  "system_expected" numeric(12,2) NOT NULL,
  "physical_count" numeric(12,2) NOT NULL,
  "variance" numeric(12,2) DEFAULT '0',
  "status" varchar(20) DEFAULT 'DRAFT' NOT NULL,
  "reconciled_by" text,
  "approved_by" text,
  "approved_at" timestamp with time zone,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_cash_denomination" (
  "id" serial PRIMARY KEY NOT NULL,
  "reconciliation_id" integer NOT NULL,
  "denomination" numeric(10,2) NOT NULL,
  "quantity" integer DEFAULT 0 NOT NULL,
  "subtotal" numeric(12,2) NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_cash_denomination" ADD CONSTRAINT "onx_cash_denomination_reconciliation_id_fk" FOREIGN KEY ("reconciliation_id") REFERENCES "onx_cash_reconciliation"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_till_close" (
  "id" serial PRIMARY KEY NOT NULL,
  "shift_id" integer NOT NULL,
  "terminal_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "closed_at" timestamp with time zone NOT NULL,
  "closed_by" text NOT NULL,
  "total_sales" numeric(14,2) DEFAULT '0',
  "total_refunds" numeric(14,2) DEFAULT '0',
  "net_sales" numeric(14,2) DEFAULT '0',
  "transaction_count" integer DEFAULT 0,
  "status" varchar(20) DEFAULT 'CLOSED' NOT NULL,
  "supervisor_notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_shift_event" (
  "id" serial PRIMARY KEY NOT NULL,
  "shift_id" integer NOT NULL,
  "event_type" varchar(30) NOT NULL,
  "event_at" timestamp with time zone DEFAULT now() NOT NULL,
  "recorded_by" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_shift_event" ADD CONSTRAINT "onx_shift_event_shift_id_fk" FOREIGN KEY ("shift_id") REFERENCES "onx_pos_shift"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_job_posting" (
  "id" serial PRIMARY KEY NOT NULL,
  "posting_number" varchar(50) UNIQUE NOT NULL,
  "branch_id" integer NOT NULL,
  "department_id" integer,
  "title" varchar(150) NOT NULL,
  "job_description" text,
  "requirements" text,
  "vacancy_count" integer DEFAULT 1 NOT NULL,
  "closing_date" varchar(10),
  "status" varchar(20) DEFAULT 'OPEN' NOT NULL,
  "posted_by" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_job_application" (
  "id" serial PRIMARY KEY NOT NULL,
  "application_number" varchar(50) UNIQUE NOT NULL,
  "posting_id" integer NOT NULL,
  "candidate_name" varchar(150) NOT NULL,
  "email" varchar(150) NOT NULL,
  "phone" varchar(30),
  "resume_url" text,
  "cover_letter" text,
  "status" varchar(30) DEFAULT 'RECEIVED' NOT NULL,
  "reviewed_by" text,
  "notes" text,
  "applied_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_job_application" ADD CONSTRAINT "onx_job_application_posting_id_fk" FOREIGN KEY ("posting_id") REFERENCES "onx_job_posting"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_onboarding_task" (
  "id" serial PRIMARY KEY NOT NULL,
  "employee_id" integer NOT NULL,
  "task_name" varchar(150) NOT NULL,
  "description" text,
  "due_date" varchar(10),
  "assigned_to" text,
  "status" varchar(20) DEFAULT 'PENDING' NOT NULL,
  "completed_at" timestamp with time zone,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_onboarding_task" ADD CONSTRAINT "onx_onboarding_task_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "onx_employee"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_pet_medical_alert" (
  "id" serial PRIMARY KEY NOT NULL,
  "pet_id" integer NOT NULL,
  "client_id" integer NOT NULL,
  "alert_type" varchar(50) NOT NULL,
  "description" text NOT NULL,
  "severity" varchar(20) DEFAULT 'MEDIUM' NOT NULL,
  "is_active" integer DEFAULT 1 NOT NULL,
  "resolved_at" timestamp with time zone,
  "recorded_by" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_pet_medical_alert" ADD CONSTRAINT "onx_pet_medical_alert_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "onx_pet"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_pet_weight_record" (
  "id" serial PRIMARY KEY NOT NULL,
  "pet_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "record_date" varchar(10) NOT NULL,
  "weight_kg" varchar(10) NOT NULL,
  "recorded_by" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_pet_weight_record" ADD CONSTRAINT "onx_pet_weight_record_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "onx_pet"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_pet_document" (
  "id" serial PRIMARY KEY NOT NULL,
  "pet_id" integer NOT NULL,
  "document_type" varchar(50) NOT NULL,
  "title" varchar(150) NOT NULL,
  "file_url" text NOT NULL,
  "uploaded_by" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_pet_document" ADD CONSTRAINT "onx_pet_document_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "onx_pet"("id") ON DELETE cascade ON UPDATE no action;
