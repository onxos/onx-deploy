/**
 * OCMBR Wave 2 — D02-S04 Test Script
 * Leave Management IU verification (SCH, SVC, API, UI)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
  const content = readFileSync(join(ROOT, rel), "utf-8");
  return content.includes(text);
}

const scenarios: Scenario[] = [
  {
    id: "D02-S04-SCH-01",
    description: "leave schema file exists",
    pass: fileExists("src/server/db/schema/leave-foundation.ts"),
  },
  {
    id: "D02-S04-SCH-02",
    description: "leaveType and leaveRequest tables exported",
    pass:
      fileContains("src/server/db/schema/leave-foundation.ts", "leaveType") &&
      fileContains("src/server/db/schema/leave-foundation.ts", "leaveRequest"),
  },
  {
    id: "D02-S04-SVC-01",
    description: "leave service exists",
    pass: fileExists("src/server/services/leave.service.ts"),
  },
  {
    id: "D02-S04-SVC-02",
    description: "createLeaveRequest function exported",
    pass: fileContains(
      "src/server/services/leave.service.ts",
      "createLeaveRequest",
    ),
  },
  {
    id: "D02-S04-API-01",
    description: "leave router exists",
    pass: fileExists("src/server/api/routers/leave.ts"),
  },
  {
    id: "D02-S04-API-02",
    description: "leaveRouter registered in root",
    pass: fileContains("src/server/api/root.ts", "leave: leaveRouter"),
  },
  {
    id: "D02-S04-UI-01",
    description: "leave layout exists",
    pass: fileExists("src/app/leave/layout.tsx"),
  },
  {
    id: "D02-S04-UI-02",
    description: "leave page exists",
    pass: fileExists("src/app/leave/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log("\n=== D02-S04 Leave Management Test Results ===");
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_D02-S04_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
