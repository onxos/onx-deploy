/**
 * OCMBR Wave 2d — Test Script
 * D09-S04, D03-S05, D04-S06, D09-S06 IU verification
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
  // D09-S04 Treatment Plan
  {
    id: "D09-S04-SCH-01",
    description: "Treatment plan schema file exists",
    pass: fileExists("src/server/db/schema/treatment-plan-foundation.ts"),
  },
  {
    id: "D09-S04-SVC-01",
    description: "Treatment plan service exists",
    pass: fileExists("src/server/services/treatment-plan.service.ts"),
  },
  {
    id: "D09-S04-API-01",
    description: "Treatment plan router exists",
    pass: fileExists("src/server/api/routers/treatment-plan.ts"),
  },
  {
    id: "D09-S04-API-02",
    description: "treatmentPlanRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "treatmentPlan: treatmentPlanRouter",
    ),
  },
  {
    id: "D09-S04-UI-01",
    description: "Treatment plans page exists",
    pass: fileExists("src/app/treatment-plans/page.tsx"),
  },
  // D03-S05 Bank Reconciliation
  {
    id: "D03-S05-SCH-01",
    description: "Bank reconciliation schema file exists",
    pass: fileExists("src/server/db/schema/bank-reconciliation-foundation.ts"),
  },
  {
    id: "D03-S05-SVC-01",
    description: "Bank reconciliation service exists",
    pass: fileExists("src/server/services/bank-reconciliation.service.ts"),
  },
  {
    id: "D03-S05-API-01",
    description: "Bank reconciliation router exists",
    pass: fileExists("src/server/api/routers/bank-reconciliation.ts"),
  },
  {
    id: "D03-S05-API-02",
    description: "bankReconciliationRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "bankReconciliation: bankReconciliationRouter",
    ),
  },
  {
    id: "D03-S05-UI-01",
    description: "Bank reconciliation page exists",
    pass: fileExists("src/app/bank-reconciliation/page.tsx"),
  },
  // D04-S06 Supplier Returns
  {
    id: "D04-S06-SCH-01",
    description: "Supplier return schema file exists",
    pass: fileExists("src/server/db/schema/supplier-return-foundation.ts"),
  },
  {
    id: "D04-S06-SVC-01",
    description: "Supplier return service exists",
    pass: fileExists("src/server/services/supplier-return.service.ts"),
  },
  {
    id: "D04-S06-API-01",
    description: "Supplier return router exists",
    pass: fileExists("src/server/api/routers/supplier-return.ts"),
  },
  {
    id: "D04-S06-API-02",
    description: "supplierReturnRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "supplierReturn: supplierReturnRouter",
    ),
  },
  {
    id: "D04-S06-UI-01",
    description: "Supplier returns page exists",
    pass: fileExists("src/app/supplier-returns/page.tsx"),
  },
  // D09-S06 Prescription
  {
    id: "D09-S06-SCH-01",
    description: "Prescription schema file exists",
    pass: fileExists("src/server/db/schema/prescription-foundation.ts"),
  },
  {
    id: "D09-S06-SVC-01",
    description: "Prescription service exists",
    pass: fileExists("src/server/services/prescription.service.ts"),
  },
  {
    id: "D09-S06-API-01",
    description: "Prescription router exists",
    pass: fileExists("src/server/api/routers/prescription.ts"),
  },
  {
    id: "D09-S06-API-02",
    description: "prescriptionRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "prescription: prescriptionRouter",
    ),
  },
  {
    id: "D09-S06-UI-01",
    description: "Prescriptions page exists",
    pass: fileExists("src/app/prescriptions/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log(
  "\n=== Wave 2d Systems Test Results (D09-S04, D03-S05, D04-S06, D09-S06) ===",
);
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_wave2d_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
