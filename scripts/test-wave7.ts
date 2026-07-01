#!/usr/bin/env bun
/**
 * Wave 7 verification: D12-S05, D12-S06, D12-S07, D12-S08, D13-S01
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

// ── D12-S05 Risk Register ────────────────────────────────────────────────────
console.log("\n[D12-S05] Risk Register");
check(
  "schema file exists",
  fileExists("src/server/db/schema/risk-register-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/risk-register.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/risk-register.ts"),
);
check("layout exists", fileExists("src/app/risk-register/layout.tsx"));
check("page exists", fileExists("src/app/risk-register/page.tsx"));
check(
  "schema barrel exports risk-register",
  contains("src/server/db/schema.ts", "risk-register-foundation"),
);
check(
  "permissions includes compliance:read",
  contains("src/lib/permissions.ts", '"compliance:read"'),
);
check(
  "root.ts imports riskRegisterRouter",
  contains("src/server/api/root.ts", "riskRegisterRouter"),
);
check(
  "migration SQL references onx_risk_entry",
  contains("drizzle/0015_wave7_systems.sql", "onx_risk_entry"),
);

// ── D12-S06 Incident Reporting ───────────────────────────────────────────────
console.log("\n[D12-S06] Incident Reporting");
check(
  "schema file exists",
  fileExists("src/server/db/schema/incident-report-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/incident-report.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/incident-report.ts"),
);
check("layout exists", fileExists("src/app/incidents/layout.tsx"));
check("page exists", fileExists("src/app/incidents/page.tsx"));
check(
  "schema barrel exports incident-report",
  contains("src/server/db/schema.ts", "incident-report-foundation"),
);
check(
  "permissions includes compliance:write",
  contains("src/lib/permissions.ts", '"compliance:write"'),
);
check(
  "root.ts imports incidentReportRouter",
  contains("src/server/api/root.ts", "incidentReportRouter"),
);
check(
  "migration SQL references onx_incident_report",
  contains("drizzle/0015_wave7_systems.sql", "onx_incident_report"),
);

// ── D12-S07 Policy & Procedure Management ────────────────────────────────────
console.log("\n[D12-S07] Policy & Procedure Management");
check(
  "schema file exists",
  fileExists("src/server/db/schema/policy-document-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/policy-document.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/policy-document.ts"),
);
check("layout exists", fileExists("src/app/policies/layout.tsx"));
check("page exists", fileExists("src/app/policies/page.tsx"));
check(
  "schema barrel exports policy-document",
  contains("src/server/db/schema.ts", "policy-document-foundation"),
);
check(
  "permissions includes compliance:read",
  contains("src/lib/permissions.ts", '"compliance:read"'),
);
check(
  "root.ts imports policyDocumentRouter",
  contains("src/server/api/root.ts", "policyDocumentRouter"),
);
check(
  "migration SQL references onx_policy_document",
  contains("drizzle/0015_wave7_systems.sql", "onx_policy_document"),
);

// ── D12-S08 Data Protection & Privacy Register ───────────────────────────────
console.log("\n[D12-S08] Data Protection & Privacy Register");
check(
  "schema file exists",
  fileExists("src/server/db/schema/data-privacy-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/data-privacy.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/data-privacy.ts"),
);
check("layout exists", fileExists("src/app/data-privacy/layout.tsx"));
check("page exists", fileExists("src/app/data-privacy/page.tsx"));
check(
  "schema barrel exports data-privacy",
  contains("src/server/db/schema.ts", "data-privacy-foundation"),
);
check(
  "permissions includes compliance:read",
  contains("src/lib/permissions.ts", '"compliance:read"'),
);
check(
  "root.ts imports dataPrivacyRouter",
  contains("src/server/api/root.ts", "dataPrivacyRouter"),
);
check(
  "migration SQL references onx_data_processing_activity",
  contains("drizzle/0015_wave7_systems.sql", "onx_data_processing_activity"),
);

// ── D13-S01 Training & CPD ───────────────────────────────────────────────────
console.log("\n[D13-S01] Training & CPD");
check(
  "schema file exists",
  fileExists("src/server/db/schema/training-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/training.service.ts"),
);
check("router file exists", fileExists("src/server/api/routers/training.ts"));
check("layout exists", fileExists("src/app/training/layout.tsx"));
check("page exists", fileExists("src/app/training/page.tsx"));
check(
  "schema barrel exports training",
  contains("src/server/db/schema.ts", "training-foundation"),
);
check(
  "permissions includes training:read",
  contains("src/lib/permissions.ts", '"training:read"'),
);
check(
  "root.ts imports trainingRouter",
  contains("src/server/api/root.ts", "trainingRouter"),
);
check(
  "migration SQL references onx_training_course",
  contains("drizzle/0015_wave7_systems.sql", "onx_training_course"),
);

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
console.log(`Wave 7 verification: ${passed}/${passed + failed} checks passed`);
if (failures.length > 0) {
  console.error("\nFailed checks:");
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
} else {
  console.log("All Wave 7 checks passed ✅");
}
