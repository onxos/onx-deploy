-- OCMBR Wave 1 — Migration 0004
-- Systems: D07-S01 (CRM), D02-S01 (HR), D05-S01 (Inventory),
--          D04-S01 (Procurement), D06-S01 (Insurance), D03-S01 (Finance CoA),
--          D09-S01 (Clinical), D03-S02 (GL), D08-S01 (POS)
-- All tables use IF NOT EXISTS guards (hand-crafted migration).

-- ============================================================
-- D07-S01: CRM Foundation
-- ============================================================

CREATE TABLE IF NOT EXISTS "onx_client" (
        "id" serial PRIMARY KEY NOT NULL,
        "branch_id" integer NOT NULL,
        "tenant_id" integer,
        "first_name" varchar(100) NOT NULL,
        "last_name" varchar(100) NOT NULL,
        "display_name" varchar(200),
        "email" varchar(256),
        "phone" varchar(30) NOT NULL,
        "alternate_phone" varchar(30),
        "national_id" varchar(50),
        "date_of_birth" date,
        "gender" varchar(10),
        "address" text,
        "city" varchar(100),
        "country" varchar(2) DEFAULT 'SA',
        "loyalty_tier" varchar(20) DEFAULT 'STANDARD' NOT NULL,
        "total_visits" integer DEFAULT 0 NOT NULL,
        "notes" text,
        "is_active" boolean DEFAULT true NOT NULL,
        "referred_by_id" integer,
        "metadata" jsonb,
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamptz
);
--> statement-breakpoint
ALTER TABLE "onx_client" ADD CONSTRAINT "onx_client_branch_id_onx_branch_id_fk"
        FOREIGN KEY ("branch_id") REFERENCES "public"."onx_branch"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_client_branch_idx" ON "onx_client" USING btree ("branch_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_client_phone_idx" ON "onx_client" USING btree ("phone");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_client_email_idx" ON "onx_client" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_client_loyalty_idx" ON "onx_client" USING btree ("loyalty_tier");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_client_active_idx" ON "onx_client" USING btree ("is_active");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_pet" (
        "id" serial PRIMARY KEY NOT NULL,
        "client_id" integer NOT NULL,
        "branch_id" integer NOT NULL,
        "name" varchar(100) NOT NULL,
        "species" varchar(50) NOT NULL,
        "breed" varchar(100),
        "color" varchar(100),
        "gender" varchar(10),
        "date_of_birth" date,
        "microchip_number" varchar(50),
        "is_neutered" boolean DEFAULT false NOT NULL,
        "weight_kg" numeric(5,2),
        "notes" text,
        "is_active" boolean DEFAULT true NOT NULL,
        "metadata" jsonb,
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamptz,
        CONSTRAINT "onx_pet_microchip_number_unique" UNIQUE("microchip_number")
);
--> statement-breakpoint
ALTER TABLE "onx_pet" ADD CONSTRAINT "onx_pet_client_id_onx_client_id_fk"
        FOREIGN KEY ("client_id") REFERENCES "public"."onx_client"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_pet" ADD CONSTRAINT "onx_pet_branch_id_onx_branch_id_fk"
        FOREIGN KEY ("branch_id") REFERENCES "public"."onx_branch"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_pet_client_idx" ON "onx_pet" USING btree ("client_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_pet_branch_idx" ON "onx_pet" USING btree ("branch_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_pet_species_idx" ON "onx_pet" USING btree ("species");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_pet_active_idx" ON "onx_pet" USING btree ("is_active");
--> statement-breakpoint

-- ============================================================
-- D02-S01: HR Foundation
-- ============================================================

