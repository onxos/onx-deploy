-- OCMBR Wave 2a — D02-S03, D02-S04, D03-S03, D04-S02, D04-S09, D05-S04, D06-S02, D09-S02, D09-S05
-- Migration: 0005_wave2a_systems
-- 14 new tables

---------------------------------------------------------------------------
-- D02-S03: Attendance & Timesheet
---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_timesheet_entry" (
  "id" serial PRIMARY KEY,
  "employee_id" integer NOT NULL REFERENCES "onx_employee"("id") ON DELETE RESTRICT,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "entry_date" varchar(10) NOT NULL,
  "clock_in" timestamp with time zone,
  "clock_out" timestamp with time zone,
  "break_minutes" integer DEFAULT 0 NOT NULL,
  "overtime_minutes" integer DEFAULT 0 NOT NULL,
  "regular_hours" numeric(5,2),
  "status" varchar(20) DEFAULT 'PENDING' NOT NULL,
  "approved_by" text REFERENCES "user"("id") ON DELETE SET NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "onx_timesheet_employee_date_idx" ON "onx_timesheet_entry"("employee_id","entry_date");
CREATE INDEX IF NOT EXISTS "onx_timesheet_branch_date_idx" ON "onx_timesheet_entry"("branch_id","entry_date");
CREATE INDEX IF NOT EXISTS "onx_timesheet_status_idx" ON "onx_timesheet_entry"("status");

---------------------------------------------------------------------------
-- D02-S04: Leave Management
---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_leave_type" (
  "id" serial PRIMARY KEY,
  "code" varchar(20) NOT NULL UNIQUE,
  "name" varchar(100) NOT NULL,
  "max_days_per_year" numeric(5,1) DEFAULT '21',
  "carry_over_days" integer DEFAULT 0 NOT NULL,
  "is_paid" boolean DEFAULT true NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "onx_leave_type_code_idx" ON "onx_leave_type"("code");

