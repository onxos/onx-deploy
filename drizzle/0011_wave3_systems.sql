-- OCMBR Wave 3 — D09-S10, D09-S11, D10-S01, D10-S02, D10-S03
-- Clinical Outcome, Consent Forms, Lab Test, Analyser Device, External Lab

-- ============================================================
-- D09-S10: Clinical Outcome Tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS "onx_clinical_outcome" (
  "id" serial PRIMARY KEY NOT NULL,
  "pet_id" integer NOT NULL,
  "client_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "treatment_plan_id" integer,
  "outcome_date" varchar(10) NOT NULL,
  "status" varchar(30) DEFAULT 'STABLE' NOT NULL,
  "clinical_score" integer,
  "owner_feedback" text,
  "clinician_notes" text,
  "follow_up_date" varchar(10),
  "follow_up_required" varchar(3) DEFAULT 'NO' NOT NULL,
  "recorded_by_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "onx_clinical_outcome"
  ADD CONSTRAINT "onx_clinical_outcome_pet_id_onx_pet_id_fk"
    FOREIGN KEY ("pet_id") REFERENCES "onx_pet"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_clinical_outcome_client_id_onx_client_id_fk"
    FOREIGN KEY ("client_id") REFERENCES "onx_client"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_clinical_outcome_branch_id_onx_branch_id_fk"
    FOREIGN KEY ("branch_id") REFERENCES "onx_branch"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_clinical_outcome_treatment_plan_id_fk"
    FOREIGN KEY ("treatment_plan_id") REFERENCES "onx_treatment_plan"("id") ON DELETE set null,
  ADD CONSTRAINT "onx_clinical_outcome_recorded_by_id_fk"
    FOREIGN KEY ("recorded_by_id") REFERENCES "user"("id") ON DELETE set null;

-- ============================================================
-- D09-S11: Consent Forms & Legal Documents
-- ============================================================
CREATE TABLE IF NOT EXISTS "onx_consent_form" (
  "id" serial PRIMARY KEY NOT NULL,
  "form_number" varchar(50) UNIQUE NOT NULL,
  "pet_id" integer NOT NULL,
  "client_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "form_type" varchar(50) NOT NULL,
  "status" varchar(20) DEFAULT 'PENDING' NOT NULL,
  "consent_text" text,
  "signed_at" timestamp with time zone,
  "signed_by_owner_id" integer,
  "signed_by_staff_id" text,
  "document_url" varchar(500),
  "notes" text,
  "created_by_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "onx_consent_form"
  ADD CONSTRAINT "onx_consent_form_pet_id_fk"
    FOREIGN KEY ("pet_id") REFERENCES "onx_pet"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_consent_form_client_id_fk"
    FOREIGN KEY ("client_id") REFERENCES "onx_client"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_consent_form_branch_id_fk"
    FOREIGN KEY ("branch_id") REFERENCES "onx_branch"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_consent_form_signed_by_owner_id_fk"
    FOREIGN KEY ("signed_by_owner_id") REFERENCES "onx_client"("id") ON DELETE set null,
  ADD CONSTRAINT "onx_consent_form_signed_by_staff_id_fk"
    FOREIGN KEY ("signed_by_staff_id") REFERENCES "user"("id") ON DELETE set null,
  ADD CONSTRAINT "onx_consent_form_created_by_id_fk"
    FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE set null;

-- ============================================================
-- D10-S01: Lab Test Request & Result Entry
-- ============================================================
CREATE TABLE IF NOT EXISTS "onx_lab_test_request" (
  "id" serial PRIMARY KEY NOT NULL,
  "request_number" varchar(50) UNIQUE NOT NULL,
  "pet_id" integer NOT NULL,
  "client_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "test_code" varchar(50) NOT NULL,
  "test_name" varchar(200) NOT NULL,
  "category" varchar(50),
  "urgency" varchar(20) DEFAULT 'ROUTINE' NOT NULL,
  "status" varchar(20) DEFAULT 'PENDING' NOT NULL,
  "sample_type" varchar(50),
  "sample_collected_at" timestamp with time zone,
  "requested_by_id" text,
  "requested_at" timestamp with time zone DEFAULT now() NOT NULL,
  "result_data" jsonb,
  "result_summary" text,
  "result_date" timestamp with time zone,
  "reviewed_by_id" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "onx_lab_test_request"
  ADD CONSTRAINT "onx_lab_test_request_pet_id_fk"
    FOREIGN KEY ("pet_id") REFERENCES "onx_pet"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_lab_test_request_client_id_fk"
    FOREIGN KEY ("client_id") REFERENCES "onx_client"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_lab_test_request_branch_id_fk"
    FOREIGN KEY ("branch_id") REFERENCES "onx_branch"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_lab_test_request_requested_by_id_fk"
    FOREIGN KEY ("requested_by_id") REFERENCES "user"("id") ON DELETE set null,
  ADD CONSTRAINT "onx_lab_test_request_reviewed_by_id_fk"
    FOREIGN KEY ("reviewed_by_id") REFERENCES "user"("id") ON DELETE set null;

-- ============================================================
-- D10-S02: In-house Analyser Device Registry
-- ============================================================
CREATE TABLE IF NOT EXISTS "onx_analyser_device" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer NOT NULL,
  "device_code" varchar(50) UNIQUE NOT NULL,
  "device_name" varchar(200) NOT NULL,
  "manufacturer" varchar(100),
  "model" varchar(100),
  "serial_number" varchar(100),
  "category" varchar(50),
  "status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
  "last_calibrated" varchar(10),
  "next_calibration_due" varchar(10),
  "calibration_interval_days" integer,
  "integration_endpoint" varchar(500),
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "onx_analyser_device"
  ADD CONSTRAINT "onx_analyser_device_branch_id_fk"
    FOREIGN KEY ("branch_id") REFERENCES "onx_branch"("id") ON DELETE restrict;

-- ============================================================
-- D10-S03: External Lab Master & Submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS "onx_external_lab" (
  "id" serial PRIMARY KEY NOT NULL,
  "lab_code" varchar(50) UNIQUE NOT NULL,
  "lab_name" varchar(200) NOT NULL,
  "contact_email" varchar(200),
  "contact_phone" varchar(30),
  "address" text,
  "status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
  "turnaround_days" integer,
  "specialties" varchar(500),
  "account_number" varchar(100),
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_external_lab_submission" (
  "id" serial PRIMARY KEY NOT NULL,
  "lab_test_request_id" integer NOT NULL,
  "external_lab_id" integer NOT NULL,
  "submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
  "external_reference" varchar(100),
  "expected_by_date" varchar(10),
  "status" varchar(20) DEFAULT 'SUBMITTED' NOT NULL,
  "result_received_at" timestamp with time zone,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "onx_external_lab_submission"
  ADD CONSTRAINT "onx_ext_lab_submission_request_id_fk"
    FOREIGN KEY ("lab_test_request_id") REFERENCES "onx_lab_test_request"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_ext_lab_submission_lab_id_fk"
    FOREIGN KEY ("external_lab_id") REFERENCES "onx_external_lab"("id") ON DELETE restrict;
