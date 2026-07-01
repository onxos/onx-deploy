#!/usr/bin/env bun
/**
 * OCMBR Wave 3 — Verification Test Script
 *
 * Verifies all 5 systems × 4 IUs = 20 IUs
 * D09-S10 | D09-S11 | D10-S01 | D10-S02 | D10-S03
 */

import { existsSync, readFileSync } from "node:fs";

interface TestResult {
  system: string;
  iu: string;
  description: string;
  passed: boolean;
}

const results: TestResult[] = [];

function check(
  system: string,
  iu: string,
  description: string,
  condition: boolean,
) {
  results.push({ system, iu, description, passed: condition });
}

function fileContains(path: string, ...substrings: string[]): boolean {
  if (!existsSync(path)) return false;
  const content = readFileSync(path, "utf-8");
  return substrings.every((s) => content.includes(s));
}

// ============================================================
// D09-S10 — Clinical Outcome Tracking
// ============================================================
const D0910_SCH = "src/server/db/schema/clinical-outcome-foundation.ts";
const D0910_SVC = "src/server/services/clinical-outcome.service.ts";
const D0910_RTR = "src/server/api/routers/clinical-outcome.ts";
const D0910_UI = "src/app/clinical-outcomes/page.tsx";

check("D09-S10", "D09-S10-IU-SCH", "Schema file exists", existsSync(D0910_SCH));
check(
  "D09-S10",
  "D09-S10-IU-SCH",
  "clinicalOutcome table defined",
  fileContains(D0910_SCH, "clinicalOutcome"),
);
check(
  "D09-S10",
  "D09-S10-IU-SVC",
  "Service file exists",
  existsSync(D0910_SVC),
);
check(
  "D09-S10",
  "D09-S10-IU-SVC",
  "createOutcome exported",
  fileContains(D0910_SVC, "createOutcome"),
);
check("D09-S10", "D09-S10-IU-API", "Router file exists", existsSync(D0910_RTR));
check(
  "D09-S10",
  "D09-S10-IU-API",
  "create procedure in router",
  fileContains(D0910_RTR, "create:"),
);
check(
  "D09-S10",
  "D09-S10-IU-API",
  "clinicalOutcome registered in root",
  fileContains("src/server/api/root.ts", "clinicalOutcome"),
);
check("D09-S10", "D09-S10-IU-UI", "UI page exists", existsSync(D0910_UI));
check(
  "D09-S10",
  "D09-S10-IU-UI",
  "UI page has heading",
  fileContains(D0910_UI, "Clinical Outcomes"),
);

// ============================================================
// D09-S11 — Consent Forms & Legal Documents
// ============================================================
const D0911_SCH = "src/server/db/schema/consent-form-foundation.ts";
const D0911_SVC = "src/server/services/consent-form.service.ts";
const D0911_RTR = "src/server/api/routers/consent-form.ts";
const D0911_UI = "src/app/consent-forms/page.tsx";

check("D09-S11", "D09-S11-IU-SCH", "Schema file exists", existsSync(D0911_SCH));
check(
  "D09-S11",
  "D09-S11-IU-SCH",
  "consentForm table defined",
  fileContains(D0911_SCH, "consentForm"),
);
check(
  "D09-S11",
  "D09-S11-IU-SVC",
  "Service file exists",
  existsSync(D0911_SVC),
);
check(
  "D09-S11",
  "D09-S11-IU-SVC",
  "createConsentForm exported",
  fileContains(D0911_SVC, "createConsentForm"),
);
check("D09-S11", "D09-S11-IU-API", "Router file exists", existsSync(D0911_RTR));
check(
  "D09-S11",
  "D09-S11-IU-API",
  "create procedure in router",
  fileContains(D0911_RTR, "create:"),
);
check(
  "D09-S11",
  "D09-S11-IU-API",
  "consentForm registered in root",
  fileContains("src/server/api/root.ts", "consentForm"),
);
check("D09-S11", "D09-S11-IU-UI", "UI page exists", existsSync(D0911_UI));
check(
  "D09-S11",
  "D09-S11-IU-UI",
  "UI page has heading",
  fileContains(D0911_UI, "Consent Forms"),
);

// ============================================================
// D10-S01 — Lab Test Request & Result Entry
// ============================================================
const D1001_SCH = "src/server/db/schema/lab-test-foundation.ts";
const D1001_SVC = "src/server/services/lab-test.service.ts";
const D1001_RTR = "src/server/api/routers/lab-test.ts";
const D1001_UI = "src/app/lab-tests/page.tsx";

