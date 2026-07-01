-- OCMBR Foundation P0 Migration
-- Branch: ocmbr/foundation-p0
-- OCMBR References: FOUND-IU-01, FOUND-IU-02, FOUND-IU-03, FOUND-IU-04, FOUND-IU-05
-- Generated: 2026-07-01
-- Tables: 13 new tables for Foundation P0 (branch, brand, tenant, RBAC, event outbox, job queue, audit)
-- Dependencies: Requires existing onx_user table (auth.ts)

-- ═══════════════════════════════════════════════════════════
-- FOUND-IU-01: Branch / Brand Foundation (D15-S01, D15-S02)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_brand" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(100) NOT NULL,
        "code" varchar(20) NOT NULL,
        "logo_url" text,
        "primary_color" varchar(10),
        "website" text,
        "is_active" boolean DEFAULT true NOT NULL,
        "metadata" jsonb,
        "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamp with time zone,
        CONSTRAINT "onx_brand_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_brand_code_idx" ON "onx_brand" USING btree ("code");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_branch" (
        "id" serial PRIMARY KEY NOT NULL,
        "brand_id" integer NOT NULL,
        "name" varchar(150) NOT NULL,
        "code" varchar(30) NOT NULL,
        "address_line1" varchar(255),
        "address_line2" varchar(255),
        "city" varchar(100),
        "state_province" varchar(100),
        "country" varchar(2) DEFAULT 'SA',
        "postal_code" varchar(20),
        "phone" varchar(30),
        "email" varchar(256),
        "timezone" varchar(60) DEFAULT 'Asia/Riyadh',
        "currency" varchar(3) DEFAULT 'SAR',
        "is_active" boolean DEFAULT true NOT NULL,
        "is_headquarters" boolean DEFAULT false NOT NULL,
        "metadata" jsonb,
        "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamp with time zone,
        CONSTRAINT "onx_branch_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "onx_branch" ADD CONSTRAINT "onx_branch_brand_id_onx_brand_id_fk"
        FOREIGN KEY ("brand_id") REFERENCES "public"."onx_brand"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_branch_brand_id_idx" ON "onx_branch" USING btree ("brand_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_branch_code_idx" ON "onx_branch" USING btree ("code");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_branch_active_idx" ON "onx_branch" USING btree ("is_active");
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- FOUND-IU-02: Tenant Foundation (D15-S03)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_tenant" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(150) NOT NULL,
        "code" varchar(30) NOT NULL,
        "domain" varchar(253),
        "plan_tier" varchar(30) DEFAULT 'standard' NOT NULL,
        "max_branches" integer DEFAULT 10,
        "is_active" boolean DEFAULT true NOT NULL,
        "contact_email" varchar(256),
        "contact_phone" varchar(30),
        "country" varchar(2) DEFAULT 'SA',
        "metadata" jsonb,
        "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamp with time zone,
        CONSTRAINT "onx_tenant_code_unique" UNIQUE("code"),
        CONSTRAINT "onx_tenant_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_tenant_code_idx" ON "onx_tenant" USING btree ("code");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_tenant_domain_idx" ON "onx_tenant" USING btree ("domain");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_tenant_brand" (
        "id" serial PRIMARY KEY NOT NULL,
        "tenant_id" integer NOT NULL,
        "brand_id" integer NOT NULL,
        "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_tenant_brand" ADD CONSTRAINT "onx_tenant_brand_tenant_id_onx_tenant_id_fk"
        FOREIGN KEY ("tenant_id") REFERENCES "public"."onx_tenant"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_tenant_brand" ADD CONSTRAINT "onx_tenant_brand_brand_id_onx_brand_id_fk"
        FOREIGN KEY ("brand_id") REFERENCES "public"."onx_brand"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_tenant_brand_tenant_idx" ON "onx_tenant_brand" USING btree ("tenant_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_tenant_brand_brand_idx" ON "onx_tenant_brand" USING btree ("brand_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_tenant_config" (
        "id" serial PRIMARY KEY NOT NULL,
        "tenant_id" integer NOT NULL,
        "default_currency" varchar(3) DEFAULT 'SAR',
        "default_language" varchar(10) DEFAULT 'en',
        "default_timezone" varchar(60) DEFAULT 'Asia/Riyadh',
        "enable_multi_currency" boolean DEFAULT false,
        "enable_multi_language" boolean DEFAULT false,
        "features" jsonb,
        "updated_at" timestamp with time zone,
        CONSTRAINT "onx_tenant_config_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
ALTER TABLE "onx_tenant_config" ADD CONSTRAINT "onx_tenant_config_tenant_id_onx_tenant_id_fk"
        FOREIGN KEY ("tenant_id") REFERENCES "public"."onx_tenant"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_tenant_config_tenant_idx" ON "onx_tenant_config" USING btree ("tenant_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_tenant_invite" (
        "id" text PRIMARY KEY NOT NULL,
        "tenant_id" integer NOT NULL,
        "email" varchar(256) NOT NULL,
        "role" varchar(32) DEFAULT 'operator' NOT NULL,
        "token" text NOT NULL,
        "expires_at" timestamp with time zone NOT NULL,
        "accepted_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT "onx_tenant_invite_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "onx_tenant_invite" ADD CONSTRAINT "onx_tenant_invite_tenant_id_onx_tenant_id_fk"
        FOREIGN KEY ("tenant_id") REFERENCES "public"."onx_tenant"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_tenant_invite_tenant_idx" ON "onx_tenant_invite" USING btree ("tenant_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_tenant_invite_token_idx" ON "onx_tenant_invite" USING btree ("token");
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- FOUND-IU-03: Branch-level RBAC Extension (D15-S04)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_user_branch_role" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "branch_id" integer NOT NULL,
        "role" varchar(50) NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "granted_by" text,
        "granted_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "revoked_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "onx_user_branch_role" ADD CONSTRAINT "onx_user_branch_role_user_id_onx_user_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."onx_user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_user_branch_role" ADD CONSTRAINT "onx_user_branch_role_branch_id_onx_branch_id_fk"
        FOREIGN KEY ("branch_id") REFERENCES "public"."onx_branch"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_user_branch_role" ADD CONSTRAINT "onx_user_branch_role_granted_by_onx_user_id_fk"
        FOREIGN KEY ("granted_by") REFERENCES "public"."onx_user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_user_branch_role_user_idx" ON "onx_user_branch_role" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_user_branch_role_branch_idx" ON "onx_user_branch_role" USING btree ("branch_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_user_branch_role_role_idx" ON "onx_user_branch_role" USING btree ("role");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_user_branch_role_active_idx" ON "onx_user_branch_role" USING btree ("is_active");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_user_tenant_membership" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "tenant_id" integer NOT NULL,
        "platform_role" varchar(50) DEFAULT 'operator' NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "joined_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_user_tenant_membership" ADD CONSTRAINT "onx_user_tenant_membership_user_id_onx_user_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."onx_user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "onx_user_tenant_membership" ADD CONSTRAINT "onx_user_tenant_membership_tenant_id_onx_tenant_id_fk"
        FOREIGN KEY ("tenant_id") REFERENCES "public"."onx_tenant"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_user_tenant_user_idx" ON "onx_user_tenant_membership" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_user_tenant_tenant_idx" ON "onx_user_tenant_membership" USING btree ("tenant_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_branch_role_permission" (
        "id" serial PRIMARY KEY NOT NULL,
        "role" varchar(50) NOT NULL,
        "resource" varchar(100) NOT NULL,
        "action" varchar(50) NOT NULL,
        "is_allowed" boolean DEFAULT true NOT NULL,
        "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_branch_role_perm_role_idx" ON "onx_branch_role_permission" USING btree ("role");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_branch_role_perm_resource_idx" ON "onx_branch_role_permission" USING btree ("resource");
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- FOUND-IU-04: Event Outbox + Job Queue (D13-S01, D13-S08)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_event_outbox" (
        "id" serial PRIMARY KEY NOT NULL,
        "domain" varchar(50) NOT NULL,
        "aggregate_type" varchar(100) NOT NULL,
        "aggregate_id" varchar(255) NOT NULL,
        "event_type" varchar(150) NOT NULL,
        "payload" jsonb NOT NULL,
        "status" varchar(20) DEFAULT 'PENDING' NOT NULL,
        "attempts" integer DEFAULT 0 NOT NULL,
        "target_consumer" varchar(100),
        "last_attempt_at" timestamp with time zone,
        "delivered_at" timestamp with time zone,
        "last_error" text,
        "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_event_outbox_status_idx" ON "onx_event_outbox" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_event_outbox_domain_idx" ON "onx_event_outbox" USING btree ("domain");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_event_outbox_event_type_idx" ON "onx_event_outbox" USING btree ("event_type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_event_outbox_aggregate_idx" ON "onx_event_outbox" USING btree ("aggregate_type","aggregate_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_event_outbox_created_idx" ON "onx_event_outbox" USING btree ("created_at");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_job_queue" (
        "id" serial PRIMARY KEY NOT NULL,
        "job_type" varchar(150) NOT NULL,
        "domain" varchar(50),
        "payload" jsonb,
        "status" varchar(30) DEFAULT 'QUEUED' NOT NULL,
        "priority" integer DEFAULT 5 NOT NULL,
        "attempts" integer DEFAULT 0 NOT NULL,
        "max_attempts" integer DEFAULT 3 NOT NULL,
        "scheduled_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "started_at" timestamp with time zone,
        "completed_at" timestamp with time zone,
        "failed_at" timestamp with time zone,
        "result" jsonb,
        "last_error" text,
        "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_job_queue_status_scheduled_idx" ON "onx_job_queue" USING btree ("status","scheduled_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_job_queue_job_type_idx" ON "onx_job_queue" USING btree ("job_type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_job_queue_domain_idx" ON "onx_job_queue" USING btree ("domain");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_job_queue_priority_idx" ON "onx_job_queue" USING btree ("priority");
--> statement-breakpoint

-- ═══════════════════════════════════════════════════════════
-- FOUND-IU-05: Domain Audit Trail Event Stream (D13-S02)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "onx_domain_audit_event" (
        "id" serial PRIMARY KEY NOT NULL,
        "domain" varchar(50) NOT NULL,
        "aggregate_type" varchar(100) NOT NULL,
        "aggregate_id" varchar(255) NOT NULL,
        "action" varchar(50) NOT NULL,
        "actor_id" text,
        "actor_name" varchar(256),
        "branch_id" integer,
        "tenant_id" integer,
        "old_value" jsonb,
        "new_value" jsonb,
        "context" jsonb,
        "ip_address" varchar(45),
        "user_agent" text,
        "correlation_id" varchar(100),
        "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_domain_audit_event" ADD CONSTRAINT "onx_domain_audit_event_actor_id_onx_user_id_fk"
        FOREIGN KEY ("actor_id") REFERENCES "public"."onx_user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_domain_audit_domain_idx" ON "onx_domain_audit_event" USING btree ("domain");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_domain_audit_aggregate_idx" ON "onx_domain_audit_event" USING btree ("aggregate_type","aggregate_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_domain_audit_actor_idx" ON "onx_domain_audit_event" USING btree ("actor_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_domain_audit_action_idx" ON "onx_domain_audit_event" USING btree ("action");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_domain_audit_branch_idx" ON "onx_domain_audit_event" USING btree ("branch_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_domain_audit_tenant_idx" ON "onx_domain_audit_event" USING btree ("tenant_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_domain_audit_created_idx" ON "onx_domain_audit_event" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_domain_audit_correlation_idx" ON "onx_domain_audit_event" USING btree ("correlation_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "onx_audit_retention_policy" (
        "id" serial PRIMARY KEY NOT NULL,
        "domain" varchar(50),
        "tenant_id" integer,
        "retention_days" integer DEFAULT 2555 NOT NULL,
        "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_audit_retention_domain_idx" ON "onx_audit_retention_policy" USING btree ("domain");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "onx_audit_retention_tenant_idx" ON "onx_audit_retention_policy" USING btree ("tenant_id");
