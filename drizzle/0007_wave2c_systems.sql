-- OCMBR Wave 2c — D03-S04, D04-S05, D06-S04
-- Migration: 0007_wave2c_systems

-- ---------------------------------------------------------------------------
-- D03-S04: Accounts Payable
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_ap_bill" (
  "id" serial PRIMARY KEY NOT NULL,
  "bill_number" varchar(50) UNIQUE NOT NULL,
  "vendor_id" integer NOT NULL REFERENCES "onx_vendor"("id") ON DELETE RESTRICT,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "po_id" integer REFERENCES "onx_purchase_order"("id") ON DELETE SET NULL,
  "account_id" integer REFERENCES "onx_coa_account"("id") ON DELETE SET NULL,
  "bill_date" varchar(10) NOT NULL,
  "due_date" varchar(10) NOT NULL,
  "subtotal" numeric(14, 2) DEFAULT '0' NOT NULL,
  "tax_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
  "total_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
  "paid_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
  "status" varchar(20) DEFAULT 'DRAFT' NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_ap_payment" (
  "id" serial PRIMARY KEY NOT NULL,
  "bill_id" integer NOT NULL REFERENCES "onx_ap_bill"("id") ON DELETE CASCADE,
  "payment_date" varchar(10) NOT NULL,
  "amount" numeric(14, 2) NOT NULL,
  "payment_method" varchar(30) DEFAULT 'BANK_TRANSFER' NOT NULL,
  "reference" varchar(100),
  "paid_by" text REFERENCES "user"("id") ON DELETE SET NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- ---------------------------------------------------------------------------
-- D04-S05: Goods Received Note (GRN)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_grn" (
  "id" serial PRIMARY KEY NOT NULL,
  "grn_number" varchar(50) UNIQUE NOT NULL,
  "po_id" integer NOT NULL REFERENCES "onx_purchase_order"("id") ON DELETE RESTRICT,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "received_date" varchar(10) NOT NULL,
  "status" varchar(20) DEFAULT 'DRAFT' NOT NULL,
  "received_by" text REFERENCES "user"("id") ON DELETE SET NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_grn_line" (
  "id" serial PRIMARY KEY NOT NULL,
  "grn_id" integer NOT NULL REFERENCES "onx_grn"("id") ON DELETE CASCADE,
  "po_line_id" integer REFERENCES "onx_po_line"("id") ON DELETE SET NULL,
  "item_id" integer NOT NULL REFERENCES "onx_item"("id") ON DELETE RESTRICT,
  "ordered_qty" numeric(12, 3) NOT NULL,
  "received_qty" numeric(12, 3) NOT NULL,
  "rejected_qty" numeric(12, 3) DEFAULT '0' NOT NULL,
  "unit_cost" numeric(12, 4) DEFAULT '0',
  "batch_number" varchar(80),
  "expiry_date" varchar(10),
  "notes" text
);

-- ---------------------------------------------------------------------------
-- D06-S04: Insurance Claim
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onx_insurance_claim" (
  "id" serial PRIMARY KEY NOT NULL,
  "claim_number" varchar(50) UNIQUE NOT NULL,
  "policy_id" integer NOT NULL REFERENCES "onx_insurance_policy"("id") ON DELETE RESTRICT,
  "pet_id" integer NOT NULL REFERENCES "onx_pet"("id") ON DELETE RESTRICT,
  "client_id" integer NOT NULL REFERENCES "onx_client"("id") ON DELETE RESTRICT,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "soap_note_id" integer REFERENCES "onx_soap_note"("id") ON DELETE SET NULL,
  "claim_date" varchar(10) NOT NULL,
  "diagnosis" text,
  "treatment_description" text,
  "total_billed" numeric(12, 2) DEFAULT '0' NOT NULL,
  "deductible_applied" numeric(12, 2) DEFAULT '0' NOT NULL,
  "copay_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
  "approved_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
  "paid_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
  "status" varchar(20) DEFAULT 'SUBMITTED' NOT NULL,
  "insurer_reference" varchar(100),
  "reviewed_by" text REFERENCES "user"("id") ON DELETE SET NULL,
  "reviewed_at" timestamp with time zone,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
