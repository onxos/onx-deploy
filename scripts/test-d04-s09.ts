/**
 * OCMBR Wave 2 — D04-S09 Test Script
 * Approval Workflow IU verification (SCH, SVC, API, UI)
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
    id: "D04-S09-SCH-01",
    description: "approval schema file exists",
    pass: fileExists("src/server/db/schema/approval-foundation.ts"),
  },
  {
    id: "D04-S09-SCH-02",
    description: "approvalWorkflow and approvalRecord tables exported",
    pass:
      fileContains(
        "src/server/db/schema/approval-foundation.ts",
        "approvalWorkflow",
      ) &&
      fileContains(
        "src/server/db/schema/approval-foundation.ts",
        "approvalRecord",
      ),
  },
  {
    id: "D04-S09-SVC-01",
    description: "approval service exists",
    pass: fileExists("src/server/services/approval.service.ts"),
  },
  {
    id: "D04-S09-SVC-02",
    description: "processApproval function exported",
    pass: fileContains(
      "src/server/services/approval.service.ts",
      "processApproval",
    ),
  },
  {
    id: "D04-S09-API-01",
    description: "approval router exists",
    pass: fileExists("src/server/api/routers/approval.ts"),
  },
  {
    id: "D04-S09-API-02",
    description: "approvalRouter registered in root",
    pass: fileContains("src/server/api/root.ts", "approval: approvalRouter"),
  },
  {
    id: "D04-S09-UI-01",
    description: "approval-workflows layout exists",
    pass: fileExists("src/app/approval-workflows/layout.tsx"),
  },
  {
    id: "D04-S09-UI-02",
    description: "approval-workflows page exists",
    pass: fileExists("src/app/approval-workflows/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log("\n=== D04-S09 Approval Workflow Test Results ===");
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_D04-S09_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
