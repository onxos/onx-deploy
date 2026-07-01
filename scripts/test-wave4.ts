#!/usr/bin/env bun
/**
 * OCMBR Wave 4 — Verification Test Script
 *
 * Verifies all 5 systems × 4 IUs = 20 IUs
 * D10-S04 | D10-S05 | D10-S06 | D11-S01 | D11-S02
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
// D10-S04 — Lab Result History & Trends
// ============================================================
const D1004_SCH = "src/server/db/schema/lab-result-history-foundation.ts";
const D1004_SVC = "src/server/services/lab-result-history.service.ts";
const D1004_RTR = "src/server/api/routers/lab-result-history.ts";
const D1004_UI = "src/app/lab-result-history/page.tsx";

check("D10-S04", "D10-S04-IU-SCH", "Schema file exists", existsSync(D1004_SCH));
check(
  "D10-S04",
  "D10-S04-IU-SCH",
  "labReferenceRange table defined",
  fileContains(D1004_SCH, "labReferenceRange"),
);
check(
  "D10-S04",
  "D10-S04-IU-SVC",
  "Service file exists",
  existsSync(D1004_SVC),
);
check(
  "D10-S04",
  "D10-S04-IU-SVC",
  "createReferenceRange exported",
  fileContains(D1004_SVC, "createReferenceRange"),
);
check("D10-S04", "D10-S04-IU-API", "Router file exists", existsSync(D1004_RTR));
check(
  "D10-S04",
  "D10-S04-IU-API",
  "createReferenceRange procedure in router",
  fileContains(D1004_RTR, "createReferenceRange"),
);
check(
  "D10-S04",
  "D10-S04-IU-API",
  "labResultHistory registered in root",
  fileContains("src/server/api/root.ts", "labResultHistory"),
);
check("D10-S04", "D10-S04-IU-UI", "UI page exists", existsSync(D1004_UI));
check(
  "D10-S04",
  "D10-S04-IU-UI",
  "UI page has heading",
  fileContains(D1004_UI, "Lab Result History"),
);

// ============================================================
// D10-S05 — Imaging Request Module
// ============================================================
const D1005_SCH = "src/server/db/schema/imaging-request-foundation.ts";
const D1005_SVC = "src/server/services/imaging-request.service.ts";
const D1005_RTR = "src/server/api/routers/imaging-request.ts";
const D1005_UI = "src/app/imaging-requests/page.tsx";

check("D10-S05", "D10-S05-IU-SCH", "Schema file exists", existsSync(D1005_SCH));
check(
  "D10-S05",
  "D10-S05-IU-SCH",
  "imagingRequest table defined",
  fileContains(D1005_SCH, "imagingRequest"),
);
check(
  "D10-S05",
  "D10-S05-IU-SVC",
  "Service file exists",
  existsSync(D1005_SVC),
);
check(
  "D10-S05",
  "D10-S05-IU-SVC",
  "createImagingRequest exported",
  fileContains(D1005_SVC, "createImagingRequest"),
);
check("D10-S05", "D10-S05-IU-API", "Router file exists", existsSync(D1005_RTR));
check(
  "D10-S05",
  "D10-S05-IU-API",
  "create procedure in router",
  fileContains(D1005_RTR, "create:"),
);
check(
  "D10-S05",
  "D10-S05-IU-API",
  "imagingRequest registered in root",
  fileContains("src/server/api/root.ts", "imagingRequest"),
);
check("D10-S05", "D10-S05-IU-UI", "UI page exists", existsSync(D1005_UI));
check(
  "D10-S05",
  "D10-S05-IU-UI",
  "UI page has heading",
  fileContains(D1005_UI, "Imaging Requests"),
);

// ============================================================
// D10-S06 — DICOM Viewer Hooks
// ============================================================
const D1006_SCH = "src/server/db/schema/dicom-study-foundation.ts";
const D1006_SVC = "src/server/services/dicom-study.service.ts";
const D1006_RTR = "src/server/api/routers/dicom-study.ts";
const D1006_UI = "src/app/dicom-studies/page.tsx";

check("D10-S06", "D10-S06-IU-SCH", "Schema file exists", existsSync(D1006_SCH));
check(
  "D10-S06",
  "D10-S06-IU-SCH",
  "dicomStudy table defined",
  fileContains(D1006_SCH, "dicomStudy"),
);
check(
  "D10-S06",
  "D10-S06-IU-SVC",
  "Service file exists",
  existsSync(D1006_SVC),
);
check(
  "D10-S06",
  "D10-S06-IU-SVC",
  "createDicomStudy exported",
  fileContains(D1006_SVC, "createDicomStudy"),
);
check("D10-S06", "D10-S06-IU-API", "Router file exists", existsSync(D1006_RTR));
check(
  "D10-S06",
  "D10-S06-IU-API",
  "create procedure in router",
  fileContains(D1006_RTR, "create:"),
);
check(
  "D10-S06",
  "D10-S06-IU-API",
  "dicomStudy registered in root",
  fileContains("src/server/api/root.ts", "dicomStudy"),
);
check("D10-S06", "D10-S06-IU-UI", "UI page exists", existsSync(D1006_UI));
check(
  "D10-S06",
  "D10-S06-IU-UI",
  "UI page has heading",
  fileContains(D1006_UI, "DICOM Studies"),
);

// ============================================================
// D11-S01 — TeleVet Booking & Video Session
// ============================================================
const D1101_SCH = "src/server/db/schema/televet-session-foundation.ts";
const D1101_SVC = "src/server/services/televet-session.service.ts";
const D1101_RTR = "src/server/api/routers/televet-session.ts";
const D1101_UI = "src/app/televet-sessions/page.tsx";

check("D11-S01", "D11-S01-IU-SCH", "Schema file exists", existsSync(D1101_SCH));
check(
  "D11-S01",
  "D11-S01-IU-SCH",
  "televet_session table defined",
  fileContains(D1101_SCH, "televet_session"),
);
check(
  "D11-S01",
  "D11-S01-IU-SVC",
  "Service file exists",
  existsSync(D1101_SVC),
);
check(
  "D11-S01",
  "D11-S01-IU-SVC",
  "createSession exported",
  fileContains(D1101_SVC, "createSession"),
);
check("D11-S01", "D11-S01-IU-API", "Router file exists", existsSync(D1101_RTR));
check(
  "D11-S01",
  "D11-S01-IU-API",
  "create procedure in router",
  fileContains(D1101_RTR, "create:"),
);
check(
  "D11-S01",
  "D11-S01-IU-API",
  "telvetSession registered in root",
  fileContains("src/server/api/root.ts", "telvetSession"),
);
check("D11-S01", "D11-S01-IU-UI", "UI page exists", existsSync(D1101_UI));
check(
  "D11-S01",
  "D11-S01-IU-UI",
  "UI page has heading",
  fileContains(D1101_UI, "TeleVet Sessions"),
);

// ============================================================
// D11-S02 — TeleVet Medical Record Integration
// ============================================================
const D1102_SCH = "src/server/db/schema/televet-medical-note-foundation.ts";
const D1102_SVC = "src/server/services/televet-medical-note.service.ts";
const D1102_RTR = "src/server/api/routers/televet-medical-note.ts";
const D1102_UI = "src/app/televet-medical-notes/page.tsx";

check("D11-S02", "D11-S02-IU-SCH", "Schema file exists", existsSync(D1102_SCH));
check(
  "D11-S02",
  "D11-S02-IU-SCH",
  "televet_medical_note table defined",
  fileContains(D1102_SCH, "televet_medical_note"),
);
check(
  "D11-S02",
  "D11-S02-IU-SVC",
  "Service file exists",
  existsSync(D1102_SVC),
);
check(
  "D11-S02",
  "D11-S02-IU-SVC",
  "createMedicalNote exported",
  fileContains(D1102_SVC, "createMedicalNote"),
);
check("D11-S02", "D11-S02-IU-API", "Router file exists", existsSync(D1102_RTR));
check(
  "D11-S02",
  "D11-S02-IU-API",
  "create procedure in router",
  fileContains(D1102_RTR, "create:"),
);
check(
  "D11-S02",
  "D11-S02-IU-API",
  "telvetMedicalNote registered in root",
  fileContains("src/server/api/root.ts", "telvetMedicalNote"),
);
check("D11-S02", "D11-S02-IU-UI", "UI page exists", existsSync(D1102_UI));
check(
  "D11-S02",
  "D11-S02-IU-UI",
  "UI page has heading",
  fileContains(D1102_UI, "TeleVet Medical Notes"),
);

// ============================================================
// Print results
// ============================================================
console.log("\n=== Wave 4 Verification ===\n");

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
