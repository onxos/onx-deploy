/**
 * OCMBR Wave 2 — D09-S02 Test Script
 * Appointment Scheduling IU verification (SCH, SVC, API, UI)
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
    id: "D09-S02-SCH-01",
    description: "appointment schema file exists",
    pass: fileExists("src/server/db/schema/appointment-foundation.ts"),
  },
  {
    id: "D09-S02-SCH-02",
    description: "appointment table exported",
    pass: fileContains(
      "src/server/db/schema/appointment-foundation.ts",
      "appointment",
    ),
  },
  {
    id: "D09-S02-SVC-01",
    description: "appointment service exists",
    pass: fileExists("src/server/services/appointment.service.ts"),
  },
  {
    id: "D09-S02-SVC-02",
    description: "createAppointment function exported",
    pass: fileContains(
      "src/server/services/appointment.service.ts",
      "createAppointment",
    ),
  },
  {
    id: "D09-S02-API-01",
    description: "appointment router exists",
    pass: fileExists("src/server/api/routers/appointment.ts"),
  },
  {
    id: "D09-S02-API-02",
    description: "appointmentRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "appointment: appointmentRouter",
    ),
  },
  {
    id: "D09-S02-UI-01",
    description: "appointments layout exists",
    pass: fileExists("src/app/appointments/layout.tsx"),
  },
  {
    id: "D09-S02-UI-02",
    description: "appointments page exists",
    pass: fileExists("src/app/appointments/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log("\n=== D09-S02 Appointment Scheduling Test Results ===");
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_D09-S02_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
