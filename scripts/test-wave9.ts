/**
 * Wave 9 verification script
 * D13-S01 Event Outbox, D13-S03 Telemetry, D13-S07 Webhook,
 * D14-S02 COO Dashboard, D14-S03 CFO Dashboard
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}`);
    failed++;
  }
}

function fileExists(rel: string) {
  return existsSync(join(root, rel));
}

function fileContains(rel: string, needle: string) {
  if (!existsSync(join(root, rel))) return false;
  return readFileSync(join(root, rel), "utf8").includes(needle);
}

// ── D13-S01 Event Outbox ─────────────────────────────────────────────────────
console.log("\n[D13-S01] Event Outbox");
check(
  "intelligence-foundation schema exists",
  fileExists("src/server/db/schema/intelligence-foundation.ts"),
);
check(
  "event-outbox service exists",
  fileExists("src/server/services/event-outbox.service.ts"),
);
check(
  "event-outbox router exists",
  fileExists("src/server/api/routers/event-outbox.ts"),
);
check(
  "event-outbox layout exists",
  fileExists("src/app/event-outbox/layout.tsx"),
);
check("event-outbox page exists", fileExists("src/app/event-outbox/page.tsx"));
check(
  "schema barrel exports intelligence",
  fileContains("src/server/db/schema.ts", "intelligence-foundation"),
);
check(
  "permissions includes intelligence:read",
  fileContains("src/lib/permissions.ts", "intelligence:read"),
);
check(
  "root.ts imports eventOutboxRouter",
  fileContains("src/server/api/root.ts", "eventOutboxRouter"),
);
check(
  "service has listPendingEvents",
  fileContains(
    "src/server/services/event-outbox.service.ts",
    "listPendingEvents",
  ),
);

// ── D13-S03 Module Telemetry ─────────────────────────────────────────────────
console.log("\n[D13-S03] Module Telemetry Collector");
check(
  "telemetry-foundation schema exists",
  fileExists("src/server/db/schema/telemetry-foundation.ts"),
);
check(
  "telemetry service exists",
  fileExists("src/server/services/telemetry.service.ts"),
);
check(
  "telemetry router exists",
  fileExists("src/server/api/routers/telemetry.ts"),
);
check("telemetry layout exists", fileExists("src/app/telemetry/layout.tsx"));
check("telemetry page exists", fileExists("src/app/telemetry/page.tsx"));
check(
  "schema barrel exports telemetry",
  fileContains("src/server/db/schema.ts", "telemetry-foundation"),
);
check(
  "permissions includes intelligence:write",
  fileContains("src/lib/permissions.ts", "intelligence:write"),
);
check(
  "root.ts imports telemetryRouter",
  fileContains("src/server/api/root.ts", "telemetryRouter"),
);
check(
  "migration SQL references onx_telemetry_event",
  fileContains("drizzle/0017_wave9_systems.sql", "onx_telemetry_event"),
);

// ── D13-S07 Webhook Dispatch ─────────────────────────────────────────────────
console.log("\n[D13-S07] Webhook Dispatch Layer");
check(
  "webhook-foundation schema exists",
  fileExists("src/server/db/schema/webhook-foundation.ts"),
);
check(
  "webhook service exists",
  fileExists("src/server/services/webhook.service.ts"),
);
check("webhook router exists", fileExists("src/server/api/routers/webhook.ts"));
check("webhooks layout exists", fileExists("src/app/webhooks/layout.tsx"));
check("webhooks page exists", fileExists("src/app/webhooks/page.tsx"));
check(
  "schema barrel exports webhook",
  fileContains("src/server/db/schema.ts", "webhook-foundation"),
);
check(
  "root.ts imports webhookRouter",
  fileContains("src/server/api/root.ts", "webhookRouter"),
);
check(
  "migration SQL references onx_webhook_endpoint",
  fileContains("drizzle/0017_wave9_systems.sql", "onx_webhook_endpoint"),
);
check(
  "migration SQL references onx_webhook_delivery",
  fileContains("drizzle/0017_wave9_systems.sql", "onx_webhook_delivery"),
);

// ── D14-S02 COO Operations Dashboard ─────────────────────────────────────────
console.log("\n[D14-S02] COO Operations Dashboard");
check(
  "reporting-foundation schema exists",
  fileExists("src/server/db/schema/reporting-foundation.ts"),
);
check(
  "reporting service exists",
  fileExists("src/server/services/reporting.service.ts"),
);
check(
  "reporting router exists",
  fileExists("src/server/api/routers/reporting.ts"),
);
check(
  "coo-dashboard layout exists",
  fileExists("src/app/coo-dashboard/layout.tsx"),
);
check(
  "coo-dashboard page exists",
  fileExists("src/app/coo-dashboard/page.tsx"),
);
check(
  "schema barrel exports reporting",
  fileContains("src/server/db/schema.ts", "reporting-foundation"),
);
check(
  "permissions includes reporting:read",
  fileContains("src/lib/permissions.ts", "reporting:read"),
);
check(
  "root.ts imports reportingRouter",
  fileContains("src/server/api/root.ts", "reportingRouter"),
);
check(
  "migration SQL references onx_operations_dashboard_kpi",
  fileContains(
    "drizzle/0017_wave9_systems.sql",
    "onx_operations_dashboard_kpi",
  ),
);

// ── D14-S03 CFO Finance Dashboard ────────────────────────────────────────────
console.log("\n[D14-S03] CFO Finance Dashboard");
check(
  "reporting-foundation schema has financeDashboardKpi",
  fileContains(
    "src/server/db/schema/reporting-foundation.ts",
    "financeDashboardKpi",
  ),
);
check(
  "reporting service has listFinanceKpis",
  fileContains("src/server/services/reporting.service.ts", "listFinanceKpis"),
);
check(
  "reporting router has listFinanceKpis",
  fileContains("src/server/api/routers/reporting.ts", "listFinanceKpis"),
);
check(
  "cfo-dashboard layout exists",
  fileExists("src/app/cfo-dashboard/layout.tsx"),
);
check(
  "cfo-dashboard page exists",
  fileExists("src/app/cfo-dashboard/page.tsx"),
);
check(
  "permissions includes reporting:write",
  fileContains("src/lib/permissions.ts", "reporting:write"),
);
check(
  "cfo page references CFO Finance Dashboard",
  fileContains("src/app/cfo-dashboard/page.tsx", "CFO Finance Dashboard"),
);
check(
  "migration SQL references onx_finance_dashboard_kpi",
  fileContains("drizzle/0017_wave9_systems.sql", "onx_finance_dashboard_kpi"),
);
check(
  "journal idx 17 set",
  fileContains("drizzle/meta/_journal.json", "0017_wave9_systems"),
);

console.log(
  `\n${"─".repeat(50)}\nWave 9 verification: ${passed}/${passed + failed} checks passed`,
);
if (failed === 0) {
  console.log("All Wave 9 checks passed ✅");
} else {
  console.log(`${failed} check(s) failed ❌`);
  process.exit(1);
}
