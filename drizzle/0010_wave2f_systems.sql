-- OCMBR Wave 2f migration
-- D09-S07 Surgical Theatre, D09-S08 Hospitalisation, D09-S09 Referral, D08-S03 Discount, D08-S04 Receipt

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_surgical_case" (
  "id" serial PRIMARY KEY NOT NULL,
  "case_number" varchar(50) UNIQUE NOT NULL,
  "treatment_plan_id" integer,
  "pet_id" integer NOT NULL,
  "client_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "surgeon_id" text,
  "theatre_date" varchar(10) NOT NULL,
  "scheduled_start" varchar(5),
  "scheduled_end" varchar(5),
  "procedure_name" varchar(200) NOT NULL,
  "procedure_type" varchar(50) DEFAULT 'ELECTIVE',
  "anaesthesia_type" varchar(50),
  "status" varchar(20) DEFAULT 'SCHEDULED' NOT NULL,
  "actual_start" timestamp with time zone,
  "actual_end" timestamp with time zone,
  "post_op_notes" text,
  "complications" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_theatre_team_member" (
  "id" serial PRIMARY KEY NOT NULL,
  "case_id" integer NOT NULL,
  "staff_id" text NOT NULL,
  "role" varchar(50) NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_theatre_team_member" ADD CONSTRAINT "onx_theatre_team_member_case_id_fk" FOREIGN KEY ("case_id") REFERENCES "onx_surgical_case"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_inpatient_admission" (
  "id" serial PRIMARY KEY NOT NULL,
  "admission_number" varchar(50) UNIQUE NOT NULL,
  "pet_id" integer NOT NULL,
  "client_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "visit_id" integer,
  "admitting_vet_id" text,
  "admission_date" varchar(10) NOT NULL,
  "admission_reason" text NOT NULL,
  "ward_location" varchar(100),
  "status" varchar(20) DEFAULT 'ADMITTED' NOT NULL,
  "discharge_date" varchar(10),
  "discharge_notes" text,
  "discharged_by" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_inpatient_observation" (
  "id" serial PRIMARY KEY NOT NULL,
  "admission_id" integer NOT NULL,
  "observation_date" varchar(10) NOT NULL,
  "observation_time" varchar(5),
  "temperature" varchar(10),
  "heart_rate" varchar(10),
  "respiratory_rate" varchar(10),
  "blood_pressure" varchar(20),
  "weight" varchar(10),
  "general_condition" text,
  "recorded_by" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_inpatient_observation" ADD CONSTRAINT "onx_inpatient_observation_admission_id_fk" FOREIGN KEY ("admission_id") REFERENCES "onx_inpatient_admission"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_referral" (
  "id" serial PRIMARY KEY NOT NULL,
  "referral_number" varchar(50) UNIQUE NOT NULL,
  "pet_id" integer NOT NULL,
  "client_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "referring_vet_id" text,
  "referral_type" varchar(20) DEFAULT 'OUTWARD',
  "referral_date" varchar(10) NOT NULL,
  "specialist_name" varchar(150),
  "specialist_clinic" varchar(200),
  "speciality" varchar(100),
  "reason" text NOT NULL,
  "urgency" varchar(20) DEFAULT 'ROUTINE',
  "status" varchar(30) DEFAULT 'PENDING' NOT NULL,
  "appointment_date" varchar(10),
  "outcome_notes" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_discount_rule" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer NOT NULL,
  "name" varchar(150) NOT NULL,
  "description" text,
  "discount_type" varchar(20) NOT NULL,
  "discount_value" numeric(10,2) NOT NULL,
  "min_order_value" numeric(12,2) DEFAULT '0',
  "max_discount_cap" numeric(12,2),
  "applicable_to" varchar(20) DEFAULT 'ALL',
  "applicable_entity_id" integer,
  "start_date" varchar(10),
  "end_date" varchar(10),
  "is_active" boolean DEFAULT true NOT NULL,
  "usage_limit" integer,
  "usage_count" integer DEFAULT 0 NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_coupon" (
  "id" serial PRIMARY KEY NOT NULL,
  "code" varchar(50) UNIQUE NOT NULL,
  "discount_rule_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "single_use" boolean DEFAULT true NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "used_at" timestamp with time zone,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_coupon" ADD CONSTRAINT "onx_coupon_discount_rule_id_fk" FOREIGN KEY ("discount_rule_id") REFERENCES "onx_discount_rule"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_pos_receipt" (
  "id" serial PRIMARY KEY NOT NULL,
  "receipt_number" varchar(50) UNIQUE NOT NULL,
  "terminal_id" integer NOT NULL,
  "shift_id" integer,
  "branch_id" integer NOT NULL,
  "client_id" integer,
  "cashier_id" text,
  "transaction_date" varchar(10) NOT NULL,
  "transaction_time" varchar(8),
  "subtotal" numeric(14,2) NOT NULL,
  "discount_amount" numeric(14,2) DEFAULT '0',
  "tax_amount" numeric(14,2) DEFAULT '0',
  "total_amount" numeric(14,2) NOT NULL,
  "payment_method" varchar(30) DEFAULT 'CASH',
  "amount_tendered" numeric(14,2),
  "change_given" numeric(14,2) DEFAULT '0',
  "status" varchar(20) DEFAULT 'COMPLETED' NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onx_pos_receipt_line" (
  "id" serial PRIMARY KEY NOT NULL,
  "receipt_id" integer NOT NULL,
  "description" varchar(200) NOT NULL,
  "quantity" numeric(10,3) NOT NULL,
  "unit_price" numeric(12,2) NOT NULL,
  "discount_amount" numeric(12,2) DEFAULT '0',
  "line_total" numeric(14,2) NOT NULL,
  "catalogue_entry_id" integer,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_pos_receipt_line" ADD CONSTRAINT "onx_pos_receipt_line_receipt_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "onx_pos_receipt"("id") ON DELETE cascade ON UPDATE no action;
