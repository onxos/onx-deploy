-- OCMBR Wave 9 Migration
-- Systems: D13-S01 Event Outbox (router+UI), D13-S03 Telemetry Collector,
--          D13-S07 Webhook Dispatch, D14-S02 COO Dashboard, D14-S03 CFO Dashboard
-- New tables: onx_telemetry_event, onx_telemetry_aggregation,
--             onx_webhook_endpoint, onx_webhook_delivery,
--             onx_report_schedule, onx_report_snapshot,
--             onx_operations_dashboard_kpi, onx_finance_dashboard_kpi

-- D13-S03 Module Telemetry
CREATE TABLE IF NOT EXISTS "onx_telemetry_event" (
  "id" serial PRIMARY KEY NOT NULL,
  "module" varchar(100) NOT NULL,
  "metric_name" varchar(150) NOT NULL,
  "metric_value" numeric(18,6) NOT NULL,
  "unit" varchar(50) DEFAULT 'count' NOT NULL,
  "dimensions" jsonb,
  "recorded_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_telemetry_aggregation" (
  "id" serial PRIMARY KEY NOT NULL,
  "module" varchar(100) NOT NULL,
  "metric_name" varchar(150) NOT NULL,
  "period_start" timestamp with time zone NOT NULL,
  "period_end" timestamp with time zone NOT NULL,
  "sum_value" numeric(18,6),
  "avg_value" numeric(18,6),
  "min_value" numeric(18,6),
  "max_value" numeric(18,6),
  "sample_count" integer DEFAULT 0 NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- D13-S07 Webhook Dispatch
CREATE TABLE IF NOT EXISTS "onx_webhook_endpoint" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(150) NOT NULL,
  "url" text NOT NULL,
  "secret" varchar(255),
  "events" jsonb NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_webhook_delivery" (
  "id" serial PRIMARY KEY NOT NULL,
  "endpoint_id" integer NOT NULL,
  "event_type" varchar(150) NOT NULL,
  "payload" jsonb NOT NULL,
  "status" varchar(30) DEFAULT 'PENDING' NOT NULL,
  "attempts" integer DEFAULT 0 NOT NULL,
  "response_code" integer,
  "response_body" text,
  "last_attempt_at" timestamp with time zone,
  "delivered_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- D14-S02/S03 Reporting & Dashboards
CREATE TABLE IF NOT EXISTS "onx_report_schedule" (
  "id" serial PRIMARY KEY NOT NULL,
  "report_type" varchar(100) NOT NULL,
  "recipient_ids" jsonb NOT NULL,
  "cron_expression" varchar(100) NOT NULL,
  "format" varchar(20) DEFAULT 'PDF' NOT NULL,
  "is_active" text DEFAULT 'true' NOT NULL,
  "last_run_at" timestamp with time zone,
  "next_run_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_report_snapshot" (
  "id" serial PRIMARY KEY NOT NULL,
  "report_type" varchar(100) NOT NULL,
  "period_label" varchar(50) NOT NULL,
  "data" jsonb NOT NULL,
  "generated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "notes" text
);

CREATE TABLE IF NOT EXISTS "onx_operations_dashboard_kpi" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" varchar(100),
  "period_label" varchar(50) NOT NULL,
  "total_appointments" numeric(12,0),
  "completed_appointments" numeric(12,0),
  "emergency_cases" numeric(12,0),
  "avg_wait_minutes" numeric(8,2),
  "stock_alerts" numeric(8,0),
  "open_purchase_orders" numeric(8,0),
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "onx_finance_dashboard_kpi" (
  "id" serial PRIMARY KEY NOT NULL,
  "branch_id" varchar(100),
  "period_label" varchar(50) NOT NULL,
  "total_revenue" numeric(18,2),
  "total_expenses" numeric(18,2),
  "net_profit" numeric(18,2),
  "accounts_receivable" numeric(18,2),
  "accounts_payable" numeric(18,2),
  "cash_balance" numeric(18,2),
  "overdue_invoices" numeric(8,0),
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS "onx_telemetry_module_idx" ON "onx_telemetry_event" ("module");
CREATE INDEX IF NOT EXISTS "onx_telemetry_metric_idx" ON "onx_telemetry_event" ("metric_name");
CREATE INDEX IF NOT EXISTS "onx_telemetry_recorded_idx" ON "onx_telemetry_event" ("recorded_at");
CREATE INDEX IF NOT EXISTS "onx_telemetry_agg_module_idx" ON "onx_telemetry_aggregation" ("module");
CREATE INDEX IF NOT EXISTS "onx_telemetry_agg_period_idx" ON "onx_telemetry_aggregation" ("period_start", "period_end");
CREATE INDEX IF NOT EXISTS "onx_webhook_endpoint_active_idx" ON "onx_webhook_endpoint" ("is_active");
CREATE INDEX IF NOT EXISTS "onx_webhook_delivery_status_idx" ON "onx_webhook_delivery" ("status");
CREATE INDEX IF NOT EXISTS "onx_webhook_delivery_endpoint_idx" ON "onx_webhook_delivery" ("endpoint_id");
CREATE INDEX IF NOT EXISTS "onx_webhook_delivery_event_idx" ON "onx_webhook_delivery" ("event_type");
CREATE INDEX IF NOT EXISTS "onx_report_schedule_type_idx" ON "onx_report_schedule" ("report_type");
CREATE INDEX IF NOT EXISTS "onx_report_schedule_next_idx" ON "onx_report_schedule" ("next_run_at");
CREATE INDEX IF NOT EXISTS "onx_report_snapshot_type_idx" ON "onx_report_snapshot" ("report_type");
CREATE INDEX IF NOT EXISTS "onx_report_snapshot_period_idx" ON "onx_report_snapshot" ("period_label");
CREATE INDEX IF NOT EXISTS "onx_report_snapshot_generated_idx" ON "onx_report_snapshot" ("generated_at");
CREATE INDEX IF NOT EXISTS "onx_ops_kpi_period_idx" ON "onx_operations_dashboard_kpi" ("period_label");
CREATE INDEX IF NOT EXISTS "onx_ops_kpi_branch_idx" ON "onx_operations_dashboard_kpi" ("branch_id");
CREATE INDEX IF NOT EXISTS "onx_finance_kpi_period_idx" ON "onx_finance_dashboard_kpi" ("period_label");
CREATE INDEX IF NOT EXISTS "onx_finance_kpi_branch_idx" ON "onx_finance_dashboard_kpi" ("branch_id");