CREATE TABLE IF NOT EXISTS "onx_department" (
        "id" serial PRIMARY KEY NOT NULL,
        "branch_id" integer NOT NULL,
        "code" varchar(30) NOT NULL,
        "name" varchar(150) NOT NULL,
        "parent_id" integer,
        "head_employee_id" integer,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamptz,
        CONSTRAINT "onx_department_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "onx_department" ADD CONSTRAINT "onx_department_branch_id_onx_branch_id_fk"
        FOREIGN KEY ("branch_id") REFERENCES "public"."onx_branch"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_dept_branch_idx" ON "onx_department" USING btree ("branch_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_dept_parent_idx" ON "onx_department" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_dept_active_idx" ON "onx_department" USING btree ("is_active");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_employee" (
        "id" serial PRIMARY KEY NOT NULL,
        "branch_id" integer NOT NULL,
        "tenant_id" integer,
        "employee_number" varchar(30) NOT NULL,
        "user_id" text,
        "first_name" varchar(100) NOT NULL,
        "last_name" varchar(100) NOT NULL,
        "display_name" varchar(200),
        "email" varchar(256) NOT NULL,
        "phone" varchar(30),
        "job_title" varchar(150),
        "department_id" integer,
        "employment_type" varchar(20) DEFAULT 'FULL_TIME' NOT NULL,
        "status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
        "hire_date" date NOT NULL,
        "termination_date" date,
        "manager_id" integer,
        "national_id" varchar(50),
        "nationality" varchar(3) DEFAULT 'SAU',
        "date_of_birth" date,
        "gender" varchar(10),
        "salary" numeric(12,2),
        "metadata" text,
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamptz,
        CONSTRAINT "onx_employee_employee_number_unique" UNIQUE("employee_number")
);
--> statement-breakpoint
ALTER TABLE "onx_employee" ADD CONSTRAINT "onx_employee_branch_id_onx_branch_id_fk"
        FOREIGN KEY ("branch_id") REFERENCES "public"."onx_branch"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_employee" ADD CONSTRAINT "onx_employee_user_id_user_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_employee" ADD CONSTRAINT "onx_employee_department_id_onx_department_id_fk"
        FOREIGN KEY ("department_id") REFERENCES "public"."onx_department"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_employee_branch_idx" ON "onx_employee" USING btree ("branch_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_employee_dept_idx" ON "onx_employee" USING btree ("department_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_employee_status_idx" ON "onx_employee" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_employee_user_idx" ON "onx_employee" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_employee_number_idx" ON "onx_employee" USING btree ("employee_number");
--> statement-breakpoint

-- ============================================================
-- D05-S01: Inventory Foundation
-- ============================================================

