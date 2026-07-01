#!/usr/bin/env bun
/**
 * Wave 6 verification: D11-S06, D11-S07, D11-S08, D12-S03, D12-S04
 * 45 checks (9 per system)
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
let failed = 0;
const failures: string[] = [];

function check(label: string, condition: boolean) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label}`);
    failed++;
    failures.push(label);
  }
}

function fileExists(rel: string) {
  return existsSync(resolve(ROOT, rel));
}

function contains(rel: string, needle: string) {
  return readFileSync(resolve(ROOT, rel), "utf-8").includes(needle);
}

// ── D11-S06 Emergency Resource Dispatch ─────────────────────────────────────
console.log("\n[D11-S06] Emergency Resource Dispatch");
check(
  "schema file exists",
  fileExists("src/server/db/schema/emergency-resource-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/emergency-resource.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/emergency-resource.ts"),
);
check("layout exists", fileExists("src/app/emergency-resources/layout.tsx"));
check("page exists", fileExists("src/app/emergency-resources/page.tsx"));
check(
  "schema barrel exports emergency-resource",
  contains("src/server/db/schema.ts", "emergency-resource-foundation"),
);
check(
  "permissions includes emergency:read",
  contains("src/lib/permissions.ts", '"emergency:read"'),
);
check(
  "root.ts imports emergencyResourceRouter",
  contains("src/server/api/root.ts", "emergencyResourceRouter"),
);
check(
  "migration SQL references onx_emergency_resource",
  contains("drizzle/0014_wave6_systems.sql", "onx_emergency_resource"),
);

// ── D11-S07 On-call Staff Management ────────────────────────────────────────
console.log("\n[D11-S07] On-call Staff Management");
check(
  "schema file exists",
  fileExists("src/server/db/schema/oncall-schedule-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/oncall-schedule.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/oncall-schedule.ts"),
);
check("layout exists", fileExists("src/app/oncall/layout.tsx"));
check("page exists", fileExists("src/app/oncall/page.tsx"));
check(
  "schema barrel exports oncall-schedule",
  contains("src/server/db/schema.ts", "oncall-schedule-foundation"),
);
check(
  "permissions includes oncall:read",
  contains("src/lib/permissions.ts", '"oncall:read"'),
);
check(
  "root.ts imports oncallScheduleRouter",
  contains("src/server/api/root.ts", "oncallScheduleRouter"),
);
check(
  "migration SQL references onx_oncall_schedule",
  contains("drizzle/0014_wave6_systems.sql", "onx_oncall_schedule"),
);

// ── D11-S08 24/7 Availability Dashboard ─────────────────────────────────────
console.log("\n[D11-S08] 24/7 Availability Dashboard");
check(
  "schema file exists",
  fileExists("src/server/db/schema/availability-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/availability.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/availability.ts"),
);
check("layout exists", fileExists("src/app/availability/layout.tsx"));
check("page exists", fileExists("src/app/availability/page.tsx"));
check(
  "schema barrel exports availability",
  contains("src/server/db/schema.ts", "availability-foundation"),
);
check(
  "permissions includes availability:read",
  contains("src/lib/permissions.ts", '"availability:read"'),
);
check(
  "root.ts imports availabilityRouter",
  contains("src/server/api/root.ts", "availabilityRouter"),
);
check(
  "migration SQL references onx_availability_window",
  contains("drizzle/0014_wave6_systems.sql", "onx_availability_window"),
);

// ── D12-S03 Internal Audit Programme ────────────────────────────────────────
console.log("\n[D12-S03] Internal Audit Programme");
check(
  "schema file exists",
  fileExists("src/server/db/schema/audit-programme-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/audit-programme.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/audit-programme.ts"),
);
check("layout exists", fileExists("src/app/audit-programme/layout.tsx"));
check("page exists", fileExists("src/app/audit-programme/page.tsx"));
check(
  "schema barrel exports audit-programme",
  contains("src/server/db/schema.ts", "audit-programme-foundation"),
);
check(
  "permissions includes compliance:read",
  contains("src/lib/permissions.ts", '"compliance:read"'),
);
check(
  "root.ts imports auditProgrammeRouter",
  contains("src/server/api/root.ts", "auditProgrammeRouter"),
);
check(
  "migration SQL references onx_audit_programme",
  contains("drizzle/0014_wave6_systems.sql", "onx_audit_programme"),
);

// ── D12-S04 Audit Finding & CAPA ────────────────────────────────────────────
console.log("\n[D12-S04] Audit Finding & CAPA");
check(
  "schema file exists",
  fileExists("src/server/db/schema/audit-finding-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/audit-finding.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/audit-finding.ts"),
);
check("layout exists", fileExists("src/app/audit-findings/layout.tsx"));
check("page exists", fileExists("src/app/audit-findings/page.tsx"));
check(
  "schema barrel exports audit-finding",
  contains("src/server/db/schema.ts", "audit-finding-foundation"),
);
check(
  "permissions includes compliance:write",
  contains("src/lib/permissions.ts", '"compliance:write"'),
);
check(
  "root.ts imports auditFindingRouter",
  contains("src/server/api/root.ts", "auditFindingRouter"),
);
check(
  "migration SQL references onx_audit_finding",
  contains("drizzle/0014_wave6_systems.sql", "onx_audit_finding"),
);

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
console.log(`Wave 6 verification: ${passed}/${passed + failed} checks passed`);
if (failures.length > 0) {
  console.error("\nFailed checks:");
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
} else {
  console.log("All Wave 6 checks passed ✅");
}
