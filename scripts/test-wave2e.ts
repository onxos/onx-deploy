/**
 * OCMBR Wave 2e — Test Script
 * D08-S02, D08-S05, D08-S09, D02-S02, D07-S02 IU verification
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
  // D08-S02 Service & Product Catalogue
  {
    id: "D08-S02-SCH-01",
    description: "Catalogue schema file exists",
    pass: fileExists("src/server/db/schema/catalogue-foundation.ts"),
  },
  {
    id: "D08-S02-SVC-01",
    description: "Catalogue service exists",
    pass: fileExists("src/server/services/catalogue.service.ts"),
  },
  {
    id: "D08-S02-API-01",
    description: "Catalogue router exists",
    pass: fileExists("src/server/api/routers/catalogue.ts"),
  },
  {
    id: "D08-S02-API-02",
    description: "catalogueRouter registered in root",
    pass: fileContains("src/server/api/root.ts", "catalogue: catalogueRouter"),
  },
  {
    id: "D08-S02-UI-01",
    description: "Catalogue page exists",
    pass: fileExists("src/app/catalogue/page.tsx"),
  },
  // D08-S05 Cash Reconciliation
  {
    id: "D08-S05-SCH-01",
    description: "Cash reconciliation schema file exists",
    pass: fileExists("src/server/db/schema/cash-reconciliation-foundation.ts"),
  },
  {
    id: "D08-S05-SVC-01",
    description: "Cash reconciliation service exists",
    pass: fileExists("src/server/services/cash-reconciliation.service.ts"),
  },
  {
    id: "D08-S05-API-01",
    description: "Cash reconciliation router exists",
    pass: fileExists("src/server/api/routers/cash-reconciliation.ts"),
  },
  {
    id: "D08-S05-API-02",
    description: "cashReconciliationRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "cashReconciliation: cashReconciliationRouter",
    ),
  },
  {
    id: "D08-S05-UI-01",
    description: "Cash reconciliation page exists",
    pass: fileExists("src/app/cash-reconciliation/page.tsx"),
  },
  // D08-S09 Shift Management
  {
    id: "D08-S09-SCH-01",
    description: "Shift management schema file exists",
    pass: fileExists("src/server/db/schema/shift-management-foundation.ts"),
  },
  {
    id: "D08-S09-SVC-01",
    description: "Shift management service exists",
    pass: fileExists("src/server/services/shift-management.service.ts"),
  },
  {
    id: "D08-S09-API-01",
    description: "Shift management router exists",
    pass: fileExists("src/server/api/routers/shift-management.ts"),
  },
  {
    id: "D08-S09-API-02",
    description: "shiftManagementRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "shiftManagement: shiftManagementRouter",
    ),
  },
  {
    id: "D08-S09-UI-01",
    description: "Shift management page exists",
    pass: fileExists("src/app/shift-management/page.tsx"),
  },
  // D02-S02 Recruitment & Onboarding
  {
    id: "D02-S02-SCH-01",
    description: "Recruitment schema file exists",
    pass: fileExists("src/server/db/schema/recruitment-foundation.ts"),
  },
  {
    id: "D02-S02-SVC-01",
    description: "Recruitment service exists",
    pass: fileExists("src/server/services/recruitment.service.ts"),
  },
  {
    id: "D02-S02-API-01",
    description: "Recruitment router exists",
    pass: fileExists("src/server/api/routers/recruitment.ts"),
  },
  {
    id: "D02-S02-API-02",
    description: "recruitmentRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "recruitment: recruitmentRouter",
    ),
  },
  {
    id: "D02-S02-UI-01",
    description: "Recruitment page exists",
    pass: fileExists("src/app/recruitment/page.tsx"),
  },
  // D07-S02 Pet Profile
  {
    id: "D07-S02-SCH-01",
    description: "Pet profile schema file exists",
    pass: fileExists("src/server/db/schema/pet-profile-foundation.ts"),
  },
  {
    id: "D07-S02-SVC-01",
    description: "Pet profile service exists",
    pass: fileExists("src/server/services/pet-profile.service.ts"),
  },
  {
    id: "D07-S02-API-01",
    description: "Pet profile router exists",
    pass: fileExists("src/server/api/routers/pet-profile.ts"),
  },
  {
    id: "D07-S02-API-02",
    description: "petProfileRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "petProfile: petProfileRouter",
    ),
  },
  {
    id: "D07-S02-UI-01",
    description: "Pet profiles page exists",
    pass: fileExists("src/app/pet-profiles/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log(
  "\n=== Wave 2e Systems Test Results (D08-S02, D08-S05, D08-S09, D02-S02, D07-S02) ===",
);
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_wave2e_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
