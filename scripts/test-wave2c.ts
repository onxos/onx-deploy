/**
 * OCMBR Wave 2c — Test Script
 * D03-S04, D04-S05, D06-S04 IU verification
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
  // D03-S04 AP
  {
    id: "D03-S04-SCH-01",
    description: "AP schema file exists",
    pass: fileExists("src/server/db/schema/ap-foundation.ts"),
  },
  {
    id: "D03-S04-SVC-01",
    description: "AP service exists",
    pass: fileExists("src/server/services/ap.service.ts"),
  },
  {
    id: "D03-S04-API-01",
    description: "AP router exists",
    pass: fileExists("src/server/api/routers/ap.ts"),
  },
  {
    id: "D03-S04-API-02",
    description: "apRouter registered in root",
    pass: fileContains("src/server/api/root.ts", "ap: apRouter"),
  },
  {
    id: "D03-S04-UI-01",
    description: "AP page exists",
    pass: fileExists("src/app/ap/page.tsx"),
  },
  // D04-S05 GRN
  {
    id: "D04-S05-SCH-01",
    description: "GRN schema file exists",
    pass: fileExists("src/server/db/schema/grn-foundation.ts"),
  },
  {
    id: "D04-S05-SVC-01",
    description: "GRN service exists",
    pass: fileExists("src/server/services/grn.service.ts"),
  },
  {
    id: "D04-S05-API-01",
    description: "GRN router exists",
    pass: fileExists("src/server/api/routers/grn.ts"),
  },
  {
    id: "D04-S05-API-02",
    description: "grnRouter registered in root",
    pass: fileContains("src/server/api/root.ts", "grn: grnRouter"),
  },
  {
    id: "D04-S05-UI-01",
    description: "GRN page exists",
    pass: fileExists("src/app/grn/page.tsx"),
  },
  // D06-S04 Insurance Claim
  {
    id: "D06-S04-SCH-01",
    description: "insurance claim schema file exists",
    pass: fileExists("src/server/db/schema/insurance-claim-foundation.ts"),
  },
  {
    id: "D06-S04-SVC-01",
    description: "insurance claim service exists",
    pass: fileExists("src/server/services/insurance-claim.service.ts"),
  },
  {
    id: "D06-S04-API-01",
    description: "insurance claim router exists",
    pass: fileExists("src/server/api/routers/insurance-claim.ts"),
  },
  {
    id: "D06-S04-API-02",
    description: "insuranceClaimRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "insuranceClaim: insuranceClaimRouter",
    ),
  },
  {
    id: "D06-S04-UI-01",
    description: "insurance-claims page exists",
    pass: fileExists("src/app/insurance-claims/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log(
  "\n=== Wave 2c Systems Test Results (D03-S04, D04-S05, D06-S04) ===",
);
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_wave2c_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
