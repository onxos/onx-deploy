CREATE TABLE "onx_permission" (
	"id" text PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"permission" text NOT NULL,
	"resource" text NOT NULL,
	"action" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onx_knowledge_article" ADD COLUMN "owner_id" text;--> statement-breakpoint
ALTER TABLE "onx_knowledge_article" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "onx_permission_role_idx" ON "onx_permission" USING btree ("role");--> statement-breakpoint
CREATE INDEX "onx_permission_permission_idx" ON "onx_permission" USING btree ("permission");--> statement-breakpoint
ALTER TABLE "onx_knowledge_article" ADD CONSTRAINT "onx_knowledge_article_owner_id_onx_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."onx_user"("id") ON DELETE set null ON UPDATE no action;