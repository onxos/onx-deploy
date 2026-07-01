/**
 * OCMBR Wave 2 — D09-S05 Test Script
 * Vaccination Record IU verification (SCH, SVC, API, UI)
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
    id: "D09-S05-SCH-01",
    description: "vaccination schema file exists",
    pass: fileExists("src/server/db/schema/vaccination-foundation.ts"),
  },
  {
    id: "D09-S05-SCH-02",
    description: "vaccinationRecord table exported",
    pass: fileContains(
      "src/server/db/schema/vaccination-foundation.ts",
      "vaccinationRecord",
    ),
  },
  {
    id: "D09-S05-SVC-01",
    description: "vaccination service exists",
    pass: fileExists("src/server/services/vaccination.service.ts"),
  },
  {
    id: "D09-S05-SVC-02",
    description: "recordVaccination function exported",
    pass: fileContains(
      "src/server/services/vaccination.service.ts",
      "recordVaccination",
    ),
  },
  {
    id: "D09-S05-API-01",
    description: "vaccination router exists",
    pass: fileExists("src/server/api/routers/vaccination.ts"),
  },
  {
    id: "D09-S05-API-02",
    description: "vaccinationRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "vaccination: vaccinationRouter",
    ),
  },
  {
    id: "D09-S05-UI-01",
    description: "vaccinations layout exists",
    pass: fileExists("src/app/vaccinations/layout.tsx"),
  },
  {
    id: "D09-S05-UI-02",
    description: "vaccinations page exists",
    pass: fileExists("src/app/vaccinations/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log("\n=== D09-S05 Vaccination Record Test Results ===");
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_D09-S05_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
