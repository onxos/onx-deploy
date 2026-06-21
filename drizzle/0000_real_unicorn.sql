CREATE TABLE "onx_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onx_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "onx_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "onx_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"role" varchar(32) DEFAULT 'operator',
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "onx_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "onx_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "onx_gap_closure_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"sbp_id" varchar(20) NOT NULL,
	"title" varchar(256) NOT NULL,
	"category" varchar(50) NOT NULL,
	"status" varchar(20) NOT NULL,
	"reason" text,
	"effort" varchar(50),
	"target_gate" varchar(20),
	"dependencies" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "onx_gap_closure_item_sbp_id_unique" UNIQUE("sbp_id")
);
--> statement-breakpoint
CREATE TABLE "onx_knowledge_article" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"category" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"document_ref" varchar(50),
	"importance" varchar(20) DEFAULT 'standard',
	"view_count" integer DEFAULT 0,
	"search_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "onx_knowledge_article_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "onx_sech_status_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"layer" varchar(20) NOT NULL,
	"status" varchar(20) NOT NULL,
	"message" text,
	"triggered_by" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onx_titan_registry" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"domain" varchar(256) NOT NULL,
	"system_name" varchar(256) NOT NULL,
	"sech_primary" varchar(20) NOT NULL,
	"sech_secondary" varchar(20),
	"description" text NOT NULL,
	"manifesto" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "onx_titan_registry_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "onx_visitor_interaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(256) NOT NULL,
	"page" varchar(256) NOT NULL,
	"action" varchar(50) NOT NULL,
	"query" text,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onx_knowledge_synthesis" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic" varchar(256) NOT NULL,
	"synthesis_type" varchar(50) NOT NULL,
	"summary" text NOT NULL,
	"source_refs" jsonb DEFAULT '[]'::jsonb,
	"confidence" varchar(20) DEFAULT 'medium',
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onx_titan_conversation" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(256) NOT NULL,
	"titan_id" varchar(100) NOT NULL,
	"user_message" text NOT NULL,
	"titan_response" text NOT NULL,
	"source_refs" jsonb DEFAULT '[]'::jsonb,
	"confidence" varchar(20) DEFAULT 'medium',
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onx_titan_persona" (
	"id" serial PRIMARY KEY NOT NULL,
	"titan_id" varchar(100) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"domain" varchar(256) NOT NULL,
	"style" text NOT NULL,
	"traits" jsonb DEFAULT '[]'::jsonb,
	"system_prompt" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "onx_titan_persona_titan_id_unique" UNIQUE("titan_id")
);
--> statement-breakpoint
ALTER TABLE "onx_account" ADD CONSTRAINT "onx_account_user_id_onx_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."onx_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onx_session" ADD CONSTRAINT "onx_session_user_id_onx_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."onx_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "onx_account_user_id_idx" ON "onx_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "onx_session_user_id_idx" ON "onx_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "onx_user_role_idx" ON "onx_user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "onx_knowledge_article_category_idx" ON "onx_knowledge_article" USING btree ("category");--> statement-breakpoint
CREATE INDEX "onx_sech_status_log_layer_created_idx" ON "onx_sech_status_log" USING btree ("layer","created_at");--> statement-breakpoint
CREATE INDEX "onx_visitor_interaction_page_action_idx" ON "onx_visitor_interaction" USING btree ("page","action");--> statement-breakpoint
CREATE INDEX "onx_knowledge_synthesis_topic_idx" ON "onx_knowledge_synthesis" USING btree ("topic");--> statement-breakpoint
CREATE INDEX "onx_knowledge_synthesis_type_created_idx" ON "onx_knowledge_synthesis" USING btree ("synthesis_type","created_at");--> statement-breakpoint
CREATE INDEX "onx_titan_conversation_session_idx" ON "onx_titan_conversation" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "onx_titan_conversation_titan_created_idx" ON "onx_titan_conversation" USING btree ("titan_id","created_at");--> statement-breakpoint
CREATE INDEX "onx_titan_persona_active_idx" ON "onx_titan_persona" USING btree ("is_active");