CREATE TABLE IF NOT EXISTS "onx_item_category" (
        "id" serial PRIMARY KEY NOT NULL,
        "code" varchar(30) NOT NULL,
        "name" varchar(150) NOT NULL,
        "parent_id" integer,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT "onx_item_category_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_item_cat_parent_idx" ON "onx_item_category" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_item_cat_active_idx" ON "onx_item_category" USING btree ("is_active");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_item" (
        "id" serial PRIMARY KEY NOT NULL,
        "sku" varchar(50) NOT NULL,
        "name" varchar(200) NOT NULL,
        "barcode" varchar(100),
        "category_id" integer,
        "item_type" varchar(20) DEFAULT 'PRODUCT' NOT NULL,
        "unit" varchar(20) DEFAULT 'EACH' NOT NULL,
        "unit_price" numeric(12,2) DEFAULT '0' NOT NULL,
        "cost_price" numeric(12,2),
        "tax_rate" numeric(5,4) DEFAULT '0.15' NOT NULL,
        "is_vat_exempt" boolean DEFAULT false NOT NULL,
        "requires_prescription" boolean DEFAULT false NOT NULL,
        "description" text,
        "is_active" boolean DEFAULT true NOT NULL,
        "metadata" jsonb,
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamptz,
        CONSTRAINT "onx_item_sku_unique" UNIQUE("sku"),
        CONSTRAINT "onx_item_barcode_unique" UNIQUE("barcode")
);
--> statement-breakpoint
ALTER TABLE "onx_item" ADD CONSTRAINT "onx_item_category_id_onx_item_category_id_fk"
        FOREIGN KEY ("category_id") REFERENCES "public"."onx_item_category"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_item_category_idx" ON "onx_item" USING btree ("category_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_item_type_idx" ON "onx_item" USING btree ("item_type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_item_active_idx" ON "onx_item" USING btree ("is_active");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_item_sku_idx" ON "onx_item" USING btree ("sku");
--> statement-breakpoint

-- ============================================================
-- D04-S01: Procurement Foundation
-- ============================================================

CREATE TABLE IF NOT EXISTS "onx_vendor" (
        "id" serial PRIMARY KEY NOT NULL,
        "code" varchar(30) NOT NULL,
        "name" varchar(200) NOT NULL,
        "vendor_type" varchar(30) DEFAULT 'SUPPLIER' NOT NULL,
        "contact_name" varchar(150),
        "email" varchar(256),
        "phone" varchar(30),
        "address" text,
        "city" varchar(100),
        "country" varchar(2) DEFAULT 'SA',
        "tax_number" varchar(50),
        "bank_name" varchar(100),
        "bank_iban" varchar(50),
        "payment_terms_days" integer DEFAULT 30 NOT NULL,
        "credit_limit" numeric(12,2) DEFAULT '0' NOT NULL,
        "status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
        "qualification_status" varchar(20) DEFAULT 'PENDING' NOT NULL,
        "branch_id" integer,
        "tenant_id" integer,
        "notes" text,
        "metadata" jsonb,
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamptz,
        CONSTRAINT "onx_vendor_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "onx_vendor" ADD CONSTRAINT "onx_vendor_branch_id_onx_branch_id_fk"
        FOREIGN KEY ("branch_id") REFERENCES "public"."onx_branch"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_vendor_code_idx" ON "onx_vendor" USING btree ("code");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_vendor_status_idx" ON "onx_vendor" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_vendor_qualification_idx" ON "onx_vendor" USING btree ("qualification_status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_vendor_branch_idx" ON "onx_vendor" USING btree ("branch_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_vendor_type_idx" ON "onx_vendor" USING btree ("vendor_type");
--> statement-breakpoint

-- ============================================================
-- D06-S01: Insurance Foundation
-- ============================================================

CREATE TABLE IF NOT EXISTS "onx_insurance_company" (
        "id" serial PRIMARY KEY NOT NULL,
        "code" varchar(30) NOT NULL,
        "name" varchar(200) NOT NULL,
        "license_number" varchar(100),
        "contact_name" varchar(150),
        "email" varchar(256),
        "phone" varchar(30),
        "address" text,
        "portal_url" varchar(500),
        "submission_email" varchar(256),
        "status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
        "contract_start_date" date,
        "contract_end_date" date,
        "credit_days" integer DEFAULT 30 NOT NULL,
        "notes" text,
        "branch_id" integer,
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamptz,
        CONSTRAINT "onx_insurance_company_code_unique" UNIQUE("code"),
        CONSTRAINT "onx_insurance_company_license_number_unique" UNIQUE("license_number")
);
--> statement-breakpoint
ALTER TABLE "onx_insurance_company" ADD CONSTRAINT "onx_insurance_company_branch_id_onx_branch_id_fk"
        FOREIGN KEY ("branch_id") REFERENCES "public"."onx_branch"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_insurance_co_code_idx" ON "onx_insurance_company" USING btree ("code");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_insurance_co_status_idx" ON "onx_insurance_company" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_insurance_co_branch_idx" ON "onx_insurance_company" USING btree ("branch_id");
--> statement-breakpoint

-- ============================================================
-- D03-S01: Finance Foundation (Chart of Accounts)
-- ============================================================

CREATE TABLE IF NOT EXISTS "onx_account" (
        "id" serial PRIMARY KEY NOT NULL,
        "code" varchar(30) NOT NULL,
        "name" varchar(200) NOT NULL,
        "account_type" varchar(20) NOT NULL,
        "subtype" varchar(100),
        "parent_id" integer,
        "level" integer DEFAULT 1 NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "is_system_account" boolean DEFAULT false NOT NULL,
        "description" text,
        "branch_id" integer,
        "tenant_id" integer,
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamptz,
        CONSTRAINT "onx_account_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "onx_account" ADD CONSTRAINT "onx_account_branch_id_onx_branch_id_fk"
        FOREIGN KEY ("branch_id") REFERENCES "public"."onx_branch"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_account_code_idx" ON "onx_account" USING btree ("code");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_account_type_idx" ON "onx_account" USING btree ("account_type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_account_parent_idx" ON "onx_account" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_account_branch_idx" ON "onx_account" USING btree ("branch_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_account_active_idx" ON "onx_account" USING btree ("is_active");
--> statement-breakpoint

-- ============================================================
-- D09-S01: Clinical Foundation
-- ============================================================

CREATE TABLE IF NOT EXISTS "onx_patient_visit" (
        "id" serial PRIMARY KEY NOT NULL,
        "visit_number" varchar(30) NOT NULL,
        "pet_id" integer NOT NULL,
        "branch_id" integer NOT NULL,
        "visit_type" varchar(30) DEFAULT 'OUTPATIENT' NOT NULL,
        "status" varchar(30) DEFAULT 'PENDING' NOT NULL,
        "scheduled_at" timestamptz,
        "check_in_at" timestamptz,
        "check_out_at" timestamptz,
        "assigned_vet_id" text,
        "chief_complaint" text,
        "weight_kg" numeric(5,2),
        "notes" text,
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamptz,
        CONSTRAINT "onx_patient_visit_visit_number_unique" UNIQUE("visit_number")
);
--> statement-breakpoint
ALTER TABLE "onx_patient_visit" ADD CONSTRAINT "onx_patient_visit_pet_id_onx_pet_id_fk"
        FOREIGN KEY ("pet_id") REFERENCES "public"."onx_pet"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_patient_visit" ADD CONSTRAINT "onx_patient_visit_branch_id_onx_branch_id_fk"
        FOREIGN KEY ("branch_id") REFERENCES "public"."onx_branch"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_patient_visit" ADD CONSTRAINT "onx_patient_visit_assigned_vet_id_user_id_fk"
        FOREIGN KEY ("assigned_vet_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_visit_pet_idx" ON "onx_patient_visit" USING btree ("pet_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_visit_branch_idx" ON "onx_patient_visit" USING btree ("branch_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_visit_status_idx" ON "onx_patient_visit" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_visit_type_idx" ON "onx_patient_visit" USING btree ("visit_type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_visit_vet_idx" ON "onx_patient_visit" USING btree ("assigned_vet_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_visit_scheduled_idx" ON "onx_patient_visit" USING btree ("scheduled_at");
--> statement-breakpoint

-- ============================================================
-- D03-S02: General Ledger Foundation
-- ============================================================

CREATE TABLE IF NOT EXISTS "onx_gl_period" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(100) NOT NULL,
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        "status" varchar(20) DEFAULT 'OPEN' NOT NULL,
        "branch_id" integer,
        "tenant_id" integer,
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_gl_period" ADD CONSTRAINT "onx_gl_period_branch_id_onx_branch_id_fk"
        FOREIGN KEY ("branch_id") REFERENCES "public"."onx_branch"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_gl_period_branch_idx" ON "onx_gl_period" USING btree ("branch_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_gl_period_status_idx" ON "onx_gl_period" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_gl_period_dates_idx" ON "onx_gl_period" USING btree ("start_date", "end_date");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_gl_entry" (
        "id" serial PRIMARY KEY NOT NULL,
        "entry_number" varchar(50) NOT NULL,
        "entry_type" varchar(30) DEFAULT 'JOURNAL' NOT NULL,
        "period_id" integer,
        "branch_id" integer NOT NULL,
        "description" varchar(500) NOT NULL,
        "total_debit" numeric(15,2) DEFAULT '0' NOT NULL,
        "total_credit" numeric(15,2) DEFAULT '0' NOT NULL,
        "status" varchar(20) DEFAULT 'DRAFT' NOT NULL,
        "posted_at" timestamptz,
        "created_by" text,
        "reference_type" varchar(50),
        "reference_id" varchar(100),
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamptz,
        CONSTRAINT "onx_gl_entry_entry_number_unique" UNIQUE("entry_number")
);
--> statement-breakpoint
ALTER TABLE "onx_gl_entry" ADD CONSTRAINT "onx_gl_entry_period_id_onx_gl_period_id_fk"
        FOREIGN KEY ("period_id") REFERENCES "public"."onx_gl_period"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_gl_entry" ADD CONSTRAINT "onx_gl_entry_branch_id_onx_branch_id_fk"
        FOREIGN KEY ("branch_id") REFERENCES "public"."onx_branch"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_gl_entry" ADD CONSTRAINT "onx_gl_entry_created_by_user_id_fk"
        FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_gl_entry_branch_idx" ON "onx_gl_entry" USING btree ("branch_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_gl_entry_period_idx" ON "onx_gl_entry" USING btree ("period_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_gl_entry_status_idx" ON "onx_gl_entry" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_gl_entry_type_idx" ON "onx_gl_entry" USING btree ("entry_type");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_gl_entry_line" (
        "id" serial PRIMARY KEY NOT NULL,
        "entry_id" integer NOT NULL,
        "line_number" integer NOT NULL,
        "account_id" integer NOT NULL,
        "debit" numeric(15,2) DEFAULT '0' NOT NULL,
        "credit" numeric(15,2) DEFAULT '0' NOT NULL,
        "description" varchar(500),
        "cost_center" varchar(100),
        "reference_id" varchar(100),
        "reference_type" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "onx_gl_entry_line" ADD CONSTRAINT "onx_gl_entry_line_entry_id_onx_gl_entry_id_fk"
        FOREIGN KEY ("entry_id") REFERENCES "public"."onx_gl_entry"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_gl_entry_line" ADD CONSTRAINT "onx_gl_entry_line_account_id_onx_account_id_fk"
        FOREIGN KEY ("account_id") REFERENCES "public"."onx_account"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_gl_line_entry_idx" ON "onx_gl_entry_line" USING btree ("entry_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_gl_line_account_idx" ON "onx_gl_entry_line" USING btree ("account_id");
--> statement-breakpoint

-- ============================================================
-- D08-S01: POS Foundation
-- ============================================================

CREATE TABLE IF NOT EXISTS "onx_pos_terminal" (
        "id" serial PRIMARY KEY NOT NULL,
        "branch_id" integer NOT NULL,
        "terminal_code" varchar(30) NOT NULL,
        "terminal_name" varchar(100) NOT NULL,
        "status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
        "ip_address" varchar(50),
        "last_heartbeat" timestamptz,
        "current_shift_id" integer,
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamptz,
        CONSTRAINT "onx_pos_terminal_terminal_code_unique" UNIQUE("terminal_code")
);
--> statement-breakpoint
ALTER TABLE "onx_pos_terminal" ADD CONSTRAINT "onx_pos_terminal_branch_id_onx_branch_id_fk"
        FOREIGN KEY ("branch_id") REFERENCES "public"."onx_branch"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_pos_terminal_branch_idx" ON "onx_pos_terminal" USING btree ("branch_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_pos_terminal_status_idx" ON "onx_pos_terminal" USING btree ("status");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_pos_shift" (
        "id" serial PRIMARY KEY NOT NULL,
        "terminal_id" integer NOT NULL,
        "branch_id" integer NOT NULL,
        "cashier_id" text NOT NULL,
        "opened_at" timestamptz NOT NULL,
        "closed_at" timestamptz,
        "opening_balance" numeric(12,2) DEFAULT '0' NOT NULL,
        "closing_balance" numeric(12,2),
        "total_sales" numeric(12,2) DEFAULT '0' NOT NULL,
        "total_refunds" numeric(12,2) DEFAULT '0' NOT NULL,
        "status" varchar(20) DEFAULT 'OPEN' NOT NULL,
        "notes" text,
        "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_pos_shift" ADD CONSTRAINT "onx_pos_shift_terminal_id_onx_pos_terminal_id_fk"
        FOREIGN KEY ("terminal_id") REFERENCES "public"."onx_pos_terminal"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_pos_shift" ADD CONSTRAINT "onx_pos_shift_branch_id_onx_branch_id_fk"
        FOREIGN KEY ("branch_id") REFERENCES "public"."onx_branch"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_pos_shift" ADD CONSTRAINT "onx_pos_shift_cashier_id_user_id_fk"
        FOREIGN KEY ("cashier_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_pos_shift_terminal_idx" ON "onx_pos_shift" USING btree ("terminal_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_pos_shift_branch_idx" ON "onx_pos_shift" USING btree ("branch_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_pos_shift_cashier_idx" ON "onx_pos_shift" USING btree ("cashier_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_pos_shift_status_idx" ON "onx_pos_shift" USING btree ("status");
