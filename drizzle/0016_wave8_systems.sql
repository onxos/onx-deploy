-- Wave 8: D13-S02 Appraisal, D13-S03 Succession, D13-S04 Dev Plan, D13-S05 Workforce Analytics, D14-S01 Clinical Analytics
-- OCMBR-005

CREATE TABLE IF NOT EXISTS "onx_appraisal_cycle" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "cycle_name" varchar(255) NOT NULL,
  "period_start" date NOT NULL,
  "period_end" date NOT NULL,
  "status" varchar(30) DEFAULT 'OPEN' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_appraisal_record" (
  "id" serial PRIMARY KEY NOT NULL,
  "cycle_id" integer NOT NULL REFERENCES "onx_appraisal_cycle"("id") ON DELETE RESTRICT,
  "staff_id" text NOT NULL REFERENCES "onx_user"("id") ON DELETE RESTRICT,
  "reviewer_id" text REFERENCES "onx_user"("id") ON DELETE SET NULL,
  "overall_rating" integer,
  "self_assessment" text,
  "reviewer_comments" text,
  "status" varchar(30) DEFAULT 'PENDING' NOT NULL,
  "completed_date" date,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_succession_plan" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "role_name" varchar(255) NOT NULL,
  "current_holder_id" text REFERENCES "onx_user"("id") ON DELETE SET NULL,
  "readiness_level" varchar(20) DEFAULT 'NOT_READY' NOT NULL,
  "status" varchar(30) DEFAULT 'ACTIVE' NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_succession_candidate" (
  "id" serial PRIMARY KEY NOT NULL,
  "plan_id" integer NOT NULL REFERENCES "onx_succession_plan"("id") ON DELETE RESTRICT,
  "candidate_id" text NOT NULL REFERENCES "onx_user"("id") ON DELETE RESTRICT,
  "readiness" varchar(20) DEFAULT 'NOT_READY' NOT NULL,
  "development_actions" text,
  "priority" integer DEFAULT 1 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_development_plan" (
  "id" serial PRIMARY KEY NOT NULL,
  "staff_id" text NOT NULL REFERENCES "onx_user"("id") ON DELETE RESTRICT,
  "manager_id" text REFERENCES "onx_user"("id") ON DELETE SET NULL,
  "plan_year" varchar(10) NOT NULL,
  "goals" text NOT NULL,
  "development_areas" text,
  "target_completion_date" date,
  "status" varchar(30) DEFAULT 'DRAFT' NOT NULL,
  "review_notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_workforce_snapshot" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "snapshot_month" varchar(7) NOT NULL,
  "headcount" integer NOT NULL,
  "full_time_equivalent" numeric(8, 2) NOT NULL,
  "attrition_rate" numeric(5, 2),
  "absenteeism_rate" numeric(5, 2),
  "vacancy_count" integer DEFAULT 0 NOT NULL,
  "overtime_hours" numeric(10, 2),
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_clinical_metric_snapshot" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" integer NOT NULL REFERENCES "onx_branch"("id") ON DELETE RESTRICT,
  "snapshot_month" varchar(7) NOT NULL,
  "total_consultations" integer DEFAULT 0 NOT NULL,
  "total_surgeries" integer DEFAULT 0 NOT NULL,
  "total_emergencies" integer DEFAULT 0 NOT NULL,
  "total_hospitalisations" integer DEFAULT 0 NOT NULL,
  "avg_consultation_minutes" numeric(6, 2),
  "readmission_rate" numeric(5, 2),
  "mortality_count" integer DEFAULT 0 NOT NULL,
  "outcome_satisfaction_score" numeric(4, 2),
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
