-- OCMBR Wave 2d migration
-- D09-S04 Treatment Plan, D03-S05 Bank Reconciliation, D04-S06 Supplier Returns, D09-S06 Prescription

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_treatment_plan" (
  "id" serial PRIMARY KEY NOT NULL,
  "plan_number" varchar(50) UNIQUE NOT NULL,
  "soap_note_id" integer,
  "pet_id" integer NOT NULL,
  "client_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "vet_id" text,
  "start_date" varchar(10) NOT NULL,
  "end_date" varchar(10),
  "diagnosis" text NOT NULL,
  "treatment_goal" text,
  "status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
  "total_estimated_cost" numeric(14,2) DEFAULT '0',
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_treatment_plan_item" (
  "id" serial PRIMARY KEY NOT NULL,
  "plan_id" integer NOT NULL,
  "sequence" integer DEFAULT 1 NOT NULL,
  "description" text NOT NULL,
  "scheduled_date" varchar(10),
  "estimated_cost" numeric(14,2) DEFAULT '0',
  "status" varchar(20) DEFAULT 'PENDING' NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_treatment_plan_item" ADD CONSTRAINT "onx_treatment_plan_item_plan_id_onx_treatment_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "onx_treatment_plan"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_bank_reconciliation" (
  "id" serial PRIMARY KEY NOT NULL,
  "reconciliation_number" varchar(50) UNIQUE NOT NULL,
  "account_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "statement_date" varchar(10) NOT NULL,
  "opening_balance" numeric(14,2) NOT NULL,
  "closing_balance" numeric(14,2) NOT NULL,
  "reconciled_balance" numeric(14,2) DEFAULT '0',
  "variance" numeric(14,2) DEFAULT '0',
  "status" varchar(20) DEFAULT 'DRAFT' NOT NULL,
  "reconciled_by" text,
  "reconciled_at" timestamp with time zone,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_bank_reconciliation_line" (
  "id" serial PRIMARY KEY NOT NULL,
  "reconciliation_id" integer NOT NULL,
  "transaction_date" varchar(10) NOT NULL,
  "description" text NOT NULL,
  "debit" numeric(14,2) DEFAULT '0',
  "credit" numeric(14,2) DEFAULT '0',
  "reference_type" varchar(30),
  "reference_id" integer,
  "is_matched" integer DEFAULT 0 NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_bank_reconciliation_line" ADD CONSTRAINT "onx_bank_reconciliation_line_reconciliation_id_fk" FOREIGN KEY ("reconciliation_id") REFERENCES "onx_bank_reconciliation"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_supplier_return" (
  "id" serial PRIMARY KEY NOT NULL,
  "return_number" varchar(50) UNIQUE NOT NULL,
  "grn_id" integer NOT NULL,
  "vendor_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "return_date" varchar(10) NOT NULL,
  "reason" varchar(100) NOT NULL,
  "total_amount" numeric(14,2) DEFAULT '0',
  "status" varchar(20) DEFAULT 'DRAFT' NOT NULL,
  "debit_note_reference" varchar(80),
  "processed_by" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_supplier_return_line" (
  "id" serial PRIMARY KEY NOT NULL,
  "return_id" integer NOT NULL,
  "grn_line_id" integer,
  "item_id" integer NOT NULL,
  "return_qty" numeric(12,3) NOT NULL,
  "unit_cost" numeric(12,4) NOT NULL,
  "line_total" numeric(14,2) NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_supplier_return_line" ADD CONSTRAINT "onx_supplier_return_line_return_id_fk" FOREIGN KEY ("return_id") REFERENCES "onx_supplier_return"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_prescription" (
  "id" serial PRIMARY KEY NOT NULL,
  "prescription_number" varchar(50) UNIQUE NOT NULL,
  "treatment_plan_id" integer,
  "pet_id" integer NOT NULL,
  "client_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "prescribed_by" text,
  "prescription_date" varchar(10) NOT NULL,
  "valid_until" varchar(10),
  "status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
  "dispensed_by" text,
  "dispensed_at" timestamp with time zone,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_prescription_line" (
  "id" serial PRIMARY KEY NOT NULL,
  "prescription_id" integer NOT NULL,
  "item_id" integer NOT NULL,
  "batch_id" integer,
  "quantity" numeric(12,3) NOT NULL,
  "unit_of_measure" varchar(30),
  "dosage" varchar(100),
  "frequency" varchar(80),
  "duration" varchar(80),
  "instructions" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_prescription_line" ADD CONSTRAINT "onx_prescription_line_prescription_id_fk" FOREIGN KEY ("prescription_id") REFERENCES "onx_prescription"("id") ON DELETE cascade ON UPDATE no action;
