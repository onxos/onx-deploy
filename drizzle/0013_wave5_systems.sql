-- Wave 5 systems: D11-S03 Mobile Clinic, D11-S04 Field Visit, D11-S05 Emergency Case, D12-S01 Regulatory Register, D12-S02 Licence & Certificate
-- OCMBR-005

CREATE TABLE IF NOT EXISTS "onx_mobile_clinic_route" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "branch_id" uuid NOT NULL,
  "route_name" varchar(255) NOT NULL,
  "status" varchar(50) DEFAULT 'active' NOT NULL,
  "notes" text,
  "created_by" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_mobile_clinic_stop" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "route_id" uuid NOT NULL,
  "location_name" varchar(255) NOT NULL,
  "scheduled_date" date NOT NULL,
  "arrival_time" varchar(10),
  "departure_time" varchar(10),
  "notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_field_visit" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "pet_id" uuid NOT NULL,
  "branch_id" uuid NOT NULL,
  "vet_id" text NOT NULL,
  "visit_date" date NOT NULL,
  "location_address" text NOT NULL,
  "reason" text NOT NULL,
  "clinical_notes" text,
  "status" varchar(50) DEFAULT 'scheduled' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_emergency_case" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "pet_id" uuid NOT NULL,
  "branch_id" uuid NOT NULL,
  "triage_level" varchar(50) NOT NULL,
  "presenting_complaint" text NOT NULL,
  "triage_notes" text,
  "assigned_vet_id" text,
  "status" varchar(50) DEFAULT 'triaged' NOT NULL,
  "admission_time" timestamp DEFAULT now() NOT NULL,
  "discharge_time" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_regulatory_requirement" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "regulation_name" varchar(255) NOT NULL,
  "issuing_body" varchar(255) NOT NULL,
  "domain" varchar(100) NOT NULL,
  "risk_level" varchar(50) DEFAULT 'medium' NOT NULL,
  "compliance_status" varchar(50) DEFAULT 'pending' NOT NULL,
  "review_date" date,
  "notes" text,
  "created_by" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_licence_certificate" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "staff_id" text,
  "licence_type" varchar(100) NOT NULL,
  "issuing_body" varchar(255) NOT NULL,
  "licence_number" varchar(100) NOT NULL,
  "issue_date" date NOT NULL,
  "expiry_date" date NOT NULL,
  "status" varchar(50) DEFAULT 'active' NOT NULL,
  "renewal_reminder_sent" boolean DEFAULT false NOT NULL,
  "notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
