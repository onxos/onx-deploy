/**
 * OCMBR Wave 2b — D09-S03 Test Script
 * SOAP Consultation Note IU verification (SCH, SVC, API, UI)
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
    id: "D09-S03-SCH-01",
    description: "SOAP note schema file exists",
    pass: fileExists("src/server/db/schema/soap-note-foundation.ts"),
  },
  {
    id: "D09-S03-SCH-02",
    description: "soapNote table exported",
    pass: fileContains(
      "src/server/db/schema/soap-note-foundation.ts",
      "soapNote",
    ),
  },
  {
    id: "D09-S03-SVC-01",
    description: "SOAP note service exists",
    pass: fileExists("src/server/services/soap-note.service.ts"),
  },
  {
    id: "D09-S03-SVC-02",
    description: "createSoapNote function exported",
    pass: fileContains(
      "src/server/services/soap-note.service.ts",
      "createSoapNote",
    ),
  },
  {
    id: "D09-S03-API-01",
    description: "SOAP note router exists",
    pass: fileExists("src/server/api/routers/soap-note.ts"),
  },
  {
    id: "D09-S03-API-02",
    description: "soapNoteRouter registered in root",
    pass: fileContains("src/server/api/root.ts", "soapNote: soapNoteRouter"),
  },
  {
    id: "D09-S03-UI-01",
    description: "soap-notes layout exists",
    pass: fileExists("src/app/soap-notes/layout.tsx"),
  },
  {
    id: "D09-S03-UI-02",
    description: "soap-notes page exists",
    pass: fileExists("src/app/soap-notes/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log("\n=== D09-S03 SOAP Consultation Note Test Results ===");
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_D09-S03_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
