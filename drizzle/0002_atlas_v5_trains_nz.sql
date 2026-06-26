-- Atlas V5 Trains N-Z Migration
-- Generated: 2026-06-26
-- Tables: 29 new tables for trains N through Z
-- Dependencies: Requires existing onx_user table (auth.ts)

-- ═══════════════════════════════════════════════════════════
-- TRAIN N — Evolution, Review & Continuous Improvement
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_retrospective" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"goal_reference" varchar(50),
	"owner_id" text,
	"finding" text NOT NULL,
	"action" text NOT NULL,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"priority" varchar(20) DEFAULT 'medium',
	"category" varchar(50) DEFAULT 'general',
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_retrospective_status_idx" ON "onx_retrospective" USING btree ("status");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_improvement_backlog" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"evidence" text,
	"assignee_id" text,
	"status" varchar(20) DEFAULT 'backlog' NOT NULL,
	"priority" varchar(20) DEFAULT 'medium',
	"effort" varchar(20),
	"target_gate" varchar(20),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_improvement_backlog_status_idx" ON "onx_improvement_backlog" USING btree ("status");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_pattern_detection" (
	"id" serial PRIMARY KEY NOT NULL,
	"pattern" varchar(256) NOT NULL,
	"type" varchar(50) NOT NULL,
	"occurrences" integer DEFAULT 1,
	"source" varchar(100),
	"recommendation" text,
	"confidence" varchar(20) DEFAULT 'medium',
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_pattern_detection_type_idx" ON "onx_pattern_detection" USING btree ("type");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_recommendation" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"status" varchar(20) DEFAULT 'proposed' NOT NULL,
	"cycle" varchar(50),
	"proposer_id" text,
	"review_notes" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_recommendation_status_idx" ON "onx_recommendation" USING btree ("status");
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- TRAIN O — Editorial Governance
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_editorial_policy" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"scope" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"version" varchar(20) DEFAULT '1.0',
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"approved_by_id" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_editorial_policy_status_idx" ON "onx_editorial_policy" USING btree ("status");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_content_review" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_id" varchar(50) NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"reviewer_id" text,
	"verdict" varchar(20) NOT NULL,
	"feedback" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_content_review_verdict_idx" ON "onx_content_review" USING btree ("verdict");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_publication_schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"scheduled_date" timestamp with time zone NOT NULL,
	"content_type" varchar(50),
	"status" varchar(20) DEFAULT 'scheduled' NOT NULL,
	"owner_id" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_publication_schedule_date_idx" ON "onx_publication_schedule" USING btree ("scheduled_date");
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- TRAIN P — Titan Operations
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_titan_monitoring_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"titan_id" integer NOT NULL,
	"event" varchar(100) NOT NULL,
	"severity" varchar(20) DEFAULT 'info' NOT NULL,
	"message" text,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_titan_monitoring_titan_idx" ON "onx_titan_monitoring_log" USING btree ("titan_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_titan_maintenance" (
	"id" serial PRIMARY KEY NOT NULL,
	"titan_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_titan_maintenance_status_idx" ON "onx_titan_maintenance" USING btree ("status");
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- TRAIN Q — Institution Management
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_institution_setting" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL UNIQUE,
	"value" text,
	"category" varchar(50) DEFAULT 'general',
	"description" text,
	"updated_by_id" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_member_management" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL UNIQUE,
	"role" varchar(20) NOT NULL,
	"department" varchar(100),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- TRAIN R — Security Review
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_security_audit" (
	"id" serial PRIMARY KEY NOT NULL,
	"audit_type" varchar(50) NOT NULL,
	"target" varchar(256) NOT NULL,
	"findings" text,
	"severity" varchar(20) DEFAULT 'low',
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"auditor_id" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_security_audit_status_idx" ON "onx_security_audit" USING btree ("status");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_vulnerability_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"cve_id" varchar(50),
	"title" varchar(256) NOT NULL,
	"description" text,
	"severity" varchar(20) DEFAULT 'medium' NOT NULL,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"remediation" text,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_vulnerability_severity_idx" ON "onx_vulnerability_tracking" USING btree ("severity");
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- TRAIN S — Operations
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_operational_metric" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"value" varchar(100) NOT NULL,
	"unit" varchar(50),
	"source" varchar(100),
	"recorded_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_operational_metric_name_idx" ON "onx_operational_metric" USING btree ("name");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_system_health" (
	"id" serial PRIMARY KEY NOT NULL,
	"component" varchar(100) NOT NULL,
	"status" varchar(20) NOT NULL,
	"latency" integer,
	"error_rate" integer,
	"checked_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_system_health_component_idx" ON "onx_system_health" USING btree ("component");
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- TRAIN T — Release Management
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_release_record" (
	"id" serial PRIMARY KEY NOT NULL,
	"version" varchar(50) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'planning' NOT NULL,
	"deployed_at" timestamp with time zone,
	"deployed_by_id" text,
	"rollback_version" varchar(50),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_release_record_status_idx" ON "onx_release_record" USING btree ("status");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_deployment_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"release_id" integer NOT NULL,
	"environment" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"logs" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_deployment_tracking_status_idx" ON "onx_deployment_tracking" USING btree ("status");
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- TRAIN U — Data Governance
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_data_governance_rule" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"scope" varchar(100) NOT NULL,
	"rule" text NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_data_quality_check" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" varchar(100) NOT NULL,
	"check_type" varchar(50) NOT NULL,
	"passed" boolean NOT NULL,
	"details" text,
	"checked_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_data_quality_table_idx" ON "onx_data_quality_check" USING btree ("table_name");
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- TRAIN V — Performance
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_performance_metric" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"value" integer NOT NULL,
	"unit" varchar(50),
	"threshold" integer,
	"is_alert" boolean DEFAULT false,
	"recorded_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_performance_metric_name_idx" ON "onx_performance_metric" USING btree ("name");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_load_test_result" (
	"id" serial PRIMARY KEY NOT NULL,
	"scenario" varchar(256) NOT NULL,
	"concurrent_users" integer,
	"avg_response_time" integer,
	"p95_response_time" integer,
	"error_rate" integer,
	"status" varchar(20) DEFAULT 'completed' NOT NULL,
	"tested_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- TRAIN W — Enablement
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_training_material" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"category" varchar(100) DEFAULT 'general',
	"difficulty" varchar(20) DEFAULT 'beginner',
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_onboarding_flow" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL UNIQUE,
	"current_step" integer DEFAULT 0,
	"total_steps" integer DEFAULT 5,
	"status" varchar(20) DEFAULT 'in_progress' NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- TRAIN X — Audit & Review
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor_id" text,
	"action" varchar(100) NOT NULL,
	"resource" varchar(100) NOT NULL,
	"resource_id" varchar(100),
	"details" text,
	"ip_address" varchar(45),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_audit_log_action_idx" ON "onx_audit_log" USING btree ("action");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_compliance_check" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"standard" varchar(100) NOT NULL,
	"result" varchar(20) NOT NULL,
	"findings" text,
	"checked_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- TRAIN Y — Launch Readiness
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_launch_checklist" (
	"id" serial PRIMARY KEY NOT NULL,
	"item" varchar(256) NOT NULL,
	"category" varchar(100) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_by_id" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_launch_checklist_category_idx" ON "onx_launch_checklist" USING btree ("category");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_post_launch_monitoring" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric" varchar(100) NOT NULL,
	"value" varchar(100) NOT NULL,
	"threshold" varchar(100),
	"is_healthy" boolean DEFAULT true,
	"recorded_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- TRAIN Z — Stewardship & Continuity
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_stewardship_record" (
	"id" serial PRIMARY KEY NOT NULL,
	"steward_id" text,
	"responsibility" varchar(256) NOT NULL,
	"scope" varchar(100),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"handoff_notes" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_continuity_plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"scenario" varchar(256) NOT NULL,
	"plan" text NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
