/**
 * OCMBR Wave 2 — D06-S02 Test Script
 * Insurance Policy IU verification (SCH, SVC, API, UI)
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
    id: "D06-S02-SCH-01",
    description: "insurance policy schema file exists",
    pass: fileExists("src/server/db/schema/insurance-policy-foundation.ts"),
  },
  {
    id: "D06-S02-SCH-02",
    description: "insurancePolicy table exported",
    pass: fileContains(
      "src/server/db/schema/insurance-policy-foundation.ts",
      "insurancePolicy",
    ),
  },
  {
    id: "D06-S02-SVC-01",
    description: "insurance policy service exists",
    pass: fileExists("src/server/services/insurance-policy.service.ts"),
  },
  {
    id: "D06-S02-SVC-02",
    description: "createInsurancePolicy function exported",
    pass: fileContains(
      "src/server/services/insurance-policy.service.ts",
      "createInsurancePolicy",
    ),
  },
  {
    id: "D06-S02-API-01",
    description: "insurance policy router exists",
    pass: fileExists("src/server/api/routers/insurance-policy.ts"),
  },
  {
    id: "D06-S02-API-02",
    description: "insurancePolicyRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "insurancePolicy: insurancePolicyRouter",
    ),
  },
  {
    id: "D06-S02-UI-01",
    description: "insurance-policies layout exists",
    pass: fileExists("src/app/insurance-policies/layout.tsx"),
  },
  {
    id: "D06-S02-UI-02",
    description: "insurance-policies page exists",
    pass: fileExists("src/app/insurance-policies/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log("\n=== D06-S02 Insurance Policy Test Results ===");
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_D06-S02_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