CREATE TABLE IF NOT EXISTS "onx_leave_request" (
  "id" serial PRIMARY KEY,
  "employee_id" integer NOT NULL REFERENCES "onx_employee"("id") ON DELETE RESTRICT,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "leave_type_id" integer NOT NULL REFERENCES "onx_leave_type"("id") ON DELETE RESTRICT,
  "start_date" varchar(10) NOT NULL,
  "end_date" varchar(10) NOT NULL,
  "total_days" numeric(5,1) NOT NULL,
  "status" varchar(20) DEFAULT 'PENDING' NOT NULL,
  "reason" text,
  "reviewed_by" text REFERENCES "user"("id") ON DELETE SET NULL,
  "reviewed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "onx_leave_req_employee_idx" ON "onx_leave_request"("employee_id");
CREATE INDEX IF NOT EXISTS "onx_leave_req_status_idx" ON "onx_leave_request"("status");
CREATE INDEX IF NOT EXISTS "onx_leave_req_dates_idx" ON "onx_leave_request"("start_date","end_date");

---------------------------------------------------------------------------
-- D03-S03: Accounts Receivable
---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_ar_invoice" (
  "id" serial PRIMARY KEY,
  "invoice_number" varchar(50) NOT NULL UNIQUE,
  "client_id" integer NOT NULL REFERENCES "onx_client"("id") ON DELETE RESTRICT,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "account_id" integer REFERENCES "onx_account"("id") ON DELETE SET NULL,
  "issue_date" varchar(10) NOT NULL,
  "due_date" varchar(10) NOT NULL,
  "subtotal" numeric(14,2) NOT NULL,
  "tax_amount" numeric(14,2) DEFAULT '0',
  "total_amount" numeric(14,2) NOT NULL,
  "paid_amount" numeric(14,2) DEFAULT '0',
  "status" varchar(30) DEFAULT 'DRAFT' NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "onx_ar_invoice_number_idx" ON "onx_ar_invoice"("invoice_number");
CREATE INDEX IF NOT EXISTS "onx_ar_invoice_client_idx" ON "onx_ar_invoice"("client_id");
CREATE INDEX IF NOT EXISTS "onx_ar_invoice_status_idx" ON "onx_ar_invoice"("status");
CREATE INDEX IF NOT EXISTS "onx_ar_invoice_due_idx" ON "onx_ar_invoice"("due_date");

CREATE TABLE IF NOT EXISTS "onx_ar_payment" (
  "id" serial PRIMARY KEY,
  "invoice_id" integer NOT NULL REFERENCES "onx_ar_invoice"("id") ON DELETE CASCADE,
  "payment_date" varchar(10) NOT NULL,
  "amount" numeric(14,2) NOT NULL,
  "payment_method" varchar(50) DEFAULT 'CASH' NOT NULL,
  "reference" varchar(100),
  "notes" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "onx_ar_payment_invoice_idx" ON "onx_ar_payment"("invoice_id");
CREATE INDEX IF NOT EXISTS "onx_ar_payment_date_idx" ON "onx_ar_payment"("payment_date");

---------------------------------------------------------------------------
-- D04-S02: Purchase Requisition
---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_purchase_requisition" (
  "id" serial PRIMARY KEY,
  "pr_number" varchar(50) NOT NULL UNIQUE,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "requested_by" text NOT NULL REFERENCES "user"("id") ON DELETE RESTRICT,
  "department_id" integer REFERENCES "onx_department"("id") ON DELETE SET NULL,
  "status" varchar(30) DEFAULT 'DRAFT' NOT NULL,
  "required_date" varchar(10),
  "total_estimated_cost" numeric(14,2) DEFAULT '0',
  "notes" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "onx_pr_number_idx" ON "onx_purchase_requisition"("pr_number");
CREATE INDEX IF NOT EXISTS "onx_pr_branch_idx" ON "onx_purchase_requisition"("branch_id");
CREATE INDEX IF NOT EXISTS "onx_pr_status_idx" ON "onx_purchase_requisition"("status");
CREATE INDEX IF NOT EXISTS "onx_pr_requested_by_idx" ON "onx_purchase_requisition"("requested_by");

CREATE TABLE IF NOT EXISTS "onx_pr_line" (
  "id" serial PRIMARY KEY,
  "pr_id" integer NOT NULL REFERENCES "onx_purchase_requisition"("id") ON DELETE CASCADE,
  "line_number" integer NOT NULL,
  "item_id" integer NOT NULL REFERENCES "onx_item"("id") ON DELETE RESTRICT,
  "requested_qty" numeric(12,3) NOT NULL,
  "estimated_unit_price" numeric(12,2) DEFAULT '0',
  "total_estimated" numeric(14,2) DEFAULT '0',
  "notes" text
);

CREATE INDEX IF NOT EXISTS "onx_pr_line_pr_idx" ON "onx_pr_line"("pr_id");
CREATE INDEX IF NOT EXISTS "onx_pr_line_item_idx" ON "onx_pr_line"("item_id");

---------------------------------------------------------------------------
-- D04-S09: Procurement Approval Workflow
---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_approval_workflow" (
  "id" serial PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "entity_type" varchar(50) NOT NULL,
  "approver_user_id" text NOT NULL REFERENCES "user"("id") ON DELETE RESTRICT,
  "sequence" integer DEFAULT 1 NOT NULL,
  "min_amount" numeric(14,2) DEFAULT '0',
  "max_amount" numeric(14,2),
  "branch_id" integer REFERENCES "onx_branch"("id") ON DELETE CASCADE,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "onx_approval_wf_entity_idx" ON "onx_approval_workflow"("entity_type");
CREATE INDEX IF NOT EXISTS "onx_approval_wf_approver_idx" ON "onx_approval_workflow"("approver_user_id");
CREATE INDEX IF NOT EXISTS "onx_approval_wf_branch_idx" ON "onx_approval_workflow"("branch_id");

CREATE TABLE IF NOT EXISTS "onx_approval_record" (
  "id" serial PRIMARY KEY,
  "entity_type" varchar(50) NOT NULL,
  "entity_id" integer NOT NULL,
  "workflow_id" integer REFERENCES "onx_approval_workflow"("id") ON DELETE SET NULL,
  "approver_user_id" text NOT NULL REFERENCES "user"("id") ON DELETE RESTRICT,
  "status" varchar(20) DEFAULT 'PENDING' NOT NULL,
  "comment" text,
  "decided_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "onx_approval_record_entity_idx" ON "onx_approval_record"("entity_type","entity_id");
CREATE INDEX IF NOT EXISTS "onx_approval_record_approver_idx" ON "onx_approval_record"("approver_user_id");
CREATE INDEX IF NOT EXISTS "onx_approval_record_status_idx" ON "onx_approval_record"("status");

---------------------------------------------------------------------------
-- D05-S04: Stock In / Out / Transfer
---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_stock_movement" (
  "id" serial PRIMARY KEY,
  "movement_number" varchar(50) NOT NULL UNIQUE,
  "item_id" integer NOT NULL REFERENCES "onx_item"("id") ON DELETE RESTRICT,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "movement_type" varchar(30) NOT NULL,
  "quantity" numeric(12,3) NOT NULL,
  "unit_cost" numeric(12,4) DEFAULT '0',
  "reference_type" varchar(50),
  "reference_id" integer,
  "from_branch_id" integer REFERENCES "onx_branch"("id") ON DELETE SET NULL,
  "to_branch_id" integer REFERENCES "onx_branch"("id") ON DELETE SET NULL,
  "notes" text,
  "created_by" text NOT NULL REFERENCES "user"("id") ON DELETE RESTRICT,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "onx_stock_mvt_item_branch_idx" ON "onx_stock_movement"("item_id","branch_id");
CREATE INDEX IF NOT EXISTS "onx_stock_mvt_type_idx" ON "onx_stock_movement"("movement_type");
CREATE INDEX IF NOT EXISTS "onx_stock_mvt_ref_idx" ON "onx_stock_movement"("reference_type","reference_id");

CREATE TABLE IF NOT EXISTS "onx_stock_balance" (
  "id" serial PRIMARY KEY,
  "item_id" integer NOT NULL REFERENCES "onx_item"("id") ON DELETE CASCADE,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE CASCADE,
  "quantity_on_hand" numeric(12,3) DEFAULT '0',
  "quantity_reserved" numeric(12,3) DEFAULT '0',
  "last_movement_at" timestamp with time zone,
  "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT "onx_stock_balance_item_branch_uq" UNIQUE("item_id","branch_id")
);

CREATE INDEX IF NOT EXISTS "onx_stock_balance_item_idx" ON "onx_stock_balance"("item_id");
CREATE INDEX IF NOT EXISTS "onx_stock_balance_branch_idx" ON "onx_stock_balance"("branch_id");

---------------------------------------------------------------------------
-- D06-S02: Insurance Policy & Coverage Register
---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_insurance_policy" (
  "id" serial PRIMARY KEY,
  "policy_number" varchar(100) NOT NULL UNIQUE,
  "insurance_company_id" integer NOT NULL REFERENCES "onx_insurance_company"("id") ON DELETE RESTRICT,
  "client_id" integer NOT NULL REFERENCES "onx_client"("id") ON DELETE RESTRICT,
  "pet_id" integer NOT NULL REFERENCES "onx_pet"("id") ON DELETE RESTRICT,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "plan_name" varchar(200),
  "coverage_type" varchar(50) DEFAULT 'BASIC' NOT NULL,
  "annual_limit" numeric(14,2),
  "deductible_amount" numeric(12,2) DEFAULT '0',
  "copay_percentage" numeric(5,2) DEFAULT '0',
  "start_date" varchar(10) NOT NULL,
  "end_date" varchar(10) NOT NULL,
  "premium_amount" numeric(12,2),
  "premium_frequency" varchar(20) DEFAULT 'MONTHLY',
  "status" varchar(30) DEFAULT 'ACTIVE' NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "onx_ins_policy_number_idx" ON "onx_insurance_policy"("policy_number");
CREATE INDEX IF NOT EXISTS "onx_ins_policy_company_idx" ON "onx_insurance_policy"("insurance_company_id");
CREATE INDEX IF NOT EXISTS "onx_ins_policy_client_idx" ON "onx_insurance_policy"("client_id");
CREATE INDEX IF NOT EXISTS "onx_ins_policy_pet_idx" ON "onx_insurance_policy"("pet_id");
CREATE INDEX IF NOT EXISTS "onx_ins_policy_status_idx" ON "onx_insurance_policy"("status");

---------------------------------------------------------------------------
-- D09-S02: Appointment Scheduling
---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_appointment" (
  "id" serial PRIMARY KEY,
  "appointment_number" varchar(50) NOT NULL UNIQUE,
  "pet_id" integer NOT NULL REFERENCES "onx_pet"("id") ON DELETE RESTRICT,
  "client_id" integer NOT NULL REFERENCES "onx_client"("id") ON DELETE RESTRICT,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "assigned_vet_id" text REFERENCES "user"("id") ON DELETE SET NULL,
  "appointment_type" varchar(50) DEFAULT 'CONSULTATION' NOT NULL,
  "scheduled_at" timestamp with time zone NOT NULL,
  "duration_minutes" integer DEFAULT 30 NOT NULL,
  "status" varchar(30) DEFAULT 'SCHEDULED' NOT NULL,
  "notes" text,
  "cancelled_at" timestamp with time zone,
  "cancel_reason" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "onx_appt_number_idx" ON "onx_appointment"("appointment_number");
CREATE INDEX IF NOT EXISTS "onx_appt_pet_idx" ON "onx_appointment"("pet_id");
CREATE INDEX IF NOT EXISTS "onx_appt_branch_scheduled_idx" ON "onx_appointment"("branch_id","scheduled_at");
CREATE INDEX IF NOT EXISTS "onx_appt_vet_idx" ON "onx_appointment"("assigned_vet_id");
CREATE INDEX IF NOT EXISTS "onx_appt_status_idx" ON "onx_appointment"("status");

---------------------------------------------------------------------------
-- D09-S05: Vaccination Records
---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_vaccination_record" (
  "id" serial PRIMARY KEY,
  "pet_id" integer NOT NULL REFERENCES "onx_pet"("id") ON DELETE RESTRICT,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "vaccine_name" varchar(150) NOT NULL,
  "vaccine_type" varchar(30) DEFAULT 'CORE' NOT NULL,
  "batch_number" varchar(50),
  "administered_date" varchar(10) NOT NULL,
  "expiry_date" varchar(10),
  "next_due_date" varchar(10),
  "administered_by" text REFERENCES "user"("id") ON DELETE SET NULL,
  "status" varchar(30) DEFAULT 'CURRENT' NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "onx_vax_pet_idx" ON "onx_vaccination_record"("pet_id");
CREATE INDEX IF NOT EXISTS "onx_vax_branch_idx" ON "onx_vaccination_record"("branch_id");
CREATE INDEX IF NOT EXISTS "onx_vax_status_idx" ON "onx_vaccination_record"("status");
CREATE INDEX IF NOT EXISTS "onx_vax_due_idx" ON "onx_vaccination_record"("next_due_date");
