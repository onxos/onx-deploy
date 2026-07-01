/**
 * OCMBR Wave 2 — D02-S03 Test Script
 * Attendance & Timesheet IU verification (SCH, SVC, API, UI)
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const EVIDENCE_DIR = join(ROOT, "EVIDENCE", "OCMBR-005", "20260701", "test");

interface Scenario {
  id: string;
  description: string;
  pass: boolean;
}

function fileExists(rel: string): boolean {
  return existsSync(join(ROOT, rel));
}

function fileContains(rel: string, text: string): boolean {
  if (!fileExists(rel)) return false;
  const content = require("node:fs").readFileSync(join(ROOT, rel), "utf-8");
  return content.includes(text);
}

const scenarios: Scenario[] = [
  {
    id: "D02-S03-SCH-01",
    description: "attendance schema file exists",
    pass: fileExists("src/server/db/schema/attendance-foundation.ts"),
  },
  {
    id: "D02-S03-SCH-02",
    description: "timesheetEntry table exported",
    pass: fileContains(
      "src/server/db/schema/attendance-foundation.ts",
      "timesheetEntry",
    ),
  },
  {
    id: "D02-S03-SVC-01",
    description: "attendance service exists",
    pass: fileExists("src/server/services/attendance.service.ts"),
  },
  {
    id: "D02-S03-SVC-02",
    description: "createTimesheetEntry function exported",
    pass: fileContains(
      "src/server/services/attendance.service.ts",
      "createTimesheetEntry",
    ),
  },
  {
    id: "D02-S03-API-01",
    description: "attendance router exists",
    pass: fileExists("src/server/api/routers/attendance.ts"),
  },
  {
    id: "D02-S03-API-02",
    description: "attendanceRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "attendance: attendanceRouter",
    ),
  },
  {
    id: "D02-S03-UI-01",
    description: "attendance layout exists",
    pass: fileExists("src/app/attendance/layout.tsx"),
  },
  {
    id: "D02-S03-UI-02",
    description: "attendance page exists",
    pass: fileExists("src/app/attendance/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log("\n=== D02-S03 Attendance & Timesheet Test Results ===");
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_D02-S03_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
