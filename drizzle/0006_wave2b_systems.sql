-- OCMBR Wave 2b — D02-S05, D04-S04, D05-S02, D05-S03, D05-S05, D09-S03
-- Migration: 0006_wave2b_systems

-- ---------------------------------------------------------------------------
-- D02-S05: Payroll Run
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_payroll_run" (
  "id" serial PRIMARY KEY NOT NULL,
  "run_number" varchar(50) UNIQUE NOT NULL,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "pay_period_start" varchar(10) NOT NULL,
  "pay_period_end" varchar(10) NOT NULL,
  "status" varchar(20) DEFAULT 'DRAFT' NOT NULL,
  "total_gross" numeric(14, 2) DEFAULT '0' NOT NULL,
  "total_deductions" numeric(14, 2) DEFAULT '0' NOT NULL,
  "total_net" numeric(14, 2) DEFAULT '0' NOT NULL,
  "processed_by" text REFERENCES "user"("id") ON DELETE SET NULL,
  "approved_by" text REFERENCES "user"("id") ON DELETE SET NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_payroll_line" (
  "id" serial PRIMARY KEY NOT NULL,
  "run_id" integer NOT NULL REFERENCES "onx_payroll_run"("id") ON DELETE CASCADE,
  "employee_id" integer NOT NULL REFERENCES "onx_employee"("id") ON DELETE RESTRICT,
  "basic_salary" numeric(12, 2) DEFAULT '0' NOT NULL,
  "overtime_pay" numeric(12, 2) DEFAULT '0' NOT NULL,
  "allowances" numeric(12, 2) DEFAULT '0' NOT NULL,
  "gross_pay" numeric(12, 2) DEFAULT '0' NOT NULL,
  "tax_deduction" numeric(12, 2) DEFAULT '0' NOT NULL,
  "social_insurance" numeric(12, 2) DEFAULT '0' NOT NULL,
  "other_deductions" numeric(12, 2) DEFAULT '0' NOT NULL,
  "net_pay" numeric(12, 2) DEFAULT '0' NOT NULL,
  "regular_days" numeric(5, 2) DEFAULT '0',
  "overtime_hours" numeric(5, 2) DEFAULT '0',
  "leave_days" numeric(5, 2) DEFAULT '0',
  "notes" text
);

-- ---------------------------------------------------------------------------
-- D04-S04: Purchase Order
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_purchase_order" (
  "id" serial PRIMARY KEY NOT NULL,
  "po_number" varchar(50) UNIQUE NOT NULL,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "vendor_id" integer NOT NULL REFERENCES "onx_vendor"("id") ON DELETE RESTRICT,
  "pr_id" integer REFERENCES "onx_purchase_requisition"("id") ON DELETE SET NULL,
  "status" varchar(20) DEFAULT 'DRAFT' NOT NULL,
  "order_date" varchar(10) NOT NULL,
  "expected_delivery_date" varchar(10),
  "subtotal" numeric(14, 2) DEFAULT '0' NOT NULL,
  "tax_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
  "total_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
  "issued_by" text REFERENCES "user"("id") ON DELETE SET NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_po_line" (
  "id" serial PRIMARY KEY NOT NULL,
  "po_id" integer NOT NULL REFERENCES "onx_purchase_order"("id") ON DELETE CASCADE,
  "line_number" integer NOT NULL,
  "item_id" integer NOT NULL REFERENCES "onx_item"("id") ON DELETE RESTRICT,
  "ordered_qty" numeric(12, 3) NOT NULL,
  "received_qty" numeric(12, 3) DEFAULT '0' NOT NULL,
  "unit_price" numeric(12, 4) DEFAULT '0' NOT NULL,
  "total_price" numeric(14, 2) DEFAULT '0' NOT NULL,
  "notes" text
);

-- ---------------------------------------------------------------------------
-- D05-S02: Inventory Locations
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_inventory_location" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "code" varchar(30) NOT NULL,
  "name" varchar(100) NOT NULL,
  "location_type" varchar(30) DEFAULT 'SHELF' NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- ---------------------------------------------------------------------------
-- D05-S03: Item Batch / Lot Tracking
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_item_batch" (
  "id" serial PRIMARY KEY NOT NULL,
  "batch_number" varchar(80) NOT NULL,
  "item_id" integer NOT NULL REFERENCES "onx_item"("id") ON DELETE RESTRICT,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "location_id" integer REFERENCES "onx_inventory_location"("id") ON DELETE SET NULL,
  "manufactured_date" varchar(10),
  "expiry_date" varchar(10),
  "received_date" varchar(10) NOT NULL,
  "initial_qty" numeric(12, 3) NOT NULL,
  "current_qty" numeric(12, 3) NOT NULL,
  "unit_cost" numeric(12, 4) DEFAULT '0',
  "status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
  "supplier_lot_number" varchar(80),
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- ---------------------------------------------------------------------------
-- D05-S05: Reorder Rules & Alerts
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_reorder_rule" (
  "id" serial PRIMARY KEY NOT NULL,
  "item_id" integer NOT NULL REFERENCES "onx_item"("id") ON DELETE CASCADE,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "reorder_point" numeric(10, 3) DEFAULT '0' NOT NULL,
  "reorder_qty" numeric(10, 3) DEFAULT '0' NOT NULL,
  "min_stock" numeric(10, 3) DEFAULT '0',
  "max_stock" numeric(10, 3),
  "lead_time_days" integer DEFAULT 0,
  "preferred_vendor_id" integer,
  "is_active" boolean DEFAULT true NOT NULL,
  "last_triggered_at" timestamp with time zone,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "uq_reorder_item_branch" UNIQUE ("item_id", "branch_id")
);

CREATE TABLE IF NOT EXISTS "onx_reorder_alert" (
  "id" serial PRIMARY KEY NOT NULL,
  "reorder_rule_id" integer NOT NULL REFERENCES "onx_reorder_rule"("id") ON DELETE CASCADE,
  "current_qty" numeric(10, 3) NOT NULL,
  "status" varchar(20) DEFAULT 'OPEN' NOT NULL,
  "pr_id" integer,
  "resolved_at" timestamp with time zone,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- ---------------------------------------------------------------------------
-- D09-S03: SOAP Consultation Notes
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_soap_note" (
  "id" serial PRIMARY KEY NOT NULL,
  "note_number" varchar(50) UNIQUE NOT NULL,
  "appointment_id" integer REFERENCES "onx_appointment"("id") ON DELETE SET NULL,
  "visit_id" integer REFERENCES "onx_patient_visit"("id") ON DELETE SET NULL,
  "pet_id" integer NOT NULL REFERENCES "onx_pet"("id") ON DELETE RESTRICT,
  "client_id" integer NOT NULL REFERENCES "onx_client"("id") ON DELETE RESTRICT,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "attending_vet_id" text REFERENCES "user"("id") ON DELETE SET NULL,
  "consultation_date" varchar(10) NOT NULL,
  "subjective" text,
  "objective" text,
  "assessment" text,
  "plan" text,
  "weight_kg" numeric(6, 2),
  "temperature_celsius" numeric(5, 2),
  "heart_rate" integer,
  "respiratory_rate" integer,
  "status" varchar(20) DEFAULT 'DRAFT' NOT NULL,
  "signed_at" timestamp with time zone,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
