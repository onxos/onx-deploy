/**
 * OCMBR Wave 2 — D03-S03 Test Script
 * Accounts Receivable IU verification (SCH, SVC, API, UI)
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
    id: "D03-S03-SCH-01",
    description: "AR schema file exists",
    pass: fileExists("src/server/db/schema/ar-foundation.ts"),
  },
  {
    id: "D03-S03-SCH-02",
    description: "arInvoice and arPayment tables exported",
    pass:
      fileContains("src/server/db/schema/ar-foundation.ts", "arInvoice") &&
      fileContains("src/server/db/schema/ar-foundation.ts", "arPayment"),
  },
  {
    id: "D03-S03-SVC-01",
    description: "AR service exists",
    pass: fileExists("src/server/services/ar.service.ts"),
  },
  {
    id: "D03-S03-SVC-02",
    description: "recordPayment function exported",
    pass: fileContains("src/server/services/ar.service.ts", "recordPayment"),
  },
  {
    id: "D03-S03-API-01",
    description: "AR router exists",
    pass: fileExists("src/server/api/routers/ar.ts"),
  },
  {
    id: "D03-S03-API-02",
    description: "arRouter registered in root",
    pass: fileContains("src/server/api/root.ts", "ar: arRouter"),
  },
  {
    id: "D03-S03-UI-01",
    description: "AR layout exists",
    pass: fileExists("src/app/ar/layout.tsx"),
  },
  {
    id: "D03-S03-UI-02",
    description: "AR page exists",
    pass: fileExists("src/app/ar/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log("\n=== D03-S03 Accounts Receivable Test Results ===");
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_D03-S03_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
