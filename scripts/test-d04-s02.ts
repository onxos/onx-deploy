/**
 * OCMBR Wave 2 — D04-S02 Test Script
 * Purchase Requisition IU verification (SCH, SVC, API, UI)
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
    id: "D04-S02-SCH-01",
    description: "procurement PR schema file exists",
    pass: fileExists("src/server/db/schema/procurement-pr-foundation.ts"),
  },
  {
    id: "D04-S02-SCH-02",
    description: "purchaseRequisition and prLine tables exported",
    pass:
      fileContains(
        "src/server/db/schema/procurement-pr-foundation.ts",
        "purchaseRequisition",
      ) &&
      fileContains(
        "src/server/db/schema/procurement-pr-foundation.ts",
        "prLine",
      ),
  },
  {
    id: "D04-S02-SVC-01",
    description: "procurement PR service exists",
    pass: fileExists("src/server/services/procurement-pr.service.ts"),
  },
  {
    id: "D04-S02-SVC-02",
    description: "createPurchaseRequisition function exported",
    pass: fileContains(
      "src/server/services/procurement-pr.service.ts",
      "createPurchaseRequisition",
    ),
  },
  {
    id: "D04-S02-API-01",
    description: "procurement PR router exists",
    pass: fileExists("src/server/api/routers/procurement-pr.ts"),
  },
  {
    id: "D04-S02-API-02",
    description: "procurementPrRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "procurementPr: procurementPrRouter",
    ),
  },
  {
    id: "D04-S02-UI-01",
    description: "procurement-pr layout exists",
    pass: fileExists("src/app/procurement-pr/layout.tsx"),
  },
  {
    id: "D04-S02-UI-02",
    description: "procurement-pr page exists",
    pass: fileExists("src/app/procurement-pr/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log("\n=== D04-S02 Purchase Requisition Test Results ===");
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_D04-S02_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