check("D10-S01", "D10-S01-IU-SCH", "Schema file exists", existsSync(D1001_SCH));
check(
  "D10-S01",
  "D10-S01-IU-SCH",
  "labTestRequest table defined",
  fileContains(D1001_SCH, "labTestRequest"),
);
check(
  "D10-S01",
  "D10-S01-IU-SVC",
  "Service file exists",
  existsSync(D1001_SVC),
);
check(
  "D10-S01",
  "D10-S01-IU-SVC",
  "createLabTestRequest exported",
  fileContains(D1001_SVC, "createLabTestRequest"),
);
check("D10-S01", "D10-S01-IU-API", "Router file exists", existsSync(D1001_RTR));
check(
  "D10-S01",
  "D10-S01-IU-API",
  "create procedure in router",
  fileContains(D1001_RTR, "create:"),
);
check(
  "D10-S01",
  "D10-S01-IU-API",
  "labTest registered in root",
  fileContains("src/server/api/root.ts", "labTest"),
);
check("D10-S01", "D10-S01-IU-UI", "UI page exists", existsSync(D1001_UI));
check(
  "D10-S01",
  "D10-S01-IU-UI",
  "UI page has heading",
  fileContains(D1001_UI, "Lab Tests"),
);

// ============================================================
// D10-S02 — In-house Analyser Integration Hooks
// ============================================================
const D1002_SCH = "src/server/db/schema/analyser-device-foundation.ts";
const D1002_SVC = "src/server/services/analyser-device.service.ts";
const D1002_RTR = "src/server/api/routers/analyser-device.ts";
const D1002_UI = "src/app/analyser-devices/page.tsx";

check("D10-S02", "D10-S02-IU-SCH", "Schema file exists", existsSync(D1002_SCH));
check(
  "D10-S02",
  "D10-S02-IU-SCH",
  "analyserDevice table defined",
  fileContains(D1002_SCH, "analyserDevice"),
);
check(
  "D10-S02",
  "D10-S02-IU-SVC",
  "Service file exists",
  existsSync(D1002_SVC),
);
check(
  "D10-S02",
  "D10-S02-IU-SVC",
  "createAnalyserDevice exported",
  fileContains(D1002_SVC, "createAnalyserDevice"),
);
check("D10-S02", "D10-S02-IU-API", "Router file exists", existsSync(D1002_RTR));
check(
  "D10-S02",
  "D10-S02-IU-API",
  "create procedure in router",
  fileContains(D1002_RTR, "create:"),
);
check(
  "D10-S02",
  "D10-S02-IU-API",
  "analyserDevice registered in root",
  fileContains("src/server/api/root.ts", "analyserDevice"),
);
check("D10-S02", "D10-S02-IU-UI", "UI page exists", existsSync(D1002_UI));
check(
  "D10-S02",
  "D10-S02-IU-UI",
  "UI page has heading",
  fileContains(D1002_UI, "Analyser Devices"),
);

// ============================================================
// D10-S03 — External Lab Referral & Import
// ============================================================
const D1003_SCH = "src/server/db/schema/external-lab-foundation.ts";
const D1003_SVC = "src/server/services/external-lab.service.ts";
const D1003_RTR = "src/server/api/routers/external-lab.ts";
const D1003_UI = "src/app/external-labs/page.tsx";

check("D10-S03", "D10-S03-IU-SCH", "Schema file exists", existsSync(D1003_SCH));
check(
  "D10-S03",
  "D10-S03-IU-SCH",
  "externalLab table defined",
  fileContains(D1003_SCH, "externalLab"),
);
check(
  "D10-S03",
  "D10-S03-IU-SVC",
  "Service file exists",
  existsSync(D1003_SVC),
);
check(
  "D10-S03",
  "D10-S03-IU-SVC",
  "createExternalLab exported",
  fileContains(D1003_SVC, "createExternalLab"),
);
check("D10-S03", "D10-S03-IU-API", "Router file exists", existsSync(D1003_RTR));
check(
  "D10-S03",
  "D10-S03-IU-API",
  "create procedure in router",
  fileContains(D1003_RTR, "create:"),
);
check(
  "D10-S03",
  "D10-S03-IU-API",
  "externalLab registered in root",
  fileContains("src/server/api/root.ts", "externalLab"),
);
check("D10-S03", "D10-S03-IU-UI", "UI page exists", existsSync(D1003_UI));
check(
  "D10-S03",
  "D10-S03-IU-UI",
  "UI page has heading",
  fileContains(D1003_UI, "External Labs"),
);

// ============================================================
// Print results
// ============================================================
console.log("\n=== Wave 3 Verification ===\n");

let passed = 0;
let failed = 0;
let lastSystem = "";

for (const r of results) {
  if (r.system !== lastSystem) {
    lastSystem = r.system;
  }
  const icon = r.passed ? "✓" : "✗";
  console.log(`${icon} [${r.system}] ${r.iu}: ${r.description}`);
  if (r.passed) passed++;
  else failed++;
}

console.log(`\n${passed}/${passed + failed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
