#!/usr/bin/env bun
/**
 * Wave 8 verification: D13-S02, D13-S03, D13-S04, D13-S05, D14-S01
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

// ── D13-S02 Performance Appraisal ────────────────────────────────────────────
console.log("\n[D13-S02] Performance Appraisal Cycle");
check(
  "schema file exists",
  fileExists("src/server/db/schema/appraisal-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/appraisal.service.ts"),
);
check("router file exists", fileExists("src/server/api/routers/appraisal.ts"));
check("layout exists", fileExists("src/app/appraisals/layout.tsx"));
check("page exists", fileExists("src/app/appraisals/page.tsx"));
check(
  "schema barrel exports appraisal",
  contains("src/server/db/schema.ts", "appraisal-foundation"),
);
check(
  "permissions includes appraisal:read",
  contains("src/lib/permissions.ts", '"appraisal:read"'),
);
check(
  "root.ts imports appraisalRouter",
  contains("src/server/api/root.ts", "appraisalRouter"),
);
check(
  "migration SQL references onx_appraisal_cycle",
  contains("drizzle/0016_wave8_systems.sql", "onx_appraisal_cycle"),
);

// ── D13-S03 Succession Planning ───────────────────────────────────────────────
console.log("\n[D13-S03] Succession Planning");
check(
  "schema file exists",
  fileExists("src/server/db/schema/succession-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/succession.service.ts"),
);
check("router file exists", fileExists("src/server/api/routers/succession.ts"));
check("layout exists", fileExists("src/app/succession/layout.tsx"));
check("page exists", fileExists("src/app/succession/page.tsx"));
check(
  "schema barrel exports succession",
  contains("src/server/db/schema.ts", "succession-foundation"),
);
check(
  "permissions includes appraisal:write",
  contains("src/lib/permissions.ts", '"appraisal:write"'),
);
check(
  "root.ts imports successionRouter",
  contains("src/server/api/root.ts", "successionRouter"),
);
check(
  "migration SQL references onx_succession_plan",
  contains("drizzle/0016_wave8_systems.sql", "onx_succession_plan"),
);

// ── D13-S04 Staff Development Plan ───────────────────────────────────────────
console.log("\n[D13-S04] Staff Development Plan");
check(
  "schema file exists",
  fileExists("src/server/db/schema/development-plan-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/development-plan.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/development-plan.ts"),
);
check("layout exists", fileExists("src/app/development-plans/layout.tsx"));
check("page exists", fileExists("src/app/development-plans/page.tsx"));
check(
  "schema barrel exports development-plan",
  contains("src/server/db/schema.ts", "development-plan-foundation"),
);
check(
  "permissions includes appraisal:read",
  contains("src/lib/permissions.ts", '"appraisal:read"'),
);
check(
  "root.ts imports developmentPlanRouter",
  contains("src/server/api/root.ts", "developmentPlanRouter"),
);
check(
  "migration SQL references onx_development_plan",
  contains("drizzle/0016_wave8_systems.sql", "onx_development_plan"),
);

// ── D13-S05 Workforce Analytics ──────────────────────────────────────────────
console.log("\n[D13-S05] Workforce Analytics");
check(
  "schema file exists",
  fileExists("src/server/db/schema/workforce-analytics-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/workforce-analytics.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/workforce-analytics.ts"),
);
check("layout exists", fileExists("src/app/workforce-analytics/layout.tsx"));
check("page exists", fileExists("src/app/workforce-analytics/page.tsx"));
check(
  "schema barrel exports workforce-analytics",
  contains("src/server/db/schema.ts", "workforce-analytics-foundation"),
);
check(
  "permissions includes analytics:read",
  contains("src/lib/permissions.ts", '"analytics:read"'),
);
check(
  "root.ts imports workforceAnalyticsRouter",
  contains("src/server/api/root.ts", "workforceAnalyticsRouter"),
);
check(
  "migration SQL references onx_workforce_snapshot",
  contains("drizzle/0016_wave8_systems.sql", "onx_workforce_snapshot"),
);

// ── D14-S01 Clinical Analytics Dashboard ─────────────────────────────────────
console.log("\n[D14-S01] Clinical Analytics Dashboard");
check(
  "schema file exists",
  fileExists("src/server/db/schema/clinical-analytics-foundation.ts"),
);
check(
  "service file exists",
  fileExists("src/server/services/clinical-analytics.service.ts"),
);
check(
  "router file exists",
  fileExists("src/server/api/routers/clinical-analytics.ts"),
);
check("layout exists", fileExists("src/app/clinical-analytics/layout.tsx"));
check("page exists", fileExists("src/app/clinical-analytics/page.tsx"));
check(
  "schema barrel exports clinical-analytics",
  contains("src/server/db/schema.ts", "clinical-analytics-foundation"),
);
check(
  "permissions includes analytics:write",
  contains("src/lib/permissions.ts", '"analytics:write"'),
);
check(
  "root.ts imports clinicalAnalyticsRouter",
  contains("src/server/api/root.ts", "clinicalAnalyticsRouter"),
);
check(
  "migration SQL references onx_clinical_metric_snapshot",
  contains("drizzle/0016_wave8_systems.sql", "onx_clinical_metric_snapshot"),
);

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
console.log(`Wave 8 verification: ${passed}/${passed + failed} checks passed`);
if (failures.length > 0) {
  console.error("\nFailed checks:");
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
} else {
  console.log("All Wave 8 checks passed ✅");
}
