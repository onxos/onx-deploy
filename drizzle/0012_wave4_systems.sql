-- OCMBR Wave 4 — D10-S04, D10-S05, D10-S06, D11-S01, D11-S02
-- Lab Result History, Imaging Request, DICOM Study, TeleVet Session, TeleVet Medical Note

-- ============================================================
-- D10-S04: Lab Reference Ranges & Result Annotations
-- ============================================================
CREATE TABLE IF NOT EXISTS "onx_lab_reference_range" (
  "id" serial PRIMARY KEY NOT NULL,
  "test_code" varchar(50) NOT NULL,
  "test_name" varchar(200) NOT NULL,
  "species" varchar(50) DEFAULT 'ALL' NOT NULL,
  "unit" varchar(30),
  "low_normal" varchar(30),
  "high_normal" varchar(30),
  "critical_low" varchar(30),
  "critical_high" varchar(30),
  "notes" text,
  "is_active" varchar(3) DEFAULT 'YES' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_lab_result_annotation" (
  "id" serial PRIMARY KEY NOT NULL,
  "lab_test_request_id" integer NOT NULL,
  "annotation" text NOT NULL,
  "annotated_by" varchar(200),
  "annotated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "onx_lab_result_annotation"
  ADD CONSTRAINT "onx_lab_result_annotation_request_id_fk"
    FOREIGN KEY ("lab_test_request_id") REFERENCES "onx_lab_test_request"("id") ON DELETE cascade;

-- ============================================================
-- D10-S05: Imaging Request Module
-- ============================================================
CREATE TABLE IF NOT EXISTS "onx_imaging_request" (
  "id" serial PRIMARY KEY NOT NULL,
  "request_number" varchar(50) UNIQUE NOT NULL,
  "pet_id" integer NOT NULL,
  "client_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "imaging_type" varchar(30) NOT NULL,
  "body_region" varchar(100),
  "urgency" varchar(20) DEFAULT 'ROUTINE' NOT NULL,
  "status" varchar(20) DEFAULT 'PENDING' NOT NULL,
  "clinical_indication" text,
  "scheduled_at" timestamp with time zone,
  "completed_at" timestamp with time zone,
  "requested_by_id" text,
  "performed_by_id" text,
  "report_summary" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "onx_imaging_request"
  ADD CONSTRAINT "onx_imaging_request_pet_id_fk"
    FOREIGN KEY ("pet_id") REFERENCES "onx_pet"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_imaging_request_client_id_fk"
    FOREIGN KEY ("client_id") REFERENCES "onx_client"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_imaging_request_branch_id_fk"
    FOREIGN KEY ("branch_id") REFERENCES "onx_branch"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_imaging_request_requested_by_fk"
    FOREIGN KEY ("requested_by_id") REFERENCES "user"("id") ON DELETE set null,
  ADD CONSTRAINT "onx_imaging_request_performed_by_fk"
    FOREIGN KEY ("performed_by_id") REFERENCES "user"("id") ON DELETE set null;

-- ============================================================
-- D10-S06: DICOM Study (PACS)
-- ============================================================
CREATE TABLE IF NOT EXISTS "onx_dicom_study" (
  "id" serial PRIMARY KEY NOT NULL,
  "imaging_request_id" integer NOT NULL,
  "study_uid" varchar(200) UNIQUE NOT NULL,
  "study_date" varchar(10),
  "modality" varchar(20),
  "description" varchar(300),
  "pacs_url" varchar(500),
  "viewer_url" varchar(500),
  "thumbnail_url" varchar(500),
  "series_count" integer DEFAULT 0,
  "image_count" integer DEFAULT 0,
  "status" varchar(20) DEFAULT 'AVAILABLE' NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "onx_dicom_study"
  ADD CONSTRAINT "onx_dicom_study_imaging_request_id_fk"
    FOREIGN KEY ("imaging_request_id") REFERENCES "onx_imaging_request"("id") ON DELETE restrict;

-- ============================================================
-- D11-S01: TeleVet Session
-- ============================================================
CREATE TABLE IF NOT EXISTS "onx_televet_session" (
  "id" serial PRIMARY KEY NOT NULL,
  "session_code" varchar(50) UNIQUE NOT NULL,
  "pet_id" integer NOT NULL,
  "client_id" integer NOT NULL,
  "branch_id" integer NOT NULL,
  "veterinarian_id" text,
  "scheduled_at" timestamp with time zone NOT NULL,
  "duration_minutes" integer DEFAULT 30 NOT NULL,
  "session_type" varchar(30) DEFAULT 'VIDEO' NOT NULL,
  "status" varchar(20) DEFAULT 'BOOKED' NOT NULL,
  "session_url" varchar(500),
  "recording_url" varchar(500),
  "chief_complaint" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "onx_televet_session"
  ADD CONSTRAINT "onx_televet_session_pet_id_fk"
    FOREIGN KEY ("pet_id") REFERENCES "onx_pet"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_televet_session_client_id_fk"
    FOREIGN KEY ("client_id") REFERENCES "onx_client"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_televet_session_branch_id_fk"
    FOREIGN KEY ("branch_id") REFERENCES "onx_branch"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_televet_session_vet_id_fk"
    FOREIGN KEY ("veterinarian_id") REFERENCES "user"("id") ON DELETE set null;

-- ============================================================
-- D11-S02: TeleVet Medical Note
-- ============================================================
CREATE TABLE IF NOT EXISTS "onx_televet_medical_note" (
  "id" serial PRIMARY KEY NOT NULL,
  "session_id" integer NOT NULL,
  "pet_id" integer NOT NULL,
  "subjective" text,
  "objective" text,
  "assessment" text,
  "plan" text,
  "prescriptions" text,
  "follow_up_recommendation" text,
  "follow_up_days" integer,
  "referral_required" varchar(3) DEFAULT 'NO' NOT NULL,
  "recorded_by_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "onx_televet_medical_note"
  ADD CONSTRAINT "onx_televet_medical_note_session_id_fk"
    FOREIGN KEY ("session_id") REFERENCES "onx_televet_session"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_televet_medical_note_pet_id_fk"
    FOREIGN KEY ("pet_id") REFERENCES "onx_pet"("id") ON DELETE restrict,
  ADD CONSTRAINT "onx_televet_medical_note_recorded_by_fk"
    FOREIGN KEY ("recorded_by_id") REFERENCES "user"("id") ON DELETE set null;
